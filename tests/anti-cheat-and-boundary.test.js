import { describe, it, expect } from "vitest";
import {
  getPhysicalLimitsForExercise,
  clampSetInput,
  validateSessionVolume,
  clampSessionHonorPoints,
  clampStrengthRatios,
  MAX_SESSION_HONOR_POINTS,
  BIOMECHANICAL_LIMITS
} from "../src/engine/antiCheatEngine.js";

describe("Anti-Cheat & Physical Biomechanics Limit Engine", () => {
  describe("1. Physical limits mapping by exercise type", () => {
    it("maps deadlift exercises to world record ~501kg limit", () => {
      const limit = getPhysicalLimitsForExercise("罗马尼亚硬拉 (RDL)", "腿部");
      expect(limit.maxWeight).toBe(501);
      expect(limit.maxReps).toBe(100);
    });

    it("maps squat and leg press to ~490kg limit", () => {
      const limit1 = getPhysicalLimitsForExercise("杠铃后深蹲", "腿部");
      const limit2 = getPhysicalLimitsForExercise("哈克深蹲 / 倒蹬腿举", "腿部");
      expect(limit1.maxWeight).toBe(490);
      expect(limit2.maxWeight).toBe(490);
    });

    it("maps barbell bench press to ~355kg limit", () => {
      const limit = getPhysicalLimitsForExercise("平板杠铃卧推", "胸部");
      expect(limit.maxWeight).toBe(355);
    });

    it("maps heavy dumbbell exercises to ~90kg single dumbbell limit", () => {
      const limit = getPhysicalLimitsForExercise("上斜哑铃卧推", "胸部");
      expect(limit.maxWeight).toBe(90);
    });

    it("maps isolated dumbbell/cable exercises to ~45kg limit", () => {
      const limit = getPhysicalLimitsForExercise("哑铃侧平举", "肩部");
      expect(limit.maxWeight).toBe(45);
    });

    it("maps cable and pulley machines to ~200kg stack limit", () => {
      const limit = getPhysicalLimitsForExercise("高位下拉 (器械)", "背部");
      expect(limit.maxWeight).toBe(200);
    });

    it("falls back to general default 350kg for unknown exercises", () => {
      const limit = getPhysicalLimitsForExercise("太空负重训练", "综合");
      expect(limit.maxWeight).toBe(350);
    });
  });

  describe("2. Single Set Clamping (clampSetInput)", () => {
    it("preserves reasonable workout inputs without clamping", () => {
      const result = clampSetInput("平板杠铃卧推", 100, 8, "胸部");
      expect(result.wasClamped).toBe(false);
      expect(result.weight).toBe(100);
      expect(result.reps).toBe(8);
      expect(result.reason).toBeNull();
    });

    it("clamps absurd weight input (e.g. single-hand dumbbell 500kg)", () => {
      const result = clampSetInput("上斜哑铃卧推", 500, 10, "胸部");
      expect(result.wasClamped).toBe(true);
      expect(result.weight).toBe(90); // Clamped to 90kg max
      expect(result.originalWeight).toBe(500);
      expect(result.reason).toContain("重量超出生理上限");
    });

    it("clamps absurd reps input (e.g. 500 reps in one set)", () => {
      const result = clampSetInput("杠铃深蹲", 100, 500, "腿部");
      expect(result.wasClamped).toBe(true);
      expect(result.reps).toBe(100); // Clamped to 100 reps max
      expect(result.originalReps).toBe(500);
      expect(result.reason).toContain("单组次数超出上限");
    });

    it("handles negative and NaN inputs safely", () => {
      const result1 = clampSetInput("杠铃深蹲", -50, -5, "腿部");
      expect(result1.weight).toBe(0);
      expect(result1.reps).toBe(0);

      const result2 = clampSetInput("杠铃深蹲", NaN, undefined, "腿部");
      expect(result2.weight).toBe(0);
      expect(result2.reps).toBe(0);
    });
  });

  describe("3. Session-Wide Volume Validation (validateSessionVolume)", () => {
    it("safely sanitizes multiple exercises and sets", () => {
      const exercises = [
        {
          name: "上斜哑铃卧推",
          category: "胸部",
          sets: [
            { weight: 30, reps: 10, done: true },
            { weight: 600, reps: 10, done: true } // Rogue set
          ]
        },
        {
          name: "哑铃侧平举",
          category: "肩部",
          sets: [
            { weight: 10, reps: 15, done: true },
            { weight: 10, reps: 200, done: true } // Rogue reps
          ]
        }
      ];

      const validation = validateSessionVolume(exercises);
      expect(validation.clampedSetsCount).toBe(2);
      expect(validation.totalSets).toBe(4);
      
      // Set 1: 30 * 10 = 300
      // Set 2: clamped 90 * 10 = 900
      // Set 3: 10 * 15 = 150
      // Set 4: 10 * clamped 100 = 1000
      // Total sanitized volume = 300 + 900 + 150 + 1000 = 2350 kg (not 6000 + 2000 = 8000+)
      expect(validation.totalVolume).toBe(2350);
    });

    it("ignores uncompleted sets in volume computation", () => {
      const exercises = [
        {
          name: "深蹲",
          category: "腿部",
          sets: [
            { weight: 100, reps: 5, done: true },
            { weight: 100, reps: 5, done: false } // Not done
          ]
        }
      ];

      const validation = validateSessionVolume(exercises);
      expect(validation.totalVolume).toBe(500);
      expect(validation.totalSets).toBe(1);
    });

    it("handles null / empty / malformed exercise arrays without throwing", () => {
      expect(validateSessionVolume(null).totalVolume).toBe(0);
      expect(validateSessionVolume(undefined).totalVolume).toBe(0);
      expect(validateSessionVolume([null, {}]).totalVolume).toBe(0);
    });
  });

  describe("4. Honor Score & 1RM Ratio Protections", () => {
    it("caps single-session points earned to MAX_SESSION_HONOR_POINTS (100)", () => {
      expect(clampSessionHonorPoints(35)).toBe(35);
      expect(clampSessionHonorPoints(98)).toBe(98);
      expect(clampSessionHonorPoints(500)).toBe(100);
      expect(clampSessionHonorPoints(-10)).toBe(0);
    });

    it("clamps supernatural strength ratios to biological caps", () => {
      const ratios = clampStrengthRatios({
        maxBenchRatio: 12.5, // 12.5x bodyweight is absurd
        maxSquatRatio: 8.0,
        maxDeadliftRatio: 9.0
      });

      expect(ratios.maxBenchRatio).toBe(3.5);
      expect(ratios.maxSquatRatio).toBe(4.5);
      expect(ratios.maxDeadliftRatio).toBe(5.0);
    });
  });
});

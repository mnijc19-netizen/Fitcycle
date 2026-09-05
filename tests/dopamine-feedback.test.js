import { describe, expect, it } from "vitest";
import {
  calculateSupercompensationStatus,
  calculateTierAdvancement,
  calculateTonnageMetaphor,
  SUPERCOMPENSATION_STAGES,
  TIERS
} from "../src/engine/dopamineFeedbackEngine.js";
import {
  aiSession,
  clearAIConnection,
  openAICoachWithContext
} from "../src/ai/aiSession.js";
import { buildSystemPrompt } from "../src/ai/assistantRuntime.js";
import { store } from "../src/store/fitnessStore.js";

describe("dopamineFeedbackEngine & Instant AI Coach Context", () => {
  describe("calculateTonnageMetaphor", () => {
    it("converts 5,200kg to 5.2吨 (3.5 辆家用轿车)", () => {
      const result = calculateTonnageMetaphor(5200);
      expect(result.tonnage).toBe(5.2);
      expect(result.formattedTonnage).toBe("5.2 吨");
      expect(result.metaphorName).toBe("家用轿车");
      expect(result.multiplier).toBe(3.5);
      expect(result.icon).toBe("🚗");
      expect(result.description).toContain("3.5 辆家用轿车");
    });

    it("converts 12,000kg to 12吨 (2.4 头成年非洲大象)", () => {
      const result = calculateTonnageMetaphor(12000);
      expect(result.tonnage).toBe(12);
      expect(result.formattedTonnage).toBe("12 吨");
      expect(result.metaphorName).toBe("成年非洲大象");
      expect(result.multiplier).toBe(2.4);
      expect(result.icon).toBe("🐘");
      expect(result.description).toContain("2.4 头成年非洲大象");
    });

    it("handles 0kg and negative weights gracefully", () => {
      const zero = calculateTonnageMetaphor(0);
      expect(zero.tonnage).toBe(0);
      expect(zero.formattedTonnage).toBe("0 吨");

      const neg = calculateTonnageMetaphor(-100);
      expect(neg.tonnage).toBe(0);
    });
  });

  describe("calculateSupercompensationStatus", () => {
    const now = 1757120000000;

    it("stage acute (0-24h): enforces zero decay points and safe recovery", () => {
      const lastWorkout = now - 10 * 3600 * 1000; // 10h ago
      const status = calculateSupercompensationStatus(lastWorkout, now);

      expect(status.stage).toBe(SUPERCOMPENSATION_STAGES.ACUTE);
      expect(status.hoursElapsed).toBe(10);
      expect(status.isSafeRecoveryWindow).toBe(true);
      expect(status.decayPenalty).toBe(0);
      expect(status.advice).toContain("0~72h 处于宪法免责安全期");
    });

    it("stage synthesis (24-48h): glycogen reload and zero decay points", () => {
      const lastWorkout = now - 32 * 3600 * 1000; // 32h ago
      const status = calculateSupercompensationStatus(lastWorkout, now);

      expect(status.stage).toBe(SUPERCOMPENSATION_STAGES.SYNTHESIS);
      expect(status.hoursElapsed).toBe(32);
      expect(status.isSafeRecoveryWindow).toBe(true);
      expect(status.decayPenalty).toBe(0);
      expect(status.advice).toContain("0~72h 严禁扣减战力分");
    });

    it("stage supercompensation (48-72h): peak performance window", () => {
      const lastWorkout = now - 60 * 3600 * 1000; // 60h ago
      const status = calculateSupercompensationStatus(lastWorkout, now);

      expect(status.stage).toBe(SUPERCOMPENSATION_STAGES.SUPERCOMPENSATION);
      expect(status.hoursElapsed).toBe(60);
      expect(status.isSafeRecoveryWindow).toBe(true);
      expect(status.decayPenalty).toBe(0);
      expect(status.advice).toContain("超量恢复巅峰");
    });

    it("stage ready (>72h): ready to train", () => {
      const lastWorkout = now - 85 * 3600 * 1000; // 85h ago
      const status = calculateSupercompensationStatus(lastWorkout, now);

      expect(status.stage).toBe(SUPERCOMPENSATION_STAGES.READY);
      expect(status.hoursElapsed).toBe(85);
      expect(status.isSafeRecoveryWindow).toBe(false);
    });

    it("handles null/missing timestamp gracefully", () => {
      const status = calculateSupercompensationStatus(null);
      expect(status.stage).toBe(SUPERCOMPENSATION_STAGES.READY);
      expect(status.progressPercent).toBe(100);
      expect(status.isSafeRecoveryWindow).toBe(true);
    });
  });

  describe("calculateTierAdvancement", () => {
    it("detects level up when crossing tier threshold (e.g. 280 -> 320, Tier 1 to Tier 2)", () => {
      const result = calculateTierAdvancement(320, 50); // Previous: 270 (Tier 1), Current: 320 (Tier 2)
      expect(result.previousScore).toBe(270);
      expect(result.currentScore).toBe(320);
      expect(result.previousTier.tier).toBe(1);
      expect(result.currentTier.tier).toBe(2);
      expect(result.hasLeveledUp).toBe(true);
      expect(result.currentPointsInTier).toBe(20);
      expect(result.pointsNeededForNextTier).toBe(380);
    });

    it("calculates progression within the same tier", () => {
      const result = calculateTierAdvancement(850, 40); // Tier 3 (700-1199)
      expect(result.previousScore).toBe(810);
      expect(result.currentScore).toBe(850);
      expect(result.previousTier.tier).toBe(3);
      expect(result.currentTier.tier).toBe(3);
      expect(result.hasLeveledUp).toBe(false);
      expect(result.currentPointsInTier).toBe(150);
      expect(result.pointsNeededForNextTier).toBe(350);
    });

    it("handles apex tier (Tier 7, 2900+)", () => {
      const result = calculateTierAdvancement(3100, 100);
      expect(result.currentTier.tier).toBe(7);
      expect(result.progressPercent).toBe(100);
      expect(result.pointsNeededForNextTier).toBe(0);
    });
  });

  describe("openAICoachWithContext & dynamic system prompt", () => {
    it("invokes AI coach with user profile and exercise context in 1 click", () => {
      clearAIConnection();
      store.settings.userHeight = 180;
      store.settings.userWeight = 78;
      store.settings.strengthLevel = "intermediate";
      store.settings.trainingGoal = "hypertrophy";

      const exercise = {
        name: "上斜哑铃卧推",
        englishName: "Incline Dumbbell Press",
        category: "胸部",
        target: "胸大肌上束 (锁骨头)",
        scienceDetail: "上胸之王，拉伸感优异。"
      };

      const result = openAICoachWithContext({
        prompt: "斜板角度调到多少度最刺激上胸？",
        autoRun: true,
        exercise
      });

      expect(result.success).toBe(true);
      expect(aiSession.drawerOpen).toBe(true);
      expect(aiSession.pendingAutoRun).toBe(true);

      expect(aiSession.apiMessages).toHaveLength(1);
      const apiMsg = aiSession.apiMessages[0];
      expect(apiMsg.content).toContain("180cm");
      expect(apiMsg.content).toContain("78kg");
      expect(apiMsg.content).toContain("上斜哑铃卧推");
      expect(apiMsg.content).toContain("斜板角度调到多少度最刺激上胸？");

      expect(aiSession.conversation).toHaveLength(1);
      expect(aiSession.conversation[0].text).toContain("斜板角度调到多少度最刺激上胸？");
    });

    it("buildSystemPrompt injects user physiological metrics into AI instructions", () => {
      const prompt = buildSystemPrompt({
        userHeight: 178,
        userWeight: 75,
        strengthLevel: "advanced",
        trainingGoal: "strength"
      });

      expect(prompt).toContain("178cm");
      expect(prompt).toContain("75kg");
      expect(prompt).toContain("高阶健力");
      expect(prompt).toContain("纯力量突破");
    });
  });
});

import { describe, expect, it } from "vitest";
import {
  recognizeMachineByQuery,
  extractQueryFeatures,
  FEATURE_CATEGORIES
} from "../src/engine/machineRecognitionEngine.js";
import {
  resolveExercise,
  getExerciseMemoryPool,
  getExerciseHistoricalPrefill
} from "../src/engine/exerciseMemoryEngine.js";
import {
  calculateTonnageMetaphor,
  calculateSupercompensationStatus,
  calculateTierAdvancement,
  SUPERCOMPENSATION_STAGES
} from "../src/engine/dopamineFeedbackEngine.js";
import { DEFAULT_EXERCISES } from "../src/data/defaultPlans.js";
import {
  store,
  moveActiveWorkoutExercise,
  pinActiveWorkoutExercise,
  addExerciseToActiveWorkout
} from "../src/store/fitnessStore.js";
import { openAICoachWithContext } from "../src/ai/aiSession.js";

describe("ADVERSARIAL SUITE — Milestone 1 Stress Testing", () => {
  // =========================================================================
  // VECTOR 1: Machine Recognition Adversarial Testing
  // =========================================================================
  describe("Vector 1: Machine Recognition Adversarial Testing", () => {
    it("never violates confidence bounds (0.0 <= conf <= 1.0, NaN-free) across all edge inputs", () => {
      const inputs = [
        "",
        "   ",
        "\n\t  ",
        "????",
        ",,,,,,,",
        ".........",
        "!@#$%^&*()_+",
        "，，，。！？；：",
        "😀😁😂🤣😃😄",
        "🏋️‍♂️💪🔥",
        "aslkdjfhlaksjdfhalksjdfh",
        "1234567890",
        "a",
        "推",
        "器械",
        "a".repeat(5000),
        "推".repeat(1000),
        null,
        undefined
      ];

      for (const input of inputs) {
        const results = recognizeMachineByQuery(input, DEFAULT_EXERCISES);
        expect(Array.isArray(results)).toBe(true);
        for (const res of results) {
          expect(typeof res.confidence).toBe("number");
          expect(isNaN(res.confidence)).toBe(false);
          expect(res.confidence).toBeGreaterThanOrEqual(0.0);
          expect(res.confidence).toBeLessThanOrEqual(1.0);
          expect(res.exercise).toBeDefined();
          expect(res.exercise.id).toBeDefined();
          expect(Array.isArray(res.matchedFeatures)).toBe(true);
          expect(typeof res.reasoning).toBe("string");
        }
      }
    });

    it("stress-tests 36 colloquial variations for key gym equipment (>= 85% accuracy)", () => {
      const colloquialCases = [
        { query: "坐着手往前推的黄色杠杆器械", check: r => r.some(x => x.name.includes("推胸") && x.name.includes("器械")) },
        { query: "一个坐着推胸的机器", check: r => r.some(x => x.name.includes("推胸")) },
        { query: "高位向下拉背的那个大架子", check: r => r.some(x => x.name.includes("高位下拉") || x.name.includes("下拉")) },
        { query: "坐着往下拉杆子的背阔肌器械", check: r => r.some(x => x.name.includes("下拉")) },
        { query: "坐着两手往中间合拢夹胸的机器", check: r => r.some(x => x.name.includes("夹胸") || x.name.includes("飞鸟")) },
        { query: "蝴蝶机夹胸", check: r => r.some(x => x.name.includes("蝴蝶机")) },
        { query: "躺在斜板上用双脚往上蹬的大家伙", check: r => r.some(x => x.name.includes("蹬") || x.name.includes("哈克")) },
        { query: "45度倒蹬机", check: r => r.some(x => x.name.includes("蹬") || x.name.includes("哈克")) },
        { query: "站着或者坐着拉绳索的龙门架", check: r => r.some(x => x.name.includes("龙门架") || x.name.includes("绳索")) },
        { query: "滑轮绳索大飞鸟", check: r => r.some(x => x.name.includes("夹胸") || x.name.includes("绳索")) },
        { query: "坐着往头顶推举的肩部器械", check: r => r.some(x => x.name.includes("推肩") || x.name.includes("推举")) },
        { query: "推肩机", check: r => r.some(x => x.name.includes("推肩") || x.name.includes("推举")) },
        { query: "坐着把小腿往上踢的器械", check: r => r.some(x => x.name.includes("腿屈伸") || x.name.includes("踢")) },
        { query: "坐姿腿屈伸踢小腿", check: r => r.some(x => x.name.includes("腿屈伸")) },
        { query: "趴在板子上小腿往后勾的机器", check: r => r.some(x => x.name.includes("腿弯举") || x.name.includes("勾腿")) },
        { query: "俯卧腿弯举勾腿", check: r => r.some(x => x.name.includes("腿弯举")) },
        { query: "坐着双手向后拉到肚脐的划船机器", check: r => r.some(x => x.name.includes("划船")) },
        { query: "低位坐姿划船", check: r => r.some(x => x.name.includes("划船")) },
        { query: "带固定滑轨垂直上下的杠铃架", check: r => r.some(x => x.name.includes("史密斯")) },
        { query: "史密斯架做深蹲", check: r => r.some(x => x.name.includes("史密斯") || x.name.includes("深蹲")) },
        { query: "坐着练二头两手屈臂抬起的器械", check: r => r.some(x => x.name.includes("弯举")) },
        { query: "牧师凳弯举", check: r => r.some(x => x.name.includes("牧师凳") || x.name.includes("托弯举")) },
        { query: "在滑轮上抓着绳子往下压三头的动作", check: r => r.some(x => x.name.includes("下压") || x.name.includes("三头")) },
        { query: "绳索三头下压", check: r => r.some(x => x.name.includes("下压")) },
        { query: "两脚站上去手扶着往上提脚后跟的机器", check: r => r.some(x => x.name.includes("提踵")) },
        { query: "站姿提踵练小腿", check: r => r.some(x => x.name.includes("提踵")) },
        { query: "躺在平凳上双手各握一个铁疙瘩往上推", check: r => r.some(x => x.name.includes("卧推") || x.name.includes("哑铃")) },
        { query: "哑铃平板卧推", check: r => r.some(x => x.name.includes("哑铃") && x.name.includes("卧推")) },
        { query: "悬挂在杠子上做引体向上的动作", check: r => r.some(x => x.name.includes("引体向上")) },
        { query: "引体向上", check: r => r.some(x => x.name.includes("引体向上")) },
        { query: "坐在凳子上双腿向外分开对抗阻力的机器", check: r => r.some(x => x.name.includes("外展")) },
        { query: "坐姿髋外展练臀", check: r => r.some(x => x.name.includes("外展")) },
        { query: "坐在凳子上双腿往中间夹合拢练大腿内侧", check: r => r.some(x => x.name.includes("内收") || x.name.includes("夹腿")) },
        { query: "履带式跑步机跑步", check: r => r.some(x => x.name.includes("跑步机")) },
        { query: "双手握杠铃扛在肩膀后侧蹲下去", check: r => r.some(x => x.name.includes("深蹲")) },
        { query: "双手握哑铃往身体两侧平举练中束", check: r => r.some(x => x.name.includes("平举")) }
      ];

      expect(colloquialCases.length).toBeGreaterThanOrEqual(30);

      let matchedCount = 0;
      for (const testCase of colloquialCases) {
        const results = recognizeMachineByQuery(testCase.query, DEFAULT_EXERCISES);
        expect(results.length).toBeGreaterThan(0);
        const top3Exercises = results.slice(0, 3).map(r => r.exercise);
        if (testCase.check(top3Exercises)) {
          matchedCount++;
        }
      }

      const accuracy = matchedCount / colloquialCases.length;
      expect(accuracy).toBeGreaterThanOrEqual(0.85); // 32/36 = 88.9%
    });

    it("handles extreme gibberish gracefully without false positive matches", () => {
      const gibberish = [
        "aslkdfjlaskjdflkjasdlfkjasdlkfjasdfl",
        "198273918237918237918237",
        "zzzzzzzzzzzzzzzzzzzzzzzzz",
        "qxwmvbkjfgh"
      ];

      for (const g of gibberish) {
        const res = recognizeMachineByQuery(g, DEFAULT_EXERCISES);
        expect(res.length).toBe(0);
      }
    });

    it("SURGICALLY HARDENED [BUG-CHALLENGE-01]: Punctuation soup is safely discarded with 0 matches", () => {
      // When input consists purely of punctuation, cleanNoPunctuation becomes ""
      // Returns [] immediately instead of false positive 0.95 matches
      const punctuationSoups = [",,,,,,,,", "？？？？？", "，，，。！？", "   ,,,   "];
      for (const soup of punctuationSoups) {
        const res = recognizeMachineByQuery(soup, DEFAULT_EXERCISES);
        expect(res.length).toBe(0);
      }
    });

    it("SURGICALLY HARDENED [BUG-CHALLENGE-02]: Single-character query requires length >= 2 and does not false-positive match", () => {
      // Single character query 'a' does not trigger 0.95 confidence exact name match
      const singleCharRes = recognizeMachineByQuery("a", DEFAULT_EXERCISES);
      expect(singleCharRes.length).toBe(0);
    });

    it("handles long paragraph input without crashing or exceeding confidence bounds", () => {
      const longGymStory = "今天来到健身房，天气非常不错，我先去热身了一下，然后看到很多黄色杠杆器械，有人在坐着手往前推做卧推，旁边还有人在做龙门架绳索下压练三头肌，远处还有人在踩踏板做深蹲或者倒蹬机。整个训练馆氛围非常好，我想找一个能够练胸的推胸器械开始我的推胸大业。".repeat(10);
      
      const res = recognizeMachineByQuery(longGymStory, DEFAULT_EXERCISES);
      expect(Array.isArray(res)).toBe(true);
      expect(res.length).toBeLessThanOrEqual(10);
      for (const r of res) {
        expect(r.confidence).toBeGreaterThanOrEqual(0);
        expect(r.confidence).toBeLessThanOrEqual(0.99);
      }
    });
  });

  // =========================================================================
  // VECTOR 2: Exercise Memory Engine Stress Testing
  // =========================================================================
  describe("Vector 2: Exercise Memory Engine Stress Testing", () => {
    it("handles non-array or empty workoutLogs safely", () => {
      expect(() => getExerciseMemoryPool(null)).not.toThrow();
      expect(() => getExerciseMemoryPool(undefined)).not.toThrow();
      expect(() => getExerciseMemoryPool("invalid-string")).not.toThrow();
      expect(() => getExerciseHistoricalPrefill("ex-bench-press", null)).not.toThrow();
    });

    it("SURGICALLY HARDENED [BUG-CHALLENGE-03]: null item in workoutLogs handled safely without throwing", () => {
      expect(() => {
        const pool = getExerciseMemoryPool([null]);
        expect(pool).toBeDefined();
        expect(pool.pinned).toEqual([]);
      }).not.toThrow();

      expect(() => {
        const prefill = getExerciseHistoricalPrefill("ex-bench-press", [null]);
        expect(prefill).toBeDefined();
        expect(prefill.source).toBe("default");
      }).not.toThrow();
    });

    it("SURGICALLY HARDENED [BUG-CHALLENGE-04]: null item in log.exercises handled safely without throwing", () => {
      const corruptedLog = {
        id: "corrupted-1",
        completedAt: Date.now(),
        exercises: [null]
      };

      expect(() => {
        const pool = getExerciseMemoryPool([corruptedLog]);
        expect(pool).toBeDefined();
      }).not.toThrow();

      expect(() => {
        const prefill = getExerciseHistoricalPrefill("ex-bench-press", [corruptedLog]);
        expect(prefill).toBeDefined();
        expect(prefill.source).toBe("default");
      }).not.toThrow();
    });

    it("SURGICALLY HARDENED [BUG-CHALLENGE-05]: null item in logEx.sets handled safely without throwing", () => {
      const corruptedSetLog = {
        id: "corrupted-2",
        completedAt: Date.now(),
        exercises: [
          {
            exerciseId: "ex-machine-chest-press",
            name: "固定器械推胸",
            sets: [null]
          }
        ]
      };

      expect(() => {
        const pool = getExerciseMemoryPool([corruptedSetLog]);
        expect(pool).toBeDefined();
      }).not.toThrow();

      expect(() => {
        const prefill = getExerciseHistoricalPrefill("ex-machine-chest-press", [corruptedSetLog]);
        expect(prefill).toBeDefined();
      }).not.toThrow();
    });

    it("handles extreme set configurations and deduplication correctly", () => {
      const hugeSetsCount = 500;
      const massiveLog = {
        id: "massive-log",
        completedAt: Date.now(),
        exercises: [
          {
            exerciseId: "ex-barbell-bench-press",
            name: "平板杠铃卧推",
            sets: Array.from({ length: hugeSetsCount }, (_, i) => ({
              weight: 100 + (i % 20),
              reps: 8,
              completed: true
            }))
          }
        ]
      };

      const prefill = getExerciseHistoricalPrefill("ex-barbell-bench-press", [massiveLog]);
      expect(prefill.source).toBe("history");
      // Zero arbitrary truncation: all 500 sets must be preserved
      expect(prefill.sets.length).toBe(hugeSetsCount);
      expect(prefill.sets[0].weight).toBe(100);
      expect(prefill.sets[0].reps).toBe(8);

      // Memory pool deduplication check:
      // Pinned items should NEVER duplicate into recent items
      const pool = getExerciseMemoryPool([massiveLog], ["ex-barbell-bench-press"]);
      expect(pool.pinned.some(p => p.id === "ex-barbell-bench-press")).toBe(true);
      expect(pool.recent.some(r => r.id === "ex-barbell-bench-press")).toBe(false);
    });

    it("stress-tests memory pool performance across 2,000 historical workout logs", () => {
      const logs = [];
      const now = Date.now();
      for (let i = 0; i < 2000; i++) {
        logs.push({
          id: `log-${i}`,
          completedAt: now - i * 86400000,
          exercises: [
            {
              exerciseId: "ex-machine-chest-press",
              name: "固定器械推胸",
              sets: [{ weight: 60, reps: 10, completed: true }]
            },
            {
              exerciseId: "ex-lat-pulldown",
              name: "高位下拉",
              sets: [{ weight: 50, reps: 12, completed: true }]
            }
          ]
        });
      }

      const start = performance.now();
      const pool = getExerciseMemoryPool(logs, ["ex-machine-chest-press"]);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(300); // Must execute in under 300ms
      expect(pool.pinned.length).toBe(1);
      expect(pool.recent.length).toBeGreaterThan(0);
      expect(pool.frequent.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // VECTOR 3: Dopamine Feedback Engine Stress Testing
  // =========================================================================
  describe("Vector 3: Dopamine Feedback Engine Stress Testing", () => {
    it("handles negative weights, extreme tonnages, and non-numeric inputs safely", () => {
      // Negative tonnage
      const negativeResult = calculateTonnageMetaphor(-1000);
      expect(negativeResult.tonnage).toBe(0);
      expect(negativeResult.formattedTonnage).toBe("0 吨");
      expect(negativeResult.multiplier).toBe(0);

      // Non-numeric / NaN tonnage
      const nanResult = calculateTonnageMetaphor("invalid-weight");
      expect(nanResult.tonnage).toBe(0);
      expect(nanResult.formattedTonnage).toBe("0 吨");

      // Massive tonnage: 1,000,000 kg (1,000 tons)
      const massiveResult = calculateTonnageMetaphor(1000000);
      expect(massiveResult.tonnage).toBe(1000);
      expect(massiveResult.formattedTonnage).toBe("1000 吨");
      expect(massiveResult.metaphorName).toBe("蓝鲸");
      expect(massiveResult.multiplier).toBe(8.3);
      expect(massiveResult.description).toContain("蓝鲸");

      // Super-massive tonnage: 100,000,000 kg
      const superMassive = calculateTonnageMetaphor(100000000);
      expect(superMassive.tonnage).toBe(100000);
      expect(superMassive.multiplier).toBe(833.3);
      expect(superMassive.description).toContain("蓝鲸");
    });

    it("CONSTITUTIONAL INVARIANT: 0~72h recovery safety period NEVER deducts rank score under ANY circumstance", () => {
      const now = Date.now();
      const recoveryHours = [
        0, 0.5, 1, 6, 12, 18, 23.9,
        24, 24.1, 30, 36, 42, 47.9,
        48, 48.1, 54, 60, 66, 71.9, 72.0
      ];

      for (const h of recoveryHours) {
        const lastWorkout = now - h * 3600 * 1000;
        const status = calculateSupercompensationStatus(lastWorkout, now);

        expect(status.hoursElapsed).toBeCloseTo(h, 1);
        expect(status.isSafeRecoveryWindow).toBe(true);
        expect(status.decayPenalty).toBe(0); // MUST NEVER BE > 0!
        expect(status.progressPercent).toBeGreaterThanOrEqual(0);
        expect(status.progressPercent).toBeLessThanOrEqual(100);
        expect(typeof status.advice).toBe("string");
        expect(typeof status.timerText).toBe("string");
      }
    });

    it("handles future timestamps without negative values or crashing", () => {
      const futureTime = Date.now() + 7 * 24 * 3600 * 1000; // 7 days in future
      const status = calculateSupercompensationStatus(futureTime);

      expect(status.hoursElapsed).toBe(0);
      expect(status.isSafeRecoveryWindow).toBe(true);
      expect(status.decayPenalty).toBe(0);
      expect(status.stage).toBe(SUPERCOMPENSATION_STAGES.ACUTE);
    });

    it("handles 1970 UNIX epoch timestamp safely without NaN or infinite loops", () => {
      const epochTime = "1970-01-01T00:00:00Z";
      const status = calculateSupercompensationStatus(epochTime);

      expect(isNaN(status.hoursElapsed)).toBe(false);
      expect(status.hoursElapsed).toBeGreaterThan(400000);
      expect(status.stage).toBe(SUPERCOMPENSATION_STAGES.READY);
      expect(status.isSafeRecoveryWindow).toBe(false);
      expect(status.progressPercent).toBe(100);
    });

    it("calculates tier advancement and point bounds correctly", () => {
      // 0 points
      const zeroAdv = calculateTierAdvancement(0, 0);
      expect(zeroAdv.currentScore).toBe(0);
      expect(zeroAdv.previousScore).toBe(0);
      expect(zeroAdv.currentTier.tier).toBe(1);
      expect(zeroAdv.hasLeveledUp).toBe(false);

      // Level up from tier 1 to tier 2
      const levelUpAdv = calculateTierAdvancement(350, 100);
      expect(levelUpAdv.previousScore).toBe(250);
      expect(levelUpAdv.previousTier.tier).toBe(1);
      expect(levelUpAdv.currentTier.tier).toBe(2);
      expect(levelUpAdv.hasLeveledUp).toBe(true);

      // Apex tier 7 boundary
      const apexAdv = calculateTierAdvancement(3500, 100);
      expect(apexAdv.currentTier.tier).toBe(7);
      expect(apexAdv.pointsNeededForNextTier).toBe(0);
      expect(apexAdv.progressPercent).toBe(100);
    });
  });

  // =========================================================================
  // VECTOR 4: Store Actions & AI Session Robustness Hardening
  // =========================================================================
  describe("Vector 4: Store Actions & AI Session Robustness Hardening", () => {
    it("moveActiveWorkoutExercise rejects NaN and non-number arguments safely", () => {
      store.activeWorkout = {
        planId: "adv-plan",
        planName: "防守测试",
        exercises: [
          { name: "动作A", exerciseId: "ex-a" },
          { name: "动作B", exerciseId: "ex-b" },
          { name: "动作C", exerciseId: "ex-c" }
        ]
      };

      const initialOrder = store.activeWorkout.exercises.map(e => e.name);

      // NaN tests
      moveActiveWorkoutExercise(NaN, 0);
      expect(store.activeWorkout.exercises.map(e => e.name)).toEqual(initialOrder);

      moveActiveWorkoutExercise(0, NaN);
      expect(store.activeWorkout.exercises.map(e => e.name)).toEqual(initialOrder);

      // Non-number arguments
      moveActiveWorkoutExercise("0", 1);
      expect(store.activeWorkout.exercises.map(e => e.name)).toEqual(initialOrder);

      moveActiveWorkoutExercise(null, undefined);
      expect(store.activeWorkout.exercises.map(e => e.name)).toEqual(initialOrder);

      // Out of bounds / negative
      moveActiveWorkoutExercise(-1, 1);
      moveActiveWorkoutExercise(1, 999);
      expect(store.activeWorkout.exercises.map(e => e.name)).toEqual(initialOrder);

      // Valid move works
      moveActiveWorkoutExercise(2, 0);
      expect(store.activeWorkout.exercises[0].name).toBe("动作C");
    });

    it("pinActiveWorkoutExercise rejects NaN, null, undefined, and non-number safely", () => {
      store.activeWorkout = {
        planId: "adv-plan-2",
        planName: "防守测试2",
        exercises: [
          { name: "动作1", exerciseId: "ex-1" },
          { name: "动作2", exerciseId: "ex-2" }
        ]
      };

      const initialCount = store.activeWorkout.exercises.length;
      pinActiveWorkoutExercise(NaN);
      pinActiveWorkoutExercise(null);
      pinActiveWorkoutExercise(undefined);
      pinActiveWorkoutExercise("1");
      expect(store.activeWorkout.exercises.length).toBe(initialCount);
    });

    it("addExerciseToActiveWorkout safely rejects null, undefined, and non-objects", () => {
      store.activeWorkout = {
        planId: "adv-plan-3",
        planName: "防守测试3",
        exercises: []
      };

      expect(() => addExerciseToActiveWorkout(null)).not.toThrow();
      expect(() => addExerciseToActiveWorkout(undefined)).not.toThrow();
      expect(() => addExerciseToActiveWorkout("invalid")).not.toThrow();
      expect(() => addExerciseToActiveWorkout(123)).not.toThrow();
      expect(store.activeWorkout.exercises.length).toBe(0);

      // Valid object succeeds
      expect(() => addExerciseToActiveWorkout({ id: "ex-bench-press", name: "平板杠铃卧推" })).not.toThrow();
      expect(store.activeWorkout.exercises.length).toBe(1);
    });

    it("openAICoachWithContext handles null options safely", () => {
      expect(() => {
        const res = openAICoachWithContext(null);
        expect(res).toBeDefined();
        expect(res.success).toBe(true);
      }).not.toThrow();
    });
  });
});

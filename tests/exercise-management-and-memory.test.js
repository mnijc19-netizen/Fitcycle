import { beforeEach, describe, expect, it } from "vitest";
import {
  getExerciseHistoricalPrefill,
  getExerciseMemoryPool,
  resolveExercise
} from "../src/engine/exerciseMemoryEngine.js";
import {
  addExerciseToActiveWorkout,
  addExerciseToPlan,
  moveActiveWorkoutExercise,
  pinActiveWorkoutExercise,
  store,
  togglePinExercise
} from "../src/store/fitnessStore.js";
import { DEFAULT_EXERCISES } from "../src/data/defaultPlans.js";

describe("exerciseMemoryEngine & Store Exercise Management", () => {
  beforeEach(() => {
    store.pinnedExerciseIds = [];
    store.workoutLogs = [];
    store.activeWorkout = null;
  });

  describe("getExerciseHistoricalPrefill", () => {
    it("inherits user's full completed sets without arbitrary 3-set truncation", () => {
      const logs = [
        {
          id: "log_1",
          completedAt: Date.now() - 3600 * 1000,
          exercises: [
            {
              exerciseId: "ex-incline-db-bench",
              name: "上斜哑铃卧推",
              sets: [
                { completed: true, weight: 24, reps: 10 },
                { completed: true, weight: 26, reps: 8 },
                { completed: true, weight: 26, reps: 8 },
                { completed: true, weight: 28, reps: 6 },
                { completed: true, weight: 28, reps: 6 } // 5 completed sets
              ]
            }
          ]
        }
      ];

      const prefill = getExerciseHistoricalPrefill("ex-incline-db-bench", logs);

      expect(prefill.source).toBe("history");
      expect(prefill.sets).toHaveLength(5);
      expect(prefill.sets[0]).toEqual({ weight: 24, reps: 10 });
      expect(prefill.sets[3]).toEqual({ weight: 28, reps: 6 });
      expect(prefill.sets[4]).toEqual({ weight: 28, reps: 6 });
    });

    it("falls back to defaultFallback when no historical log exists", () => {
      const prefill = getExerciseHistoricalPrefill("ex-hack-squat", [], {
        defaultSets: 4,
        defaultWeight: 60,
        defaultReps: "8-12"
      });

      expect(prefill.source).toBe("default");
      expect(prefill.sets).toHaveLength(4);
      expect(prefill.sets[0].weight).toBe(60);
      expect(prefill.sets[0].reps).toBe(8);
    });

    it("handles null/undefined exerciseId or empty logs gracefully", () => {
      const fallback = getExerciseHistoricalPrefill(null, null, { defaultSets: 3, defaultWeight: 20 });
      expect(fallback.source).toBe("default");
      expect(fallback.sets).toHaveLength(3);
      expect(fallback.sets[0].weight).toBe(20);
    });
  });

  describe("getExerciseMemoryPool", () => {
    it("resolves pinned exercises in exact order", () => {
      const pool = getExerciseMemoryPool([], ["ex-lat-pulldown", "ex-machine-chest-press"], DEFAULT_EXERCISES);
      expect(pool.pinned).toHaveLength(2);
      expect(pool.pinned[0].id).toBe("ex-lat-pulldown");
      expect(pool.pinned[1].id).toBe("ex-machine-chest-press");
    });

    it("extracts recent exercises and ranks frequent exercises by completed sets", () => {
      const logs = [
        {
          id: "log_recent",
          completedAt: 2000,
          exercises: [
            {
              exerciseId: "ex-lat-pulldown",
              name: "对握/宽握高位下拉",
              sets: [{ completed: true, weight: 45, reps: 10 }, { completed: true, weight: 45, reps: 10 }]
            },
            {
              exerciseId: "ex-seated-cable-row",
              name: "坐姿绳索划船",
              sets: [{ completed: true, weight: 40, reps: 10 }]
            }
          ]
        },
        {
          id: "log_older",
          completedAt: 1000,
          exercises: [
            {
              exerciseId: "ex-seated-cable-row",
              name: "坐姿绳索划船",
              sets: [
                { completed: true, weight: 40, reps: 10 },
                { completed: true, weight: 40, reps: 10 },
                { completed: true, weight: 40, reps: 10 },
                { completed: true, weight: 40, reps: 10 }
              ]
            }
          ]
        }
      ];

      const pool = getExerciseMemoryPool(logs, ["ex-lat-pulldown"], DEFAULT_EXERCISES);

      // Pinned has lat pulldown
      expect(pool.pinned[0].id).toBe("ex-lat-pulldown");

      // Recent does not duplicate pinned
      expect(pool.recent.some(e => e.id === "ex-lat-pulldown")).toBe(false);
      expect(pool.recent[0].id).toBe("ex-seated-cable-row");

      // Frequent ranks seated-cable-row (5 completed sets) ahead of lat-pulldown (2 completed sets)
      expect(pool.frequent[0].id).toBe("ex-seated-cable-row");
    });
  });

  describe("fitnessStore actions for pinning and reordering", () => {
    it("togglePinExercise adds and removes exercise ID", () => {
      expect(store.pinnedExerciseIds).toEqual([]);

      togglePinExercise("ex-hack-squat");
      expect(store.pinnedExerciseIds).toContain("ex-hack-squat");

      togglePinExercise("ex-hack-squat");
      expect(store.pinnedExerciseIds).not.toContain("ex-hack-squat");
    });

    it("moveActiveWorkoutExercise reorders exercises within active workout", () => {
      store.activeWorkout = {
        exercises: [
          { id: "e1", name: "动作 1" },
          { id: "e2", name: "动作 2" },
          { id: "e3", name: "动作 3" }
        ]
      };

      // Move index 2 ("动作 3") to index 0
      moveActiveWorkoutExercise(2, 0);
      expect(store.activeWorkout.exercises.map(e => e.id)).toEqual(["e3", "e1", "e2"]);

      // Out of bounds is ignored
      moveActiveWorkoutExercise(0, 10);
      expect(store.activeWorkout.exercises.map(e => e.id)).toEqual(["e3", "e1", "e2"]);
    });

    it("pinActiveWorkoutExercise moves target exercise to the very top", () => {
      store.activeWorkout = {
        exercises: [
          { id: "e1", name: "动作 1" },
          { id: "e2", name: "动作 2" },
          { id: "e3", name: "动作 3" }
        ]
      };

      pinActiveWorkoutExercise(2);
      expect(store.activeWorkout.exercises[0].id).toBe("e3");
    });

    it("addExerciseToActiveWorkout preserves user's 5 historical sets instead of truncating to 3", () => {
      store.workoutLogs = [
        {
          id: "log_prev",
          completedAt: Date.now(),
          exercises: [
            {
              exerciseId: "ex-incline-db-bench",
              name: "上斜哑铃卧推",
              sets: [
                { completed: true, weight: 26, reps: 10 },
                { completed: true, weight: 28, reps: 8 },
                { completed: true, weight: 28, reps: 8 },
                { completed: true, weight: 30, reps: 6 },
                { completed: true, weight: 30, reps: 6 }
              ]
            }
          ]
        }
      ];

      store.activeWorkout = {
        exercises: []
      };

      addExerciseToActiveWorkout({
        id: "ex-incline-db-bench",
        name: "上斜哑铃卧推"
      });

      expect(store.activeWorkout.exercises).toHaveLength(1);
      const addedEx = store.activeWorkout.exercises[0];
      expect(addedEx.sets).toHaveLength(5);
      expect(addedEx.sets[0].weight).toBe(26);
      expect(addedEx.sets[4].weight).toBe(30);
    });

    it("addExerciseToPlan inherits preferred weight from historical prefill", () => {
      store.workoutLogs = [
        {
          id: "log_1",
          completedAt: Date.now(),
          exercises: [
            {
              exerciseId: "ex-machine-chest-press",
              name: "固定器械推胸",
              sets: [
                { completed: true, weight: 65, reps: 10 },
                { completed: true, weight: 70, reps: 8 }
              ]
            }
          ]
        }
      ];

      const testPlan = store.plans[0];
      // Clear exercises to test addition
      const initialExercises = [...testPlan.exercises];
      testPlan.exercises = [];

      addExerciseToPlan(testPlan.id, {
        id: "ex-machine-chest-press",
        name: "固定器械推胸"
      });

      expect(testPlan.exercises).toHaveLength(1);
      expect(testPlan.exercises[0].defaultWeight).toBe(65);

      // Restore plan
      testPlan.exercises = initialExercises;
    });
  });
});

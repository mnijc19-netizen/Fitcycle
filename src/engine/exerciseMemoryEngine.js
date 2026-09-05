/**
 * FitCycle Exercise Memory Engine (Layer 2 Pure Biomechanics & History Memory Engine)
 * Manages user historical performance prefilling, memory pools (pinned, recent, frequent),
 * and set-weight inheritance without arbitrary set truncation.
 * 
 * Complies with FitCycle Master Constitution:
 * - Layer 2 pure business engine: 0 UI dependency, 0 side effects, 100% deterministic.
 * - Respects user PR and historical completed work sets without arbitrary 3-set truncation.
 */

import { DEFAULT_EXERCISES } from "../data/defaultPlans.js";

/**
 * Resolves full exercise object from exerciseId or name from library
 * @param {string} idOrName 
 * @param {Array} allExercises 
 * @returns {Object|null}
 */
export function resolveExercise(idOrName, allExercises = DEFAULT_EXERCISES) {
  if (!idOrName) return null;
  const list = Array.isArray(allExercises) && allExercises.length > 0 ? allExercises : DEFAULT_EXERCISES;
  return list.find(e => e.id === idOrName || e.name === idOrName || (e.aliases && e.aliases.includes(idOrName))) || null;
}

/**
 * Computes user behavioral memory pool from workout logs and pinned exercise IDs.
 * 
 * @param {Array} workoutLogs - Array of completed workout logs (from store.workoutLogs)
 * @param {Array<string>} pinnedIds - Array of pinned exercise IDs
 * @param {Array} allExercises - Exercise library (defaults to DEFAULT_EXERCISES)
 * @returns {{ pinned: Array<Object>, recent: Array<Object>, frequent: Array<Object> }}
 */
export function getExerciseMemoryPool(workoutLogs = [], pinnedIds = [], allExercises = DEFAULT_EXERCISES) {
  const library = Array.isArray(allExercises) && allExercises.length > 0 ? allExercises : DEFAULT_EXERCISES;
  const safeLogs = (Array.isArray(workoutLogs) ? workoutLogs : []).filter(Boolean);
  const safePinnedIds = (Array.isArray(pinnedIds) ? pinnedIds : []).filter(Boolean);

  // 1. Pinned exercises in exact order of pinnedIds
  const pinned = [];
  const pinnedSet = new Set();
  for (const pid of safePinnedIds) {
    const ex = resolveExercise(pid, library);
    if (ex && !pinnedSet.has(ex.id)) {
      pinned.push(ex);
      pinnedSet.add(ex.id);
    }
  }

  // 2. Extract recent exercises (newest workout logs first)
  const sortedLogs = [...safeLogs].sort((a, b) => ((b?.completedAt || b?.timestamp) || 0) - ((a?.completedAt || a?.timestamp) || 0));
  const recent = [];
  const recentSet = new Set(pinnedSet); // Exclude pinned from recent to avoid duplication

  // 3. Frequency counter across all workout logs
  const exerciseFrequencyMap = new Map(); // exerciseId -> { count: number, totalSets: number, exercise: Object }

  for (const log of sortedLogs) {
    if (!log || typeof log !== 'object' || !Array.isArray(log.exercises)) continue;
    for (const logEx of log.exercises) {
      if (!logEx || typeof logEx !== 'object') continue;
      const ex = resolveExercise(logEx.exerciseId || logEx.name, library) || {
        id: logEx.exerciseId || `custom-${logEx.name}`,
        name: logEx.name || "未命名动作",
        category: logEx.category || "其它",
        target: logEx.target || ""
      };

      // Add to recent if not seen yet
      if (!recentSet.has(ex.id)) {
        recent.push(ex);
        recentSet.add(ex.id);
      }

      // Count completed sets for frequency
      const safeSets = Array.isArray(logEx.sets) ? logEx.sets.filter(Boolean) : [];
      const completedSetsCount = safeSets.filter(s => s && s.completed).length || safeSets.length || 1;

      const current = exerciseFrequencyMap.get(ex.id) || {
        count: 0,
        totalSets: 0,
        exercise: ex
      };
      current.count += 1;
      current.totalSets += completedSetsCount;
      exerciseFrequencyMap.set(ex.id, current);
    }
  }

  // 4. Frequent exercises sorted by total completed sets descending
  const frequent = Array.from(exerciseFrequencyMap.values())
    .sort((a, b) => b.totalSets - a.totalSets || b.count - a.count)
    .map(item => item.exercise);

  return {
    pinned,
    recent,
    frequent
  };
}

/**
 * Extracts full completed sets from user's last session for an exercise without arbitrary 3-set truncation.
 * If user completed 4, 5, or 6 sets in their last session, returns all of them.
 * 
 * @param {string} exerciseIdOrName - ID or name of exercise
 * @param {Array} workoutLogs - Array of completed workout logs (from store.workoutLogs)
 * @param {Object} defaultFallback - Fallback config { defaultSets, defaultWeight, defaultReps }
 * @returns {{ sets: Array<{ weight: number, reps: number }>, source: 'history' | 'default' }}
 */
export function getExerciseHistoricalPrefill(exerciseIdOrName, workoutLogs = [], defaultFallback = {}) {
  if (!exerciseIdOrName) {
    return {
      sets: createDefaultFallbackSets(defaultFallback),
      source: "default"
    };
  }

  const safeLogs = (Array.isArray(workoutLogs) ? workoutLogs : []).filter(Boolean);
  // Sort logs from newest to oldest
  const sortedLogs = [...safeLogs].sort((a, b) => ((b?.completedAt || b?.timestamp) || 0) - ((a?.completedAt || a?.timestamp) || 0));

  for (const log of sortedLogs) {
    if (!log || typeof log !== 'object' || !Array.isArray(log.exercises)) continue;
    const match = log.exercises.find(e =>
      e && typeof e === 'object' && (
        e.exerciseId === exerciseIdOrName ||
        e.name === exerciseIdOrName ||
        (e.id && e.id === exerciseIdOrName)
      )
    );

    if (match && typeof match === 'object' && Array.isArray(match.sets)) {
      const safeSets = match.sets.filter(s => s && typeof s === 'object');
      if (safeSets.length > 0) {
        // Prefer completed sets
        const completedSets = safeSets.filter(s => s.completed);
        const targetSets = completedSets.length > 0 ? completedSets : safeSets;

        if (targetSets.length > 0) {
          return {
            sets: targetSets.map(s => ({
              weight: Number(s.weight) >= 0 ? Number(s.weight) : 20,
              reps: Number(s.reps) > 0 ? Number(s.reps) : 10
            })),
            source: "history"
          };
        }
      }
    }
  }

  return {
    sets: createDefaultFallbackSets(defaultFallback),
    source: "default"
  };
}

/**
 * Helper to build default fallback sets
 */
function createDefaultFallbackSets(fallback = {}) {
  const setsCount = Math.max(1, Number(fallback.defaultSets || fallback.setsCount) || 3);
  const weight = fallback.defaultWeight !== undefined ? Number(fallback.defaultWeight) : 20;
  
  let reps = 10;
  if (typeof fallback.defaultReps === "number") {
    reps = fallback.defaultReps;
  } else if (typeof fallback.defaultReps === "string") {
    const matched = fallback.defaultReps.match(/\d+/);
    if (matched) reps = parseInt(matched[0], 10);
  } else if (typeof fallback.targetReps === "string") {
    const matched = fallback.targetReps.match(/\d+/);
    if (matched) reps = parseInt(matched[0], 10);
  }

  const result = [];
  for (let i = 0; i < setsCount; i++) {
    result.push({
      weight: isNaN(weight) ? 20 : weight,
      reps: isNaN(reps) ? 10 : reps
    });
  }
  return result;
}

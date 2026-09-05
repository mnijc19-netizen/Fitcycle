import { reactive, watch } from "vue";
import { DEFAULT_EXERCISES, DEFAULT_PLANS, PRESET_CYCLES, SCIENCE_PRINCIPLES, SPLIT_RECOMMENDED_ADDONS } from "../data/defaultPlans.js";
import { playSetCompleteSound, playRestCompleteSound, playWorkoutDoneSound } from "../utils/audio.js";
import { triggerHaptic } from "../utils/vibrate.js";
import { universalScrollToTop } from "../utils/scrollUtils.js";
import { requestNotificationPermission, sendRestCompleteNotification, updateDocumentTitleForTimer, setRestCompleteTitle, resetDocumentTitle } from "../utils/notification.js";
import { DEFAULT_SETTINGS, sanitizeSettings, verifyPasscode, getPasscodeSkin, VALID_SKINS, VALID_THEME_MODES, applySkinToDOM, applyThemeToDOM } from "../utils/themeManager.js";
import { calculateInactivityDecay, calculateSessionPointsEarned, getTierForScore, evaluateUnlockedBadges, calculateEquivalentTonnage, calculateShieldInventory } from "../engine/honorEngine.js";
import { getSkinHonorPresentation } from "../engine/skinHonorSchemas.js";
import { calculateAdaptiveWeights, getInitialHonorScore } from "../engine/bodyProfileEngine.js";

const STORAGE_KEY = "fitcycle_app_data_v1";

function getInitialDateStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Generate unique ID
export function uid(prefix = "id") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge saved exercises with newest DEFAULT_EXERCISES to bring in new GIFs & tips
      if (parsed.exercises) {
        const mergedExercises = DEFAULT_EXERCISES.map(defEx => {
          const customMatch = parsed.exercises.find(e => {
            if (e.id === defEx.id || e.name === defEx.name) return true;
            if (defEx.aliases && defEx.aliases.includes(e.name)) return true;
            const eClean = (e.name || "").replace(/[\s\(\)\/（）\-]/g, '');
            const defClean = (defEx.name || "").replace(/[\s\(\)\/（）\-]/g, '');
            return eClean === defClean || (eClean.length >= 4 && (defClean.includes(eClean) || eClean.includes(defClean)));
          });
          return customMatch ? { 
            ...defEx, 
            ...customMatch, 
            name: defEx.name, 
            englishName: defEx.englishName, 
            aliases: defEx.aliases,
            gifUrl: defEx.gifUrl, 
            tips: defEx.tips, 
            substitutes: defEx.substitutes, 
            scienceDetail: defEx.scienceDetail || customMatch.scienceDetail 
          } : defEx;
        });
        // Also keep any purely custom exercises added by user that don't match default
        const customOnly = parsed.exercises.filter(e => !DEFAULT_EXERCISES.some(d => {
          if (d.id === e.id || d.name === e.name) return true;
          if (d.aliases && d.aliases.includes(e.name)) return true;
          const eClean = (e.name || "").replace(/[\s\(\)\/（）\-]/g, '');
          const defClean = (d.name || "").replace(/[\s\(\)\/（）\-]/g, '');
          return eClean === defClean || (eClean.length >= 4 && (defClean.includes(eClean) || eClean.includes(defClean)));
        }));
        parsed.exercises = [...mergedExercises, ...customOnly];
      }

      // Migrate legacy bloated plans (Push 5/Pull 6/Legs 4) to streamlined golden 3-exercise plans
      if (parsed.plans) {
        parsed.plans = parsed.plans.map(p => {
          const defPlan = DEFAULT_PLANS.find(dp => dp.id === p.id);
          if (defPlan) {
            const isLegacyPush = p.id === "plan-push" && p.exercises?.length > 3;
            const isLegacyPull = p.id === "plan-pull" && p.exercises?.length > 3;
            const isLegacyLegs = p.id === "plan-legs" && p.exercises?.length > 3;
            if (isLegacyPush || isLegacyPull || isLegacyLegs) {
              return JSON.parse(JSON.stringify(defPlan));
            }
          }
          return p;
        });
      }

      // Deep sanitize settings for backward compatibility & theme system
      parsed.settings = sanitizeSettings(parsed.settings);
      if (!parsed.bodyMetrics) parsed.bodyMetrics = JSON.parse(JSON.stringify(defaultInitialState.bodyMetrics));
      if (!parsed.honorProfile) parsed.honorProfile = JSON.parse(JSON.stringify(defaultInitialState.honorProfile));

      return parsed;
    }
  } catch (e) {
    console.error("Failed to load local storage:", e);
  }
  return null;
}



const todayStr = getInitialDateStr();

const defaultInitialState = {
  activeTab: "today", // 'today' | 'cycle' | 'calendar' | 'exercises' | 'stats'
  plans: JSON.parse(JSON.stringify(DEFAULT_PLANS)),
  exercises: JSON.parse(JSON.stringify(DEFAULT_EXERCISES)),
  activeCycle: JSON.parse(JSON.stringify(PRESET_CYCLES[0])),
  anchorDate: todayStr, // Starting anchor date for cycle Day 0
  cycleMode: "cycle", // 'cycle' (推拉腿休自动轮转) | 'weekly' (固定周一到周日)
  weeklySchedule: {
    1: "plan-push",
    2: "plan-pull",
    3: "plan-legs",
    4: "plan-rest",
    5: "plan-push",
    6: "plan-pull",
    0: "plan-rest"
  },
  workoutLogs: [],
  activeWorkout: null,
  restTimer: {
    running: false,
    duration: 90,
    remaining: 90,
    endTime: null,
    minimized: false,
    intervalId: null
  },
  bodyMetrics: [],
  honorProfile: {
    score: 850,
    prestigeLevel: 1,
    prestigeYear: new Date().getFullYear(),
    highestScore: 850,
    lastWorkoutTimestamp: null,
    unlockedBadges: []
  },
  settings: {
    ...DEFAULT_SETTINGS
  }
};

// Merge saved data with defaults
const saved = loadSavedState();
export const store = reactive(saved ? { ...defaultInitialState, ...saved, settings: sanitizeSettings(saved.settings) } : defaultInitialState);

// Immediately apply current skin and theme mode to document
applyThemeToDOM(store.settings.uiSkin, store.settings.themeMode);

// Watch for UI skin and theme mode changes and keep DOM attributes / theme-color updated
watch(
  [() => store.settings.uiSkin, () => store.settings.themeMode],
  ([newSkin, newMode]) => {
    applyThemeToDOM(newSkin, newMode);
  },
  { immediate: true }
);

// Auto save to localStorage on changes (excluding timer interval)

watch(
  () => ({
    plans: store.plans,
    exercises: store.exercises,
    activeCycle: store.activeCycle,
    anchorDate: store.anchorDate,
    cycleMode: store.cycleMode,
    weeklySchedule: store.weeklySchedule,
    workoutLogs: store.workoutLogs,
    activeWorkout: store.activeWorkout,
    bodyMetrics: store.bodyMetrics,
    honorProfile: store.honorProfile,
    settings: store.settings
  }),
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  },
  { deep: true }
);

// --- REST TIMER CONTROLS ---
let timerInterval = null;

export function startRestTimer(seconds = store.settings.defaultRestSeconds || 90) {
  if (timerInterval) clearInterval(timerInterval);
  
  requestNotificationPermission();

  store.restTimer.duration = seconds;
  store.restTimer.remaining = seconds;
  store.restTimer.endTime = Date.now() + seconds * 1000;
  store.restTimer.running = true;
  store.restTimer.minimized = false;

  updateDocumentTitleForTimer(seconds);

  timerInterval = setInterval(() => {
    const left = Math.round((store.restTimer.endTime - Date.now()) / 1000);
    if (left <= 0) {
      stopRestTimer();
      store.restTimer.remaining = 0;
      setRestCompleteTitle();
      sendRestCompleteNotification(store.settings.uiSkin);
      if (store.settings.soundEnabled) playRestCompleteSound();
      if (store.settings.vibrationEnabled) triggerHaptic("restComplete");
    } else {
      store.restTimer.remaining = left;
      updateDocumentTitleForTimer(left);
    }
  }, 500);
}

export function stopRestTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  store.restTimer.running = false;
  store.restTimer.remaining = 0;
  store.restTimer.duration = 0;
  store.restTimer.minimized = false;
  resetDocumentTitle();
}


export function adjustRestTimer(deltaSeconds) {
  if (!store.restTimer.running) {
    startRestTimer(Math.max(15, deltaSeconds));
    return;
  }
  store.restTimer.endTime += deltaSeconds * 1000;
  store.restTimer.duration = Math.max(15, store.restTimer.duration + deltaSeconds);
  const left = Math.round((store.restTimer.endTime - Date.now()) / 1000);
  store.restTimer.remaining = Math.max(0, left);
}

// --- CYCLE CALCULATION ENGINE ---
export function getCycleDayForDate(targetDateStr = getInitialDateStr()) {
  if (store.cycleMode === "weekly") {
    const [y, m, d] = targetDateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday
    const planId = store.weeklySchedule[dayOfWeek] || "plan-rest";
    const matchedPlan = store.plans.find(p => p.id === planId) || store.plans[0];
    return {
      name: matchedPlan.name,
      shortName: matchedPlan.shortName,
      color: matchedPlan.color,
      planId: matchedPlan.id,
      isRest: matchedPlan.isRest,
      cycleIndex: dayOfWeek,
      totalCycleDays: 7
    };
  }

  // Cycle rotation mode
  const anchorParts = (store.anchorDate || todayStr).split("-").map(Number);
  const targetParts = targetDateStr.split("-").map(Number);
  
  const anchorDateObj = new Date(anchorParts[0], anchorParts[1] - 1, anchorParts[2]);
  const targetDateObj = new Date(targetParts[0], targetParts[1] - 1, targetParts[2]);
  
  const diffDays = Math.round((targetDateObj - anchorDateObj) / (1000 * 60 * 60 * 24));
  const cycleDays = store.activeCycle.days;
  const cycleLen = cycleDays.length || 1;
  
  const cycleIndex = ((diffDays % cycleLen) + cycleLen) % cycleLen;
  const cycleDay = cycleDays[cycleIndex] || cycleDays[0];
  
  return {
    ...cycleDay,
    cycleIndex,
    totalCycleDays: cycleLen
  };
}

export function getTodayPlan() {
  const today = getInitialDateStr();
  const cycleDay = getCycleDayForDate(today);
  const plan = store.plans.find(p => p.id === cycleDay.planId);
  return {
    cycleDay,
    plan: plan || store.plans[0]
  };
}

export function setTodayAsCycleIndex(index) {
  // Calculates what the anchor date should be so that TODAY equals `index`
  const today = new Date();
  const newAnchor = new Date(today);
  newAnchor.setDate(today.getDate() - index);
  store.anchorDate = getInitialDateStr(newAnchor);
  if (store.settings.vibrationEnabled) triggerHaptic("medium");
}

export function shiftCycleDays(deltaDays) {
  const [y, m, d] = (store.anchorDate || todayStr).split("-").map(Number);
  const anchor = new Date(y, m - 1, d);
  anchor.setDate(anchor.getDate() - deltaDays);
  store.anchorDate = getInitialDateStr(anchor);
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

// --- HISTORY / LAST PERFORMANCE LOOKUP ---
export function getLastExercisePerformance(exerciseName) {
  if (!exerciseName) return null;
  // Search logs from newest to oldest
  const logs = [...store.workoutLogs].sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  for (const log of logs) {
    if (log.exercises) {
      const match = log.exercises.find(e => e.name === exerciseName || e.exerciseId === exerciseName);
      if (match && match.sets && match.sets.length > 0) {
        return {
          date: log.date,
          planName: log.planName,
          sets: match.sets.filter(s => s.completed)
        };
      }
    }
  }
  return null;
}

export function getExerciseDetails(exerciseIdOrName) {
  return store.exercises.find(e => e.id === exerciseIdOrName || e.name === exerciseIdOrName) || null;
}

// --- WORKOUT SESSION LOGIC ---
export function startWorkout(planId, customDate = null) {
  const plan = store.plans.find(p => p.id === planId) || store.plans[0];
  const workoutDate = customDate || getInitialDateStr();

  // Populate exercises with last history weights if available, or plan defaults
  const sessionExercises = (plan.exercises || []).map((pe, exIdx) => {
    const exDetails = getExerciseDetails(pe.exerciseId) || getExerciseDetails(pe.name);
    const lastPerf = getLastExercisePerformance(pe.name);
    
    const sets = [];
    const setsCount = pe.setsCount || (exDetails ? exDetails.defaultSets : 3);

    for (let i = 0; i < setsCount; i++) {
      let w = pe.defaultWeight || 20;
      let r = 10;
      
      if (lastPerf && lastPerf.sets[i]) {
        w = lastPerf.sets[i].weight;
        r = lastPerf.sets[i].reps;
      } else if (lastPerf && lastPerf.sets.length > 0) {
        // use last set weight
        const lastSet = lastPerf.sets[lastPerf.sets.length - 1];
        w = lastSet.weight;
        r = lastSet.reps;
      }

      sets.push({
        id: uid("set"),
        setNum: i + 1,
        weight: w,
        reps: r,
        completed: false,
        isWarmup: false
      });
    }

    return {
      id: uid("ex"),
      exerciseId: pe.exerciseId || (exDetails ? exDetails.id : `custom-${exIdx}`),
      name: pe.name,
      targetReps: pe.targetReps || (exDetails ? `${exDetails.defaultReps}次` : "10-12次"),
      scienceDetail: exDetails ? exDetails.scienceDetail : "",
      category: exDetails ? exDetails.category : "训练",
      tags: exDetails ? exDetails.tags : [],
      sets,
      collapsed: false
    };
  });

  store.activeWorkout = {
    id: uid("workout"),
    planId: plan.id,
    planName: plan.name,
    shortName: plan.shortName,
    color: plan.color || "amber",
    coreTarget: plan.coreTarget,
    date: workoutDate,
    startTime: Date.now(),
    exercises: sessionExercises
  };

  store.activeTab = "today";
  universalScrollToTop(false);
  if (store.settings.vibrationEnabled) triggerHaptic("medium");
}

export function toggleSetCompletion(exerciseIndex, setIndex) {
  if (!store.activeWorkout) return;
  const ex = store.activeWorkout.exercises[exerciseIndex];
  if (!ex) return;
  const setItem = ex.sets[setIndex];
  if (!setItem) return;

  setItem.completed = !setItem.completed;

  if (setItem.completed) {
    if (store.settings.soundEnabled) playSetCompleteSound();
    if (store.settings.vibrationEnabled) triggerHaptic("light");
    // Automatically launch rest timer!
    startRestTimer(store.settings.defaultRestSeconds);
  }
}

export function addSetToExercise(exerciseIndex) {
  if (!store.activeWorkout) return;
  const ex = store.activeWorkout.exercises[exerciseIndex];
  if (!ex) return;
  const lastSet = ex.sets[ex.sets.length - 1];
  const nextSetNum = ex.sets.length + 1;

  ex.sets.push({
    id: uid("set"),
    setNum: nextSetNum,
    weight: lastSet ? lastSet.weight : 20,
    reps: lastSet ? lastSet.reps : 10,
    completed: false,
    isWarmup: false
  });
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

export function removeSetFromExercise(exerciseIndex, setIndex) {
  if (!store.activeWorkout) return;
  const ex = store.activeWorkout.exercises[exerciseIndex];
  if (!ex || ex.sets.length <= 1) return;
  ex.sets.splice(setIndex, 1);
  // Re-number sets
  ex.sets.forEach((s, idx) => { s.setNum = idx + 1; });
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

/**
 * 智能联动同步组重量与次数：将指定组的重量（及可选次数）同步至该动作后续所有未完成组
 * @param {number} exerciseIndex 
 * @param {number} sourceSetIndex 
 * @param {boolean} syncReps 是否同时同步次数（默认 false）
 * @returns {number} 被同步的后续组数量
 */
export function syncSetDataToSubsequentSets(exerciseIndex, sourceSetIndex, syncReps = false) {
  if (!store.activeWorkout) return 0;
  const ex = store.activeWorkout.exercises[exerciseIndex];
  if (!ex || !ex.sets || !ex.sets[sourceSetIndex]) return 0;

  const sourceSet = ex.sets[sourceSetIndex];
  const targetWeight = Number(sourceSet.weight) || 0;
  const targetReps = Number(sourceSet.reps) || 0;
  let syncedCount = 0;

  for (let i = sourceSetIndex + 1; i < ex.sets.length; i++) {
    const nextSet = ex.sets[i];
    if (!nextSet.completed) {
      nextSet.weight = targetWeight;
      if (syncReps) {
        nextSet.reps = targetReps;
      }
      syncedCount++;
    }
  }

  if (syncedCount > 0 && store.settings.vibrationEnabled) {
    triggerHaptic("light");
  }
  return syncedCount;
}

export function addExerciseToActiveWorkout(exerciseItem) {
  if (!store.activeWorkout) return;
  const exDetails = getExerciseDetails(exerciseItem.id || exerciseItem.exerciseId || exerciseItem.name);
  const fullItem = exDetails ? { ...exDetails, ...exerciseItem } : exerciseItem;
  const lastPerf = getLastExercisePerformance(fullItem.name);
  const sets = [];
  const defaultSetsCount = fullItem.defaultSets || 3;
  const levelKey = store.settings.strengthLevel || "intermediate";
  const levelConfig = STRENGTH_LEVEL_CONFIGS[levelKey];
  const configuredWeight = levelConfig?.weights?.[fullItem.name];

  for (let i = 0; i < defaultSetsCount; i++) {
    let w = configuredWeight !== undefined ? configuredWeight : (fullItem.defaultWeight || 20);
    let r = 10;
    if (lastPerf && lastPerf.sets[i]) {
      w = lastPerf.sets[i].weight;
      r = lastPerf.sets[i].reps;
    } else if (lastPerf && lastPerf.sets.length > 0) {
      const lastSet = lastPerf.sets[lastPerf.sets.length - 1];
      w = lastSet.weight;
      r = lastSet.reps;
    }
    sets.push({
      id: uid("set"),
      setNum: i + 1,
      weight: w,
      reps: r,
      completed: false,
      isWarmup: false
    });
  }

  store.activeWorkout.exercises.push({
    id: uid("ex"),
    exerciseId: fullItem.id || fullItem.exerciseId || `custom-${Date.now()}`,
    name: fullItem.name,
    targetReps: fullItem.targetReps || `${fullItem.defaultReps || "10-12"}次`,
    scienceDetail: fullItem.scienceDetail || "",
    category: fullItem.category || "其它",
    tags: fullItem.tags || [],
    sets,
    collapsed: false
  });
  if (store.settings.vibrationEnabled) triggerHaptic("medium");
}

export function addExerciseToPlan(planId, exerciseItem) {
  const plan = store.plans.find(p => p.id === planId);
  if (!plan) return false;
  if (!plan.exercises) plan.exercises = [];
  
  const exDetails = getExerciseDetails(exerciseItem.id || exerciseItem.exerciseId || exerciseItem.name);
  const fullItem = exDetails ? { ...exDetails, ...exerciseItem } : exerciseItem;

  // Prevent duplicate if already exists
  if (plan.exercises.some(e => e.exerciseId === (fullItem.id || fullItem.exerciseId) || e.name === fullItem.name)) {
    return false;
  }

  plan.exercises.push({
    exerciseId: fullItem.id || fullItem.exerciseId,
    name: fullItem.name,
    setsCount: fullItem.defaultSets || 3,
    targetReps: fullItem.targetReps || `${fullItem.defaultReps || "10-12"}次`,
    defaultWeight: fullItem.defaultWeight || 20
  });

  if (store.settings.vibrationEnabled) triggerHaptic("medium");
  return true;
}

export function replaceExerciseInActiveWorkout(exerciseIndex, newExerciseItem) {
  if (!store.activeWorkout) return;
  const lastPerf = getLastExercisePerformance(newExerciseItem.name);
  const ex = store.activeWorkout.exercises[exerciseIndex];
  if (!ex) return;

  const setsCount = ex.sets.length || newExerciseItem.defaultSets || 3;
  const newSets = [];
  const levelKey = store.settings.strengthLevel || "intermediate";
  const levelConfig = STRENGTH_LEVEL_CONFIGS[levelKey];
  const configuredWeight = levelConfig?.weights?.[newExerciseItem.name];

  for (let i = 0; i < setsCount; i++) {
    let w = configuredWeight !== undefined ? configuredWeight : 20;
    let r = 10;
    if (lastPerf && lastPerf.sets[i]) {
      w = lastPerf.sets[i].weight;
      r = lastPerf.sets[i].reps;
    }
    newSets.push({
      id: uid("set"),
      setNum: i + 1,
      weight: w,
      reps: r,
      completed: false,
      isWarmup: false
    });
  }

  store.activeWorkout.exercises[exerciseIndex] = {
    id: uid("ex"),
    exerciseId: newExerciseItem.id,
    name: newExerciseItem.name,
    targetReps: `${newExerciseItem.defaultReps || "10-12"}次`,
    scienceDetail: newExerciseItem.scienceDetail || "",
    category: newExerciseItem.category || "其它",
    tags: newExerciseItem.tags || [],
    sets: newSets,
    collapsed: false
  };
  if (store.settings.vibrationEnabled) triggerHaptic("medium");
}

export function removeExerciseFromActiveWorkout(exerciseIndex) {
  if (!store.activeWorkout) return;
  store.activeWorkout.exercises.splice(exerciseIndex, 1);
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

export function finishWorkout() {
  if (!store.activeWorkout) return null;
  
  const now = Date.now();
  const durationSec = Math.max(60, Math.round((now - (store.activeWorkout.startTime || now)) / 1000));
  
  let totalVolume = 0;
  let totalCompletedSets = 0;

  const recordedExercises = store.activeWorkout.exercises.map(ex => {
    const completedSets = ex.sets.filter(s => s.completed);
    completedSets.forEach(s => {
      totalVolume += (Number(s.weight) || 0) * (Number(s.reps) || 0);
      totalCompletedSets += 1;
    });
    return {
      exerciseId: ex.exerciseId,
      name: ex.name,
      targetReps: ex.targetReps,
      sets: ex.sets
    };
  });

  const logEntry = {
    id: uid("log"),
    date: store.activeWorkout.date || getInitialDateStr(),
    timestamp: now,
    planId: store.activeWorkout.planId,
    planName: store.activeWorkout.planName,
    shortName: store.activeWorkout.shortName || "训练",
    color: store.activeWorkout.color || "amber",
    durationSeconds: durationSec,
    totalVolume,
    totalSets: totalCompletedSets,
    completedAt: now,
    exercises: recordedExercises
  };

  // Add to workout logs (or overwrite if same day duplicate log to keep clean)
  store.workoutLogs.unshift(logEntry);
  
  // Calculate and award FPS honor points
  const elapsedHours = store.workoutLogs.length > 1
    ? (now - (store.workoutLogs[1].timestamp || store.workoutLogs[1].completedAt || (now - 86400000))) / (1000 * 3600)
    : 24;

  const sessionHonorPoints = calculateSessionPointsEarned(logEntry, store.workoutLogs.slice(1), elapsedHours);
  
  if (!store.honorProfile) {
    store.honorProfile = { score: 850, prestigeLevel: 1, prestigeYear: new Date().getFullYear(), highestScore: 850, lastWorkoutTimestamp: now, unlockedBadges: [] };
  }

  store.honorProfile.score = (store.honorProfile.score || 0) + sessionHonorPoints.finalSessionPoints;
  if (store.honorProfile.score > (store.honorProfile.highestScore || 0)) {
    store.honorProfile.highestScore = store.honorProfile.score;
  }
  store.honorProfile.lastWorkoutTimestamp = now;
  refreshUnlockedBadges();

  logEntry.honorPointsEarned = sessionHonorPoints;

  // Clean active workout & stop timer
  stopRestTimer();
  const summary = { ...logEntry, honorPointsEarned: sessionHonorPoints };
  store.activeWorkout = null;

  if (store.settings.soundEnabled) playWorkoutDoneSound();
  if (store.settings.vibrationEnabled) triggerHaptic("success");

  return summary;
}

export function discardActiveWorkout() {
  stopRestTimer();
  store.activeWorkout = null;
  if (store.settings.vibrationEnabled) triggerHaptic("warning");
}

export function resumeWorkoutFromSummary(summary) {
  if (!summary) return false;

  // Remove the saved log entry from workoutLogs
  store.workoutLogs = store.workoutLogs.filter(l => l.id !== summary.id);

  // Re-construct activeWorkout state
  store.activeWorkout = {
    planId: summary.planId,
    planName: summary.planName,
    shortName: summary.shortName,
    color: summary.color,
    startTime: summary.timestamp ? (summary.timestamp - (summary.durationSeconds || 60) * 1000) : Date.now(),
    date: summary.date || getInitialDateStr(),
    exercises: (summary.exercises || []).map(ex => ({
      exerciseId: ex.exerciseId,
      name: ex.name,
      targetReps: ex.targetReps,
      sets: (ex.sets || []).map(s => ({ ...s }))
    }))
  };

  store.activeTab = "today";
  if (store.settings.vibrationEnabled) triggerHaptic("medium");
  return true;
}

// --- LOG & PLAN MANAGEMENT ---
export function deleteWorkoutLog(logId) {
  store.workoutLogs = store.workoutLogs.filter(l => l.id !== logId);
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

export function savePlan(planData) {
  const idx = store.plans.findIndex(p => p.id === planData.id);
  if (idx >= 0) {
    store.plans[idx] = JSON.parse(JSON.stringify(planData));
  } else {
    store.plans.push({
      ...planData,
      id: planData.id || uid("plan")
    });
  }
}

export function deletePlan(planId) {
  if (store.plans.length <= 1) return;
  store.plans = store.plans.filter(p => p.id !== planId);
}

export function saveCustomCycle(cycleData) {
  store.activeCycle = JSON.parse(JSON.stringify(cycleData));
  if (store.settings.vibrationEnabled) triggerHaptic("success");
}

// --- THEME / SKIN ACTIONS ---
export function setThemeMode(mode) {
  const targetMode = VALID_THEME_MODES.includes(mode) ? mode : "dark";
  store.settings.themeMode = targetMode;
  store.settings.theme = targetMode;
  applyThemeToDOM(store.settings.uiSkin, targetMode);
  if (store.settings.vibrationEnabled) triggerHaptic("light");
}

export function toggleThemeMode() {
  const currentMode = store.settings.themeMode === "light" ? "light" : "dark";
  const nextMode = currentMode === "light" ? "dark" : "light";
  setThemeMode(nextMode);
  return nextMode;
}

export function unlockSkin(passcodeInput) {
  const targetSkin = getPasscodeSkin(passcodeInput);
  if (!targetSkin) {
    return { success: false, message: "暗号不正确" };
  }

  if (!store.settings.unlockedSkins.includes(targetSkin)) {
    store.settings.unlockedSkins.push(targetSkin);
  }
  store.settings.uiSkin = targetSkin;
  applyThemeToDOM(targetSkin, store.settings.themeMode);

  if (store.settings.vibrationEnabled) triggerHaptic("success");
  
  const skinMessages = {
    chamber: "尚博勒灵感隐藏界面皮肤已激活！",
    cs: "💥 C4 已安放！CS2 完美特训战术皮肤已激活！",
    monochrome: "典藏极简黑白纯粹美学皮肤已激活！"
  };
  return { success: true, skin: targetSkin, message: skinMessages[targetSkin] || "隐藏皮肤已解锁" };
}

export function unlockChamberSkin(passcodeInput) {
  return unlockSkin(passcodeInput);
}

export const skinSplashState = reactive({
  visible: false,
  skin: "default",
  seq: 0
});

export function triggerSkinSplash(skinName) {
  skinSplashState.skin = skinName || "default";
  skinSplashState.seq += 1;
  skinSplashState.visible = true;
}

export function setUISkin(skinName) {
  const target = VALID_SKINS.includes(skinName) ? skinName : "default";
  if (target === "default" || store.settings.unlockedSkins.includes(target)) {
    store.settings.uiSkin = target;
    applyThemeToDOM(target, store.settings.themeMode);
    if (store.settings.vibrationEnabled) triggerHaptic("light");
    triggerSkinSplash(target);
  }
}

export function restoreDefaultSkin() {
  store.settings.uiSkin = "default";
  applyThemeToDOM("default", store.settings.themeMode);
  if (store.settings.vibrationEnabled) triggerHaptic("light");
  triggerSkinSplash("default");
  return { success: true, message: "已恢复默认外观，训练数据未改变" };
}

export function clearWorkoutHistory() {
  store.workoutLogs = [];
  store.bodyMetrics = [];
  store.honorProfile = {
    score: 850,
    prestigeLevel: 1,
    prestigeYear: new Date().getFullYear(),
    highestScore: 850,
    lastWorkoutTimestamp: null,
    unlockedBadges: []
  };
  if (store.settings.vibrationEnabled) triggerHaptic("warning");
  return { success: true, message: "训练打卡与形体记录已全部清空，回归纯净初始状态" };
}

export function resetAllDataToDefault() {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(store, JSON.parse(JSON.stringify(defaultInitialState)));
  applyThemeToDOM("default", "dark");
  if (store.settings.vibrationEnabled) triggerHaptic("warning");
}

export function exportBackupJSON() {
  const data = {
    plans: store.plans,
    exercises: store.exercises,
    activeCycle: store.activeCycle,
    anchorDate: store.anchorDate,
    cycleMode: store.cycleMode,
    weeklySchedule: store.weeklySchedule,
    workoutLogs: store.workoutLogs,
    bodyMetrics: store.bodyMetrics || [],
    honorProfile: store.honorProfile || defaultInitialState.honorProfile,
    settings: store.settings,
    exportTime: new Date().toISOString(),
    version: "1.1"
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !parsed.plans || !parsed.activeCycle) {
      throw new Error("Invalid backup format");
    }
    store.plans = parsed.plans;
    if (parsed.exercises) store.exercises = parsed.exercises;
    store.activeCycle = parsed.activeCycle;
    if (parsed.anchorDate) store.anchorDate = parsed.anchorDate;
    if (parsed.cycleMode) store.cycleMode = parsed.cycleMode;
    if (parsed.weeklySchedule) store.weeklySchedule = parsed.weeklySchedule;
    if (parsed.workoutLogs) store.workoutLogs = parsed.workoutLogs;
    if (parsed.bodyMetrics) {
      store.bodyMetrics = parsed.bodyMetrics;
    } else if (!store.bodyMetrics) {
      store.bodyMetrics = JSON.parse(JSON.stringify(defaultInitialState.bodyMetrics));
    }
    if (parsed.honorProfile) {
      store.honorProfile = parsed.honorProfile;
    } else if (!store.honorProfile) {
      store.honorProfile = JSON.parse(JSON.stringify(defaultInitialState.honorProfile));
    }
    if (parsed.settings) {
      store.settings = sanitizeSettings(parsed.settings);
      applyThemeToDOM(store.settings.uiSkin, store.settings.themeMode);
    }
    if (store.settings.vibrationEnabled) triggerHaptic("success");
    return true;
  } catch (e) {
    console.error("Import error:", e);
    return false;
  }
}

// --- BODY METRICS & HONOR SYSTEM ACTIONS ---
export function recordBodyMetric(metricData) {
  if (!store.bodyMetrics) store.bodyMetrics = [];
  const now = Date.now();

  const previousMetrics = store.bodyMetrics.filter(m => m.timestamp || m.date);
  const lastMetric = previousMetrics.length > 0 ? previousMetrics[previousMetrics.length - 1] : null;
  const lastTime = lastMetric ? (lastMetric.timestamp || new Date(lastMetric.date).getTime() || 0) : 0;
  const hoursSinceLast = lastTime > 0 ? (now - lastTime) / (1000 * 3600) : 9999;

  const entry = {
    id: uid("metric"),
    date: metricData.date || getInitialDateStr(),
    timestamp: now,
    arm: Number(metricData.arm) || 0,
    chest: Number(metricData.chest) || 0,
    waist: Number(metricData.waist) || 0,
    thigh: Number(metricData.thigh) || 0,
    weight: Number(metricData.weight) || 0
  };
  store.bodyMetrics.push(entry);

  if (!store.honorProfile) {
    store.honorProfile = { score: 850, prestigeLevel: 1, prestigeYear: new Date().getFullYear(), highestScore: 850, lastWorkoutTimestamp: now, unlockedBadges: [] };
  }

  // Anti-Exploit Rule (Article 6.3): 7-Day Cooldown for baseline recording points (+20 FPS)
  let awardedPoints = 0;
  if (hoursSinceLast >= 168) {
    awardedPoints = 20;
    store.honorProfile.score = (store.honorProfile.score || 0) + awardedPoints;
  }

  // Refresh badges & check if new badges were unlocked
  const badgesBefore = new Set(store.honorProfile.unlockedBadges || []);
  const currentBadges = refreshUnlockedBadges();
  const newlyUnlocked = currentBadges.filter(b => !badgesBefore.has(b.id));

  // Milestone bonus for newly unlocked body aesthetic badges (+50 FPS per milestone)
  if (newlyUnlocked.length > 0) {
    const milestoneBonus = newlyUnlocked.length * 50;
    awardedPoints += milestoneBonus;
    store.honorProfile.score = (store.honorProfile.score || 0) + milestoneBonus;
  }

  if (store.honorProfile.score > (store.honorProfile.highestScore || 0)) {
    store.honorProfile.highestScore = store.honorProfile.score;
  }

  if (store.settings.vibrationEnabled) triggerHaptic("success");
  return { entry, awardedPoints, isCooldown: hoursSinceLast < 168 };
}

export function deleteBodyMetric(id) {
  if (!store.bodyMetrics) return;
  store.bodyMetrics = store.bodyMetrics.filter(m => m.id !== id);
}

export function getHonorStatsSnapshot() {
  const totalWorkouts = (store.workoutLogs || []).length;
  let totalTonnageKg = 0;
  let maxBench = 0;
  let maxSquat = 0;

  (store.workoutLogs || []).forEach(l => {
    totalTonnageKg += (l.totalVolume || 0);
    (l.exercises || []).forEach(e => {
      const eName = (e.name || "").toLowerCase();
      const maxSetWeight = Math.max(...(e.sets || []).filter(s => s.completed).map(s => Number(s.weight) || 0), 0);
      if (eName.includes("卧推") || eName.includes("bench")) {
        if (maxSetWeight > maxBench) maxBench = maxSetWeight;
      }
      if (eName.includes("深蹲") || eName.includes("squat") || eName.includes("腿举")) {
        if (maxSetWeight > maxSquat) maxSquat = maxSetWeight;
      }
    });
  });

  const userWeight = (store.bodyMetrics && store.bodyMetrics.length > 0)
    ? (store.bodyMetrics[store.bodyMetrics.length - 1].weight || 70)
    : 70;

  return {
    totalWorkouts,
    totalTonnageKg,
    consecutiveWeeks: Math.min(12, Math.floor(totalWorkouts / 3)),
    bodyMetricsHistory: store.bodyMetrics || [],
    maxBenchRatio: userWeight > 0 ? maxBench / userWeight : 0,
    maxSquatRatio: userWeight > 0 ? maxSquat / userWeight : 0,
    hasBrokenPR: maxBench > 0 || maxSquat > 0,
    perfectSessionsCount: (store.workoutLogs || []).filter(l => (l.totalSets || 0) >= 12).length
  };
}

export function getUnlockedBadgesList() {
  const stats = getHonorStatsSnapshot();
  const badges = evaluateUnlockedBadges(stats);
  const storedIds = store.honorProfile?.unlockedBadges || [];
  const allIds = Array.from(new Set([...storedIds, ...badges.map(b => b.id)]));
  return allIds.map(id => ({ id, unlocked: true }));
}

export function refreshUnlockedBadges() {
  const badges = getUnlockedBadgesList();
  if (!store.honorProfile) {
    store.honorProfile = { score: 850, prestigeLevel: 1, prestigeYear: new Date().getFullYear(), highestScore: 850, lastWorkoutTimestamp: Date.now(), unlockedBadges: [] };
  }
  store.honorProfile.unlockedBadges = badges.map(b => b.id);
  return badges;
}

export function getFullHonorProfile() {
  const honor = store.honorProfile || { score: 850, prestigeLevel: 1, prestigeYear: new Date().getFullYear(), highestScore: 850, lastWorkoutTimestamp: Date.now() - 86400000, unlockedBadges: [] };

  const rawScore = honor.score || 0;
  const currentTier = getTierForScore(rawScore);

  // Inactivity decay calculation with Deload Shield check
  const isDeloadActive = !!(honor.deloadShieldUntil && honor.deloadShieldUntil > Date.now());
  const lastTime = honor.lastWorkoutTimestamp || (store.workoutLogs?.[0]?.timestamp || Date.now() - 86400000);
  const hoursSince = Math.max(0, (Date.now() - lastTime) / (1000 * 3600));
  const decayInfo = calculateInactivityDecay(hoursSince, rawScore, currentTier.minScore, isDeloadActive);
  const decayedScore = Math.max(currentTier.minScore, rawScore - decayInfo.decayPoints);

  const finalTier = getTierForScore(decayedScore);
  const allUnlocked = getUnlockedBadgesList();
  const presentation = getSkinHonorPresentation(store.settings.uiSkin, finalTier, allUnlocked);

  // Deload Shield Inventory & Cooldown Calculations (16 Distinct Training Days / Shield, 21-Day Cooldown)
  const usedShields = honor.usedShieldsCount || 0;
  const shieldInventory = calculateShieldInventory(store.workoutLogs, usedShields, 0);
  const isCooldownActive = !!(honor.shieldCooldownUntil && honor.shieldCooldownUntil > Date.now() && !isDeloadActive);
  const cooldownDaysRemaining = isCooldownActive ? Math.ceil((honor.shieldCooldownUntil - Date.now()) / (1000 * 86400)) : 0;
  const shieldDaysRemaining = isDeloadActive ? Math.max(1, Math.ceil((honor.deloadShieldUntil - Date.now()) / (1000 * 86400))) : 0;

  return {
    score: decayedScore,
    rawScore,
    decayInfo,
    tier: finalTier,
    presentation,
    prestigeLevel: honor.prestigeLevel || 1,
    prestigeYear: honor.prestigeYear || new Date().getFullYear(),
    highestScore: honor.highestScore || rawScore,
    badges: presentation.badges,
    isDeloadActive,
    deloadShieldUntil: honor.deloadShieldUntil || 0,
    shieldDaysRemaining,
    isCooldownActive,
    cooldownDaysRemaining,
    shieldInventory
  };
}

export function toggleDeloadShield(enable, days = 7) {
  if (!store.honorProfile) {
    store.honorProfile = { score: 850, prestigeLevel: 1, prestigeYear: new Date().getFullYear(), highestScore: 850, lastWorkoutTimestamp: Date.now(), unlockedBadges: [] };
  }
  const honor = store.honorProfile;
  const usedShields = honor.usedShieldsCount || 0;
  const shieldInventory = calculateShieldInventory(store.workoutLogs, usedShields, 0);

  if (enable) {
    // Check if user has available shields
    if (shieldInventory.available <= 0) {
      if (store.settings.vibrationEnabled) triggerHaptic("warning");
      const msg = shieldInventory.isNoviceProbation
        ? `新兵筑基保护期（当前 ${shieldInventory.uniqueTrainingDays}/16 天训练）：神经募集建立阶段暂无中枢疲劳，完成 16 天规律特训后将自动铸造首枚免战盾牌！`
        : `战术盾牌数量不足！每扎实完成 16 天有效特训（每日最多累积1天进度）充能 1 枚（当前充能进度 ${shieldInventory.currentChargeWorkouts}/16 天）。`;
      return { 
        success: false, 
        reason: "no_shield", 
        message: msg 
      };
    }

    // Check cooldown (21-Day Periodization Adaptation Cooldown)
    if (honor.shieldCooldownUntil && honor.shieldCooldownUntil > Date.now() && !(honor.deloadShieldUntil && honor.deloadShieldUntil > Date.now())) {
      const daysLeft = Math.ceil((honor.shieldCooldownUntil - Date.now()) / (1000 * 86400));
      if (store.settings.vibrationEnabled) triggerHaptic("warning");
      return { 
        success: false, 
        reason: "cooldown", 
        message: `周期化减载冷却中！完成休整后需保证 21 天规律超负荷训练方可再次进入减载，距下次可用还剩 ${daysLeft} 天。` 
      };
    }

    // Consume 1 shield and activate (7 days active + 21 days cooldown)
    honor.usedShieldsCount = usedShields + 1;
    honor.deloadShieldUntil = Date.now() + days * 86400000;
    honor.shieldCooldownUntil = Date.now() + (days + 21) * 86400000;
    if (store.settings.vibrationEnabled) triggerHaptic("medium");
    return { success: true, message: `已成功消耗 1 枚战术盾牌，开启 ${days} 天生理减载免战保护！` };
  } else {
    honor.deloadShieldUntil = 0;
    if (store.settings.vibrationEnabled) triggerHaptic("light");
    return { success: true, message: "已提前归队，恢复正常做工战力结算！" };
  }
}

export function performPrestigeReset() {
  if (!store.honorProfile) return false;
  if ((store.honorProfile.score || 0) < 2900) return false;

  store.honorProfile.prestigeLevel = Math.min(6, (store.honorProfile.prestigeLevel || 1) + 1);
  store.honorProfile.score = 2400; // soft reset to Tier 6
  if (store.settings.vibrationEnabled) triggerHaptic("success");
  return true;
}

// --- STRENGTH LEVEL PROFILES & ADAPTIVE ONBOARDING ENGINE ---
export const STRENGTH_LEVEL_CONFIGS = {
  beginner: {
    id: "beginner",
    name: "新手筑基",
    badge: "🌱 新手",
    desc: "适合刚接触健身 0~3 个月，注重建立正确发力轨迹",
    initialScore: 200,
    benchBase: 25,
    squatBase: 35,
    pullBase: 25,
    weights: {
      "上斜哑铃卧推": 12.5,
      "固定器械推胸": 25,
      "绳索侧平举": 3.75,
      "对握/宽握高位下拉": 25,
      "坐姿绳索划船": 25,
      "上斜哑铃弯举": 6,
      "哈克深蹲 / 倒蹬腿举": 35,
      "罗马尼亚硬拉 (RDL)": 30,
      "俯卧器械腿弯举 (Lying Leg Curl)": 20
    }
  },
  intermediate: {
    id: "intermediate",
    name: "进阶中坚",
    badge: "⚡ 中坚",
    desc: "适合有 3~12 个月规律健身习惯，具备稳定做工能力",
    initialScore: 850,
    benchBase: 50,
    squatBase: 70,
    pullBase: 45,
    weights: {
      "上斜哑铃卧推": 20,
      "固定器械推胸": 45,
      "绳索侧平举": 7.5,
      "对握/宽握高位下拉": 45,
      "坐姿绳索划船": 40,
      "上斜哑铃弯举": 10,
      "哈克深蹲 / 倒蹬腿举": 60,
      "罗马尼亚硬拉 (RDL)": 50,
      "俯卧器械腿弯举 (Lying Leg Curl)": 35
    }
  },
  advanced: {
    id: "advanced",
    name: "资深老手",
    badge: "🔥 老手",
    desc: "适合系统抗阻训练 1 年以上，大负荷力量老铁",
    initialScore: 1400,
    benchBase: 80,
    squatBase: 110,
    pullBase: 70,
    weights: {
      "上斜哑铃卧推": 30,
      "固定器械推胸": 75,
      "绳索侧平举": 12.5,
      "对握/宽握高位下拉": 70,
      "坐姿绳索划船": 65,
      "上斜哑铃弯举": 15,
      "哈克深蹲 / 倒蹬腿举": 110,
      "罗马尼亚硬拉 (RDL)": 90,
      "俯卧器械腿弯举 (Lying Leg Curl)": 55
    }
  }
};

export function setStrengthLevelAndRecalibrate(levelKey, customBases = null) {
  const config = STRENGTH_LEVEL_CONFIGS[levelKey] || STRENGTH_LEVEL_CONFIGS.intermediate;
  store.settings.strengthLevel = levelKey;
  store.settings.hasConfiguredStrength = true;

  let weightsMap = { ...config.weights };

  if (levelKey === "custom" && customBases) {
    store.settings.customBaseWeights = { ...customBases };
    const b = Number(customBases.bench) || 50;
    const s = Number(customBases.squat) || 70;
    const p = Number(customBases.pull) || 45;
    weightsMap = {
      "上斜哑铃卧推": Math.max(5, Math.round(b * 0.35 / 2.5) * 2.5),
      "固定器械推胸": Math.max(10, Math.round(b * 0.85 / 2.5) * 2.5),
      "绳索侧平举": Math.max(2.5, Math.round(b * 0.15 / 1.25) * 1.25),
      "对握/宽握高位下拉": Math.max(10, Math.round(p * 0.9 / 2.5) * 2.5),
      "坐姿绳索划船": Math.max(10, Math.round(p * 0.8 / 2.5) * 2.5),
      "上斜哑铃弯举": Math.max(4, Math.round(p * 0.2 / 2) * 2),
      "哈克深蹲 / 倒蹬腿举": Math.max(20, Math.round(s * 0.9 / 5) * 5),
      "罗马尼亚硬拉 (RDL)": Math.max(20, Math.round(s * 0.75 / 5) * 5),
      "俯卧器械腿弯举 (Lying Leg Curl)": Math.max(10, Math.round(s * 0.45 / 2.5) * 2.5)
    };
  }

  // 1. Update all plans' exercises defaultWeight in store.plans
  if (store.plans) {
    store.plans.forEach(plan => {
      if (plan.exercises) {
        plan.exercises.forEach(pe => {
          if (weightsMap[pe.name] !== undefined) {
            pe.defaultWeight = weightsMap[pe.name];
          }
        });
      }
    });
  }

  // 2. If active workout exists, update all uncompleted sets!
  if (store.activeWorkout && store.activeWorkout.exercises) {
    store.activeWorkout.exercises.forEach(ex => {
      const targetW = weightsMap[ex.name];
      if (targetW !== undefined && ex.sets) {
        ex.sets.forEach(s => {
          if (!s.completed) {
            s.weight = targetW;
          }
        });
      }
    });
  }

  // 3. Update honorProfile score if user has no completed workout logs yet
  if (!store.workoutLogs || store.workoutLogs.length === 0) {
    if (!store.honorProfile) {
      store.honorProfile = { score: config.initialScore, prestigeLevel: 1, prestigeYear: new Date().getFullYear(), highestScore: config.initialScore, lastWorkoutTimestamp: null, unlockedBadges: [] };
    } else {
      store.honorProfile.score = config.initialScore;
      store.honorProfile.highestScore = Math.max(store.honorProfile.highestScore || 0, config.initialScore);
    }
  }

  if (store.settings.vibrationEnabled) {
    triggerHaptic("success");
  }

  return { success: true, levelKey, weightsMap };
}

/**
 * 保存用户生理特征与体能感知，并自适应重新校准全计划起步重量
 * @param {Object} profileData
 */
export function saveUserProfileAndRecalibrate(profileData = {}) {
  // 1. 同步身体生理设置
  if (profileData.gender) store.settings.gender = profileData.gender;
  if (profileData.userAge) store.settings.userAge = Number(profileData.userAge) || store.settings.userAge;
  if (profileData.userHeight) store.settings.userHeight = Number(profileData.userHeight) || store.settings.userHeight;
  if (profileData.userWeight) store.settings.userWeight = Number(profileData.userWeight) || store.settings.userWeight;
  if (profileData.trainingGoal) store.settings.trainingGoal = profileData.trainingGoal;
  if (profileData.pushupTier) store.settings.pushupTier = profileData.pushupTier;
  if (profileData.squatTier) store.settings.squatTier = profileData.squatTier;
  if (profileData.strengthLevel) store.settings.strengthLevel = profileData.strengthLevel;
  store.settings.hasConfiguredStrength = true;

  // 2. 自动存入第一笔身体基准档案 (若暂无记录)
  if (!store.bodyMetrics) store.bodyMetrics = [];
  const currentWeight = Number(store.settings.userWeight) || 70;
  if (store.bodyMetrics.length === 0 && currentWeight > 0) {
    store.bodyMetrics.push({
      id: uid("metric"),
      date: getInitialDateStr(),
      timestamp: Date.now(),
      weight: currentWeight,
      arm: 0,
      chest: 0,
      waist: 0,
      thigh: 0
    });
  } else if (store.bodyMetrics.length > 0 && currentWeight > 0) {
    const latest = store.bodyMetrics[store.bodyMetrics.length - 1];
    if (latest && !latest.weight) {
      latest.weight = currentWeight;
    }
  }

  // 3. 计算重量映射表
  let weightsMap = {};
  let bases = {};

  if (profileData.useCustom && profileData.customBases) {
    store.settings.customBaseWeights = { ...profileData.customBases };
    store.settings.strengthLevel = "custom";
    const b = Number(profileData.customBases.bench) || 50;
    const s = Number(profileData.customBases.squat) || 70;
    const p = Number(profileData.customBases.pull) || 45;
    weightsMap = {
      "上斜哑铃卧推": Math.max(5, Math.round(b * 0.35 / 2.5) * 2.5),
      "固定器械推胸": Math.max(10, Math.round(b * 0.85 / 2.5) * 2.5),
      "绳索侧平举": Math.max(2.5, Math.round(b * 0.15 / 1.25) * 1.25),
      "对握/宽握高位下拉": Math.max(10, Math.round(p * 0.9 / 2.5) * 2.5),
      "坐姿绳索划船": Math.max(10, Math.round(p * 0.8 / 2.5) * 2.5),
      "上斜哑铃弯举": Math.max(4, Math.round(p * 0.2 / 2) * 2),
      "哈克深蹲 / 倒蹬腿举": Math.max(20, Math.round(s * 0.9 / 5) * 5),
      "罗马尼亚硬拉 (RDL)": Math.max(20, Math.round(s * 0.75 / 5) * 5),
      "俯卧器械腿弯举 (Lying Leg Curl)": Math.max(10, Math.round(s * 0.45 / 2.5) * 2.5)
    };
    bases = { bench: b, squat: s, pull: p };
  } else {
    const res = calculateAdaptiveWeights({
      gender: store.settings.gender,
      weightKg: currentWeight,
      pushupTier: store.settings.pushupTier,
      squatTier: store.settings.squatTier,
      experienceLevel: store.settings.strengthLevel || "intermediate"
    });
    weightsMap = res.weightsMap;
    bases = res.estimatedBases;
    store.settings.customBaseWeights = { ...bases };
  }

  // 4. 更新全局计划库初始组重
  if (store.plans) {
    store.plans.forEach(plan => {
      if (plan.exercises) {
        plan.exercises.forEach(pe => {
          if (weightsMap[pe.name] !== undefined) {
            pe.defaultWeight = weightsMap[pe.name];
          }
        });
      }
    });
  }

  // 5. 若有正在进行的训练，同步更新所有未完成组
  if (store.activeWorkout && store.activeWorkout.exercises) {
    store.activeWorkout.exercises.forEach(ex => {
      const targetW = weightsMap[ex.name];
      if (targetW !== undefined && ex.sets) {
        ex.sets.forEach(s => {
          if (!s.completed) {
            s.weight = targetW;
          }
        });
      }
    });
  }

  // 6. 若用户尚未打卡过，计算基于相对力量的天梯初始积分
  if (!store.workoutLogs || store.workoutLogs.length === 0) {
    const initialScore = getInitialHonorScore(store.settings.strengthLevel, (bases.bench || 50) / (currentWeight || 70));
    if (!store.honorProfile) {
      store.honorProfile = { score: initialScore, prestigeLevel: 1, prestigeYear: new Date().getFullYear(), highestScore: initialScore, lastWorkoutTimestamp: null, unlockedBadges: [] };
    } else {
      store.honorProfile.score = initialScore;
      store.honorProfile.highestScore = Math.max(store.honorProfile.highestScore || 0, initialScore);
    }
  }

  if (store.settings.vibrationEnabled) {
    triggerHaptic("success");
  }

  return { success: true, weightsMap, bases };
}

export function setExerciseAllSetsWeight(exerciseIndex, newWeight) {
  if (!store.activeWorkout) return 0;
  const ex = store.activeWorkout.exercises[exerciseIndex];
  if (!ex || !ex.sets) return 0;
  const w = Math.max(0, Number(newWeight) || 0);
  let updatedCount = 0;
  ex.sets.forEach(s => {
    if (!s.completed) {
      s.weight = w;
      updatedCount++;
    }
  });
  if (store.settings.vibrationEnabled) triggerHaptic("light");
  return updatedCount;
}

export function adjustExerciseAllSetsWeight(exerciseIndex, delta) {
  if (!store.activeWorkout) return 0;
  const ex = store.activeWorkout.exercises[exerciseIndex];
  if (!ex || !ex.sets) return 0;
  let updatedCount = 0;
  ex.sets.forEach(s => {
    if (!s.completed) {
      s.weight = Math.max(0, Number(((Number(s.weight) || 0) + delta).toFixed(1)));
      updatedCount++;
    }
  });
  if (store.settings.vibrationEnabled) triggerHaptic("light");
  return updatedCount;
}

export function syncFirstSetToAllSets(exerciseIndex) {
  if (!store.activeWorkout) return 0;
  const ex = store.activeWorkout.exercises[exerciseIndex];
  if (!ex || !ex.sets || ex.sets.length === 0) return 0;
  const firstSet = ex.sets[0];
  const targetW = Number(firstSet.weight) || 0;
  const targetR = Number(firstSet.reps) || 0;
  let updatedCount = 0;
  ex.sets.forEach((s, idx) => {
    if (idx > 0 && !s.completed) {
      s.weight = targetW;
      s.reps = targetR;
      updatedCount++;
    }
  });
  if (store.settings.vibrationEnabled) triggerHaptic("medium");
  return updatedCount;
}


import { reactive, watch } from "vue";
import { DEFAULT_EXERCISES, DEFAULT_PLANS, PRESET_CYCLES, SCIENCE_PRINCIPLES } from "../data/defaultPlans.js";
import { playSetCompleteSound, playRestCompleteSound, playWorkoutDoneSound } from "../utils/audio.js";
import { triggerHaptic } from "../utils/vibrate.js";
import { DEFAULT_SETTINGS, sanitizeSettings, verifyPasscode, getPasscodeSkin, VALID_SKINS, applySkinToDOM } from "../utils/themeManager.js";

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
          return customMatch ? { ...defEx, ...customMatch, gifUrl: defEx.gifUrl, tips: defEx.tips, substitutes: defEx.substitutes, scienceDetail: defEx.scienceDetail || customMatch.scienceDetail } : defEx;
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

      // Deep sanitize settings for backward compatibility & theme system
      parsed.settings = sanitizeSettings(parsed.settings);

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
  workoutLogs: [
    // Pre-populate a realistic sample log for yesterday so user immediately sees how it works!
    {
      id: "sample-log-prev",
      date: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return getInitialDateStr(d);
      })(),
      planId: "plan-push",
      planName: "推日 (Push) —— 打造铠甲胸与加宽肩膀",
      shortName: "推日",
      color: "amber",
      durationSeconds: 3120, // 52 min
      totalVolume: 5620,
      totalSets: 17,
      completedAt: Date.now() - 86400000,
      exercises: [
        {
          exerciseId: "ex-incline-db-bench",
          name: "上斜哑铃卧推",
          targetReps: "8-10次",
          sets: [
            { id: "s-1", weight: 22, reps: 10, completed: true, isWarmup: false },
            { id: "s-2", weight: 24, reps: 10, completed: true, isWarmup: false },
            { id: "s-3", weight: 26, reps: 8, completed: true, isWarmup: false },
            { id: "s-4", weight: 26, reps: 8, completed: true, isWarmup: false },
          ]
        },
        {
          exerciseId: "ex-machine-chest-press",
          name: "固定器械推胸（最好是双轴收敛机）",
          targetReps: "10-12次",
          sets: [
            { id: "s-5", weight: 45, reps: 12, completed: true, isWarmup: false },
            { id: "s-6", weight: 50, reps: 10, completed: true, isWarmup: false },
            { id: "s-7", weight: 50, reps: 9, completed: true, isWarmup: false },
          ]
        },
        {
          exerciseId: "ex-cable-lateral-raise",
          name: "绳索/哑铃侧平举（更推崇绳索）",
          targetReps: "12-15次",
          sets: [
            { id: "s-8", weight: 7.5, reps: 15, completed: true, isWarmup: false },
            { id: "s-9", weight: 7.5, reps: 15, completed: true, isWarmup: false },
            { id: "s-10", weight: 9, reps: 12, completed: true, isWarmup: false },
            { id: "s-11", weight: 9, reps: 12, completed: true, isWarmup: false },
          ]
        },
        {
          exerciseId: "ex-machine-shoulder-press",
          name: "固定器械推肩",
          targetReps: "10-12次",
          sets: [
            { id: "s-12", weight: 35, reps: 12, completed: true, isWarmup: false },
            { id: "s-13", weight: 40, reps: 10, completed: true, isWarmup: false },
            { id: "s-14", weight: 40, reps: 9, completed: true, isWarmup: false },
          ]
        },
        {
          exerciseId: "ex-overhead-cable-ext",
          name: "过头绳索臂屈伸（面向绳索龙门架）",
          targetReps: "12-15次",
          sets: [
            { id: "s-15", weight: 15, reps: 15, completed: true, isWarmup: false },
            { id: "s-16", weight: 17.5, reps: 12, completed: true, isWarmup: false },
            { id: "s-17", weight: 17.5, reps: 11, completed: true, isWarmup: false },
          ]
        }
      ]
    }
  ],
  activeWorkout: null,
  restTimer: {
    running: false,
    duration: 90,
    remaining: 90,
    endTime: null,
    minimized: false,
    intervalId: null
  },
  settings: {
    ...DEFAULT_SETTINGS
  }
};

// Merge saved data with defaults
const saved = loadSavedState();
export const store = reactive(saved ? { ...defaultInitialState, ...saved, settings: sanitizeSettings(saved.settings) } : defaultInitialState);

// Immediately apply current skin to document
applySkinToDOM(store.settings.uiSkin);

// Watch for UI skin changes and keep DOM attribute / theme-color updated
watch(
  () => store.settings.uiSkin,
  (newSkin) => {
    applySkinToDOM(newSkin);
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

export function startRestTimer(seconds = store.settings.defaultRestSeconds) {
  if (timerInterval) clearInterval(timerInterval);
  
  store.restTimer.duration = seconds;
  store.restTimer.remaining = seconds;
  store.restTimer.endTime = Date.now() + seconds * 1000;
  store.restTimer.running = true;
  store.restTimer.minimized = false;

  timerInterval = setInterval(() => {
    const left = Math.round((store.restTimer.endTime - Date.now()) / 1000);
    if (left <= 0) {
      stopRestTimer();
      store.restTimer.remaining = 0;
      if (store.settings.soundEnabled) playRestCompleteSound();
      if (store.settings.vibrationEnabled) triggerHaptic("success");
    } else {
      store.restTimer.remaining = left;
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

export function addExerciseToActiveWorkout(exerciseItem) {
  if (!store.activeWorkout) return;
  const lastPerf = getLastExercisePerformance(exerciseItem.name);
  const sets = [];
  const defaultSetsCount = exerciseItem.defaultSets || 3;

  for (let i = 0; i < defaultSetsCount; i++) {
    let w = 20;
    let r = 10;
    if (lastPerf && lastPerf.sets[i]) {
      w = lastPerf.sets[i].weight;
      r = lastPerf.sets[i].reps;
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
    exerciseId: exerciseItem.id,
    name: exerciseItem.name,
    targetReps: `${exerciseItem.defaultReps || "10-12"}次`,
    scienceDetail: exerciseItem.scienceDetail || "",
    category: exerciseItem.category || "其它",
    tags: exerciseItem.tags || [],
    sets,
    collapsed: false
  });
  if (store.settings.vibrationEnabled) triggerHaptic("medium");
}

export function replaceExerciseInActiveWorkout(exerciseIndex, newExerciseItem) {
  if (!store.activeWorkout) return;
  const lastPerf = getLastExercisePerformance(newExerciseItem.name);
  const ex = store.activeWorkout.exercises[exerciseIndex];
  if (!ex) return;

  const setsCount = ex.sets.length || newExerciseItem.defaultSets || 3;
  const newSets = [];

  for (let i = 0; i < setsCount; i++) {
    let w = 20;
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
  
  // Clean active workout & stop timer
  stopRestTimer();
  const summary = { ...logEntry };
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
export function unlockSkin(passcodeInput) {
  const targetSkin = getPasscodeSkin(passcodeInput);
  if (!targetSkin) {
    return { success: false, message: "暗号不正确" };
  }

  if (!store.settings.unlockedSkins.includes(targetSkin)) {
    store.settings.unlockedSkins.push(targetSkin);
  }
  store.settings.uiSkin = targetSkin;
  applySkinToDOM(targetSkin);

  if (store.settings.vibrationEnabled) triggerHaptic("success");
  
  const skinMessages = {
    chamber: "尚博勒灵感隐藏界面皮肤已激活！",
    cs: "💥 C4 已安放！CS2 完美特训战术皮肤已激活！"
  };
  return { success: true, skin: targetSkin, message: skinMessages[targetSkin] || "隐藏皮肤已解锁" };
}

export function unlockChamberSkin(passcodeInput) {
  return unlockSkin(passcodeInput);
}

export function setUISkin(skinName) {
  const target = VALID_SKINS.includes(skinName) ? skinName : "default";
  if (target === "default" || store.settings.unlockedSkins.includes(target)) {
    store.settings.uiSkin = target;
    applySkinToDOM(target);
    if (store.settings.vibrationEnabled) triggerHaptic("light");
  }
}

export function restoreDefaultSkin() {
  store.settings.uiSkin = "default";
  applySkinToDOM("default");
  if (store.settings.vibrationEnabled) triggerHaptic("light");
  return { success: true, message: "已恢复默认外观，训练数据未改变" };
}

export function resetAllDataToDefault() {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(store, JSON.parse(JSON.stringify(defaultInitialState)));
  applySkinToDOM("default");
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
    if (parsed.settings) {
      store.settings = sanitizeSettings(parsed.settings);
      applySkinToDOM(store.settings.uiSkin);
    }
    if (store.settings.vibrationEnabled) triggerHaptic("success");
    return true;
  } catch (e) {
    console.error("Import error:", e);
    return false;
  }
}


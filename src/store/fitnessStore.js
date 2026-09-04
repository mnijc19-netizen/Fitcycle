import { reactive, watch } from "vue";
import { DEFAULT_EXERCISES, DEFAULT_PLANS, PRESET_CYCLES, SCIENCE_PRINCIPLES } from "../data/defaultPlans.js";
import { playSetCompleteSound, playRestCompleteSound, playWorkoutDoneSound } from "../utils/audio.js";
import { triggerHaptic } from "../utils/vibrate.js";
import { universalScrollToTop } from "../utils/scrollUtils.js";
import { requestNotificationPermission, sendRestCompleteNotification, updateDocumentTitleForTimer, setRestCompleteTitle, resetDocumentTitle } from "../utils/notification.js";
import { DEFAULT_SETTINGS, sanitizeSettings, verifyPasscode, getPasscodeSkin, VALID_SKINS, VALID_THEME_MODES, applySkinToDOM, applyThemeToDOM } from "../utils/themeManager.js";
import { calculateInactivityDecay, calculateSessionPointsEarned, getTierForScore, evaluateUnlockedBadges, calculateEquivalentTonnage, calculateShieldInventory } from "../engine/honorEngine.js";
import { getSkinHonorPresentation } from "../engine/skinHonorSchemas.js";

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


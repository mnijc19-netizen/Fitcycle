/**
 * FitCycle Anti-Cheat, Outlier Smoothing & Human Biomechanics Limit Engine
 * Enforces biological and physical boundaries based on raw world records
 * to protect Honor Tier ladder integrity and prevent absurd volume spikes.
 */

// Human anatomical limits based on IPF / Raw World Records
export const BIOMECHANICAL_LIMITS = {
  deadlift: { maxWeight: 501, maxReps: 100, label: "硬拉 (世界纪录极限 ~501kg)" },
  squat: { maxWeight: 490, maxReps: 100, label: "深蹲 (世界纪录极限 ~490kg)" },
  bench_barbell: { maxWeight: 355, maxReps: 100, label: "杠铃卧推 (世界纪录极限 ~355kg)" },
  overhead_press: { maxWeight: 225, maxReps: 100, label: "推举 (世界纪录极限 ~225kg)" },
  dumbbell_heavy: { maxWeight: 90, maxReps: 100, label: "单手哑铃卧推/划船 (极限 ~90kg/只)" },
  dumbbell_isolated: { maxWeight: 45, maxReps: 100, label: "哑铃平举/弯举 (极限 ~45kg/只)" },
  machine_cable: { maxWeight: 200, maxReps: 100, label: "固定器械/绳索配重 (极限 ~200kg)" },
  calisthenics: { maxWeight: 150, maxReps: 150, label: "自重负重/徒手 (极限负重 ~150kg)" },
  general_default: { maxWeight: 350, maxReps: 100, label: "通用负重安全上限 (~350kg)" }
};

// Maximum Honor PTS earnable in a single workout session to prevent single-day ladder spoofing
export const MAX_SESSION_HONOR_POINTS = 100;

// Maximum realistic 1RM to bodyweight ratios
export const MAX_STRENGTH_RATIOS = {
  bench: 3.5,   // ~3.5x bodyweight is elite raw bench
  squat: 4.5,   // ~4.5x bodyweight is elite raw squat
  deadlift: 5.0 // ~5.0x bodyweight is elite raw deadlift
};

/**
 * Resolves the physical limit bracket for a given exercise name and category
 * @param {string} exerciseName 
 * @param {string} category 
 * @returns {Object} limit configuration
 */
export function getPhysicalLimitsForExercise(exerciseName = "", category = "") {
  const name = String(exerciseName).toLowerCase();
  const cat = String(category).toLowerCase();

  if (name.includes("硬拉") || name.includes("deadlift") || name.includes("rdl")) {
    return BIOMECHANICAL_LIMITS.deadlift;
  }
  if (name.includes("深蹲") || name.includes("squat") || name.includes("倒蹬") || name.includes("哈克")) {
    return BIOMECHANICAL_LIMITS.squat;
  }
  if (name.includes("杠铃") && (name.includes("卧推") || name.includes("bench"))) {
    return BIOMECHANICAL_LIMITS.bench_barbell;
  }
  if (name.includes("推举") || name.includes("推肩") || name.includes("press") && (name.includes("肩") || name.includes("overhead"))) {
    return BIOMECHANICAL_LIMITS.overhead_press;
  }
  if (name.includes("侧平举") || name.includes("前平举") || name.includes("弯举") || name.includes("面拉") || name.includes("臂屈伸")) {
    return BIOMECHANICAL_LIMITS.dumbbell_isolated;
  }
  if (name.includes("哑铃") || name.includes("db") || name.includes("dumbbell")) {
    return BIOMECHANICAL_LIMITS.dumbbell_heavy;
  }
  if (name.includes("器械") || name.includes("绳索") || name.includes("机") || name.includes("cable") || name.includes("machine")) {
    return BIOMECHANICAL_LIMITS.machine_cable;
  }
  if (cat.includes("自重") || cat.includes("核心") || name.includes("引体向上") || name.includes("双杠") || name.includes("举腿")) {
    return BIOMECHANICAL_LIMITS.calisthenics;
  }

  return BIOMECHANICAL_LIMITS.general_default;
}

/**
 * Sanitizes and clamps a single workout set input
 * @param {string} exerciseName 
 * @param {number|string} weight 
 * @param {number|string} reps 
 * @param {string} category 
 * @returns {Object} { weight, reps, wasClamped, originalWeight, originalReps, reason }
 */
export function clampSetInput(exerciseName = "", weight = 0, reps = 0, category = "") {
  const rawWeight = Number(weight) || 0;
  const rawReps = Number(reps) || 0;
  const limits = getPhysicalLimitsForExercise(exerciseName, category);

  let clampedWeight = Math.max(0, rawWeight);
  let clampedReps = Math.max(0, rawReps);
  let wasClamped = false;
  const reasons = [];

  if (clampedWeight > limits.maxWeight) {
    reasons.push(`重量超出生理上限 (${clampedWeight}kg > ${limits.maxWeight}kg)`);
    clampedWeight = limits.maxWeight;
    wasClamped = true;
  }

  if (clampedReps > limits.maxReps) {
    reasons.push(`单组次数超出上限 (${clampedReps}次 > ${limits.maxReps}次)`);
    clampedReps = limits.maxReps;
    wasClamped = true;
  }

  return {
    weight: clampedWeight,
    reps: clampedReps,
    wasClamped,
    originalWeight: rawWeight,
    originalReps: rawReps,
    reason: reasons.join("，") || null
  };
}

/**
 * Validates and recalculates sanitized session volume across all exercises in a workout
 * @param {Array} exercises - List of workout exercises with sets
 * @returns {Object} { sanitizedExercises, totalVolume, totalSets, clampedSetsCount }
 */
export function validateSessionVolume(exercises = []) {
  if (!Array.isArray(exercises)) {
    return { sanitizedExercises: [], totalVolume: 0, totalSets: 0, clampedSetsCount: 0 };
  }

  let totalVolume = 0;
  let totalSets = 0;
  let clampedSetsCount = 0;

  const sanitizedExercises = exercises.map(ex => {
    if (!ex || !Array.isArray(ex.sets)) return ex;

    const safeSets = ex.sets.map(s => {
      if (!s) return s;
      const isDone = s.done !== false;
      const clampResult = clampSetInput(ex.name, s.weight, s.reps, ex.category);
      if (clampResult.wasClamped) {
        clampedSetsCount++;
      }

      if (isDone) {
        totalVolume += Math.round(clampResult.weight * clampResult.reps);
        totalSets++;
      }

      return {
        ...s,
        weight: clampResult.weight,
        reps: clampResult.reps,
        wasClamped: clampResult.wasClamped,
        clampReason: clampResult.reason
      };
    });

    return {
      ...ex,
      sets: safeSets
    };
  });

  return {
    sanitizedExercises,
    totalVolume,
    totalSets,
    clampedSetsCount
  };
}

/**
 * Clamps single session honor points to prevent ladder exploits
 * @param {number} points 
 * @returns {number} safePoints
 */
export function clampSessionHonorPoints(points = 0) {
  const safePts = Number(points) || 0;
  return Math.min(MAX_SESSION_HONOR_POINTS, Math.max(0, Math.round(safePts)));
}

/**
 * Clamps strength-to-bodyweight ratios for PR and badge evaluation
 * @param {Object} ratios - { benchRatio, squatRatio, deadliftRatio }
 * @returns {Object} clamped ratios
 */
export function clampStrengthRatios(ratios = {}) {
  const bench = Number(ratios.benchRatio || ratios.maxBenchRatio) || 0;
  const squat = Number(ratios.squatRatio || ratios.maxSquatRatio) || 0;
  const deadlift = Number(ratios.deadliftRatio || ratios.maxDeadliftRatio) || 0;

  return {
    maxBenchRatio: Math.min(MAX_STRENGTH_RATIOS.bench, Math.max(0, bench)),
    maxSquatRatio: Math.min(MAX_STRENGTH_RATIOS.squat, Math.max(0, squat)),
    maxDeadliftRatio: Math.min(MAX_STRENGTH_RATIOS.deadlift, Math.max(0, deadlift))
  };
}

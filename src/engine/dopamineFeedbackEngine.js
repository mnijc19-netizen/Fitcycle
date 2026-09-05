/**
 * FitCycle Dopamine Feedback Engine (Layer 2 Pure Biomechanics & Dopamine Loop Engine)
 * Implements real-world tonnage metaphors, 0~72h supercompensation biological recovery tracking,
 * and electro-sports tier progression calculations.
 * 
 * Complies with FitCycle Master Constitution:
 * - Layer 2 pure business engine: 0 UI dependency, 0 side effects, 100% deterministic.
 * - Constitutional Invariant: NEVER deduct rank score during 0~72h safe recovery!
 */

// --- 1. REAL-WORLD TONNAGE METAPHOR BENCHMARKS ---

const METAPHOR_BENCHMARKS = [
  {
    maxKg: 800,
    unitKg: 250,
    metaphorName: "重型防暴机车",
    icon: "🏍️",
    format: (count) => `举起 ${count} 辆重型机车`
  },
  {
    maxKg: 2500,
    unitKg: 1500,
    metaphorName: "家用轿车",
    icon: "🚗",
    format: (count) => `举起 ${count} 辆家用轿车`
  },
  {
    maxKg: 6500,
    unitKg: 1500,
    metaphorName: "家用轿车",
    icon: "🚗",
    format: (count) => `举起 ${count} 辆家用轿车`
  },
  {
    maxKg: 15000,
    unitKg: 5000,
    metaphorName: "成年非洲大象",
    icon: "🐘",
    format: (count) => `举起 ${count} 头成年非洲大象`
  },
  {
    maxKg: 40000,
    unitKg: 12000,
    metaphorName: "标准城市公交大巴",
    icon: "🚌",
    format: (count) => `举起 ${count} 辆大型公交大巴`
  },
  {
    maxKg: 100000,
    unitKg: 42000,
    metaphorName: "波音737客机",
    icon: "✈️",
    format: (count) => `举起 ${count} 架波音客机`
  },
  {
    maxKg: Infinity,
    unitKg: 120000,
    metaphorName: "蓝鲸",
    icon: "🐋",
    format: (count) => `举起 ${count} 头深海巨型蓝鲸`
  }
];

/**
 * Converts kg into metric tons and relatable physical metaphors.
 * 
 * Examples:
 * - 5,200 kg -> 5.2 吨, 相当于举起 3.5 辆家用轿车
 * - 12,000 kg -> 12 吨, 相当于举起 2.4 头成年非洲大象
 * 
 * @param {number} totalVolumeKg 
 * @returns {{ tonnage: number, formattedTonnage: string, metaphorName: string, icon: string, description: string, multiplier: number, comparisonTarget: string }}
 */
export function calculateTonnageMetaphor(totalVolumeKg) {
  const safeKg = Math.max(0, Number(totalVolumeKg) || 0);
  const tonnage = Math.round((safeKg / 1000) * 10) / 10;
  const formattedTonnage = `${tonnage} 吨`;

  if (safeKg <= 0) {
    return {
      tonnage: 0,
      formattedTonnage: "0 吨",
      metaphorName: "开练待蓄力",
      icon: "⚡",
      description: "尚未开始做工，随时开启今日铁血轰炸！",
      multiplier: 0,
      comparisonTarget: "待开练"
    };
  }

  // Find appropriate benchmark
  const benchmark = METAPHOR_BENCHMARKS.find(b => safeKg <= b.maxKg) || METAPHOR_BENCHMARKS[METAPHOR_BENCHMARKS.length - 1];
  const count = Math.round((safeKg / benchmark.unitKg) * 10) / 10;
  const description = `相当于举起 ${count} ${benchmark.metaphorName === "成年非洲大象" || benchmark.metaphorName === "蓝鲸" ? "头" : benchmark.metaphorName === "波音737客机" ? "架" : "辆"}${benchmark.metaphorName}！`;

  return {
    tonnage,
    formattedTonnage,
    metaphorName: benchmark.metaphorName,
    icon: benchmark.icon,
    description,
    multiplier: count,
    comparisonTarget: benchmark.metaphorName
  };
}

// --- 2. SUPERCOMPENSATION 0~72H RECOVERY STATUS ---

export const SUPERCOMPENSATION_STAGES = {
  ACUTE: "acute",
  SYNTHESIS: "synthesis",
  SUPERCOMPENSATION: "supercompensation",
  READY: "ready"
};

/**
 * Calculates biological supercompensation recovery status.
 * Emphasizes that 0~72h is protected by the FitCycle Master Constitution: NEVER deduct rank score during 0~72h!
 * 
 * Stages:
 * - acute (0-24h): Acute micro-damage repair & glycogen depletion
 * - synthesis (24-48h): Peak myofibrillar protein synthesis & glycogen hyper-reloading
 * - supercompensation (48-72h): Golden supercompensation peak, work capacity surpasses baseline
 * - ready (>72h): Fully primed and ready for progressive overload
 * 
 * @param {number|string|Date} lastWorkoutTimestamp 
 * @param {number} currentTimestamp - Optional current timestamp for deterministic testing
 * @returns {{ hoursElapsed: number, stage: string, timerText: string, progressPercent: number, advice: string, isSafeRecoveryWindow: boolean, decayPenalty: number }}
 */
export function calculateSupercompensationStatus(lastWorkoutTimestamp, currentTimestamp = Date.now()) {
  if (!lastWorkoutTimestamp) {
    return {
      hoursElapsed: 0,
      stage: SUPERCOMPENSATION_STAGES.READY,
      timerText: "随时开练",
      progressPercent: 100,
      advice: "尚未开启训练记录，随时可以进入今日训练心流！",
      isSafeRecoveryWindow: true,
      decayPenalty: 0
    };
  }

  const lastTime = new Date(lastWorkoutTimestamp).getTime();
  if (isNaN(lastTime)) {
    return {
      hoursElapsed: 0,
      stage: SUPERCOMPENSATION_STAGES.READY,
      timerText: "随时开练",
      progressPercent: 100,
      advice: "记录时间异常，已恢复满血战备状态。",
      isSafeRecoveryWindow: true,
      decayPenalty: 0
    };
  }

  const hoursElapsed = Math.max(0, Math.round(((currentTimestamp - lastTime) / (1000 * 60 * 60)) * 10) / 10);
  const isSafeRecoveryWindow = hoursElapsed <= 72;
  const decayPenalty = 0; // Invariant: 0 penalty during 0~72h

  if (hoursElapsed < 24) {
    const hoursLeftInStage = Math.max(1, Math.round(24 - hoursElapsed));
    const progressPercent = Math.min(33, Math.max(5, Math.round((hoursElapsed / 24) * 33)));
    return {
      hoursElapsed,
      stage: SUPERCOMPENSATION_STAGES.ACUTE,
      timerText: `深度微损伤修护中 (剩余约 ${hoursLeftInStage}h)`,
      progressPercent,
      advice: "🛡️ 急性恢复期：肌原纤维处于微创修复与充血代谢阶段。请保证充足水分与蛋白质摄入。0~72h 处于宪法免责安全期，安心修养！",
      isSafeRecoveryWindow,
      decayPenalty
    };
  }

  if (hoursElapsed < 48) {
    const hoursLeftInStage = Math.max(1, Math.round(48 - hoursElapsed));
    const progressPercent = Math.min(66, Math.max(34, 33 + Math.round(((hoursElapsed - 24) / 24) * 33)));
    return {
      hoursElapsed,
      stage: SUPERCOMPENSATION_STAGES.SYNTHESIS,
      timerText: `肌原纤维深度重组中 (剩余约 ${hoursLeftInStage}h)`,
      progressPercent,
      advice: "⚡ 黄金合成期：肌糖原与蛋白质合成速率达到巅峰，肌肉酸痛感快速褪去。享受休息日生理滋养，0~72h 严禁扣减战力分！",
      isSafeRecoveryWindow,
      decayPenalty
    };
  }

  if (hoursElapsed <= 72) {
    const hoursLeftInStage = Math.max(0, Math.round(72 - hoursElapsed));
    const progressPercent = Math.min(100, Math.max(67, 66 + Math.round(((hoursElapsed - 48) / 24) * 34)));
    return {
      hoursElapsed,
      stage: SUPERCOMPENSATION_STAGES.SUPERCOMPENSATION,
      timerText: `超量恢复黄金巅峰窗口 (剩余约 ${hoursLeftInStage}h)`,
      progressPercent,
      advice: "🔥 超量恢复巅峰：肌肉力量与储备已超越上次训练前基准！此时出勤将获得最高渐进超负荷做工增益，随时准备开练！",
      isSafeRecoveryWindow: true,
      decayPenalty: 0
    };
  }

  // > 72h: Ready to train, recovery complete
  return {
    hoursElapsed,
    stage: SUPERCOMPENSATION_STAGES.READY,
    timerText: "机能满血 · 战备状态",
    progressPercent: 100,
    advice: "⚔️ 机能已完全储备。注意超过 72 小时后肌原纤维将进入怠惰适应期，今日是最佳开练窗口！",
    isSafeRecoveryWindow: false,
    decayPenalty
  };
}

// --- 3. TIER ADVANCEMENT & RANK DELTA ---

export const TIERS = [
  { tier: 1, min: 0, max: 299, name: "新兵 / 白银一" },
  { tier: 2, min: 300, max: 699, name: "进阶 / 白银精英" },
  { tier: 3, min: 700, max: 1199, name: "中坚 / 黄金新星" },
  { tier: 4, min: 1200, max: 1799, name: "雕刻家 / 大师级守卫" },
  { tier: 5, min: 1800, max: 2399, name: "资深健力士 / 雄鹰" },
  { tier: 6, min: 2400, max: 2899, name: "传奇泰坦 / 大地球" },
  { tier: 7, min: 2900, max: Infinity, name: "巅峰神话 / 战神" }
];

export function getTierInfoForScore(score) {
  const safeScore = Math.max(0, Number(score) || 0);
  for (const t of TIERS) {
    if (safeScore <= t.max) return t;
  }
  return TIERS[TIERS.length - 1];
}

/**
 * Calculates tier advancement, level-up flag, and remaining points needed for the next rank.
 * 
 * @param {number} currentPoints - Total points after workout settlement
 * @param {number} pointsGained - Points gained from this workout session
 * @returns {{ previousScore: number, currentScore: number, pointsGained: number, previousTier: Object, currentTier: Object, hasLeveledUp: boolean, currentPointsInTier: number, pointsNeededForNextTier: number, progressPercent: number }}
 */
export function calculateTierAdvancement(currentPoints, pointsGained) {
  const safeCurrent = Math.max(0, Number(currentPoints) || 0);
  const safeGained = Math.max(0, Number(pointsGained) || 0);
  const previousScore = Math.max(0, safeCurrent - safeGained);

  const currentTier = getTierInfoForScore(safeCurrent);
  const previousTier = getTierInfoForScore(previousScore);

  const hasLeveledUp = currentTier.tier > previousTier.tier;

  let currentPointsInTier = 0;
  let pointsNeededForNextTier = 0;
  let progressPercent = 0;

  if (currentTier.tier === 7) {
    currentPointsInTier = safeCurrent - 2900;
    pointsNeededForNextTier = 0; // Infinite apex ladder
    progressPercent = 100;
  } else {
    currentPointsInTier = Math.max(0, safeCurrent - currentTier.min);
    const tierSpan = (currentTier.max - currentTier.min) + 1;
    pointsNeededForNextTier = Math.max(0, (currentTier.max + 1) - safeCurrent);
    progressPercent = Math.min(100, Math.max(0, Math.round((currentPointsInTier / tierSpan) * 100)));
  }

  return {
    previousScore,
    currentScore: safeCurrent,
    pointsGained: safeGained,
    previousTier,
    currentTier,
    hasLeveledUp,
    currentPointsInTier,
    pointsNeededForNextTier,
    progressPercent
  };
}

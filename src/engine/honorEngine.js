// Fitcycle Core Honor, Progression & Multi-Modal METs Engine
// Strictly compliant with docs/FITCYCLE_CORE_CONSTITUTION.md

/**
 * 7 Standard Tier Thresholds (0 ~ 3000+)
 */
export const TIER_CONFIGS = [
  { tier: 1, minScore: 0, maxScore: 299, key: "tier_1", badgeIcon: "🔰" },
  { tier: 2, minScore: 300, maxScore: 699, key: "tier_2", badgeIcon: "🥉" },
  { tier: 3, minScore: 700, maxScore: 1199, key: "tier_3", badgeIcon: "🥈" },
  { tier: 4, minScore: 1200, maxScore: 1799, key: "tier_4", badgeIcon: "🥇" },
  { tier: 5, minScore: 1800, maxScore: 2399, key: "tier_5", badgeIcon: "💎" },
  { tier: 6, minScore: 2400, maxScore: 2899, key: "tier_6", badgeIcon: "🔥" },
  { tier: 7, minScore: 2900, maxScore: Infinity, key: "tier_7", badgeIcon: "👑" }
];

/**
 * CS2 Official-Style Annual Prestige Service Medal Progression (1 ~ 6)
 */
export const PRESTIGE_MEDAL_COLORS = [
  { level: 1, name: "白银服役勋章 (Rank 1)", color: "#e2e8f0", border: "#94a3b8", glow: "rgba(226,232,240,0.4)" },
  { level: 2, name: "翡翠绿服役勋章 (Rank 2)", color: "#34d399", border: "#059669", glow: "rgba(52,211,153,0.5)" },
  { level: 3, name: "深海蓝服役勋章 (Rank 3)", color: "#60a5fa", border: "#2563eb", glow: "rgba(96,165,250,0.5)" },
  { level: 4, name: "荣耀紫服役勋章 (Rank 4)", color: "#c084fc", border: "#9333ea", glow: "rgba(192,132,252,0.6)" },
  { level: 5, name: "炽烈粉服役勋章 (Rank 5)", color: "#f472b6", border: "#db2777", glow: "rgba(244,114,182,0.6)" },
  { level: 6, name: "至尊血红服役勋章 (Rank 6)", color: "#ef4444", border: "#b91c1c", glow: "rgba(239,68,68,0.8)" }
];

/**
 * Converts various sport modalities into equivalent resistance tonnage (kg)
 * Based on Chapter 2 of Core Constitution (METs conversion)
 */
export function calculateEquivalentTonnage(modality, params = {}) {
  const userWeight = Number(params.weight) || 70;
  
  switch (modality) {
    case "running": {
      const distKm = Number(params.distanceKm) || 0;
      return Math.round(distKm * userWeight * 8.5);
    }
    case "incline_walk": {
      const minutes = Number(params.durationMinutes) || 0;
      const inclinePercent = Number(params.inclinePercent) || 5;
      return Math.round(minutes * userWeight * (1 + inclinePercent / 100) * 0.7);
    }
    case "rowing_bike": {
      const calories = Number(params.calories) || 0;
      return Math.round(calories * 12.5);
    }
    case "calisthenics": {
      const reps = Number(params.reps) || 0;
      const bodyRatio = Number(params.bodyRatio) || 0.65;
      return Math.round(reps * userWeight * bodyRatio);
    }
    case "resistance":
    default: {
      return Number(params.volume) || 0;
    }
  }
}

/**
 * Calculates sports-biology based inactivity decay according to Chapter 4 of Constitution
 * @param {number} hoursSinceLastWorkout 
 * @param {number} currentScore 
 * @param {number} tierMinScore 
 * @returns {Object} { decayPoints, warningLevel, warningMessage }
 */
export function calculateInactivityDecay(hoursSinceLastWorkout, currentScore, tierMinScore = 0) {
  if (hoursSinceLastWorkout <= 72) {
    return {
      decayPoints: 0,
      warningLevel: "safe",
      warningMessage: "⚡ 肌肉超量合成与储备中，精力满血，随时开练！",
      dailyRate: 0
    };
  }

  if (hoursSinceLastWorkout <= 96) {
    const daysOver = (hoursSinceLastWorkout - 72) / 24;
    const decay = Math.round(daysOver * 5);
    const safeDecay = Math.min(decay, Math.max(0, currentScore - tierMinScore));
    return {
      decayPoints: safeDecay,
      warningLevel: "mild",
      warningMessage: "⚠️ 枪膛开始降温！神经募集感轻度衰减，建议今日归队！",
      dailyRate: 5
    };
  }

  if (hoursSinceLastWorkout <= 168) {
    const daysOver = (hoursSinceLastWorkout - 96) / 24;
    const baseDecay = (24 / 24) * 5; // Day 4 decay (5 pts)
    const decay = Math.round(baseDecay + daysOver * 15);
    const safeDecay = Math.min(decay, Math.max(0, currentScore - tierMinScore));
    return {
      decayPoints: safeDecay,
      warningLevel: "moderate",
      warningMessage: "🚨 战力正在流失！肌糖原与泵感消退中，每日流失 15 战力！",
      dailyRate: 15
    };
  }

  // > 7 days (168 hours)
  const daysOver = (hoursSinceLastWorkout - 168) / 24;
  const baseDecay = 5 + 3 * 15; // 50 pts up to Day 7
  const decay = Math.round(baseDecay + daysOver * 25);
  const safeDecay = Math.min(decay, Math.max(0, currentScore - tierMinScore));
  return {
    decayPoints: safeDecay,
    warningLevel: "severe",
    warningMessage: "⚡ 严重怠惰危机！肌肉进入去适应期，速速开练破冰止血！",
    dailyRate: 25
  };
}

/**
 * Calculates FPS Score delta earned in a single workout session
 * @param {Object} summary - Session summary
 * @param {Array} pastLogs - History logs
 * @param {number} hoursSinceLastWorkout - Inactivity duration before this workout
 * @returns {Object} Full session score breakdown
 */
export function calculateSessionPointsEarned(summary, pastLogs = [], hoursSinceLastWorkout = 24) {
  if (!summary) return { totalPoints: 0, breakdown: {} };

  const totalVol = summary.totalVolume || 0;
  const totalSets = summary.totalSets || 0;

  // 1. Base Session Rating Points
  let basePoints = 20;
  let sessionRating = "B";

  if (totalSets === 0 || totalVol === 0) {
    basePoints = 0;
    sessionRating = "D";
  } else if (totalSets < 6 || totalVol < 1200) {
    basePoints = 10;
    sessionRating = "C";
  } else if (totalSets >= 14 && totalVol >= 6500) {
    basePoints = 50;
    sessionRating = "S";
  } else if (totalSets >= 10 && totalVol >= 3000) {
    basePoints = 35;
    sessionRating = "A";
  } else {
    basePoints = 20;
    sessionRating = "B";
  }

  // 2. Progressive Overload Bonus
  let overloadBonus = 0;
  const prevSamePlanLogs = pastLogs.filter(l => l.id !== summary.id && l.planId === summary.planId);
  if (prevSamePlanLogs.length > 0 && totalVol > 0) {
    const lastVol = prevSamePlanLogs[0].totalVolume || 0;
    if (lastVol > 0 && totalVol > lastVol * 1.05) {
      overloadBonus = 15; // +15 pts for >= 5% overload
    }
  }

  // 3. Redemption Rebound Multiplier (150% boost after >= 5 days / 120h inactivity)
  const isRedemptionRebound = hoursSinceLastWorkout >= 120 && sessionRating !== "D";
  const multiplier = isRedemptionRebound ? 1.5 : 1.0;

  const rawSubtotal = basePoints + overloadBonus;
  const finalSessionPoints = Math.round(rawSubtotal * multiplier);

  return {
    finalSessionPoints,
    basePoints,
    overloadBonus,
    isRedemptionRebound,
    multiplier,
    sessionRating
  };
}

/**
 * Gets Tier Info based on total FPS score
 * @param {number} score 
 * @returns {Object} Tier configuration
 */
export function getTierForScore(score) {
  const safeScore = Math.max(0, Number(score) || 0);
  for (let i = TIER_CONFIGS.length - 1; i >= 0; i--) {
    const config = TIER_CONFIGS[i];
    if (safeScore >= config.minScore) {
      const nextConfig = TIER_CONFIGS[i + 1] || null;
      const progress = nextConfig 
        ? Math.min(100, Math.round(((safeScore - config.minScore) / (nextConfig.minScore - config.minScore)) * 100))
        : 100;
      
      return {
        ...config,
        currentScore: safeScore,
        nextTierScore: nextConfig ? nextConfig.minScore : safeScore,
        progressPercent: progress,
        isApex: config.tier === 7
      };
    }
  }
  return { ...TIER_CONFIGS[0], currentScore: safeScore, progressPercent: 0, isApex: false };
}

/**
 * Comprehensive Honor Badge Evaluator across 3 Specializations + Tactical Badges
 */
export function evaluateUnlockedBadges(stats = {}) {
  const {
    totalWorkouts = 0,
    totalTonnageKg = 0,
    consecutiveWeeks = 0,
    bodyMetricsHistory = [],
    maxBenchRatio = 0,
    maxSquatRatio = 0,
    hasBrokenPR = false,
    perfectSessionsCount = 0
  } = stats;

  const badges = [];

  // Specialization A: Consistency & Volume
  if (totalWorkouts >= 1) badges.push({ id: "badge_first_blood", category: "consistency", tier: 1, unlocked: true });
  if (totalWorkouts >= 7) badges.push({ id: "badge_consecutive_7d", category: "consistency", tier: 1, unlocked: true });
  if (consecutiveWeeks >= 4) badges.push({ id: "badge_monthly_iron", category: "consistency", tier: 2, unlocked: true });
  if (totalWorkouts >= 100) badges.push({ id: "badge_veteran_100", category: "consistency", tier: 3, unlocked: true });
  if (totalWorkouts >= 1000) badges.push({ id: "badge_centurion_1000", category: "consistency", tier: 4, unlocked: true });

  if (totalTonnageKg >= 10000) badges.push({ id: "badge_tonnage_10t", category: "tonnage", tier: 1, unlocked: true });
  if (totalTonnageKg >= 50000) badges.push({ id: "badge_tonnage_50t", category: "tonnage", tier: 2, unlocked: true });
  if (totalTonnageKg >= 100000) badges.push({ id: "badge_tonnage_100t", category: "tonnage", tier: 3, unlocked: true });
  if (totalTonnageKg >= 1000000) badges.push({ id: "badge_tonnage_1000t", category: "tonnage", tier: 4, unlocked: true });

  // Specialization B: Body Aesthetics & Circumference
  if (bodyMetricsHistory.length >= 1) badges.push({ id: "badge_body_init", category: "aesthetics", tier: 1, unlocked: true });
  if (bodyMetricsHistory.length >= 2) {
    const first = bodyMetricsHistory[0];
    const latest = bodyMetricsHistory[bodyMetricsHistory.length - 1];
    const armGain = (latest.arm || 0) - (first.arm || 0);
    const chestGain = (latest.chest || 0) - (first.chest || 0);
    const waistDrop = (first.waist || 0) - (latest.waist || 0);

    if (armGain >= 2.0) badges.push({ id: "badge_arm_titan", category: "aesthetics", tier: 2, unlocked: true });
    if (chestGain >= 3.5) badges.push({ id: "badge_chest_armor", category: "aesthetics", tier: 2, unlocked: true });
    if (waistDrop >= 2.0 && chestGain > 0) badges.push({ id: "badge_v_taper", category: "aesthetics", tier: 3, unlocked: true });
  }

  // Specialization C: Strength & Power
  if (maxBenchRatio >= 1.0) badges.push({ id: "badge_bench_bw", category: "strength", tier: 2, unlocked: true });
  if (maxSquatRatio >= 1.5) badges.push({ id: "badge_squat_1_5bw", category: "strength", tier: 3, unlocked: true });

  // Tactical Easter Eggs
  if (perfectSessionsCount >= 1) badges.push({ id: "badge_headshot_ace", category: "tactical", tier: 2, unlocked: true });
  if (hasBrokenPR) badges.push({ id: "badge_awp_pr", category: "tactical", tier: 3, unlocked: true });

  return badges;
}
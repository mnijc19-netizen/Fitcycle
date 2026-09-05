/**
 * 🏋️ FITCYCLE 生理与自适应力量计算引擎 (Body Profile & Adaptive Strength Engine)
 * Layer 2 领域纯函数引擎，无副作用，遵循运动生理学与人体测量学标准
 */

/**
 * 身体质量指数 (BMI)
 * @param {number} weightKg - 体重 (kg)
 * @param {number} heightCm - 身高 (cm)
 * @returns {number} 保留一位小数的 BMI
 */
export function calculateBMI(weightKg, heightCm) {
  const w = Number(weightKg) || 70;
  const h = (Number(heightCm) || 175) / 100;
  if (h <= 0) return 22.0;
  return Number((w / (h * h)).toFixed(1));
}

/**
 * 获取 BMI 评级与建议
 */
export function getBMICategory(bmi) {
  const b = Number(bmi) || 22;
  if (b < 18.5) {
    return { level: "underweight", label: "偏瘦体型", desc: "建议适度提升热量与优质碳水摄入，以肌肥大增肌为主", color: "text-sky-400", badgeBg: "bg-sky-500/15 border-sky-500/30" };
  }
  if (b < 24.0) {
    return { level: "normal", label: "标准匀称", desc: "理想健康的体格基准，兼具灵活性与力量生长潜力", color: "text-emerald-400", badgeBg: "bg-emerald-500/15 border-emerald-500/30" };
  }
  if (b < 28.0) {
    return { level: "muscular_or_overweight", label: "健壮/超重", desc: "抗阻训练者多为骨骼肌充沛状态，注重体脂控制与渐进超负荷", color: "text-amber-400", badgeBg: "bg-amber-500/15 border-amber-500/30" };
  }
  return { level: "obese", label: "偏重体型", desc: "建议结合中低强度有氧与大肌群多关节复合动作，保护膝踝关节", color: "text-rose-400", badgeBg: "bg-rose-500/15 border-rose-500/30" };
}

/**
 * 基础代谢率 BMR (Mifflin-St Jeor 临床金标准公式)
 * 男: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 * 女: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 */
export function calculateBMR(gender = "male", weightKg = 70, heightCm = 175, age = 25) {
  const w = Math.max(30, Math.min(250, Number(weightKg) || 70));
  const h = Math.max(100, Math.min(240, Number(heightCm) || 175));
  const a = Math.max(14, Math.min(100, Number(age) || 25));

  const base = 10 * w + 6.25 * h - 5 * a;
  const isFemale = String(gender).toLowerCase() === "female" || String(gender) === "女";
  const bmr = isFemale ? base - 161 : base + 5;
  return Math.round(Math.max(800, bmr));
}

/**
 * 每日总能量消耗 TDEE (Total Daily Energy Expenditure)
 * @param {number} bmr 
 * @param {string} activityLevel - 'sedentary' (久坐), 'light' (轻度 1-2次/周), 'moderate' (规律 3-5次/周), 'heavy' (高强度 6次+)
 */
export function calculateTDEE(bmr, activityLevel = "moderate") {
  const b = Number(bmr) || 1600;
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725
  };
  const factor = multipliers[activityLevel] || 1.55;
  return Math.round(b * factor);
}

/**
 * 每日宏量营养与蛋白质摄入靶心建议
 * @param {number} weightKg 
 * @param {string} goal - 'hypertrophy' (增肌塑形), 'fat_loss' (减脂减重), 'strength' (力量举)
 */
export function calculateMacroTargets(weightKg = 70, goal = "hypertrophy") {
  const w = Math.max(30, Math.min(250, Number(weightKg) || 70));
  let proteinMultiplier = 1.8; // g/kg
  let waterMultiplier = 38; // ml/kg

  if (goal === "hypertrophy") {
    proteinMultiplier = 1.8; // 1.6~2.0 g/kg
  } else if (goal === "fat_loss") {
    proteinMultiplier = 2.0; // 减脂防掉肌肉，蛋白比例偏高
  } else if (goal === "strength") {
    proteinMultiplier = 1.9;
  }

  const minProtein = Math.round(w * (proteinMultiplier - 0.2));
  const maxProtein = Math.round(w * (proteinMultiplier + 0.2));
  const waterLiter = Number(((w * waterMultiplier) / 1000).toFixed(1));

  return {
    proteinRange: `${minProtein} ~ ${maxProtein}g`,
    dailyProteinTargetGrams: Math.round(w * proteinMultiplier),
    dailyWaterLiters: Math.max(1.8, waterLiter)
  };
}

/**
 * 核心力量系数表 (基于体重 BW 的相对力量推算标准)
 * 结合俯卧撑能力 (Push) 与深蹲感受 (Legs)
 */
export const RELATIVE_STRENGTH_RATIOS = {
  male: {
    // 推力系数: 上斜卧推 (以杠铃/双哑铃总重估算)
    push: {
      beginner: 0.35,  // <5个俯卧撑: 约 0.35 * BW
      basic: 0.55,     // 5~15个: 约 0.55 * BW
      moderate: 0.75,  // 15~30个: 约 0.75 * BW
      elite: 1.05      // >30个: 约 1.05 * BW
    },
    // 下肢深蹲系数:
    legs: {
      sedentary: 0.65, // 久坐腿酸: 0.65 * BW
      natural: 1.00,   // 自如30次: 1.00 * BW
      strong: 1.40     // 常打球/抗阻经验: 1.40 * BW
    },
    // 拉力系数 (通常约为卧推的 0.85 ~ 0.95):
    pullFactor: 0.90
  },
  female: {
    push: {
      beginner: 0.20,
      basic: 0.32,
      moderate: 0.45,
      elite: 0.65
    },
    legs: {
      sedentary: 0.45,
      natural: 0.75,
      strong: 1.10
    },
    pullFactor: 0.85
  }
};

/**
 * 将重量四舍五入为健身房通用最小步进 (2.5kg 或 5kg)
 */
function roundToStep(val, step = 2.5, minVal = 5) {
  const rounded = Math.round(val / step) * step;
  return Math.max(minVal, Number(rounded.toFixed(1)));
}

/**
 * 自适应推导全套推拉腿起步重量矩阵
 * 彻底解决用户不记得具体公斤数的痛点
 */
export function calculateAdaptiveWeights({
  gender = "male",
  weightKg = 70,
  pushupTier = "basic",   // 'beginner' | 'basic' | 'moderate' | 'elite'
  squatTier = "natural",  // 'sedentary' | 'natural' | 'strong'
  experienceLevel = "intermediate" // 'beginner' | 'intermediate' | 'advanced'
}) {
  const isFemale = String(gender).toLowerCase() === "female" || String(gender) === "女";
  const gKey = isFemale ? "female" : "male";
  const w = Math.max(35, Math.min(200, Number(weightKg) || 70));

  const ratios = RELATIVE_STRENGTH_RATIOS[gKey];
  const pushRatio = ratios.push[pushupTier] || ratios.push.basic;
  const legRatio = ratios.legs[squatTier] || ratios.legs.natural;

  // 经验修正微调系数 (±10%)
  const expMultiplier = experienceLevel === "beginner" ? 0.9 : experienceLevel === "advanced" ? 1.15 : 1.0;

  // 基准三大项等效力量估算 (kg)
  const estimatedBench = w * pushRatio * expMultiplier;
  const estimatedSquat = w * legRatio * expMultiplier;
  const estimatedPull = estimatedBench * ratios.pullFactor;

  // 映射到 Fitcycle 默认计划核心动作
  // 单只哑铃重量约为总推力的一半再打八折 (考虑单边稳定肌群做工)
  const inclineDumbbellPerHand = roundToStep((estimatedBench * 0.45) / 2, isFemale ? 1 : 2, isFemale ? 2 : 4);
  const chestPressMachine = roundToStep(estimatedBench * 0.85, 2.5, 10);
  const lateralRaiseDumbbell = roundToStep(isFemale ? Math.max(1, w * 0.04) : Math.max(2.5, w * 0.08), isFemale ? 0.5 : 1.25, isFemale ? 1 : 2.5);

  const pulldownMachine = roundToStep(estimatedPull * 0.90, 2.5, 10);
  const cableRowMachine = roundToStep(estimatedPull * 0.80, 2.5, 10);
  const inclineCurlDumbbell = roundToStep(isFemale ? Math.max(2, w * 0.06) : Math.max(4, w * 0.12), isFemale ? 0.5 : 1, isFemale ? 1.5 : 4);

  const hackSquatOrLegPress = roundToStep(estimatedSquat * 0.90, 5, 20);
  const rdlBarbell = roundToStep(estimatedSquat * 0.75, 5, 15);
  const lyingLegCurl = roundToStep(estimatedSquat * 0.45, 2.5, 10);

  return {
    estimatedBases: {
      bench: Math.round(estimatedBench),
      squat: Math.round(estimatedSquat),
      pull: Math.round(estimatedPull)
    },
    weightsMap: {
      "上斜哑铃卧推": inclineDumbbellPerHand,
      "固定器械推胸": chestPressMachine,
      "绳索侧平举": lateralRaiseDumbbell,
      "对握/宽握高位下拉": pulldownMachine,
      "坐姿绳索划船": cableRowMachine,
      "上斜哑铃弯举": inclineCurlDumbbell,
      "哈克深蹲 / 倒蹬腿举": hackSquatOrLegPress,
      "罗马尼亚硬拉 (RDL)": rdlBarbell,
      "俯卧器械腿弯举 (Lying Leg Curl)": lyingLegCurl
    }
  };
}

/**
 * 结合训练经验与自重相对力量推算荣誉战力初始积分
 */
export function getInitialHonorScore(experienceLevel = "intermediate", relativeRatio = 1.0) {
  let baseScore = 850; // 默认黄金
  if (experienceLevel === "beginner") baseScore = 550; // 白银
  else if (experienceLevel === "advanced") baseScore = 1350; // 钻石/大师

  // 相对力量微调 (+0 ~ +100 分)
  const ratioBonus = Math.round(Math.max(-50, Math.min(150, (relativeRatio - 1.0) * 100)));
  return Math.max(400, Math.min(1600, baseScore + ratioBonus));
}

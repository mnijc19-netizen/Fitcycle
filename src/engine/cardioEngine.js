/**
 * 🏃 FITCYCLE 练后科学减脂与 Zone 2 有氧引擎 (Post-Workout Cardio Engine)
 * Layer 2 领域纯函数引擎，无副作用
 * 遵循运动生理学 Zone 2 脂肪氧化、Maffetone 心率法则与《宪法第二章 METs 归一化模型》
 */

import { calculateEquivalentTonnage } from "./honorEngine.js";

/**
 * 科学推荐的低冲击有氧模式矩阵 (首选关节低负荷、避免干扰抗阻增肌通路的 LISS 模式)
 */
export const CARDIO_MODES = {
  incline_walk: {
    id: "incline_walk",
    name: "坡度快走 (跑步机)",
    shortName: "坡度快走",
    mets: 7.0,
    defaultMinutes: 20,
    defaultIncline: 10,
    icon: "🚶‍♂️",
    tag: "低关节负荷·首选",
    desc: "建议坡度 8~12%，配速 4.5~5.5 km/h，不抓扶手自然摆臂",
    modality: "incline_walk"
  },
  elliptical: {
    id: "elliptical",
    name: "椭圆机平稳巡航",
    shortName: "椭圆机",
    mets: 6.5,
    defaultMinutes: 20,
    defaultIncline: 0,
    icon: "🎿",
    tag: "零膝盖冲击",
    desc: "阻力中等，匀速踏步，保护膝关节并持续燃脂",
    modality: "rowing_bike"
  },
  bike: {
    id: "bike",
    name: "动感单车/健身车",
    shortName: "健身车",
    mets: 7.0,
    defaultMinutes: 20,
    defaultIncline: 0,
    icon: "🚴‍♂️",
    tag: "下肢舒缓",
    desc: "踏频保持 70~85 rpm，中低阻力，让大腿充分代谢",
    modality: "rowing_bike"
  },
  rowing: {
    id: "rowing",
    name: "划船机匀速轻桨",
    shortName: "划船机",
    mets: 7.0,
    defaultMinutes: 15,
    defaultIncline: 0,
    icon: "🚣‍♂️",
    tag: "全身调动",
    desc: "桨频 20~24 s/m，臀腿主要蹬伸发力，舒缓上肢",
    modality: "rowing_bike"
  },
  outdoor_jog: {
    id: "outdoor_jog",
    name: "超慢跑 / 户外慢跑",
    shortName: "超慢跑",
    mets: 8.0,
    defaultMinutes: 20,
    defaultIncline: 0,
    icon: "🏃‍♂️",
    tag: "心肺维持",
    desc: "小步幅高步频超慢跑，严格把心率压在 Zone 2，严禁冲刺",
    modality: "running"
  }
};

export const CARDIO_MODE_LIST = Object.values(CARDIO_MODES);

/**
 * 基于年龄计算专属 Zone 2 燃脂心率区间 (Maffetone / Tanaka 科学区间)
 * @param {number} age - 年龄 (岁)
 * @returns {object} { maxHr, zone2Min, zone2Max, formattedRange, bodySensoryCue }
 */
export function calculateZone2HeartRate(age = 25) {
  const safeAge = Math.max(14, Math.min(100, Number(age) || 25));
  const maxHr = 220 - safeAge;
  const zone2Min = Math.round(maxHr * 0.60);
  const zone2Max = Math.round(maxHr * 0.70);
  
  return {
    age: safeAge,
    maxHr,
    zone2Min,
    zone2Max,
    formattedRange: `${zone2Min} ~ ${zone2Max} bpm`,
    bodySensoryCue: "微微发热出汗，呼吸加深，可断续说短句但无法连贯唱歌"
  };
}

/**
 * 计算有氧消耗的卡路里 (kcal)
 * 公式: Calories = (METs * 3.5 * weightKg / 200) * minutes
 * @param {string} modeKey 
 * @param {number} durationMinutes 
 * @param {number} weightKg 
 * @returns {number}
 */
export function calculateCardioCalories(modeKey = "incline_walk", durationMinutes = 20, weightKg = 70) {
  const mode = CARDIO_MODES[modeKey] || CARDIO_MODES.incline_walk;
  const minutes = Math.max(1, Number(durationMinutes) || 20);
  const w = Math.max(30, Math.min(250, Number(weightKg) || 70));
  
  const kcal = ((mode.mets * 3.5 * w) / 200) * minutes;
  return Math.round(kcal);
}

/**
 * 依据《宪法第二章 METs 公理》计算有氧等效抗阻做工吨位 (kg)
 * @param {string} modeKey 
 * @param {number} durationMinutes 
 * @param {number} weightKg 
 * @param {number} [caloriesBurned] 
 * @returns {number}
 */
export function calculateCardioTonnage(modeKey = "incline_walk", durationMinutes = 20, weightKg = 70, caloriesBurned = null) {
  const mode = CARDIO_MODES[modeKey] || CARDIO_MODES.incline_walk;
  const minutes = Math.max(1, Number(durationMinutes) || 20);
  const w = Math.max(30, Math.min(250, Number(weightKg) || 70));
  const cals = caloriesBurned !== null && caloriesBurned !== undefined 
    ? Number(caloriesBurned) 
    : calculateCardioCalories(modeKey, minutes, w);

  if (mode.modality === "incline_walk") {
    return calculateEquivalentTonnage("incline_walk", {
      durationMinutes: minutes,
      weight: w,
      inclinePercent: mode.defaultIncline || 10
    });
  } else if (mode.modality === "running") {
    // 估算配速 7 min/km
    const estimatedDistanceKm = Number((minutes / 7).toFixed(2));
    return calculateEquivalentTonnage("running", {
      distanceKm: estimatedDistanceKm,
      weight: w
    });
  } else {
    return calculateEquivalentTonnage("rowing_bike", {
      calories: cals,
      weight: w
    });
  }
}

/**
 * 创建标准有氧会话记录对象
 * @param {object} params
 * @returns {object}
 */
export function createCardioSession({
  modeKey = "incline_walk",
  durationMinutes = 20,
  weightKg = 70,
  age = 25
} = {}) {
  const mode = CARDIO_MODES[modeKey] || CARDIO_MODES.incline_walk;
  const minutes = Math.max(1, Math.round(Number(durationMinutes) || 20));
  const w = Math.max(30, Math.min(250, Number(weightKg) || 70));
  const z2 = calculateZone2HeartRate(age);
  const calories = calculateCardioCalories(modeKey, minutes, w);
  const equivalentTonnage = calculateCardioTonnage(modeKey, minutes, w, calories);

  return {
    modeKey: mode.id,
    modeName: mode.name,
    shortName: mode.shortName,
    icon: mode.icon,
    durationMinutes: minutes,
    calories,
    equivalentTonnage,
    zone2Target: z2.formattedRange,
    timestamp: Date.now()
  };
}

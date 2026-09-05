import { CHEST_EXERCISES } from "./exercisesChest.js";
import { BACK_EXERCISES } from "./exercisesBack.js";
import { SHOULDER_EXERCISES } from "./exercisesShoulders.js";
import { ARM_EXERCISES } from "./exercisesArms.js";
import { LEG_EXERCISES } from "./exercisesLegs.js";
import { CORE_EXERCISES } from "./exercisesCore.js";
import { CARDIO_EXERCISES } from "./exercisesCardio.js";

// 全面扩充的高阶黄金 3D 动作库 (总计 109 款经典科学动作，包含 3D 肌肉解剖红光发力动图与全套解剖画板)
export const DEFAULT_EXERCISES = [
  ...CHEST_EXERCISES,
  ...BACK_EXERCISES,
  ...SHOULDER_EXERCISES,
  ...ARM_EXERCISES,
  ...LEG_EXERCISES,
  ...CORE_EXERCISES,
  ...CARDIO_EXERCISES
];

export const DEFAULT_PLANS = [
  {
    id: "plan-push",
    name: "推日 (Push) —— 打造铠甲胸与加宽肩膀",
    shortName: "推日",
    category: "推",
    color: "amber",
    coreTarget: "轰炸上胸、极限拓宽肩峰、围度化手臂",
    isRest: false,
    exercises: [
      { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", setsCount: 3, targetReps: "8-10次", defaultWeight: 20 },
      { exerciseId: "ex-machine-chest-press", name: "固定器械推胸", setsCount: 3, targetReps: "10-12次", defaultWeight: 45 },
      { exerciseId: "ex-cable-lateral-raise", name: "绳索侧平举", setsCount: 3, targetReps: "12-15次", defaultWeight: 7.5 }
    ]
  },
  {
    id: "plan-pull",
    name: "拉日 (Pull) —— 拓宽V字腰身与3D饱满度",
    shortName: "拉日",
    category: "拉",
    color: "sky",
    coreTarget: "拉宽背阔肌（正面显宽）、增厚上背（背面显壮）、打造麒麟臂",
    isRest: false,
    exercises: [
      { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", setsCount: 3, targetReps: "10-12次", defaultWeight: 45 },
      { exerciseId: "ex-seated-cable-row", name: "坐姿绳索划船", setsCount: 3, targetReps: "10-12次", defaultWeight: 40 },
      { exerciseId: "ex-incline-db-curl", name: "上斜哑铃弯举", setsCount: 3, targetReps: "10-12次", defaultWeight: 10 }
    ]
  },
  {
    id: "plan-legs",
    name: "腿日 (Legs) —— 黄金比例的隐形支柱",
    shortName: "腿日",
    category: "腿",
    color: "purple",
    coreTarget: "不求练成健美巨兽的粗腿，但求练出协调、拉长、充满运动感的核心底盘",
    isRest: false,
    exercises: [
      { exerciseId: "ex-hack-squat", name: "哈克深蹲 / 倒蹬腿举", setsCount: 3, targetReps: "8-12次", defaultWeight: 60 },
      { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", setsCount: 3, targetReps: "10-12次", defaultWeight: 50 },
      { exerciseId: "ex-seated-leg-curl", name: "俯卧器械腿弯举 (Lying Leg Curl)", setsCount: 3, targetReps: "12-15次", defaultWeight: 35 }
    ]
  },
  {
    id: "plan-rest",
    name: "完全休息 (Rest) —— 超量恢复与神经修复",
    shortName: "休息",
    category: "休",
    color: "emerald",
    coreTarget: "保证7-8小时高质量睡眠，适量补充蛋白质和水分，让中枢神经与肌肉纤维充分超量修复",
    isRest: true,
    exercises: []
  }
];

// 新手极简加动作推荐池（针对不同分化，提供 2~3 个低门槛黄金动作一键加入）
export const SPLIT_RECOMMENDED_ADDONS = {
  "plan-push": [
    { exerciseId: "ex-seated-dumbbell-shoulder-press", name: "坐姿哑铃推肩", targetReps: "10-12次", defaultWeight: 20, defaultSets: 3, category: "肩部", tag: "复合增肌" },
    { exerciseId: "ex-overhead-cable-ext", name: "过头绳索臂屈伸", targetReps: "12-15次", defaultWeight: 15, defaultSets: 3, category: "手臂", tag: "三头长头" },
    { exerciseId: "ex-pec-deck-fly", name: "蝴蝶机夹胸 (Pec Deck)", targetReps: "12-15次", defaultWeight: 35, defaultSets: 3, category: "胸部", tag: "孤立泵感" }
  ],
  "plan-pull": [
    { exerciseId: "ex-face-pull", name: "绳索面拉 (Face Pull)", targetReps: "12-15次", defaultWeight: 15, defaultSets: 3, category: "背部", tag: "后束防圆肩" },
    { exerciseId: "ex-hammer-curl", name: "哑铃锤式弯举", targetReps: "10-12次", defaultWeight: 12, defaultSets: 3, category: "手臂", tag: "手臂厚度" },
    { exerciseId: "ex-chest-supported-row", name: "胸垫胸前划船 (T-Bar)", targetReps: "8-10次", defaultWeight: 40, defaultSets: 3, category: "背部", tag: "上背增厚" }
  ],
  "plan-legs": [
    { exerciseId: "ex-calf-raise", name: "站姿/坐姿提踵", targetReps: "15-20次", defaultWeight: 40, defaultSets: 3, category: "腿部", tag: "小腿脚踝" },
    { exerciseId: "ex-leg-extension", name: "器械腿屈伸 (踢腿机)", targetReps: "12-15次", defaultWeight: 40, defaultSets: 3, category: "腿部", tag: "股四头雕刻" },
    { exerciseId: "ex-cable-glute-kickback", name: "绳索臀部后踢 (Glute Kickback)", targetReps: "12-15次", defaultWeight: 15, defaultSets: 3, category: "腿部", tag: "臀部激活" }
  ],
  "default": [
    { exerciseId: "ex-hanging-leg-raise", name: "悬垂举腿 / 仰卧举腿", targetReps: "15-20次", defaultWeight: 0, defaultSets: 3, category: "核心", tag: "核心雕刻" },
    { exerciseId: "ex-cable-lateral-raise", name: "绳索侧平举", targetReps: "12-15次", defaultWeight: 7.5, defaultSets: 3, category: "肩部", tag: "肩峰雕刻" },
    { exerciseId: "ex-seated-dumbbell-shoulder-press", name: "坐姿哑铃推肩", targetReps: "10-12次", defaultWeight: 20, defaultSets: 3, category: "肩部", tag: "肩部力量" }
  ]
};

export const PRESET_CYCLES = [
  {
    id: "cycle-pplr-4",
    name: "推拉腿休 4日黄金分化",
    description: "当前默认最高效分化：砍掉无用功，聚焦拉伸区肥大与充分超量恢复。",
    days: [
      { id: "cd-1", name: "Day 1: 推日 (Push)", shortName: "推", planId: "plan-push", color: "amber", isRest: false },
      { id: "cd-2", name: "Day 2: 拉日 (Pull)", shortName: "拉", planId: "plan-pull", color: "sky", isRest: false },
      { id: "cd-3", name: "Day 3: 腿日 (Legs)", shortName: "腿", planId: "plan-legs", color: "purple", isRest: false },
      { id: "cd-4", name: "Day 4: 完全休息 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true }
    ]
  },
  {
    id: "cycle-ppr-3",
    name: "推拉休 3日紧凑分化",
    description: "适合时间紧张或将腿部融合进推拉日的快速循环周期。",
    days: [
      { id: "cd-1", name: "Day 1: 推日 (Push)", shortName: "推", planId: "plan-push", color: "amber", isRest: false },
      { id: "cd-2", name: "Day 2: 拉日 (Pull)", shortName: "拉", planId: "plan-pull", color: "sky", isRest: false },
      { id: "cd-3", name: "Day 3: 完全休息 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true }
    ]
  },
  {
    id: "cycle-ulr-3",
    name: "上下肢 3日循环",
    description: "经典上肢/下肢分化，训练频次高、动作覆盖全面。",
    days: [
      { id: "cd-1", name: "Day 1: 上肢日 (Upper)", shortName: "上", planId: "plan-push", color: "sky", isRest: false },
      { id: "cd-2", name: "Day 2: 下肢日 (Lower)", shortName: "下", planId: "plan-legs", color: "purple", isRest: false },
      { id: "cd-3", name: "Day 3: 休息日 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true }
    ]
  }
];

export const SCIENCE_PRINCIPLES = [
  {
    title: "砍掉所有“无用功”",
    desc: "很多计划中存在大量同质化动作（如多个角度极近的夹胸或下压）。本计划精选每个针对不同发力点、拉伸部位和肌肉功能区的核心黄金动作。"
  },
  {
    title: "拉伸区肥大 (Stretch-Mediated Hypertrophy)",
    desc: "上斜哑铃卧推、过头臂屈伸、上斜弯举等，全部在肌肉被拉伸最长、阻力力臂最大的关键点发力，是运动科学公认增肌刺激最强区间。"
  },
  {
    title: "超量恢复 (Supercompensation)",
    desc: "肌肉增长发生在休息中而非举铁时。推拉腿后安排完整休息日，保证中枢神经系统 (CNS) 彻底恢复，下个循环能冲刺更高容量。"
  }
];

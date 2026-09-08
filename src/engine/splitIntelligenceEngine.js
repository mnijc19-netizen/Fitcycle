/**
 * FITCYCLE 实时分化肌群刺激诊断与零额度启发式引擎
 * (Deterministic Split Muscle Coverage & Hypertrophy Volume Engine)
 * 
 * 架构公理：
 * 1. 100% 纯本地同步纯函数运行，响应时间 < 1ms，0 网络依赖，0 API 额度/Token 损耗；
 * 2. 遵循 NSCA (美国体能协会) 与 ACSM 运动科学超量恢复容量指南：
 *    - 大肌群（胸、背、大腿）单次增肌黄金有效组数：6 ~ 10 组；
 *    - 辅助/小肌群（肩前中束、三头、二头、小腿）单次增肌黄金有效组数：4 ~ 8 组；
 * 3. 动态精准识别当前分化（推、拉、腿、上下肢、全身）各大目标肌群，输出实时刺激达标度与缺口动作补充推荐。
 */

export const SPLIT_DEFINITIONS = {
  push: {
    key: "push",
    name: "推日 (Push)",
    keywords: ["推", "push", "胸肩", "上肢推"],
    targetMuscles: [
      { key: "chest", name: "胸大肌", minSets: 6, maxSets: 10, role: "primary", category: "胸部" },
      { key: "shoulders", name: "三角肌前/中束", minSets: 4, maxSets: 8, role: "secondary", category: "肩部" },
      { key: "triceps", name: "肱三头肌", minSets: 4, maxSets: 8, role: "secondary", category: "手臂" }
    ],
    defaultAddons: [
      { exerciseId: "ex-pec-deck-fly", name: "蝴蝶机夹胸 (Pec Deck)", targetReps: "12-15次", defaultWeight: 35, defaultSets: 3, category: "胸部", tag: "胸肌孤立", targetMuscleKey: "chest" },
      { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", targetReps: "8-10次", defaultWeight: 20, defaultSets: 3, category: "胸部", tag: "上胸饱满", targetMuscleKey: "chest" },
      { exerciseId: "ex-cable-lateral-raise", name: "绳索侧平举", targetReps: "12-15次", defaultWeight: 7.5, defaultSets: 3, category: "肩部", tag: "肩宽中束", targetMuscleKey: "shoulders" },
      { exerciseId: "ex-seated-dumbbell-shoulder-press", name: "坐姿哑铃推肩", targetReps: "10-12次", defaultWeight: 18, defaultSets: 3, category: "肩部", tag: "前束增厚", targetMuscleKey: "shoulders" },
      { exerciseId: "ex-overhead-cable-ext", name: "过头绳索臂屈伸", targetReps: "12-15次", defaultWeight: 15, defaultSets: 3, category: "手臂", tag: "三头长头", targetMuscleKey: "triceps" },
      { exerciseId: "ex-tricep-pushdown", name: "站姿绳索三头下压", targetReps: "10-12次", defaultWeight: 20, defaultSets: 3, category: "手臂", tag: "三头外侧", targetMuscleKey: "triceps" }
    ]
  },
  pull: {
    key: "pull",
    name: "拉日 (Pull)",
    keywords: ["拉", "pull", "背部", "上肢拉"],
    targetMuscles: [
      { key: "back", name: "背部肌群", minSets: 6, maxSets: 10, role: "primary", category: "背部" },
      { key: "rear_delts", name: "三角肌后束", minSets: 3, maxSets: 6, role: "secondary", category: "肩部" },
      { key: "biceps", name: "肱二头肌", minSets: 4, maxSets: 8, role: "secondary", category: "手臂" }
    ],
    defaultAddons: [
      { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", targetReps: "10-12次", defaultWeight: 45, defaultSets: 3, category: "背部", tag: "背阔拉宽", targetMuscleKey: "back" },
      { exerciseId: "ex-seated-cable-row", name: "坐姿绳索划船", targetReps: "10-12次", defaultWeight: 40, defaultSets: 3, category: "背部", tag: "上背增厚", targetMuscleKey: "back" },
      { exerciseId: "ex-face-pull", name: "绳索面拉 (Face Pull)", targetReps: "12-15次", defaultWeight: 15, defaultSets: 3, category: "肩部", tag: "后束防圆肩", targetMuscleKey: "rear_delts" },
      { exerciseId: "ex-reverse-pec-deck", name: "反向蝴蝶机后束飞鸟", targetReps: "12-15次", defaultWeight: 25, defaultSets: 3, category: "肩部", tag: "后束孤立", targetMuscleKey: "rear_delts" },
      { exerciseId: "ex-incline-db-curl", name: "上斜哑铃弯举", targetReps: "10-12次", defaultWeight: 10, defaultSets: 3, category: "手臂", tag: "二头长头", targetMuscleKey: "biceps" },
      { exerciseId: "ex-hammer-curl", name: "哑铃锤式弯举", targetReps: "10-12次", defaultWeight: 12, defaultSets: 3, category: "手臂", tag: "肱肌与小臂", targetMuscleKey: "biceps" }
    ]
  },
  legs: {
    key: "legs",
    name: "腿日 (Legs)",
    keywords: ["腿日", "练腿", "腿部", "legs", "leg", "腿"],
    targetMuscles: [
      { key: "quads", name: "股四头肌 (前侧)", minSets: 6, maxSets: 10, role: "primary", category: "腿部" },
      { key: "posterior", name: "腘绳肌与臀大肌", minSets: 6, maxSets: 10, role: "primary", category: "腿部" },
      { key: "calves", name: "小腿与跟腱", minSets: 3, maxSets: 6, role: "secondary", category: "腿部" }
    ],
    defaultAddons: [
      { exerciseId: "ex-hack-squat", name: "哈克深蹲 / 倒蹬腿举", targetReps: "8-12次", defaultWeight: 60, defaultSets: 3, category: "腿部", tag: "股四推力", targetMuscleKey: "quads" },
      { exerciseId: "ex-leg-extension", name: "器械腿屈伸 (踢腿机)", targetReps: "12-15次", defaultWeight: 40, defaultSets: 3, category: "腿部", tag: "股四雕刻", targetMuscleKey: "quads" },
      { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", targetReps: "10-12次", defaultWeight: 50, defaultSets: 3, category: "腿部", tag: "腘绳臀部", targetMuscleKey: "posterior" },
      { exerciseId: "ex-seated-leg-curl", name: "俯卧器械腿弯举 (Lying Leg Curl)", targetReps: "12-15次", defaultWeight: 35, defaultSets: 3, category: "腿部", tag: "腘绳孤立", targetMuscleKey: "posterior" },
      { exerciseId: "ex-calf-raise", name: "站姿/坐姿提踵", targetReps: "15-20次", defaultWeight: 40, defaultSets: 3, category: "腿部", tag: "小腿爆发", targetMuscleKey: "calves" }
    ]
  },
  upper: {
    key: "upper",
    name: "上肢分化 (Upper)",
    keywords: ["上肢", "upper"],
    targetMuscles: [
      { key: "chest", name: "胸大肌", minSets: 4, maxSets: 8, role: "primary", category: "胸部" },
      { key: "back", name: "背部肌群", minSets: 4, maxSets: 8, role: "primary", category: "背部" },
      { key: "shoulders", name: "肩部肌群", minSets: 3, maxSets: 6, role: "secondary", category: "肩部" },
      { key: "arms", name: "手臂(二/三头)", minSets: 3, maxSets: 6, role: "secondary", category: "手臂" }
    ],
    defaultAddons: [
      { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", targetReps: "8-10次", defaultWeight: 20, defaultSets: 3, category: "胸部", tag: "胸部推力", targetMuscleKey: "chest" },
      { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", targetReps: "10-12次", defaultWeight: 45, defaultSets: 3, category: "背部", tag: "垂直拉力", targetMuscleKey: "back" },
      { exerciseId: "ex-cable-lateral-raise", name: "绳索侧平举", targetReps: "12-15次", defaultWeight: 7.5, defaultSets: 3, category: "肩部", tag: "肩部中束", targetMuscleKey: "shoulders" },
      { exerciseId: "ex-overhead-cable-ext", name: "过头绳索臂屈伸", targetReps: "12-15次", defaultWeight: 15, defaultSets: 3, category: "手臂", tag: "手臂三头", targetMuscleKey: "arms" }
    ]
  },
  lower: {
    key: "lower",
    name: "下肢分化 (Lower)",
    keywords: ["下肢", "lower"],
    targetMuscles: [
      { key: "quads", name: "股四头肌", minSets: 5, maxSets: 8, role: "primary", category: "腿部" },
      { key: "posterior", name: "腘绳与臀部", minSets: 5, maxSets: 8, role: "primary", category: "腿部" },
      { key: "calves", name: "小腿", minSets: 3, maxSets: 6, role: "secondary", category: "腿部" },
      { key: "core", name: "核心肌群", minSets: 3, maxSets: 6, role: "secondary", category: "核心" }
    ],
    defaultAddons: [
      { exerciseId: "ex-hack-squat", name: "哈克深蹲 / 倒蹬腿举", targetReps: "8-12次", defaultWeight: 60, defaultSets: 3, category: "腿部", tag: "下肢推力", targetMuscleKey: "quads" },
      { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", targetReps: "10-12次", defaultWeight: 50, defaultSets: 3, category: "腿部", tag: "后链拉力", targetMuscleKey: "posterior" },
      { exerciseId: "ex-calf-raise", name: "站姿/坐姿提踵", targetReps: "15-20次", defaultWeight: 40, defaultSets: 3, category: "腿部", tag: "小腿抗阻", targetMuscleKey: "calves" }
    ]
  },
  arnold_chest_back: {
    key: "arnold_chest_back",
    name: "阿诺德胸背日 (Chest & Back)",
    keywords: ["胸背", "arnold a", "阿诺德a", "arnold 1", "胸与背"],
    targetMuscles: [
      { key: "chest", name: "胸大肌 (上/中下胸)", minSets: 6, maxSets: 10, role: "primary", category: "胸部" },
      { key: "back", name: "背部肌群 (背阔与上背)", minSets: 6, maxSets: 10, role: "primary", category: "背部" }
    ],
    defaultAddons: [
      { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", targetReps: "8-10次", defaultWeight: 20, defaultSets: 3, category: "胸部", tag: "上胸强化", targetMuscleKey: "chest" },
      { exerciseId: "ex-pec-deck-fly", name: "蝴蝶机夹胸 (Pec Deck)", targetReps: "12-15次", defaultWeight: 35, defaultSets: 3, category: "胸部", tag: "胸肌孤立", targetMuscleKey: "chest" },
      { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", targetReps: "10-12次", defaultWeight: 45, defaultSets: 3, category: "背部", tag: "垂直拉宽", targetMuscleKey: "back" },
      { exerciseId: "ex-seated-cable-row", name: "坐姿绳索划船", targetReps: "10-12次", defaultWeight: 40, defaultSets: 3, category: "背部", tag: "水平增厚", targetMuscleKey: "back" }
    ]
  },
  arnold_shoulders_arms: {
    key: "arnold_shoulders_arms",
    name: "阿诺德肩臂日 (Shoulders & Arms)",
    keywords: ["肩臂", "arnold b", "阿诺德b", "arnold 2", "肩与臂"],
    targetMuscles: [
      { key: "shoulders", name: "三角肌前/中束", minSets: 5, maxSets: 9, role: "primary", category: "肩部" },
      { key: "rear_delts", name: "三角肌后束", minSets: 3, maxSets: 6, role: "primary", category: "肩部" },
      { key: "biceps", name: "肱二头肌", minSets: 4, maxSets: 8, role: "secondary", category: "手臂" },
      { key: "triceps", name: "肱三头肌", minSets: 4, maxSets: 8, role: "secondary", category: "手臂" }
    ],
    defaultAddons: [
      { exerciseId: "ex-cable-lateral-raise", name: "绳索侧平举", targetReps: "12-15次", defaultWeight: 7.5, defaultSets: 3, category: "肩部", tag: "肩宽中束", targetMuscleKey: "shoulders" },
      { exerciseId: "ex-face-pull", name: "绳索面拉 (Face Pull)", targetReps: "12-15次", defaultWeight: 15, defaultSets: 3, category: "肩部", tag: "后束防圆肩", targetMuscleKey: "rear_delts" },
      { exerciseId: "ex-incline-db-curl", name: "上斜哑铃弯举", targetReps: "10-12次", defaultWeight: 10, defaultSets: 3, category: "手臂", tag: "二头长头", targetMuscleKey: "biceps" },
      { exerciseId: "ex-overhead-cable-ext", name: "过头绳索臂屈伸", targetReps: "12-15次", defaultWeight: 15, defaultSets: 3, category: "手臂", tag: "三头长头", targetMuscleKey: "triceps" }
    ]
  },
  full_body: {
    key: "full_body",
    name: "全身分化 (Full Body)",
    keywords: ["全身", "full body", "全身综合", "全身分化"],
    targetMuscles: [
      { key: "quads", name: "股四头肌 (下肢推)", minSets: 3, maxSets: 6, role: "primary", category: "腿部" },
      { key: "posterior", name: "腘绳肌/臀 (下肢拉)", minSets: 3, maxSets: 6, role: "primary", category: "腿部" },
      { key: "chest", name: "胸大肌 (上肢推)", minSets: 3, maxSets: 6, role: "primary", category: "胸部" },
      { key: "back", name: "背部肌群 (上肢拉)", minSets: 3, maxSets: 6, role: "primary", category: "背部" }
    ],
    defaultAddons: [
      { exerciseId: "ex-hack-squat", name: "哈克深蹲 / 倒蹬腿举", targetReps: "8-12次", defaultWeight: 60, defaultSets: 3, category: "腿部", tag: "下肢复合", targetMuscleKey: "quads" },
      { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", targetReps: "10-12次", defaultWeight: 50, defaultSets: 3, category: "腿部", tag: "后链做工", targetMuscleKey: "posterior" },
      { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", targetReps: "8-10次", defaultWeight: 20, defaultSets: 3, category: "胸部", tag: "上肢推力", targetMuscleKey: "chest" },
      { exerciseId: "ex-seated-cable-row", name: "坐姿绳索划船", targetReps: "10-12次", defaultWeight: 40, defaultSets: 3, category: "背部", tag: "上肢拉力", targetMuscleKey: "back" }
    ]
  },
  chest_focus: {
    key: "chest_focus",
    name: "胸部专项 (Chest Focus)",
    keywords: ["纯胸", "胸部专项", "胸部训练", "练胸日", "chest focus"],
    targetMuscles: [
      { key: "chest", name: "胸大肌 (复合推力与孤立)", minSets: 8, maxSets: 12, role: "primary", category: "胸部" },
      { key: "triceps", name: "肱三头肌", minSets: 4, maxSets: 8, role: "secondary", category: "手臂" },
      { key: "shoulders", name: "三角肌前/中束", minSets: 3, maxSets: 6, role: "secondary", category: "肩部" }
    ],
    defaultAddons: [
      { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", targetReps: "8-10次", defaultWeight: 20, defaultSets: 3, category: "胸部", tag: "上胸饱满", targetMuscleKey: "chest" },
      { exerciseId: "ex-pec-deck-fly", name: "蝴蝶机夹胸 (Pec Deck)", targetReps: "12-15次", defaultWeight: 35, defaultSets: 3, category: "胸部", tag: "胸肌孤立", targetMuscleKey: "chest" },
      { exerciseId: "ex-tricep-pushdown", name: "站姿绳索三头下压", targetReps: "10-12次", defaultWeight: 20, defaultSets: 3, category: "手臂", tag: "三头外侧", targetMuscleKey: "triceps" }
    ]
  },
  back_focus: {
    key: "back_focus",
    name: "背部专项 (Back Focus)",
    keywords: ["纯背", "背部专项", "背部训练", "练背日", "back focus"],
    targetMuscles: [
      { key: "back", name: "背部肌群 (垂直+水平)", minSets: 8, maxSets: 12, role: "primary", category: "背部" },
      { key: "rear_delts", name: "三角肌后束", minSets: 3, maxSets: 6, role: "secondary", category: "肩部" },
      { key: "biceps", name: "肱二头肌", minSets: 4, maxSets: 8, role: "secondary", category: "手臂" }
    ],
    defaultAddons: [
      { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", targetReps: "10-12次", defaultWeight: 45, defaultSets: 3, category: "背部", tag: "背阔拉宽", targetMuscleKey: "back" },
      { exerciseId: "ex-seated-cable-row", name: "坐姿绳索划船", targetReps: "10-12次", defaultWeight: 40, defaultSets: 3, category: "背部", tag: "上背增厚", targetMuscleKey: "back" },
      { exerciseId: "ex-face-pull", name: "绳索面拉 (Face Pull)", targetReps: "12-15次", defaultWeight: 15, defaultSets: 3, category: "肩部", tag: "后束防圆肩", targetMuscleKey: "rear_delts" },
      { exerciseId: "ex-hammer-curl", name: "哑铃锤式弯举", targetReps: "10-12次", defaultWeight: 12, defaultSets: 3, category: "手臂", tag: "肱二头肌", targetMuscleKey: "biceps" }
    ]
  }
};


/**
 * 智能识别训练计划对应的分化类型
 * @param {string} planName 计划名称
 * @param {string} planCategory 计划分类
 * @returns {string} 'push' | 'pull' | 'legs' | 'upper' | 'lower' | 'arnold_chest_back' | 'arnold_shoulders_arms' | 'full_body' | 'chest_focus' | 'back_focus' | 'custom'
 */
export function detectSplitType(planName = "", planCategory = "") {
  const text = `${planName || ""} ${planCategory || ""}`.toLowerCase();
  // Check compound / multi-word splits first to avoid partial overlap with single-target splits
  const priorityKeys = [
    "arnold_chest_back",
    "arnold_shoulders_arms",
    "full_body",
    "chest_focus",
    "back_focus",
    "upper",
    "lower",
    "push",
    "pull",
    "legs"
  ];
  for (const key of priorityKeys) {
    const def = SPLIT_DEFINITIONS[key];
    if (def && def.keywords.some(kw => text.includes(kw.toLowerCase()))) {
      return key;
    }
  }
  return "custom";
}

/**
 * 运动科学与生物力学部位刺激诊断建议
 * @param {string} muscleKey 部位键值
 * @param {number} doneSets 已完成组数
 * @param {number} neededSets 尚欠缺组数
 * @returns {string} 生物力学科学诊断文案
 */
export function getMuscleBiomechanicalAdvice(muscleKey, doneSets, neededSets) {
  const advices = {
    back: {
      deficit: "背部由背阔肌、中下斜方肌与菱形肌构成。高位下拉主攻正面V字宽度，划船主攻上背厚度。当前背部容量未达标，建议结合下拉与划船双轨迹。",
      optimal: "背部大肌群做工充分！背阔肌外侧与上背厚度肌纤维已获高强度张力激活。"
    },
    rear_delts: {
      deficit: "复合拉动作中后束极易被背阔肌与大圆肌代偿。后束需要肩水平外展孤立轨迹（如反向飞鸟、高位绳索面拉），防止圆肩体态。",
      optimal: "三角肌后束孤立做工达标！肩部后侧立体饱满度与肩袖稳定性得到有效强化。"
    },
    biceps: {
      deficit: "引体或下拉虽有屈肘做工，但二头肌长短头无法在复合动作中达到力竭。建议补充孤立弯举（如上斜哑铃弯举、锤式弯举）直击肌腹与小臂。",
      optimal: "肱二头肌泵感做工充足！长头肌峰与肱肌均获得充分机械张力刺激。"
    },
    chest: {
      deficit: "胸大肌包含锁骨头上胸与胸肋头中下胸。上胸是视觉饱满关键，建议平板卧推后搭配上斜推胸或夹胸飞鸟补齐多角度刺激。",
      optimal: "胸大肌容量已进入黄金区间！上胸与中缝肌纤维撕裂刺激充分。"
    },
    shoulders: {
      deficit: "推胸已深度协同前束，肩部最易落后的是三角肌中束。必须依赖侧平举类动作向外孤立展开，才能拓宽头肩比打造球形肩。",
      optimal: "肩部三角肌做工充分！中束外展与推力刺激已达最佳平衡。"
    },
    triceps: {
      deficit: "肱三头肌占大臂体积 60%，其中长头必须在大臂过头拉伸位（过头臂屈伸）才能充分激活。建议补充绳索臂屈伸或下压。",
      optimal: "肱三头肌做工已达标！三头三大肌头均已受到充足离心拉伸与向心收缩。"
    },
    quads: {
      deficit: "股四头肌需要深蹲/倒蹬大重量闭链复合动作提供机械张力，辅以单关节器械腿屈伸直击股直肌。",
      optimal: "股四头肌做工达到超量恢复标准！下肢推力肌群全面充血激活。"
    },
    posterior: {
      deficit: "腘绳肌跨髋与跨膝双关节。需兼顾伸髋（罗马尼亚硬拉 RDL）与屈膝（器械腿弯举），才能完整刺激后链与臀大肌。",
      optimal: "腘绳肌与臀部后链做工达标！伸髋与屈膝双维度刺激圆满完成。"
    },
    calves: {
      deficit: "小腿腓肠肌与比目鱼肌具有高耐力红肌纤维，需要全行程深度拉伸与高次数顶峰收缩（提踵）。",
      optimal: "小腿肌群已充分激活，足踝离心支撑与耐力做工达标。"
    },
    core: {
      deficit: "核心肌群负责抗伸展与骨盆中立。建议搭配脊柱屈曲（悬垂举腿/卷腹）与抗伸展动作（平板支撑）。",
      optimal: "核心肌群做工达标！腹直肌与深层腹横肌已建立牢固稳定支撑。"
    }
  };

  const item = advices[muscleKey];
  if (!item) return neededSets > 0 ? `当前仍差 ${neededSets} 组做工，建议挑选对应动作补齐刺激。` : "该部位做工已达标！";
  return neededSets > 0 ? item.deficit : item.optimal;
}

/**
 * 将单个动作归类到分化对应的目标肌群键值
 * @param {object} exercise 动作对象
 * @returns {string} 目标肌群键值 (e.g. 'chest', 'shoulders', 'triceps', 'back', 'rear_delts', 'biceps', 'quads', 'posterior', 'calves', 'core', 'other')
 */
export function classifyExerciseMuscle(exercise) {
  if (!exercise) return "other";
  const name = (exercise.name || "").toLowerCase();
  const category = (exercise.category || "").toLowerCase();
  const target = (exercise.target || "").toLowerCase();

  // 1. 胸部
  if (category.includes("胸") || name.includes("推胸") || name.includes("卧推") || name.includes("夹胸") || target.includes("胸")) {
    return "chest";
  }

  // 2. 三角肌后束
  if (name.includes("后束") || target.includes("后束") || name.includes("面拉") || name.includes("反向飞鸟") || target.includes("面拉")) {
    return "rear_delts";
  }

  // 3. 肩部 (前/中束)
  if (category.includes("肩") || name.includes("推肩") || name.includes("侧平举") || name.includes("前平举") || name.includes("阿诺德") || target.includes("三角肌")) {
    return "shoulders";
  }

  // 4. 手臂 - 肱三头肌
  if ((category.includes("臂") || category.includes("手臂")) && (name.includes("三头") || name.includes("下压") || name.includes("臂屈伸") || target.includes("三头"))) {
    return "triceps";
  }
  if (name.includes("三头") || name.includes("双杠臂屈伸") || target.includes("三头")) {
    return "triceps";
  }

  // 5. 手臂 - 肱二头肌
  if ((category.includes("臂") || category.includes("手臂")) && (name.includes("二头") || name.includes("弯举") || target.includes("二头"))) {
    return "biceps";
  }
  if (name.includes("弯举") || target.includes("二头")) {
    return "biceps";
  }

  // 6. 背部
  if (category.includes("背") || name.includes("下拉") || name.includes("划船") || name.includes("引体") || target.includes("背阔") || target.includes("菱形")) {
    return "back";
  }

  // 7. 小腿
  if (category.includes("腿") && (name.includes("提踵") || target.includes("小腿") || target.includes("比目鱼") || target.includes("腓肠"))) {
    return "calves";
  }

  // 8. 腘绳肌与臀大肌
  if (category.includes("腿") && (name.includes("硬拉") || name.includes("腿弯举") || name.includes("后踢") || name.includes("臀推") || target.includes("腘绳") || target.includes("臀"))) {
    return "posterior";
  }

  // 9. 股四头肌
  if (category.includes("腿") || name.includes("深蹲") || name.includes("腿举") || name.includes("倒蹬") || name.includes("哈克") || name.includes("腿屈伸") || name.includes("箭步") || target.includes("股四")) {
    return "quads";
  }

  // 10. 核心
  if (category.includes("核心") || category.includes("腹") || name.includes("卷腹") || name.includes("举腿") || name.includes("平板支撑")) {
    return "core";
  }

  return "other";
}

/**
 * 实时分析当前正在进行的训练的肌群覆盖度与做工充足性 (纯函数，0 额度消耗，毫秒级响应)
 * @param {object} activeWorkout 当前正在进行的训练状态对象
 * @param {Array} libraryExercises 可选全局动作库
 * @returns {object} 包含各肌群做工进度、状态、缺口提示及推荐补充动作
 */
export function analyzeActiveWorkoutCoverage(activeWorkout, libraryExercises = []) {
  if (!activeWorkout || !Array.isArray(activeWorkout.exercises)) {
    return {
      splitKey: "custom",
      splitName: "自定义训练",
      isCustom: true,
      muscles: [],
      deficits: [],
      hasDeficit: false,
      overallStatus: "neutral",
      headline: "暂无进行中的训练",
      recommendedAddons: []
    };
  }

  const splitKey = detectSplitType(activeWorkout.planName, activeWorkout.category || activeWorkout.planId);
  const splitDef = SPLIT_DEFINITIONS[splitKey];

  if (!splitDef) {
    // 自定义或未知分化：根据实际包含的动作动态汇总统计算
    const muscleCountMap = {};
    let totalDoneSets = 0;

    activeWorkout.exercises.forEach(ex => {
      const muscle = classifyExerciseMuscle(ex);
      const doneSets = (ex.sets || []).filter(s => Boolean(s.completed)).length;
      totalDoneSets += doneSets;
      muscleCountMap[muscle] = (muscleCountMap[muscle] || 0) + doneSets;
    });

    return {
      splitKey: "custom",
      splitName: activeWorkout.planName || "自主训练",
      isCustom: true,
      totalDoneSets,
      muscles: Object.entries(muscleCountMap).map(([k, count]) => ({
        key: k,
        name: k,
        completedSets: count,
        status: count >= 6 ? "optimal" : (count > 0 ? "partial" : "missing")
      })),
      deficits: [],
      hasDeficit: false,
      overallStatus: totalDoneSets >= 12 ? "success" : "neutral",
      headline: totalDoneSets > 0 ? `已完成 ${totalDoneSets} 组有效做工` : "准备开始第一组",
      recommendedAddons: []
    };
  }

  // 1. 统计每个目标肌群的已完成组数 (严格统计已打勾 completed 的组)
  const completedSetsMap = {};
  const synergySetsMap = {};
  const presentExerciseNames = new Set(
    activeWorkout.exercises.map(e => (e.name || "").trim().toLowerCase())
  );

  splitDef.targetMuscles.forEach(m => {
    completedSetsMap[m.key] = 0;
    synergySetsMap[m.key] = 0;
  });

  activeWorkout.exercises.forEach(ex => {
    const muscleKey = classifyExerciseMuscle(ex);
    const completedSets = (ex.sets || []).filter(s => Boolean(s.completed)).length;

    if (completedSetsMap[muscleKey] !== undefined) {
      completedSetsMap[muscleKey] += completedSets;
    } else {
      // 上肢/下肢等兼容映射
      if (splitKey === "upper" && (muscleKey === "biceps" || muscleKey === "triceps")) {
        completedSetsMap.arms = (completedSetsMap.arms || 0) + completedSets;
      }
    }

    // 统计复合动作的次要协同做工 (用于辅助提示，避免用户误解完全没刺激)
    if (completedSets > 0) {
      if (muscleKey === "back") {
        if (synergySetsMap.biceps !== undefined) synergySetsMap.biceps += completedSets;
        if (synergySetsMap.rear_delts !== undefined) synergySetsMap.rear_delts += Math.round(completedSets * 0.5);
      } else if (muscleKey === "chest") {
        if (synergySetsMap.triceps !== undefined) synergySetsMap.triceps += completedSets;
        if (synergySetsMap.shoulders !== undefined) synergySetsMap.shoulders += Math.round(completedSets * 0.5);
      }
    }
  });

  // 2. 评定各肌群刺激饱和度，并附带部位专属精准动作推荐池与解剖科学理由
  const deficits = [];
  const muscleResults = splitDef.targetMuscles.map(tm => {
    const done = completedSetsMap[tm.key] || 0;
    const synergy = synergySetsMap[tm.key] || 0;
    let status = "missing"; // missing | insufficient | optimal | surplus
    let statusText = "尚未练习";
    let color = "zinc";

    if (done === 0) {
      status = "missing";
      statusText = "未练";
      color = "rose";
    } else if (done < tm.minSets) {
      status = "insufficient";
      const diff = tm.minSets - done;
      statusText = `缺 ${diff} 组`;
      color = "amber";
    } else if (done <= tm.maxSets) {
      status = "optimal";
      statusText = "已达标";
      color = "emerald";
    } else {
      status = "surplus";
      statusText = "充分";
      color = "sky";
    }

    const needed = Math.max(0, tm.minSets - done);
    const percentage = Math.min(100, Math.round((done / tm.minSets) * 100));

    // 生成该部位的专属生物力学缺口诊断理由
    const deficitReason = getMuscleBiomechanicalAdvice(tm.key, done, needed);

    // 构建该部位专属的高质量候选补充动作 (剔除当前训练中已有的动作)
    const specificAddons = [];
    
    // a. 首先从分化推荐池中筛选目标匹配的动作
    (splitDef.defaultAddons || []).forEach(addon => {
      const isPresent = presentExerciseNames.has(addon.name.toLowerCase());
      if (!isPresent && addon.targetMuscleKey === tm.key) {
        if (!specificAddons.some(a => a.name === addon.name)) {
          specificAddons.push({
            ...addon,
            reason: `强化${addon.tag || tm.name}`
          });
        }
      }
    });

    // b. 从全局库动态提取同部位高价值动作
    if (specificAddons.length < 4 && Array.isArray(libraryExercises) && libraryExercises.length > 0) {
      for (const ex of libraryExercises) {
        if (specificAddons.length >= 4) break;
        const mKey = classifyExerciseMuscle(ex);
        const isPresent = presentExerciseNames.has((ex.name || "").toLowerCase());
        if (mKey === tm.key && !isPresent && !specificAddons.some(a => a.name === ex.name)) {
          specificAddons.push({
            exerciseId: ex.id,
            name: ex.name,
            category: ex.category,
            targetReps: `${ex.defaultReps || "10-12"}次`,
            defaultWeight: 20,
            defaultSets: 3,
            tag: ex.tags?.[0] || "增肌平替",
            reason: `精准刺激${ex.target || tm.name}`
          });
        }
      }
    }

    const muscleObj = {
      key: tm.key,
      name: tm.name,
      role: tm.role,
      category: tm.category,
      completedSets: done,
      synergySets: synergy,
      minSets: tm.minSets,
      maxSets: tm.maxSets,
      needed,
      status,
      statusText,
      color,
      percentage,
      deficitReason,
      specificAddons
    };

    if (status === "missing") {
      deficits.push({ ...muscleObj, reason: "尚未覆盖" });
    } else if (status === "insufficient") {
      deficits.push({ ...muscleObj, reason: `仅 ${done} 组 (偏低)` });
    }

    return muscleObj;
  });

  // 3. 组织诊断标题与人性化文案 (精简、清晰、无废话)
  let headline = "";
  let overallStatus = "neutral";

  if (deficits.length === 0) {
    headline = `${splitDef.name}各大目标肌群刺激全面达标，已进入超量恢复黄金区！`;
    overallStatus = "success";
  } else if (deficits.length === splitDef.targetMuscles.length) {
    headline = `核心目标：${splitDef.targetMuscles.map(m => m.name).join(" · ")}`;
    overallStatus = "neutral";
  } else {
    const deficitSummaries = deficits.map(d => {
      if (d.completedSets === 0) return `${d.name} (未练)`;
      return `${d.name} (差${d.needed}组)`;
    });
    headline = `建议补充：${deficitSummaries.join(" · ")}`;
    overallStatus = "warning";
  }

  // 4. 精准生成全局推荐补充动作 (排除当前训练已有的动作)
  const recommendedAddons = [];
  const deficitKeys = new Set(deficits.map(d => d.key));

  // 首先从专属推荐池挑取匹配缺口肌群的动作
  splitDef.defaultAddons.forEach(addon => {
    const isAlreadyPresent = presentExerciseNames.has(addon.name.toLowerCase());
    if (!isAlreadyPresent && deficitKeys.has(addon.targetMuscleKey)) {
      if (!recommendedAddons.some(r => r.name === addon.name)) {
        recommendedAddons.push({
          ...addon,
          reason: `补充${addon.tag || "肌群做工"}`
        });
      }
    }
  });

  // 若专属池不足，且传入了全局动作库，动态补足
  if (recommendedAddons.length < 3 && Array.isArray(libraryExercises) && libraryExercises.length > 0) {
    for (const ex of libraryExercises) {
      if (recommendedAddons.length >= 4) break;
      const mKey = classifyExerciseMuscle(ex);
      const isAlreadyPresent = presentExerciseNames.has((ex.name || "").toLowerCase());
      if (deficitKeys.has(mKey) && !isAlreadyPresent && !recommendedAddons.some(r => r.name === ex.name)) {
        recommendedAddons.push({
          exerciseId: ex.id,
          name: ex.name,
          category: ex.category,
          targetReps: `${ex.defaultReps || "10-12"}次`,
          defaultWeight: 20,
          defaultSets: 3,
          tag: ex.tags?.[0] || "增肌平替",
          reason: `精准刺激${ex.target || "目标肌群"}`
        });
      }
    }
  }

  return {
    splitKey,
    splitName: splitDef.name,
    isCustom: false,
    muscles: muscleResults,
    deficits,
    hasDeficit: deficits.length > 0,
    overallStatus,
    headline,
    recommendedAddons: recommendedAddons.slice(0, 3) // 最多展示 3 个精选推荐胶囊
  };
}


/**
 * 获取指定动作的同部位器械/自由重量秒级科学平替
 * @param {string} exerciseName 动作名称
 * @param {Array} libraryExercises 全局动作库
 * @returns {Array} 平替动作列表
 */
export function getInstantSubstitutes(exerciseName, libraryExercises = []) {
  if (!exerciseName) return [];
  const normalized = exerciseName.trim().toLowerCase();
  
  // 查找原动作
  const matched = libraryExercises.find(e => 
    e.name.toLowerCase() === normalized || 
    (e.aliases && e.aliases.some(a => a.toLowerCase() === normalized))
  );

  if (matched && Array.isArray(matched.substitutes) && matched.substitutes.length > 0) {
    return matched.substitutes.map(sub => {
      const fullSub = libraryExercises.find(e => e.name === sub.name);
      return {
        name: sub.name,
        reason: sub.reason || "生物力学同轨迹平替",
        gifUrl: fullSub ? fullSub.gifUrl : null,
        category: fullSub ? fullSub.category : matched.category,
        exerciseId: fullSub ? fullSub.id : null
      };
    });
  }

  // 若无内置 substitutes，按相同 category 推荐其他 3 个动作
  if (matched) {
    return libraryExercises
      .filter(e => e.category === matched.category && e.name !== matched.name)
      .slice(0, 3)
      .map(e => ({
        name: e.name,
        reason: "同部位高做工替代",
        gifUrl: e.gifUrl,
        category: e.category,
        exerciseId: e.id
      }));
  }

  return [];
}

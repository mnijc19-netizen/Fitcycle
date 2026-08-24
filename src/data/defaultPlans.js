export const DEFAULT_EXERCISES = [
  // 推日动作
  {
    id: "ex-incline-db-bench",
    name: "上斜哑铃卧推",
    category: "胸部",
    target: "上胸部 / 三角肌前束",
    defaultSets: 4,
    defaultReps: "8-10",
    scienceDetail: "上胸之王。哑铃的运动轨迹更符合胸肌纤维走向，极限拉伸感无与伦比，直接决定你的穿衣挺拔度。",
    tags: ["拉伸区肥大", "核心动作"]
  },
  {
    id: "ex-machine-chest-press",
    name: "固定器械推胸",
    category: "胸部",
    target: "胸大肌中下部",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "利用固定器械的超高稳定性（最好是双轴收敛机），不需浪费精力平衡重量，孤立轰炸中下胸，直接推到力竭。",
    tags: ["稳定性", "力竭泵感"]
  },
  {
    id: "ex-cable-lateral-raise",
    name: "绳索/哑铃侧平举",
    category: "肩部",
    target: "三角肌中束",
    defaultSets: 4,
    defaultReps: "12-15",
    scienceDetail: "肩宽的生死线（更推崇绳索）。绳索能提供全程均等的恒定张力，做这个动作时身体微倾，把三角肌中束彻底拉宽。",
    tags: ["倒三角关键", "全程恒张力"]
  },
  {
    id: "ex-machine-shoulder-press",
    name: "固定器械推肩",
    category: "肩部",
    target: "三角肌前中束 / 肱三头肌",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "此时前束和三头肌已充分热身，用器械做推举可以最大化保障安全做最后的重量冲刺与围度突破。",
    tags: ["大重量", "安全冲刺"]
  },
  {
    id: "ex-overhead-cable-ext",
    name: "过头绳索臂屈伸",
    category: "手臂",
    target: "肱三头肌长头",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "练三头肌绝对不能只做下压！必须有“过头”动作把三头肌长头完全拉伸开（面向龙门架），这样手臂才会从侧面看极具厚度。",
    tags: ["长头拉伸", "手臂厚度"]
  },

  // 拉日动作
  {
    id: "ex-lat-pulldown",
    name: "对握/宽握高位下拉",
    category: "背部",
    target: "背阔肌上部 / 大圆肌",
    defaultSets: 4,
    defaultReps: "10-12",
    scienceDetail: "翅膀起飞动作。主要刺激大圆肌和背阔肌上部，这是决定你从正面看有没有“V字反差”的关键。",
    tags: ["正面显宽", "V字腰身"]
  },
  {
    id: "ex-chest-supported-row",
    name: "胸垫胸前划船",
    category: "背部",
    target: "上背部 / 斜方肌 / 菱形肌",
    defaultSets: 3,
    defaultReps: "8-10",
    scienceDetail: "有胸垫支撑（T杠或器械划船）可以完全解放你的下背部，让你能用极大的重量去撕裂上背部，增加背部3D立体细节。",
    tags: ["增厚上背", "保护下背"]
  },
  {
    id: "ex-straight-arm-pulldown",
    name: "直臂下压",
    category: "背部",
    target: "背阔肌孤立刺激",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "孤立背阔肌（绳索或直杠）。在手臂不参与发力代偿的情况下，让背阔肌在顶峰拉伸位承受最大张力。",
    tags: ["单关节孤立", "顶峰拉伸"]
  },
  {
    id: "ex-face-pull",
    name: "绳索面拉 / 反向飞鸟",
    category: "肩部",
    target: "三角肌后束 / 上背",
    defaultSets: 4,
    defaultReps: "15",
    scienceDetail: "拯救圆肩大杀器。疯狂补强三角肌后束。后束饱满，你的肩膀从侧面看才是一个圆润饱满的球体，而不是扁平的。",
    tags: ["体态矫正", "3D球形肩"]
  },
  {
    id: "ex-incline-db-curl",
    name: "上斜哑铃弯举",
    category: "手臂",
    target: "肱二头肌长头",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "坐在上斜凳上（身体后仰），让肱二头肌处于极度拉伸状态再弯举，这是公认激活二头肌长头最强的动作。",
    tags: ["二头长头", "拉伸位肥大"]
  },
  {
    id: "ex-hammer-curl",
    name: "哑铃锤式弯举",
    category: "手臂",
    target: "肱肌 / 肱桡肌",
    defaultSets: 3,
    defaultReps: "12",
    scienceDetail: "锤式主要练肱肌（二头肌和三头肌之间那块肉），把它练大，会直接把二头肌“顶”起来，让手臂更粗更具力量感。",
    tags: ["手臂围度", "麒麟臂关键"]
  },

  // 腿日动作
  {
    id: "ex-hack-squat",
    name: "哈克深蹲 / 高位腿举",
    category: "腿部",
    target: "股四头肌 (大腿前侧)",
    defaultSets: 4,
    defaultReps: "8-12",
    scienceDetail: "放弃自由杠铃深蹲！哈克深蹲有完美的靠背支撑，能把100%的压力精准倾斜在大腿前侧（股四头肌），高效且安全。",
    tags: ["纯粹前侧", "安全高效"]
  },
  {
    id: "ex-rdl",
    name: "罗马尼亚硬拉 (RDL)",
    category: "腿部",
    target: "腘绳肌 (大腿后侧) / 臀大肌",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "身材体态的真神。练腿后侧和臀部。它能矫正骨盆前倾，强化核心，让你站姿更挺拔，同时也是背部围度的隐形推手。",
    tags: ["骨盆体态", "后链黄金"]
  },
  {
    id: "ex-seated-leg-curl",
    name: "坐姿腿弯举",
    category: "腿部",
    target: "腘绳肌孤立拉伸",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "孤立大腿后侧。坐姿比趴姿更能拉伸腘绳肌近端，运动生理学证明其增肌效率显著更高。",
    tags: ["孤立拉伸", "高效增肌"]
  },
  {
    id: "ex-calf-raise",
    name: "站姿 / 坐姿提踵",
    category: "腿部",
    target: "小腿腓肠肌 / 比目鱼肌",
    defaultSets: 3,
    defaultReps: "15-20",
    scienceDetail: "稍微修饰小腿线条，避免出现明显的“头重脚轻”，强化踝关节稳定性。",
    tags: ["线条修饰", "踝关节稳定"]
  }
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
      { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", setsCount: 4, targetReps: "8-10次", defaultWeight: 20 },
      { exerciseId: "ex-machine-chest-press", name: "固定器械推胸（最好是双轴收敛机）", setsCount: 3, targetReps: "10-12次", defaultWeight: 45 },
      { exerciseId: "ex-cable-lateral-raise", name: "绳索/哑铃侧平举（更推崇绳索）", setsCount: 4, targetReps: "12-15次", defaultWeight: 7.5 },
      { exerciseId: "ex-machine-shoulder-press", name: "固定器械推肩", setsCount: 3, targetReps: "10-12次", defaultWeight: 35 },
      { exerciseId: "ex-overhead-cable-ext", name: "过头绳索臂屈伸（面向绳索龙门架）", setsCount: 3, targetReps: "12-15次", defaultWeight: 15 }
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
      { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", setsCount: 4, targetReps: "10-12次", defaultWeight: 45 },
      { exerciseId: "ex-chest-supported-row", name: "胸垫胸前划船（T杠或器械划船）", setsCount: 3, targetReps: "8-10次", defaultWeight: 40 },
      { exerciseId: "ex-straight-arm-pulldown", name: "直臂下压（绳索或直杠）", setsCount: 3, targetReps: "12-15次", defaultWeight: 20 },
      { exerciseId: "ex-face-pull", name: "绳索面拉（Face Pull）或反向飞鸟", setsCount: 4, targetReps: "15次", defaultWeight: 15 },
      { exerciseId: "ex-incline-db-curl", name: "上斜哑铃弯举", setsCount: 3, targetReps: "10-12次", defaultWeight: 10 },
      { exerciseId: "ex-hammer-curl", name: "哑铃锤式弯举", setsCount: 3, targetReps: "12次", defaultWeight: 12 }
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
      { exerciseId: "ex-hack-squat", name: "哈克深蹲（或高位腿举）", setsCount: 4, targetReps: "8-12次", defaultWeight: 60 },
      { exerciseId: "ex-rdl", name: "罗马尼亚硬拉（RDL）", setsCount: 3, targetReps: "10-12次", defaultWeight: 50 },
      { exerciseId: "ex-seated-leg-curl", name: "坐姿腿弯举", setsCount: 3, targetReps: "12-15次", defaultWeight: 35 },
      { exerciseId: "ex-calf-raise", name: "站姿/坐姿提踵", setsCount: 3, targetReps: "15-20次", defaultWeight: 40 }
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

export const CHEST_EXERCISES = [
  {
    id: "ex-incline-db-bench",
    name: "上斜哑铃卧推",
    englishName: "Incline Dumbbell Press",
    category: "胸部",
    target: "胸大肌上束 (锁骨头)",
    secondaryMuscles: ["三角肌前束", "肱三头肌"],
    gifUrl: "./exercises/incline-db-bench.gif",
    defaultSets: 4,
    defaultReps: "8-10",
    scienceDetail: "上胸之王。哑铃的运动轨迹更符合胸肌纤维走向，极限拉伸感无与伦比，直接决定你的穿衣挺拔度与锁骨下方的饱满度。",
    tags: ["拉伸区肥大", "核心动作", "上胸厚度"],
    tips: {
      prep: "椅背调节至30°-45°最佳倾角，沉肩锁背，胸口上挺，双脚踩实地面。",
      execution: "沿胸大肌肌纤维倾斜方向向上推起，肘关节微内收约60°-75°，避免直角伤肩。",
      peak: "推至顶峰时不要死锁手肘，用意念挤压双侧上胸部2秒。",
      negative: "慢速下放3-4秒，感受哑铃在底部对上胸肌纤维的强力深度拉伸。",
      breathing: "下放吸气扩张胸腔，推起发力时呼气吐气。"
    },
    commonMistakes: [
      "凳子角度过高（>45°）导致前束过度代偿变成推肩",
      "下放速度过快，失去离心张力",
      "手肘外展成90度导致肩峰撞击"
    ],
    substitutes: [
      { name: "平板杠铃卧推", reason: "提升整体上肢推力基础" },
      { name: "固定器械推胸", reason: "更安全的力竭轰炸" },
      { name: "龙门架绳索夹胸", reason: "顶峰恒定张力收缩" }
    ]
  },
  {
    id: "ex-barbell-bench-press",
    name: "平板杠铃卧推",
    englishName: "Barbell Bench Press",
    category: "胸部",
    target: "胸大肌整体 / 力量基石",
    secondaryMuscles: ["三角肌前束", "肱三头肌"],
    gifUrl: "./exercises/barbell-bench-press.gif",
    defaultSets: 4,
    defaultReps: "6-8",
    scienceDetail: "力量举三大项之一。全身复合推力之王，能承载最大负荷，有效提升上肢整体神经募集与胸部骨架围度。",
    tags: ["力量举三大项", "大重量突破", "整体增肌"],
    tips: {
      prep: "仰卧在卧推凳上，五点支撑（双脚踩实、臀部、上背、头部贴紧），沉肩后收肩胛骨。",
      execution: "杠铃平稳下放至乳头连线上方/胸肌中下部，小臂垂直于地面。",
      peak: "胸肌全力发力向上推起，肘部微屈不锁死。",
      negative: "控制下落节奏2秒，避免杠铃砸胸反弹。"
    },
    commonMistakes: ["肩胛骨松开导致肩膀前耸受伤", "手腕向后严重过度背屈导致腕关节受压"],
    substitutes: [
      { name: "平板哑铃卧推", reason: "更大活动行程与肩部更自然角度" },
      { name: "固定器械推胸", reason: "安全推到绝对力竭" }
    ]
  },
  {
    id: "ex-machine-chest-press",
    name: "固定器械推胸",
    englishName: "Machine Chest Press",
    category: "胸部",
    target: "胸大肌中下束 / 整体厚度",
    secondaryMuscles: ["三角肌前束", "肱三头肌"],
    gifUrl: "./exercises/machine-chest-press.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "利用固定器械的超高稳定性（最好是双轴收敛机），不需浪费精力平衡重量，孤立轰炸中下胸，可直接安全推到力竭。",
    tags: ["稳定性", "力竭泵感", "安全冲刺"],
    tips: {
      prep: "调节座椅高度使把手高度与胸部中线下缘齐平，背部紧贴靠背。",
      execution: "挺胸沉肩，大臂带动把手向前推出，感受胸肌的主动收缩挤压。",
      peak: "推至接近伸直点挤压胸肌，顶峰停顿1秒。",
      negative: "匀速退让还原本位，下放至手肘略微超过躯干即可。"
    },
    commonMistakes: ["耸肩推胸导致斜方肌代偿酸痛", "推起时后背离开靠背含胸"],
    substitutes: [
      { name: "平板杠铃卧推", reason: "传统黄金力量动作" },
      { name: "平板哑铃卧推", reason: "自由轨迹与深度拉伸" }
    ]
  },
  {
    id: "ex-flat-dumbbell-press",
    name: "平板哑铃卧推",
    englishName: "Flat Dumbbell Press",
    category: "胸部",
    target: "胸大肌中束 / 围度与平衡",
    secondaryMuscles: ["三角肌前束", "肱三头肌"],
    gifUrl: "./exercises/flat-dumbbell-press.gif",
    defaultSets: 4,
    defaultReps: "8-10",
    scienceDetail: "相比杠铃具有更大的底部拉伸深度和顶峰内收幅度，同时能有效矫正左右胸肌力量不平衡。",
    tags: ["左右平衡", "深度拉伸", "胸肌厚度"],
    tips: {
      prep: "挺胸沉肩后收肩胛骨，双手握哑铃置于胸部两侧，小臂始终垂直地面。",
      execution: "沿自然弧线向上向内推起哑铃，注意哑铃顶部不需剧烈相撞。",
      peak: "顶峰用意念死死挤压胸肌中缝2秒。",
      negative: "慢速下放3秒，感受胸肌纤维被完全拉长。"
    },
    commonMistakes: ["手肘向外过度张开成90度伤肩", "推起时双肩向前送脱离靠背"],
    substitutes: [
      { name: "上斜哑铃卧推", reason: "强化锁骨上胸" },
      { name: "平板杠铃卧推", reason: "冲击更大绝对力量" }
    ]
  },
  {
    id: "ex-pec-deck-fly",
    name: "蝴蝶机夹胸 (Pec Deck)",
    englishName: "Pec Deck Fly",
    category: "胸部",
    target: "胸肌内侧中缝 / 单关节孤立",
    secondaryMuscles: ["三角肌前束"],
    gifUrl: "./exercises/pec-deck-fly.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "单关节胸肌孤立神器。消除了三头肌的推力参与，全程让胸肌处于持续张力之下，打造深邃刀刻胸肌中缝。",
    tags: ["孤立胸肌", "中缝雕刻", "充血泵感"],
    tips: {
      prep: "调节座椅使把手与胸部中心齐平，手肘微屈锁死角度，挺胸紧贴靠背。",
      execution: "以肩关节为轴心，大臂向内拥抱聚拢，想象用两侧大臂夹胸口。",
      peak: "双手并拢时停留挤压2秒，感受胸大肌中缝的剧烈酸胀。",
      negative: "慢速控制回放，让胸肌在深处完全舒展开。"
    },
    commonMistakes: ["手肘角度在动作中随意变动", "耸肩含胸借力"],
    substitutes: [
      { name: "龙门架绳索夹胸", reason: "多角度多变张力" },
      { name: "平板哑铃卧推", reason: "复合大重量肥大" }
    ]
  },
  {
    id: "ex-cable-fly",
    name: "龙门架绳索夹胸",
    englishName: "Cable Crossover / Fly",
    category: "胸部",
    target: "胸肌下沿与中缝 / 轮廓雕刻",
    secondaryMuscles: ["三角肌前束"],
    gifUrl: "./exercises/cable-fly.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "全程恒定张力，在肌肉缩到最短时依然提供充足阻力，打造深邃胸肌中缝与清晰下沿轮廓。",
    tags: ["恒定张力", "中缝雕刻", "泵感极佳"],
    tips: {
      prep: "两脚前后站立弓步微俯身，手肘微屈锁定角度，挺胸展开双臂。",
      execution: "如拥抱大树般向中间画弧线合拢，注意力集中在胸肌挤压。",
      peak: "双手交叉或手腕相碰，用力夹紧胸肌2秒。",
      negative: "缓慢对抗绳索拉力回放，直到胸部完全展开拉伸。"
    },
    commonMistakes: ["手臂完全伸直导致手肘承受过大剪切力", "身体剧烈前后晃动借力"],
    substitutes: [
      { name: "蝴蝶机夹胸 (Pec Deck)", reason: "轨迹更孤立稳定" },
      { name: "下斜哑铃卧推", reason: "下胸厚度" }
    ]
  },
  {
    id: "ex-decline-bench-press",
    name: "下斜哑铃/杠铃卧推",
    englishName: "Decline Bench Press",
    category: "胸部",
    target: "胸大肌下束 (下沿轮廓)",
    secondaryMuscles: ["肱三头肌", "三角肌前束"],
    gifUrl: "./exercises/decline-bench-press.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "精准刺激胸大肌腹部头（下束），打造轮廓分明如同铠甲下边缘的立体胸肌底线。",
    tags: ["胸肌下沿", "铠甲胸", "清晰轮廓"],
    tips: {
      prep: "双脚稳固勾住下斜凳脚垫，挺胸收腹后躺，沉肩贴实椅背。",
      execution: "垂直向上推起哑铃，推起时集中挤压下胸部。",
      peak: "顶峰停留挤压1秒，避免手肘锁死。",
      negative: "匀速控制下落至胸肌下沿两侧。"
    },
    commonMistakes: ["下放位置过高砸向颈部", "起落节奏过快"],
    substitutes: [
      { name: "龙门架绳索夹胸", reason: "高位向下夹胸针对下沿" },
      { name: "固定器械推胸", reason: "整体厚度" }
    ]
  }
];

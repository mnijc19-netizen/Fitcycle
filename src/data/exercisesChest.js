export const CHEST_EXERCISES = [
  {
    id: "ex-incline-db-bench",
    name: "上斜哑铃卧推",
    englishName: "Incline Dumbbell Press",
    category: "胸部",
    target: "胸大肌上束 (锁骨头)",
    secondaryMuscles: ["三角肌前束", "肱三头肌"],
    aliases: ["上斜卧推", "上斜哑铃推胸", "上斜哑铃卧推", "哑铃上斜卧推", "上胸卧推", "上胸", "Incline Dumbbell Press"],
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
      { name: "上斜器械推胸", reason: "更安全的上胸力竭轰炸" },
      { name: "龙门架低位绳索夹胸", reason: "顶峰恒定张力收缩" }
    ]
  },
  {
    id: "ex-barbell-bench-press",
    name: "平板杠铃卧推",
    englishName: "Barbell Bench Press",
    category: "胸部",
    target: "胸大肌整体 / 力量基石",
    secondaryMuscles: ["三角肌前束", "肱三头肌"],
    aliases: ["卧推", "平板卧推", "杠铃卧推", "平板杠铃卧推", "大重量卧推", "三大项卧推", "推胸", "Bench Press"],
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
    aliases: ["器械推胸", "坐姿推胸", "固定器械推胸", "推胸机", "双轴推胸", "胸部推举", "坐姿器械推胸", "Machine Chest Press"],
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
    id: "ex-incline-machine-chest-press",
    name: "上斜器械推胸",
    englishName: "Incline Machine Chest Press",
    category: "胸部",
    target: "胸大肌上束 / 上胸安全力竭",
    secondaryMuscles: ["三角肌前束", "肱三头肌"],
    aliases: ["上斜器械推胸", "上斜推胸机", "器械上斜推胸", "上胸器械", "上斜坐姿推胸", "Incline Machine Press"],
    gifUrl: "./exercises/incline-chest-press-machine.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "器械固定上斜推角，彻底解放核心与平衡压力，让所有负荷100%倾泻在锁骨头上胸，安全冲刺到力竭。",
    tags: ["上胸力竭", "器械安全", "锁骨饱满"],
    tips: {
      prep: "调节座椅使握把对准锁骨下方，背部紧贴靠背，挺胸沉肩。",
      execution: "沿器械上斜轨迹向前上方推出，肘部内收不耸肩。",
      peak: "顶峰挤压上胸肌纤维2秒。",
      negative: "慢速下放让上胸充分拉长。"
    },
    commonMistakes: ["耸肩推胸", "背部离开靠垫借力"],
    substitutes: [
      { name: "上斜哑铃卧推", reason: "自由重量拉伸" },
      { name: "固定器械推胸", reason: "中下胸厚度" }
    ]
  },
  {
    id: "ex-flat-dumbbell-press",
    name: "平板哑铃卧推",
    englishName: "Flat Dumbbell Press",
    category: "胸部",
    target: "胸大肌中束 / 围度与平衡",
    secondaryMuscles: ["三角肌前束", "肱三头肌"],
    aliases: ["平板哑铃卧推", "哑铃卧推", "哑铃推胸", "平板哑铃推胸", "哑铃平卧推", "平推", "Dumbbell Press"],
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
    aliases: ["蝴蝶机夹胸", "蝴蝶机", "夹胸", "器械夹胸", "坐姿夹胸", "胸肌中缝", "飞鸟夹胸", "Pec Deck"],
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
      { name: "哑铃飞鸟", reason: "自由重量深层拉伸" },
      { name: "龙门架绳索夹胸", reason: "多角度多变张力" }
    ]
  },
  {
    id: "ex-dumbbell-fly",
    name: "平板哑铃飞鸟",
    englishName: "Flat Dumbbell Fly",
    category: "胸部",
    target: "胸大肌外沿与拉伸位",
    secondaryMuscles: ["三角肌前束"],
    aliases: ["哑铃飞鸟", "平板飞鸟", "哑铃夹胸", "平板哑铃飞鸟", "胸肌拉伸", "胸肌外沿", "Dumbbell Fly"],
    gifUrl: "./exercises/dumbbell-fly.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "大重量拉伸胸肌外侧边缘。在动作底部胸肌被完全展开，提供极强拉伸位肌纤维撕裂刺激。",
    tags: ["胸肌外沿", "深度展开", "拉伸肥大"],
    tips: {
      prep: "仰卧长凳，双手持哑铃于胸上方，肘关节微屈约120度锁死。",
      execution: "像展开双翼一样向两侧弧线打开哑铃，感受胸肌被强力拉扯。",
      peak: "向内合拢至胸部正上方，夹紧胸大肌。",
      negative: "慢速下放3秒，切勿盲目用超大重量以防拉伤肩袖。"
    },
    commonMistakes: ["手臂完全伸直导致手肘受压", "下放过低伤肩关节"],
    substitutes: [
      { name: "蝴蝶机夹胸", reason: "器械稳定孤立" },
      { name: "龙门架绳索夹胸", reason: "全程恒定阻力" }
    ]
  },
  {
    id: "ex-cable-fly",
    name: "龙门架绳索夹胸",
    englishName: "Cable Crossover / Fly",
    category: "胸部",
    target: "胸肌下沿与中缝 / 轮廓雕刻",
    secondaryMuscles: ["三角肌前束"],
    aliases: ["绳索夹胸", "龙门架夹胸", "十字夹胸", "滑轮夹胸", "胸肌下沿", "站姿夹胸", "Cable Fly", "Cable Crossover"],
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
      { name: "低位绳索夹胸", reason: "针对锁骨上胸" }
    ]
  },
  {
    id: "ex-cable-low-to-high-fly",
    name: "低位绳索上斜夹胸",
    englishName: "Low-to-High Cable Fly",
    category: "胸部",
    target: "胸大肌上束内侧 / 锁骨中缝",
    secondaryMuscles: ["三角肌前束"],
    aliases: ["低位夹胸", "低位绳索夹胸", "上斜绳索夹胸", "低拉夹胸", "锁骨中缝", "Low to High Fly"],
    gifUrl: "./exercises/cable-low-to-high-fly.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "从低滑轮向上向前画弧夹起，完全顺着上胸纤维由下至上的力线，打造上胸中缝与锁骨深槽。",
    tags: ["上胸中缝", "锁骨线", "顶峰收缩"],
    tips: {
      prep: "滑轮调至最低处，双手持握把，站立微前倾，挺胸沉肩。",
      execution: "从身体斜下方往面部前上方画弧聚拢手腕。",
      peak: "在锁骨高度双手并拢挤压上胸2秒。",
      negative: "顺着绳索拉力慢放至髋关节两侧。"
    },
    commonMistakes: ["过度屈肘变成二头肌弯举", "耸肩含胸"],
    substitutes: [
      { name: "上斜哑铃卧推", reason: "大重量上胸肥大" },
      { name: "蝴蝶机夹胸", reason: "中胸孤立" }
    ]
  },
  {
    id: "ex-decline-bench-press",
    name: "下斜哑铃/杠铃卧推",
    englishName: "Decline Bench Press",
    category: "胸部",
    target: "胸大肌下束 (下沿轮廓)",
    secondaryMuscles: ["肱三头肌", "三角肌前束"],
    aliases: ["下斜卧推", "下斜推胸", "下斜杠铃卧推", "下斜哑铃卧推", "胸肌下沿", "下胸", "Decline Bench Press"],
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
      { name: "双杠臂屈伸 (胸部前倾)", reason: "自重打造下胸黄金动作" },
      { name: "龙门架绳索夹胸", reason: "高位向下夹胸针对下沿" }
    ]
  },
  {
    id: "ex-chest-dips",
    name: "双杠臂屈伸 (胸部前倾)",
    englishName: "Chest Dips",
    category: "胸部",
    target: "胸大肌下束与外沿 / 自重黄金",
    secondaryMuscles: ["肱三头肌", "三角肌前束"],
    aliases: ["双杠臂屈伸", "双杠屈臂伸", "胸部双杠", "双杠下压", "双杠", "自重胸肌", "Dips", "Chest Dips"],
    gifUrl: "./exercises/chest-dips.gif",
    defaultSets: 3,
    defaultReps: "8-12",
    scienceDetail: "上肢深蹲之称！身体前倾30度下沉，能给下胸带来极大的自重负荷拉伸，雕刻铠甲下边缘轮廓。",
    tags: ["自重黄金", "下胸厚度", "上肢深蹲"],
    tips: {
      prep: "双手撑于双杠上，躯干主动前倾30度，屈膝交叉双腿。",
      execution: "手肘向后外侧打开下落，直至大臂与地面平行。",
      peak: "胸肌强力发力将身体推起，顶峰夹紧下胸。",
      negative: "匀速控制下沉，避免肩关节过深下坠造成损伤。"
    },
    commonMistakes: ["身体直立变成主要练三头", "下沉太深导致肩袖撕裂伤"],
    substitutes: [
      { name: "下斜哑铃卧推", reason: "负重微调更平稳" },
      { name: "固定器械推胸", reason: "器械稳定安全" }
    ]
  },
  {
    id: "ex-push-up",
    name: "标准俯卧撑",
    englishName: "Standard Push-up",
    category: "胸部",
    target: "胸大肌整体 / 核心支撑",
    secondaryMuscles: ["三角肌前束", "肱三头肌", "腹直肌"],
    aliases: ["俯卧撑", "标准俯卧撑", "伏地挺身", "自重俯卧撑", "推地", "Push-up"],
    gifUrl: "./exercises/push-up.gif",
    defaultSets: 3,
    defaultReps: "15-20",
    scienceDetail: "随时随地的胸部与核心激活王牌。作为热身或训练尾声排空泵感超级组的最佳选择。",
    tags: ["自重基石", "核心联动", "随时随地"],
    tips: {
      prep: "双手撑地略宽于肩，身体从头到脚呈一条笔直钢板，核心腹部夹紧。",
      execution: "手肘向后下方45度折叠下沉，胸口轻触地面。",
      peak: "推起至手臂微屈，顶峰收缩胸大肌。",
      negative: "平稳控制下落。"
    },
    commonMistakes: ["塌腰撅屁股", "手肘向外展开成90度伤肩"],
    substitutes: [
      { name: "平板杠铃卧推", reason: "器械大负荷增肌" },
      { name: "钻石俯卧撑", reason: "偏向三头与中缝" }
    ]
  },
  {
    id: "ex-diamond-pushup",
    name: "钻石俯卧撑 (窄握)",
    englishName: "Diamond Push-up",
    category: "胸部",
    target: "胸大肌中缝内侧 / 肱三头肌",
    secondaryMuscles: ["肱三头肌", "前束"],
    aliases: ["钻石俯卧撑", "窄距俯卧撑", "菱形俯卧撑", "三头俯卧撑", "Diamond Push-up"],
    gifUrl: "./exercises/diamond-pushup.gif",
    defaultSets: 3,
    defaultReps: "10-15",
    scienceDetail: "双手拇指食指相触成钻石形，极大地增加胸肌内收幅度与三头肌推力参与，雕刻胸肌中线。",
    tags: ["中缝雕刻", "三头联动", "高阶自重"],
    tips: {
      prep: "双手拇指与食指在胸部正下方拼成钻石菱形，身体收紧成直线。",
      execution: "手肘贴近身体下落，胸口触碰到双手手背上方。",
      peak: "用力推起并极度夹紧胸大肌内侧。",
      negative: "缓慢下放控制动作节奏。"
    },
    commonMistakes: ["手腕压力过大导致刺痛", "塌腰借力"],
    substitutes: [
      { name: "窄距杠铃卧推", reason: "负荷可调" },
      { name: "蝴蝶机夹胸", reason: "专注胸肌中缝" }
    ]
  },
  {
    id: "ex-dumbbell-pullover",
    name: "仰卧哑铃上拉 (Pullover)",
    englishName: "Dumbbell Pullover",
    category: "胸部",
    target: "胸大肌上部 / 前锯肌 / 扩展胸腔",
    secondaryMuscles: ["背阔肌", "肱三头肌长头"],
    aliases: ["哑铃仰卧上拉", "哑铃上拉", "仰卧上拉", "上拉", "套头衫上拉", "前锯肌鲨鱼线", "扩展胸腔", "Pullover"],
    gifUrl: "./exercises/dumbbell-pullover.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "阿诺德黄金时代的经典动作！横卧长凳拉伸胸大肌上缘与前锯肌（鲨鱼线），视觉上显著扩展胸腔宽度。",
    tags: ["扩展胸腔", "前锯肌鲨鱼线", "拉伸之王"],
    tips: {
      prep: "上背部横躺在长凳上，双手虎口交叉托住哑铃一端，手臂微屈置于胸部上方。",
      execution: "保持手肘微屈锁死，将哑铃沿弧线向头顶后方缓慢下放，直至上胸完全被拉伸开。",
      peak: "胸肌与前锯肌发力将哑铃拉回胸部上方，顶峰挤压胸肌1秒。",
      negative: "下放时深吸气扩张胸腔，感受深层拉伸。"
    },
    commonMistakes: ["手肘大幅度弯曲做成臂屈伸", "臀部随哑铃下落抬起过高导致失去张力"],
    substitutes: [
      { name: "直臂下压", reason: "绳索站姿版本" },
      { name: "上斜哑铃卧推", reason: "上胸厚度" }
    ]
  }
];

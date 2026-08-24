export const SHOULDER_EXERCISES = [
  {
    id: "ex-cable-lateral-raise",
    name: "绳索侧平举",
    englishName: "Cable Lateral Raise",
    category: "肩部",
    target: "三角肌中束 (决定肩宽)",
    secondaryMuscles: ["三角肌前束", "斜方肌"],
    gifUrl: "./exercises/cable-lateral-raise.gif",
    defaultSets: 4,
    defaultReps: "12-15",
    scienceDetail: "肩宽的生死线。绳索能在动作底部就提供恒定张力，身体微倾斜，把三角肌中束彻底拉宽拉爆。",
    tags: ["倒三角关键", "全程恒张力", "加宽肩峰"],
    tips: {
      prep: "单手握住低位滑轮把手，身体微向外倾斜，核心收紧，手腕低于手肘。",
      execution: "以手肘为引导点向斜前方（肩胛骨平面）沿弧线抬起，不要直上直下。",
      peak: "抬至大臂与地面平行即可，避免过高引发斜方肌代偿抢力。",
      negative: "慢速下放控制2秒，保持中束始终绷紧有张力。"
    },
    commonMistakes: ["耸肩用斜方肌甩起重量", "手腕抬得比手肘高导致中束卸力"],
    substitutes: [
      { name: "站姿哑铃侧平举", reason: "随处可练的经典中束动作" },
      { name: "固定器械推肩", reason: "复合推举打造厚度" }
    ]
  },
  {
    id: "ex-dumbbell-lateral-raise",
    name: "站姿哑铃侧平举",
    englishName: "Dumbbell Lateral Raise",
    category: "肩部",
    target: "三角肌中束 / 随时随地打造肩宽",
    secondaryMuscles: ["斜方肌上束"],
    gifUrl: "./exercises/dumbbell-lateral-raise.gif",
    defaultSets: 4,
    defaultReps: "12-15",
    scienceDetail: "无需器械排队，两只哑铃即可快速轰炸中束。注意小重量慢速控制，避免斜方肌过度耸肩借力。",
    tags: ["经典肩宽", "自由重量", "泵感十足"],
    tips: {
      prep: "站姿微屈膝微俯身15°，手持哑铃垂于大腿前侧，手肘微屈锁定角度。",
      execution: "以肘关节引导向两侧画弧线平举，手臂置于肩胛骨平面（略微前于躯干30°）。",
      peak: "平举至大臂水平，顶峰停顿1秒。",
      negative: "抵抗重力慢放2秒，底部不要完全贴腿卸力。"
    },
    commonMistakes: ["用身体上下颠晃甩动哑铃", "手腕翘起高于手肘"],
    substitutes: [
      { name: "绳索侧平举", reason: "底部张力更充足" },
      { name: "固定器械推肩", reason: "冲刺更大负荷" }
    ]
  },
  {
    id: "ex-machine-shoulder-press",
    name: "固定器械推肩",
    englishName: "Machine Shoulder Press",
    category: "肩部",
    target: "三角肌前中束 / 3D虎头肩",
    secondaryMuscles: ["肱三头肌", "上胸部"],
    gifUrl: "./exercises/machine-shoulder-press.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "前束和三头肌充分热身后的冲刺王牌，用器械推举最大化保障肩关节安全，专注大重量突破围度。",
    tags: ["大重量", "安全冲刺", "立体虎头肩"],
    tips: {
      prep: "座椅调至把手略低于耳朵高度，腰背贴紧靠垫，沉肩收腹。",
      execution: "由三角肌前束主动发力向上推起把手，避免肘部过度后张。",
      peak: "推至顶端微屈肘，不要锁死手肘以维持肌肉持续张力。",
      negative: "缓慢下落还原，直到把手下落至耳朵下沿水平。"
    },
    commonMistakes: ["腰部过度向前拱起悬空变成斜板卧推", "下放幅度太浅只有半程"],
    substitutes: [
      { name: "坐姿哑铃推肩", reason: "自由平衡与稳定肌群" },
      { name: "站姿杠铃推举 (OHP)", reason: "全身联动力量之王" }
    ]
  },
  {
    id: "ex-seated-dumbbell-shoulder-press",
    name: "坐姿哑铃推肩",
    englishName: "Seated Dumbbell Shoulder Press",
    category: "肩部",
    target: "三角肌前中束 / 围度与协调",
    secondaryMuscles: ["肱三头肌", "上斜方肌"],
    gifUrl: "./exercises/seated-dumbbell-shoulder-press.gif",
    defaultSets: 4,
    defaultReps: "8-10",
    scienceDetail: "坐姿靠背提供良好支撑，哑铃允许手腕与肘部以最符合个人解剖结构的轨迹向上推举，刺激极深。",
    tags: ["自由重量推肩", "虎头肩厚度", "力量与平衡"],
    tips: {
      prep: "椅背调节至80°-85°近乎垂直，双手各持哑铃置于耳朵两侧，大臂平行地面。",
      execution: "沿自然弧线向上推起哑铃至头顶上方，肘部微内收不外翻。",
      peak: "顶峰停留挤压肩膀肌肉1秒，哑铃不需相撞。",
      negative: "控制下放3秒至耳朵高度再推起。"
    },
    commonMistakes: ["推起时头部过度前伸", "下放太低导致肩关节活动度不足受损"],
    substitutes: [
      { name: "固定器械推肩", reason: "器械稳定冲刺大重量" },
      { name: "站姿杠铃推举 (OHP)", reason: "全身爆发核心联动" }
    ]
  },
  {
    id: "ex-overhead-barbell-press",
    name: "站姿杠铃推举 (OHP)",
    englishName: "Overhead Barbell Press (OHP)",
    category: "肩部",
    target: "肩部整体 / 全身复合推举之王",
    secondaryMuscles: ["肱三头肌", "核心腹肌", "臀大肌"],
    gifUrl: "./exercises/overhead-barbell-press.gif",
    defaultSets: 4,
    defaultReps: "6-8",
    scienceDetail: "四大复合力量动作之一。从站姿脚底传导力量至头顶，构建强韧的核心支撑力与宽厚饱满的虎头肩。",
    tags: ["四大项之一", "站姿核心", "全身爆发推力"],
    tips: {
      prep: "双脚与肩同宽站稳，夹紧臀部收紧核心，杠铃架在锁骨上方，握距略宽于肩。",
      execution: "头部微后仰让出杠铃轨迹，垂直向上推起杠铃，过头顶后头部自然回正。",
      peak: "顶峰锁紧肩膀与上背，杠铃位于脚掌中心正上方。",
      negative: "缓慢匀速下放回锁骨位置。"
    },
    commonMistakes: ["腰部过度后仰借力导致腰椎反弓受压", "肘部向后张开失去前推力线"],
    substitutes: [
      { name: "坐姿哑铃推肩", reason: "有靠背保护腰椎" },
      { name: "固定器械推肩", reason: "器械固定轨道更安全" }
    ]
  },
  {
    id: "ex-face-pull",
    name: "绳索面拉 (Face Pull)",
    englishName: "Cable Face Pull",
    category: "肩部",
    target: "三角肌后束 / 冈下肌 / 3D球形肩",
    secondaryMuscles: ["斜方肌中下部", "菱形肌"],
    gifUrl: "./exercises/face-pull.gif",
    defaultSets: 4,
    defaultReps: "15",
    scienceDetail: "拯救圆肩大杀器！疯狂补强三角肌后束与肩袖外旋。后束饱满，你的肩膀从侧面看才是一个饱满的3D球体，而不是扁平内扣。",
    tags: ["体态矫正", "3D球形肩", "圆肩克星"],
    tips: {
      prep: "滑轮调至与眼睛或稍高位置，双手正握或对握绳索两头，后退一步站稳。",
      execution: "向后拉动绳索，同时向两侧分开并做外旋动作，将绳索中心拉向鼻梁或眉心。",
      peak: "手肘向后向外拉开，双拳位于耳朵两侧，顶峰停留收紧后束2秒。",
      negative: "匀速顺着拉力向前还原，保持肩胛骨与后束可控张力。"
    },
    commonMistakes: ["重量过大导致头部前伸去够绳索", "没有外旋动作单纯向下拽变成划船"],
    substitutes: [
      { name: "反向蝴蝶机飞鸟 (Reverse Fly)", reason: "纯粹孤立后束" },
      { name: "俯身哑铃飞鸟", reason: "自由重量强化后束" }
    ]
  },
  {
    id: "ex-reverse-pec-deck",
    name: "反向蝴蝶机飞鸟 (Reverse Fly)",
    englishName: "Reverse Pec Deck",
    category: "肩部",
    target: "三角肌后束单关节孤立",
    secondaryMuscles: ["菱形肌", "斜方肌中束"],
    gifUrl: "./exercises/reverse-pec-deck.gif",
    defaultSets: 4,
    defaultReps: "12-15",
    scienceDetail: "最纯粹孤立三角肌后束的固定器械。手臂微屈固定，完全剥离前束和胸肌参与，打造侧后方饱满球形细节。",
    tags: ["纯孤立后束", "器械防借力", "球形肩"],
    tips: {
      prep: "面向器械胸口贴紧靠垫，把手调节至与肩同高，手臂微屈保持固定。",
      execution: "以手肘为引导点向两侧向后展开，注意力集中在肩膀后侧收紧。",
      peak: "展开至大臂与背部平齐，顶峰挤压后束2秒。",
      negative: "缓慢回放，保持后束持续受力不碰铁片。"
    },
    commonMistakes: ["过度后缩肩胛骨变成练中背", "手腕主动后拉导致小臂代偿"],
    substitutes: [
      { name: "绳索面拉 (Face Pull)", reason: "外旋功能强化肩袖" },
      { name: "俯身哑铃飞鸟", reason: "自由角度" }
    ]
  },
  {
    id: "ex-bent-over-rear-delt-fly",
    name: "俯身哑铃飞鸟",
    englishName: "Bent-Over Dumbbell Lateral Raise",
    category: "肩部",
    target: "三角肌后束 / 上背部小肌群",
    secondaryMuscles: ["菱形肌", "冈下肌"],
    gifUrl: "./exercises/bent-over-rear-delt-fly.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "自由重量俯身展开，增强后束神经募集与本体感觉，使后肩在自然站立状态下呈现挺拔饱满视觉。",
    tags: ["自由重量", "后束雕刻", "体态挺拔"],
    tips: {
      prep: "屈髋俯身至躯干接近平行地面，微屈膝，双手持轻哑铃自然垂于下方。",
      execution: "手肘微屈固定，向两侧如大鹏展翅般抬起哑铃，大臂与躯干垂直。",
      peak: "抬至大臂与地面平行，顶峰紧缩后束1.5秒。",
      negative: "控制慢放还原至起始位。"
    },
    commonMistakes: ["重量过重导致身体上下晃动甩起哑铃", "手臂过度向后夹变成背阔肌划船"],
    substitutes: [
      { name: "反向蝴蝶机飞鸟", reason: "器械固定支撑更防借力" },
      { name: "绳索面拉", reason: "结合肩袖外旋" }
    ]
  }
];

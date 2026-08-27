export const BACK_EXERCISES = [
  {
    id: "ex-lat-pulldown",
    name: "对握/宽握高位下拉",
    englishName: "Lat Pulldown",
    category: "背部",
    target: "背阔肌上部 / 大圆肌",
    secondaryMuscles: ["肱二头肌", "菱形肌", "后束"],
    gifUrl: "./exercises/lat-pulldown.gif",
    defaultSets: 4,
    defaultReps: "10-12",
    scienceDetail: "翅膀起飞动作。主要刺激大圆肌和背阔肌上部，这是决定你从正面看有没有“V字腰身反差”的关键动作。",
    tags: ["正面显宽", "V字腰身", "拉宽背部"],
    tips: {
      prep: "大腿卡紧固定海绵垫，挺胸微后仰10°-15°，双手握距略宽于肩。",
      execution: "先沉肩胛骨，再用手肘引导向下向后拉动横杆，直至接近上胸部锁骨。",
      peak: "手肘向身体两侧肋骨夹紧，顶峰挤压背阔肌1-2秒。",
      negative: "控制速度慢慢放回，直到背阔肌完全向上拉伸开再做下一次。"
    },
    commonMistakes: ["大幅度前后摇晃身体借力", "下拉时手腕过度屈曲变成小臂和二头死拽"],
    substitutes: [
      { name: "正手引体向上", reason: "自重背部黄金王牌动作" },
      { name: "辅助引体", reason: "力量不足时的最佳过渡" },
      { name: "坐姿绳索划船", reason: "增厚背阔肌中下部" }
    ]
  },
  {
    id: "ex-pull-ups",
    name: "正手引体向上",
    englishName: "Pull-ups",
    category: "背部",
    target: "背阔肌全面 / 上肢自重之王",
    secondaryMuscles: ["肱二头肌", "前臂握力", "菱形肌"],
    gifUrl: "./exercises/pull-ups.gif",
    defaultSets: 4,
    defaultReps: "6-10",
    scienceDetail: "衡量上肢相对力量的终极标尺。对背阔肌的整体神经激活度远超大部分器械，打造真正的宽阔倒三角背部。",
    tags: ["自重之王", "倒三角背", "核心联动"],
    tips: {
      prep: "正握单杠，握距宽于肩，双腿微屈交叉，核心收紧悬垂。",
      execution: "胸部上挺引体向上，将锁骨拉向单杠，手肘向下方两侧驱动。",
      peak: "下巴过杠或胸触杠时顶峰收缩背肌1秒。",
      negative: "缓慢下放至手臂几乎完全伸直，充分拉开背阔肌。"
    },
    commonMistakes: ["借双腿蹬踢荡秋千晃动借力", "下放幅度太小做半程引体"],
    substitutes: [
      { name: "辅助引体", reason: "插销减重辅助，标准动作模式" },
      { name: "对握/宽握高位下拉", reason: "负荷可精准微调的器械版本" }
    ]
  },
  {
    id: "ex-assisted-pullup",
    name: "辅助引体",
    aliases: ["辅助引体向上", "器械辅助引体", "助力引体向上"],
    englishName: "Assisted Pull-up",
    category: "背部",
    target: "背阔肌全面 / 建立引体神经募集",
    secondaryMuscles: ["肱二头肌", "菱形肌", "大圆肌"],
    gifUrl: "./exercises/pull-ups.gif",
    defaultSets: 4,
    defaultReps: "8-12",
    scienceDetail: "无法完成标准自重引体时的神级器械！通过配重垫辅助减重，让你在安全负荷下建立标准的高位下拉力线与背肌发力感知。",
    tags: ["引体进阶", "减重辅助", "倒三角塑造"],
    tips: {
      prep: "调节插销重量（配重越重越轻松），双膝跪在辅助垫上，正握或对握单杠握把，挺胸沉肩。",
      execution: "后背背阔肌发力将身体拉起，挺胸让锁骨靠近横杆。",
      peak: "顶峰停留挤压背阔肌1-2秒。",
      negative: "慢速匀速下落，让背阔肌在离心过程中得到充分拉伸。"
    },
    commonMistakes: ["借辅助垫弹力上下猛烈弹跳", "耸肩含胸只用二头肌硬拉"],
    substitutes: [
      { name: "正手引体向上", reason: "自重力量终极进阶" },
      { name: "对握/宽握高位下拉", reason: "滑轮器械精准加重" }
    ]
  },
  {
    id: "ex-chest-supported-row",
    name: "胸垫胸前划船 (T-Bar)",
    englishName: "Chest-Supported Row",
    category: "背部",
    target: "上背部 (斜方肌中下束/菱形肌)",
    secondaryMuscles: ["背阔肌", "三角肌后束", "肱二头肌"],
    gifUrl: "./exercises/chest-supported-row.gif",
    defaultSets: 3,
    defaultReps: "8-10",
    scienceDetail: "有胸垫支撑可以完全解放下背部（腰椎），让你能用极大的重量去撕裂上背部，增加背部3D立体细节与厚度。",
    tags: ["增厚上背", "保护下背", "3D立体背"],
    tips: {
      prep: "胸口稳稳贴在斜垫上，双脚踩实地面，手臂自然下垂握住把手。",
      execution: "向后驱动手肘，向内夹紧两片肩胛骨，感受上背部肌肉堆叠在一起。",
      peak: "在行程终点保持1秒挤压，体会背肌收紧的酸胀感。",
      negative: "慢速下放并允许肩胛骨自然前引，充分拉开背部肌群。"
    },
    commonMistakes: ["胸口离开胸垫用腰部反弓借力", "只用手臂向后拉，肩胛骨完全不动"],
    substitutes: [
      { name: "坐姿绳索划船", reason: "轨迹平顺，泵感十足" },
      { name: "单臂哑铃划船", reason: "单侧长行程拉伸" }
    ]
  },
  {
    id: "ex-seated-cable-row",
    name: "坐姿绳索划船",
    englishName: "Seated Cable Row",
    category: "背部",
    target: "背阔肌中下部 / 厚度与质感",
    secondaryMuscles: ["肱二头肌", "斜方肌中束", "菱形肌"],
    gifUrl: "./exercises/seated-cable-row.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "打造背部厚度的经典动作。手肘贴近躯干向后拉，能精准刺激背阔肌下延附着点，让背部从下往上都充满饱满肌肉量。",
    tags: ["背部厚度", "背阔肌下束", "全程恒张力"],
    tips: {
      prep: "双脚踩稳脚踏，膝盖微屈，挺胸沉肩，躯干保持直立微前倾。",
      execution: "手肘贴近身体向后划动，将把手拉至肚脐上方。",
      peak: "肩胛骨用力后缩夹紧，顶峰收缩2秒。",
      negative: "吸气顺着绳索拉力向前退让，感受背肌被完全拉长。"
    },
    commonMistakes: ["大幅度前后剧烈摇摆躯干借腰力", "拉动手肘时耸肩"],
    substitutes: [
      { name: "胸垫胸前划船", reason: "更孤立上背部" },
      { name: "俯身杠铃划船", reason: "老派力量增厚" }
    ]
  },
  {
    id: "ex-barbell-bent-over-row",
    name: "俯身杠铃划船",
    englishName: "Barbell Bent-Over Row",
    category: "背部",
    target: "上背与背阔肌整体 / 力量与厚度",
    secondaryMuscles: ["竖脊肌", "核心肌群", "肱二头肌"],
    gifUrl: "./exercises/barbell-bent-over-row.gif",
    defaultSets: 4,
    defaultReps: "8-10",
    scienceDetail: "老派健美运动员的最爱。全身核心抗阻与背肌大重量发力，快速建立坦克般的上背部与背阔肌厚实度。",
    tags: ["大重量力量", "背肌坦克", "核心联动"],
    tips: {
      prep: "屈髋俯身45°-60°，膝盖微屈，下背部挺直锁死，双手略宽于肩正握杠铃。",
      execution: "驱动手肘贴近躯干向上向后拉动杠铃至肚脐下方。",
      peak: "顶峰夹紧肩胛骨停留1秒。",
      negative: "缓慢下放杠铃至膝盖下方，背部保持中立不弓腰。"
    },
    commonMistakes: ["弓腰驼背造成腰椎剧烈负荷", "身体随动作上下猛烈弹动"],
    substitutes: [
      { name: "俯身双臂哑铃划船", reason: "自由手腕角度" },
      { name: "胸垫胸前划船", reason: "下背无压力更安全" }
    ]
  },
  {
    id: "ex-dumbbell-bent-over-row",
    name: "俯身双臂哑铃划船",
    englishName: "Bent-Over Dumbbell Row",
    category: "背部",
    target: "背阔肌与上背部 / 自由轨迹",
    secondaryMuscles: ["肱二头肌", "斜方肌中束"],
    gifUrl: "./exercises/dumbbell-bent-over-row.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "哑铃提供更自由的手腕旋转角度（对握或旋后），在顶峰收缩时手肘可以拉得更靠后，极致挤压背阔肌。",
    tags: ["自由角度", "背阔肌挤压", "左右对称"],
    tips: {
      prep: "屈髋俯身45度，背部平直中立，双手各持哑铃自然垂于膝盖前。",
      execution: "手肘贴近身体向斜后方拉起哑铃，大臂夹紧躯干。",
      peak: "顶峰夹紧背部肌群1.5秒。",
      negative: "匀速慢放至底部充分拉伸。"
    },
    commonMistakes: ["弓腰驼背", "用手腕耸肩甩动哑铃"],
    substitutes: [
      { name: "俯身杠铃划船", reason: "大重量突破" },
      { name: "坐姿绳索划船", reason: "全程恒定张力" }
    ]
  },
  {
    id: "ex-one-arm-dumbbell-row",
    name: "单臂哑铃划船",
    englishName: "One-Arm Dumbbell Row",
    category: "背部",
    target: "背阔肌单侧深度拉伸与厚度",
    secondaryMuscles: ["三角肌后束", "肱二头肌", "斜方肌"],
    gifUrl: "./exercises/one-arm-dumbbell-row.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "单侧训练能提供极佳的核心抗扭转刺激与超长拉伸行程，能把单侧背阔肌充分拉长并完全收缩到底。",
    tags: ["单侧孤立", "超长行程", "背阔肌拉伸"],
    tips: {
      prep: "单膝单手支撑于卧推凳上，躯干与地面平行，另一手握哑铃自然下垂。",
      execution: "手肘沿斜后方画弧线向上拉起，避免仅靠小臂屈曲拉动。",
      peak: "手肘拉过躯干平面，顶峰收缩单侧背肌1.5秒。",
      negative: "匀速下放哑铃至最低点，让背阔肌完全向下延展。"
    },
    commonMistakes: ["躯干大幅度旋转借力甩动哑铃", "手肘向外撇失去背阔肌受力"],
    substitutes: [
      { name: "坐姿绳索划船", reason: "双侧同步恒定张力" },
      { name: "对握/宽握高位下拉", reason: "拓宽正面背部" }
    ]
  },
  {
    id: "ex-straight-arm-pulldown",
    name: "直臂下压 (Pulldown / Pullover)",
    englishName: "Straight-Arm Cable Pulldown",
    category: "背部",
    target: "背阔肌单关节孤立 / 顶峰拉伸",
    secondaryMuscles: ["大圆肌", "肱三头肌长头"],
    gifUrl: "./exercises/straight-arm-pulldown.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "孤立背阔肌的单关节王牌。在手臂二头完全不参与发力代偿的情况下，让背阔肌在顶峰拉伸位承受最大张力。",
    tags: ["单关节孤立", "顶峰拉伸", "找背肌感觉"],
    tips: {
      prep: "站姿微屈膝俯身约30°，双手与肩同宽握住直杠或绳索，手臂微屈保持固定角度。",
      execution: "用背阔肌发力将横杠向下沿弧线压向大腿前侧，手臂角度始终锁死不弯曲。",
      peak: "压至大腿前侧时挺胸收腹，感受背阔肌底部的极致收缩。",
      negative: "缓慢回放至过头高位，感受背阔肌被完全拉长。"
    },
    commonMistakes: ["手肘大幅度屈伸变成三头肌下压", "下压时耸肩含胸"],
    substitutes: [
      { name: "对握/宽握高位下拉", reason: "复合高位拉力" },
      { name: "坐姿绳索划船", reason: "厚度构建" }
    ]
  },
  {
    id: "ex-barbell-deadlift",
    name: "传统杠铃硬拉",
    englishName: "Barbell Deadlift",
    category: "背部",
    target: "全身后链总爆发 / 背部与臀腿",
    secondaryMuscles: ["竖脊肌", "臀大肌", "腘绳肌", "斜方肌", "前臂"],
    gifUrl: "./exercises/barbell-deadlift.gif",
    defaultSets: 3,
    defaultReps: "5",
    scienceDetail: "力量之王！全身所有肌肉群协同输出最大负荷，瞬间刺激睾酮与生长激素分泌，打造坚不可摧的强悍后链。",
    tags: ["力量之王", "三大项核心", "全身后链"],
    tips: {
      prep: "双脚与髋同宽，杠铃杆紧贴小腿中段，屈髋屈膝下蹲抓握，挺胸收紧背阔肌沉肩锁背。",
      execution: "脚蹬地发力推起，伸膝伸髋同时进行，杠铃全程贴着小腿和大腿滑上。",
      peak: "站直顶峰收紧臀部与背部，切勿过度向后反弓后背！",
      negative: "屈髋将杠铃下放回地面，保持背部平直中立。"
    },
    commonMistakes: ["弓腰起步导致腰椎受伤", "杠铃远离身体产生过长力臂伤腰"],
    substitutes: [
      { name: "罗马尼亚硬拉 (RDL)", reason: "更偏向腘绳肌与臀部拉伸" },
      { name: "俯身杠铃划船", reason: "专注上背厚度" }
    ]
  },
  {
    id: "ex-barbell-shrug",
    name: "杠铃耸肩",
    englishName: "Barbell Shrug",
    category: "背部",
    target: "斜方肌上束 / 颈后山峰",
    secondaryMuscles: ["前臂握力", "肩胛提肌"],
    gifUrl: "./exercises/barbell-shrug.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "构建霸气斜方肌上束。双手持大重量垂直向上耸肩，让斜方肌如山峰般隆起，打造强悍上体骨架。",
    tags: ["斜方肌上束", "力量巨兽", "厚重颈肩"],
    tips: {
      prep: "站姿双脚与肩同宽，双手正握杠铃置于大腿前侧，挺胸收腹。",
      execution: "双肩垂直向上提起靠近耳朵，肘部保持伸直不弯曲。",
      peak: "最高点停顿挤压斜方肌2秒。",
      negative: "控制下放至双肩自然下沉充分拉伸。"
    },
    commonMistakes: ["旋转肩膀耸肩导致肩关节磨损", "头部过度前伸"],
    substitutes: [
      { name: "胸垫胸前划船", reason: "斜方肌中下束增厚" },
      { name: "杠铃直立划船", reason: "肩部与斜方肌联动" }
    ]
  },
  {
    id: "ex-barbell-upright-row",
    name: "杠铃直立划船",
    englishName: "Barbell Upright Row",
    category: "背部",
    target: "三角肌中束 / 斜方肌上中束",
    secondaryMuscles: ["肱二头肌", "前臂"],
    gifUrl: "./exercises/barbell-upright-row.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "手肘引领向上提升，同时高效轰炸三角肌中束与斜方肌，加宽上身比例。",
    tags: ["加宽上身", "中束与斜方", "复合拉力"],
    tips: {
      prep: "双手握距略宽于肩，正握杠铃垂于大腿前，挺胸沉肩。",
      execution: "手肘向斜上方提起，将杠铃贴着躯干提升至胸口下方。",
      peak: "手肘略高于手腕，顶峰停留1秒。",
      negative: "缓慢下放杠铃回大腿前侧。"
    },
    commonMistakes: ["握距过窄造成腕关节和肩峰撞击", "利用身体前后摇晃借力"],
    substitutes: [
      { name: "绳索侧平举", reason: "纯孤立三角肌中束" },
      { name: "杠铃耸肩", reason: "专注斜方肌" }
    ]
  }
];

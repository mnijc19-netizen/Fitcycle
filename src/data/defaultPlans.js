// 丰富动作库，包含动图URL、科学细节、发力要点、平替动作等
export const DEFAULT_EXERCISES = [
  // ===================== 【胸部 CHEST】 =====================
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
      { name: "上斜史密斯卧推", reason: "轨迹固定，可更安心冲击大重量" },
      { name: "上斜杠铃卧推", reason: "经典自由重量，强化整体上胸推力" },
      { name: "低位绳索上斜夹胸", reason: "顶峰收缩感更强，恒定张力" }
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
    commonMistakes: [
      "耸肩推胸导致斜方肌代偿酸痛",
      "推起时后背离开靠背含胸"
    ],
    substitutes: [
      { name: "平板杠铃卧推", reason: "传统黄金三大项动作" },
      { name: "平板哑铃卧推", reason: "自由轨迹与更大拉伸幅度" },
      { name: "双杠臂屈伸 (前倾)", reason: "下胸外沿与核心联动" }
    ]
  },
  {
    id: "ex-cable-fly",
    name: "龙门架绳索夹胸",
    englishName: "Cable Crossover / Fly",
    category: "胸部",
    target: "胸肌内侧中缝 / 轮廓雕刻",
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
    commonMistakes: [
      "手臂完全伸直导致手肘承受过大剪切力",
      "身体剧烈前后晃动借力"
    ],
    substitutes: [
      { name: "蝴蝶机夹胸 (Pec Deck)", reason: "轨迹更孤立，新手更易找胸肌感觉" },
      { name: "哑铃仰卧飞鸟", reason: "底部拉伸感强烈" }
    ]
  },

  // ===================== 【背部 BACK】 =====================
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
    commonMistakes: [
      "大幅度前后摇晃身体借力",
      "下拉时手腕过度屈曲变成小臂和二头死拽"
    ],
    substitutes: [
      { name: "正手引体向上", reason: "自重背部黄金王牌动作" },
      { name: "器械单臂高位下拉", reason: "单侧孤立，纠正肌力不平衡" }
    ]
  },
  {
    id: "ex-chest-supported-row",
    name: "胸垫胸前划船",
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
    commonMistakes: [
      "胸口离开胸垫用腰部反弓借力",
      "只用手臂向后拉，肩胛骨完全不动"
    ],
    substitutes: [
      { name: "T杠俯身划船", reason: "经典老派增厚动作" },
      { name: "坐姿器械划船", reason: "轨迹稳定，泵感十足" },
      { name: "单臂哑铃划船", reason: "单侧长行程拉伸" }
    ]
  },
  {
    id: "ex-straight-arm-pulldown",
    name: "直臂下压",
    englishName: "Straight-Arm Cable Pulldown",
    category: "背部",
    target: "背阔肌单关节孤立",
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
    commonMistakes: [
      "手肘大幅度屈伸变成三头肌下压",
      "下压时耸肩含胸"
    ],
    substitutes: [
      { name: "仰卧哑铃仰臂上拉 (Pullover)", reason: "经典的胸背扩胸拉伸动作" },
      { name: "绳索跪姿直臂下压", reason: "更稳定的核心抗晃动" }
    ]
  },

  // ===================== 【肩部 SHOULDERS】 =====================
  {
    id: "ex-cable-lateral-raise",
    name: "绳索/哑铃侧平举",
    englishName: "Cable / DB Lateral Raise",
    category: "肩部",
    target: "三角肌中束 (决定肩宽)",
    secondaryMuscles: ["三角肌前束", "斜方肌"],
    gifUrl: "./exercises/cable-lateral-raise.gif",
    defaultSets: 4,
    defaultReps: "12-15",
    scienceDetail: "肩宽的生死线。更推崇绳索，因为绳索能在动作底部就提供恒定张力。身体微倾斜，把三角肌中束彻底拉宽拉爆。",
    tags: ["倒三角关键", "全程恒张力", "加宽肩峰"],
    tips: {
      prep: "单手握住低位滑轮把手，身体微向外倾斜，核心收紧，手腕低于手肘。",
      execution: "以手肘为引导点向斜前方（肩胛骨平面）沿弧线抬起，不要直上直下。",
      peak: "抬至大臂与地面平行即可，避免过高引发斜方肌代偿抢力。",
      negative: "慢速下放控制2秒，保持中束始终绷紧有张力。"
    },
    commonMistakes: [
      "耸肩用斜方肌甩起重量",
      "手腕抬得比手肘高导致中束卸力"
    ],
    substitutes: [
      { name: "站姿哑铃侧平举", reason: "器械简单，随处可练" },
      { name: "坐姿器械侧平举机", reason: "完全孤立中束，避免身体晃动" }
    ]
  },
  {
    id: "ex-machine-shoulder-press",
    name: "固定器械推肩",
    englishName: "Machine Shoulder Press",
    category: "肩部",
    target: "三角肌前中束",
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
    commonMistakes: [
      "腰部过度向前拱起悬空变成斜板卧推",
      "下放幅度太浅只有半程"
    ],
    substitutes: [
      { name: "坐姿哑铃推肩", reason: "强化两手平衡与稳定肌群" },
      { name: "站姿杠铃推举 (OHP)", reason: "全身力量与核心综合之王" }
    ]
  },
  {
    id: "ex-face-pull",
    name: "绳索面拉 (Face Pull)",
    englishName: "Cable Face Pull",
    category: "肩部",
    target: "三角肌后束 / 冈下肌 / 上背",
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
    commonMistakes: [
      "重量过大导致头部前伸去够绳索",
      "没有外旋动作单纯向下拽变成划船"
    ],
    substitutes: [
      { name: "反向蝴蝶机飞鸟 (Reverse Fly)", reason: "纯粹孤立后束，不易借力" },
      { name: "俯身哑铃飞鸟", reason: "自由重量强化后束与菱形肌" }
    ]
  },

  // ===================== 【手臂 ARMS】 =====================
  {
    id: "ex-machine-triceps-pressdown",
    name: "器械三头下压",
    englishName: "Machine Triceps Dip / Pushdown",
    category: "手臂",
    target: "肱三头肌外侧头与长头",
    secondaryMuscles: ["三角肌前束", "胸大肌下部"],
    gifUrl: "./exercises/machine-triceps-pressdown.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "器械固定轨道下压，能让手肘保持严格固定，全力孤立泵发肱三头肌，打造手臂侧面马蹄铁形状！",
    tags: ["三头马蹄铁", "器械孤立", "深度泵感"],
    tips: {
      prep: "坐在器械上挺胸背贴靠垫，双手握稳把手，大臂紧贴身体两侧肋骨。",
      execution: "手肘保持不动作为轴心，仅通过三头肌收缩用力将把手向下压到底。",
      peak: "在底部手臂几乎完全伸直时用力顶峰收缩三头肌1-2秒。",
      negative: "吸气慢放，让前臂向上折叠到90度直角充分拉伸三头肌。"
    },
    commonMistakes: [
      "身体剧烈前倾压上去借体重下压",
      "手肘前后乱晃离开固定轴心"
    ],
    substitutes: [
      { name: "过头绳索臂屈伸", reason: "更注重长头的深度拉伸" },
      { name: "绳索直杠下压", reason: "经典龙门架三头动作" },
      { name: "仰卧臂屈伸 (Skull Crusher)", reason: "大重量增粗手臂" }
    ]
  },
  {
    id: "ex-overhead-cable-ext",
    name: "过头绳索臂屈伸",
    englishName: "Overhead Cable Triceps Extension",
    category: "手臂",
    target: "肱三头肌长头 (手臂厚度之源)",
    secondaryMuscles: ["核心稳定"],
    gifUrl: "./exercises/overhead-cable-ext.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "练三头肌绝对不能只做下压！必须有“过头”动作把三头肌长头完全拉伸开（面向龙门架），这样手臂才会从侧面看极具厚度与体量感。",
    tags: ["长头拉伸", "手臂厚度", "拉伸区肥大"],
    tips: {
      prep: "背对龙门架前弓步站立，双手握绳索置于脑后，大臂抬起斜向前上方贴近耳朵。",
      execution: "保持大臂角度稳定，仅前臂向前上方展开伸直，将绳索推开。",
      peak: "在手臂伸直点向两侧轻微分开绳索，死死锁紧长头1秒。",
      negative: "慢速让小臂向后脑勺折叠，感受长头在最深处的极限拉扯与撕裂感。"
    },
    commonMistakes: [
      "大臂上下大幅度摆动导致肩部代偿",
      "腰部过度反弓导致腰椎受压"
    ],
    substitutes: [
      { name: "仰卧杠铃臂屈伸 (碎头者)", reason: "经典自由力量长头动作" },
      { name: "坐姿哑铃过头臂屈伸", reason: "单只重哑铃双手托举过头" }
    ]
  },
  {
    id: "ex-incline-db-curl",
    name: "上斜哑铃弯举",
    englishName: "Incline Dumbbell Curl",
    category: "手臂",
    target: "肱二头肌长头 (肌峰拉伸)",
    secondaryMuscles: ["前臂肌群"],
    gifUrl: "./exercises/incline-db-curl.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "坐在上斜凳上（身体后仰45°-60°），让肱二头肌处于极度拉伸状态再弯举，这是公认激活二头肌长头最强、增肌效率极高的王牌。",
    tags: ["二头长头", "拉伸位肥大", "高耸肌峰"],
    tips: {
      prep: "斜凳调至45°-60°，背部靠实，双臂自然垂直下垂，掌心向前或相对。",
      execution: "大臂垂直于地面保持不动，收缩二头肌向上弯举哑铃，并在上升过程中逐渐外旋手腕。",
      peak: "弯举到顶峰时小拇指向上翻转外旋，极致挤压二头肌峰2秒。",
      negative: "匀速慢放3秒直到手臂完全垂直垂直拉伸开。"
    },
    commonMistakes: [
      "用肩膀前抬带动大臂向前借力",
      "身体借反弹力甩动哑铃"
    ],
    substitutes: [
      { name: "牧师凳斜托弯举 (Preacher Curl)", reason: "绝对防借力，主打短头" },
      { name: "站姿EZ杠铃弯举", reason: "可上大重量突破力量瓶颈" }
    ]
  },
  {
    id: "ex-hammer-curl",
    name: "哑铃锤式弯举",
    englishName: "Dumbbell Hammer Curl",
    category: "手臂",
    target: "肱肌 / 肱桡肌 (前臂与二头之间)",
    secondaryMuscles: ["肱二头肌外侧"],
    gifUrl: "./exercises/hammer-curl.gif",
    defaultSets: 3,
    defaultReps: "12",
    scienceDetail: "锤式主要练肱肌（二头肌和三头肌之间那块深层肉），把它练大，会直接把二头肌“顶”起来，让手臂更粗更具力量感。",
    tags: ["手臂围度", "麒麟臂关键", "前臂粗壮"],
    tips: {
      prep: "站姿挺胸沉肩，双手各持哑铃垂于体侧，掌心相对（如握锤状）。",
      execution: "手腕保持中立不翻转，直接向上弯举哑铃至胸前高度。",
      peak: "在顶峰紧缩手臂外侧肌肉1秒。",
      negative: "缓慢下放控制动作节奏，感受小臂与肱肌的拉伸阻力。"
    },
    commonMistakes: [
      "身体后仰大幅甩动借力",
      "手腕松懈晃动未保持锁定"
    ],
    substitutes: [
      { name: "绳索锤式弯举", reason: "全程恒张力，泵感更均匀" },
      { name: "斜板十字锤式弯举", reason: "孤立单臂，轨迹更贴合肌肉" }
    ]
  },

  // ===================== 【腿部与臀部 LEGS】 =====================
  {
    id: "ex-hack-squat",
    name: "哈克深蹲 / 高位腿举",
    englishName: "Hack Squat / Leg Press",
    category: "腿部",
    target: "股四头肌 (大腿前侧)",
    secondaryMuscles: ["臀大肌", "内收肌群"],
    gifUrl: "./exercises/hack-squat.gif",
    defaultSets: 4,
    defaultReps: "8-12",
    scienceDetail: "放弃自由杠铃深蹲！哈克深蹲有完美的靠背支撑，能把100%的压力精准倾斜在大腿前侧（股四头肌），高效且安全不伤腰。",
    tags: ["纯粹前侧", "安全高效", "股四头撕裂"],
    tips: {
      prep: "背部和腰部紧密贴在靠板上，双脚置于踏板中下方，宽度与肩同宽。",
      execution: "打开安全锁，屈膝下蹲，膝盖顺着脚尖方向前推，下蹲至大腿与踏板平行甚至更深。",
      peak: "由股四头肌发力蹬起踏板，在接近顶端时膝盖保持微屈，切勿锁死反关节！",
      negative: "下放过程控制3秒，充分拉伸股四头肌纤维。"
    },
    commonMistakes: [
      "蹬直时膝盖骨猛然死锁震荡关节",
      "下蹲时臀部或腰部离开靠板造成腰部压力"
    ],
    substitutes: [
      { name: "45度倒蹬机腿举 (Leg Press)", reason: "同样有靠背支撑，脚位自由" },
      { name: "器械腿屈伸 (Leg Extension)", reason: "单关节极限充血" },
      { name: "史密斯深蹲", reason: "固定垂直/微斜轨迹" }
    ]
  },
  {
    id: "ex-rdl",
    name: "罗马尼亚硬拉 (RDL)",
    englishName: "Romanian Deadlift (RDL)",
    category: "腿部",
    target: "腘绳肌 (大腿后侧) / 臀大肌",
    secondaryMuscles: ["竖脊肌", "核心肌群", "上背"],
    gifUrl: "./exercises/rdl.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "身材体态的真神！练腿后侧和臀部。它能矫正骨盆前倾，强化核心与后链，让你站姿更挺拔，同时也是背部围度的隐形推手。",
    tags: ["骨盆体态", "后链黄金", "翘臀与后侧"],
    tips: {
      prep: "双脚与髋同宽站立，双手握住杠铃或哑铃置于大腿前侧，挺胸收紧核心。",
      execution: "膝盖微屈锁死角度，以髋关节为折叠轴心，臀部主动向正后方推（想象用屁股关门）。",
      peak: "下放至杠铃低于膝盖、大腿后侧有强烈紧绷拉伸感时，收紧臀部向前推髋站直。",
      negative: "下放时杠铃全程紧贴大腿小腿滑下，脊柱始终保持中立直线不弓腰。"
    },
    commonMistakes: [
      "腰椎弯曲弓背导致椎间盘受压",
      "把硬拉做成了深蹲（膝盖过度前屈）"
    ],
    substitutes: [
      { name: "哑铃罗马尼亚硬拉", reason: "哑铃抓握更灵活，新手更容易上手" },
      { name: "俯卧/坐姿腿弯举", reason: "纯器械孤立大腿后侧" }
    ]
  },
  {
    id: "ex-seated-leg-curl",
    name: "坐姿腿弯举",
    englishName: "Seated Leg Curl",
    category: "腿部",
    target: "腘绳肌 (大腿后侧孤立)",
    secondaryMuscles: ["小腿后群"],
    gifUrl: "./exercises/seated-leg-curl.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "孤立大腿后侧。坐姿屈髋状态下比趴姿更能深度拉伸腘绳肌近端，运动生理学证明其增肌肥大效率显著更高。",
    tags: ["孤立拉伸", "高效增肌", "腘绳肌神器"],
    tips: {
      prep: "坐入器械背靠紧，大腿上方固定挡板压实大腿根部，脚后跟搭在滚轴上方。",
      execution: "用大腿后侧腘绳肌发力，将滚轴向座椅下方快速勾回到底。",
      peak: "勾至最底端时顶峰挤压后侧肌群1.5秒。",
      negative: "抵抗阻力慢速控制还原，直至双腿几乎伸直拉伸。"
    },
    commonMistakes: [
      "大腿挡板未压紧导致大腿随动作乱晃",
      "回放时完全放松失去离心张力"
    ],
    substitutes: [
      { name: "俯卧腿弯举 (Lying Leg Curl)", reason: "经典趴姿弯举" },
      { name: "瑞士球双腿后勾", reason: "居家自重核心训练" }
    ]
  },
  {
    id: "ex-calf-raise",
    name: "站姿/坐姿提踵",
    englishName: "Standing / Seated Calf Raise",
    category: "腿部",
    target: "小腿腓肠肌 / 比目鱼肌",
    secondaryMuscles: ["足底筋膜", "踝关节稳定性"],
    gifUrl: "./exercises/calf-raise.gif",
    defaultSets: 3,
    defaultReps: "15-20",
    scienceDetail: "修饰小腿线条，避免出现明显的“头重脚轻”，同时显著增强跟腱弹力与踝关节稳定性。",
    tags: ["线条修饰", "踝关节稳定", "钻石小腿"],
    tips: {
      prep: "前脚掌踩在踏板边缘，后脚跟完全悬空，身体保持直立稳定。",
      execution: "前脚掌发力尽量将脚后跟向上提至最高点。",
      peak: "最高点停留挤压小腿肌肉2秒。",
      negative: "慢速下落至脚后跟低于踏板平面，感受小腿后侧充分被拉长。"
    },
    commonMistakes: [
      "快速小幅度点地弹跳，未做全程拉伸收缩",
      "膝盖弯曲借力"
    ],
    substitutes: [
      { name: "倒蹬机脚尖推蹬", reason: "大重量腿举机上安全提踵" },
      { name: "单腿持哑铃提踵", reason: "单侧发力纠正左右粗细不一" }
    ]
  },

  // ===================== 【核心 CORE】 =====================
  {
    id: "ex-hanging-leg-raise",
    name: "悬垂举腿",
    englishName: "Hanging Leg Raise",
    category: "核心",
    target: "腹直肌下部 / 核心深层",
    secondaryMuscles: ["髂腰肌", "前臂握力"],
    gifUrl: "./exercises/hanging-leg-raise.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "下腹部雕刻王牌！由骨盆后倾带动下腹卷动，打造清晰人鱼线与下腹肌块。",
    tags: ["下腹雕刻", "人鱼线", "核心力量"],
    tips: {
      prep: "双手抓握单杠自然悬垂，沉肩保持背阔肌微收紧，身体不要晃动。",
      execution: "卷动骨盆将双腿向上抬起，想象将膝盖带向胸口。",
      peak: "顶峰卷腹紧缩腹肌1秒，控制身体不前后摆动。",
      negative: "缓慢下落双腿回到垂直位置。"
    },
    commonMistakes: [
      "靠身体剧烈前后荡秋千借力",
      "仅弯曲大腿而骨盆没有向上卷起"
    ],
    substitutes: [
      { name: "双杠屈膝举腿", reason: "有靠背更稳定，适合握力不足者" },
      { name: "仰卧举腿 (Lying Leg Raise)", reason: "地面垫上即可随时练" }
    ]
  },
  {
    id: "ex-cable-crunch",
    name: "绳索跪姿卷腹",
    englishName: "Cable Kneeling Crunch",
    category: "核心",
    target: "腹直肌整体 (增厚腹肌块)",
    secondaryMuscles: ["腹内外斜肌"],
    gifUrl: "./exercises/cable-crunch.gif",
    defaultSets: 3,
    defaultReps: "15-20",
    scienceDetail: "给腹肌加负重抗阻训练的最佳动作！腹肌和胸背一样需要负重刺激才能厚实凸显，跪姿卷腹提供全程均匀抗阻。",
    tags: ["负重抗阻", "立体腹肌", "六块腹肌"],
    tips: {
      prep: "跪在龙门架前，双手持绳索两端置于耳朵两侧或头顶，髋关节保持固定。",
      execution: "用腹肌发力弯曲脊柱，将手肘卷向膝盖方向，背部呈弓形。",
      peak: "在底部用力吐气缩紧腹肌2秒。",
      negative: "吸气缓慢退让向上伸展脊柱，但不要让负重片碰底。"
    },
    commonMistakes: [
      "臀部大幅前后坐下，变成屈髋而不是卷腹",
      "手臂主动下拉绳索抢走腹部负荷"
    ],
    substitutes: [
      { name: "器械负重卷腹机", reason: "固定器械更易锁定下半身" },
      { name: "健腹轮 (Ab Wheel)", reason: "强力核心抗伸展" }
    ]
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
      { exerciseId: "ex-machine-chest-press", name: "固定器械推胸", setsCount: 3, targetReps: "10-12次", defaultWeight: 45 },
      { exerciseId: "ex-cable-lateral-raise", name: "绳索/哑铃侧平举", setsCount: 4, targetReps: "12-15次", defaultWeight: 7.5 },
      { exerciseId: "ex-machine-shoulder-press", name: "固定器械推肩", setsCount: 3, targetReps: "10-12次", defaultWeight: 35 },
      { exerciseId: "ex-overhead-cable-ext", name: "过头绳索臂屈伸", setsCount: 3, targetReps: "12-15次", defaultWeight: 15 }
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
      { exerciseId: "ex-chest-supported-row", name: "胸垫胸前划船", setsCount: 3, targetReps: "8-10次", defaultWeight: 40 },
      { exerciseId: "ex-straight-arm-pulldown", name: "直臂下压", setsCount: 3, targetReps: "12-15次", defaultWeight: 20 },
      { exerciseId: "ex-face-pull", name: "绳索面拉 (Face Pull)", setsCount: 4, targetReps: "15次", defaultWeight: 15 },
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
      { exerciseId: "ex-hack-squat", name: "哈克深蹲 / 高位腿举", setsCount: 4, targetReps: "8-12次", defaultWeight: 60 },
      { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", setsCount: 3, targetReps: "10-12次", defaultWeight: 50 },
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

export const LEG_EXERCISES = [
  {
    id: "ex-hack-squat",
    name: "哈克深蹲 / 倒蹬腿举",
    englishName: "Hack Squat / Leg Press",
    category: "腿部",
    target: "股四头肌 (大腿前侧)",
    secondaryMuscles: ["臀大肌", "内收肌群"],
    gifUrl: "./exercises/hack-squat.gif",
    defaultSets: 4,
    defaultReps: "8-12",
    scienceDetail: "放弃自由深蹲的腰椎负担！哈克深蹲有完美的靠背支撑，能把100%的压力精准倾斜在大腿前侧（股四头肌），高效且安全不伤腰。",
    tags: ["纯粹前侧", "安全高效", "股四头撕裂"],
    tips: {
      prep: "背部和腰部紧密贴在靠板上，双脚置于踏板中下方，宽度与肩同宽。",
      execution: "打开安全锁，屈膝下蹲，膝盖顺着脚尖方向前推，下蹲至大腿与踏板平行甚至更深。",
      peak: "由股四头肌发力蹬起踏板，在接近顶端时膝盖保持微屈，切勿锁死反关节！",
      negative: "下放过程控制3秒，充分拉伸股四头肌纤维。"
    },
    commonMistakes: ["蹬直时膝盖骨猛然死锁震荡关节", "下蹲时臀部或腰部离开靠板造成腰部压力"],
    substitutes: [
      { name: "器械腿屈伸", reason: "单关节极限充血" },
      { name: "杠铃深蹲", reason: "全身力量复合之王" }
    ]
  },
  {
    id: "ex-barbell-squat",
    name: "杠铃深蹲 (高杠/低杠)",
    englishName: "Barbell Back Squat",
    category: "腿部",
    target: "下肢整体 / 力量三大项黄金之首",
    secondaryMuscles: ["臀大肌", "股四头肌", "腘绳肌", "竖脊肌", "核心"],
    gifUrl: "./exercises/barbell-squat.gif",
    defaultSets: 4,
    defaultReps: "6-8",
    scienceDetail: "所有力量与肌肉训练的基石动作。不仅强化整个大腿和臀部，更强力刺激全身中枢神经与核心骨骼密度。",
    tags: ["三大项之首", "力量基石", "全身下肢"],
    tips: {
      prep: "杠铃平稳架在斜方肌上（高杠）或三角肌后束（低杠），站距略宽于肩，脚尖微向外30°，深吸气锁紧腹压。",
      execution: "屈髋屈膝同时下蹲，膝盖顺着脚尖方向打开，下蹲至大腿略低于水平面（髋关节低于膝盖）。",
      peak: "全脚掌蹬地推起，站直时收紧臀部与大腿。",
      negative: "控制下蹲节奏，下沉过程中脊柱始终保持坚固中立。"
    },
    commonMistakes: ["下蹲时膝盖内扣（Knee Valgus）造成韧带损伤", "骨盆在底部眨眼严重翻转弓背"],
    substitutes: [
      { name: "哈克深蹲", reason: "靠背支撑保护腰椎" },
      { name: "器械腿屈伸", reason: "孤立前侧泵感" }
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
    commonMistakes: ["腰椎弯曲弓背导致椎间盘受压", "把硬拉做成了深蹲（膝盖过度前屈）"],
    substitutes: [
      { name: "坐姿腿弯举", reason: "纯器械孤立大腿后侧" },
      { name: "臀推 / 杠铃臀桥", reason: "专注臀大肌增厚" }
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
    commonMistakes: ["大腿挡板未压紧导致大腿随动作乱晃", "回放时完全放松失去离心张力"],
    substitutes: [
      { name: "罗马尼亚硬拉 (RDL)", reason: "复合拉伸后链" },
      { name: "器械腿屈伸", reason: "前侧对抗肌群" }
    ]
  },
  {
    id: "ex-leg-extension",
    name: "器械腿屈伸 (踢腿机)",
    englishName: "Leg Extension",
    category: "腿部",
    target: "股四头肌单关节孤立 / 前侧拉丝",
    secondaryMuscles: ["膝关节韧带强化"],
    gifUrl: "./exercises/leg-extension.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "股四头肌单关节孤立王牌！完全避开臀部和髋屈肌参与，让股四头肌四大肌头在顶峰完全收缩，带来灼烧般的充血泵感。",
    tags: ["单关节孤立", "股四头拉丝", "终极泵感"],
    tips: {
      prep: "背部紧靠座椅，膝关节轴心与器械旋转轴对齐，脚踝前侧贴紧滚轴垫。",
      execution: "股四头肌发力将小腿向上踢起，直至双腿几乎完全伸平。",
      peak: "在顶端水平位置顶峰收缩股四头肌2秒，感受大腿前侧肌肉硬如磐石。",
      negative: "控制下放3秒回到起始位置。"
    },
    commonMistakes: ["利用爆发力向上甩踢铁片", "臀部在发力时离开座椅"],
    substitutes: [
      { name: "哈克深蹲", reason: "复合推举大重量" },
      { name: "杠铃深蹲", reason: "全面下肢发展" }
    ]
  },
  {
    id: "ex-hip-thrust",
    name: "臀推 / 杠铃臀桥 (Hip Thrust)",
    englishName: "Barbell Hip Thrust",
    category: "腿部",
    target: "臀大肌极度孤立 / 翘臀之王",
    secondaryMuscles: ["腘绳肌", "大腿内收肌", "核心"],
    gifUrl: "./exercises/hip-thrust.gif",
    defaultSets: 4,
    defaultReps: "10-12",
    scienceDetail: "生物力学公认激活臀大肌最强动作！水平推力力线让臀部在顶峰完全缩短位承受最大阻力，高效饱满臀型。",
    tags: ["翘臀之王", "臀大肌孤立", "后链力量"],
    tips: {
      prep: "上背部靠在长凳边缘（肩胛骨下角），杠铃放置在髋部折痕处（垫上保护泡棉），双脚与肩同宽踩实地面。",
      execution: "下巴微收，用臀大肌全力发力向上顶起杠铃，直至大腿与躯干呈水平直线。",
      peak: "在最高点用力夹紧臀大肌2秒，小腿保持垂直地面。",
      negative: "屈髋缓慢下落，保持核心收紧。"
    },
    commonMistakes: ["推起时头部过度后仰导致腰椎反弓借力", "脚位太远或太近导致受力偏离臀部"],
    substitutes: [
      { name: "罗马尼亚硬拉 (RDL)", reason: "腘绳与臀部拉伸" },
      { name: "哈克深蹲", reason: "大腿前侧发展" }
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
    commonMistakes: ["快速小幅度点地弹跳，未做全程拉伸收缩", "膝盖弯曲借力"],
    substitutes: [
      { name: "器械腿屈伸", reason: "前侧孤立" },
      { name: "哈克深蹲", reason: "腿部复合" }
    ]
  }
];

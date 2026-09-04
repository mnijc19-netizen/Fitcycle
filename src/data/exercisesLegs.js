export const LEG_EXERCISES = [
  {
    id: "ex-hack-squat",
    name: "哈克深蹲 / 倒蹬腿举",
    englishName: "Hack Squat / Leg Press",
    category: "腿部",
    target: "股四头肌 (大腿前侧)",
    secondaryMuscles: ["臀大肌", "内收肌群"],
    aliases: ["哈克深蹲", "哈克机", "倒蹬", "倒蹬腿举", "腿举机", "45度倒蹬", "器械深蹲", "大腿前侧", "Hack Squat", "Leg Press"],
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
    aliases: ["深蹲", "杠铃深蹲", "高杠深蹲", "低杠深蹲", "传统深蹲", "后蹲", "三大项深蹲", "Squat"],
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
    aliases: ["硬拉", "RDL", "罗马尼亚硬拉", "杠铃硬拉", "杠铃RDL", "大腿后侧", "臀大肌", "后链训练"],
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
      { name: "俯卧器械腿弯举", reason: "纯器械孤立大腿后侧" },
      { name: "哑铃罗马尼亚硬拉", reason: "自由手腕轨迹更友好" },
      { name: "臀推 / 杠铃臀桥", reason: "专注臀大肌增厚" }
    ]
  },
  {
    id: "ex-dumbbell-rdl",
    name: "哑铃罗马尼亚硬拉",
    englishName: "Dumbbell Romanian Deadlift (Dumbbell RDL)",
    category: "腿部",
    target: "腘绳肌 (大腿后侧) / 臀大肌",
    secondaryMuscles: ["竖脊肌", "核心肌群", "前臂握力"],
    aliases: ["哑铃硬拉", "哑铃RDL", "罗马尼亚硬拉哑铃", "哑铃练腿后侧", "哑铃翘臀", "Dumbbell RDL"],
    gifUrl: "./exercises/dumbbell-rdl.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "自由度极高的后链黄金动作！哑铃允许手腕自然处于身体两侧微内旋轨迹，比杠铃对下背部更加温和，能更深体会臀部后推与大腿后侧肌纤维的极致拉伸。",
    tags: ["哑铃后链", "体态挺拔", "翘臀与后侧"],
    tips: {
      prep: "双脚与髋同宽站立，双手各持一只哑铃垂于大腿前侧，挺胸沉肩锁紧腹压。",
      execution: "微屈膝锁死膝盖角度，以髋关节为折叠轴心，臀部主动向正后方平推（想象屁股关门）。",
      peak: "哑铃顺着小腿下放至膝盖下方，感受大腿后侧强烈拉伸感后，收紧臀肌向前推髋站直。",
      negative: "下放过程全程控制3秒，哑铃贴紧腿部滑动，脊柱全程保持中立不弓腰。"
    },
    commonMistakes: ["把硬拉做成了深蹲（膝盖过度前移弯曲）", "腰椎弯曲弓背借力"],
    substitutes: [
      { name: "罗马尼亚硬拉 (RDL)", reason: "杠铃冲击更大绝对负荷" },
      { name: "俯卧器械腿弯举", reason: "器械单关节孤立腘绳肌" }
    ]
  },
  {
    id: "ex-seated-leg-curl",
    name: "俯卧器械腿弯举 (Lying Leg Curl)",
    englishName: "Lying Leg Curl",
    category: "腿部",
    target: "腘绳肌 (大腿后侧孤立)",
    secondaryMuscles: ["小腿后群"],
    aliases: ["坐姿腿弯举", "腿弯举", "俯卧腿弯举", "卧姿腿弯举", "器械腿弯举", "腘绳肌弯举", "俯卧屈腿", "勾腿", "练腿后侧", "Lying Leg Curl", "Leg Curl"],
    gifUrl: "./exercises/seated-leg-curl.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "孤立大腿后侧腘绳肌的黄金动作！俯卧姿态下完全剥离腰椎负担，通过膝关节屈曲让腘绳肌在近端到远端全面受力，高效增厚大腿后侧线条。",
    tags: ["俯卧孤立", "安全护腰", "腘绳肌神器"],
    tips: {
      prep: "俯卧趴在器械软垫上，膝盖微露出垫边，双手抓稳前方扶手，滚轴垫置于脚后跟跟腱上方。",
      execution: "用大腿后侧腘绳肌集中发力，将小腿向上弯曲勾向臀部方向。",
      peak: "勾至最顶点时顶峰收缩挤压后侧肌群1.5秒，保持骨盆紧贴垫面勿翘起借力。",
      negative: "匀速对抗阻力下放3秒，直至双腿几乎伸直但膝关节保持微屈不锁死。"
    },
    commonMistakes: ["发力时骨盆抬起离开软垫借腰力", "回放时完全放松失去离心张力"],
    substitutes: [
      { name: "罗马尼亚硬拉 (RDL)", reason: "复合拉伸后链" },
      { name: "哑铃罗马尼亚硬拉", reason: "自由重量拉伸" },
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
    aliases: ["腿屈伸", "踢腿机", "坐姿踢腿", "器械腿屈伸", "股四头肌孤立", "坐姿腿屈伸", "Leg Extension"],
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
    aliases: ["臀推", "杠铃臀推", "臀桥", "杠铃臀桥", "练臀之王", "翘臀动作", "Hip Thrust"],
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
    aliases: ["提踵", "小腿提踵", "站姿提踵", "坐姿提踵", "练小腿", "腓肠肌", "比目鱼肌", "Calf Raise"],
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
  },
  {
    id: "ex-bulgarian-split-squat",
    name: "保加利亚分腿蹲",
    englishName: "Bulgarian Split Squat",
    category: "腿部",
    target: "股四头肌 / 臀大肌 (单腿稳定与深层做工)",
    secondaryMuscles: ["内收肌群", "腘绳肌", "核心稳定"],
    aliases: ["保加利亚深蹲", "分腿蹲", "后脚抬高蹲", "单腿深蹲", "保加利亚", "Bulgarian Split Squat"],
    gifUrl: "./exercises/barbell-squat.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "公认的单腿王牌动作！后脚搭在卧推凳上，彻底消除下背腰椎代偿压力，深层孤立刺激前腿臀大肌与股四头肌，纠正左右肌力不平衡。",
    tags: ["单腿之王", "臀腿双雕", "平衡与发力"],
    tips: {
      prep: "单脚前跨一步，后脚脚背平搭在平凳上，上身微前倾保持脊柱中立。",
      execution: "前腿屈膝下沉，直到后膝接近触地，重心始终压在前脚脚后跟与中足之间。",
      peak: "前腿大腿及臀部发力推起身体至站立，骨盆全程保持水平正对前方。",
      negative: "控制下放3秒，充分拉伸前侧臀腿纤维。"
    },
    commonMistakes: ["前脚距离太近导致膝盖压力过大", "身体左右晃动核心未锁紧"],
    substitutes: [
      { name: "哑铃箭步蹲", reason: "动态单腿步进" },
      { name: "哈克深蹲", reason: "双腿大重量" }
    ]
  },
  {
    id: "ex-seated-leg-curl-machine",
    name: "坐姿器械腿弯举",
    englishName: "Seated Leg Curl",
    category: "腿部",
    target: "腘绳肌群 (大腿后侧在屈髋下的顶峰收缩)",
    secondaryMuscles: ["小腿腓肠肌", "臀大肌下沿"],
    aliases: ["坐姿腿弯举", "坐姿弯腿", "器械腿弯举", "腘绳肌屈腿", "Seated Leg Curl"],
    gifUrl: "./exercises/seated-leg-curl.gif",
    defaultSets: 4,
    defaultReps: "10-12",
    scienceDetail: "现代运动科学研究证明：坐姿状态下髋关节处于屈曲位，腘绳肌在近端被预先拉伸，因此坐姿腿弯举的肌肥大效应显著优于俯卧腿弯举！",
    tags: ["顶峰收缩", "腘绳超量肥大", "科学力学"],
    tips: {
      prep: "坐于器械座椅，背部紧贴靠垫，大腿压板紧紧压在膝盖上方，圆柱滚轴置于跟腱后方。",
      execution: "后侧腘绳肌发力将滚轴向下后方卷曲至最大收缩幅度。",
      peak: "在底端顶峰收缩停顿1.5秒，感受大腿后侧像抽筋一般的充血挤压。",
      negative: "慢速控制还原，膝盖保持微屈不完全锁死。"
    },
    commonMistakes: ["借用臀部向前滑动离座借力", "下放速度太快未控制离心做工"],
    substitutes: [
      { name: "俯卧器械腿弯举 (Lying Leg Curl)", reason: "卧姿平替" },
      { name: "罗马尼亚硬拉 (RDL)", reason: "拉伸区做工" }
    ]
  },
  {
    id: "ex-hip-abduction-machine",
    name: "器械髋外展 / 坐姿外展",
    englishName: "Seated Hip Abduction Machine",
    category: "腿部",
    target: "臀中肌 / 臀小肌 (侧臀饱满与骨盆稳定)",
    secondaryMuscles: ["臀大肌上部纤维", "阔筋膜张肌"],
    aliases: ["髋外展", "器械外展", "坐姿外展", "挡腿机", "练侧臀", "臀中肌", "Hip Abduction"],
    gifUrl: "./exercises/hip-thrust.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "塑造饱满饱满腰臀比（V-Taper/沙漏比）的关键孤立动作。强化臀中肌不仅填补侧臀凹陷，还能防止深蹲时膝盖内扣（Knee Valgus）。",
    tags: ["侧臀饱满", "骨盆稳定", "安全塑形"],
    tips: {
      prep: "坐稳于座椅上，膝盖外侧贴紧阻力垫板，背部贴紧或上身略微前倾以侧重臀中肌纤维。",
      execution: "臀部两侧发力将双腿尽力向外推开至最大活动范围。",
      peak: "在最宽处用力顶峰挤压2秒。",
      negative: "缓慢控制还原，注意双腿在触碰前就要重新发力，保持全程张力。"
    },
    commonMistakes: ["惯性快速弹开", "仅用脚踝发力而忽略膝盖外推"],
    substitutes: [
      { name: "臀推 / 杠铃臀桥 (Hip Thrust)", reason: "臀大肌整体力量" },
      { name: "罗马尼亚硬拉 (RDL)", reason: "后链复合" }
    ]
  },
  {
    id: "ex-hip-adduction-machine",
    name: "器械髋内收 / 坐姿夹腿",
    englishName: "Seated Hip Adduction Machine",
    category: "腿部",
    target: "大腿内收肌群 (大腿内侧致密度与深蹲支撑力)",
    secondaryMuscles: ["耻骨肌", "股薄肌", "骨盆底肌"],
    aliases: ["髋内收", "器械内收", "坐姿夹腿", "夹腿机", "练内侧", "大腿内收肌", "Hip Adduction"],
    gifUrl: "./exercises/leg-extension.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "大腿内收肌群是仅次于股四头肌的第二大下肢肌群！强化内收肌不仅消除大腿内侧松弛，更是大重量深蹲出坑时最核心的内侧支撑来源。",
    tags: ["大腿内侧", "深蹲支撑", "肌群致密"],
    tips: {
      prep: "双腿向两侧完全打开，膝盖内侧紧贴阻力垫板，双手抓住器械握把固定上身。",
      execution: "大腿内侧肌肉发力，将双腿向中心匀速并拢夹紧。",
      peak: "在中间闭合点强力收缩停留1-2秒。",
      negative: "缓慢张开双腿至大腿内侧完全被拉长，但不要让配重片砸底撞击。"
    },
    commonMistakes: ["配重过大导致动作变形或拉伤内收肌", "快上快下没有离心控制"],
    substitutes: [
      { name: "哈克深蹲 / 倒蹬腿举", reason: "宽站距兼顾内收" },
      { name: "杠铃深蹲 (高杠/低杠)", reason: "下肢整体基石" }
    ]
  },
  {
    id: "ex-dumbbell-lunge",
    name: "哑铃箭步蹲 / 走动箭步蹲",
    englishName: "Dumbbell Walking Lunge",
    category: "腿部",
    target: "股四头肌 / 臀大肌 (功能性动态运动链)",
    secondaryMuscles: ["腘绳肌", "小腿", "核心抗旋稳定"],
    aliases: ["箭步蹲", "哑铃箭步蹲", "走姿箭步蹲", "弓箭步", "步进深蹲", "Lunge"],
    gifUrl: "./exercises/barbell-squat.gif",
    defaultSets: 3,
    defaultReps: "10-12步/侧",
    scienceDetail: "极具运动表现力的动态下肢训练！相比固定位动作，走动箭步蹲需要全身核心与髋部稳定肌群参与动态抗失衡，心肺与做工消耗极高。",
    tags: ["功能王牌", "动态爆发", "臀腿双雕"],
    tips: {
      prep: "双手各持一只哑铃自然下垂，挺胸收腹，向前迈出一大步。",
      execution: "身体垂直下沉，前膝弯曲呈90度，后膝接近地面但不碰撞地面。",
      peak: "前脚脚跟蹬地站起，同时顺势向前迈出下一步。",
      negative: "下沉过程平稳，膝盖不要左右摇晃晃动。"
    },
    commonMistakes: ["前跨步幅太小导致膝盖过度向前挤压髌骨", "身体过度前趴弓背"],
    substitutes: [
      { name: "保加利亚分腿蹲", reason: "静止位单腿聚焦" },
      { name: "哈克深蹲", reason: "器械大容量" }
    ]
  },
  {
    id: "ex-goblet-squat",
    name: "高脚杯深蹲 (哑铃/壶铃)",
    englishName: "Goblet Squat",
    category: "腿部",
    target: "股四头肌 / 髋关节下潜深度与灵活性",
    secondaryMuscles: ["臀大肌", "核心肌群", "上背"],
    aliases: ["高脚杯深蹲", "哑铃高脚杯", "壶铃深蹲", "前置深蹲", "Goblet Squat"],
    gifUrl: "./exercises/hack-squat.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "被全美体能协会（NSCA）评为学习深蹲发力模式最优秀的动作。前置重物自然起到平衡作用，能强迫躯干保持直立，非常友好地释放髋关节活动度。",
    tags: ["新手友好", "躯干直立", "灵活性强化"],
    tips: {
      prep: "双手捧住一只哑铃的一端靠近胸口，双脚略宽于肩，脚尖微朝外。",
      execution: "手肘内收保持重物贴胸，屈髋屈膝垂直下蹲，手肘自然下落于双膝之间。",
      peak: "下蹲至大腿低于平行线后，全脚掌蹬地推起，顶端收紧臀肌。",
      negative: "平稳控制下放，保持核心紧绷背部挺直。"
    },
    commonMistakes: ["哑铃远离胸口导致上背过度疲劳弓背", "脚后跟离地重心向前倾倒"],
    substitutes: [
      { name: "杠铃深蹲 (高杠/低杠)", reason: "高阶大重量" },
      { name: "器械腿屈伸", reason: "前侧孤立" }
    ]
  }
];

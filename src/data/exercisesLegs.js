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
  },
  {
    id: "ex-smith-squat",
    name: "史密斯深蹲",
    englishName: "Smith Machine Squat",
    category: "腿部",
    target: "股四头肌极度做工 / 卸除躯干平衡负担",
    secondaryMuscles: ["臀大肌", "大腿内收肌", "腘绳肌"],
    aliases: ["史密斯机深蹲", "固定深蹲", "史密斯蹲", "Smith Squat"],
    gifUrl: "./exercises/barbell-squat.gif",
    defaultSets: 4,
    defaultReps: "8-12",
    scienceDetail: "纯肌肥大训练的王牌武器。由于史密斯机的刚性垂直滑轨完全代劳了前后晃动的平衡控制，训练者可以将双脚向前迈出半步，彻底将脊柱剪切力降至最低，膝关节最大化屈曲，将高机械张力 100% 毫无保留地压榨在股四头肌上。",
    tags: ["大腿前侧拉丝", "安全力竭", "纯肌肥大", "护腰神技"],
    tips: {
      prep: "双脚置于杠铃正下方或略向前半步，杠铃架在斜方肌上束；转动腕部开锁，挺胸收腹下沉肩胛。",
      execution: "控制速度屈膝屈髋垂直下蹲，重心始终落在全脚掌与足跟之间，下蹲至大腿至少平行地面。",
      peak: "全脚掌用力推地爆发起立，顶峰不锁死膝盖，维持股四头肌连续张力。",
      negative: "慢速 3 秒下蹲，感受大腿前侧肌纤维在受控下的强烈拉伸撕裂。",
      breathing: "下蹲时吸气充满腹压，蹲起过半程时强力呼气。"
    },
    commonMistakes: [
      "双脚放得过前变成了靠墙蹲，导致髋关节和膝关节受力异常",
      "起立顶端过度顶髋超伸腰椎",
      "膝盖内扣（Knee Valgus）"
    ],
    substitutes: [
      { name: "哈克深蹲 / 倒蹬腿举", reason: "同等下肢高负荷器械替代" },
      { name: "杠铃深蹲 (高杠/低杠)", reason: "自由重量核心综合力量" }
    ]
  },
  {
    id: "ex-cable-glute-kickback",
    name: "绳索后踢 / 驴踢",
    englishName: "Cable Glute Kickback",
    category: "腿部",
    target: "臀大肌上部与外侧 / 饱满翘臀雕刻",
    secondaryMuscles: ["腘绳肌上段", "核心稳定肌群"],
    aliases: ["绳索后踢", "龙门架后踢", "驴踢", "后踢腿", "Glute Kickback"],
    gifUrl: "./exercises/cable-glute-kickback.gif",
    defaultSets: 4,
    defaultReps: "12-15",
    scienceDetail: "极度孤立臀大肌的终极塑形动作。在龙门架低位滑轮将脚踝套绑定，向后上方伸髋（Hip Extension），能避开股四头肌的粗腿代偿，精准给臀大肌最顶端的肌纤维施加恒定对抗张力，打造蜜桃臀与臀腿分界线。",
    tags: ["臀肌孤立", "不粗大腿", "翘臀上沿", "臀腿分离"],
    tips: {
      prep: "滑轮调至最低，将脚踝套绑在一侧脚踝上；双手扶住龙门立柱，支撑腿微屈，骨盆完全朝正前方保持水平。",
      execution: "保持腰椎绝对锁定不超伸反弓，纯依靠臀大肌发力将负重腿向后上方弧线踢出。",
      peak: "踢至顶端（腿与躯干大致成一条直线），死死收缩挤压臀大肌 2 秒，感受刀刻般的灼烧感。",
      negative: "慢速 3 秒放回，在触地前保持绳索紧绷，维持臀部离心做工。",
      breathing: "向后踢起时呼气，前移回放时吸气。"
    },
    commonMistakes: [
      "每次后踢都疯狂反弓下背骨盆前倾借力，导致腰椎代偿酸痛",
      "利用膝盖屈伸弹跳惯性甩腿，丧失伸髋本质"
    ],
    substitutes: [
      { name: "臀推 / 杠铃臀桥 (Hip Thrust)", reason: "大重量双侧臀部爆发力" },
      { name: "器械髋外展 / 坐姿外展", reason: "侧臀与臀中肌强化" }
    ]
  },
  {
    id: "ex-glute-hyperextension",
    name: "45度罗马椅挺身 (臀部侧重)",
    englishName: "45° Glute-Focused Back Extension",
    category: "腿部",
    target: "臀大肌与腘绳肌上段 (纯伸髋做工)",
    secondaryMuscles: ["腘绳肌", "大腿内收肌群", "下背竖脊肌"],
    aliases: ["圆背挺身", "罗马椅练臀", "臀部山羊挺身", "Round-Back Extension"],
    gifUrl: "./exercises/rdl.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "现代运动力学对传统山羊挺身的高阶改良。通过故意“含胸弓背”（Thoracic Flexion）锁定脊柱，彻底废掉竖脊肌的屈伸伸展功能，强迫整个身体起伏由臀大肌作为唯一的主动伸髋原动机（Prime Mover），肌电图显示臀大肌募集率提升 40% 以上。",
    tags: ["翘臀黑科技", "下背零压力", "纯伸髋孤立"],
    tips: {
      prep: "罗马椅挡板高度调低至大腿上部髋折痕下方约 5cm，双脚外展 45°；双手抱胸或抱轻杠铃片，上背主动弓起（猫背状）。",
      execution: "保持上背持续弓背锁定，在髋关节处折叠下沉；接着纯靠臀部用力向前顶紧挡板把躯干拉起。",
      peak: "顶端躯干不需要反弓挺直，只需伸展到臀大肌完全收缩即停，紧缩 1.5 秒。",
      negative: "匀速缓慢顺滑下落，感受臀大肌在底部的深度拉伸。",
      breathing: "顶峰顶紧时呼气，屈髋下落时吸气。"
    },
    commonMistakes: [
      "起身后腰椎过度反弓直立，变回了传统的竖脊肌挺身",
      "挡板调得过高阻碍了正常的屈髋折叠"
    ],
    substitutes: [
      { name: "罗马尼亚硬拉 (RDL)", reason: "自由重量大行程伸髋" },
      { name: "臀推 / 杠铃臀桥 (Hip Thrust)", reason: "仰卧位最大峰值收缩" }
    ]
  },
  {
    id: "ex-single-leg-extension",
    name: "单腿器械腿屈伸",
    englishName: "Single-Leg Leg Extension",
    category: "腿部",
    target: "单侧股四头肌 / 股内侧肌与左右肌力纠偏",
    secondaryMuscles: ["股直肌", "股外侧肌"],
    aliases: ["单腿踢腿", "单侧腿屈伸", "单脚腿屈伸", "Single Leg Extension"],
    gifUrl: "./exercises/leg-extension.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "消除左右腿围度差距与膝关节稳定性差的黄金单侧动作。单腿操作能防止强侧腿在双腿训练时不知不觉代偿 20%-30% 的力矩，极大强化股内侧肌斜头（VMO），为膝盖骨髌骨提供完美的滑动轨迹支撑。",
    tags: ["单侧纠偏", "护膝强化", "股四内侧", "拉丝泵感"],
    tips: {
      prep: "背部紧靠座椅靠背，滚轴卡在单侧脚踝正上方，双手死死握紧侧面把手将臀部按在座椅上。",
      execution: "纯单腿股四头肌发力，将小腿向上踢起展开，保持脚尖自然绷直向前。",
      peak: "在膝关节完全伸直（不暴力超伸锁死）的顶峰，停留并主动挤压大腿前侧 2 秒。",
      negative: "极度缓慢控制 3-4 秒缓慢下落，感受股直肌被拉长承受持续离心撕扯。",
      breathing: "踢起用力时呼气，慢放离心时吸气。"
    },
    commonMistakes: [
      "臀部脱离座椅弹起借力",
      "下落速度过快，配重片剧烈砸响撞击"
    ],
    substitutes: [
      { name: "器械腿屈伸 (踢腿机)", reason: "双腿常规高负荷" },
      { name: "保加利亚分腿蹲", reason: "自重与哑铃单腿蹲复合" }
    ]
  },
  {
    id: "ex-single-leg-db-rdl",
    name: "单腿哑铃罗马尼亚硬拉",
    englishName: "Single-Leg Dumbbell RDL",
    category: "腿部",
    target: "单侧腘绳肌 / 臀中肌与单腿平衡防线",
    secondaryMuscles: ["臀大肌", "小腿深层稳定肌", "核心抗扭转"],
    aliases: ["单腿硬拉", "单脚RDL", "哑铃单腿硬拉", "Single Leg RDL"],
    gifUrl: "./exercises/dumbbell-rdl.gif",
    defaultSets: 3,
    defaultReps: "8-10",
    scienceDetail: "功能性与肌肥大的完美交汇。单腿支撑并屈髋俯身，对侧腿向后延展，强迫臀中肌与足底本体感觉全力开火以维持骨盆水平不倾斜，对后侧链拉伸感极度强烈，直接提升跑步和跳跃爆发力。",
    tags: ["单腿平衡", "腘绳深层撕裂", "臀中肌防线", "功能性"],
    tips: {
      prep: "单脚支撑微屈膝，对侧手持单只哑铃垂直下垂，核心收紧挺胸。",
      execution: "支撑腿膝盖角度固定，以髋部为轴心向后顶髋俯身，非支撑腿保持伸直向正后方抬起平衡。",
      peak: "俯身至躯干接近与地面平行，感受单侧大腿后侧腘绳肌像拉满的弓弦般紧绷，短暂停留。",
      negative: "脚掌抓地，臀肌与腘绳肌向后拉动身体站直还原，顶端收臀。",
      breathing: "俯身下探吸气，站起还原呼气。"
    },
    commonMistakes: [
      "骨盆向非支撑侧严重侧翻旋开，未保持双侧髂骨朝向地面",
      "下背弓起驼背导致腰椎扭转受力"
    ],
    substitutes: [
      { name: "哑铃罗马尼亚硬拉", reason: "双侧经典大重量硬拉" },
      { name: "保加利亚分腿蹲", reason: "高强度单腿蹲复合" }
    ]
  },
  {
    id: "ex-seated-calf-raise",
    name: "坐姿提踵",
    englishName: "Seated Calf Raise",
    category: "腿部",
    target: "小腿比目鱼肌 (拓宽小腿侧方与后方视觉宽度)",
    secondaryMuscles: ["腓肠肌下沿", "足底屈肌"],
    aliases: ["坐姿提踵", "器械坐姿提踵", "屈膝提踵", "Seated Calf Raise"],
    gifUrl: "./exercises/calf-raise.gif",
    defaultSets: 4,
    defaultReps: "15-20",
    scienceDetail: "解剖学上与站姿提踵绝对互补。腓肠肌跨越膝关节与踝关节，在屈膝 90° 坐姿时处于主动不足（Active Insufficiency）状态；此时所有的提踵阻力被 100% 转移给只跨越踝关节的深层【比目鱼肌】，能让小腿看起来更粗壮致密。",
    tags: ["比目鱼肌孤立", "小腿围度", "抗跟腱伤病", "解剖互补"],
    tips: {
      prep: "坐在提踵机上，前脚掌踩在踏板边缘，挡板压在大腿下端膝盖后方；双手握住手柄开锁。",
      execution: "脚后跟向下方最大限度沉下，感受跟腱与比目鱼肌被深长拉伸；随后前脚掌蹬地将脚后跟全力提至最高点。",
      peak: "在最高峰顶峰停顿 2 秒，将比目鱼肌彻底榨干挤紧。",
      negative: "缓慢 3 秒受控下落至最底部，不弹震跳跃借力。",
      breathing: "向上提踵时呼气，受控下沉时吸气。"
    },
    commonMistakes: [
      "利用机器回弹的弹性上下高频抖动，根本没有肌肉主动做工",
      "下沉幅度过浅，未进入深层拉伸位"
    ],
    substitutes: [
      { name: "站姿/坐姿提踵", reason: "站姿侧重浅层腓肠肌" },
      { name: "倒蹬机腿举提踵", reason: "大负荷腿举机提踵替代" }
    ]
  }
];

export const ARM_EXERCISES = [
  {
    id: "ex-machine-triceps-pressdown",
    name: "站姿绳索三头下压 (Triceps Pushdown)",
    englishName: "Cable Triceps Pushdown",
    category: "手臂",
    target: "肱三头肌外侧头与长头 / 马蹄铁",
    secondaryMuscles: ["三角肌前束", "胸大肌下部"],
    aliases: ["器械三头下压", "绳索下压", "直杠下压", "V把下压", "三头下压", "站姿下压", "肱三头肌下压", "臂屈伸", "马蹄铁", "Triceps Pushdown", "Pushdown"],
    gifUrl: "./exercises/machine-triceps-pressdown.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "站姿绳索恒张力下压！手肘紧贴躯干两侧作为绝对旋转轴心，全力孤立轰炸肱三头肌外侧头与长头，雕刻手臂侧面立体马蹄铁！",
    tags: ["三头马蹄铁", "恒定张力", "深度泵感"],
    tips: {
      prep: "面对龙门架站立，双脚与肩同宽微屈膝俯身约15°，双手正握直杠或绳索，大臂紧贴身体两侧肋骨锁定。",
      execution: "大臂与手肘保持绝对固定，仅通过肱三头肌收缩用力将把手垂直向下推压到底。",
      peak: "在最低端手臂完全伸直时用力顶峰收紧三头肌1.5秒，体会外侧头的极度坚硬感。",
      negative: "吸气慢速控制回放3秒，让前臂向上折叠至略高于90度，充分拉伸三头肌。"
    },
    commonMistakes: ["身体剧烈前倾甚至把胸口压在横杠上借体重下压", "手肘前后大幅晃动脱离肋骨"],
    substitutes: [
      { name: "过头绳索臂屈伸", reason: "更注重长头的深度拉伸" },
      { name: "俯身哑铃臂屈伸 (Kickback)", reason: "极限顶峰收缩" },
      { name: "窄距杠铃卧推", reason: "复合大重量突破推力" }
    ]
  },
  {
    id: "ex-overhead-cable-ext",
    name: "过头绳索臂屈伸",
    englishName: "Overhead Cable Triceps Extension",
    category: "手臂",
    target: "肱三头肌长头 (手臂厚度之源)",
    secondaryMuscles: ["核心稳定"],
    aliases: ["过头臂屈伸", "绳索过头臂屈伸", "三头长头", "法式臂屈伸", "绳索臂屈伸", "Overhead Extension"],
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
    commonMistakes: ["大臂上下大幅度摆动导致肩部代偿", "腰部过度反弓导致腰椎受压"],
    substitutes: [
      { name: "窄距杠铃卧推", reason: "复合大重量增粗手臂" },
      { name: "板凳下压 / 凳上双臂屈伸", reason: "自重方便练" }
    ]
  },
  {
    id: "ex-dumbbell-kickback",
    name: "俯身哑铃臂屈伸 (Kickback)",
    englishName: "Dumbbell Triceps Kickback",
    category: "手臂",
    target: "肱三头肌外侧头与长头顶峰收缩",
    secondaryMuscles: ["三角肌后束"],
    aliases: ["俯身臂屈伸", "哑铃臂屈伸", "三头后踢", "手臂后屈伸", "哑铃三头", "Kickback"],
    gifUrl: "./exercises/dumbbell-kickback.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "肱三头肌顶峰收缩之王！在手臂完全伸直向后锁定的瞬间，三头肌处于极限缩短位，带来最强烈的收缩灼烧感与清晰马蹄铁轮廓。",
    tags: ["极限收缩", "单关节孤立", "三头刻度"],
    tips: {
      prep: "单手单膝支撑于长凳上，躯干与地面平行，另一手持轻哑铃，大臂夹紧贴平身体侧面。",
      execution: "保持大臂水平不动，收缩肱三头肌，将小臂向后上方完全蹬出伸直。",
      peak: "在手臂完全伸直的顶峰死死挤压三头肌2秒。",
      negative: "缓慢控制回落至小臂与地面垂直（90度）。"
    },
    commonMistakes: ["大臂像划船一样上下甩动借力", "使用过重哑铃导致无法在伸直位停顿"],
    substitutes: [
      { name: "站姿绳索三头下压", reason: "器械全程恒定张力" },
      { name: "过头绳索臂屈伸", reason: "针对长头深度拉伸" }
    ]
  },
  {
    id: "ex-close-grip-bench-press",
    name: "窄距杠铃卧推",
    englishName: "Close-Grip Bench Press",
    category: "手臂",
    target: "肱三头肌整体围度 / 大重量推力",
    secondaryMuscles: ["胸大肌内侧", "三角肌前束"],
    aliases: ["窄握卧推", "窄距卧推", "窄推", "三头卧推", "杠铃窄推", "Close Grip Bench Press"],
    gifUrl: "./exercises/close-grip-bench-press.gif",
    defaultSets: 3,
    defaultReps: "8-10",
    scienceDetail: "能够使用最大负荷刺激肱三头肌的复合动作，有效突破手臂力量瓶颈，增加大臂整体粗壮感。",
    tags: ["大重量手臂", "三头复合动作", "突破力量瓶颈"],
    tips: {
      prep: "平躺在卧推凳上，双手握距与肩同宽或略窄（约一拳半距离，切勿过窄伤腕）。",
      execution: "手肘贴近身体两侧下放杠铃至胸部中下段。",
      peak: "三头肌强力发力向上推起，顶峰挤压手臂后侧。",
      negative: "控制下放2-3秒，保持肘关节内收。"
    },
    commonMistakes: ["握距过于狭窄导致手腕严重挤压剧痛", "手肘向外大肆张开"],
    substitutes: [
      { name: "站姿绳索三头下压", reason: "器械孤立轨道" },
      { name: "板凳下压 / 凳上双臂屈伸", reason: "自重泵感" }
    ]
  },
  {
    id: "ex-bench-dips",
    name: "板凳下压 / 凳上双臂屈伸",
    englishName: "Bench Dips",
    category: "手臂",
    target: "肱三头肌外侧头与内侧头",
    secondaryMuscles: ["三角肌前束"],
    aliases: ["板凳臂屈伸", "凳上双臂屈伸", "自重臂屈伸", "椅子臂屈伸", "板凳屈伸", "Bench Dips"],
    gifUrl: "./exercises/bench-dips.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "简单高效的自重三头终结动作。随时随地可练，可在训练最后作为超级组彻底排空三头肌糖原。",
    tags: ["自重终结", "深度充血", "三头泵感"],
    tips: {
      prep: "双手撑在长凳边缘，手指向前，双腿前伸伸直（难度高可脚跟搭在另一凳子上）。",
      execution: "屈肘垂直下落躯干至大臂与地面平行（约90度）。",
      peak: "三头肌发力将身体推回原位，顶峰彻底收缩手臂。",
      negative: "缓慢下落，背部贴近长凳边缘垂直滑动。"
    },
    commonMistakes: ["臀部远离长凳导致肩关节过度前伸受压", "下落过深伤肩峰"],
    substitutes: [
      { name: "站姿绳索三头下压", reason: "负重微调更精确" },
      { name: "过头绳索臂屈伸", reason: "长头拉伸" }
    ]
  },
  {
    id: "ex-dumbbell-curl",
    name: "站姿哑铃交替弯举",
    englishName: "Standing Alternating Dumbbell Curl",
    category: "手臂",
    target: "肱二头肌整体 / 肌峰与旋转",
    secondaryMuscles: ["肱桡肌", "前臂屈肌群"],
    aliases: ["哑铃弯举", "交替弯举", "哑铃交替弯举", "站姿弯举", "二头弯举", "Dumbbell Curl"],
    gifUrl: "./exercises/dumbbell-curl.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "手臂训练经典王牌！站姿哑铃弯举允许在向上弯曲的过程中自然进行前臂外旋（小拇指外翻），完美契合肱二头肌的双重生理功能（屈肘+前臂旋后），最大化激活肌峰爆发！",
    tags: ["经典王牌", "前臂旋后", "肌峰隆起"],
    tips: {
      prep: "站姿双脚与肩同宽，挺胸沉肩，双手各持哑铃垂于体侧，掌心相对。",
      execution: "单臂或双臂交替向上弯举，在手肘抬起过程中顺势向外旋转手腕（小拇指向外上方翻起）。",
      peak: "在顶端二头肌峰处顶峰挤压2秒。",
      negative: "匀速控制下放3秒，感受二头肌纤维的离心退让张力。"
    },
    commonMistakes: ["借用躯干前后摆动惯性甩起哑铃", "手肘大幅度向前抬起脱离身体"],
    substitutes: [
      { name: "上斜哑铃弯举", reason: "长头极度拉伸" },
      { name: "站姿杠铃弯举", reason: "双手协同上大重量" }
    ]
  },
  {
    id: "ex-incline-db-curl",
    name: "上斜哑铃弯举",
    englishName: "Incline Dumbbell Curl",
    category: "手臂",
    target: "肱二头肌长头 (肌峰拉伸)",
    secondaryMuscles: ["前臂肌群"],
    aliases: ["上斜弯举", "上斜哑铃弯举", "二头长头", "拉伸弯举", "上斜板弯举", "Incline Curl"],
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
    commonMistakes: ["用肩膀前抬带动大臂向前借力", "身体借反弹力甩动哑铃"],
    substitutes: [
      { name: "牧师凳斜托弯举 (Preacher Curl)", reason: "绝对防借力，主打短头" },
      { name: "站姿杠铃弯举", reason: "可上大重量突破力量" }
    ]
  },
  {
    id: "ex-hammer-curl",
    name: "哑铃锤式弯举",
    englishName: "Dumbbell Hammer Curl",
    category: "手臂",
    target: "肱肌 / 肱桡肌 (前臂与二头之间)",
    secondaryMuscles: ["肱二头肌外侧"],
    aliases: ["锤式弯举", "哑铃锤式弯举", "锤式", "练小臂", "肱肌", "锤举", "Hammer Curl"],
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
    commonMistakes: ["身体后仰大幅甩动借力", "手腕松懈晃动未保持锁定"],
    substitutes: [
      { name: "集中弯举", reason: "专注单臂肌峰收缩" },
      { name: "站姿杠铃弯举", reason: "大重量整体二头" }
    ]
  },
  {
    id: "ex-barbell-curl",
    name: "站姿杠铃弯举",
    englishName: "Barbell / EZ-Bar Curl",
    category: "手臂",
    target: "肱二头肌整体 / 力量与肌峰",
    secondaryMuscles: ["前臂屈肌群"],
    aliases: ["杠铃弯举", "站姿杠铃弯举", "曲杆弯举", "EZ杠弯举", "二头力量", "Barbell Curl"],
    gifUrl: "./exercises/barbell-curl.gif",
    defaultSets: 4,
    defaultReps: "8-10",
    scienceDetail: "二头肌力量构建黄金动作。双手同时握杠能募集最大肌纤维，有效提升大臂整体围度与力量基础。",
    tags: ["二头力量基石", "大重量弯举", "整体围度"],
    tips: {
      prep: "站姿双脚与肩同宽，挺胸沉肩，双手与肩同宽反握杠铃置于大腿前。",
      execution: "大臂紧贴身体两侧保持不动，二头肌发力将杠铃向上弯举至胸部前上方。",
      peak: "顶峰强力挤压二头肌峰1.5秒。",
      negative: "控制下放3秒至手臂几乎伸直。"
    },
    commonMistakes: ["身体前后大幅摇晃甩起杠铃", "肘部大幅度向前抬起变成前束代偿"],
    substitutes: [
      { name: "牧师凳斜托弯举", reason: "锁定大臂完全防借力" },
      { name: "上斜哑铃弯举", reason: "长头极度拉伸" }
    ]
  },
  {
    id: "ex-preacher-curl",
    name: "牧师凳斜托弯举 (Preacher Curl)",
    englishName: "Preacher Curl",
    category: "手臂",
    target: "肱二头肌短头 (内侧厚度) / 严格防借力",
    secondaryMuscles: ["肱肌"],
    aliases: ["牧师凳弯举", "斜托弯举", "斯科特弯举", "二头短头", "牧师椅弯举", "Preacher Curl"],
    gifUrl: "./exercises/preacher-curl.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "通过斜托板死死锁定上臂，完全杜绝了身体摇晃借力与肩膀前抬代偿，精准孤立二头肌下端与短头厚度。",
    tags: ["防借力神器", "二头短头", "下端饱满"],
    tips: {
      prep: "坐入牧师凳，胸口贴紧斜托板上方，腋下卡实托板顶部，手臂自然顺着托板下放握杠。",
      execution: "保持大臂完全贴实托板，发力向上弯举至垂直位置。",
      peak: "顶峰收缩挤压二头肌短头1秒。",
      negative: "慢速下放至手臂微屈，切勿在底部猛然反向过伸损伤肌腱！"
    },
    commonMistakes: ["底部下放过猛过快导致二头肌腱拉伤", "臀部离开座椅借力"],
    substitutes: [
      { name: "上斜哑铃弯举", reason: "针对长头拉伸" },
      { name: "集中弯举", reason: "单臂精准肌峰" }
    ]
  },
  {
    id: "ex-concentration-curl",
    name: "集中弯举 (Concentration Curl)",
    englishName: "Concentration Curl",
    category: "手臂",
    target: "肱二头肌峰雕刻 / 极限顶峰收缩",
    secondaryMuscles: ["前臂肌群"],
    aliases: ["集中弯举", "孤立弯举", "阿诺德弯举", "二头肌峰", "坐姿集中弯举", "Concentration Curl"],
    gifUrl: "./exercises/concentration-curl.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "施瓦辛格最推崇的二头肌峰雕刻动作！坐姿单肘顶在大腿内侧，彻底杜绝躯干移动，用意念将所有血液泵入二头肌峰。",
    tags: ["雕刻肌峰", "高耸二头", "意念专注"],
    tips: {
      prep: "坐在长凳边缘，单肘顶在同侧大腿内侧接近膝盖处，单手垂直握持哑铃。",
      execution: "大腿作为稳固支点，二头肌发力将哑铃向上弯举向面部方向。",
      peak: "在最高点将小拇指稍微外旋，极致挤压二头肌峰2秒。",
      negative: "匀速慢放至底部拉伸。"
    },
    commonMistakes: ["手肘在腿上前后滑动离开支点", "躯干侧向扭动借力"],
    substitutes: [
      { name: "哑铃锤式弯举", reason: "强化肱肌与围度" },
      { name: "牧师凳斜托弯举", reason: "器械稳定孤立" }
    ]
  },
  {
    id: "ex-reverse-wrist-curl",
    name: "坐姿腕弯举 / 前臂屈伸",
    englishName: "Seated Wrist Curl / Forearm Flexion",
    category: "手臂",
    target: "前臂屈肌群 / 小臂围度与握力",
    secondaryMuscles: ["指深屈肌", "腕力稳定性"],
    aliases: ["腕弯举", "前臂弯举", "练小臂", "卷手腕", "前臂屈伸", "握力训练", "小臂训练", "Wrist Curl"],
    gifUrl: "./exercises/reverse-wrist-curl.gif",
    defaultSets: 3,
    defaultReps: "15-20",
    scienceDetail: "前臂小臂围度的雕刻师！前臂放在大腿或长凳上固定，专注于腕关节的屈曲抗阻，快速打破小臂纤细瓶颈，大幅提升硬拉与引体的握力储备。",
    tags: ["大力水手臂", "前臂厚度", "握力提升"],
    tips: {
      prep: "坐在长凳上，双脚踩实，前臂平放在大腿上，手腕悬出膝盖边缘，双手握住哑铃或杠铃片。",
      execution: "手腕向上卷起，用力收缩前臂内侧肌群。",
      peak: "在卷曲最高点停留挤压前臂2秒。",
      negative: "慢速下放让哑铃滑至手指关节，充分拉长前臂肌群。"
    },
    commonMistakes: ["前臂离开大腿借力晃动", "动作幅度过快未完全卷屈"],
    substitutes: [
      { name: "哑铃锤式弯举", reason: "强化肱桡肌与上臂连接处" },
      { name: "正手引体向上", reason: "自重静态握力抗阻" }
    ]
  }
];

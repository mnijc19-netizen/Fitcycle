export const CORE_EXERCISES = [
  {
    id: "ex-hanging-leg-raise",
    name: "悬垂举腿 / 仰卧举腿",
    englishName: "Hanging Leg Raise",
    category: "核心",
    target: "腹直肌下部 / 核心深层",
    secondaryMuscles: ["髂腰肌", "前臂握力"],
    aliases: ["悬垂举腿", "举腿", "单杠举腿", "仰卧举腿", "下腹训练", "人鱼线", "Hanging Leg Raise"],
    gifUrl: "./exercises/hanging-leg-raise.gif",
    defaultSets: 3,
    defaultReps: "12-15",
    scienceDetail: "下腹部雕刻王牌！由骨盆后倾带动下腹卷动，打造清晰人鱼线与下腹肌块。",
    tags: ["下腹雕刻", "人鱼线", "核心力量"],
    tips: {
      prep: "双手抓握单杠自然悬垂（或仰卧在垫上），沉肩保持背阔肌微收紧，身体不要晃动。",
      execution: "卷动骨盆将双腿向上抬起，想象将膝盖带向胸口。",
      peak: "顶峰卷腹紧缩腹肌1秒，控制身体不前后摆动。",
      negative: "缓慢下落双腿回到垂直位置。"
    },
    commonMistakes: ["靠身体剧烈前后荡秋千借力", "仅弯曲大腿而骨盆没有向上卷起"],
    substitutes: [
      { name: "绳索跪姿卷腹", reason: "负重抗阻增厚" },
      { name: "空中自行车卷腹", reason: "腹外斜肌与腹直肌协同" },
      { name: "俄罗斯转体", reason: "侧腹旋转" }
    ]
  },
  {
    id: "ex-cable-crunch",
    name: "绳索跪姿卷腹",
    englishName: "Cable Kneeling Crunch",
    category: "核心",
    target: "腹直肌整体 (增厚腹肌块)",
    secondaryMuscles: ["腹内外斜肌"],
    aliases: ["绳索卷腹", "跪姿卷腹", "滑轮卷腹", "负重卷腹", "腹肌块", "Cable Crunch"],
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
    commonMistakes: ["臀部大幅前后坐下，变成屈髋而不是卷腹", "手臂主动下拉绳索抢走腹部负荷"],
    substitutes: [
      { name: "悬垂举腿", reason: "下腹雕刻" },
      { name: "空中自行车卷腹", reason: "对角线高密度刺激" },
      { name: "俄罗斯转体", reason: "旋转抗阻" }
    ]
  },
  {
    id: "ex-bicycle-crunch",
    name: "空中自行车卷腹 (Bicycle Crunch)",
    englishName: "Bicycle Crunch",
    category: "核心",
    target: "腹直肌整体与腹内外斜肌 (极强肌电激活)",
    secondaryMuscles: ["髂腰肌", "髋屈肌"],
    aliases: ["空中自行车", "自行车卷腹", "对角卷腹", "腹外斜肌", "人鱼线卷腹", "Bicycle Crunch"],
    gifUrl: "./exercises/bicycle-crunch.gif",
    defaultSets: 3,
    defaultReps: "20-25",
    scienceDetail: "肌电图（EMG）测试中名列前茅的自重核心动作！同时结合了脊柱屈曲与对角线扭转，完美调动腹直肌与腹内外斜肌，打造如搓衣板般的紧致腹部。",
    tags: ["肌电冠军", "对角旋转", "搓衣板腹肌"],
    tips: {
      prep: "仰卧在瑜伽垫上，双手轻触耳旁（勿死扣颈椎），下背部紧贴地面，双腿屈膝悬空。",
      execution: "腹部发力抬起上背部，左膝向胸前收缩的同时，右手肘向左膝靠拢对角触碰，右腿伸直平展悬空。",
      peak: "在对角触碰点极力顶峰挤压腹斜肌1秒，随后平滑交替反向对侧。",
      negative: "动作全程下背部死贴垫面，避免腰椎悬空反弓。"
    },
    commonMistakes: ["双手抱头用力拽拉颈椎造成颈部劳损", "脚蹬得过快像踩轮子未充分扭转收缩"],
    substitutes: [
      { name: "死虫子核心抗伸展", reason: "零腰椎压力，护腰康复" },
      { name: "俄罗斯转体", reason: "旋转抗阻" }
    ]
  },
  {
    id: "ex-deadbug",
    name: "死虫子核心抗伸展 (Dead Bug)",
    englishName: "Dead Bug Core Stability",
    category: "核心",
    target: "腹横肌深层核心 / 骨盆与腰椎中立稳定",
    secondaryMuscles: ["腹直肌", "多裂肌", "盆底肌群"],
    aliases: ["死虫子", "死虫式", "死虫训练", "深层核心", "抗伸展", "护腰动作", "Dead Bug"],
    gifUrl: "./exercises/deadbug.gif",
    defaultSets: 3,
    defaultReps: "12-16",
    scienceDetail: "运动康复与竞技体育公认的深层核心王牌！通过对侧手脚伸展激活腹横肌，教会中枢神经在四肢运动中锁死腰椎中立位，彻底终结骨盆前倾与深蹲硬拉中的塌腰伤痛。",
    tags: ["深层核心", "护腰神技", "骨盆矫正"],
    tips: {
      prep: "仰卧屈膝屈髋90度（小腿平行地面），双臂垂直伸向天花板，后腰死死压紧垫面，吸气腹压内收。",
      execution: "保持后腰完全紧贴地面，对侧手臂（如左臂）向脑后平展下放，同时对侧腿（右腿）向前伸直伸展，脚跟悬空离地两指高。",
      peak: "在完全伸展端保持核心稳定1秒，注意力集中在腹横肌紧锁。",
      negative: "平稳收回起始位，交替另一侧进行。"
    },
    commonMistakes: ["腿下放时下背部弓起离开地面（骨盆前倾代偿）", "憋气未维持腹压呼吸"],
    substitutes: [
      { name: "悬垂举腿", reason: "下腹抗阻强化" },
      { name: "空中自行车卷腹", reason: "强化斜肌收缩" }
    ]
  },
  {
    id: "ex-russian-twist",
    name: "俄罗斯转体 (Russian Twist)",
    englishName: "Russian Twist",
    category: "核心",
    target: "腹内外斜肌 / 侧腹人鱼线与旋转核心",
    secondaryMuscles: ["腹直肌", "髋屈肌"],
    aliases: ["俄罗斯转体", "转体", "负重转体", "侧腹", "人鱼线训练", "Russian Twist"],
    gifUrl: "./exercises/russian-twist.gif",
    defaultSets: 3,
    defaultReps: "20",
    scienceDetail: "强化躯干旋转爆发力与抗旋转稳定性，雕刻清晰侧腹人鱼线与腹部侧面棱角。",
    tags: ["侧腹人鱼线", "旋转核心", "运动爆发力"],
    tips: {
      prep: "坐在垫上屈膝，脚跟轻触地面或微悬空，躯干后仰约45度，双手握拳或手持轻哑铃。",
      execution: "收紧核心，以腰腹为轴心向左右两侧交替旋转躯干，将手带到身体侧后方。",
      peak: "每次旋转到位时用力挤压侧腹肌群1秒。",
      negative: "平稳控制节奏，避免仅甩动手臂。"
    },
    commonMistakes: ["只转动手臂而躯干完全不动", "弓背驼背引起下背部不适"],
    substitutes: [
      { name: "空中自行车卷腹", reason: "仰卧无腰椎剪切力" },
      { name: "悬垂举腿", reason: "下腹部雕刻" }
    ]
  },
  {
    id: "ex-plank",
    name: "标准平板支撑 (Plank)",
    englishName: "Standard Forearm Plank",
    category: "核心",
    target: "腹横肌 / 整体躯干抗伸展核心柱",
    secondaryMuscles: ["腹直肌", "臀大肌", "前锯肌", "股四头肌"],
    aliases: ["平板支撑", "平板支承", "俯卧支撑", "抗伸展", "核心稳定", "Plank"],
    gifUrl: "./exercises/plank.gif",
    defaultSets: 3,
    defaultReps: "45-60秒",
    scienceDetail: "等长抗伸展核心力量的基石！强化腹横肌与躯干深层稳定链，教导神经系统在脊柱中立状态下维持高刚性腹压。",
    tags: ["等长收缩", "抗伸展", "护腰基石"],
    tips: {
      prep: "小臂贴地，手肘位于肩部正下方，双脚与髋同宽踩地，收紧腹部与臀部。",
      execution: "头、颈、胸、腰、臀、足呈一直线，骨盆微后倾锁死，腹肌如被重击般向内缩紧并保持深长呼吸。",
      peak: "持续对抗重力，不塌腰、不拱臀，保持45-60秒稳定。",
      negative: "力竭前膝盖轻触地面平稳退出，严禁塌腰退出砸地。"
    },
    commonMistakes: ["腰椎下塌出现严重超伸代偿压迫腰椎", "臀部抬得过高变成倒V字规避受力"],
    substitutes: [
      { name: "死虫子核心抗伸展", reason: "仰卧减载" },
      { name: "健腹轮推拉", reason: "高阶动态抗伸展" }
    ]
  },
  {
    id: "ex-ab-wheel",
    name: "健腹轮推拉 (Ab Wheel Rollout)",
    englishName: "Ab Wheel Rollout",
    category: "核心",
    target: "腹直肌全程离心超强抗伸展",
    secondaryMuscles: ["腹横肌", "背阔肌", "胸大肌", "三头肌长头"],
    aliases: ["健腹轮", "腹肌轮", "跪姿健腹轮", "轮子推拉", "滚轮", "Ab Wheel"],
    gifUrl: "./exercises/ab-wheel.gif",
    defaultSets: 3,
    defaultReps: "10-12",
    scienceDetail: "公认自重核心负荷天花板！超长力臂下的离心拉伸给予腹直肌与腹横肌毁灭性撕裂刺激，打造钢铁般的核心抗伸展刚性。",
    tags: ["离心拉伸", "核心天花板", "钢铁腹肌"],
    tips: {
      prep: "双膝跪地垫上，双手握紧健腹轮手柄位于肩下，骨盆微后倾，腹肌预先收紧含胸。",
      execution: "控制身体匀速向前滚动延展，保持臀部略微领先或与躯干同步，视线注视双手前方垫面。",
      peak: "在身体接近贴地但腰部不塌陷的极限点停顿半秒，感受腹肌被极度拉伸紧绷。",
      negative: "腹肌与背阔肌协同收缩发力，将身体如弹簧般拉回原位，严禁撅屁股往回坐。"
    },
    commonMistakes: ["推远后腰部凹陷塌腰导致腰椎剧痛", "拉回时仅用臀部往后坐而腹部完全脱力"],
    substitutes: [
      { name: "标准平板支撑", reason: "静态基础强化" },
      { name: "绳索跪姿卷腹", reason: "更易控负荷" }
    ]
  },
  {
    id: "ex-side-plank",
    name: "侧平板支撑 (Side Plank)",
    englishName: "Side Plank",
    category: "核心",
    target: "腹内外斜肌 / 腰方肌侧向抗侧屈稳定",
    secondaryMuscles: ["臀中肌", "肩袖稳定群"],
    aliases: ["侧平板", "侧身支撑", "侧桥", "抗侧屈", "腰方肌", "Side Plank"],
    gifUrl: "./exercises/side-plank.gif",
    defaultSets: 3,
    defaultReps: "30-45秒/侧",
    scienceDetail: "麦吉尔核心大三元（McGill Big 3）核心动作之一！针对腰方肌与腹外斜肌提供极高抗侧屈稳定，对预防深蹲腰部侧扭和保护下背有无可替代的生物力学价值。",
    tags: ["麦吉尔三元", "抗侧屈", "腰方肌强化"],
    tips: {
      prep: "侧卧于垫上，单肘支撑地面于肩正下方，双脚交叠或前后并拢。",
      execution: "核心与侧腹发力抬起髋部，使头、脊椎、骨盆、踝关节形成侧面直线。",
      peak: "上方手臂可叉腰或垂直指天，保持侧腹与臀中肌持续等长收紧30-45秒。",
      negative: "缓慢下放髋部，换另一侧进行。"
    },
    commonMistakes: ["骨盆前后旋转扭曲，未保持侧向冠状面中立", "髋部下垂失去支撑直线"],
    substitutes: [
      { name: "俄罗斯转体", reason: "动态旋转强化" },
      { name: "标准平板支撑", reason: "正向抗伸展" }
    ]
  },
  {
    id: "ex-pallof-press",
    name: "帕洛夫推举 (绳索抗旋转)",
    englishName: "Pallof Press",
    category: "核心",
    target: "腹横肌与腹内外斜肌 (黄金抗旋转稳定性/深蹲硬拉钢筋躯干)",
    secondaryMuscles: ["臀中肌", "肩袖稳定群", "多裂肌"],
    aliases: ["帕洛夫推", "抗旋转推举", "绳索抗旋转", "Pallof Press", "核心抗扭"],
    gifUrl: "./exercises/plank.gif",
    defaultSets: 3,
    defaultReps: "10-12次/侧",
    scienceDetail: "物理治疗与顶级竞技体育公认的抗旋转金标准！核心的本质功能首先是『抗移动』（抗屈曲、抗侧屈、抗旋转）以传递力量并保护脊椎。帕洛夫推举通过侧向拉力制造持续旋转力矩，迫使深层腹横肌与内外斜肌以等长收缩进行对抗，是根除下背疼痛、大幅提升大重量深蹲稳定性的定海神针。",
    tags: ["抗旋转", "金标准", "深层核心", "脊柱护甲"],
    tips: {
      prep: "站立垂直于龙门架侧方，滑轮调至胸部高度，双脚与肩同宽微屈膝，双手合握D型单把抱于胸前正中。",
      execution: "核心如铁桶般收紧，双手沿胸口水平笔直向前推起，将手臂伸直。",
      peak: "在手臂完全伸直的最长力臂端点，死死抵抗侧向旋转拉力，保持躯干正对前方完全静止2秒。",
      negative: "缓慢控制手部原路收回至胸前，过程中躯干绝不允许发生一丝旋转扭动。",
      breathing: "向前推出抵抗时紧绷核心短促呼气，收回时吸气。"
    },
    commonMistakes: [
      "身体向滑轮方向扭转发生躯干旋转（抗旋转失败）",
      "骨盆发生倾斜，双脚未扎实踩地借力"
    ],
    substitutes: [
      { name: "俄罗斯转体", reason: "动态旋转做工" },
      { name: "侧平板支撑 (Side Plank)", reason: "侧向抗侧屈支撑" }
    ]
  },
  {
    id: "ex-bird-dog",
    name: "鸟狗式 (对角线伸展)",
    englishName: "Bird Dog",
    category: "核心",
    target: "多裂肌与竖脊肌深层 (麦吉尔大三元/下背康复与脊柱微稳)",
    secondaryMuscles: ["臀大肌", "三角肌后束", "腹横肌"],
    aliases: ["鸟狗", "对角伸展", "四足对角伸展", "麦吉尔鸟狗", "Bird Dog"],
    gifUrl: "./exercises/deadbug.gif",
    defaultSets: 3,
    defaultReps: "10-12次/侧",
    scienceDetail: "世界脊柱权威斯图尔特·麦吉尔（Stuart McGill）教授的核心大三元王牌！在四足支撑姿态下进行对角线上肢与下肢的对向伸展，能以几乎为零的椎间盘轴向压力（近乎零剪切力），激活腰椎深层微小稳定肌（多裂肌 Multifidus）和臀大肌，是久坐腰酸与大重量训练后脊椎自愈的终极动作。",
    tags: ["麦吉尔三元", "零腰椎压力", "脊柱微稳", "下背康复"],
    tips: {
      prep: "四足跪姿于垫上，双手置于双肩正下方，双膝位于双髋正下方，脊柱维持天然生理中立弧度，不塌腰不拱背。",
      execution: "核心深层腹横肌收紧，对角线的一侧手臂与另一侧大腿同时平稳向前后两个方向伸展拉长。",
      peak: "伸展至手臂、躯干、后腿呈水平一条线，臀部用力收缩夹紧，顶端静止保持2秒，避免骨盆侧倾翻转。",
      negative: "极度缓慢平稳收回至原位或肘膝轻触，换对角线另一侧重复。",
      breathing: "向外伸展时平稳呼气，收回触碰时吸气。"
    },
    commonMistakes: [
      "抬腿过高导致腰椎过度反弓塌腰",
      "骨盆向单侧大幅倾斜失衡"
    ],
    substitutes: [
      { name: "死虫子 (Deadbug)", reason: "仰卧位抗伸展与深层腹横肌" },
      { name: "标准平板支撑", reason: "静态俯卧抗伸展" }
    ]
  },
  {
    id: "ex-windshield-wipers",
    name: "悬垂雨刷摆腿",
    englishName: "Hanging Windshield Wipers",
    category: "核心",
    target: "腹内外斜肌与腹直肌下部 (高阶体操旋转控制/刀刻鲨鱼线)",
    secondaryMuscles: ["前臂握力", "背阔肌", "髂腰肌"],
    aliases: ["雨刷器", "悬垂雨刷", "雨刷摆腿", "单杠雨刷", "Windshield Wipers"],
    gifUrl: "./exercises/hanging-leg-raise.gif",
    defaultSets: 3,
    defaultReps: "8-10次/侧",
    scienceDetail: "街健与体操体系中的高阶腹部终极考核！双腿垂直举起呈“L”或倒立“V”字，如雨刷般在空中做扇形横向摆动。这种结合了极强悬垂抗伸展与大范围额状面旋转的动作，能赋予腹内外斜肌和前锯肌（鲨鱼线）最强烈的撕裂感与神经募集。",
    tags: ["高阶街健", "立体鲨鱼线", "侧腹撕裂", "高阶核心"],
    tips: {
      prep: "双手双手正握单杠悬垂，沉肩锁死背阔肌，先通过骨盆后倾将双腿伸直高高举起至与躯干成90度（进阶可垂直指天）。",
      execution: "双腿并拢伸直，受控向左侧下方缓慢旋转摆动至约45度，感受右侧腹部被极度拉伸扯紧。",
      peak: "依靠侧腹与下腹的强大向心力量，将双腿沿弧线拉回正中，再顺势向右侧平稳摆动。",
      negative: "全程双腿摆动如机械指针般精确匀速，严禁靠甩荡惯性摆动。",
      breathing: "双腿回中时用力吐气，下落侧摆离心时深吸气。"
    },
    commonMistakes: [
      "身体剧烈前后晃动借用秋千惯性",
      "手腕松脱或沉肩失败导致背阔肌脱力摇晃"
    ],
    substitutes: [
      { name: "悬垂举腿 / 仰卧举腿", reason: "常规悬垂下腹基础" },
      { name: "空中自行车卷腹 (Bicycle Crunch)", reason: "仰卧安全对角旋转" }
    ]
  }
];

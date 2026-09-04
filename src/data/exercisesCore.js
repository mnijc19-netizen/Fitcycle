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
  }
];

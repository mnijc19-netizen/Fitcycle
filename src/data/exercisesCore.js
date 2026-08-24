export const CORE_EXERCISES = [
  {
    id: "ex-hanging-leg-raise",
    name: "悬垂举腿 / 仰卧举腿",
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
      prep: "双手抓握单杠自然悬垂（或仰卧在垫上），沉肩保持背阔肌微收紧，身体不要晃动。",
      execution: "卷动骨盆将双腿向上抬起，想象将膝盖带向胸口。",
      peak: "顶峰卷腹紧缩腹肌1秒，控制身体不前后摆动。",
      negative: "缓慢下落双腿回到垂直位置。"
    },
    commonMistakes: ["靠身体剧烈前后荡秋千借力", "仅弯曲大腿而骨盆没有向上卷起"],
    substitutes: [
      { name: "绳索跪姿卷腹", reason: "负重抗阻增厚" },
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
      { name: "俄罗斯转体", reason: "旋转抗阻" }
    ]
  },
  {
    id: "ex-russian-twist",
    name: "俄罗斯转体 (Russian Twist)",
    englishName: "Russian Twist",
    category: "核心",
    target: "腹内外斜肌 / 侧腹人鱼线与旋转核心",
    secondaryMuscles: ["腹直肌", "髋屈肌"],
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
      { name: "悬垂举腿", reason: "下腹部雕刻" },
      { name: "绳索跪姿卷腹", reason: "抗阻增厚" }
    ]
  }
];

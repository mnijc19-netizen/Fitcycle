/**
 * FitCycle Scientific Workout Splits & Periodization Templates Registry
 * 5 Classical Evidence-Based Split Architectures:
 * 1. PPL+R (Push-Pull-Legs-Rest 4-Day Golden Split)
 * 2. PHUL (Power Hypertrophy Upper Lower 4-Day Split)
 * 3. Arnold Split (Chest/Back, Shoulders/Arms, Legs 6-Day Golden Era)
 * 4. Wendler 5/3/1 (Strength Periodization Wave Progression)
 * 5. Full Body 3-Day (Beginner / Minimalist Fatigue Management)
 */

export const TRAINING_TEMPLATES = [
  {
    id: "template-ppl",
    name: "推拉腿休 4日黄金分化 (PPL+Rest)",
    badge: "增肌黄金标准",
    category: "经典健美肥大",
    frequency: "每 4 天一轮 · 每周 5-6 练",
    cycleDaysCount: 4,
    description: "运动科学公认最高效肌肥大分化：彻底砍掉无用功，聚焦肌肉拉伸区肥大与 72h 中枢神经超量恢复。",
    highlights: [
      "单日专注推/拉/腿单一发力动力链",
      "每块大肌群获得充分的 72h 超量恢复窗口",
      "推拉腿后安排 1 天完全休息日，杜绝 CNS 中枢神经疲劳蓄积"
    ],
    cycle: {
      id: "cycle-pplr-4",
      name: "推拉腿休 4日黄金分化",
      description: "聚焦拉伸区肥大与充分超量恢复黄金周期",
      days: [
        { id: "cd-ppl-1", name: "Day 1: 推日 (Push)", shortName: "推", planId: "plan-push", color: "amber", isRest: false },
        { id: "cd-ppl-2", name: "Day 2: 拉日 (Pull)", shortName: "拉", planId: "plan-pull", color: "sky", isRest: false },
        { id: "cd-ppl-3", name: "Day 3: 腿日 (Legs)", shortName: "腿", planId: "plan-legs", color: "purple", isRest: false },
        { id: "cd-ppl-4", name: "Day 4: 完全休息 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true }
      ]
    },
    plans: [
      {
        id: "plan-push",
        name: "推日 (Push) —— 打造铠甲胸与加宽肩膀",
        shortName: "推日",
        category: "推",
        color: "amber",
        coreTarget: "上胸饱满、锁骨端增厚、拓宽肩峰与三头做工",
        isRest: false,
        exercises: [
          { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", setsCount: 3, targetReps: "8-10次", defaultWeight: 20 },
          { exerciseId: "ex-machine-chest-press", name: "固定器械推胸", setsCount: 3, targetReps: "10-12次", defaultWeight: 45 },
          { exerciseId: "ex-cable-lateral-raise", name: "绳索侧平举", setsCount: 3, targetReps: "12-15次", defaultWeight: 7.5 },
          { exerciseId: "ex-overhead-cable-ext", name: "过头绳索臂屈伸", setsCount: 3, targetReps: "12-15次", defaultWeight: 15 }
        ]
      },
      {
        id: "plan-pull",
        name: "拉日 (Pull) —— 拓宽V字腰身与3D饱满度",
        shortName: "拉日",
        category: "拉",
        color: "sky",
        coreTarget: "背阔肌宽度、上背厚度与二头肌长头峰值",
        isRest: false,
        exercises: [
          { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", setsCount: 3, targetReps: "10-12次", defaultWeight: 45 },
          { exerciseId: "ex-seated-cable-row", name: "坐姿绳索划船", setsCount: 3, targetReps: "10-12次", defaultWeight: 40 },
          { exerciseId: "ex-incline-db-curl", name: "上斜哑铃弯举", setsCount: 3, targetReps: "10-12次", defaultWeight: 10 },
          { exerciseId: "ex-face-pull", name: "绳索面拉 (Face Pull)", setsCount: 3, targetReps: "12-15次", defaultWeight: 15 }
        ]
      },
      {
        id: "plan-legs",
        name: "腿日 (Legs) —— 黄金比例的隐形支柱",
        shortName: "腿日",
        category: "腿",
        color: "purple",
        coreTarget: "股四头肌分离度、腘绳肌拉伸与稳定核心",
        isRest: false,
        exercises: [
          { exerciseId: "ex-hack-squat", name: "哈克深蹲 / 倒蹬腿举", setsCount: 3, targetReps: "8-12次", defaultWeight: 60 },
          { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", setsCount: 3, targetReps: "10-12次", defaultWeight: 50 },
          { exerciseId: "ex-seated-leg-curl", name: "俯卧器械腿弯举 (Lying Leg Curl)", setsCount: 3, targetReps: "12-15次", defaultWeight: 35 },
          { exerciseId: "ex-calf-raise", name: "站姿/坐姿提踵", setsCount: 3, targetReps: "15-20次", defaultWeight: 40 }
        ]
      },
      {
        id: "plan-rest",
        name: "完全休息 (Rest) —— 超量恢复与神经修复",
        shortName: "休息",
        category: "休",
        color: "emerald",
        coreTarget: "7-8小时高质量睡眠，机体肌原纤维超量合成，0战力扣分安全期",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "template-phul",
    name: "PHUL 上下肢 4日力量/肥大分化",
    badge: "力量健美双修",
    category: "力量肥大综合",
    frequency: "每 6 天一轮 · 每周 4 练",
    cycleDaysCount: 6,
    description: "经典 PHUL (Power Hypertrophy Upper Lower) 体系：周前半段专注大重量复合动作爆发做工，周后半段专注高容量孤立充血拉伸。",
    highlights: [
      "大重量神经募集与肌浆网肥大无缝兼顾",
      "每周每大肌群刺激 2 次，频次理想",
      "适合训练 6 个月以上渴望突破力量瓶颈的老铁"
    ],
    cycle: {
      id: "cycle-phul-6",
      name: "PHUL 上下肢 4日力量/肥大分化",
      description: "前两日重载力量爆发，后两日高容量充血肥大",
      days: [
        { id: "cd-phul-1", name: "Day 1: 上肢力量 (Upper Power)", shortName: "上力", planId: "plan-upper-power", color: "sky", isRest: false },
        { id: "cd-phul-2", name: "Day 2: 下肢力量 (Lower Power)", shortName: "下力", planId: "plan-lower-power", color: "purple", isRest: false },
        { id: "cd-phul-3", name: "Day 3: 中休恢复 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true },
        { id: "cd-phul-4", name: "Day 4: 上肢肥大 (Upper Hypertrophy)", shortName: "上肥", planId: "plan-upper-hyper", color: "amber", isRest: false },
        { id: "cd-phul-5", name: "Day 5: 下肢肥大 (Lower Hypertrophy)", shortName: "下肥", planId: "plan-lower-hyper", color: "purple", isRest: false },
        { id: "cd-phul-6", name: "Day 6: 周末完全休息 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true }
      ]
    },
    plans: [
      {
        id: "plan-upper-power",
        name: "上肢力量日 (Upper Power) —— 重载复合",
        shortName: "上肢力量",
        category: "上肢",
        color: "sky",
        coreTarget: "大重量杠铃卧推、俯身划船，强化上肢核心力量架构",
        isRest: false,
        exercises: [
          { exerciseId: "ex-flat-bb-bench", name: "平板杠铃卧推", setsCount: 4, targetReps: "5-6次", defaultWeight: 60 },
          { exerciseId: "ex-barbell-bent-over-row", name: "俯身杠铃划船 (Barbell Row)", setsCount: 4, targetReps: "5-6次", defaultWeight: 50 },
          { exerciseId: "ex-seated-dumbbell-shoulder-press", name: "坐姿哑铃推肩", setsCount: 3, targetReps: "6-8次", defaultWeight: 22 },
          { exerciseId: "ex-barbell-curl", name: "站姿杠铃弯举 (Barbell Curl)", setsCount: 3, targetReps: "6-8次", defaultWeight: 25 }
        ]
      },
      {
        id: "plan-lower-power",
        name: "下肢力量日 (Lower Power) —— 爆发力底盘",
        shortName: "下肢力量",
        category: "下肢",
        color: "purple",
        coreTarget: "深蹲与罗马尼亚硬拉大重量突破，强化下肢链条",
        isRest: false,
        exercises: [
          { exerciseId: "ex-barbell-squat", name: "杠铃后深蹲 (Back Squat)", setsCount: 4, targetReps: "5-6次", defaultWeight: 80 },
          { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", setsCount: 4, targetReps: "5-6次", defaultWeight: 70 },
          { exerciseId: "ex-leg-extension", name: "器械腿屈伸 (踢腿机)", setsCount: 3, targetReps: "8-10次", defaultWeight: 45 },
          { exerciseId: "ex-calf-raise", name: "站姿/坐姿提踵", setsCount: 4, targetReps: "8-10次", defaultWeight: 50 }
        ]
      },
      {
        id: "plan-upper-hyper",
        name: "上肢肥大日 (Upper Hypertrophy) —— 充血拉伸",
        shortName: "上肢肥大",
        category: "上肢",
        color: "amber",
        coreTarget: "上斜角度推举、高位下拉与侧平举，极限充血膨胀",
        isRest: false,
        exercises: [
          { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", setsCount: 3, targetReps: "8-12次", defaultWeight: 20 },
          { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", setsCount: 3, targetReps: "10-12次", defaultWeight: 45 },
          { exerciseId: "ex-cable-lateral-raise", name: "绳索侧平举", setsCount: 4, targetReps: "12-15次", defaultWeight: 7.5 },
          { exerciseId: "ex-incline-db-curl", name: "上斜哑铃弯举", setsCount: 3, targetReps: "10-12次", defaultWeight: 10 }
        ]
      },
      {
        id: "plan-lower-hyper",
        name: "下肢肥大日 (Lower Hypertrophy) —— 泵感雕刻",
        shortName: "下肢肥大",
        category: "下肢",
        color: "purple",
        coreTarget: "倒蹬推举与腿弯举孤立做工，雕刻腿部线条与核心",
        isRest: false,
        exercises: [
          { exerciseId: "ex-hack-squat", name: "哈克深蹲 / 倒蹬腿举", setsCount: 4, targetReps: "10-12次", defaultWeight: 60 },
          { exerciseId: "ex-seated-leg-curl", name: "俯卧器械腿弯举 (Lying Leg Curl)", setsCount: 4, targetReps: "12-15次", defaultWeight: 35 },
          { exerciseId: "ex-bulgarian-split-squat", name: "哑铃保加利亚分腿蹲", setsCount: 3, targetReps: "10-12次", defaultWeight: 12 },
          { exerciseId: "ex-hanging-leg-raise", name: "悬垂举腿 / 仰卧举腿", setsCount: 3, targetReps: "15-20次", defaultWeight: 0 }
        ]
      },
      {
        id: "plan-rest",
        name: "完全休息 (Rest) —— 超量恢复与神经修复",
        shortName: "休息",
        category: "休",
        color: "emerald",
        coreTarget: "充足睡眠与营养补充，让中枢神经与肌肉纤维充分超量重组",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "template-arnold",
    name: "阿诺德 6日古典黄金分化 (Arnold Split)",
    badge: "古典健美巅峰",
    category: "高阶高频健美",
    frequency: "每 7 天一轮 · 每周 6 练 1 休",
    cycleDaysCount: 7,
    description: "阿诺德·施瓦辛格夺得奥林匹亚先生时的经典分化：胸背拮抗肌超级组轰炸、肩臂独立专注日，打造古典倒三角宽肩细腰。",
    highlights: [
      "胸背对抗日：利用拮抗肌充血原理，上身膨胀泵感登峰造极",
      "独立肩臂日：彻底解决推拉日后三头二头疲劳无力的痛点",
      "适合训练 1 年以上、体能储备充足的高阶严肃健美爱好者"
    ],
    cycle: {
      id: "cycle-arnold-7",
      name: "阿诺德 6日古典分化",
      description: "胸背、肩臂、腿部轮转高频双循环",
      days: [
        { id: "cd-arnold-1", name: "Day 1: 胸背拮抗 (Chest & Back)", shortName: "胸背", planId: "plan-arnold-cb", color: "amber", isRest: false },
        { id: "cd-arnold-2", name: "Day 2: 肩臂雕刻 (Shoulders & Arms)", shortName: "肩臂", planId: "plan-arnold-sa", color: "sky", isRest: false },
        { id: "cd-arnold-3", name: "Day 3: 腿部核心 (Legs)", shortName: "腿部", planId: "plan-arnold-legs", color: "purple", isRest: false },
        { id: "cd-arnold-4", name: "Day 4: 胸背充血 (Chest & Back)", shortName: "胸背", planId: "plan-arnold-cb", color: "amber", isRest: false },
        { id: "cd-arnold-5", name: "Day 5: 肩臂充血 (Shoulders & Arms)", shortName: "肩臂", planId: "plan-arnold-sa", color: "sky", isRest: false },
        { id: "cd-arnold-6", name: "Day 6: 腿部做工 (Legs)", shortName: "腿部", planId: "plan-arnold-legs", color: "purple", isRest: false },
        { id: "cd-arnold-7", name: "Day 7: 完全休息 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true }
      ]
    },
    plans: [
      {
        id: "plan-arnold-cb",
        name: "胸背对抗日 (Chest & Back) —— 打造倒三角铠甲",
        shortName: "胸背日",
        category: "胸背",
        color: "amber",
        coreTarget: "平板卧推与高位下拉超级组泵感，对抗肌同步充血",
        isRest: false,
        exercises: [
          { exerciseId: "ex-flat-bb-bench", name: "平板杠铃卧推", setsCount: 4, targetReps: "8-10次", defaultWeight: 60 },
          { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", setsCount: 4, targetReps: "8-10次", defaultWeight: 45 },
          { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", setsCount: 3, targetReps: "10-12次", defaultWeight: 20 },
          { exerciseId: "ex-seated-cable-row", name: "坐姿绳索划船", setsCount: 3, targetReps: "10-12次", defaultWeight: 40 }
        ]
      },
      {
        id: "plan-arnold-sa",
        name: "肩臂独立日 (Shoulders & Arms) —— 3D球形肩与麒麟臂",
        shortName: "肩臂日",
        category: "肩臂",
        color: "sky",
        coreTarget: "大重量推举、侧平举轰炸三角肌，三头二头超级组膨胀",
        isRest: false,
        exercises: [
          { exerciseId: "ex-seated-dumbbell-shoulder-press", name: "坐姿哑铃推肩", setsCount: 4, targetReps: "8-10次", defaultWeight: 20 },
          { exerciseId: "ex-cable-lateral-raise", name: "绳索侧平举", setsCount: 4, targetReps: "12-15次", defaultWeight: 7.5 },
          { exerciseId: "ex-incline-db-curl", name: "上斜哑铃弯举", setsCount: 3, targetReps: "10-12次", defaultWeight: 10 },
          { exerciseId: "ex-overhead-cable-ext", name: "过头绳索臂屈伸", setsCount: 3, targetReps: "10-12次", defaultWeight: 15 }
        ]
      },
      {
        id: "plan-arnold-legs",
        name: "腿部与核心 (Legs & Abs) —— 黄金底盘做工",
        shortName: "腿部日",
        category: "腿",
        color: "purple",
        coreTarget: "深蹲与罗马尼亚硬拉复合做工，强化核心与股四头肌",
        isRest: false,
        exercises: [
          { exerciseId: "ex-barbell-squat", name: "杠铃后深蹲 (Back Squat)", setsCount: 4, targetReps: "8-10次", defaultWeight: 75 },
          { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", setsCount: 3, targetReps: "10-12次", defaultWeight: 55 },
          { exerciseId: "ex-seated-leg-curl", name: "俯卧器械腿弯举 (Lying Leg Curl)", setsCount: 3, targetReps: "12-15次", defaultWeight: 35 },
          { exerciseId: "ex-hanging-leg-raise", name: "悬垂举腿 / 仰卧举腿", setsCount: 3, targetReps: "15-20次", defaultWeight: 0 }
        ]
      },
      {
        id: "plan-rest",
        name: "完全休息 (Rest) —— 超量恢复与神经修复",
        shortName: "休息",
        category: "休",
        color: "emerald",
        coreTarget: "中枢神经充分修复，肌肉蛋白质超量合成",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "template-531",
    name: "Wendler 5/3/1 力量周期律模板",
    badge: "力量举周期律",
    category: "纯力量举进阶",
    frequency: "每 6 天一轮 · 每周 4 练 2 休",
    cycleDaysCount: 6,
    description: "力量举大师 Jim Wendler 创立的波浪式渐进超负荷周期律：四大核心复合项（深蹲/卧推/硬拉/推举）按 5/3/1 比例递增，辅以 BBB (Boring But Big) 肥大组。",
    highlights: [
      "单日围绕单一核心大项展开，精力高度聚焦",
      "以 90% 1RM 作为训练重量计算基准，防劳损防受伤",
      "极其严谨的科学波浪进阶，杜绝任何凭感觉乱上的瓶颈期"
    ],
    cycle: {
      id: "cycle-531-6",
      name: "Wendler 5/3/1 力量周期分化",
      description: "四大项轮转周期：深蹲、卧推、硬拉、推举专注做工",
      days: [
        { id: "cd-531-1", name: "Day 1: 深蹲核心日 (Squat 5/3/1)", shortName: "深蹲", planId: "plan-531-squat", color: "purple", isRest: false },
        { id: "cd-531-2", name: "Day 2: 卧推核心日 (Bench 5/3/1)", shortName: "卧推", planId: "plan-531-bench", color: "amber", isRest: false },
        { id: "cd-531-3", name: "Day 3: 中休调整 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true },
        { id: "cd-531-4", name: "Day 4: 硬拉核心日 (Deadlift 5/3/1)", shortName: "硬拉", planId: "plan-531-deadlift", color: "purple", isRest: false },
        { id: "cd-531-5", name: "Day 5: 推举核心日 (Press 5/3/1)", shortName: "推举", planId: "plan-531-press", color: "sky", isRest: false },
        { id: "cd-531-6", name: "Day 6: 周末完全休息 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true }
      ]
    },
    plans: [
      {
        id: "plan-531-squat",
        name: "5/3/1 深蹲核心日 —— 下肢力量中枢",
        shortName: "深蹲日",
        category: "腿",
        color: "purple",
        coreTarget: "杠铃后深蹲 5/3/1 核心金字塔，搭配倒蹬辅助容量",
        isRest: false,
        exercises: [
          { exerciseId: "ex-barbell-squat", name: "杠铃后深蹲 (Back Squat)", setsCount: 3, targetReps: "5/3/1核心组", defaultWeight: 85 },
          { exerciseId: "ex-hack-squat", name: "哈克深蹲 / 倒蹬腿举", setsCount: 4, targetReps: "10-12次 (BBB辅项)", defaultWeight: 60 },
          { exerciseId: "ex-hanging-leg-raise", name: "悬垂举腿 / 仰卧举腿", setsCount: 3, targetReps: "15-20次", defaultWeight: 0 }
        ]
      },
      {
        id: "plan-531-bench",
        name: "5/3/1 卧推核心日 —— 上肢推力基石",
        shortName: "卧推日",
        category: "推",
        color: "amber",
        coreTarget: "平板卧推 5/3/1 核心组，辅以哑铃卧推与器械三头下压做工",
        isRest: false,
        exercises: [
          { exerciseId: "ex-flat-bb-bench", name: "平板杠铃卧推", setsCount: 3, targetReps: "5/3/1核心组", defaultWeight: 65 },
          { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", setsCount: 4, targetReps: "10-12次 (BBB辅项)", defaultWeight: 20 },
          { exerciseId: "ex-machine-seated-dip", name: "固定器械坐姿三头下压 (Seated Dip)", setsCount: 4, targetReps: "10-12次", defaultWeight: 40 }
        ]
      },
      {
        id: "plan-531-deadlift",
        name: "5/3/1 硬拉核心日 —— 全身后侧链爆发",
        shortName: "硬拉日",
        category: "拉",
        color: "purple",
        coreTarget: "传统杠铃硬拉 5/3/1 极限做工，辅以罗马尼亚硬拉与腿弯举",
        isRest: false,
        exercises: [
          { exerciseId: "ex-deadlift", name: "传统杠铃硬拉", setsCount: 3, targetReps: "5/3/1核心组", defaultWeight: 90 },
          { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", setsCount: 4, targetReps: "10-12次 (BBB辅项)", defaultWeight: 50 },
          { exerciseId: "ex-seated-leg-curl", name: "俯卧器械腿弯举 (Lying Leg Curl)", setsCount: 3, targetReps: "12-15次", defaultWeight: 35 }
        ]
      },
      {
        id: "plan-531-press",
        name: "5/3/1 推举核心日 —— 站姿垂直做工",
        shortName: "推举日",
        category: "推",
        color: "sky",
        coreTarget: "站姿杠铃推举 5/3/1 核心做工，辅以哑铃推肩与器械侧平举",
        isRest: false,
        exercises: [
          { exerciseId: "ex-overhead-barbell-press", name: "站姿杠铃推举 (Overhead Press)", setsCount: 3, targetReps: "5/3/1核心组", defaultWeight: 40 },
          { exerciseId: "ex-seated-dumbbell-shoulder-press", name: "坐姿哑铃推肩", setsCount: 4, targetReps: "10-12次 (BBB辅项)", defaultWeight: 18 },
          { exerciseId: "ex-machine-lateral-raise", name: "固定器械坐姿侧平举 (Machine Lateral Raise)", setsCount: 4, targetReps: "12-15次", defaultWeight: 25 }
        ]
      },
      {
        id: "plan-rest",
        name: "完全休息 (Rest) —— 超量恢复与神经修复",
        shortName: "休息",
        category: "休",
        color: "emerald",
        coreTarget: "充足睡眠与营养补充，让中枢神经与肌肉纤维充分超量重组",
        isRest: true,
        exercises: []
      }
    ]
  },
  {
    id: "template-fullbody",
    name: "新手全身 3日极简复合循环 (Full Body)",
    badge: "新手极速入门",
    category: "基础极简循序",
    frequency: "每 6 天一轮 · 练一休一",
    cycleDaysCount: 6,
    description: "最适合健身新手、上班族与忙碌人士的科学入门计划：每次训练精选 3~4 个高收益大肌群复合动作，全身协调激活，疲劳极低，无劝退门槛。",
    highlights: [
      "告别繁琐动作，每次只练 3~4 个黄金动作，40 分钟搞定",
      "练一天休一天，身体不酸痛，中枢神经完全零负担",
      "30 天建立牢固的动作模式与运动习惯"
    ],
    cycle: {
      id: "cycle-fullbody-6",
      name: "新手全身 3日练一休一循环",
      description: "全身轮转交替，极低疲劳，极速上手",
      days: [
        { id: "cd-fb-1", name: "Day 1: 全身 A (复合深蹲推拉)", shortName: "全A", planId: "plan-fb-a", color: "amber", isRest: false },
        { id: "cd-fb-2", name: "Day 2: 休息恢复 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true },
        { id: "cd-fb-3", name: "Day 3: 全身 B (后侧链与推举)", shortName: "全B", planId: "plan-fb-b", color: "sky", isRest: false },
        { id: "cd-fb-4", name: "Day 4: 休息恢复 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true },
        { id: "cd-fb-5", name: "Day 5: 全身 C (腿胸背泵感)", shortName: "全C", planId: "plan-fb-c", color: "purple", isRest: false },
        { id: "cd-fb-6", name: "Day 6: 周末完全休息 (Rest)", shortName: "休", planId: "plan-rest", color: "emerald", isRest: true }
      ]
    },
    plans: [
      {
        id: "plan-fb-a",
        name: "全身 A (复合深蹲推拉) —— 核心基础",
        shortName: "全 A",
        category: "全身",
        color: "amber",
        coreTarget: "深蹲、推胸与背部拉伸基础复合动作",
        isRest: false,
        exercises: [
          { exerciseId: "ex-machine-chest-press", name: "固定器械推胸", setsCount: 3, targetReps: "10-12次", defaultWeight: 35 },
          { exerciseId: "ex-hack-squat", name: "哈克深蹲 / 倒蹬腿举", setsCount: 3, targetReps: "10-12次", defaultWeight: 50 },
          { exerciseId: "ex-lat-pulldown", name: "对握/宽握高位下拉", setsCount: 3, targetReps: "10-12次", defaultWeight: 40 },
          { exerciseId: "ex-hanging-leg-raise", name: "悬垂举腿 / 仰卧举腿", setsCount: 3, targetReps: "12-15次", defaultWeight: 0 }
        ]
      },
      {
        id: "plan-fb-b",
        name: "全身 B (后侧链与推举) —— 姿态矫正",
        shortName: "全 B",
        category: "全身",
        color: "sky",
        coreTarget: "臀腿后侧链、肩部推举与上背划船",
        isRest: false,
        exercises: [
          { exerciseId: "ex-rdl", name: "罗马尼亚硬拉 (RDL)", setsCount: 3, targetReps: "10-12次", defaultWeight: 40 },
          { exerciseId: "ex-seated-dumbbell-shoulder-press", name: "坐姿哑铃推肩", setsCount: 3, targetReps: "10-12次", defaultWeight: 14 },
          { exerciseId: "ex-seated-cable-row", name: "坐姿绳索划船", setsCount: 3, targetReps: "10-12次", defaultWeight: 35 },
          { exerciseId: "ex-cable-lateral-raise", name: "绳索侧平举", setsCount: 3, targetReps: "12-15次", defaultWeight: 5 }
        ]
      },
      {
        id: "plan-fb-c",
        name: "全身 C (腿胸背泵感) —— 协调充血",
        shortName: "全 C",
        category: "全身",
        color: "purple",
        coreTarget: "上斜胸大肌、腿屈伸与后束面拉",
        isRest: false,
        exercises: [
          { exerciseId: "ex-incline-db-bench", name: "上斜哑铃卧推", setsCount: 3, targetReps: "10-12次", defaultWeight: 16 },
          { exerciseId: "ex-leg-extension", name: "器械腿屈伸 (踢腿机)", setsCount: 3, targetReps: "12-15次", defaultWeight: 35 },
          { exerciseId: "ex-face-pull", name: "绳索面拉 (Face Pull)", setsCount: 3, targetReps: "12-15次", defaultWeight: 12 },
          { exerciseId: "ex-incline-db-curl", name: "上斜哑铃弯举", setsCount: 3, targetReps: "10-12次", defaultWeight: 8 }
        ]
      },
      {
        id: "plan-rest",
        name: "完全休息 (Rest) —— 超量恢复与神经修复",
        shortName: "休息",
        category: "休",
        color: "emerald",
        coreTarget: "7-8小时充足睡眠，机体组织修复充能",
        isRest: true,
        exercises: []
      }
    ]
  }
];

/**
 * Finds a template by its ID
 * @param {string} id 
 * @returns {Object|null}
 */
export function getTrainingTemplateById(id) {
  return TRAINING_TEMPLATES.find(t => t.id === id) || null;
}

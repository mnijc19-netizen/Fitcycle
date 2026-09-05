export const CARDIO_EXERCISES = [
  {
    id: "ex-cardio-treadmill",
    name: "跑步机慢跑/坡度走",
    englishName: "Treadmill Run / Incline Walk",
    category: "有氧",
    target: "心肺耐力 / 纯脂肪供能 / 激活下肢循环",
    secondaryMuscles: ["小腿腓肠肌", "股四头肌", "臀大肌", "核心肌群"],
    aliases: ["跑步机", "慢跑", "跑步", "坡度走", "快走", "爬坡走", "Treadmill", "Running"],
    gifUrl: "./exercises/treadmill.gif",
    defaultSets: 1,
    defaultReps: "20-30分钟",
    scienceDetail: "二区心率（Zone 2）黄金燃脂神技。通过调高坡度（8°-12°）配合快走（4.5-6 km/h），能在零膝盖冲击力的前提下最大化脂肪氧化率，同时促进乳酸代谢并加速力量训练后的神经恢复。",
    tags: ["二区心率", "高效燃脂", "护膝有氧", "主动恢复"],
    tips: {
      prep: "穿戴专业缓震跑鞋，核心微收，视线平视前方，严禁低头玩手机导致颈椎压力倍增。",
      execution: "脚后跟外侧先着地或全脚掌平稳滚动着地，避免纯脚尖或全脚后跟暴力砸带；双手自然前后摆动，不要死死抓住扶手借力。",
      peak: "保持心率在最大心率的 60%-70% 区间（能勉强说完整长句的谈话速度）。",
      negative: "跑完或走完前设置 3 分钟降速慢走冷身（Cool-down），严禁急速骤停导致血液滞留头晕。",
      breathing: "采用两步一吸、两步一呼的深层腹式呼吸节奏。"
    },
    commonMistakes: [
      "坡度走时双手死死抓着扶手身体后仰，抵消了坡度重力阻力",
      "落地声音巨大，足部缺乏缓震滚动，对膝关节和腰椎产生冲击",
      "刚跑完大汗淋漓立刻坐下或躺平"
    ],
    substitutes: [
      { name: "动感单车 / 室内骑行", reason: "更低关节冲击与膝盖友好" },
      { name: "楼梯机 / 爬楼机", reason: "更高臀腿做工与极限心肺输出" }
    ]
  },
  {
    id: "ex-cardio-rower",
    name: "风阻划船机",
    englishName: "Rowing Machine",
    category: "有氧",
    target: "全身体能 / 85% 骨骼肌协同高能做工",
    secondaryMuscles: ["背阔肌", "菱形肌", "股四头肌", "臀大肌", "腘绳肌", "前臂"],
    aliases: ["划船机", "测功仪", "风阻划船", "概念划船机", "Rowing", "Concept2"],
    gifUrl: "./exercises/rower.gif",
    defaultSets: 3,
    defaultReps: "500米/组",
    scienceDetail: "全身骨骼肌动员之王。每一划均经过下肢蹬伸（60%力）、躯干后倾伸髋（20%力）、上肢拉桨（20%力）的三段式连贯传导，兼顾力量耐力与无氧糖酵解，对后侧链和心肺功能具有无与伦比的强化效果。",
    tags: ["全身协调", "后侧链做工", "心肺耐力", "零冲击力"],
    tips: {
      prep: "双脚踩稳踏板，绑带收紧于前脚掌最宽处；双手正握把手两端，手腕平直，上身自然微前倾。",
      execution: "严格遵循【蹬腿 -> 展髋 -> 屈臂拉桨】顺序发力，发力比为 6:2:2；把手轻触胸肋下方。",
      peak: "拉至顶端时背肌与臀肌完全收拢，躯干向后微仰约 105°。",
      negative: "回桨严格遵循反向顺序【伸臂 -> 屈髋前倾 -> 收腿屈膝】，滑座顺滑回滑。",
      breathing: "蹬腿发力拉桨时呼气，回桨滑行顺应惯性吸气。"
    },
    commonMistakes: [
      "先屈臂拉把手再蹬腿，变成纯手臂做工",
      "回桨时先弯曲膝盖导致把手需要翻过膝盖上方（顺序颠倒）",
      "下背严重弓背驼背，缺乏骨盆中立位控制"
    ],
    substitutes: [
      { name: "跑步机慢跑/坡度走", reason: "经典心肺耐力培养" },
      { name: "战绳训练", reason: "强化上肢与核心爆发耐力" }
    ]
  },
  {
    id: "ex-cardio-stairmaster",
    name: "楼梯机 / 爬楼机",
    englishName: "StairMaster / StepMill",
    category: "有氧",
    target: "臀腿泵感 / 顶级心肺燃脂之王",
    secondaryMuscles: ["臀大肌", "股四头肌", "腘绳肌", "小腿肌群", "核心"],
    aliases: ["爬楼机", "楼梯机", "踏步机", "太空漫步机", "StairMaster", "Stair Climber"],
    gifUrl: "./exercises/stairmaster.gif",
    defaultSets: 1,
    defaultReps: "15-20分钟",
    scienceDetail: "健身房公认的燃脂终极天花板。持续进行克服重力的单腿垂直登阶，在极高心率区间调动臀大肌与股四头肌做离心向心交替，每分钟热量消耗比普通跑步高出 30% 以上，且无下落冲击。",
    tags: ["极限燃脂", "翘臀雕刻", "高心率", "无下落冲击"],
    tips: {
      prep: "双手虚扶把手仅用于保持身体平衡，上身微前倾保持脊柱中立，严禁将全身体重压在手肘上借力。",
      execution: "全脚掌完全踩上台阶，避免仅用前脚掌踮脚踏步；通过臀大肌和股四头肌发力踩下台阶登升。",
      peak: "登顶时臀肌自然挤压收紧，保持匀速连续韵律。",
      negative: "顺应踏板循环节奏沉稳换脚，不要跳跃或急促踩踏。",
      breathing: "深沉而有节奏的腹式呼吸，配合踏步步频。"
    },
    commonMistakes: [
      "双手死死撑在扶手架上甚至把上身吊起，实际做工吨位减半",
      "纯靠小腿踮脚蹬踏，导致小腿肌肉酸痛代偿而臀大肌无感",
      "膝关节在内扣（Knee Valgus）状态下登踏，损伤膝盖半月板"
    ],
    substitutes: [
      { name: "跑步机慢跑/坡度走", reason: "平稳坡度替代爬楼做工" },
      { name: "动感单车 / 室内骑行", reason: "下肢循环与心肺维持" }
    ]
  },
  {
    id: "ex-cardio-spin-bike",
    name: "动感单车 / 室内骑行",
    englishName: "Spinning Bike / Stationary Cycle",
    category: "有氧",
    target: "低冲击心肺有氧 / 保护膝关节",
    secondaryMuscles: ["股四头肌", "腘绳肌", "臀大肌", "腓肠肌"],
    aliases: ["动感单车", "单车", "健身车", "骑行", "Spinning", "Bike"],
    gifUrl: "./exercises/spin-bike.gif",
    defaultSets: 1,
    defaultReps: "20-40分钟",
    scienceDetail: "关节康复与心肺建立的黄金闭环。脚部始终与踏板闭合接触，消除着地冲击地面的剪切力；通过调节飞轮磁阻与踏频（Cadence 70-90 RPM），可精确调节无氧阈值与有氧耐力。",
    tags: ["极低冲击", "下肢耐力", "膝关节友好", "乳酸代谢"],
    tips: {
      prep: "调节座包高度至站立时与髋骨持平；坐上单车踩到底时，膝关节保持微屈约 25°-35° 夹角。",
      execution: "踩踏时膝盖与第二脚趾方向对齐，避免膝盖外翻或内扣；不仅往下踩，还要主动配合提拉踏板。",
      peak: "加速冲刺或爬坡站姿时，重心后收保持臀部悬浮于座垫前上方，核心收紧。",
      negative: "呼吸平稳顺畅，维持踏频节奏均匀稳定。",
      breathing: "顺应踏频节拍进行鼻吸口呼。"
    },
    commonMistakes: [
      "车座过低导致膝盖过度弯曲，髌股关节压力倍增产生膝痛",
      "无阻力空踩（飞轮惯性带脚跑），容易拉伤腘绳肌且无训练效益",
      "上身过度垮塌在车把上，手腕过度受力麻木"
    ],
    substitutes: [
      { name: "跑步机慢跑/坡度走", reason: "全身重力承载训练" },
      { name: "风阻划船机", reason: "全身大肌群协同做工" }
    ]
  },
  {
    id: "ex-cardio-jump-rope",
    name: "跳绳训练",
    englishName: "Jump Rope",
    category: "有氧",
    target: "全身协调性 / 小腿刚性与快速燃脂",
    secondaryMuscles: ["小腿腓肠肌", "比目鱼肌", "足底筋膜", "前臂", "核心"],
    aliases: ["跳绳", "双摇", "速度跳绳", "Jump Rope", "Rope Skipping"],
    gifUrl: "./exercises/jump-rope.gif",
    defaultSets: 4,
    defaultReps: "2-3分钟/组",
    scienceDetail: "搏击与田径体能必备的高功率密度训练。跳绳能强化跟腱弹性回缩（Stretch-Shortening Cycle, SSC）与小腿刚性，极高频调动中枢神经募集与本体感觉，同时在极短时间内拉升心率达高强度区间。",
    tags: ["神经敏捷", "肌腱刚度", "快速燃脂", "随时随地"],
    tips: {
      prep: "双脚踩绳中央，拉直手柄至腋下高度为最佳绳长；大臂贴紧躯干，纯由手腕摇转绳索。",
      execution: "前脚掌轻盈起跳，离地高度仅需 2-3 厘米刚好穿过绳索；双膝保持微屈弹性缓冲。",
      peak: "腾空时身体挺拔垂直，核心收紧，保持手腕高频小圈摇动。",
      negative: "前脚掌柔韧着地，跟腱如弹簧般蓄能迅速衔接下一次起跳，脚后跟不砸地。",
      breathing: "有节奏的轻柔短促呼吸。"
    },
    commonMistakes: [
      "屈大臂挥大圈摇绳，极易疲劳且摇速极慢",
      "全脚掌落地或跳得过高（>10cm），对膝盖和踝关节造成不必要的冲击",
      "在坚硬的水泥地面无缓冲跳绳"
    ],
    substitutes: [
      { name: "战绳训练", reason: "同样高频间歇燃脂" },
      { name: "跑步机慢跑/坡度走", reason: "低门槛持续心肺有氧" }
    ]
  },
  {
    id: "ex-cardio-battle-ropes",
    name: "战绳训练",
    englishName: "Battle Ropes",
    category: "有氧",
    target: "上肢爆发耐力 / 核心高频抗旋转",
    secondaryMuscles: ["三角肌前中束", "背部肌群", "前臂握力", "股四头肌", "臀大肌"],
    aliases: ["战绳", "重绳", "力量绳", "格斗绳", "Battle Ropes"],
    gifUrl: "./exercises/battle-ropes.gif",
    defaultSets: 4,
    defaultReps: "30秒全力",
    scienceDetail: "顶级无氧代谢与体能训练。通过双手交替或双臂同振将重绳震荡出高速前进的能量波，需要肩部、背部、手臂以无氧磷酸原与糖酵解系统极限做工，同时核心肌群必须全力抗旋转以抵抗波形反冲力。",
    tags: ["爆发耐力", "无氧糖酵解", "核心抗扭", "极速暴汗"],
    tips: {
      prep: "双脚开立与肩同宽，屈髋屈膝呈稳固半蹲位，下背平直，双手坚实握住战绳手柄。",
      execution: "通过肩关节发力快速上下抽打战绳，将波浪一路传递至固定端；双臂交替波浪或双臂同振波浪。",
      peak: "每一次抽甩都要爆发性到底，感受绳波撞击地面的反作用力被核心稳稳化解。",
      negative: "动作不拖泥带水，全程保持极高抽甩频率（每秒 2-3 次）。",
      breathing: "配合抽绳频率进行短促有力的爆发性呼气。"
    },
    commonMistakes: [
      "直立站立抽绳导致下背弓起代偿受压",
      "绳子拉得过紧导致波浪无法传导，必须留有一点轻微弧度余量",
      "仅用手腕和手臂小幅度晃动，未调动背部与核心动力链"
    ],
    substitutes: [
      { name: "风阻划船机", reason: "同等高能代谢消耗" },
      { name: "跳绳训练", reason: "高频敏捷燃脂" }
    ]
  }
];

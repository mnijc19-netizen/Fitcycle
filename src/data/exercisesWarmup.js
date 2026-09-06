/**
 * FitCycle Gold-Standard Dynamic Warm-Up & Mobility Exercise Library
 * 10 NSCA/ACSM Evidence-Based Dynamic Activation & Joint Mobility Movements
 * 
 * Complies with FitCycle Master Constitution:
 * - 100% physically present local animation GIFs (public/exercises/*.gif)
 * - Pure data structures, full 5-stage cues, zero-tolerance static stretching before lifting
 */

export const WARMUP_EXERCISES = [
  {
    id: "ex-warmup-arm-circles",
    name: "双臂肩关节环绕 (Arm Circles)",
    englishName: "Dynamic Arm Circles",
    category: "热身",
    target: "盂肱关节滑液分泌 / 三角肌与肩袖初步升温",
    secondaryMuscles: ["胸大肌上束", "上斜方肌", "小圆肌"],
    aliases: ["肩部环绕", "手臂绕环", "转肩膀", "手臂大绕环", "肩关节热身", "Arm Circles", "Shoulder Circles"],
    gifUrl: "./exercises/arm-circles.gif",
    defaultSets: 2,
    defaultReps: "各20圈",
    scienceDetail: "所有推胸、推肩动作的前置必练。通过小幅度到大幅度向前/向后的双臂立面环绕，促进肩峰下滑囊分泌滑膜液（天然润滑油），彻底消除推举起步时的肩关节咔咔异响与干磨擦感。",
    tags: ["肩关节润滑", "推日必练", "告别弹响", "肩袖预热"],
    tips: {
      prep: "站姿挺胸收腹，双脚与肩同宽，双臂向两侧完全水平平举，掌心朝下。",
      execution: "以肩关节为轴心，双臂沿侧立面由慢到快画圆，先顺时针画20圈，再逆时针画20圈。",
      peak: "幅度由小硬币大小逐渐过渡到篮球大小，感受肩峰深处逐渐产生温热感。",
      negative: "全程保持躯干稳定核心收紧，切勿剧烈前后耸肩或晃动腰部借力。",
      breathing: "匀速平稳深呼吸，切勿憋气。"
    },
    commonMistakes: [
      "速度太快像风车一样甩动，肌肉尚未充血易造成肩袖拉伤",
      "耸着肩膀耸肩画圈，把压力全堆在上斜方肌"
    ],
    substitutes: [
      { name: "靠墙W肩胛滑动 (Wall Slides)", reason: "强化肩胛骨下压贴壁" },
      { name: "弹力带对拉 (Band Pull-Apart)", reason: "增加后束与外旋抗阻" }
    ]
  },
  {
    id: "ex-warmup-band-pull-apart",
    name: "弹力带对拉 (Band Pull-Apart)",
    englishName: "Band Pull-Apart",
    category: "热身",
    target: "三角肌后束 / 菱形肌 / 肩袖外旋肌群预激活",
    secondaryMuscles: ["斜方肌中下束", "小圆肌", "冈下肌"],
    aliases: ["弹力带拉伸", "弹力带对拉", "肩后束激活", "练前拉伸对拉", "Band Pull Apart", "Pull Apart"],
    gifUrl: "./exercises/band-pull-apart.gif",
    defaultSets: 2,
    defaultReps: "15-20次",
    scienceDetail: "现代人由于长期伏案含胸，后束与肩胛收肌往往处于神经抑制状态。在大重量卧推或划船前做弹力带对拉，能瞬间唤醒肩胛骨后缩控制力，给大重量卧推打造一块坚实的‘背部发力底盘’。",
    tags: ["卧推底盘", "肩袖激活", "含胸克星", "后束充血"],
    tips: {
      prep: "双手持轻阻力弹力带，手臂与肩同高水平向前伸直，双手握距略宽于肩，微屈肘锁死。",
      execution: "双臂水平向身体两侧拉开弹力带，将弹力带拉至轻触胸口。",
      peak: "重点在后背两侧肩胛骨用力向中间对夹挤压1秒，感受后束与上背深层收缩。",
      negative: "受控慢慢送回初始位置，全程保持弹力带恒定微张力。",
      breathing: "向外拉开时呼气，回放送回时吸气。"
    },
    commonMistakes: [
      "使用过硬的弹力带导致耸肩借力",
      "手腕向后过度翻折，失去后背主动收敛发力"
    ],
    substitutes: [
      { name: "面拉 (Face Pull)", reason: "龙门架高位外旋替代" },
      { name: "靠墙W肩胛滑动 (Wall Slides)", reason: "自重徒手肩胛激活" }
    ]
  },
  {
    id: "ex-warmup-wall-slide",
    name: "靠墙W肩胛滑动 (Wall Slides)",
    englishName: "Wall Slides with W to Y",
    category: "热身",
    target: "前锯肌 / 下斜方肌 / 胸椎伸展活动度",
    secondaryMuscles: ["三角肌中后束", "背阔肌动态拉伸"],
    aliases: ["靠墙滑动", "墙壁滑动", "W滑行", "靠墙YTW", "Wall Slide", "Scapular Wall Slide"],
    gifUrl: "./exercises/wall-slide.gif",
    defaultSets: 2,
    defaultReps: "12-15次",
    scienceDetail: "推肩与引体向上的‘防撞击神技’。靠墙滑动强制你的下背部、头部、手肘和手背全部贴合墙面，在消除腰椎代偿的前提下改善肩胛骨向上旋转（Upward Rotation）力线，彻底解锁过头推举活动度。",
    tags: ["过头推举解锁", "胸椎活动度", "肩胛贴合", "预防撞击"],
    tips: {
      prep: "后背贴靠墙面，双脚离墙约半步，下背部微微贴紧墙面不塌腰，双臂在身侧弯曲呈‘W’形贴墙。",
      execution: "保持手肘、手背与墙面全程紧贴，双臂沿墙面慢慢向上推伸滑行，逐渐形成‘Y’字型。",
      peak: "在最高处充分伸展胸椎与背阔肌，顶峰停顿1秒。",
      negative: "主动沉肩下拉，沿墙面受控滑回初始‘W’位置，挤压两侧肩胛骨下角。",
      breathing: "向上滑动时吸气挺拔，向下拉回时呼气沉肩。"
    },
    commonMistakes: [
      "手肘或手背离开墙壁向前悬空，失去抗旋控制",
      "为了手臂够高而拼命挺肚子反弓腰椎"
    ],
    substitutes: [
      { name: "双臂肩关节环绕 (Arm Circles)", reason: "纯徒手空手关节升温" },
      { name: "弹力带对拉 (Band Pull-Apart)", reason: "后束水平激活" }
    ]
  },
  {
    id: "ex-warmup-cat-cow",
    name: "猫牛式脊柱伸展 (Cat-Cow Pose)",
    englishName: "Cat-Cow Stretch",
    category: "热身",
    target: "胸椎与腰椎节段屈伸 / 骨盆前倾后倾控制力",
    secondaryMuscles: ["竖脊肌", "腹直肌", "颈椎深层肌群"],
    aliases: ["猫牛式", "猫狗式", "猫牛伸展", "脊柱屈伸", "腰背放松", "Cat Cow", "Cat Camel"],
    gifUrl: "./exercises/cat-cow.gif",
    defaultSets: 2,
    defaultReps: "10-12次呼吸",
    scienceDetail: "深蹲与硬拉训练前最受康复与力量举大师推崇的神经动作。它通过交替的脊柱完全屈曲（猫式）与完全伸展（牛式），逐节唤醒椎间盘周围的核心深层小肌群，让神经系统快速掌握‘骨盆中立位’感知。",
    tags: ["脊柱节段流动", "骨盆前倾纠正", "深蹲硬拉前必练", "告别腰僵"],
    tips: {
      prep: "四足跪姿，双手在双肩正下方，双膝在双髋正下方，脚尖点地，脊柱保持自然平直。",
      execution: "【猫式】：呼气低头含胸拱背，骨盆后倾卷腹，把背部向上推向天花板，像一只受惊的猫；【牛式】：吸气抬头挺胸，骨盆前倾微沉腹，胸口向前延展。",
      peak: "在猫式顶峰充分吐尽气息，在牛式底端充分舒展胸腔，不压迫腰椎。",
      negative: "逐个脊椎节段受控流动，动作轻柔舒展。",
      breathing: "拱背时深呼气排空，沉腹抬头时深吸气扩张。"
    },
    commonMistakes: [
      "牛式时过度死命塌腰压折腰椎，造成椎间孔挤压",
      "动作过快像机械捣头，没有配合深度胸腹呼吸"
    ],
    substitutes: [
      { name: "毛毛虫爬行拉伸 (Inchworm)", reason: "站姿全身后链动态激活" },
      { name: "山羊挺身 / 罗马椅挺身", reason: "抗阻式竖脊肌做工" }
    ]
  },
  {
    id: "ex-warmup-inchworm",
    name: "毛毛虫爬行动态拉伸 (Inchworm)",
    englishName: "Inchworm Dynamic Stretch",
    category: "热身",
    target: "腘绳肌离心拉伸 / 肩部稳定性与核心抗伸展",
    secondaryMuscles: ["小腿三头肌", "前锯肌", "腹横肌", "腕屈肌"],
    aliases: ["毛毛虫", "毛毛虫爬行", "爬行拉伸", "直腿手爬", "Inchworm", "Walkout"],
    gifUrl: "./exercises/inchworm.gif",
    defaultSets: 2,
    defaultReps: "6-8次",
    scienceDetail: "复合运动链的动态拉伸黄金范例。双腿伸直向前下折拉长腘绳肌，双手爬行到平板支撑位唤醒核心与肩部稳定肌群，能在短短几次重复中使全身核心体温显著提升，为重负荷后链做工做好万全准备。",
    tags: ["腘绳肌动态激活", "手爬平板", "核心升温", "全身协同"],
    tips: {
      prep: "站姿双脚与髋同宽，保持膝盖微屈或尽可能伸直，俯身双手掌心触地（触不到可微屈膝）。",
      execution: "保持双脚不动，双手一步一步向前手爬，直到身体形成标准水平平板支撑姿态。",
      peak: "在平板支撑位置夹紧臀部、收紧腹部保持1秒，身体成一条刚性直线。",
      negative: "双手一步一步向后倒退爬回双脚前方，感受大腿后侧腘绳肌强烈的动态拉伸感，慢慢站直。",
      breathing: "手爬向前时匀速呼气收核心，后退站直时吸气。"
    },
    commonMistakes: [
      "手爬到最低点时塌腰吊腹，腰椎承受剪切力",
      "起立时猛烈甩腰，应由髋铰链平稳主导"
    ],
    substitutes: [
      { name: "猫牛式脊柱伸展 (Cat-Cow)", reason: "地面非负重脊柱流动" },
      { name: "罗马尼亚硬拉 (RDL)", reason: "抗阻腘绳肌力量做工" }
    ]
  },
  {
    id: "ex-warmup-glute-bridge",
    name: "动态仰卧臀桥 (Glute Bridge)",
    englishName: "Glute Bridge Activation",
    category: "热身",
    target: "臀大肌纯伸髋激活 / 消除‘臀肌失忆症’",
    secondaryMuscles: ["腘绳肌", "竖脊肌", "腹横肌"],
    aliases: ["臀桥", "动态臀桥", "徒手臀桥", "臀肌激活", "练前臀桥", "Glute Bridge"],
    gifUrl: "./exercises/glute-bridge.gif",
    defaultSets: 2,
    defaultReps: "15-20次",
    scienceDetail: "久坐人群在深蹲和硬拉时极易出现‘腰背代偿’，根源在于臀大肌长期受压钝化（臀肌失忆）。热身时做徒手臀桥，通过单纯伸髋唤醒臀大肌神经突触，确保在后续深蹲起伏时臀部成为第一发力引擎。",
    tags: ["臀肌唤醒", "深蹲腰酸克星", "纯伸髋动作", "骨盆稳定"],
    tips: {
      prep: "仰卧在垫上，双膝弯曲约90度，双脚与髋同宽踩实地面，双手置于身体两侧。",
      execution: "脚后跟用力蹬地，臀大肌主动收缩发力将髋关节向上推离地面。",
      peak: "推至大腿与躯干呈一条笔直斜线，在最高点极致夹紧臀大肌顶峰收缩2秒！",
      negative: "缓慢下放髋部轻触地面后立刻进行下一次，全程保持臀肌张力不彻底瘫软。",
      breathing: "顶峰推起时吐气收腹，下落回放时吸气。"
    },
    commonMistakes: [
      "依靠挺肚子过度反弓腰椎顶起，腰椎代替臀部做工",
      "双脚离臀部太远变成大腿后侧腘绳肌抽筋"
    ],
    substitutes: [
      { name: "器械推髋 (Hip Thrust)", reason: "大重量臀肌超负荷" },
      { name: "绳索后踢 (Cable Glute Kickback)", reason: "站姿单侧孤立塑形" }
    ]
  },
  {
    id: "ex-warmup-high-knee-lunge",
    name: "行进间高抬腿弓步 (Walking High Knee Lunges)",
    englishName: "Walking High Knee to Lunge Stretch",
    category: "热身",
    target: "髋关节大角度屈伸 / 股四头肌与臀大肌动态协调",
    secondaryMuscles: ["髂腰肌", "大腿内收肌", "足踝稳定肌"],
    aliases: ["高抬腿弓步", "行进弓步", "抱膝弓步", "动态箭步蹲", "Walking Lunge", "High Knee Lunge"],
    gifUrl: "./exercises/walking-high-knee-lunges.gif",
    defaultSets: 2,
    defaultReps: "每侧10步",
    scienceDetail: "腿日训练不可或缺的动态多关节复合热身。单腿高抬抱膝能够最大化拉长后侧臀肌并润滑髋臼，紧接着跨步下沉弓步又深度拉开后腿的髋屈肌与前腿股四头肌，建立单腿本体感觉与动态平衡。",
    tags: ["下肢动态之王", "深蹲前必做", "髋臼灵活", "单腿平衡"],
    tips: {
      prep: "自然站立，单膝向上提起向胸前抱紧，提膝同时对侧脚跟踮起拉伸后链。",
      execution: "顺势向前大跨步迈出下沉，身体重心保持在双腿正中，前膝下蹲至约90度，后膝微贴近地面但不触地。",
      peak: "在弓步最低点感受后腿前侧髋屈肌的充分被动拉伸感，保持1秒。",
      negative: "前脚后跟蹬地站起，直接切换对侧腿进行高抬与迈步，连续交替向前行进。",
      breathing: "下沉弓步时吸气扩张，蹬地站起时呼气收紧核心。"
    },
    commonMistakes: [
      "迈步太小导致前脚膝盖严重向前过度超过脚尖引起髌骨压力",
      "躯干过度前倾瘫软，核心松散晃动"
    ],
    substitutes: [
      { name: "跪姿髋屈肌动态拉伸", reason: "纯静态/单关节髋前侧拉伸" },
      { name: "自重深蹲", reason: "双腿同步下肢热身" }
    ]
  },
  {
    id: "ex-warmup-hip-flexor",
    name: "跪姿髋屈肌动态拉伸 (Kneeling Hip Flexor Stretch)",
    englishName: "Kneeling Hip Flexor Dynamic Stretch",
    category: "热身",
    target: "髂腰肌 / 股直肌深层伸展 / 消除深蹲骨盆过度前倾",
    secondaryMuscles: ["腹直肌下束", "大腿前侧"],
    aliases: ["髋屈肌拉伸", "髂腰肌拉伸", "单膝跪地拉伸", "深蹲开髋", "Hip Flexor Stretch"],
    gifUrl: "./exercises/kneeling-hip-flexor-stretch.gif",
    defaultSets: 2,
    defaultReps: "每侧10-12次动态推拉",
    scienceDetail: "现代打工人90%以上髋屈肌（髂腰肌）处于极度紧绷短缩状态，导致站立骨盆前倾、深蹲底端‘骨盆翻转（Butt Wink）’。通过骨盆后倾锁死下的单膝动态前推，能精准撕开紧绷的髂腰肌，深蹲轻松蹲到大腿水平以下！",
    tags: ["骨盆翻转克星", "打工人救星", "深蹲深度解锁", "髂腰肌松解"],
    tips: {
      prep: "单膝跪在垫子上呈半跪姿（如左膝着地，右脚踩前），躯干保持完全直立，收紧腹部使骨盆微后倾。",
      execution: "后侧臀部主动收紧夹死，将整个骨盆平稳向前缓慢推移5~10厘米。",
      peak: "感受到后腿大腿根部和大腿前侧产生清晰拉扯感，停顿停留2秒，然后退回起始位做小幅度动态往复。",
      negative: "始终保持后背挺直，严禁为了推得更远而反弓下背部！",
      breathing: "向前推伸时深度呼气，回放时吸气。"
    },
    commonMistakes: [
      "骨盆没有主动后倾收腹，变成过度伸展腰椎的假拉伸",
      "前脚踩得太近导致前膝内扣"
    ],
    substitutes: [
      { name: "行进间高抬腿弓步", reason: "动态连续行进下肢热身" },
      { name: "动态仰卧臀桥", reason: "反向臀大肌伸髋发力" }
    ]
  },
  {
    id: "ex-warmup-wrist-circles",
    name: "腕关节绕环活动度 (Wrist Circles & Mobility)",
    englishName: "Wrist Circles & Joint Mobility",
    category: "热身",
    target: "腕骨关节滑液分泌 / 腕屈肌与伸肌动态顺应",
    secondaryMuscles: ["前臂小肌群", "指长屈肌"],
    aliases: ["手腕热身", "转手腕", "手腕活动", "护腕热身", "Wrist Circles", "Wrist Mobility"],
    gifUrl: "./exercises/wrist-circles.gif",
    defaultSets: 2,
    defaultReps: "各方向20圈",
    scienceDetail: "卧推、推肩、深蹲杠铃压腕前不可忽略的减压步骤。大重量训练中手腕需要承受数十至上百公斤的垂直剪切压力。通过双手十指交叉的双向立体环绕与轻微折腕压屈，能提前提升韧带柔韧性与软骨顺应度，杜绝压腕刺痛。",
    tags: ["卧推护腕", "手腕防痛", "关节滑液", "翻铃前置"],
    tips: {
      prep: "双手十指紧紧交扣在胸前，手掌心相对，两手腕贴合。",
      execution: "由慢到快，用手腕沿立面画横向‘8’字或进行顺时针与逆时针圆弧回旋。",
      peak: "在每个角度极值点感受腕部内外侧韧带温和拉伸与放松，顺逆时针各做20圈。",
      negative: "可结合轻柔的掌根向前推伸压腕动作进一步舒展腕伸肌。",
      breathing: "自然顺畅呼吸。"
    },
    commonMistakes: [
      "十指松散导致手腕没有真正产生受控角度屈伸",
      "用力过猛猛烈掰折冷手腕"
    ],
    substitutes: [
      { name: "双臂肩关节环绕 (Arm Circles)", reason: "肩部与手臂整体升温" }
    ]
  },
  {
    id: "ex-warmup-jumping-jacks",
    name: "动态开合跳升温 (Jumping Jacks)",
    englishName: "Jumping Jacks Systemic Warm-Up",
    category: "热身",
    target: "全身血液循环与核心体温拉升 / 中枢神经系统唤醒",
    secondaryMuscles: ["腓肠肌", "三角肌", "心肺系统", "足底筋膜"],
    aliases: ["开合跳", "星跳", "热身跳跃", "全身升温", "Jumping Jack", "Star Jump"],
    gifUrl: "./exercises/jumping-jacks.gif",
    defaultSets: 2,
    defaultReps: "30-45秒",
    scienceDetail: "经典的全身系统级热身动作。通过连续富有弹性的轻度跳跃与双臂开合，在30秒内迅速提升全身核心温度（Core Temperature）、加快心率并让骨骼肌毛细血管网完全扩张，让整个人从沉睡钝化状态瞬间进入战备开练状态。",
    tags: ["全身神经唤醒", "体温迅速拉升", "30秒进入状态", "心肺预备"],
    tips: {
      prep: "站姿挺胸，双手自然垂于体侧，双脚并拢，膝盖保持弹性微屈。",
      execution: "双脚前脚掌轻盈蹬地向两侧跳开（略宽于肩），同时双臂向两侧斜上方划弧线在头顶击掌或靠近。",
      peak: "双脚落地同时双手在上方，保持膝盖朝向第二脚趾外展，绝不内扣。",
      negative: "前脚掌弹性着地跳回初始并拢位置，双臂自然降回体侧，形成平稳富有弹性的节律。",
      breathing: "鼻吸口呼，配合跳跃节奏保持平稳快速呼吸。"
    },
    commonMistakes: [
      "全脚掌重重拍击地面砸地板，造成膝盖和腰椎震荡损伤，必须用前脚掌弹性着地缓冲",
      "落地时膝关节内扣内夹"
    ],
    substitutes: [
      { name: "行进间高抬腿弓步", reason: "无冲击力下肢动态热身" },
      { name: "双臂肩关节环绕", reason: "上肢纯低强度升温" }
    ]
  }
];

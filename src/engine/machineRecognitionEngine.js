/**
 * FitCycle Machine Recognition Engine (Layer 2 Pure Biomechanics & Machine Finder Engine)
 * Offline Chinese colloquial tokenizer, anatomical feature extractor, inverted index & weighted scoring.
 * Matches user colloquial descriptions, voice transcripts, or vision-tagged keywords against the 109 golden exercises.
 * 
 * Complies with FitCycle Master Constitution:
 * - Layer 2 pure business engine: 0 UI dependency, 0 side effects, 100% deterministic.
 * - Millisecond response time, 100% offline capable (zero external API dependency).
 */

import { DEFAULT_EXERCISES } from "../data/defaultPlans.js";

// --- 1. FEATURE LEXICON & COLLOQUIAL SYNONYM MAP ---

export const FEATURE_CATEGORIES = {
  POSTURE: "posture",
  ACTION: "action",
  EQUIPMENT: "equipment",
  MUSCLE: "muscle",
  VISUAL: "visual"
};

/**
 * Colloquial keyword definitions mapped to semantic feature tags
 */
const LEXICON_ENTRIES = [
  // --- POSTURES ---
  {
    category: FEATURE_CATEGORIES.POSTURE,
    tag: "posture:seated",
    label: "坐姿/坐位",
    keywords: ["坐着", "坐姿", "坐位", "坐在", "端坐", "坐着练", "坐式"]
  },
  {
    category: FEATURE_CATEGORIES.POSTURE,
    tag: "posture:lying_or_incline",
    label: "仰卧/斜躺",
    keywords: ["躺着", "平躺", "仰卧", "仰躺", "斜躺", "躺在", "半躺", "靠板", "靠背", "45度", "斜靠", "卧姿"]
  },
  {
    category: FEATURE_CATEGORIES.POSTURE,
    tag: "posture:prone",
    label: "俯卧/俯身",
    keywords: ["俯卧", "趴着", "趴在", "趴着练", "俯身", "躬身", "扑在"]
  },
  {
    category: FEATURE_CATEGORIES.POSTURE,
    tag: "posture:standing",
    label: "站姿/站立",
    keywords: ["站着", "站姿", "站立", "直立", "站起"]
  },
  {
    category: FEATURE_CATEGORIES.POSTURE,
    tag: "posture:kneeling",
    label: "跪姿",
    keywords: ["跪着", "跪姿", "单膝跪"]
  },

  // --- ACTIONS & TRAJECTORIES ---
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:push_forward",
    label: "向前推胸",
    keywords: [
      "手往前推", "往前推", "向前推", "推胸", "前推", "平推", "往胸前推", "往前用力",
      "推前面", "双臂前推", "水平推"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:push_up",
    label: "向上推举/推肩",
    keywords: [
      "往上推", "向上推", "过头推", "推肩", "上推", "双手往上举", "双手上推", "往头顶推"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:push_incline",
    label: "上斜推胸",
    keywords: ["上斜推", "往上斜推", "斜上推", "上斜推胸"]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:pull_down",
    label: "高位向下拉背",
    keywords: [
      "往下拉", "向下拉", "下拉", "往下拉背", "高位拉", "手往下拉", "从上往下拉",
      "向下拽", "拉横杆", "下拉背阔"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:pull_back",
    label: "水平划船/向后拉",
    keywords: [
      "向后拉", "往后拉", "划船", "水平拉", "拉向腹部", "后拉", "往后拽", "拉手柄"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:chest_fly",
    label: "夹胸/飞鸟收拢",
    keywords: [
      "夹胸", "飞鸟", "向内夹", "往中间合拢", "双臂环抱", "两手往中间夹", "合拢", "蝴蝶式"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:curl",
    label: "二头弯举",
    keywords: [
      "弯举", "屈臂", "小臂弯折", "二头弯举", "抬起小臂", "向上屈肘", "曲臂"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:pushdown",
    label: "三头下压/臂屈伸",
    keywords: [
      "下压", "直臂下压", "绳索下压", "向下按压", "下按", "手臂下压", "压杆", "三头下压"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:leg_press",
    label: "大腿蹬踏/倒蹬",
    keywords: [
      "往上蹬", "蹬大腿", "蹬腿", "倒蹬", "大腿蹬", "双腿往上蹬", "踩踏板", "蹬起",
      "蹬板", "脚往上蹬", "大腿往前蹬"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:leg_extension",
    label: "小腿踢腿/腿屈伸",
    keywords: [
      "往上踢", "踢小腿", "伸小腿", "腿屈伸", "踢腿", "小腿向上踢", "伸膝", "膝盖伸直"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:leg_curl",
    label: "小腿后勾/腿弯举",
    keywords: [
      "小腿后勾", "勾腿", "腿弯举", "往后勾", "后勾小腿", "屈膝勾腿"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:calf_raise",
    label: "提踵/垫脚尖",
    keywords: [
      "提踵", "垫脚", "垫脚尖", "踮脚", "顶小腿", "提脚后跟"
    ]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:hip_abduction",
    label: "髋外展/分腿练臀",
    keywords: ["外展", "分腿", "大腿向外推", "开腿", "练臀中肌"]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:hip_adduction",
    label: "髋内收/夹腿",
    keywords: ["内收", "夹腿", "大腿向内夹", "大腿内侧"]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:crunch",
    label: "卷腹/腹部收紧",
    keywords: ["卷腹", "抱头屈体", "压腹", "腹部发力"]
  },
  {
    category: FEATURE_CATEGORIES.ACTION,
    tag: "action:cardio",
    label: "有氧运动",
    keywords: ["跑步", "慢跑", "快走", "坡度走", "爬楼", "踩单车", "骑车", "跳绳", "战绳"]
  },

  // --- HARDWARE & EQUIPMENT TYPES ---
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:chest_press_machine",
    label: "固定器械推胸机",
    keywords: [
      "坐姿推胸器", "推胸机", "固定推胸器", "推胸器", "坐姿推胸机", "胸部推举器",
      "胸推机", "双轴推胸机", "器械推胸"
    ]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:lat_pulldown_machine",
    label: "高位下拉器",
    keywords: [
      "高位下拉器", "下拉机", "高位下拉机", "背部下拉机", "器械下拉", "背阔下拉机"
    ]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:leg_press_machine",
    label: "倒蹬机/腿举机",
    keywords: [
      "倒蹬机", "倒蹬腿举机", "腿举机", "45度倒蹬机", "斜面倒蹬机", "倒蹬"
    ]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:hack_squat_machine",
    label: "哈克深蹲机",
    keywords: [
      "哈克机", "哈克深蹲机", "哈克", "器械深蹲机"
    ]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:leg_extension_machine",
    label: "腿屈伸机",
    keywords: ["腿屈伸机", "器械腿屈伸", "坐姿腿屈伸机"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:leg_curl_machine",
    label: "腿弯举机",
    keywords: ["腿弯举机", "器械腿弯举", "俯卧腿弯举机", "坐姿腿弯举机"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:pec_deck_machine",
    label: "蝴蝶机/飞鸟机",
    keywords: ["蝴蝶机", "飞鸟机", "蝴蝶夹胸机", "器械飞鸟"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:rowing_machine",
    label: "器械划船机",
    keywords: ["划船机", "划船器", "器械划船", "悍马划船", "坐姿绳索划船"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:smith_machine",
    label: "史密斯机",
    keywords: ["史密斯机", "史密斯", "固定轨道深蹲", "导轨杠铃"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:cable_crossover",
    label: "龙门架/绳索",
    keywords: ["龙门架", "双臂大飞鸟", "交叉滑轮", "绳索", "滑轮", "滑轮组"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:lever_hammer_machine",
    label: "杠杆/悍马挂片器械",
    keywords: ["杠杆", "杠杆器械", "悍马机", "悍马", "双轴", "挂片杠杆"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:barbell",
    label: "杠铃",
    keywords: ["杠铃", "奥杆", "曲杆"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:dumbbell",
    label: "哑铃",
    keywords: ["哑铃", "单只哑铃", "双哑铃"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:cardio_machine",
    label: "有氧设备",
    keywords: ["跑步机", "动感单车", "单车", "椭圆机", "划船机", "爬楼机", "楼梯机"]
  },
  {
    category: FEATURE_CATEGORIES.EQUIPMENT,
    tag: "equipment:general_machine",
    label: "固定器械",
    keywords: ["器械", "固定器械", "大器械", "机器", "设备"]
  },

  // --- VISUAL & MECHANICAL ATTRIBUTES ---
  {
    category: FEATURE_CATEGORIES.VISUAL,
    tag: "visual:yellow",
    label: "黄色标志/调节手柄",
    keywords: ["黄色", "黄把手", "黄手柄", "黄色标", "黄黄的"]
  },
  {
    category: FEATURE_CATEGORIES.VISUAL,
    tag: "visual:red",
    label: "红色机身",
    keywords: ["红色", "红黑色", "红底"]
  },
  {
    category: FEATURE_CATEGORIES.VISUAL,
    tag: "visual:black",
    label: "黑色机架",
    keywords: ["黑色", "全黑", "黑铁"]
  },
  {
    category: FEATURE_CATEGORIES.VISUAL,
    tag: "visual:incline_slant",
    label: "斜面/倾斜导轨",
    keywords: ["斜面", "倾斜", "斜着", "斜板", "45度角", "斜靠背", "斜滑轨"]
  },
  {
    category: FEATURE_CATEGORIES.VISUAL,
    tag: "visual:footplate",
    label: "大脚踏板",
    keywords: ["踏板", "大踏板", "脚踏板", "踩踏铁板"]
  },
  {
    category: FEATURE_CATEGORIES.VISUAL,
    tag: "visual:large_machine",
    label: "大型器械",
    keywords: ["大器械", "大型器械", "很大的器械", "占地方的大机器", "巨型"]
  },
  {
    category: FEATURE_CATEGORIES.VISUAL,
    tag: "visual:plate_loaded",
    label: "挂片式",
    keywords: ["挂片", "加杠铃片", "自己加片", "挂铃片"]
  },
  {
    category: FEATURE_CATEGORIES.VISUAL,
    tag: "visual:pin_selected",
    label: "插销式配重",
    keywords: ["插销", "配重铁", "插铁片", "配重块"]
  },

  // --- MUSCLE GROUPS ---
  {
    category: FEATURE_CATEGORIES.MUSCLE,
    tag: "muscle:chest",
    label: "胸大肌",
    keywords: ["胸", "胸部", "胸肌", "上胸", "下胸", "中胸", "胸大肌", "大胸"]
  },
  {
    category: FEATURE_CATEGORIES.MUSCLE,
    tag: "muscle:back",
    label: "背部/背阔肌",
    keywords: ["背", "背部", "练背", "背阔肌", "大圆肌", "上背", "下背", "背肌"]
  },
  {
    category: FEATURE_CATEGORIES.MUSCLE,
    tag: "muscle:shoulder",
    label: "肩部/三角肌",
    keywords: ["肩", "肩膀", "三角肌", "前束", "中束", "后束", "练肩", "肩头"]
  },
  {
    category: FEATURE_CATEGORIES.MUSCLE,
    tag: "muscle:biceps",
    label: "肱二头肌",
    keywords: ["二头", "二头肌", "肱二头肌", "手臂前侧", "麒麟臂", "弯举臂"]
  },
  {
    category: FEATURE_CATEGORIES.MUSCLE,
    tag: "muscle:triceps",
    label: "肱三头肌",
    keywords: ["三头", "三头肌", "肱三头肌", "手臂后侧", "马蹄铁"]
  },
  {
    category: FEATURE_CATEGORIES.MUSCLE,
    tag: "muscle:legs",
    label: "大腿/股四头肌/腘绳肌",
    keywords: ["大腿", "大腿前侧", "股四", "股四头肌", "腘绳肌", "腿部", "练腿", "大腿后侧", "大腿根"]
  },
  {
    category: FEATURE_CATEGORIES.MUSCLE,
    tag: "muscle:calves",
    label: "小腿",
    keywords: ["小腿", "小腿肚", "腓肠肌", "比目鱼肌"]
  },
  {
    category: FEATURE_CATEGORIES.MUSCLE,
    tag: "muscle:glutes",
    label: "臀大肌/臀部",
    keywords: ["臀", "臀部", "臀大肌", "臀中肌", "练臀", "屁股"]
  },
  {
    category: FEATURE_CATEGORIES.MUSCLE,
    tag: "muscle:core",
    label: "腹肌/核心",
    keywords: ["腹肌", "腹部", "核心", "马甲线", "人鱼线", "肚子"]
  }
];

// Sort lexicon entries so longest keywords match first
const SORTED_LEXICON = LEXICON_ENTRIES.map(entry => ({
  ...entry,
  keywords: [...entry.keywords].sort((a, b) => b.length - a.length)
}));

// --- 2. PRE-MAPPED EXERCISE PROFILES FOR HIGH ACCURACY ---

/**
 * Explicit feature tags for well-known gym machines to guarantee >= 0.90 confidence
 */
const EXERCISE_SPECIFIC_FEATURE_MAP = {
  "ex-machine-chest-press": [
    "posture:seated",
    "action:push_forward",
    "equipment:chest_press_machine",
    "equipment:lever_hammer_machine",
    "equipment:general_machine",
    "visual:yellow",
    "muscle:chest"
  ],
  "ex-incline-machine-chest-press": [
    "posture:lying_or_incline",
    "action:push_incline",
    "action:push_forward",
    "equipment:chest_press_machine",
    "equipment:lever_hammer_machine",
    "equipment:general_machine",
    "visual:incline_slant",
    "visual:yellow",
    "muscle:chest"
  ],
  "ex-pec-deck-fly": [
    "posture:seated",
    "action:chest_fly",
    "equipment:pec_deck_machine",
    "equipment:general_machine",
    "muscle:chest"
  ],
  "ex-hack-squat": [
    "posture:lying_or_incline",
    "action:leg_press",
    "equipment:hack_squat_machine",
    "equipment:leg_press_machine",
    "equipment:general_machine",
    "visual:incline_slant",
    "visual:footplate",
    "visual:large_machine",
    "muscle:legs"
  ],
  "ex-leg-extension": [
    "posture:seated",
    "action:leg_extension",
    "equipment:leg_extension_machine",
    "equipment:general_machine",
    "muscle:legs"
  ],
  "ex-seated-leg-curl": [
    "posture:seated",
    "action:leg_curl",
    "equipment:leg_curl_machine",
    "equipment:general_machine",
    "muscle:legs"
  ],
  "ex-seated-leg-curl-machine": [
    "posture:seated",
    "action:leg_curl",
    "equipment:leg_curl_machine",
    "equipment:general_machine",
    "muscle:legs"
  ],
  "ex-lying-leg-curl": [
    "posture:prone",
    "action:leg_curl",
    "equipment:leg_curl_machine",
    "equipment:general_machine",
    "muscle:legs"
  ],
  "ex-lat-pulldown": [
    "posture:seated",
    "action:pull_down",
    "equipment:lat_pulldown_machine",
    "equipment:general_machine",
    "muscle:back"
  ],
  "ex-close-grip-lat-pulldown": [
    "posture:seated",
    "action:pull_down",
    "equipment:lat_pulldown_machine",
    "equipment:general_machine",
    "muscle:back"
  ],
  "ex-seated-cable-row": [
    "posture:seated",
    "action:pull_back",
    "equipment:rowing_machine",
    "equipment:cable_crossover",
    "equipment:general_machine",
    "muscle:back"
  ],
  "ex-machine-shoulder-press": [
    "posture:seated",
    "action:push_up",
    "equipment:lever_hammer_machine",
    "equipment:general_machine",
    "visual:yellow",
    "muscle:shoulder"
  ],
  "ex-seated-calf-raise": [
    "posture:seated",
    "action:calf_raise",
    "equipment:general_machine",
    "muscle:calves"
  ],
  "ex-hip-abduction-machine": [
    "posture:seated",
    "action:hip_abduction",
    "equipment:general_machine",
    "muscle:glutes"
  ],
  "ex-hip-adduction-machine": [
    "posture:seated",
    "action:hip_adduction",
    "equipment:general_machine",
    "muscle:legs"
  ],
  "ex-cardio-treadmill": [
    "posture:standing",
    "action:cardio",
    "equipment:cardio_machine",
    "muscle:legs"
  ],
  "ex-cardio-rower": [
    "posture:seated",
    "action:cardio",
    "action:pull_back",
    "equipment:cardio_machine",
    "muscle:back"
  ],
  "ex-cardio-spin-bike": [
    "posture:seated",
    "action:cardio",
    "equipment:cardio_machine",
    "muscle:legs"
  ],
  "ex-cable-tricep-pushdown": [
    "posture:standing",
    "action:pushdown",
    "equipment:cable_crossover",
    "muscle:triceps"
  ],
  "ex-machine-triceps-pressdown": [
    "posture:seated",
    "action:pushdown",
    "equipment:lever_hammer_machine",
    "equipment:general_machine",
    "muscle:triceps"
  ]
};

// --- 3. TOKENIZATION & FEATURE EXTRACTION ---

/**
 * Extracts semantic features from colloquial Chinese query text
 * @param {string} queryText 
 * @returns {{ matchedEntries: Array, detectedTags: Set<string>, matchedLabels: string[] }}
 */
export function extractQueryFeatures(queryText) {
  if (!queryText || typeof queryText !== "string") {
    return { matchedEntries: [], detectedTags: new Set(), matchedLabels: [] };
  }

  const cleanQuery = queryText.toLowerCase().replace(/[\s\-_,，。！？!?;；]/g, "");
  const detectedTags = new Set();
  const matchedEntries = [];
  const matchedLabels = [];

  for (const entry of SORTED_LEXICON) {
    for (const kw of entry.keywords) {
      if (cleanQuery.includes(kw)) {
        detectedTags.add(entry.tag);
        matchedEntries.push({ ...entry, matchedKeyword: kw });
        matchedLabels.push(entry.label);
        break; // Stop at first matched keyword for this entry
      }
    }
  }

  return {
    matchedEntries,
    detectedTags,
    matchedLabels: Array.from(new Set(matchedLabels))
  };
}

/**
 * Derives comprehensive feature set for an exercise from its metadata and static mapping
 */
function getExerciseFeatureSet(exercise) {
  const tags = new Set(EXERCISE_SPECIFIC_FEATURE_MAP[exercise.id] || []);

  // Derive muscle tag from category
  if (exercise.category === "胸部") tags.add("muscle:chest");
  if (exercise.category === "背部") tags.add("muscle:back");
  if (exercise.category === "肩部") tags.add("muscle:shoulder");
  if (exercise.category === "腿部") tags.add("muscle:legs");
  if (exercise.category === "核心") tags.add("muscle:core");
  if (exercise.category === "有氧") {
    tags.add("action:cardio");
    tags.add("equipment:cardio_machine");
  }
  if (exercise.category === "手臂") {
    if (exercise.target?.includes("二头") || exercise.name?.includes("弯举")) tags.add("muscle:biceps");
    if (exercise.target?.includes("三头") || exercise.name?.includes("下压") || exercise.name?.includes("臂屈伸")) tags.add("muscle:triceps");
  }

  // Derive posture & action from name and aliases
  const textBlob = [
    exercise.name,
    exercise.englishName,
    ...(exercise.aliases || []),
    exercise.scienceDetail || "",
    exercise.tips?.prep || "",
    exercise.tips?.execution || ""
  ].join(" ").toLowerCase();

  if (textBlob.includes("坐姿") || textBlob.includes("坐着") || textBlob.includes("座椅")) {
    tags.add("posture:seated");
  }
  if (textBlob.includes("躺") || textBlob.includes("仰卧") || textBlob.includes("靠板") || textBlob.includes("倒蹬") || textBlob.includes("哈克")) {
    tags.add("posture:lying_or_incline");
  }
  if (textBlob.includes("趴") || textBlob.includes("俯卧")) {
    tags.add("posture:prone");
  }
  if (textBlob.includes("站姿") || textBlob.includes("站立")) {
    tags.add("posture:standing");
  }

  // Action derivation
  if (textBlob.includes("推胸") || textBlob.includes("前推") || (textBlob.includes("推") && textBlob.includes("胸"))) {
    tags.add("action:push_forward");
  }
  if (textBlob.includes("推肩") || textBlob.includes("过头推") || textBlob.includes("推举")) {
    tags.add("action:push_up");
  }
  if (textBlob.includes("下拉") || textBlob.includes("高位下拉")) {
    tags.add("action:pull_down");
  }
  if (textBlob.includes("划船") || textBlob.includes("水平拉") || textBlob.includes("向后拉")) {
    tags.add("action:pull_back");
  }
  if (textBlob.includes("夹胸") || textBlob.includes("飞鸟")) {
    tags.add("action:chest_fly");
  }
  if (textBlob.includes("弯举")) {
    tags.add("action:curl");
  }
  if (textBlob.includes("下压") || textBlob.includes("臂屈伸")) {
    tags.add("action:pushdown");
  }
  if (textBlob.includes("蹬") || textBlob.includes("腿举") || textBlob.includes("倒蹬") || textBlob.includes("哈克")) {
    tags.add("action:leg_press");
  }
  if (textBlob.includes("腿屈伸") || textBlob.includes("伸膝")) {
    tags.add("action:leg_extension");
  }
  if (textBlob.includes("腿弯举") || textBlob.includes("屈膝")) {
    tags.add("action:leg_curl");
  }
  if (textBlob.includes("提踵")) {
    tags.add("action:calf_raise");
  }

  // Equipment derivation
  if (textBlob.includes("固定器械") || textBlob.includes("器械") || textBlob.includes("机")) {
    tags.add("equipment:general_machine");
  }
  if (textBlob.includes("绳索") || textBlob.includes("龙门架")) {
    tags.add("equipment:cable_crossover");
  }
  if (textBlob.includes("杠铃")) {
    tags.add("equipment:barbell");
  }
  if (textBlob.includes("哑铃")) {
    tags.add("equipment:dumbbell");
  }
  if (textBlob.includes("史密斯")) {
    tags.add("equipment:smith_machine");
  }
  if (textBlob.includes("杠杆") || textBlob.includes("悍马") || textBlob.includes("双轴")) {
    tags.add("equipment:lever_hammer_machine");
  }

  // Visual derivation
  if (textBlob.includes("黄色") || textBlob.includes("双轴") || textBlob.includes("杠杆") || tags.has("equipment:lever_hammer_machine")) {
    tags.add("visual:yellow");
  }
  if (textBlob.includes("斜面") || textBlob.includes("倾斜") || textBlob.includes("45度") || textBlob.includes("倒蹬") || textBlob.includes("哈克")) {
    tags.add("visual:incline_slant");
    tags.add("visual:large_machine");
  }

  return tags;
}

// --- 4. RECOGNITION & SCORING ALGORITHM ---

/**
 * Recognizes gym machine or exercise from colloquial natural language query, voice transcript, or multimodal labels.
 * 
 * @param {string} queryText - Colloquial query (e.g. "一个坐着手往前推的黄色杠杆器械")
 * @param {Array} allExercises - Exercise library (defaults to DEFAULT_EXERCISES, 109 items)
 * @param {Object} options - { limit: 10, threshold: 0.15 }
 * @returns {Array<{ exercise: Object, confidence: number, matchedFeatures: string[], reasoning: string }>}
 */
export function recognizeMachineByQuery(queryText, allExercises = DEFAULT_EXERCISES, options = {}) {
  const { limit = 10, threshold = 0.10 } = options;

  if (!queryText || typeof queryText !== "string" || !queryText.trim()) {
    return [];
  }

  const cleanQuery = queryText.trim().toLowerCase();
  const cleanNoPunctuation = cleanQuery.replace(/[\s\-_,，。！？!?;；]/g, "");
  if (cleanNoPunctuation.length === 0) {
    return [];
  }

  const { matchedEntries, detectedTags, matchedLabels } = extractQueryFeatures(cleanQuery);

  const results = [];

  for (const exercise of allExercises) {
    let score = 0;
    const matchedFeatures = [];
    const exerciseTags = getExerciseFeatureSet(exercise);

    // 1. Direct Text / Alias Match (Highest Priority)
    const exNameLower = exercise.name.toLowerCase();
    const exEngLower = (exercise.englishName || "").toLowerCase();

    if (cleanNoPunctuation.length >= 2 && exNameLower.length >= 2 && (cleanNoPunctuation.includes(exNameLower) || exNameLower.includes(cleanNoPunctuation))) {
      score += 0.95;
      matchedFeatures.push(`名称直接命中: ${exercise.name}`);
    }

    if (exercise.aliases && exercise.aliases.length > 0) {
      for (const alias of exercise.aliases) {
        const aLower = alias.toLowerCase();
        if (cleanNoPunctuation.length >= 2 && aLower.length >= 2 && cleanNoPunctuation.includes(aLower)) {
          score += 0.92;
          matchedFeatures.push(`别名命中: ${alias}`);
          break;
        }
      }
    }

    // 2. Feature Category Matching with Category Weights
    let actionScore = 0;
    let postureScore = 0;
    let equipmentScore = 0;
    let visualScore = 0;
    let muscleScore = 0;

    for (const entry of matchedEntries) {
      if (exerciseTags.has(entry.tag)) {
        if (entry.category === FEATURE_CATEGORIES.ACTION) {
          actionScore = Math.max(actionScore, 0.40);
          matchedFeatures.push(`动作力线: ${entry.label}`);
        } else if (entry.category === FEATURE_CATEGORIES.EQUIPMENT) {
          equipmentScore = Math.max(equipmentScore, 0.32);
          matchedFeatures.push(`器械构造: ${entry.label}`);
        } else if (entry.category === FEATURE_CATEGORIES.POSTURE) {
          postureScore = Math.max(postureScore, 0.18);
          matchedFeatures.push(`训练姿态: ${entry.label}`);
        } else if (entry.category === FEATURE_CATEGORIES.MUSCLE) {
          muscleScore = Math.max(muscleScore, 0.22);
          matchedFeatures.push(`目标肌群: ${entry.label}`);
        } else if (entry.category === FEATURE_CATEGORIES.VISUAL) {
          visualScore = Math.max(visualScore, 0.15);
          matchedFeatures.push(`外观材质: ${entry.label}`);
        }
      }
    }

    // Combine feature scores
    const featureSum = actionScore + equipmentScore + postureScore + muscleScore + visualScore;

    // Bonus: Compound Synergy Boost
    // When Action + Posture + Equipment all agree, this gives high certainty
    let synergyMultiplier = 1.0;
    if (actionScore > 0 && postureScore > 0) synergyMultiplier += 0.15;
    if (actionScore > 0 && equipmentScore > 0) synergyMultiplier += 0.15;
    if (actionScore > 0 && visualScore > 0) synergyMultiplier += 0.08;

    const totalCalculated = Math.max(score, featureSum * synergyMultiplier);
    
    // Normalize and cap confidence
    const confidence = Math.min(0.99, Math.round(totalCalculated * 100) / 100);

    if (confidence >= threshold) {
      // Build explanatory reasoning
      const uniqueFeatures = Array.from(new Set(matchedFeatures));
      let reasoning = "";
      if (confidence >= 0.85) {
        reasoning = `极高置信度推荐：精准匹配${uniqueFeatures.join("、")}，对应【${exercise.category}】王牌动作。`;
      } else if (confidence >= 0.50) {
        reasoning = `高度匹配：命中${uniqueFeatures.join("、")}，适合作为目标训练动作。`;
      } else {
        reasoning = `可能相关：局部符合${uniqueFeatures.join("、")}特征。`;
      }

      results.push({
        exercise,
        confidence,
        matchedFeatures: uniqueFeatures,
        reasoning
      });
    }
  }

  // Sort descending by confidence, then by exercise name length
  results.sort((a, b) => b.confidence - a.confidence);

  return results.slice(0, limit);
}

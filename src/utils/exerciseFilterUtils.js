/**
 * FITCYCLE Multi-Dimensional Exercise Filter & Biomechanical Taxonomy Engine
 */

export const EQUIPMENT_OPTIONS = [
  { key: "全部", label: "全部器械", icon: "🌐" },
  { key: "杠铃", label: "杠铃", icon: "🏋️" },
  { key: "哑铃", label: "哑铃", icon: "💪" },
  { key: "固定器械", label: "固定器械", icon: "⚙️" },
  { key: "绳索", label: "龙门架绳索", icon: "🔗" },
  { key: "自重", label: "自重/徒手", icon: "🤸" }
];

export const SUB_TARGET_MAP = {
  "胸部": ["全部", "上胸", "中胸", "下胸", "中缝内收"],
  "背部": ["全部", "背阔肌 (宽度)", "上背/斜方 (厚度)", "下背/竖脊肌"],
  "肩部": ["全部", "前束 (推举)", "中束 (侧平举)", "后束 (飞鸟/面拉)", "肩袖防伤"],
  "手臂": ["全部", "肱二头肌", "肱三头肌", "前臂/握力"],
  "腿部": ["全部", "股四头肌", "腘绳肌 (后侧)", "臀大/臀中肌", "大腿内收肌", "小腿提踵"],
  "核心": ["全部", "腹直肌 (上腹/下腹)", "腹斜肌 (侧腹)", "深层核心 (抗旋/抗伸)"],
  "热身": ["全部", "上肢激活", "下肢激活", "脊柱与核心"],
  "拉伸": ["全部", "上肢拉伸", "下肢拉伸", "肌筋膜滚压"]
};

// 黄金基石动作列表 (Top Foundation Staples)
export const STAPLE_EXERCISE_IDS = new Set([
  "ex-barbell-bench-press",
  "ex-incline-db-bench",
  "ex-chest-dips",
  "ex-barbell-back-squat",
  "ex-deadlift",
  "ex-pull-up",
  "ex-lat-pulldown",
  "ex-diverging-lat-pulldown",
  "ex-barbell-row",
  "ex-military-press",
  "ex-dumbbell-lateral-raise",
  "ex-barbell-curl",
  "ex-rope-pushdown",
  "ex-skull-crusher",
  "ex-bulgarian-split-squat",
  "ex-romanian-deadlift",
  "ex-hip-thrust",
  "ex-hanging-leg-raise",
  "ex-ab-wheel",
  "ex-sumo-deadlift",
  "ex-good-morning",
  "ex-dragon-flag"
]);

/**
 * 判断动作是否属于黄金基石动作
 */
export function isStapleExercise(exercise) {
  if (!exercise) return false;
  return STAPLE_EXERCISE_IDS.has(exercise.id) || 
         (exercise.tags && exercise.tags.some(t => t.includes("基石") || t.includes("三大项") || t.includes("王牌")));
}

/**
 * 提取或推断动作的器械类型 (Equipment)
 */
export function getExerciseEquipment(exercise) {
  if (!exercise) return "自重";
  if (exercise.equipment) return exercise.equipment;
  
  const text = `${exercise.name} ${(exercise.aliases || []).join(" ")} ${exercise.englishName || ""}`.toLowerCase();
  
  if (text.includes("杠铃") || text.includes("barbell") || text.includes("六角杠") || text.includes("trap bar")) {
    return "杠铃";
  }
  if (text.includes("哑铃") || text.includes("dumbbell") || text.includes("壶铃") || text.includes("kettlebell")) {
    return "哑铃";
  }
  if (text.includes("绳索") || text.includes("龙门架") || text.includes("cable") || text.includes("滑轮") || text.includes("拉力器")) {
    return "绳索";
  }
  if (text.includes("机") || text.includes("器械") || text.includes("史密斯") || text.includes("smith") || 
      text.includes("machine") || text.includes("lever") || text.includes("倒蹬") || text.includes("哈克") || 
      text.includes("蝴蝶") || text.includes("悍马") || text.includes("下拉") || text.includes("腿举") ||
      text.includes("腿屈伸") || text.includes("腿弯举") || text.includes("单车") || text.includes("跑步机") || 
      text.includes("划船机") || text.includes("椭圆机") || text.includes("楼梯机")) {
    return "固定器械";
  }
  if (text.includes("自重") || text.includes("俯卧撑") || text.includes("引体") || text.includes("臂屈伸") || 
      text.includes("平板") || text.includes("卷腹") || text.includes("徒手") || text.includes("bodyweight") || 
      text.includes("pushup") || text.includes("pullup") || text.includes("dip") || text.includes("跳绳") || 
      text.includes("开合跳") || text.includes("龙旗") || text.includes("爬行")) {
    return "自重";
  }
  return "自重";
}

/**
 * 提取或推断动作的细分肌群 (SubTarget)
 */
export function getExerciseSubTarget(exercise) {
  if (!exercise) return "";
  if (exercise.subTarget) return exercise.subTarget;
  
  const cat = exercise.category;
  const target = `${exercise.target || ""} ${exercise.name || ""}`.toLowerCase();
  
  if (cat === "胸部") {
    if (target.includes("上") || target.includes("锁骨") || target.includes("incline")) return "上胸";
    if (target.includes("下") || target.includes("底") || target.includes("decline") || target.includes("双杠")) return "下胸";
    if (target.includes("内") || target.includes("缝") || target.includes("夹") || target.includes("十字") || target.includes("飞鸟")) return "中缝内收";
    return "中胸";
  }
  
  if (cat === "背部") {
    if (target.includes("竖脊") || target.includes("下背") || target.includes("腰") || target.includes("硬拉") || target.includes("挺身") || target.includes("早安")) return "下背/竖脊肌";
    if (target.includes("厚") || target.includes("斜方") || target.includes("菱形") || target.includes("划船") || target.includes("耸肩")) return "上背/斜方 (厚度)";
    return "背阔肌 (宽度)";
  }
  
  if (cat === "肩部") {
    if (target.includes("袖") || target.includes("外旋") || target.includes("防伤") || target.includes("小圆") || target.includes("冈下") || target.includes("活动度")) return "肩袖防伤";
    if (target.includes("后") || target.includes("面拉") || target.includes("飞鸟") || target.includes("rear")) return "后束 (飞鸟/面拉)";
    if (target.includes("前") || target.includes("推") || target.includes("press") || target.includes("front")) return "前束 (推举)";
    return "中束 (侧平举)";
  }
  
  if (cat === "手臂") {
    if (target.includes("前臂") || target.includes("腕") || target.includes("握力") || target.includes("小臂") || target.includes("伸肌") || target.includes("屈肌")) return "前臂/握力";
    if (target.includes("三头") || target.includes("下压") || target.includes("臂屈伸") || target.includes("碎头") || target.includes("triceps")) return "肱三头肌";
    return "肱二头肌";
  }
  
  if (cat === "腿部") {
    if (target.includes("小腿") || target.includes("提踵") || target.includes("腓肠") || target.includes("比目鱼") || target.includes("胫骨")) return "小腿提踵";
    if (target.includes("内收") || target.includes("夹腿") || target.includes("大收肌")) return "大腿内收肌";
    if (target.includes("外展") || target.includes("中肌") || target.includes("侧臀") || target.includes("分腿")) return "臀中肌/侧臀";
    if (target.includes("臀大") || target.includes("臀推") || target.includes("臀桥") || target.includes("后踢") || target.includes("挺髋")) return "臀大/臀中肌";
    if (target.includes("腘绳") || target.includes("后侧") || target.includes("腿弯举") || target.includes("rdl") || target.includes("诺迪克")) return "腘绳肌 (后侧)";
    return "股四头肌";
  }
  
  if (cat === "核心") {
    if (target.includes("斜") || target.includes("转") || target.includes("侧") || target.includes("人鱼") || target.includes("雨刷") || target.includes("侧桥")) return "腹斜肌 (侧腹)";
    if (target.includes("深") || target.includes("横") || target.includes("抗") || target.includes("支撑") || target.includes("轮") || target.includes("鸟狗") || target.includes("死虫")) return "深层核心 (抗旋/抗伸)";
    return "腹直肌 (上腹/下腹)";
  }

  return "通用";
}

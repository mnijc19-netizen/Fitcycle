// Fitcycle Fast AI Workout Analysis & Recovery Engine

/**
 * Analyzes completed workout summary and historical logs
 * @param {Object} summary - Current workout summary object
 * @param {Array} workoutLogs - All historical workout logs
 * @param {string} skin - Current UI skin (default, cs, chamber)
 * @returns {Object} Comprehensive analysis report
 */
export function analyzeWorkoutSummary(summary, workoutLogs = [], skin = "default") {
  if (!summary) return null;

  const totalVol = summary.totalVolume || 0;
  const totalSets = summary.totalSets || 0;
  const durationMinutes = Math.max(1, Math.round((summary.durationSeconds || 60) / 60));
  const planName = summary.planName || "今日训练";

  // 1. Calculate Intensity & Volume Rating
  let intensityLevel = "标准达标";
  let intensityScore = 80;
  let intensityColor = "emerald";
  let volumeTag = "肌肥大有效容量";

  if (totalVol >= 8000 || totalSets >= 20) {
    intensityLevel = "🔥 极高强度 · 超量刺激";
    intensityScore = 96;
    intensityColor = "amber";
    volumeTag = "高容量大负荷";
  } else if (totalVol >= 4000 || totalSets >= 14) {
    intensityLevel = "⚡ 充沛刺激 · 黄金肥大区";
    intensityScore = 88;
    intensityColor = "sky";
    volumeTag = "黄金增肌容量";
  } else if (totalVol >= 1500 || totalSets >= 8) {
    intensityLevel = "🎯 精准适度 · 维持刺激";
    intensityScore = 80;
    intensityColor = "emerald";
    volumeTag = "标准训练容量";
  } else {
    intensityLevel = "🌱 轻度刺激 · 基础唤醒";
    intensityScore = 70;
    intensityColor = "zinc";
    volumeTag = "低容量恢复";
  }

  // 2. Progressive Overload Comparison
  const previousSamePlanLogs = (workoutLogs || []).filter(
    log => log.id !== summary.id && log.planId === summary.planId
  );
  
  let overloadText = "首度开练该分化，已建立基准力量档案！";
  let overloadDelta = 0;
  let overloadPercent = 0;
  let isOverloadPositive = true;

  if (previousSamePlanLogs.length > 0) {
    const lastLog = previousSamePlanLogs[0];
    const prevVol = lastLog.totalVolume || 0;
    if (prevVol > 0) {
      overloadDelta = totalVol - prevVol;
      overloadPercent = Math.round(((totalVol - prevVol) / prevVol) * 100);
      if (overloadDelta > 0) {
        overloadText = `较上次同分化总容量提升 +${overloadPercent}% (+${overloadDelta}kg)，成功达成渐进超负荷！`;
        isOverloadPositive = true;
      } else if (overloadDelta === 0) {
        overloadText = `与上次容量持平 (${totalVol}kg)，力量维持稳定，下次可尝试提升微重量！`;
        isOverloadPositive = true;
      } else {
        overloadText = `容量为上次的 ${Math.max(0, 100 + overloadPercent)}%，今日更侧重动作控制与离心拉伸。`;
        isOverloadPositive = false;
      }
    }
  }

  // 3. Muscle Group Breakdown & Tactical Coach Feedback
  let muscleFocus = "全身肌群";
  let coachComment = "今日动作执行完整，核心肌群得到深度充血。";

  if (planName.includes("推") || planName.includes("Push")) {
    muscleFocus = "胸大肌 (上胸/中胸) · 三角肌前中束 · 肱三头肌";
    coachComment = "卧推与推举复合动作充分撕裂胸肩纤维，离心阶段控制稳定，泵感饱满！";
  } else if (planName.includes("拉") || planName.includes("Pull")) {
    muscleFocus = "背阔肌 (宽度) · 上背斜方肌 (厚度) · 肱二头肌";
    coachComment = "高位下拉与划船动作拉伸充分，V字背身与大圆肌充血显著，手臂辅助发力恰到好处！";
  } else if (planName.includes("腿") || planName.includes("Leg")) {
    muscleFocus = "股四头肌 · 腘绳肌 · 臀大肌 · 小腿";
    coachComment = "下肢大肌群高能消耗，深蹲与腿举神经激活强烈，下肢代谢压力与睾酮刺激极佳！";
  } else if (planName.includes("肩") || planName.includes("臂") || planName.includes("Arm")) {
    muscleFocus = "三角肌三束 · 肱二头肌 · 肱三头肌";
    coachComment = "肩臂孤立动作力竭充分，侧平举与弯举带来极度饱满的3D球形泵感！";
  }

  // 4. Personalized Nutrition & Recovery Calculations (Based on volume)
  const targetProteinGrams = Math.min(45, Math.max(22, Math.round(20 + totalVol / 1200)));
  const targetCarbGrams = Math.min(70, Math.max(30, Math.round(25 + totalVol / 800)));
  const targetWaterMl = Math.min(1000, Math.max(400, Math.round(300 + durationMinutes * 10)));

  const nutritionAdvice = `建议在练后 30-45 分钟内摄入 ${targetProteinGrams}g 优质蛋白质 (乳清蛋白粉/鸡胸肉) + ${targetCarbGrams}g 快速碳水化合物 (香蕉/白米饭/燕麦)，并补充 ${targetWaterMl}ml 电解质水。`;
  const sleepAdvice = `今晚确保 7.5 - 8.5 小时深度睡眠，睡眠期间生长激素分泌峰值将促成肌原纤维超量恢复。`;

  // 5. Skin Tactical Tone Flavor
  let tacticalBadge = "AI 智能教练认证";
  if (skin === "cs") {
    tacticalBadge = "🎯 CS2 战术特训 · 战斗评级 S";
    coachComment = `[战术复盘] 枪枪命中！今日输出总伤害 ${totalVol}，已成功占领并巩固包点，准备下一轮购买！`;
  } else if (skin === "chamber") {
    tacticalBadge = "⚜️ Chamber 精密打击认证";
    coachComment = `[法式优雅] 一击必杀。${totalVol}kg 的精准做工完美符合顶级特工的体能标准。`;
  }

  return {
    intensityLevel,
    intensityScore,
    intensityColor,
    volumeTag,
    overloadText,
    overloadDelta,
    overloadPercent,
    isOverloadPositive,
    muscleFocus,
    coachComment,
    targetProteinGrams,
    targetCarbGrams,
    targetWaterMl,
    nutritionAdvice,
    sleepAdvice,
    tacticalBadge
  };
}
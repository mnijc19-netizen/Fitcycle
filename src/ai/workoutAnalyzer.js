// Fitcycle Scientific Workout Analysis, Progressive Overload & Sports-Nutrition Engine

/**
 * Objective Sports-Science Rating Thresholds & Hierarchy:
 * - Grade D (未达标): 0 sets or 0 volume. No mechanical tension achieved.
 * - Grade C (轻量激活): < 6 sets or < 1200kg. Light warm-up / neural prep only.
 * - Grade B (维持达标): 6-9 sets & 1200-2999kg. Moderate volume for muscle maintenance.
 * - Grade A (黄金肥大): 10-13 sets & 3000-6499kg. Optimum hypertrophic volume & stimulus.
 * - Grade S (超量过载): >= 14 sets & >= 6500kg. Extreme volume & deep mechanical breakdown.
 */

const NUTRITION_ROTATION_POOL = [
  (p, c, w) => `【黄金吸收窗口】练后 30-45 分钟内补充 ${p}g 优质蛋白质 (乳清蛋白/鸡胸肉) + ${c}g 快速碳水化合物 (香蕉/白米饭)，促发胰岛素峰值将氨基酸高速泵入肌细胞。`,
  (p, c, w) => `【细胞充水与ATP再合成】摄入 5g 一水肌酸并补充 ${w}ml 钠钾电解质水，快速重构肌细胞磷酸原系统，加速肌浆网水分充盈。`,
  (p, c, w) => `【抗炎与微量元素补给】晚间随餐摄入优质 Omega-3 鱼油与锌镁片 (ZMA)，有效抑制大负荷做工后的皮质醇上升，加速肌原纤维修复。`,
  (p, c, w) => `【亮氨酸促合成通路】练后摄入含高生物价全蛋白餐食（鸡蛋/瘦牛肉/乳清），确保单次摄入不少于 3g 游离亮氨酸，启动 mTOR 增肌信号。`
];

const RECOVERY_ROTATION_POOL = [
  () => `【慢波深度睡眠】今晚确保 7.5 - 8.5 小时深度睡眠，生长激素 (GH) 分泌峰值将在入睡后前两个慢波深睡周期脉冲式爆发。`,
  () => `【筋膜张力释放】练后对本次主发力肌群进行 5-10 分钟低频筋膜枪放松或泡沫轴滚动，释放肌小节筋膜结节并改善局部血流。`,
  () => `【温水循环代谢】沐浴时使用温热水冲淋靶向发力部位，通过血管舒张刺激微循环，加速肌酸激酶与代谢副产物排出。`,
  () => `【自主神经调谐】睡前 30 分钟远离强光蓝光，通过 5 分钟深长横膈膜腹式呼吸激活副交感神经系统，平复交感神经亢奋。`
];

/**
 * Analyzes completed workout summary and historical logs with objective rigor
 */
export function analyzeWorkoutSummary(summary, workoutLogs = [], skin = "default") {
  if (!summary) return null;

  const totalVol = summary.totalVolume || 0;
  const totalSets = summary.totalSets || 0;
  const durationMinutes = Math.max(1, Math.round((summary.durationSeconds || 60) / 60));
  const planName = summary.planName || "今日训练";

  // 1. Objective Scientific Rating & Tone Engine
  let intensityLevel = "🎯 评级 B · 维持刺激";
  let intensityScore = 80;
  let intensityColor = "emerald";
  let volumeTag = "标准维持容量";
  let coachComment = "完成基础有效抗阻做工，肌群受到适度机械张力。";
  let tacticalBadge = "AI 智能教练 · 评级 B";

  if (totalSets === 0 || totalVol === 0) {
    intensityLevel = "⚠️ 评级 D · 无效做工";
    intensityScore = 40;
    intensityColor = "red";
    volumeTag = "未记录有效组数";
    coachComment = "未记录到有效抗阻做工 (0组/0kg)。肌纤维未受到机械张力与离心破坏。请至少完成 8-12 组正式组以确保有效增肌！";
    tacticalBadge = skin === "cs" ? "🎯 CS2 战术特训 · 评级 D (未交火撤离)" : "AI 教练 · 评级 D (未达标)";
  } else if (totalSets < 6 || totalVol < 1200) {
    intensityLevel = "🌱 评级 C · 轻量激活";
    intensityScore = 65;
    intensityColor = "zinc";
    volumeTag = "低容量唤醒";
    coachComment = `本次做工量偏低 (${totalVol}kg / ${totalSets}组)，刺激深度仅达神经唤醒与热身级别，尚未进入黄金肌肥大破坏区间。`;
    tacticalBadge = skin === "cs" ? "🎯 CS2 战术特训 · 评级 C (基础侦察)" : "AI 教练 · 评级 C (轻量唤醒)";
  } else if (totalSets >= 14 && totalVol >= 6500) {
    intensityLevel = "🔥 评级 S · 超量过载突破";
    intensityScore = 96;
    intensityColor = "amber";
    volumeTag = "超量大负荷";
    coachComment = `极高强度大容量轰炸 (${totalVol}kg / ${totalSets}组)！深层快肌纤维深度力竭，超量刺激极佳，务必重视今晚的黄金恢复窗口！`;
    tacticalBadge = skin === "cs" ? "🎯 CS2 战术特训 · 战斗评级 S (全场 MVP)" : "AI 教练 · 评级 S (超量过载)";
  } else if (totalSets >= 10 && totalVol >= 3000) {
    intensityLevel = "⚡ 评级 A · 黄金肌肥大";
    intensityScore = 88;
    intensityColor = "sky";
    volumeTag = "黄金有效容量";
    coachComment = `训练量充沛达标 (${totalVol}kg / ${totalSets}组)！主项复合动作机械张力充足，代谢压力饱满，进入最佳肌原纤维撕裂增生区！`;
    tacticalBadge = skin === "cs" ? "🎯 CS2 战术特训 · 战斗评级 A (火力全开)" : "AI 教练 · 评级 A (黄金肥大)";
  } else {
    intensityLevel = "🎯 评级 B · 维持刺激";
    intensityScore = 80;
    intensityColor = "emerald";
    volumeTag = "标准维持容量";
    coachComment = `完成标准训练量 (${totalVol}kg / ${totalSets}组)，肌群受到适度机械张力，可有效维持肌肉截面积与肌糖原容量。`;
    tacticalBadge = skin === "cs" ? "🎯 CS2 战术特训 · 战斗评级 B (常规交火)" : "AI 教练 · 评级 B (维持刺激)";
  }

  // 2. Progressive Overload Multi-Dimensional Analysis
  const previousSamePlanLogs = (workoutLogs || []).filter(
    log => log.id !== summary.id && log.planId === summary.planId
  );
  
  let overloadText = "首度开练该分化，已建立力量基准档案！下一循环建议尝试记录主项微加重。";
  let overloadDelta = 0;
  let overloadPercent = 0;
  let isOverloadPositive = true;

  if (totalSets === 0 || totalVol === 0) {
    overloadText = "本次未完成有效做工，无法计算超负荷。请在下次训练中完整记录每组重量与次数。";
    isOverloadPositive = false;
  } else if (previousSamePlanLogs.length > 0) {
    const lastLog = previousSamePlanLogs[0];
    const prevVol = lastLog.totalVolume || 0;
    const prevSets = lastLog.totalSets || 0;

    if (prevVol > 0) {
      overloadDelta = totalVol - prevVol;
      overloadPercent = Math.round(((totalVol - prevVol) / prevVol) * 100);
      
      if (overloadDelta > 0) {
        overloadText = `【容量超负荷达成】较上次同分化总做工提升 +${overloadPercent}% (+${overloadDelta}kg)，有效推动肌肥大适应！`;
        isOverloadPositive = true;
      } else if (overloadDelta === 0) {
        overloadText = `【负荷维持】与上次总容量持平 (${totalVol}kg)。若今日离心控制更慢或组间休息更短，同样达成了做工密度超负荷！`;
        isOverloadPositive = true;
      } else {
        overloadText = `【负荷回调】本次总容量为上次的 ${Math.max(0, 100 + overloadPercent)}% (少 ${Math.abs(overloadDelta)}kg / ${Math.max(0, prevSets - totalSets)}组)，更侧重离心控制与疲劳管理。`;
        isOverloadPositive = false;
      }
    }
  }

  // 3. Muscle Group Breakdown
  let muscleFocus = "全身肌群";
  if (planName.includes("推") || planName.includes("Push")) {
    muscleFocus = "胸大肌 (上胸/中胸) · 三角肌前中束 · 肱三头肌";
  } else if (planName.includes("拉") || planName.includes("Pull")) {
    muscleFocus = "背阔肌 (宽度) · 上背斜方肌 (厚度) · 肱二头肌";
  } else if (planName.includes("腿") || planName.includes("Leg")) {
    muscleFocus = "股四头肌 · 腘绳肌 · 臀大肌 · 小腿";
  } else if (planName.includes("肩") || planName.includes("臂") || planName.includes("Arm")) {
    muscleFocus = "三角肌三束 · 肱二头肌 · 肱三头肌";
  }

  // 4. Personalized Nutrition & Recovery Calculations (Dynamic Rotation Pool)
  const targetProteinGrams = Math.min(45, Math.max(20, Math.round(18 + totalVol / 1200)));
  const targetCarbGrams = Math.min(75, Math.max(25, Math.round(20 + totalVol / 750)));
  const targetWaterMl = Math.min(1000, Math.max(350, Math.round(300 + durationMinutes * 12)));

  // Dynamic selection using day-of-year + volume seed so it rotates every session
  const seed = (Math.floor(Date.now() / 60000) + totalVol + totalSets) % NUTRITION_ROTATION_POOL.length;
  const nutritionAdvice = NUTRITION_ROTATION_POOL[seed](targetProteinGrams, targetCarbGrams, targetWaterMl);
  const sleepAdvice = RECOVERY_ROTATION_POOL[(seed + 1) % RECOVERY_ROTATION_POOL.length]();

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

/**
 * Builds a structured markdown prompt summarizing the workout session for deep AI coaching
 */
export function buildDetailedWorkoutPrompt(summary) {
  if (!summary) return "";
  const durationMin = Math.max(1, Math.round((summary.durationSeconds || 60) / 60));
  let text = `我刚刚完成了【${summary.planName || '今日训练'}】！\n\n`;
  text += `📊 **本次训练客观数据：**\n`;
  text += `- 训练用时: ${durationMin} 分钟\n`;
  text += `- 累计总容量: ${summary.totalVolume || 0} kg\n`;
  text += `- 完成总组数: ${summary.totalSets || 0} 组\n`;
  
  if (Array.isArray(summary.exercises) && summary.exercises.length > 0) {
    text += `- 各动作实测明细:\n`;
    summary.exercises.forEach((ex, idx) => {
      const completedSets = (ex.sets || []).filter(s => s.completed);
      const setsDetail = completedSets.length > 0
        ? completedSets.map(s => `${s.weight}kg x ${s.reps}次`).join("、")
        : "未记录到有效完成组";
      text += `  ${idx + 1}. **${ex.name}**: ${completedSets.length}组 (${setsDetail})\n`;
    });
  }

  text += `\n请AI智能教练【严格、客观、科学】地根据我本次的数据进行深度复盘：\n`;
  text += `1. 动作负荷分配与组数做工是否充分达到肌肥大门槛？\n`;
  text += `2. 结合我的具体重量和次数，指出下次训练如何从【重量、次数或离心质量】上实现渐进超负荷？\n`;
  text += `3. 针对今日主刺激肌群给出精准的练后营养补给与超量恢复方案！`;
  return text;
}

/**
 * Builds an instant structured coach response in case offline reference is required
 */
export function buildInstantWorkoutCoachResponse(summary, analysis) {
  if (!summary || !analysis) return "";
  const durationMin = Math.max(1, Math.round((summary.durationSeconds || 60) / 60));

  let resp = `### 🏆 今日【${summary.planName}】AI 智能深度复盘\n\n`;
  resp += `> **训练总评：** ${analysis.intensityLevel} (用时 ${durationMin}分钟 / 总容量 ${summary.totalVolume}kg / 完成 ${summary.totalSets}组)\n\n`;
  resp += `#### 1. 🎯 靶向肌群与动作做工分析\n`;
  resp += `- **主刺激部位：** ${analysis.muscleFocus}\n`;
  resp += `- **教练点评：** ${analysis.coachComment}\n\n`;
  
  resp += `#### 2. 📈 渐进超负荷与进阶建议\n`;
  resp += `- **超负荷态势：** ${analysis.overloadText}\n`;
  resp += `- **下一循环目标：** 保持当前主项动作第一组重量，若能稳定完成 10-12 次以上，下一轮训练建议尝试递增 +1.25kg ~ +2.5kg 微重量突破！\n\n`;

  resp += `#### 3. 🥗 运动科学营养与超量恢复\n`;
  resp += `- **蛋白质与碳水窗口：** ${analysis.nutritionAdvice}\n`;
  resp += `- **神经与肌纤维修复：** ${analysis.sleepAdvice}\n\n`;
  resp += `*你有任何动作发力感或替换动作的疑问，可以直接在下方继续问我！*`;
  
  return resp;
}
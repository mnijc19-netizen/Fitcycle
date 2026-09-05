import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { 
  store, 
  startRestTimer, 
  stopRestTimer, 
  toggleSetCompletion, 
  startWorkout, 
  finishWorkout, 
  discardActiveWorkout, 
  resumeWorkoutFromSummary,
  addSetToExercise,
  syncSetDataToSubsequentSets,
  addExerciseToActiveWorkout,
  addExerciseToPlan
} from "../src/store/fitnessStore.js";
import { DEFAULT_PLANS, SPLIT_RECOMMENDED_ADDONS } from "../src/data/defaultPlans.js";
import { analyzeWorkoutSummary } from "../src/ai/workoutAnalyzer.js";
import StatsView from "../src/views/StatsView.vue";
import TodayView from "../src/views/TodayView.vue";
import WorkoutSummaryModal from "../src/components/WorkoutSummaryModal.vue";

describe("Rest Presets, Carousel, Auto-Finish & AI Analysis Upgrades", () => {
  beforeEach(() => {
    store.settings.defaultRestSeconds = 90;
    store.settings.unlockedSkins = ["default", "chamber", "cs"];
    stopRestTimer();
    if (store.activeWorkout) discardActiveWorkout();
  });

  afterEach(() => {
    stopRestTimer();
    if (store.activeWorkout) discardActiveWorkout();
  });

  it("provides 60s, 90s, 120s, 180s scientific presets in StatsView settings", async () => {
    const wrapper = mount(StatsView);
    const html = wrapper.html();
    
    expect(html).toContain("60s");
    expect(html).toContain("90s");
    expect(html).toContain("120s");
    expect(html).toContain("180s");
    expect(html).toContain("标准推荐");
  });

  it("renders horizontal scrollable skin carousel without stacking cards vertically", () => {
    const wrapper = mount(StatsView);
    const html = wrapper.html();
    
    expect(html).toContain("snap-x");
    expect(html).toContain("overflow-x-auto");
    expect(html).toContain("默认外观");
    expect(html).toContain("尚博勒");
    expect(html).toContain("CS2 特训");
  });

  it("defaults startRestTimer to 90s standard hypertrophy time", () => {
    startRestTimer();
    expect(store.restTimer.running).toBe(true);
    expect(store.restTimer.duration).toBe(90);
    expect(store.restTimer.remaining).toBe(90);
  });

  it("supports hand-slip resume workout from summary seamlessly", () => {
    startWorkout("plan-push");
    expect(store.activeWorkout).not.toBeNull();
    
    // Complete 1 set
    toggleSetCompletion(0, 0);
    const summary = finishWorkout();
    
    expect(store.activeWorkout).toBeNull();
    expect(store.workoutLogs.length).toBeGreaterThan(0);
    expect(store.workoutLogs[0].id).toBe(summary.id);

    // Hand-slip undo / resume
    const resumed = resumeWorkoutFromSummary(summary);
    expect(resumed).toBe(true);
    expect(store.activeWorkout).not.toBeNull();
    expect(store.activeWorkout.planId).toBe("plan-push");
    expect(store.activeWorkout.exercises[0].sets[0].completed).toBe(true);
    // Log entry was removed from history
    expect(store.workoutLogs.some(l => l.id === summary.id)).toBe(false);
  });

  it("generates fast sports-science AI analysis for workout summary", () => {
    const fakeSummary = {
      id: "test_summary_1",
      planId: "plan-pull",
      planName: "Day 2: 拉日 (Pull) —— 拓宽V字腰身",
      durationSeconds: 3600,
      totalVolume: 5200,
      totalSets: 16
    };

    const pastLogs = [
      {
        id: "past_log_1",
        planId: "plan-pull",
        totalVolume: 4800
      }
    ];

    const analysis = analyzeWorkoutSummary(fakeSummary, pastLogs, "cs");
    expect(analysis).not.toBeNull();
    expect(analysis.intensityScore).toBeGreaterThanOrEqual(80);
    expect(analysis.overloadPercent).toBe(8);
    expect(analysis.targetProteinGrams).toBeGreaterThanOrEqual(20);
    expect(analysis.targetCarbGrams).toBeGreaterThanOrEqual(25);
    expect(analysis.tacticalBadge).toContain("CS2");

    // Test Grade D for 0 sets / 0 volume
    const emptySummary = {
      id: "test_empty_1",
      planId: "plan-pull",
      planName: "拉日 (Pull)",
      durationSeconds: 60,
      totalVolume: 0,
      totalSets: 0
    };
    const emptyAnalysis = analyzeWorkoutSummary(emptySummary, [], "cs");
    expect(emptyAnalysis.intensityLevel).toContain("评级 D");
    expect(emptyAnalysis.tacticalBadge).toContain("评级 D");
    expect(emptyAnalysis.coachComment).toContain("未记录到有效抗阻做工");
  });

  it("renders AI Analysis Card and Hand-Slip button in WorkoutSummaryModal", () => {
    const summary = {
      id: "test_summary_2",
      planId: "plan-push",
      planName: "推日 (Push)",
      durationSeconds: 2400,
      totalVolume: 3500,
      totalSets: 12
    };

    const wrapper = mount(WorkoutSummaryModal, {
      props: {
        visible: true,
        summary
      }
    });

    const html = wrapper.html();
    expect(html).toContain("渐进超负荷分析");
    expect(html).toContain("补给");
    expect(html).toContain("手滑了？返回继续本次训练");
    expect(html).toContain("呼叫 AI 智能教练深度复盘");
  });

  it("renders tactical readiness urgency counter and muscle recovery card in TodayView", () => {
    const wrapper = mount(TodayView);
    const html = wrapper.html();
    expect(html).toContain("怠惰计时");
    expect(html).toContain("肌群状态");
    expect(html).toContain("立即开练");
  });

  it("renders Deload Shield active state across TodayView when shield is active", () => {
    store.honorProfile.deloadShieldUntil = Date.now() + 7 * 86400000;
    const wrapper = mount(TodayView);
    const html = wrapper.html();
    expect(html).toContain("战术免战休整期");
    expect(html).toContain("战力已冻结");
    expect(html).toContain("提前归队");
  });

  it("streamlines default plans to 3 golden core exercises with 3 sets each for beginner safety", () => {
    const pushPlan = DEFAULT_PLANS.find(p => p.id === "plan-push");
    const pullPlan = DEFAULT_PLANS.find(p => p.id === "plan-pull");
    const legsPlan = DEFAULT_PLANS.find(p => p.id === "plan-legs");

    expect(pushPlan.exercises.length).toBe(3);
    expect(pullPlan.exercises.length).toBe(3);
    expect(legsPlan.exercises.length).toBe(3);

    // Each exercise defaults to 3 sets
    pushPlan.exercises.forEach(e => expect(e.setsCount).toBe(3));
    pullPlan.exercises.forEach(e => expect(e.setsCount).toBe(3));
    legsPlan.exercises.forEach(e => expect(e.setsCount).toBe(3));

    // Total beginner session volume is exactly 9 sets
    const pushTotalSets = pushPlan.exercises.reduce((sum, e) => sum + e.setsCount, 0);
    expect(pushTotalSets).toBe(9);
  });

  it("provides split-specific beginner recommended add-ons pool (SPLIT_RECOMMENDED_ADDONS)", () => {
    expect(SPLIT_RECOMMENDED_ADDONS["plan-push"]).toBeDefined();
    expect(SPLIT_RECOMMENDED_ADDONS["plan-push"].length).toBeGreaterThanOrEqual(2);
    expect(SPLIT_RECOMMENDED_ADDONS["plan-pull"]).toBeDefined();
    expect(SPLIT_RECOMMENDED_ADDONS["plan-legs"]).toBeDefined();

    // Check specific golden exercise names
    const pushNames = SPLIT_RECOMMENDED_ADDONS["plan-push"].map(e => e.name);
    expect(pushNames).toContain("坐姿哑铃推肩");
    expect(pushNames).toContain("过头绳索臂屈伸");
  });

  it("synchronizes set weights intelligently to subsequent uncompleted sets (Smart Cascade)", () => {
    startWorkout("plan-push");
    expect(store.activeWorkout).not.toBeNull();
    const firstEx = store.activeWorkout.exercises[0];
    expect(firstEx.sets.length).toBe(3);

    // Initial weight of all 3 sets
    expect(firstEx.sets[0].weight).toBe(20);
    expect(firstEx.sets[1].weight).toBe(20);
    expect(firstEx.sets[2].weight).toBe(20);

    // User updates set 1 weight to 25kg and triggers sync
    firstEx.sets[0].weight = 25;
    const syncedCount = syncSetDataToSubsequentSets(0, 0, false);
    expect(syncedCount).toBe(2);

    // Subsequent uncompleted sets 1 and 2 now have 25kg
    expect(firstEx.sets[1].weight).toBe(25);
    expect(firstEx.sets[2].weight).toBe(25);

    // If set 1 is completed, subsequent sync does not overwrite completed sets
    firstEx.sets[1].completed = true;
    firstEx.sets[0].weight = 30;
    const secondSyncCount = syncSetDataToSubsequentSets(0, 0, false);
    expect(secondSyncCount).toBe(1); // only set 2 was synced
    expect(firstEx.sets[1].weight).toBe(25); // untouched because completed
    expect(firstEx.sets[2].weight).toBe(30);
  });

  it("inherits previous set weight and reps when adding a new set", () => {
    startWorkout("plan-push");
    const firstEx = store.activeWorkout.exercises[0];
    firstEx.sets[2].weight = 27.5;
    firstEx.sets[2].reps = 12;

    addSetToExercise(0);
    expect(firstEx.sets.length).toBe(4);
    const newSet = firstEx.sets[3];
    expect(newSet.setNum).toBe(4);
    expect(newSet.weight).toBe(27.5);
    expect(newSet.reps).toBe(12);
    expect(newSet.completed).toBe(false);
  });

  it("adds exercise with 3 sets directly to active workout or plan", () => {
    startWorkout("plan-push");
    const initialExCount = store.activeWorkout.exercises.length;

    const addonEx = {
      id: "ex-seated-dumbbell-shoulder-press",
      name: "坐姿哑铃推肩",
      defaultSets: 3,
      defaultWeight: 20
    };

    addExerciseToActiveWorkout(addonEx);
    expect(store.activeWorkout.exercises.length).toBe(initialExCount + 1);
    const added = store.activeWorkout.exercises[store.activeWorkout.exercises.length - 1];
    expect(added.name).toBe("坐姿哑铃推肩");
    expect(added.sets.length).toBe(3);
    expect(added.sets[0].weight).toBe(20);

    // Also test adding to plan
    const success = addExerciseToPlan("plan-pull", {
      exerciseId: "ex-face-pull",
      name: "绳索面拉 (Face Pull)",
      defaultSets: 3,
      defaultWeight: 15
    });
    expect(success).toBe(true);
    const pullPlan = store.plans.find(p => p.id === "plan-pull");
    expect(pullPlan.exercises.some(e => e.name.includes("面拉"))).toBe(true);
  });

  it("renders beginner quick-add recommendation chips in TodayView", () => {
    if (store.activeWorkout) discardActiveWorkout();
    const wrapper = mount(TodayView);
    const html = wrapper.html();
    expect(html).toContain("新手简易加动作");
    expect(html).toContain("科学配比 · 3组");
  });
});
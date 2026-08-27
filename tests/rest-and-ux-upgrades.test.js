import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { store, startRestTimer, stopRestTimer, toggleSetCompletion, startWorkout, finishWorkout, discardActiveWorkout, resumeWorkoutFromSummary } from "../src/store/fitnessStore.js";
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
});
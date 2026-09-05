import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { 
  store, 
  startWorkout, 
  discardActiveWorkout, 
  toggleSetCompletion,
  setStrengthLevelAndRecalibrate,
  setExerciseAllSetsWeight,
  adjustExerciseAllSetsWeight,
  syncFirstSetToAllSets,
  addExerciseToActiveWorkout,
  STRENGTH_LEVEL_CONFIGS
} from "../src/store/fitnessStore.js";
import TodayView from "../src/views/TodayView.vue";
import StatsView from "../src/views/StatsView.vue";
import StrengthPlacementModal from "../src/components/StrengthPlacementModal.vue";
import UserOnboardingModal from "../src/components/UserOnboardingModal.vue";

describe("Strength Level Calibration & Ergonomic Weight Adjustments", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    store.workoutLogs = [];
    store.honorProfile = null;
    store.settings.strengthLevel = "intermediate";
    store.settings.hasConfiguredStrength = false;
    store.settings.themeMode = "dark";
    if (store.activeWorkout) discardActiveWorkout();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    if (store.activeWorkout) discardActiveWorkout();
  });

  it("provides scientific configurations for beginner, intermediate, and advanced levels", () => {
    expect(STRENGTH_LEVEL_CONFIGS.beginner).toBeDefined();
    expect(STRENGTH_LEVEL_CONFIGS.intermediate).toBeDefined();
    expect(STRENGTH_LEVEL_CONFIGS.advanced).toBeDefined();

    expect(STRENGTH_LEVEL_CONFIGS.beginner.initialScore).toBe(200);
    expect(STRENGTH_LEVEL_CONFIGS.intermediate.initialScore).toBe(850);
    expect(STRENGTH_LEVEL_CONFIGS.advanced.initialScore).toBe(1400);

    expect(STRENGTH_LEVEL_CONFIGS.beginner.weights["哈克深蹲 / 倒蹬腿举"]).toBeLessThan(
      STRENGTH_LEVEL_CONFIGS.advanced.weights["哈克深蹲 / 倒蹬腿举"]
    );
  });

  it("re-calibrates all default plan exercises when changing strength level", () => {
    setStrengthLevelAndRecalibrate("beginner");
    expect(store.settings.strengthLevel).toBe("beginner");
    expect(store.settings.hasConfiguredStrength).toBe(true);

    const pushPlan = store.plans.find(p => p.id === "plan-push");
    const dumbbellPress = pushPlan.exercises.find(e => e.name === "上斜哑铃卧推");
    expect(dumbbellPress.defaultWeight).toBe(12.5);

    setStrengthLevelAndRecalibrate("advanced");
    expect(store.settings.strengthLevel).toBe("advanced");
    const advancedDumbbellPress = pushPlan.exercises.find(e => e.name === "上斜哑铃卧推");
    expect(advancedDumbbellPress.defaultWeight).toBe(30);
  });

  it("re-calibrates active workout uncompleted sets when strength level is updated mid-workout", () => {
    setStrengthLevelAndRecalibrate("intermediate");
    startWorkout("plan-push");

    const ex0 = store.activeWorkout.exercises[0];
    toggleSetCompletion(0, 0);
    expect(ex0.sets[0].completed).toBe(true);
    const completedSetWeight = ex0.sets[0].weight;

    setStrengthLevelAndRecalibrate("advanced");

    expect(ex0.sets[0].weight).toBe(completedSetWeight);
    expect(ex0.sets[1].weight).toBe(STRENGTH_LEVEL_CONFIGS.advanced.weights[ex0.name]);
    expect(ex0.sets[2].weight).toBe(STRENGTH_LEVEL_CONFIGS.advanced.weights[ex0.name]);
  });

  it("scales custom base weights rationally when user inputs their bench/squat/pull PRs", () => {
    setStrengthLevelAndRecalibrate("custom", { bench: 100, squat: 140, pull: 90 });
    expect(store.settings.strengthLevel).toBe("custom");
    expect(store.settings.customBaseWeights.bench).toBe(100);

    const legsPlan = store.plans.find(p => p.id === "plan-legs");
    const squatEx = legsPlan.exercises.find(e => e.name === "哈克深蹲 / 倒蹬腿举");
    expect(squatEx.defaultWeight).toBe(125);
  });

  it("adjustExerciseAllSetsWeight adjusts all uncompleted sets by delta and preserves completed ones", () => {
    startWorkout("plan-push");
    const ex = store.activeWorkout.exercises[0];
    const initialWeight = ex.sets[0].weight;

    toggleSetCompletion(0, 0);
    adjustExerciseAllSetsWeight(0, 10);

    expect(ex.sets[0].weight).toBe(initialWeight);
    expect(ex.sets[1].weight).toBe(initialWeight + 10);
    expect(ex.sets[2].weight).toBe(initialWeight + 10);
  });

  it("syncFirstSetToAllSets synchronizes Set 1 weight and reps to subsequent uncompleted sets", () => {
    startWorkout("plan-push");
    const ex = store.activeWorkout.exercises[0];

    ex.sets[0].weight = 80;
    ex.sets[0].reps = 8;

    syncFirstSetToAllSets(0);

    expect(ex.sets[1].weight).toBe(80);
    expect(ex.sets[1].reps).toBe(8);
    expect(ex.sets[2].weight).toBe(80);
    expect(ex.sets[2].reps).toBe(8);
  });

  it("renders streamlined, elegant set logging table in TodayView without awkward global chips bar", async () => {
    startWorkout("plan-push");
    const wrapper = mount(TodayView);
    const html = wrapper.html();

    // Awkward global plate chips and bulky toolbars must be completely removed
    expect(html).not.toContain("加减片:");
    expect(html).not.toContain("统一全组");

    // Clean, readable table headers
    expect(html).toContain("组号");
    expect(html).toContain("重量 (kg)");
    expect(html).toContain("次数");
    expect(html).toContain("完成");

    // Streamlined micro-steppers embedded in numeric pills
    expect(html).toContain("title=\"-2.5kg\"");
    expect(html).toContain("title=\"+2.5kg\"");
    expect(html).toContain("title=\"-1次\"");
    expect(html).toContain("title=\"+1次\"");

    // Test interactive adjustments
    const weightPlusBtn = wrapper.find('button[title="+2.5kg"]');
    const initialWeight = store.activeWorkout.exercises[0].sets[0].weight;
    await weightPlusBtn.trigger("click");
    expect(store.activeWorkout.exercises[0].sets[0].weight).toBe(initialWeight + 2.5);

    const repsPlusBtn = wrapper.find('button[title="+1次"]');
    const initialReps = store.activeWorkout.exercises[0].sets[0].reps;
    await repsPlusBtn.trigger("click");
    expect(store.activeWorkout.exercises[0].sets[0].reps).toBe(initialReps + 1);
  });

  it("renders strength calibration modal with high contrast dark mode and pinned layout", () => {
    store.settings.themeMode = "dark";
    const wrapper = mount(StrengthPlacementModal, {
      props: { visible: true },
      attachTo: document.body
    });
    const html = document.body.innerHTML;

    expect(html).toContain("力量水平与初始重量定级");
    expect(html).toContain("新手入门");
    expect(html).toContain("进阶中坚");
    expect(html).toContain("资深老手");
    expect(html).toContain("自定义我常做的核心重量");

    // Must strictly render dark-mode background and NEVER rogue light bg-slate-50 in dark mode
    expect(html).toContain("bg-[#0C0F17]");
    expect(html).toContain("bg-zinc-900");
    expect(html).not.toContain("bg-slate-50");

    // Modal footer must be pinned with primary action button
    expect(html).toContain("确认并应用全计划起步重量");

    wrapper.unmount();
  });

  it("renders strength calibration modal cleanly in light mode without dark mode overrides", () => {
    store.settings.themeMode = "light";
    const wrapper = mount(StrengthPlacementModal, {
      props: { visible: true },
      attachTo: document.body
    });
    const html = document.body.innerHTML;

    expect(html).toContain("力量水平与初始重量定级");
    expect(html).toContain("bg-white");
    expect(html).toContain("bg-slate-50");

    wrapper.unmount();
  });

  it("renders strength level entry point in StatsView", () => {
    const wrapper = mount(StatsView);
    const html = wrapper.html();

    expect(html).toContain("力量能力基准");
    expect(html).toContain("力量水平定级与初始重量");
  });

  it("renders ultra-sleek, non-intrusive welcome sheet in UserOnboardingModal without 5-slide clutter", async () => {
    const wrapper = mount(UserOnboardingModal, {
      props: { visible: true },
      attachTo: document.body
    });
    const bodyHtml = document.body.innerHTML;

    // Contains clean, welcoming branding
    expect(bodyHtml).toContain("欢迎开启 FitCycle");
    expect(bodyHtml).toContain("开启你的极简科学特训");
    expect(bodyHtml).toContain("30秒力量定级 · 告别空杆重填");
    expect(bodyHtml).toContain("推 / 拉 / 腿 黄金分化循环");
    expect(bodyHtml).toContain("健身房防抖大按键 · 极速加片");
    expect(bodyHtml).toContain("30秒选定力量水平并开练");
    expect(bodyHtml).toContain("稍后定级，直接开启今日训练");

    // Must NOT contain the old repelling 5-slide clutter
    expect(bodyHtml).not.toContain("特训全景向导 · 1/5");
    expect(bodyHtml).not.toContain("尚博勒法式高定金表");
    expect(bodyHtml).not.toContain("CS2 战力天梯排位");

    // Clicking primary button emits open-strength
    const primaryBtn = document.body.querySelector("button.bg-gradient-to-r");
    expect(primaryBtn).toBeTruthy();
    primaryBtn.click();
    expect(wrapper.emitted("open-strength")).toBeTruthy();
    expect(store.settings.hasSeenOnboarding).toBe(true);

    wrapper.unmount();
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { store, startRestTimer, stopRestTimer, toggleSetCompletion, startWorkout, discardActiveWorkout } from "../src/store/fitnessStore.js";
import StatsView from "../src/views/StatsView.vue";
import TodayView from "../src/views/TodayView.vue";

describe("Rest Presets, Carousel & Auto-Finish Upgrades", () => {
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
});
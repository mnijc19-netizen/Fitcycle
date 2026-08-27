import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import AIAssistantDrawer from "../src/components/AIAssistantDrawer.vue";
import { aiSession, clearAIConnection } from "../src/ai/aiSession.js";
import { startRestTimer, stopRestTimer, store } from "../src/store/fitnessStore.js";

afterEach(() => {
  stopRestTimer();
  aiSession.drawerOpen = false;
  clearAIConnection();
  vi.useRealTimers();
});

describe("mobile AI drawer", () => {
  it("opens without unmounting or pausing the existing rest timer", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-27T10:00:00Z"));
    startRestTimer(10);
    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });

    await wrapper.get('[data-testid="ai-fab"]').trigger("click");
    expect(wrapper.find('[data-testid="ai-drawer"]').exists()).toBe(true);
    const before = store.restTimer.remaining;
    await vi.advanceTimersByTimeAsync(1500);
    await nextTick();

    expect(store.restTimer.running).toBe(true);
    expect(store.restTimer.remaining).toBeLessThan(before);
    wrapper.unmount();
  });
});


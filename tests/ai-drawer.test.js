import { afterEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import AIAssistantDrawer from "../src/components/AIAssistantDrawer.vue";
import AISettingsPanel from "../src/components/AISettingsPanel.vue";
import { aiSession, clearAIConnection, setProviderModels, setSelectedModel, setSessionApiKey } from "../src/ai/aiSession.js";
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

  it("clears unsent drawer content when all AI connections are cleared", async () => {
    aiSession.drawerOpen = true;
    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });
    const input = wrapper.get("textarea");
    await input.setValue("尚未发送的内容");

    clearAIConnection();
    await nextTick();

    expect(input.element.value).toBe("");
    expect(aiSession.conversation).toEqual([]);
    wrapper.unmount();
  });

  it("offers a reliable settings-page entry when a provider is connected", async () => {
    setSessionApiKey("session-only-test-key", "deepseek");
    setProviderModels([{ id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", capabilities: { text: true, image: false, tools: true, streaming: true } }], "deepseek");
    setSelectedModel("deepseek-v4-flash", "deepseek");
    const wrapper = mount(AISettingsPanel);

    await wrapper.get('[data-testid="open-ai-assistant"]').trigger("click");

    expect(aiSession.drawerOpen).toBe(true);
    wrapper.unmount();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";

vi.mock("../src/ai/providerClient.js", () => ({
  fetchProviderModels: vi.fn(),
  streamProviderChatCompletion: vi.fn()
}));

import AIAssistantDrawer from "../src/components/AIAssistantDrawer.vue";
import AISettingsPanel from "../src/components/AISettingsPanel.vue";
import { aiSession, clearAIConnection, setProviderModels, setSelectedModel, setSessionApiKey } from "../src/ai/aiSession.js";
import { streamProviderChatCompletion } from "../src/ai/providerClient.js";
import { startRestTimer, stopRestTimer, store } from "../src/store/fitnessStore.js";

afterEach(() => {
  stopRestTimer();
  aiSession.drawerOpen = false;
  clearAIConnection();
  vi.clearAllMocks();
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

  it("offers a retry after the user stops a streamed response", async () => {
    setSessionApiKey("session-only-test-key", "deepseek");
    setProviderModels([{ id: "deepseek-v4-flash", name: "DeepSeek V4 Flash", capabilities: { text: true, image: false, tools: true, streaming: true } }], "deepseek");
    setSelectedModel("deepseek-v4-flash", "deepseek");
    aiSession.drawerOpen = true;
    streamProviderChatCompletion.mockImplementationOnce(({ signal, onToken }) => new Promise((_resolve, reject) => {
      onToken("部分响应");
      signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    }));
    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });
    await wrapper.get("textarea").setValue("生成一份详细说明");
    await wrapper.get('[aria-label="发送"]').trigger("click");
    await nextTick();

    await wrapper.get('[aria-label="停止生成"]').trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("已停止生成");
    const retry = wrapper.findAll("button").find((button) => button.text() === "重试上次请求");
    expect(retry).toBeTruthy();
    streamProviderChatCompletion.mockResolvedValueOnce({ content: "重试完成", toolCalls: [], finishReason: "stop" });
    await retry.trigger("click");
    await flushPromises();
    expect(wrapper.text()).toContain("重试完成");
    wrapper.unmount();
  });
});

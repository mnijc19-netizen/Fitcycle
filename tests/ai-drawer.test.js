import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";

vi.mock("../src/ai/providerClient.js", () => ({
  fetchProviderModels: vi.fn(),
  streamProviderChatCompletion: vi.fn(),
  testProviderConnection: vi.fn(async () => ({ success: true, latencyMs: 120, reply: "OK" }))
}));

import AIAssistantDrawer from "../src/components/AIAssistantDrawer.vue";
import AISettingsPanel from "../src/components/AISettingsPanel.vue";
import { aiSession, clearAIConnection, setActiveProvider, setProviderModels, setSelectedModel, setSessionApiKey } from "../src/ai/aiSession.js";
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

  it("streams reasoning tokens into a dedicated thinking process box", async () => {
    setActiveProvider("zhipu");
    setSessionApiKey("session-only-test-key", "zhipu");
    setProviderModels([{ id: "glm-4.5", name: "glm-4.5", capabilities: { text: true, image: false, tools: true, streaming: true } }], "zhipu");
    setSelectedModel("glm-4.5", "zhipu");
    aiSession.drawerOpen = true;

    streamProviderChatCompletion.mockImplementationOnce(({ onReasoning, onToken }) => {
      onReasoning("正在分析用户的渐进超负荷数据...");
      onToken("你的训练表现非常扎实！");
      return Promise.resolve({ content: "你的训练表现非常扎实！", toolCalls: [], finishReason: "stop" });
    });

    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });
    await wrapper.get("textarea").setValue("分析我的表现");
    await wrapper.get('[aria-label="发送"]').trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("已完成深度思考");
    const assistantMsg = aiSession.conversation.find(m => m.role === "assistant");
    expect(assistantMsg?.reasoning).toContain("正在分析用户的渐进超负荷数据...");
    expect(wrapper.text()).toContain("你的训练表现非常扎实！");
    
    // Toggle reasoning box to reveal details in DOM
    await wrapper.get('[data-testid="toggle-reasoning"]').trigger("click");
    expect(wrapper.text()).toContain("正在分析用户的渐进超负荷数据...");
    wrapper.unmount();
  });

  it("formats model names cleanly without duplicate ID in parentheses", async () => {
    setActiveProvider("zhipu");
    setSessionApiKey("session-only-test-key", "zhipu");
    setProviderModels([
      { id: "glm-4.5", name: "glm-4.5", capabilities: { text: true, image: false, tools: true, streaming: true } },
      { id: "glm-custom", name: "智谱旗舰大模型", capabilities: { text: true, image: false, tools: true, streaming: true } }
    ], "zhipu");
    setSelectedModel("glm-4.5", "zhipu");

    const wrapper = mount(AISettingsPanel);
    const options = wrapper.findAll("option");
    
    // When id === name, option text should just be "glm-4.5"
    expect(options[0].text()).toBe("glm-4.5");
    // When id !== name, option text should be "智谱旗舰大模型 (glm-custom)"
    expect(options[1].text()).toBe("智谱旗舰大模型 (glm-custom)");
    wrapper.unmount();
  });

  it("supports 1-tap quick model switcher directly inside the chat drawer header", async () => {
    setActiveProvider("qwen");
    setSessionApiKey("session-only-test-key", "qwen");
    setProviderModels([
      { id: "qwen-max", name: "通义千问 Max", capabilities: { text: true, image: false, tools: true, streaming: true } },
      { id: "qwen-vl-max", name: "Qwen-VL-Max (视觉旗舰)", capabilities: { text: true, image: true, tools: true, streaming: true } }
    ], "qwen");
    setSelectedModel("qwen-max", "qwen");
    aiSession.drawerOpen = true;

    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });
    expect(wrapper.find('[data-testid="quick-model-picker-modal"]').exists()).toBe(false);

    // Open quick model picker popover from header
    await wrapper.get('[data-testid="toggle-quick-model-picker"]').trigger("click");
    expect(wrapper.find('[data-testid="quick-model-picker-modal"]').exists()).toBe(true);

    // Click to switch model to Qwen-VL-Max
    const vlButton = wrapper.findAll('[data-testid="quick-model-picker-modal"] button').find(b => b.text().includes("Qwen-VL-Max"));
    expect(vlButton).toBeTruthy();
    await vlButton.trigger("click");

    expect(aiSession.selectedModelIds.qwen).toBe("qwen-vl-max");
    expect(wrapper.find('[data-testid="quick-model-picker-modal"]').exists()).toBe(false);
    wrapper.unmount();
  });

  it("adapts empty state suggestions gracefully when typing/focusing input", async () => {
    aiSession.drawerOpen = true;
    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });

    // When not typing/resting: shows coach title and full cards
    expect(wrapper.text()).toContain("我是你的 FitCycle 智能教练");
    expect(wrapper.text()).toContain("分析昨天训练表现");

    // Focus input to simulate virtual keyboard opening
    const textarea = wrapper.get("textarea");
    await textarea.trigger("focus");
    await nextTick();

    // In typing mode: title collapses to compact quick prompt pills
    expect(wrapper.text()).toContain("快捷提问");
    expect(wrapper.text()).not.toContain("我是你的 FitCycle 智能教练");

    // Blur input: returns to resting layout
    await textarea.trigger("blur");
    await new Promise((resolve) => setTimeout(resolve, 150));
    await nextTick();
    expect(wrapper.text()).toContain("我是你的 FitCycle 智能教练");
    wrapper.unmount();
  });

  it("allows closing drawer via top grabber handle tap or gesture", async () => {
    aiSession.drawerOpen = true;
    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });
    expect(aiSession.drawerOpen).toBe(true);

    const grabber = wrapper.get(".grabber-handle");
    await grabber.trigger("click");
    expect(aiSession.drawerOpen).toBe(false);
    wrapper.unmount();
  });

  it("never hijacks scroll or calls window.scrollTo(0, 0) when drawer is closed", async () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;
    window.scrollY = 350;

    aiSession.drawerOpen = false;
    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });

    // Simulate visualViewport scroll and resize while drawer is closed
    if (window.visualViewport) {
      window.visualViewport.dispatchEvent(new Event("scroll"));
      window.visualViewport.dispatchEvent(new Event("resize"));
    }
    window.dispatchEvent(new Event("scroll"));
    document.dispatchEvent(new Event("scroll"));

    await nextTick();
    expect(scrollToMock).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("renders equipment visual card and lightbox modal when asking about 蝴蝶机", async () => {
    aiSession.drawerOpen = true;
    setSessionApiKey("session-only-test-key", "deepseek");
    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });

    // Simulate asking about 蝴蝶机
    aiSession.conversation.push({
      id: "user_test_pec",
      role: "user",
      text: "蝴蝶机长啥样"
    });
    aiSession.conversation.push({
      id: "assistant_test_pec",
      role: "assistant",
      text: "蝴蝶机主要用于胸大肌中缝训练，上机前先调节座椅高度。",
      matchedEquipment: {
        id: "eq-pec-deck",
        name: "蝴蝶机 / 夹胸与反向飞鸟机",
        englishName: "Pec Deck / Butterfly Fly Machine",
        categoryName: "胸部 / 胸大肌中缝与肩后束",
        imageUrl: "./machines/pec-deck.jpg",
        appearanceFeature: "垂直靠背座椅，两侧旋转金属摇臂",
        adjustmentTips: "拔出座椅黄色把手调节高度"
      }
    });

    await nextTick();

    // Verify equipment-visual-card is rendered
    const card = wrapper.find('[data-testid="equipment-visual-card"]');
    expect(card.exists()).toBe(true);
    expect(card.text()).toContain("蝴蝶机");
    expect(card.text()).toContain("查看大图与器械调节指南");
    const img = card.find("img");
    expect(img.attributes("src")).toBe("./machines/pec-deck.jpg");

    // Click full screen button to open Lightbox modal
    const fullBtn = card.find("button");
    await fullBtn.trigger("click");
    await nextTick();

    const lightbox = wrapper.find('[data-testid="equipment-lightbox-modal"]');
    expect(lightbox.exists()).toBe(true);
    expect(lightbox.text()).toContain("外观一眼识别特征");
    expect(lightbox.text()).toContain("座椅与插销调节指南");

    // Verify deduplication: even if AI text had duplicate markdown image syntax, it is stripped
    aiSession.conversation.push({
      id: "assistant_dup_test",
      role: "assistant",
      text: "这是蝴蝶机说明：![蝴蝶机实物照片](./machines/pec-deck.jpg)\n请注意动作规范。",
      matchedEquipment: {
        id: "eq-pec-deck",
        name: "蝴蝶机",
        englishName: "Pec Deck",
        categoryName: "胸部",
        imageUrl: "./machines/pec-deck.jpg"
      }
    });
    await nextTick();

    const markdownContents = wrapper.findAll(".ai-markdown-content");
    const lastContent = markdownContents[markdownContents.length - 1];
    expect(lastContent.html()).not.toContain("./machines/pec-deck.jpg");
    expect(lastContent.text()).toContain("这是蝴蝶机说明：");
    expect(lastContent.text()).toContain("请注意动作规范。");

    wrapper.unmount();
  });

  it("smoothly transitions copy button to checkmark with timer reset on click", async () => {
    vi.useFakeTimers();
    const writeTextMock = vi.fn().mockResolvedValue();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true
    });

    aiSession.drawerOpen = true;
    aiSession.conversation = [{
      id: "assistant_copy_test_1",
      role: "assistant",
      text: "这是针对您力量训练的专业建议与动作规划。",
      streaming: false
    }];

    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });
    await nextTick();

    const copyBtn = wrapper.find('[data-testid="copy-ai-response-btn"]');
    expect(copyBtn.exists()).toBe(true);
    expect(copyBtn.text()).toContain("复制");
    expect(copyBtn.text()).not.toContain("已复制");

    // Click copy button
    await copyBtn.trigger("click");
    await nextTick();

    // Verify clipboard API was called with message text
    expect(writeTextMock).toHaveBeenCalledWith("这是针对您力量训练的专业建议与动作规划。");

    // Verify UI dynamically morphed to checked state
    expect(copyBtn.text()).toContain("已复制");
    expect(copyBtn.find(".check-icon").exists()).toBe(true);
    expect(copyBtn.classes()).toContain("text-emerald-400");

    // Advance timers by 2000ms
    await vi.advanceTimersByTimeAsync(2000);
    await nextTick();

    // Reverts back to standard copy icon and text
    expect(copyBtn.text()).toContain("复制");
    expect(copyBtn.text()).not.toContain("已复制");
    expect(copyBtn.find(".check-icon").exists()).toBe(false);

    wrapper.unmount();
  });
});



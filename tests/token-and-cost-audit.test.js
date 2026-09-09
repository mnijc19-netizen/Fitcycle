import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import {
  calculateCostUSD,
  formatCostUSD,
  formatCurrencyCost,
  formatAuthoritativeCost,
  formatModelPricing,
  recordTokenUsage,
  getProviderAudit,
  resetTokenAudit,
  tokenAuditState
} from "../src/ai/tokenTracker.js";
import {
  AI_PROVIDERS,
  DEFAULT_PRESET_MODELS,
  aiSession,
  clearAIConnection,
  setActiveProvider,
  setProviderModels,
  setSessionApiKey,
  setSelectedModel
} from "../src/ai/aiSession.js";
import { store, setCurrency } from "../src/store/fitnessStore.js";
import AISettingsPanel from "../src/components/AISettingsPanel.vue";
import AITokenAuditPanel from "../src/components/AITokenAuditPanel.vue";
import AIAssistantDrawer from "../src/components/AIAssistantDrawer.vue";
import StatsView from "../src/views/StatsView.vue";

beforeEach(() => {
  resetTokenAudit();
  clearAIConnection();
  store.settings.currency = "USD";
  store.settings.usdToCnyRate = 7.25;
  vi.clearAllMocks();
});

afterEach(() => {
  resetTokenAudit();
  aiSession.drawerOpen = false;
  clearAIConnection();
});

describe("Token and Cost Audit Engine", () => {
  it("accurately calculates USD cost only when authoritative pricing exists (e.g. OpenRouter)", () => {
    const usage = { prompt_tokens: 1000, completion_tokens: 500, total_tokens: 1500 };
    const pricing = { prompt: "0.0000025", completion: "0.00001" };

    // 1000 * 0.0000025 = 0.0025
    // 500 * 0.00001 = 0.005
    // Total = 0.0075
    const cost = calculateCostUSD(usage, pricing);
    expect(cost).toBe(0.0075);
    expect(formatCostUSD(cost)).toBe("0.0075");

    // Direct server-reported cost from OpenRouter stream usage takes absolute priority
    const directUsage = { prompt_tokens: 1000, completion_tokens: 500, total_tokens: 1500, cost: 0.0042 };
    expect(calculateCostUSD(directUsage, pricing)).toBe(0.0042);
    expect(formatCostUSD(calculateCostUSD(directUsage, pricing))).toBe("0.0042");

    // Support request fees if specified by model pricing
    const pricingWithRequest = { prompt: "0.000001", completion: "0.000002", request: "0.001" };
    expect(calculateCostUSD({ prompt_tokens: 1000, completion_tokens: 1000 }, pricingWithRequest)).toBe(0.004);

    // Estimated usage must NEVER be charged or calculated into money (zero hallucination)
    const estimatedUsage = { prompt_tokens: 1000, completion_tokens: 500, total_tokens: 1500, estimated: true };
    expect(calculateCostUSD(estimatedUsage, pricing)).toBe(0);
    expect(recordTokenUsage({ provider: "openrouter", modelId: "test", usage: estimatedUsage, pricing })).toBe(null);

    // Missing pricing returns 0 (no hallucinated cost)
    expect(calculateCostUSD(usage, null)).toBe(0);
    expect(formatCostUSD(0)).toBe("0.00");
  });

  it("records official token usage and computes OpenRouter cost while keeping DeepSeek token-only", () => {
    // 1. Record DeepSeek usage (tokens only, cost remains 0)
    recordTokenUsage({
      provider: "deepseek",
      modelId: "deepseek-chat",
      usage: { prompt_tokens: 200, completion_tokens: 800, total_tokens: 1000 },
      pricing: null
    });

    const dsAudit = getProviderAudit("deepseek");
    expect(dsAudit.totalTokens).toBe(1000);
    expect(dsAudit.promptTokens).toBe(200);
    expect(dsAudit.completionTokens).toBe(800);
    expect(dsAudit.callCount).toBe(1);
    expect(tokenAuditState.totalCostUSD).toBe(0);

    // 2. Record OpenRouter usage (with authoritative pricing)
    recordTokenUsage({
      provider: "openrouter",
      modelId: "openai/gpt-4o",
      usage: { prompt_tokens: 1000, completion_tokens: 200, total_tokens: 1200 },
      pricing: { prompt: "0.0000025", completion: "0.00001" }
    });

    const orAudit = getProviderAudit("openrouter");
    expect(orAudit.totalTokens).toBe(1200);
    expect(orAudit.totalCostUSD).toBe(0.0045); // (1000*0.0000025) + (200*0.00001) = 0.0025 + 0.002 = 0.0045
    expect(tokenAuditState.totalTokens).toBe(2200);
    expect(tokenAuditState.totalCostUSD).toBe(0.0045);

    // 3. Reset audit
    resetTokenAudit();
    expect(tokenAuditState.totalTokens).toBe(0);
    expect(tokenAuditState.totalCostUSD).toBe(0);
  });

  it("clearly distinguishes billing capability across all AI providers in metadata", () => {
    const openrouter = AI_PROVIDERS.find((p) => p.id === "openrouter");
    expect(openrouter.billingType).toBe("tokens_and_cost");
    expect(openrouter.billingBadge).toBe("Token + 实时金额");

    const nonCostProviders = ["deepseek", "zhipu", "qwen", "siliconflow", "moonshot", "vercel_ai_gateway"];
    for (const pid of nonCostProviders) {
      const p = AI_PROVIDERS.find((prov) => prov.id === pid);
      expect(p.billingType).toBe("tokens_only");
      expect(p.billingBadge).toBe("精确 Token 审计");
    }
  });

  it("renders the provider billing notice and updates when switching between OpenRouter and DeepSeek", async () => {
    setActiveProvider("deepseek");
    const wrapper = mount(AISettingsPanel);

    const notice = wrapper.find('[data-testid="provider-billing-notice"]');
    expect(notice.exists()).toBe(true);
    expect(notice.text()).toContain("精确 Token 审计");
    expect(notice.text()).toContain("实时计费: 仅回传 Token");

    // Switch to OpenRouter
    setActiveProvider("openrouter");
    await nextTick();

    expect(notice.text()).toContain("Token + 实时金额");
    expect(notice.text()).toContain("实时计费: Token + 金额");

    wrapper.unmount();
  });

  it("renders the full token & cost audit dashboard and supports reset in AITokenAuditPanel", async () => {
    recordTokenUsage({
      provider: "deepseek",
      modelId: "deepseek-chat",
      usage: { prompt_tokens: 300, completion_tokens: 700, total_tokens: 1000 },
      pricing: null
    });

    setActiveProvider("deepseek");
    const wrapper = mount(AITokenAuditPanel);

    const dashboard = wrapper.find('[data-testid="token-audit-dashboard"]');
    expect(dashboard.exists()).toBe(true);
    expect(wrapper.find('[data-testid="audit-total-tokens"]').text()).toContain("1,000");
    expect(wrapper.find('[data-testid="provider-total-tokens"]').text()).toContain("1,000");

    // Toggle detailed breakdown list
    const toggleBtn = wrapper.find('[data-testid="toggle-breakdown-btn"]');
    expect(wrapper.find('[data-testid="provider-breakdown-list"]').exists()).toBe(false);
    await toggleBtn.trigger("click");
    expect(wrapper.find('[data-testid="provider-breakdown-list"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="provider-breakdown-list"]').text()).toContain("DeepSeek");
    expect(wrapper.find('[data-testid="provider-breakdown-list"]').text()).toContain("OpenRouter");

    // Click reset button
    const resetBtn = wrapper.find('[data-testid="reset-audit-btn"]');
    await resetBtn.trigger("click");
    await nextTick();

    expect(wrapper.find('[data-testid="audit-total-tokens"]').text()).toContain("0");
    expect(wrapper.find('[data-testid="provider-total-tokens"]').text()).toContain("0");

    wrapper.unmount();
  });

  it("renders token badge in AIAssistantDrawer and shows cost only for OpenRouter", async () => {
    aiSession.drawerOpen = true;
    aiSession.conversation = [
      {
        id: "msg_deepseek_1",
        role: "assistant",
        text: "这是 DeepSeek 回复",
        streaming: false,
        usage: { prompt_tokens: 150, completion_tokens: 350, total_tokens: 500 }
      },
      {
        id: "msg_openrouter_1",
        role: "assistant",
        text: "这是 OpenRouter 回复",
        streaming: false,
        usage: { prompt_tokens: 200, completion_tokens: 400, total_tokens: 600 },
        costUSD: 0.0012
      }
    ];

    const wrapper = mount(AIAssistantDrawer, { attachTo: document.body });
    await nextTick();

    const badges = wrapper.findAll('[data-testid="message-token-badge"]');
    expect(badges.length).toBe(2);

    // DeepSeek message: tokens only
    expect(badges[0].text()).toContain("500 Tokens");
    expect(badges[0].text()).not.toContain("$");

    // OpenRouter message: tokens AND cost
    expect(badges[1].text()).toContain("600 Tokens");
    expect(badges[1].text()).toContain("$0.0012");

    wrapper.unmount();
  });

  it("places the currently active provider at index 0 so user immediately sees OpenRouter without scrolling", async () => {
    setActiveProvider("openrouter");
    const wrapper = mount(AISettingsPanel);

    const buttons = wrapper.findAll('[data-testid^="provider-btn-"]');
    expect(buttons.length).toBeGreaterThan(0);
    // OpenRouter MUST be the very first button
    expect(buttons[0].attributes("data-testid")).toBe("provider-btn-openrouter");
    expect(buttons[0].text()).toContain("OpenRouter");

    // Switching active provider re-orders so that active is always first
    setActiveProvider("zhipu");
    await nextTick();
    const updatedButtons = wrapper.findAll('[data-testid^="provider-btn-"]');
    expect(updatedButtons[0].attributes("data-testid")).toBe("provider-btn-zhipu");
    expect(updatedButtons[0].text()).toContain("智谱 GLM");

    wrapper.unmount();
  });

  it("renders outer token audit summary bar directly on the outer settings page (StatsView)", async () => {
    recordTokenUsage({
      provider: "openrouter",
      modelId: "openai/gpt-4o",
      usage: { prompt_tokens: 2500, completion_tokens: 656, total_tokens: 3156 },
      pricing: { prompt: "0.0000025", completion: "0.00001" }
    });

    setActiveProvider("openrouter");
    const wrapper = mount(StatsView);

    const summaryBar = wrapper.find('[data-testid="outer-token-audit-summary"]');
    expect(summaryBar.exists()).toBe(true);
    expect(summaryBar.text()).toContain("3,156");
    expect(summaryBar.text()).toContain("Tokens");
    expect(summaryBar.text()).toContain("$0.0128"); // 2500*0.0000025 + 656*0.00001 = 0.00625 + 0.00656 = 0.01281 -> 0.0128
    expect(summaryBar.text()).toContain("详细大盘 ❯");

    wrapper.unmount();
  });

  it("StatsView: clicking outer token audit opens dedicated AITokenAuditPanel modal and switches display per active provider", async () => {
    recordTokenUsage({
      provider: "openrouter",
      modelId: "openai/gpt-4o",
      usage: { prompt_tokens: 2000, completion_tokens: 1000, total_tokens: 3000 },
      pricing: { prompt: "0.0000025", completion: "0.00001" }
    });
    recordTokenUsage({
      provider: "deepseek",
      modelId: "deepseek-chat",
      usage: { prompt_tokens: 4000, completion_tokens: 1000, total_tokens: 5000 },
      pricing: null
    });

    // 1. When OpenRouter is active: shows OpenRouter's 3,000 tokens and real-time cost $0.015
    setActiveProvider("openrouter");
    const wrapper = mount(StatsView, { attachTo: document.body });
    const summaryBar = wrapper.find('[data-testid="outer-token-audit-summary"]');
    expect(summaryBar.text()).toContain("OpenRouter");
    expect(summaryBar.text()).toContain("3,000");
    expect(summaryBar.text()).toContain("$0.015");

    // Click outer bar -> opens dedicated AITokenAuditPanel modal
    await summaryBar.trigger("click");
    await nextTick();
    const modal = wrapper.findComponent(AITokenAuditPanel);
    expect(modal.exists()).toBe(true);

    // 2. When DeepSeek is active: shows DeepSeek's 5,000 tokens and '官方 Token 审计', NOT a frozen dollar amount
    setActiveProvider("deepseek");
    await nextTick();
    expect(summaryBar.text()).toContain("DeepSeek");
    expect(summaryBar.text()).toContain("5,000");
    expect(summaryBar.text()).toContain("官方 Token 审计");
    expect(summaryBar.find('.text-emerald-400').exists()).toBe(false);

    wrapper.unmount();
  });

  it("supports switching between USD ($) and CNY (¥) with authoritative rate conversion", () => {
    // 0.0128 USD at 7.25 rate = 0.0928 CNY
    expect(formatCurrencyCost(0.0128, "USD", 7.25)).toBe("$0.0128");
    expect(formatCurrencyCost(0.0128, "CNY", 7.25)).toBe("¥0.0928");

    // Zero costs
    expect(formatCurrencyCost(0, "USD", 7.25)).toBe("$0.00");
    expect(formatCurrencyCost(0, "CNY", 7.25)).toBe("¥0.00");

    // Micro amounts (< 0.0001)
    expect(formatCurrencyCost(0.000005, "USD", 7.25)).toBe("<$0.00001");
    expect(formatCurrencyCost(0.000005, "CNY", 7.25)).toBe("<¥0.0001");

    // Test formatModelPricing for per-1M tokens
    const pricing = { prompt: "0.0000001", completion: "0.0000004" }; // Gemini 2.0 Flash
    const pricingUSD = formatModelPricing(pricing, "USD", 7.25);
    expect(pricingUSD.rateText).toBe("入 $0.10 · 出 $0.40 /M");
    expect(pricingUSD.symbol).toBe("$");

    const pricingCNY = formatModelPricing(pricing, "CNY", 7.25);
    expect(pricingCNY.rateText).toBe("入 ¥0.73 · 出 ¥2.90 /M");
    expect(pricingCNY.symbol).toBe("¥");
  });

  it("dynamically and reactively switches currency site-wide across all views and modals", async () => {
    recordTokenUsage({
      provider: "openrouter",
      modelId: "openai/gpt-4o",
      usage: { prompt_tokens: 2500, completion_tokens: 656, total_tokens: 3156 },
      pricing: { prompt: "0.0000025", completion: "0.00001" }
    });

    setActiveProvider("openrouter");
    store.settings.currency = "USD";
    const wrapper = mount(StatsView, { attachTo: document.body });

    const summaryBar = wrapper.find('[data-testid="outer-token-audit-summary"]');
    expect(summaryBar.text()).toContain("$0.0128");

    // 1. Toggle via outer currency button
    const toggleBtn = wrapper.find('[data-testid="toggle-global-currency-btn"]');
    expect(toggleBtn.exists()).toBe(true);
    expect(toggleBtn.text()).toContain("$ 美元");

    await toggleBtn.trigger("click");
    await nextTick();

    expect(store.settings.currency).toBe("CNY");
    expect(toggleBtn.text()).toContain("¥ 人民币");
    expect(summaryBar.text()).toContain("¥0.0929");

    // 2. Open AITokenAuditPanel modal and verify currency segmented buttons
    await summaryBar.trigger("click");
    await nextTick();
    const auditPanel = wrapper.findComponent(AITokenAuditPanel);
    expect(auditPanel.exists()).toBe(true);

    const usdBtn = auditPanel.find('[data-testid="currency-btn-usd"]');
    const cnyBtn = auditPanel.find('[data-testid="currency-btn-cny"]');
    expect(usdBtn.exists()).toBe(true);
    expect(cnyBtn.exists()).toBe(true);

    // Click USD in audit modal -> switches globally back to USD
    await usdBtn.trigger("click");
    await nextTick();
    expect(store.settings.currency).toBe("USD");
    expect(summaryBar.text()).toContain("$0.0128");

    wrapper.unmount();
  });

  it("AISettingsPanel: displays model pricing badges and supports inline currency switching", async () => {
    setActiveProvider("openrouter");
    setSessionApiKey("sk-or-test-key", "openrouter");
    setProviderModels(DEFAULT_PRESET_MODELS.openrouter, "openrouter");
    store.settings.currency = "USD";
    const wrapper = mount(AISettingsPanel);

    // In USD mode, model cards render USD per-million badges
    const pricingBadges = wrapper.findAll('[data-testid="model-pricing-badge"]');
    expect(pricingBadges.length).toBeGreaterThan(0);
    expect(pricingBadges[0].text()).toContain("$");

    // Click currency switcher inside AISettingsPanel
    const currencyToggle = wrapper.find('[data-testid="panel-currency-toggle"]');
    expect(currencyToggle.exists()).toBe(true);
    expect(currencyToggle.text()).toContain("$ 美元");

    await currencyToggle.trigger("click");
    await nextTick();

    expect(store.settings.currency).toBe("CNY");
    expect(currencyToggle.text()).toContain("¥ 人民币");
    expect(pricingBadges[0].text()).toContain("¥");

    wrapper.unmount();
  });
});

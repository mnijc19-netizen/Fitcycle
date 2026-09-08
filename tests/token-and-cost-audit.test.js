import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import {
  calculateCostUSD,
  formatCostUSD,
  recordTokenUsage,
  getProviderAudit,
  resetTokenAudit,
  tokenAuditState
} from "../src/ai/tokenTracker.js";
import {
  AI_PROVIDERS,
  aiSession,
  clearAIConnection,
  setActiveProvider,
  setSessionApiKey,
  setSelectedModel
} from "../src/ai/aiSession.js";
import AISettingsPanel from "../src/components/AISettingsPanel.vue";
import AIAssistantDrawer from "../src/components/AIAssistantDrawer.vue";

beforeEach(() => {
  resetTokenAudit();
  clearAIConnection();
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

  it("renders the full token & cost audit dashboard and supports reset in AISettingsPanel", async () => {
    recordTokenUsage({
      provider: "deepseek",
      modelId: "deepseek-chat",
      usage: { prompt_tokens: 300, completion_tokens: 700, total_tokens: 1000 },
      pricing: null
    });

    setActiveProvider("deepseek");
    const wrapper = mount(AISettingsPanel);

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
});

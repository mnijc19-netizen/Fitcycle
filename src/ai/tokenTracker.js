import { reactive } from "vue";
import { store } from "../store/fitnessStore.js";

const STORAGE_KEY = "fitcycle_ai_token_audit_v1";

function getInitialState() {
  return {
    totalTokens: 0,
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalCostUSD: 0,
    providers: {
      deepseek: { promptTokens: 0, completionTokens: 0, totalTokens: 0, callCount: 0 },
      zhipu: { promptTokens: 0, completionTokens: 0, totalTokens: 0, callCount: 0 },
      qwen: { promptTokens: 0, completionTokens: 0, totalTokens: 0, callCount: 0 },
      siliconflow: { promptTokens: 0, completionTokens: 0, totalTokens: 0, callCount: 0 },
      moonshot: { promptTokens: 0, completionTokens: 0, totalTokens: 0, callCount: 0 },
      vercel_ai_gateway: { promptTokens: 0, completionTokens: 0, totalTokens: 0, callCount: 0 },
      openrouter: { promptTokens: 0, completionTokens: 0, totalTokens: 0, totalCostUSD: 0, callCount: 0 }
    }
  };
}

function loadStoredState() {
  const initial = getInitialState();
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.totalTokens === "number") {
          return {
            totalTokens: parsed.totalTokens || 0,
            totalPromptTokens: parsed.totalPromptTokens || 0,
            totalCompletionTokens: parsed.totalCompletionTokens || 0,
            totalCostUSD: parsed.totalCostUSD || 0,
            providers: {
              ...initial.providers,
              ...(parsed.providers || {})
            }
          };
        }
      }
    }
  } catch {
    // ignore parse error and fallback
  }
  return initial;
}

function persistState() {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokenAuditState));
    }
  } catch {
    // ignore storage quota error
  }
}

export const tokenAuditState = reactive(loadStoredState());

/**
 * Calculates authoritative monetary cost (in USD) from model pricing and usage.
 * Strictly used when official model pricing per-token is provided (e.g. OpenRouter).
 *
 * @param {object} usage - { prompt_tokens, completion_tokens }
 * @param {object|null} pricing - { prompt: string|number, completion: string|number }
 * @returns {number} Cost in USD, or 0 if pricing is absent
 */
export function calculateCostUSD(usage, pricing) {
  if (!usage) return 0;
  if (usage.estimated) return 0;

  // 1. Direct authoritative billing returned by provider API (e.g. OpenRouter stream usage.cost)
  if (usage.cost !== undefined && usage.cost !== null) {
    const c = Number(usage.cost);
    if (Number.isFinite(c) && c >= 0) {
      return Number(c.toFixed(6));
    }
  }

  // 2. Authoritative pricing formula based on official per-token rates
  if (!pricing) return 0;
  const promptTokens = Number(usage.prompt_tokens || 0);
  const completionTokens = Number(usage.completion_tokens || 0);

  const promptRate = Number(pricing.prompt || 0);
  const completionRate = Number(pricing.completion || 0);
  const requestFee = Number(pricing.request || 0);

  const cost = promptTokens * promptRate + completionTokens * completionRate + requestFee;
  return Number.isFinite(cost) && cost > 0 ? Number(cost.toFixed(6)) : 0;
}

/**
 * Formats USD cost cleanly for display (e.g. "$0.00018", "<$0.00001", or "$0.00")
 */
export function formatCostUSD(cost) {
  const val = Number(cost || 0);
  if (!Number.isFinite(val) || val <= 0) return "0.00";
  if (val < 0.00001) return "<0.00001";
  if (val < 0.01) {
    const s = val.toFixed(5).replace(/0+$/, "");
    return s.includes(".") && s.split(".")[1].length < 2 ? val.toFixed(2) : s;
  }
  return val.toFixed(4);
}

/**
 * Formats cost according to specified or global currency ('USD' or 'CNY') and exchange rate.
 *
 * @param {number} costUSD - Raw cost in USD
 * @param {string|null} [currency] - Optional override 'USD' | 'CNY'
 * @param {number|null} [rate] - Optional override exchange rate (USD to CNY)
 * @param {boolean} [includeSymbol=true] - Whether to prepend $ or ¥
 * @returns {string} Formatted string, e.g. "$0.0128" or "¥0.0928"
 */
export function formatCurrencyCost(costUSD, currency = null, rate = null, includeSymbol = true) {
  const activeCurrency = currency || store?.settings?.currency || "USD";
  const activeRate = Number(rate || store?.settings?.usdToCnyRate || 7.25);
  const valUSD = Number(costUSD || 0);
  const symbol = activeCurrency === "CNY" ? "¥" : "$";
  const sym = includeSymbol ? symbol : "";

  if (!Number.isFinite(valUSD) || valUSD <= 0) {
    return `${sym}0.00`;
  }

  if (activeCurrency === "CNY") {
    const valCNY = valUSD * activeRate;
    if (valCNY < 0.0001) return includeSymbol ? "<¥0.0001" : "<0.0001";
    if (valCNY < 0.01) {
      const s = valCNY.toFixed(4).replace(/0+$/, "");
      const res = s.includes(".") && s.split(".")[1].length < 2 ? valCNY.toFixed(2) : s;
      return `${sym}${res}`;
    }
    return `${sym}${valCNY.toFixed(4)}`;
  }

  // Default USD
  if (valUSD < 0.00001) return includeSymbol ? "<$0.00001" : "<0.00001";
  const s = formatCostUSD(valUSD);
  return `${sym}${s}`;
}

/**
 * High-level helper that automatically reads the globally active currency from store and formats with symbol.
 */
export function formatAuthoritativeCost(costUSD, includeSymbol = true) {
  return formatCurrencyCost(costUSD, null, null, includeSymbol);
}

/**
 * Formats model per-token pricing (e.g. prompt: 0.0000001, completion: 0.0000004)
 * into human-readable cost per 1M (1,000,000) tokens in active currency.
 *
 * @param {object} pricing - { prompt, completion }
 * @param {string|null} [currency] - Optional currency override ('USD' | 'CNY')
 * @param {number|null} [rate] - Optional rate override
 * @returns {object|null}
 */
export function formatModelPricing(pricing, currency = null, rate = null) {
  if (!pricing || pricing.prompt === undefined || pricing.prompt === null) return null;
  const activeCurrency = currency || store?.settings?.currency || "USD";
  const activeRate = Number(rate || store?.settings?.usdToCnyRate || 7.25);
  const pUSD = Number(pricing.prompt || 0) * 1_000_000;
  const cUSD = Number(pricing.completion || 0) * 1_000_000;

  if (activeCurrency === "CNY") {
    const pCNY = (Math.round((pUSD * activeRate + Number.EPSILON) * 100) / 100).toFixed(2);
    const cCNY = (Math.round((cUSD * activeRate + Number.EPSILON) * 100) / 100).toFixed(2);
    return {
      currency: "CNY",
      symbol: "¥",
      promptPerMillion: `¥${pCNY}`,
      completionPerMillion: `¥${cCNY}`,
      rateText: `入 ¥${pCNY} · 出 ¥${cCNY} /M`
    };
  }

  const pFmt = (Math.round((pUSD + Number.EPSILON) * 100) / 100).toFixed(2);
  const cFmt = (Math.round((cUSD + Number.EPSILON) * 100) / 100).toFixed(2);
  return {
    currency: "USD",
    symbol: "$",
    promptPerMillion: `$${pFmt}`,
    completionPerMillion: `$${cFmt}`,
    rateText: `入 $${pFmt} · 出 $${cFmt} /M`
  };
}

/**
 * Records an official token usage entry from chat completions.
 *
 * @param {object} params
 * @param {string} params.provider - Provider ID
 * @param {string} params.modelId - Model ID
 * @param {object} params.usage - { prompt_tokens, completion_tokens, total_tokens }
 * @param {object|null} params.pricing - Official pricing dictionary if available
 * @returns {object} { promptTokens, completionTokens, totalTokens, costUSD }
 */
export function recordTokenUsage({ provider, modelId, usage, pricing }) {
  if (!usage || usage.estimated) return null;

  const promptTokens = Math.max(0, Number(usage.prompt_tokens) || 0);
  const completionTokens = Math.max(0, Number(usage.completion_tokens) || 0);
  const totalTokens = Math.max(0, Number(usage.total_tokens) || (promptTokens + completionTokens));

  let costUSD = 0;
  if (provider === "openrouter") {
    costUSD = calculateCostUSD(usage, pricing);
  }

  // Update global totals
  tokenAuditState.totalTokens += totalTokens;
  tokenAuditState.totalPromptTokens += promptTokens;
  tokenAuditState.totalCompletionTokens += completionTokens;
  if (costUSD > 0) {
    tokenAuditState.totalCostUSD = Number((tokenAuditState.totalCostUSD + costUSD).toFixed(6));
  }

  // Update provider-specific totals
  if (!tokenAuditState.providers[provider]) {
    tokenAuditState.providers[provider] = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      callCount: 0
    };
  }

  const pStats = tokenAuditState.providers[provider];
  pStats.promptTokens += promptTokens;
  pStats.completionTokens += completionTokens;
  pStats.totalTokens += totalTokens;
  pStats.callCount = (pStats.callCount || 0) + 1;

  if (provider === "openrouter") {
    pStats.totalCostUSD = Number(((pStats.totalCostUSD || 0) + costUSD).toFixed(6));
  }

  persistState();

  return {
    provider,
    modelId,
    promptTokens,
    completionTokens,
    totalTokens,
    costUSD
  };
}

/**
 * Gets audit summary for a given provider or global totals.
 */
export function getProviderAudit(providerId) {
  if (!providerId || !tokenAuditState.providers[providerId]) {
    return {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      callCount: 0,
      totalCostUSD: 0
    };
  }
  return tokenAuditState.providers[providerId];
}

/**
 * Resets token audit statistics (optionally for a specific provider, or all).
 */
export function resetTokenAudit(providerId = null) {
  if (providerId && tokenAuditState.providers[providerId]) {
    const p = tokenAuditState.providers[providerId];
    tokenAuditState.totalTokens -= p.totalTokens;
    tokenAuditState.totalPromptTokens -= p.promptTokens;
    tokenAuditState.totalCompletionTokens -= p.completionTokens;
    if (providerId === "openrouter" && p.totalCostUSD) {
      tokenAuditState.totalCostUSD = Math.max(0, Number((tokenAuditState.totalCostUSD - p.totalCostUSD).toFixed(6)));
    }
    p.promptTokens = 0;
    p.completionTokens = 0;
    p.totalTokens = 0;
    p.callCount = 0;
    if (p.totalCostUSD !== undefined) p.totalCostUSD = 0;
  } else {
    const fresh = getInitialState();
    tokenAuditState.totalTokens = 0;
    tokenAuditState.totalPromptTokens = 0;
    tokenAuditState.totalCompletionTokens = 0;
    tokenAuditState.totalCostUSD = 0;
    tokenAuditState.providers = fresh.providers;
  }
  persistState();
}

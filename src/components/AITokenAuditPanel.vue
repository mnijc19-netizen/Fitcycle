<template>
  <div class="space-y-4 font-sans" data-testid="token-audit-dashboard">
    <!-- Header with Action -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-amber-400 font-bold text-base">📊</span>
        <h3 class="font-bold text-base sm:text-lg text-zinc-100">大模型用量与消费审计大盘</h3>
        <span class="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">物理回执</span>
      </div>
      <button type="button" @click="handleResetAudit" 
              class="text-xs sm:text-sm text-zinc-400 hover:text-amber-400 active:scale-95 transition-colors cursor-pointer font-mono font-medium"
              title="重置当前所有用量与消费统计记录"
              data-testid="reset-audit-btn">
        重置统计
      </button>
    </div>

    <!-- Global & Current Provider Highlights -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- Total Tokens Card -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-2">
        <div class="text-xs sm:text-sm text-zinc-400 font-medium flex items-center justify-between">
          <span>全平台累计消耗 Token</span>
          <span class="text-xs text-zinc-500 font-mono">所有厂商总和</span>
        </div>
        <div class="text-xl sm:text-2xl font-black font-mono text-zinc-100 flex items-baseline gap-1.5">
          <span data-testid="audit-total-tokens">{{ tokenAuditState.totalTokens.toLocaleString() }}</span>
          <span class="text-xs font-normal text-zinc-400">Tokens</span>
        </div>
        <div class="text-xs text-zinc-400 font-mono flex items-center justify-between pt-1 border-t border-zinc-800/60">
          <span>输入: {{ tokenAuditState.totalPromptTokens.toLocaleString() }}</span>
          <span>输出: {{ tokenAuditState.totalCompletionTokens.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Current Provider Card -->
      <div class="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 space-y-2">
        <div class="text-xs sm:text-sm text-zinc-400 font-medium flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>当前 [{{ activeProvider.name }}] 累计</span>
          </div>
          <span v-if="activeProvider.id === 'openrouter'" class="text-emerald-400 font-bold font-mono text-sm sm:text-base" data-testid="openrouter-total-cost">
            ${{ formatCostUSD(currentProviderStats.totalCostUSD) }}
          </span>
          <span v-else class="text-zinc-400 text-xs px-2 py-0.5 rounded bg-zinc-800/80">
            官方 Token 审计
          </span>
        </div>
        <div class="text-xl sm:text-2xl font-black font-mono text-amber-300 flex items-baseline gap-1.5">
          <span data-testid="provider-total-tokens">{{ (currentProviderStats.totalTokens || 0).toLocaleString() }}</span>
          <span class="text-xs font-normal text-zinc-400">Tokens</span>
        </div>
        <div class="text-xs text-zinc-300 font-mono flex items-center justify-between pt-1 border-t border-zinc-800/60">
          <span>已发起 {{ currentProviderStats.callCount || 0 }} 次请求</span>
          <span v-if="activeProvider.id === 'openrouter'" class="text-emerald-400 text-xs font-medium">官方实时计费</span>
          <span v-else class="text-zinc-400 text-xs">无虚假估算金额</span>
        </div>
      </div>
    </div>

    <!-- Collapsible Detailed Per-Provider Breakdown Table -->
    <div class="space-y-2">
      <button type="button" @click="showProviderBreakdown = !showProviderBreakdown"
              class="w-full py-2 text-xs sm:text-sm text-zinc-300 hover:text-white flex items-center justify-between px-1 cursor-pointer transition-colors font-medium rounded-lg hover:bg-zinc-900/40"
              data-testid="toggle-breakdown-btn">
        <span class="flex items-center gap-1.5">
          <span>🏢</span>
          <span>各服务商独立调用与 Token 消耗明细</span>
        </span>
        <span class="font-mono text-xs text-amber-400">{{ showProviderBreakdown ? '收起 ▲' : '展开明细 ▼' }}</span>
      </button>
      
      <div v-if="showProviderBreakdown" class="space-y-2 pt-1 font-mono text-xs sm:text-sm animate-in fade-in duration-150" data-testid="provider-breakdown-list">
        <div v-for="prov in AI_PROVIDERS" :key="prov.id"
             class="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-xs sm:text-sm">
          <div class="flex items-center gap-2">
            <span class="font-bold text-zinc-200 text-sm font-sans">{{ prov.name }}</span>
            <span class="text-xs px-2 py-0.5 rounded font-sans" 
                  :class="prov.billingType === 'tokens_and_cost' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'">
              {{ prov.billingBadge }}
            </span>
          </div>
          <div class="text-right">
            <span class="font-bold text-zinc-100">{{ (tokenAuditState.providers[prov.id]?.totalTokens || 0).toLocaleString() }} T</span>
            <span v-if="prov.id === 'openrouter' && tokenAuditState.providers[prov.id]?.totalCostUSD" class="text-emerald-400 ml-1.5 font-bold">
              (${{ formatCostUSD(tokenAuditState.providers[prov.id]?.totalCostUSD) }})
            </span>
            <span class="text-zinc-400 text-xs ml-1.5 font-sans">({{ tokenAuditState.providers[prov.id]?.callCount || 0 }} 次)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Explanatory note answering the user's question directly -->
    <div class="text-xs text-zinc-400 leading-relaxed bg-zinc-900/50 p-3.5 rounded-2xl border border-zinc-800/70 space-y-2">
      <div class="text-zinc-200 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
        <span>💡</span> 计费与 Token 统计口径说明
      </div>
      <p>
        <strong>1. 为什么 OpenRouter 能精确计算具体金额？</strong><br>
        OpenRouter 作为官方聚合网关，在每次 API 调用回执中自带官方实时计费数值（精确到微美元），因此能够毫厘不差地实时统计金额消耗。
      </p>
      <p>
        <strong>2. 换成 DeepSeek / 智谱 / 通义千问等其他模型后怎么统计？</strong><br>
        DeepSeek 等国内官方直连 API 仅在回执中返回物理级真实的 Prompt 与 Completion Token 用量，官方并未开放外部实时价格查询接口。为保障数据绝对真实严谨，系统对这类模型<strong>严格记录物理 Token 审计，绝不瞎编臆测虚假金额</strong>。
      </p>
      <p>
        <strong>3. 切换不同模型后，外层金额会一直定格在那里吗？</strong><br>
        <strong>不会！</strong>外层概览条与当前生效的服务商严格联动：当前选择 OpenRouter 时，展示 OpenRouter 的 Token 与实时金额；切换为 DeepSeek 等模型时，自动切换为“官方 Token 审计”，杜绝把 OpenRouter 的历史金额错误定格在 DeepSeek 后面。
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { AI_PROVIDERS, aiSession, getActiveProvider } from "../ai/aiSession.js";
import {
  tokenAuditState,
  formatCostUSD,
  getProviderAudit,
  resetTokenAudit
} from "../ai/tokenTracker.js";

const emit = defineEmits(["close"]);

const showProviderBreakdown = ref(false);
const activeProvider = computed(getActiveProvider);
const currentProviderStats = computed(() => getProviderAudit(aiSession.activeProvider));

function handleResetAudit() {
  resetTokenAudit();
}
</script>

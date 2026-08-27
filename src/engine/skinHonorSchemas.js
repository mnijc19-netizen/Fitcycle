// Fitcycle Skin Localization & Semantic Mapping Schemas
// Strictly compliant with Chapter 1 of docs/FITCYCLE_CORE_CONSTITUTION.md

export const SKIN_HONOR_SCHEMAS = {
  default: {
    name: "科学力量体系 (Default)",
    tiers: {
      tier_1: { name: "Lv.1 新兵入门", sub: "熟悉器械轨迹与基础动作", icon: "🔰", color: "zinc" },
      tier_2: { name: "Lv.2 进阶学徒", sub: "掌握复合动作与推拉腿分化", icon: "🥉", color: "emerald" },
      tier_3: { name: "Lv.3 力量中坚", sub: "肌肉线条初显 · 规律自律", icon: "🥈", color: "sky" },
      tier_4: { name: "Lv.4 黄金雕刻家", sub: "自重卧推达成 · V字倒三角", icon: "🥇", color: "amber" },
      tier_5: { name: "Lv.5 资深健力士", sub: "累计做工超50吨 · 体格健硕", icon: "💎", color: "purple" },
      tier_6: { name: "Lv.6 传奇泰坦", sub: "出勤百练以上 · 力量与肉量双绝", icon: "🔥", color: "rose" },
      tier_7: { name: "Lv.7 巅峰神话", sub: "终身百吨宗师 · 开启巅峰竞技场", icon: "👑", color: "amber" }
    },
    badges: {
      badge_first_blood: { name: "初露锋芒", desc: "完成人生中第 1 次推拉腿打卡", icon: "🌱" },
      badge_consecutive_7d: { name: "战备先锋", desc: "累计完成 7 场正规训练", icon: "🎖️" },
      badge_monthly_iron: { name: "月度铁人", desc: "连续 4 周达成每周分化目标", icon: "🏆" },
      badge_veteran_100: { name: "百炼成钢", desc: "终身累计打卡达到 100 场", icon: "🏅" },
      badge_centurion_1000: { name: "千日宗师", desc: "终身累计打卡达到 1000 场传奇", icon: "🌌" },
      badge_tonnage_10t: { name: "十吨战备", desc: "累计总做工达到 10,000 kg", icon: "🚜" },
      badge_tonnage_50t: { name: "钢铁洪流", desc: "累计总做工达到 50,000 kg", icon: "✈️" },
      badge_tonnage_100t: { name: "百吨巨兽", desc: "累计总做工达到 100,000 kg", icon: "🚆" },
      badge_tonnage_1000t: { name: "百万吨神话", desc: "终身累计做工突破 1,000,000 kg", icon: "🌌" },
      badge_body_init: { name: "围度初探", desc: "建立首份身体形体解剖围度档案", icon: "📐" },
      badge_arm_titan: { name: "麒麟破茧", desc: "手臂围度较初始增长突破 +2.0 cm", icon: "💪" },
      badge_chest_armor: { name: "铠甲胸怀", desc: "胸围较初始增长突破 +3.5 cm", icon: "🛡️" },
      badge_v_taper: { name: "黄金 V 身", desc: "腰围收细且胸背宽度提升达成黄金比例", icon: "⏳" },
      badge_bench_bw: { name: "自重抗衡", desc: "卧推做工重量突破 1.0 倍自身体重", icon: "🏋️" },
      badge_squat_1_5bw: { name: "推土机动力", desc: "深蹲/腿举做工重量突破 1.5 倍自身体重", icon: "🚜" },
      badge_headshot_ace: { name: "满分专注", desc: "单场所有预设动作组数 100% 满额完成", icon: "🎯" },
      badge_awp_pr: { name: "重炮破纪录", desc: "打破主项动作历史最高负荷纪录 (PR)", icon: "💥" }
    }
  },

  cs: {
    name: "CS2 战术竞技天梯 (CS2 Tactical)",
    tiers: {
      tier_1: { name: "白银一 · 新兵入伍", sub: "Silver I · 熟悉常规交火发力", icon: "🎯", color: "zinc" },
      tier_2: { name: "白银精英 · 完美 D 级", sub: "Silver Elite · 分化战术战备成型", icon: "🎯", color: "emerald" },
      tier_3: { name: "黄金新星 · 完美 C 级", sub: "Gold Nova · 稳固中坚战术素养", icon: "⭐", color: "sky" },
      tier_4: { name: "大师级守卫 AK · 完美 B 级", sub: "Master Guardian · 核心主力输出", icon: "🔫", color: "amber" },
      tier_5: { name: "大老鹰/小地球 · 完美 A 级", sub: "Eagle / Supreme · 战术特训老将", icon: "🦅", color: "purple" },
      tier_6: { name: "大地球特工 · 完美 S 级", sub: "The Global Elite · 全场 MVP 战术首脑", icon: "🌐", color: "rose" },
      tier_7: { name: "天梯 Top 100 · 完美魔王 S", sub: "Demon King · 开启巅峰无上限天梯", icon: "👑", color: "amber" }
    },
    badges: {
      badge_first_blood: { name: "第一滴血 (First Blood)", desc: "完成首次战术特训分化交火打卡", icon: "🩸" },
      badge_consecutive_7d: { name: "战备特训周", desc: "累计完成 7 场正规战备特训", icon: "🎖️" },
      badge_monthly_iron: { name: "月度服役先锋", desc: "连续 4 周全勤坚守战术防线", icon: "🏆" },
      badge_veteran_100: { name: "百胜老兵金币", desc: "终身累计打卡达到 100 场服役记录", icon: "🥇" },
      badge_centurion_1000: { name: "千战传奇老兵", desc: "终身累计服役突破 1000 场天梯", icon: "🎖️" },
      badge_tonnage_10t: { name: "十吨战术弹药", desc: "累计做工输出达到 10,000 kg", icon: "📦" },
      badge_tonnage_50t: { name: "重装火力洪流", desc: "累计做工输出达到 50,000 kg", icon: "🚀" },
      badge_tonnage_100t: { name: "百吨装甲战车", desc: "累计做工输出突破 100,000 kg", icon: "🛡️" },
      badge_tonnage_1000t: { name: "百万吨战略要塞", desc: "终身做工输出突破 1,000,000 kg", icon: "🌌" },
      badge_body_init: { name: "特工形体扫描", desc: "首次建立特工解剖围度体态档案", icon: "📐" },
      badge_arm_titan: { name: "麒麟枪管", desc: "手臂臂围突破 +2.0 cm", icon: "💪" },
      badge_chest_armor: { name: "重型防弹装甲", desc: "胸部肌肉铠甲突破 +3.5 cm", icon: "🦺" },
      badge_v_taper: { name: "战术倒三角 V 身", desc: "腰腹收紧且背身拓宽达成黄金比例", icon: "⏳" },
      badge_bench_bw: { name: "单兵自重抗衡", desc: "卧推做工突破 1.0 倍自重推力", icon: "🏋️" },
      badge_squat_1_5bw: { name: "主战坦克动力", desc: "下肢力量突破 1.5 倍自重负荷", icon: "🚜" },
      badge_headshot_ace: { name: "枪枪爆头 (Headshot)", desc: "单场所有预设动作组数 100% 满额完成", icon: "🎯" },
      badge_awp_pr: { name: "起把大狙 (AWP Ace)", desc: "单场打破主项历史最高负荷 (PR)", icon: "🔫" }
    }
  },

  chamber: {
    name: "无畏契约特工体系 (Valorant Radiant)",
    tiers: {
      tier_1: { name: "黑铁特工 (Iron)", sub: "基础契约建立中", icon: "🛡️", color: "zinc" },
      tier_2: { name: "青铜特工 (Bronze)", sub: "射击与发力步入正轨", icon: "🥉", color: "emerald" },
      tier_3: { name: "白银 / 黄金特工 (Silver/Gold)", sub: "法式优雅渐入佳境", icon: "⭐", color: "sky" },
      tier_4: { name: "白金 / 钻石特工 (Plat/Diamond)", sub: "黄金身段 · 精密做工", icon: "💎", color: "amber" },
      tier_5: { name: "超凡入圣 (Ascendant)", sub: "顶级特工体能标准", icon: "⚜️", color: "purple" },
      tier_6: { name: "神话特工 (Immortal)", sub: "绝对掌控力 · 优雅无匹", icon: "🔥", color: "rose" },
      tier_7: { name: "赋能战神 (Radiant)", sub: "登峰造极 · 开启无上限巅峰榜", icon: "👑", color: "amber" }
    },
    badges: {
      badge_first_blood: { name: "首杀特工 (First Blood)", desc: "完成首次优雅特工打卡", icon: "⚜️" },
      badge_consecutive_7d: { name: "金色周勤", desc: "连续 7 场优雅出勤", icon: "🎖️" },
      badge_monthly_iron: { name: "月度贵族契约", desc: "连续 4 周达成每周分化目标", icon: "🏆" },
      badge_veteran_100: { name: "百战定制金枪", desc: "终身累计打卡达到 100 场", icon: "🥇" },
      badge_centurion_1000: { name: "永恒赋能宗师", desc: "终身累计打卡达到 1000 场", icon: "🌌" },
      badge_tonnage_10t: { name: "十吨黄金弹夹", desc: "累计总做工达到 10,000 kg", icon: "📦" },
      badge_tonnage_50t: { name: "精密军火库", desc: "累计总做工达到 50,000 kg", icon: "⚜️" },
      badge_tonnage_100t: { name: "百吨纯金泰坦", desc: "累计总做工达到 100,000 kg", icon: "👑" },
      badge_tonnage_1000t: { name: "璀璨赋能神话", desc: "终身累计做工突破 1,000,000 kg", icon: "🌌" },
      badge_body_init: { name: "精密身材测绘", desc: "建立高精度身材解剖围度档案", icon: "📐" },
      badge_arm_titan: { name: "黄金手臂曲线", desc: "手臂围度突破 +2.0 cm", icon: "💪" },
      badge_chest_armor: { name: "法式贵族胸膛", desc: "胸部轮廓突破 +3.5 cm", icon: "⚜️" },
      badge_v_taper: { name: "黄金剪裁 V 身", desc: "腰围收紧且背身拓宽达成黄金比例", icon: "⏳" },
      badge_bench_bw: { name: "优雅自重推力", desc: "卧推做工突破 1.0 倍自重", icon: "🏋️" },
      badge_squat_1_5bw: { name: "强权下肢动力", desc: "下肢力量突破 1.5 倍自重", icon: "🚜" },
      badge_headshot_ace: { name: "一击必杀 (One-Tap)", desc: "单场预设动作组数 100% 满额完成", icon: "🎯" },
      badge_awp_pr: { name: "金色终结者 (Tour de Force)", desc: "单场打破主项历史最高负荷 (PR)", icon: "💥" }
    }
  }
};

/**
 * Gets localized tier and badge presentation for the current skin
 * @param {string} skin - 'default' | 'cs' | 'chamber'
 * @param {Object} tierConfig - Tier object from getTierForScore
 * @param {Array} unlockedBadges - Badges array from evaluateUnlockedBadges
 * @returns {Object} Localized title, subtitle, badges map
 */
export function getSkinHonorPresentation(skin = "default", tierConfig = {}, unlockedBadges = []) {
  const schema = SKIN_HONOR_SCHEMAS[skin] || SKIN_HONOR_SCHEMAS.default;
  const tierKey = tierConfig.key || "tier_1";
  const localizedTier = schema.tiers[tierKey] || schema.tiers.tier_1;

  const localizedBadges = unlockedBadges.map((badge) => {
    const badgeInfo = schema.badges[badge.id] || { name: badge.id, desc: "成就已达成", icon: "🎖️" };
    return {
      ...badge,
      name: badgeInfo.name,
      desc: badgeInfo.desc,
      icon: badgeInfo.icon
    };
  });

  return {
    skinName: schema.name,
    tierName: localizedTier.name,
    tierSub: localizedTier.sub,
    tierIcon: localizedTier.icon || tierConfig.badgeIcon || "🔰",
    tierColor: localizedTier.color || "amber",
    badges: localizedBadges
  };
}
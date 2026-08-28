import { describe, it, expect, beforeEach } from "vitest";
import {
  calculateEquivalentTonnage,
  calculateInactivityDecay,
  calculateSessionPointsEarned,
  getTierForScore,
  evaluateUnlockedBadges,
  validateInputSanity,
  calculateShieldInventory,
  PRESTIGE_MEDAL_COLORS
} from "../src/engine/honorEngine.js";
import { SKIN_HONOR_SCHEMAS, getSkinHonorPresentation } from "../src/engine/skinHonorSchemas.js";
import { store, recordBodyMetric, getFullHonorProfile, performPrestigeReset, resetAllDataToDefault, toggleDeloadShield } from "../src/store/fitnessStore.js";

describe("Fitcycle Core Constitution & Honor Rating Engine", () => {
  beforeEach(() => {
    resetAllDataToDefault();
  });

  describe("1. Multi-Modal METs Normalization", () => {
    it("converts running to equivalent resistance tonnage", () => {
      // 5km running for a 70kg user: 5 * 70 * 8.5 = 2975 kg
      const eqTonnage = calculateEquivalentTonnage("running", { distanceKm: 5, weight: 70 });
      expect(eqTonnage).toBe(2975);
    });

    it("converts incline walking to equivalent tonnage", () => {
      // 30 min incline walk at 5% incline for 70kg user: 30 * 70 * 1.05 * 0.7 = 1544 kg
      const eqTonnage = calculateEquivalentTonnage("incline_walk", { durationMinutes: 30, inclinePercent: 5, weight: 70 });
      expect(eqTonnage).toBe(1544);
    });

    it("converts rowing / bike calories to equivalent tonnage", () => {
      // 300 kcal burned * 12.5 = 3750 kg
      const eqTonnage = calculateEquivalentTonnage("rowing_bike", { calories: 300 });
      expect(eqTonnage).toBe(3750);
    });
  });

  describe("2. Sports-Biology Inactivity Decay & 150% Redemption", () => {
    it("protects supercompensation window (0 - 72h) with ZERO decay", () => {
      const decay24 = calculateInactivityDecay(24, 1500, 1200);
      expect(decay24.decayPoints).toBe(0);
      expect(decay24.warningLevel).toBe("safe");

      const decay72 = calculateInactivityDecay(72, 1500, 1200);
      expect(decay72.decayPoints).toBe(0);
      expect(decay72.warningLevel).toBe("safe");
    });

    it("applies mild rust decay on Day 4 (72-96h)", () => {
      const decay84 = calculateInactivityDecay(84, 1500, 1200);
      expect(decay84.decayPoints).toBeGreaterThanOrEqual(1);
      expect(decay84.warningLevel).toBe("mild");
    });

    it("applies moderate decay on Days 5-7 (96-168h)", () => {
      const decay120 = calculateInactivityDecay(120, 1500, 1200);
      expect(decay120.decayPoints).toBeGreaterThanOrEqual(15);
      expect(decay120.warningLevel).toBe("moderate");
    });

    it("freezes decay completely when deload shield is active (Article 4.4)", () => {
      const decayDeload = calculateInactivityDecay(200, 1500, 1200, true);
      expect(decayDeload.decayPoints).toBe(0);
      expect(decayDeload.warningLevel).toBe("deload");
      expect(decayDeload.isDeload).toBe(true);
    });

    it("validates input sanity against human physiological extremes (Article 6.4)", () => {
      const normal = validateInputSanity(100, 10, 5000);
      expect(normal.isAnomalous).toBe(false);

      const extremeWeight = validateInputSanity(500, 10, 5000);
      expect(extremeWeight.isAnomalous).toBe(true);

      const extremeReps = validateInputSanity(100, 150, 5000);
      expect(extremeReps.isAnomalous).toBe(true);
    });

    it("applies 150% redemption rebound bonus after >= 5 days (120h) inactivity", () => {
      const summary = {
        id: "s1",
        planId: "p1",
        totalVolume: 5000,
        totalSets: 12
      };

      const regularEarned = calculateSessionPointsEarned(summary, [], 24);
      expect(regularEarned.isRedemptionRebound).toBe(false);
      expect(regularEarned.multiplier).toBe(1.0);
      expect(regularEarned.finalSessionPoints).toBe(35); // Grade A = 35 pts

      const redemptionEarned = calculateSessionPointsEarned(summary, [], 140);
      expect(redemptionEarned.isRedemptionRebound).toBe(true);
      expect(redemptionEarned.multiplier).toBe(1.5);
      expect(redemptionEarned.finalSessionPoints).toBe(Math.round(35 * 1.5)); // 53 pts
    });
  });

  describe("3. 7-Tier Ranks & Apex Infinite Elo", () => {
    it("maps 0-3000+ points to correct tiers", () => {
      expect(getTierForScore(150).tier).toBe(1);
      expect(getTierForScore(500).tier).toBe(2);
      expect(getTierForScore(900).tier).toBe(3);
      expect(getTierForScore(1400).tier).toBe(4);
      expect(getTierForScore(2000).tier).toBe(5);
      expect(getTierForScore(2600).tier).toBe(6);
      
      const apex = getTierForScore(3200);
      expect(apex.tier).toBe(7);
      expect(apex.isApex).toBe(true);
    });
  });

  describe("4. Skin Localization & Honor Schemas", () => {
    it("localizes ranks for default, cs2, and chamber skins", () => {
      const tierConfig = getTierForScore(2000); // Tier 5
      
      const defPres = getSkinHonorPresentation("default", tierConfig, []);
      expect(defPres.tierName).toContain("资深健力士");

      const csPres = getSkinHonorPresentation("cs", tierConfig, []);
      expect(csPres.tierName).toContain("大老鹰");

      const chamberPres = getSkinHonorPresentation("chamber", tierConfig, []);
      expect(chamberPres.tierName).toContain("超凡入圣");
    });
  });

  describe("5. Store Integration & Body Metrics", () => {
    it("records body metrics with 7-day cooldown anti-spam protection", () => {
      const profileBefore = getFullHonorProfile();
      const initialScore = profileBefore.score;

      // 1. Initial measurement (fresh user first measurement) -> awards points
      const res1 = recordBodyMetric({
        arm: 36.5,
        chest: 104,
        waist: 78,
        thigh: 58,
        weight: 73
      });

      expect(res1.isCooldown).toBe(false);
      expect(res1.awardedPoints).toBeGreaterThan(0);
      expect(store.bodyMetrics.length).toBe(1);

      // 2. Immediate second measurement (0 hours later) -> triggers 7-day cooldown (0 pts)
      const scoreAfterFirst = store.honorProfile.score;
      const res2 = recordBodyMetric({
        arm: 36.5,
        chest: 104,
        waist: 78,
        thigh: 58,
        weight: 73
      });

      expect(res2.isCooldown).toBe(true);
      expect(res2.awardedPoints).toBe(0); // 0 points awarded! Prevents exploit spam!
      expect(store.honorProfile.score).toBe(scoreAfterFirst);
      expect(store.bodyMetrics.length).toBe(2);
    });

    it("evaluates prestige reset when score >= 2900", () => {
      store.honorProfile.score = 3000;
      store.honorProfile.prestigeLevel = 1;
      
      const success = performPrestigeReset();
      expect(success).toBe(true);
      expect(store.honorProfile.prestigeLevel).toBe(2);
      expect(store.honorProfile.score).toBe(2400);
    });
  });

  describe("6. Tactical Deload Shield Acquisition, Recharge & Cooldown", () => {
    it("calculates shield recharge: 0 initial gift (novice probation) + 1 shield per 16 workouts (max 2 capacity)", () => {
      // 0 workouts -> 0 initial shield (Novice Probation Phase)
      const inv0 = calculateShieldInventory(0, 0, 0);
      expect(inv0.available).toBe(0);
      expect(inv0.isNoviceProbation).toBe(true);
      expect(inv0.currentChargeWorkouts).toBe(0);
      expect(inv0.nextShieldRemaining).toBe(16);

      // 8 workouts -> 0 shield, 50% charge (still novice probation)
      const inv8 = calculateShieldInventory(8, 0, 0);
      expect(inv8.available).toBe(0);
      expect(inv8.isNoviceProbation).toBe(true);
      expect(inv8.currentChargeWorkouts).toBe(8);
      expect(inv8.chargePercent).toBe(50);

      // 16 workouts (1 month consistent trainee) -> 1 shield forged
      const inv16 = calculateShieldInventory(16, 0, 0);
      expect(inv16.available).toBe(1);
      expect(inv16.isNoviceProbation).toBe(false);
      expect(inv16.currentChargeWorkouts).toBe(0);

      // 32 workouts (2 months trainee) -> 2 shields (max capacity)
      const inv32 = calculateShieldInventory(32, 0, 0);
      expect(inv32.available).toBe(2);

      // 48 workouts (3 months trainee) with 1 shield used previously -> 2 available (recharges back to max)
      const inv48 = calculateShieldInventory(48, 1, 0);
      expect(inv48.available).toBe(2);
    });

    it("activates deload shield after earning from workouts, consumes 1 shield, and enlists 21-day cooldown", () => {
      // Create 16 mock workouts for a 1-month dedicated user
      store.workoutLogs = Array.from({ length: 16 }, (_, i) => ({
        id: `mock_log_${i}`,
        date: `2026-08-${String(i + 1).padStart(2, '0')}`,
        timestamp: Date.now() - (16 - i) * 86400000,
        totalVolume: 3500,
        totalSets: 12
      }));

      const profile = getFullHonorProfile();
      expect(profile.shieldInventory.available).toBe(1);

      // Activate shield
      const res = toggleDeloadShield(true, 7);
      expect(res.success).toBe(true);
      expect(store.honorProfile.deloadShieldUntil).toBeGreaterThan(Date.now());
      expect(store.honorProfile.usedShieldsCount).toBe(1);

      // After consuming the only shield, available becomes 0
      const profileActive = getFullHonorProfile();
      expect(profileActive.isDeloadActive).toBe(true);
      expect(profileActive.shieldInventory.available).toBe(0);

      // Attempting to activate again when 0 available fails gracefully
      const resFail = toggleDeloadShield(true, 7);
      expect(resFail.success).toBe(false);
      expect(resFail.reason).toBe("no_shield");

      // Early return
      const resReturn = toggleDeloadShield(false);
      expect(resReturn.success).toBe(true);
      expect(getFullHonorProfile().isDeloadActive).toBe(false);
    });
  });

  describe("7. Vector Medals & Visual SVGs Mappings", () => {
    it("maps 7 tier ranks to high-definition SVG medals", () => {
      const tier1 = getTierForScore(100);
      const pres1 = getSkinHonorPresentation("default", tier1, []);
      expect(pres1.tierSvg).toBe("./themes/medals/rank-tier-1.svg");

      const tier7Default = getTierForScore(2950);
      const pres7Default = getSkinHonorPresentation("default", tier7Default, []);
      expect(pres7Default.tierSvg).toBe("./themes/medals/rank-tier-7.svg");

      const tier7Cs = getTierForScore(2950);
      const pres7Cs = getSkinHonorPresentation("cs", tier7Cs, []);
      expect(pres7Cs.tierSvg).toBe("./themes/medals/cs-rank-7.svg");

      const tier7Chamber = getTierForScore(2950);
      const pres7Chamber = getSkinHonorPresentation("chamber", tier7Chamber, []);
      expect(pres7Chamber.tierSvg).toBe("./themes/medals/val-rank-7.svg");
    });

    it("attaches vector medal SVGs to unlocked achievement badges", () => {
      const badges = evaluateUnlockedBadges({ totalTonnageKg: 120000 });
      const pres = getSkinHonorPresentation("default", getTierForScore(1500), badges);
      const badge100t = pres.badges.find(b => b.id === "badge_tonnage_100t");
      expect(badge100t).toBeDefined();
      expect(badge100t.svg).toBe("./themes/medals/badge-tonnage-100t.svg");
    });
  });
});
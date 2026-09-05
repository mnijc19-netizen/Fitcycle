import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { 
  calculateBMI, 
  getBMICategory, 
  calculateBMR, 
  calculateTDEE, 
  calculateMacroTargets, 
  calculateAdaptiveWeights, 
  getInitialHonorScore 
} from "../src/engine/bodyProfileEngine.js";
import { store, saveUserProfileAndRecalibrate } from "../src/store/fitnessStore.js";
import StrengthPlacementModal from "../src/components/StrengthPlacementModal.vue";

describe("Body Profile & Adaptive Strength Engine (Sports Physiology Tests)", () => {
  it("calculates accurate BMI and categories", () => {
    const bmiNormal = calculateBMI(70, 175);
    expect(bmiNormal).toBe(22.9);
    expect(getBMICategory(bmiNormal).level).toBe("normal");

    const bmiOverweight = calculateBMI(85, 175);
    expect(bmiOverweight).toBe(27.8);
    expect(getBMICategory(bmiOverweight).level).toBe("muscular_or_overweight");

    const bmiUnderweight = calculateBMI(50, 175);
    expect(bmiUnderweight).toBe(16.3);
    expect(getBMICategory(bmiUnderweight).level).toBe("underweight");
  });

  it("calculates clinical Mifflin-St Jeor BMR and TDEE accurately for male & female", () => {
    // Male: 10*70 + 6.25*175 - 5*25 + 5 = 1674 kcal
    const maleBmr = calculateBMR("male", 70, 175, 25);
    expect(maleBmr).toBe(1674);

    // Female: 10*55 + 6.25*165 - 5*25 - 161 = 1295 kcal
    const femaleBmr = calculateBMR("female", 55, 165, 25);
    expect(femaleBmr).toBe(1295);

    // TDEE with moderate activity factor (1.55)
    const tdee = calculateTDEE(maleBmr, "moderate");
    expect(tdee).toBe(2595);
  });

  it("calculates science-based daily protein target ranges", () => {
    const targets = calculateMacroTargets(70, "hypertrophy");
    expect(targets.dailyProteinTargetGrams).toBe(126); // 1.8g/kg
    expect(targets.proteinRange).toBe("112 ~ 140g");
    expect(targets.dailyWaterLiters).toBe(2.7);
  });

  it("calculates adaptive starting weights based on bodyweight and intuitive perception without needing to remember kg", () => {
    // Male, 70kg, 5~15 pushups (basic), natural squat, intermediate
    const maleRes = calculateAdaptiveWeights({
      gender: "male",
      weightKg: 70,
      pushupTier: "basic",
      squatTier: "natural",
      experienceLevel: "intermediate"
    });

    expect(maleRes.estimatedBases.bench).toBeGreaterThanOrEqual(35);
    expect(maleRes.estimatedBases.squat).toBeGreaterThanOrEqual(60);
    expect(maleRes.weightsMap["上斜哑铃卧推"]).toBeGreaterThanOrEqual(8);
    expect(maleRes.weightsMap["哈克深蹲 / 倒蹬腿举"]).toBeGreaterThanOrEqual(50);
    expect(maleRes.weightsMap["对握/宽握高位下拉"]).toBeGreaterThanOrEqual(30);

    // Female, 50kg, beginner pushups (<5), sedentary legs, beginner
    const femaleRes = calculateAdaptiveWeights({
      gender: "female",
      weightKg: 50,
      pushupTier: "beginner",
      squatTier: "sedentary",
      experienceLevel: "beginner"
    });

    // Beginner female should start safely with light dumbbells/machines
    expect(femaleRes.weightsMap["上斜哑铃卧推"]).toBeLessThanOrEqual(6);
    expect(femaleRes.weightsMap["哈克深蹲 / 倒蹬腿举"]).toBeLessThanOrEqual(35);
  });

  it("evaluates initial honor score with relative strength ratio calibration", () => {
    const scoreNovice = getInitialHonorScore("beginner", 0.5);
    expect(scoreNovice).toBeLessThan(700);

    const scoreElite = getInitialHonorScore("advanced", 1.3);
    expect(scoreElite).toBeGreaterThan(1300);
  });
});

describe("Store Integration & Adaptive Recalibration Actions", () => {
  beforeEach(() => {
    store.settings.gender = "male";
    store.settings.userWeight = 75;
    store.settings.userHeight = 178;
    store.bodyMetrics = [];
  });

  it("saveUserProfileAndRecalibrate updates store settings, initializes baseline body metric, and updates plans", () => {
    const res = saveUserProfileAndRecalibrate({
      gender: "male",
      userAge: 26,
      userHeight: 180,
      userWeight: 80,
      trainingGoal: "hypertrophy",
      pushupTier: "moderate",
      squatTier: "natural",
      strengthLevel: "intermediate"
    });

    expect(res.success).toBe(true);
    expect(store.settings.userWeight).toBe(80);
    expect(store.settings.hasConfiguredStrength).toBe(true);

    // Should create initial baseline entry in bodyMetrics
    expect(store.bodyMetrics.length).toBeGreaterThan(0);
    expect(store.bodyMetrics[0].weight).toBe(80);

    // Plans should have updated defaultWeight
    const pushPlan = store.plans.find(p => p.id === "plan-push");
    if (pushPlan && pushPlan.exercises.length > 0) {
      expect(pushPlan.exercises[0].defaultWeight).toBeGreaterThan(0);
    }
  });
});

describe("StrengthPlacementModal UI & Ergonomics", () => {
  let wrapper = null;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    document.body.innerHTML = "";
  });

  it("renders Step 1 with metabolic indicators, BMR, BMI, and passes mobile viewport overflow constraints", async () => {
    wrapper = mount(StrengthPlacementModal, {
      props: { visible: true },
      attachTo: document.body
    });

    const html = document.body.innerHTML + wrapper.html();

    // 1. Mobile viewport overflow & touch gesture constraints
    expect(html).toContain("overflow-hidden");
    expect(html).toContain("touch-none");
    expect(html).toContain("overflow-x-hidden");
    expect(html).toContain("touch-action: pan-y");

    // 2. Step 1 content: Physiological parameters & metabolic indicators
    expect(html).toContain("生理指标与代谢基准");
    expect(html).toContain("基础代谢 (BMR)");
    expect(html).toContain("每日建议蛋白质");
    expect(html).toContain("BMI");
  });
});

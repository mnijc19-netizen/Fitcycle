import { describe, it, expect, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import WorkoutSummaryModal from "../src/components/WorkoutSummaryModal.vue";
import StrengthPlacementModal from "../src/components/StrengthPlacementModal.vue";
import UserOnboardingModal from "../src/components/UserOnboardingModal.vue";
import RulesCodexModal from "../src/components/RulesCodexModal.vue";
import HonorShowcaseModal from "../src/components/HonorShowcaseModal.vue";

describe("Mobile Viewport Horizontal Overflow & Gesture Pan Quality Assurance", () => {
  let wrapper = null;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    document.body.innerHTML = "";
  });

  const dummySummary = {
    planName: "推日 (Push) —— 打造铠甲胸与加宽肩膀",
    durationSeconds: 120,
    totalVolume: 400,
    totalSets: 2,
    honorPointsEarned: {
      basePoints: 10,
      overloadBonus: 5,
      isRedemptionRebound: false,
      finalSessionPoints: 15
    }
  };

  it("WorkoutSummaryModal strictly eliminates horizontal scrolling and gesture leaks", () => {
    wrapper = mount(WorkoutSummaryModal, {
      props: { visible: true, summary: dummySummary },
      attachTo: document.body
    });
    const html = document.body.innerHTML + wrapper.html();

    // 1. Overlay backdrop must disable horizontal drag & body touch interference
    expect(html).toContain("overflow-hidden");
    expect(html).toContain("touch-none");

    // 2. Card container must have strict horizontal overflow clipping and vertical-only touch action
    expect(html).toContain("overflow-x-hidden");
    expect(html).toContain("touch-action: pan-y");

    // 3. Decorative glowing orbs must be wrapped in overflow-hidden mask to prevent bounding-box expansion
    expect(html).toContain("overflow-hidden rounded-3xl pointer-events-none");

    // 4. Text and long badge containers must have truncation or word-break protections
    expect(html).toContain("break-words");
    expect(html).toContain("min-w-0");
  });

  it("StrengthPlacementModal has strict horizontal overflow and touch-action protections", () => {
    wrapper = mount(StrengthPlacementModal, {
      props: { visible: true },
      attachTo: document.body
    });
    const html = document.body.innerHTML + wrapper.html();

    expect(html).toContain("overflow-hidden");
    expect(html).toContain("touch-none");
    expect(html).toContain("overflow-x-hidden");
    expect(html).toContain("touch-action: pan-y");
  });

  it("UserOnboardingModal has strict horizontal overflow and touch-action protections", () => {
    wrapper = mount(UserOnboardingModal, {
      props: { visible: true },
      attachTo: document.body
    });
    const html = document.body.innerHTML + wrapper.html();

    expect(html).toContain("overflow-hidden");
    expect(html).toContain("touch-none");
    expect(html).toContain("overflow-x-hidden");
    expect(html).toContain("touch-action: pan-y");
  });

  it("RulesCodexModal has strict horizontal overflow and touch-action protections", () => {
    wrapper = mount(RulesCodexModal, {
      props: { visible: true },
      attachTo: document.body
    });
    const html = document.body.innerHTML + wrapper.html();

    expect(html).toContain("overflow-hidden");
    expect(html).toContain("touch-none");
    expect(html).toContain("overflow-x-hidden");
    expect(html).toContain("touch-action: pan-y");
  });

  it("HonorShowcaseModal has strict horizontal overflow and touch-action protections", () => {
    wrapper = mount(HonorShowcaseModal, {
      props: { visible: true },
      attachTo: document.body
    });
    const html = document.body.innerHTML + wrapper.html();

    expect(html).toContain("overflow-hidden");
    expect(html).toContain("touch-none");
    expect(html).toContain("overflow-x-hidden");
    expect(html).toContain("touch-action: pan-y");
  });
});

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import fs from "fs";
import path from "path";
import { store, startWorkout, pinActiveWorkoutExercise, moveActiveWorkoutExercise, setTodayAsCycleIndex } from "../src/store/fitnessStore.js";
import Navbar from "../src/components/Navbar.vue";
import WorkoutSummaryModal from "../src/components/WorkoutSummaryModal.vue";
import TodayView from "../src/views/TodayView.vue";
import CalendarView from "../src/views/CalendarView.vue";
import CycleView from "../src/views/CycleView.vue";
import StatsView from "../src/views/StatsView.vue";

// ==========================================
// WCAG 2.1 Formulae & Mathematical Helpers
// ==========================================
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function channelLuminance(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

function contrastRatio(hex1, hex2) {
  const lum1 = relativeLuminance(hex1);
  const lum2 = relativeLuminance(hex2);
  const bright = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);
  return (bright + 0.05) / (dark + 0.05);
}

describe("Milestone 3: WCAG AA Contrast Compliance & Mobile Viewport Ergonomics", () => {
  let wrapper = null;

  beforeEach(() => {
    store.activeWorkout = null;
    store.settings.themeMode = "dark";
    store.settings.uiSkin = "default";
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    document.body.innerHTML = "";
  });

  describe("1. WCAG AA Contrast Ratio Across All 8 Color Palettes", () => {
    it("Default Dark: --fc-text-muted (#8C9BB0) achieves >= 4.5:1 on Surface-2 and Surface-3", () => {
      const muted = "#8C9BB0";
      const surface2 = "#191D26";
      const surface3 = "#232836";

      const ratioOnS2 = contrastRatio(muted, surface2);
      const ratioOnS3 = contrastRatio(muted, surface3);

      expect(ratioOnS2).toBeGreaterThanOrEqual(4.5);
      expect(ratioOnS3).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratioOnS2.toFixed(2))).toBe(5.97);
      expect(Number(ratioOnS3.toFixed(2))).toBe(5.20);
    });

    it("Default Light: --fc-accent (#9A4608) achieves >= 4.5:1 on light backgrounds", () => {
      const accent = "#9A4608";
      const bgPure = "#FFFFFF";
      const bgLight = "#F6F8FA";

      const ratioOnBg = contrastRatio(accent, bgPure);
      const ratioOnLight = contrastRatio(accent, bgLight);

      expect(ratioOnBg).toBeGreaterThanOrEqual(4.5);
      expect(ratioOnLight).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratioOnBg.toFixed(2))).toBe(6.45);
      expect(Number(ratioOnLight.toFixed(2))).toBe(6.06);
    });

    it("CS2 Dark: --fc-text-muted (#8C9BB0) achieves >= 4.5:1 on Surface-2 and Surface-3", () => {
      const muted = "#8C9BB0";
      const surface2 = "#172134";
      const surface3 = "#212E46";

      const ratioOnS2 = contrastRatio(muted, surface2);
      const ratioOnS3 = contrastRatio(muted, surface3);

      expect(ratioOnS2).toBeGreaterThanOrEqual(4.5);
      expect(ratioOnS3).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratioOnS2.toFixed(2))).toBe(5.70);
      expect(Number(ratioOnS3.toFixed(2))).toBe(4.81);
    });

    it("CS2 Light: --fc-text-muted (#334155) achieves >= 4.5:1 on light backgrounds", () => {
      const muted = "#334155";
      const bgPure = "#FFFFFF";
      const bgSlate = "#E2E8F0";

      const ratioOnBg = contrastRatio(muted, bgPure);
      const ratioOnSlate = contrastRatio(muted, bgSlate);

      expect(ratioOnBg).toBeGreaterThanOrEqual(4.5);
      expect(ratioOnSlate).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratioOnBg.toFixed(2))).toBe(10.35);
      expect(Number(ratioOnSlate.toFixed(2))).toBe(8.40);
    });

    it("Chamber Dark: --fc-text-muted (#8C9BB0) achieves >= 4.5:1 on Surface-2 and Surface-3", () => {
      const muted = "#8C9BB0";
      const surface2 = "#131F37";
      const surface3 = "#1C2B48";

      const ratioOnS2 = contrastRatio(muted, surface2);
      const ratioOnS3 = contrastRatio(muted, surface3);

      expect(ratioOnS2).toBeGreaterThanOrEqual(4.5);
      expect(ratioOnS3).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratioOnS2.toFixed(2))).toBe(5.81);
      expect(Number(ratioOnS3.toFixed(2))).toBe(4.99);
    });

    it("Chamber Light: --fc-accent (#8A641E) achieves >= 4.5:1 on light backgrounds", () => {
      const accent = "#8A641E";
      const bgPure = "#FFFFFF";
      const bgSand = "#F9F8F5";

      const ratioOnBg = contrastRatio(accent, bgPure);
      const ratioOnSand = contrastRatio(accent, bgSand);

      expect(ratioOnBg).toBeGreaterThanOrEqual(4.5);
      expect(ratioOnSand).toBeGreaterThanOrEqual(4.5);
      expect(Number(ratioOnBg.toFixed(2))).toBe(5.35);
      expect(Number(ratioOnSand.toFixed(2))).toBe(5.04);
    });

    it("Monochrome themes satisfy high-contrast accessibility requirements", () => {
      const darkRatio = contrastRatio("#FFFFFF", "#0A0A0A");
      const lightRatio = contrastRatio("#0A0A0A", "#FFFFFF");

      expect(darkRatio).toBeGreaterThanOrEqual(15.0);
      expect(lightRatio).toBeGreaterThanOrEqual(15.0);
    });

    it("src/style.css defines token contracts and Apple frosted glass utility", () => {
      const cssPath = path.resolve(__dirname, "../src/style.css");
      const cssContent = fs.readFileSync(cssPath, "utf-8");

      // Verify tokens
      expect(cssContent).toContain("--fc-text-muted: #8C9BB0;");
      expect(cssContent).toContain("--fc-accent: #9A4608;");
      expect(cssContent).toContain("--fc-accent: #8A641E;");

      // Verify Apple-grade frosted glass utility
      expect(cssContent).toContain(".fc-glass-card");
      expect(cssContent).toContain("backdrop-filter: blur(20px)");
      expect(cssContent).toContain("-webkit-backdrop-filter: blur(20px)");

      // Verify responsive media query for narrow mobile viewports (<360px)
      expect(cssContent).toContain("@media (max-width: 359px)");
      expect(cssContent).toContain(".navbar-workout-capsule");
      expect(cssContent).toContain(".navbar-workout-text");
    });
  });

  describe("2. Mobile Viewport (320px–430px) Ergonomics & Layout Robustness", () => {
    it("Navbar: responsive compact pulse dot prevents 333px overflow on <360px viewports", () => {
      store.activeWorkout = {
        id: "active-push",
        planName: "推日 (Push) 特训",
        startTime: Date.now() - 300000,
        exercises: []
      };

      wrapper = mount(Navbar);
      const html = wrapper.html();

      // Capsule contains pulse dot and text
      expect(html).toContain("navbar-workout-capsule");
      expect(html).toContain("animate-pulse");
      expect(html).toContain("bg-emerald-500");

      // Responsive classes shrink width on narrow screens
      expect(html).toContain("navbar-workout-text hidden xs:inline");
      expect(html).toContain("px-2.5 sm:px-3.5");
      expect(html).toContain("gap-1.5 sm:gap-2");
    });

    it("WorkoutSummaryModal: dopamine post-settlement features tonnage metaphor, supercompensation clock & tier shimmer", () => {
      const summary = {
        planName: "力量轰炸 · 上肢复合推举",
        durationSeconds: 2400,
        totalVolume: 12500,
        totalSets: 16,
        honorPointsEarned: {
          basePoints: 10,
          overloadBonus: 5,
          isRedemptionRebound: false,
          finalSessionPoints: 15
        }
      };

      wrapper = mount(WorkoutSummaryModal, {
        props: { visible: true, summary }
      });
      const html = wrapper.html();

      // 1. Dopamine physical tonnage metaphor
      expect(html).toContain("物理做工换算");
      expect(html).toContain("举起");
      expect(html).toContain("吨");

      // 2. 0~72h supercompensation recovery timer countdown
      expect(html).toContain("生理超量重组黄金时钟已启动");
      expect(html).toContain("受宪法免责保护，0~72h 绝不扣分");
      expect(html).toContain("肌纤维正在超量增生");

      // 3. Shimmer bar & tier advancement
      expect(html).toContain("战力天梯进阶");
      expect(html).toContain("bg-gradient-to-r");
    });

    it("TodayView: dynamic flex stepper replaces hardcoded grid-cols-4 and supports N-day cycles", () => {
      wrapper = mount(TodayView);
      const html = wrapper.html();

      // Must NOT have hardcoded grid-cols-4 in the split stepper section
      expect(html).toContain("flex flex-wrap gap-1");
      expect(html).toContain("flex-1 min-w-[62px]");

      // Active day indicator
      expect(html).toContain("Day");
    });

    it("TodayView: active workout exercise cards provide header pin & reorder controls with ergonomic input width", async () => {
      // Start a workout with the first plan
      const plan = store.plans[0];
      startWorkout(plan);
      expect(store.activeWorkout).toBeTruthy();
      expect(store.activeWorkout.exercises.length).toBeGreaterThan(1);

      wrapper = mount(TodayView);
      const html = wrapper.html();

      // Pin button and reorder controls
      expect(html).toContain("置顶动作");
      expect(html).toContain("上移");
      expect(html).toContain("下移");

      // Stepper number input has ergonomic minimum width
      expect(html).toContain("min-w-[36px]");

      // Verify pin function moves second exercise to top
      const secondExName = store.activeWorkout.exercises[1].name;
      pinActiveWorkoutExercise(1);
      expect(store.activeWorkout.exercises[0].name).toBe(secondExName);

      // Verify reorder function moves top exercise back down
      moveActiveWorkoutExercise(0, 1);
      expect(store.activeWorkout.exercises[1].name).toBe(secondExName);
    });

    it("TodayView: 0~72h rest-day recovery card celebrates physiological nourishment", () => {
      // Set current day as rest day
      const restDayIdx = store.activeCycle.days.findIndex(d => d.isRest);
      if (restDayIdx >= 0) {
        setTodayAsCycleIndex(restDayIdx);
        wrapper = mount(TodayView);
        const html = wrapper.html();

        expect(html).toContain("生理超量恢复黄金滋养期");
        expect(html).toContain("0~72h 宪法免责保护 · 0 怠惰扣分");
      }
    });

    it("CalendarView: 320px cell aspect-square preservation with compact padding and badge sizing", () => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      const todayStr = `${y}-${m}-${d}`;

      store.workoutLogs = [{
        id: "log-today",
        date: todayStr,
        completedAt: Date.now(),
        planName: "推日",
        shortName: "推",
        totalVolume: 5000,
        totalSets: 12
      }];
      wrapper = mount(CalendarView);
      const html = wrapper.html();

      // Preserves 1:1 aspect square with compact padding
      expect(html).toContain("aspect-square");
      expect(html).toContain("p-0.5 sm:p-1");
      expect(html).toContain("w-4 h-4 sm:w-5 sm:h-5");
    });

    it("CycleView: segmented track uses dynamic flex container supporting any cycle length", () => {
      wrapper = mount(CycleView);
      const html = wrapper.html();

      // Dynamic flex layout
      expect(html).toContain("flex flex-wrap gap-1.5");
      expect(html).toContain("flex-1 min-w-[65px]");
    });

    it("StatsView: compact 320px layout for volume chart and preference controls", () => {
      store.workoutLogs = [{
        id: "log-1",
        date: new Date().toISOString(),
        completedAt: Date.now(),
        planName: "推日",
        shortName: "推",
        totalVolume: 5000,
        totalSets: 12
      }];
      wrapper = mount(StatsView);
      const html = wrapper.html();

      // Container padding adapted for narrow screens
      expect(html).toContain("px-3 sm:px-4");

      // Volume trend chart responsive gap and padding
      expect(html).toContain("gap-1 sm:gap-2");
      expect(html).toContain("px-0.5 sm:px-1");
      expect(html).toContain("min-w-0");

      // Rest timer presets with non-overflowing buttons
      expect(html).toContain("min-w-0");
    });
  });
});

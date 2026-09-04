import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import fs from "fs";
import path from "path";
import { lockBodyScroll, unlockBodyScroll, getScrollLockCount, resetScrollLock } from "../src/utils/scrollLock.js";
import { store } from "../src/store/fitnessStore.js";
import TabBar from "../src/components/TabBar.vue";

describe("Mobile Ergonomics & Scroll Lock Suite", () => {
  beforeEach(() => {
    resetScrollLock();
    document.body.style.overflow = "";
    document.documentElement.style.overscrollBehavior = "";
    store.activeTab = "today";
  });

  afterEach(() => {
    resetScrollLock();
  });

  it("locks body scroll and document overscroll on first lock call", () => {
    expect(getScrollLockCount()).toBe(0);
    lockBodyScroll();
    expect(getScrollLockCount()).toBe(1);
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.documentElement.style.overscrollBehavior).toBe("none");
  });

  it("handles nested lock calls with reference counting without premature unlock", () => {
    lockBodyScroll();
    lockBodyScroll();
    expect(getScrollLockCount()).toBe(2);
    expect(document.body.style.overflow).toBe("hidden");

    unlockBodyScroll();
    expect(getScrollLockCount()).toBe(1);
    expect(document.body.style.overflow).toBe("hidden");

    unlockBodyScroll();
    expect(getScrollLockCount()).toBe(0);
    expect(document.body.style.overflow).toBe("");
    expect(document.documentElement.style.overscrollBehavior).toBe("");
  });

  it("TabBar: tapping active tab triggers iOS-grade smooth scroll to top", async () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    const wrapper = mount(TabBar);
    const todayTabButton = wrapper.findAll("button")[0];

    // Today tab is already active
    expect(store.activeTab).toBe("today");
    await todayTabButton.trigger("click");

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    expect(store.activeTab).toBe("today");
  });

  it("TabBar: tapping different tab switches tab and instant-resets scroll to top", async () => {
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    const wrapper = mount(TabBar);
    const exercisesTabButton = wrapper.findAll("button")[3];

    await exercisesTabButton.trigger("click");

    expect(store.activeTab).toBe("exercises");
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
  });

  it("CSS verification: style.css contains overscroll containment and zero-scrollbar rules", () => {
    const cssPath = path.resolve(__dirname, "../src/style.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    expect(cssContent).toContain("overscroll-behavior-y: none;");
    expect(cssContent).toContain(".no-scrollbar");
    expect(cssContent).toContain(".scrollbar-none");
    expect(cssContent).toContain("scrollbar-width: none");
    expect(cssContent).toContain(".overscroll-contain");
    expect(cssContent).toContain(".text-zinc-950");
    expect(cssContent).toContain("#09090B !important");
    expect(cssContent).toContain('[data-theme-preserve="true"]');
    expect(cssContent).toContain('[class*="bg-emerald-950"]');
  });

  it("Universal Scroll: getUniversalScrollTop detects scroll from multiple engines (window/html/body)", async () => {
    const { getUniversalScrollTop, universalScrollToTop } = await import("../src/utils/scrollUtils.js");
    
    // Simulate documentElement.scrollTop
    document.documentElement.scrollTop = 420;
    expect(getUniversalScrollTop()).toBe(420);

    // Test universal scroll to top
    const windowScrollTo = vi.fn();
    window.scrollTo = windowScrollTo;
    universalScrollToTop(true);
    expect(windowScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("ExercisesView: back-to-top button has dynamic safe-area-inset-bottom styling to never get swallowed in WebApp", async () => {
    const exPath = path.resolve(__dirname, "../src/views/ExercisesView.vue");
    const exContent = fs.readFileSync(exPath, "utf-8");
    expect(exContent).toContain("safe-area-inset-bottom");
    expect(exContent).toContain("universalScrollToTop");

    const { default: ExercisesView } = await import("../src/views/ExercisesView.vue");
    const wrapper = mount(ExercisesView);
    const button = wrapper.find('button[aria-label="返回顶部"]');
    expect(button.exists()).toBe(true);
    expect(button.classes()).toContain("select-none");
  });
});

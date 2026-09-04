import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { store, setUISkin, unlockSkin, startRestTimer, stopRestTimer } from "../src/store/fitnessStore.js";
import { getPasscodeSkin } from "../src/utils/themeManager.js";
import Navbar from "../src/components/Navbar.vue";
import TabBar from "../src/components/TabBar.vue";
import RestTimerFloat from "../src/components/RestTimerFloat.vue";

describe("CS2 Official Theme Integration & UI Tests", () => {
  beforeEach(() => {
    store.settings.uiSkin = "default";
    store.settings.unlockedSkins = ["default"];
  });

  afterEach(() => {
    store.settings.uiSkin = "default";
    store.settings.unlockedSkins = ["default"];
    stopRestTimer();
  });

  it("unlocks CS2 skin using official passcodes 7355806 and 起把狙！", () => {
    expect(getPasscodeSkin("7355806")).toBe("cs");
    expect(getPasscodeSkin("起把狙！")).toBe("cs");
    expect(getPasscodeSkin("起把狙")).toBe("cs");
    expect(getPasscodeSkin(" 7355806 ")).toBe("cs");
    expect(getPasscodeSkin("invalid")).toBeNull();
  });

  it("applies CS2 skin to DOM dataset and store", () => {
    const res = unlockSkin("7355806");
    expect(res.success).toBe(true);
    expect(store.settings.unlockedSkins).toContain("cs");
    expect(store.settings.uiSkin).toBe("cs");
    expect(document.documentElement.dataset.skin).toBe("cs");
  });

  it("renders authentic CS2 Dust2 hero and official HUD in Navbar when skin is cs", () => {
    unlockSkin("7355806");
    const wrapper = mount(Navbar);
    
    const html = wrapper.html();
    expect(html).toContain("cs-hero.jpg");
    expect(html).toContain("health_cross.svg");
    expect(html).toContain("armor_helmet.svg");
    expect(html).toContain("chevron_money.svg");
    expect(html).toContain("$16,000");
    expect(html).toContain("AI 教练");
  });

  it("renders official CS2 weapon and rank SVGs in TabBar when skin is cs", () => {
    unlockSkin("7355806");
    const wrapper = mount(TabBar);
    
    const html = wrapper.html();
    expect(html).toContain("ak47.svg");
    expect(html).toContain("c4.svg");
    expect(html).toContain("defuser.svg");
    expect(html).toContain("awp.svg");
    expect(html).toContain("skillgroup18.svg");
  });

  it("renders official CS2 C4 rest timer when active and skin is cs", async () => {
    unlockSkin("7355806");
    startRestTimer(45);
    
    const wrapper = mount(RestTimerFloat);
    const html = wrapper.html();
    expect(html).toContain("bomb_planted.svg");
    expect(html).toContain("45s");
  });

  it("unlocks monochrome skin via passcodes and syncs DOM", () => {
    expect(getPasscodeSkin("典藏黑白")).toBe("monochrome");
    expect(getPasscodeSkin("monochrome")).toBe("monochrome");
    expect(getPasscodeSkin("黑白")).toBe("monochrome");
    
    const res = unlockSkin("典藏黑白");
    expect(res.success).toBe(true);
    expect(store.settings.unlockedSkins).toContain("monochrome");
    expect(store.settings.uiSkin).toBe("monochrome");
    expect(document.documentElement.dataset.skin).toBe("monochrome");
  });

  it("toggles light/dark themeMode while preserving honor rank and lore 100% immutable", async () => {
    unlockSkin("7355806"); // Activate CS2
    expect(store.settings.uiSkin).toBe("cs");

    const { getFullHonorProfile, toggleThemeMode, setThemeMode } = await import("../src/store/fitnessStore.js");
    const initialHonor = getFullHonorProfile();
    const initialTierName = initialHonor.presentation.tierName;
    const initialSkinName = initialHonor.presentation.skinName;

    // Switch to light mode
    setThemeMode("light");
    expect(store.settings.themeMode).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-mode")).toBe("light");

    // Honor rank and presentation must be strictly identical!
    const lightHonor = getFullHonorProfile();
    expect(lightHonor.presentation.tierName).toBe(initialTierName);
    expect(lightHonor.presentation.skinName).toBe(initialSkinName);

    // Toggle back to dark mode
    toggleThemeMode();
    expect(store.settings.themeMode).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-mode")).toBe("dark");
  });

  it("renders light/dark toggle button in Navbar and responds to click", async () => {
    const { setThemeMode } = await import("../src/store/fitnessStore.js");
    setThemeMode("dark");

    const wrapper = mount(Navbar);
    expect(wrapper.html()).toContain("☀️");

    // Click toggle button
    const toggleBtn = wrapper.find('button[title="切换为白昼晨光"]');
    expect(toggleBtn.exists()).toBe(true);
    await toggleBtn.trigger("click");

    expect(store.settings.themeMode).toBe("light");
  });
});
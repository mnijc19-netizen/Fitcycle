import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import {
  exportBackupJSON,
  importBackupJSON,
  restoreDefaultSkin,
  setUISkin,
  unlockSkin,
  store
} from "../src/store/fitnessStore.js";
import {
  AI_KEY_SESSION_KEYS,
  clearAIConnection,
  setSessionApiKey
} from "../src/ai/aiSession.js";

let baseline;

beforeEach(() => {
  baseline = JSON.parse(exportBackupJSON());
  localStorage.clear();
  sessionStorage.clear();
  clearAIConnection();
});

afterEach(() => {
  importBackupJSON(JSON.stringify(baseline));
  clearAIConnection();
});

describe("production data compatibility", () => {
  it("exports the production 1.1 backup shape", () => {
    const backup = JSON.parse(exportBackupJSON());
    expect(backup.version).toBe("1.1");
    expect(backup.settings).toHaveProperty("uiSkin");
    expect(backup.settings).toHaveProperty("unlockedSkins");
    expect(backup).not.toHaveProperty("ai");
    expect(backup).not.toHaveProperty("apiKey");
    expect(store.exercises).toHaveLength(56);
  });

  it("imports a 1.0 backup and re-exports it as 1.1", () => {
    const legacy = JSON.parse(exportBackupJSON());
    legacy.version = "1.0";
    legacy.settings = {
      defaultRestSeconds: 60,
      soundEnabled: false,
      vibrationEnabled: false,
      weightUnit: "kg",
      theme: "dark"
    };

    expect(importBackupJSON(JSON.stringify(legacy))).toBe(true);
    const reexported = JSON.parse(exportBackupJSON());
    expect(reexported.version).toBe("1.1");
    expect(reexported.settings.uiSkin).toBe("default");
    expect(reexported.settings.unlockedSkins).toEqual(["default"]);
    expect(reexported.settings.defaultRestSeconds).toBe(60);
  });

  it("keeps unlocked skins and training data independent from AI state", () => {
    const logsBefore = JSON.stringify(store.workoutLogs);
    store.settings.unlockedSkins = ["default", "chamber"];
    setUISkin("chamber");
    expect(store.settings.uiSkin).toBe("chamber");
    setSessionApiKey("session-secret-marker", "deepseek");
    expect(restoreDefaultSkin().success).toBe(true);
    expect(store.settings.uiSkin).toBe("default");
    expect(store.settings.unlockedSkins).toEqual(["default", "chamber"]);
    expect(JSON.stringify(store.workoutLogs)).toBe(logsBefore);
  });

  it("unlocks CS2 skin with classic passcodes and allows seamless multi-skin switching", () => {
    expect(store.settings.unlockedSkins).toEqual(["default"]);
    
    // Unlock Chamber
    const resChamber = unlockSkin("诶，勃勒");
    expect(resChamber.success).toBe(true);
    expect(resChamber.skin).toBe("chamber");
    expect(store.settings.uiSkin).toBe("chamber");
    expect(store.settings.unlockedSkins).toContain("chamber");

    // Unlock CS2
    const resCS = unlockSkin("7355608");
    expect(resCS.success).toBe(true);
    expect(resCS.skin).toBe("cs");
    expect(store.settings.uiSkin).toBe("cs");
    expect(store.settings.unlockedSkins).toEqual(["default", "chamber", "cs"]);

    // Test alias passcodes
    expect(unlockSkin("rush b").success).toBe(true);
    expect(unlockSkin("大地球").success).toBe(true);

    // Switch between all 3 skins
    setUISkin("chamber");
    expect(store.settings.uiSkin).toBe("chamber");
    setUISkin("cs");
    expect(store.settings.uiSkin).toBe("cs");
    setUISkin("default");
    expect(store.settings.uiSkin).toBe("default");
  });

  it("stores the API key only in sessionStorage and excludes it from app storage and backup", async () => {
    setSessionApiKey("session-secret-marker", "deepseek");
    setSessionApiKey("second-secret-marker", "zhipu");
    store.settings.defaultRestSeconds = 91;
    await nextTick();

    expect(sessionStorage.getItem(AI_KEY_SESSION_KEYS.deepseek)).toBe("session-secret-marker");
    expect(sessionStorage.getItem(AI_KEY_SESSION_KEYS.zhipu)).toBe("second-secret-marker");
    expect(exportBackupJSON()).not.toContain("session-secret-marker");
    expect(exportBackupJSON()).not.toContain("second-secret-marker");
    expect(localStorage.getItem("fitcycle_app_data_v1") || "").not.toContain("session-secret-marker");
    expect(localStorage.getItem("fitcycle_app_data_v1") || "").not.toContain("second-secret-marker");
    expect(store).not.toHaveProperty("apiKey");
  });
});


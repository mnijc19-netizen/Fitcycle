import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import {
  exportBackupJSON,
  importBackupJSON,
  restoreDefaultSkin,
  setUISkin,
  store
} from "../src/store/fitnessStore.js";
import {
  OPENROUTER_KEY_SESSION_KEY,
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
    setSessionApiKey("session-secret-marker");
    expect(restoreDefaultSkin().success).toBe(true);
    expect(store.settings.uiSkin).toBe("default");
    expect(store.settings.unlockedSkins).toEqual(["default", "chamber"]);
    expect(JSON.stringify(store.workoutLogs)).toBe(logsBefore);
  });

  it("stores the API key only in sessionStorage and excludes it from app storage and backup", async () => {
    setSessionApiKey("session-secret-marker");
    store.settings.defaultRestSeconds = 91;
    await nextTick();

    expect(sessionStorage.getItem(OPENROUTER_KEY_SESSION_KEY)).toBe("session-secret-marker");
    expect(exportBackupJSON()).not.toContain("session-secret-marker");
    expect(localStorage.getItem("fitcycle_app_data_v1") || "").not.toContain("session-secret-marker");
    expect(store).not.toHaveProperty("apiKey");
  });
});


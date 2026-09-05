// Theme & Skin System Core Manager (Pure Functions & DOM Adapter)

export const PASSCODE_SECRET = "诶，勃勒";
export const PASSCODE_ALIASES = [
  "诶，勃勒",
  "诶,勃勒",
  "哎，勃勒",
  "哎,勃勒",
  "诶，伯勒",
  "诶,伯勒",
  "eibole",
  "ei, bole",
  "ei,bole",
  "ei bole",
  "chamber"
];

export const CS_PASSCODE_ALIASES = [
  "7355806",
  "7355608",
  "起把狙！",
  "起把狙!",
  "起把狙"
];

export const MONOCHROME_PASSCODE_ALIASES = [
  "monochrome",
  "黑白",
  "极简黑白",
  "典藏黑白",
  "mono"
];

export const VALID_SKINS = ["default", "chamber", "cs", "monochrome"];
export const VALID_THEME_MODES = ["dark", "light"];

export const DEFAULT_SETTINGS = {
  defaultRestSeconds: 90,
  userHeight: 175, // cm (fixed base height for anthropometric body proportions)
  soundEnabled: true,
  vibrationEnabled: true,
  weightUnit: "kg",
  theme: "dark", // legacy compatibility
  themeMode: "dark", // 'dark' | 'light'
  uiSkin: "default", // 'default' | 'chamber' | 'cs' | 'monochrome'
  unlockedSkins: ["default"], // string[]
  hasSeenOnboarding: false,
  strengthLevel: "intermediate", // 'beginner' | 'intermediate' | 'advanced' | 'custom'
  hasConfiguredStrength: false,
  customBaseWeights: { bench: 50, squat: 70, pull: 45 }
};

/**
 * Normalizes user passcode input by trimming leading/trailing whitespace and converting to lowercase.
 */
export function normalizePasscode(input) {
  if (typeof input !== "string") return "";
  return input.trim().toLowerCase();
}

/**
 * Identifies which skin the user's passcode unlocks (chamber, cs, or null).
 */
export function getPasscodeSkin(input) {
  const clean = normalizePasscode(input);
  if (!clean) return null;
  if (PASSCODE_ALIASES.some(alias => clean === alias.toLowerCase())) {
    return "chamber";
  }
  if (CS_PASSCODE_ALIASES.some(alias => clean === alias.toLowerCase())) {
    return "cs";
  }
  if (MONOCHROME_PASSCODE_ALIASES.some(alias => clean === alias.toLowerCase())) {
    return "monochrome";
  }
  return null;
}

/**
 * Verification of secret passcodes (Chamber, CS2, or Monochrome).
 */
export function verifyPasscode(input) {
  return Boolean(getPasscodeSkin(input));
}

/**
 * Deep sanitization and backward compatibility migration for settings object.
 * Safely handles:
 * - Empty / null localStorage
 * - Old schema without uiSkin or unlockedSkins
 * - Corrupted skin names or unlocked arrays
 * - Chamber, CS, or Monochrome selected when not in unlocked list
 * - Migration from legacy theme property to themeMode ('dark' | 'light')
 */
export function sanitizeSettings(rawSettings) {
  if (!rawSettings || typeof rawSettings !== "object") {
    return { ...DEFAULT_SETTINGS, unlockedSkins: [...DEFAULT_SETTINGS.unlockedSkins] };
  }

  // Deep clone default settings as base
  const sanitized = {
    ...DEFAULT_SETTINGS,
    ...rawSettings
  };

  // 1. Sanitize unlockedSkins array
  let unlocked = Array.isArray(rawSettings.unlockedSkins) ? rawSettings.unlockedSkins : [];
  // Ensure default is always present
  if (!unlocked.includes("default")) {
    unlocked.unshift("default");
  }
  // Filter valid known skins only
  unlocked = unlocked.filter(s => VALID_SKINS.includes(s));
  sanitized.unlockedSkins = [...new Set(unlocked)];

  // 2. Sanitize active uiSkin
  const requestedSkin = typeof rawSettings.uiSkin === "string" ? rawSettings.uiSkin : "default";
  if (VALID_SKINS.includes(requestedSkin) && sanitized.unlockedSkins.includes(requestedSkin)) {
    sanitized.uiSkin = requestedSkin;
  } else {
    sanitized.uiSkin = "default";
  }

  // 3. Sanitize themeMode (with legacy theme property support)
  const legacyTheme = typeof rawSettings.theme === "string" ? rawSettings.theme : null;
  const requestedMode = typeof rawSettings.themeMode === "string"
    ? rawSettings.themeMode
    : (legacyTheme || DEFAULT_SETTINGS.themeMode);

  sanitized.themeMode = VALID_THEME_MODES.includes(requestedMode) ? requestedMode : "dark";
  sanitized.theme = sanitized.themeMode; // keep legacy property aligned

  // 4. Ensure other numerical/boolean settings are safe
  if (typeof sanitized.defaultRestSeconds !== "number" || sanitized.defaultRestSeconds <= 0) {
    sanitized.defaultRestSeconds = DEFAULT_SETTINGS.defaultRestSeconds;
  }
  if (typeof sanitized.userHeight !== "number" || sanitized.userHeight < 120 || sanitized.userHeight > 230) {
    sanitized.userHeight = DEFAULT_SETTINGS.userHeight;
  }
  sanitized.soundEnabled = Boolean(sanitized.soundEnabled);
  sanitized.vibrationEnabled = Boolean(sanitized.vibrationEnabled);
  sanitized.hasConfiguredStrength = Boolean(sanitized.hasConfiguredStrength);
  sanitized.strengthLevel = ["beginner", "intermediate", "advanced", "custom"].includes(rawSettings.strengthLevel)
    ? rawSettings.strengthLevel
    : "intermediate";
  sanitized.customBaseWeights = (rawSettings.customBaseWeights && typeof rawSettings.customBaseWeights === "object")
    ? { ...DEFAULT_SETTINGS.customBaseWeights, ...rawSettings.customBaseWeights }
    : { ...DEFAULT_SETTINGS.customBaseWeights };

  return sanitized;
}

/**
 * Synchronously applies data-skin and data-theme attributes, and mobile theme-color meta tag.
 */
export function applyThemeToDOM(skin = "default", mode = "dark") {
  const validSkin = VALID_SKINS.includes(skin) ? skin : "default";
  const validMode = VALID_THEME_MODES.includes(mode) ? mode : "dark";

  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-skin", validSkin);
    document.documentElement.setAttribute("data-theme", validMode);
    document.documentElement.setAttribute("data-mode", validMode);
    document.documentElement.classList.toggle("dark", validMode === "dark");

    if (document.body) {
      document.body.setAttribute("data-skin", validSkin);
      document.body.setAttribute("data-theme", validMode);
      document.body.setAttribute("data-mode", validMode);
      document.body.classList.toggle("dark", validMode === "dark");
    }

    // Update browser theme-color for mobile status bar (iOS/Android)
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement("meta");
      metaTheme.name = "theme-color";
      document.head.appendChild(metaTheme);
    }
    const themeColors = {
      default: { dark: "#0B0D11", light: "#F6F8FA" },
      cs: { dark: "#090D15", light: "#F1F5F9" },
      chamber: { dark: "#070B14", light: "#F9F8F5" },
      monochrome: { dark: "#000000", light: "#FFFFFF" }
    };
    const activeColor = themeColors[validSkin]?.[validMode] || (validMode === "light" ? "#F6F8FA" : "#0B0D11");
    metaTheme.setAttribute("content", activeColor);
  }
}

/**
 * Backward-compatible helper that delegates to applyThemeToDOM preserving current mode.
 */
export function applySkinToDOM(skin) {
  const currentMode = (typeof document !== "undefined" && (document.documentElement.getAttribute("data-theme") || document.documentElement.getAttribute("data-mode"))) || "dark";
  applyThemeToDOM(skin, currentMode);
}


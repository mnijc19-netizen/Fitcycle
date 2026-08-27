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

export const DEFAULT_SETTINGS = {
  defaultRestSeconds: 90,
  soundEnabled: true,
  vibrationEnabled: true,
  weightUnit: "kg",
  theme: "dark",
  uiSkin: "default", // 'default' | 'chamber'
  unlockedSkins: ["default"] // string[]
};

/**
 * Normalizes user passcode input by trimming leading/trailing whitespace and converting to lowercase.
 */
export function normalizePasscode(input) {
  if (typeof input !== "string") return "";
  return input.trim().toLowerCase();
}

/**
 * Verification of the secret passcode.
 * Accepts exact Chinese '诶，勃勒', half-width comma '诶,勃勒', pinyin 'eibole', or alias 'chamber'.
 */
export function verifyPasscode(input) {
  const clean = normalizePasscode(input);
  if (!clean) return false;
  return PASSCODE_ALIASES.some(alias => clean === alias.toLowerCase());
}

/**
 * Deep sanitization and backward compatibility migration for settings object.
 * Safely handles:
 * - Empty / null localStorage
 * - Old schema without uiSkin or unlockedSkins
 * - Corrupted skin names or unlocked arrays
 * - Chamber selected when not in unlocked list
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
  unlocked = unlocked.filter(s => s === "default" || s === "chamber");
  sanitized.unlockedSkins = [...new Set(unlocked)];

  // 2. Sanitize active uiSkin
  const requestedSkin = typeof rawSettings.uiSkin === "string" ? rawSettings.uiSkin : "default";
  if (requestedSkin === "chamber" && sanitized.unlockedSkins.includes("chamber")) {
    sanitized.uiSkin = "chamber";
  } else {
    sanitized.uiSkin = "default";
  }

  // 3. Ensure other numerical/boolean settings are safe
  if (typeof sanitized.defaultRestSeconds !== "number" || sanitized.defaultRestSeconds <= 0) {
    sanitized.defaultRestSeconds = DEFAULT_SETTINGS.defaultRestSeconds;
  }
  sanitized.soundEnabled = Boolean(sanitized.soundEnabled);
  sanitized.vibrationEnabled = Boolean(sanitized.vibrationEnabled);

  return sanitized;
}

/**
 * Synchronously applies data-skin attribute and mobile theme-color meta tag
 */
export function applySkinToDOM(skin) {
  const validSkin = skin === "chamber" ? "chamber" : "default";
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-skin", validSkin);
    if (document.body) {
      document.body.setAttribute("data-skin", validSkin);
    }

    // Update browser theme-color for mobile status bar (iOS/Android)
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement("meta");
      metaTheme.name = "theme-color";
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute("content", validSkin === "chamber" ? "#070B14" : "#09090b");
  }
}

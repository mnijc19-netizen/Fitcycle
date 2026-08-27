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

export const VALID_SKINS = ["default", "chamber", "cs"];

export const DEFAULT_SETTINGS = {
  defaultRestSeconds: 90,
  userHeight: 175, // cm (fixed base height for anthropometric body proportions)
  soundEnabled: true,
  vibrationEnabled: true,
  weightUnit: "kg",
  theme: "dark",
  uiSkin: "default", // 'default' | 'chamber' | 'cs'
  unlockedSkins: ["default"], // string[]
  hasSeenOnboarding: false
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
  return null;
}

/**
 * Verification of secret passcodes (Chamber or CS2).
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
 * - Chamber or CS selected when not in unlocked list
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

  // 3. Ensure other numerical/boolean settings are safe
  if (typeof sanitized.defaultRestSeconds !== "number" || sanitized.defaultRestSeconds <= 0) {
    sanitized.defaultRestSeconds = DEFAULT_SETTINGS.defaultRestSeconds;
  }
  if (typeof sanitized.userHeight !== "number" || sanitized.userHeight < 120 || sanitized.userHeight > 230) {
    sanitized.userHeight = DEFAULT_SETTINGS.userHeight;
  }
  sanitized.soundEnabled = Boolean(sanitized.soundEnabled);
  sanitized.vibrationEnabled = Boolean(sanitized.vibrationEnabled);

  return sanitized;
}

/**
 * Synchronously applies data-skin attribute and mobile theme-color meta tag
 */
export function applySkinToDOM(skin) {
  const validSkin = VALID_SKINS.includes(skin) ? skin : "default";
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
    const themeColors = {
      chamber: "#070B14",
      cs: "#0B0F19",
      default: "#09090b"
    };
    metaTheme.setAttribute("content", themeColors[validSkin] || "#09090b");
  }
}


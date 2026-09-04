/**
 * Empirical Stress Test Harness for Milestone 1:
 * State Decoupling, DOM Synchronization, Meta Theme-Color, and Rank Immutability
 * 
 * Executed by teamwork_preview_challenger_m1_1.
 */

import { Window } from 'happy-dom';
import fs from 'fs';
import path from 'path';

// Setup Happy DOM environment in Node
const window = new Window();
global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.localStorage = window.localStorage;

// Now import modules
import {
  VALID_SKINS,
  VALID_THEME_MODES,
  DEFAULT_SETTINGS,
  sanitizeSettings,
  applyThemeToDOM,
  applySkinToDOM,
  getPasscodeSkin,
  verifyPasscode
} from '../src/utils/themeManager.js';

import {
  store,
  setThemeMode,
  toggleThemeMode,
  setUISkin,
  unlockSkin,
  restoreDefaultSkin,
  getFullHonorProfile
} from '../src/store/fitnessStore.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    const errMsg = `  ✗ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`;
    console.error(errMsg);
    failures.push(errMsg);
  }
}

console.log('===============================================================');
console.log('⚡ FITCYCLE EMPIRICAL STRESS TEST HARNESS — MILESTONE 1');
console.log('===============================================================\n');

// --------------------------------------------------------------------
// SUITE 1: Rapid 100x Dark/Light Mode Switching & Rank Immutability
// --------------------------------------------------------------------
console.log('--- SUITE 1: Rapid 100x Dark/Light Switching & Rank Immutability ---');

// Test with 3 different honor tier profiles
const testProfiles = [
  { name: 'Rookie Profile (850)', score: 850, hoursAgo: 24 },
  { name: 'Mid-Tier Profile (1650)', score: 1650, hoursAgo: 80 }, // Inactivity decay active (>72h)
  { name: 'Elite Profile (2850)', score: 2850, hoursAgo: 10, deloadShield: true } // Deload active
];

for (const profile of testProfiles) {
  store.settings.uiSkin = 'default';
  store.settings.unlockedSkins = ['default'];
  store.settings.themeMode = 'dark';
  store.honorProfile = {
    score: profile.score,
    prestigeLevel: 2,
    prestigeYear: 2026,
    highestScore: profile.score + 100,
    lastWorkoutTimestamp: Date.now() - (profile.hoursAgo * 3600 * 1000),
    unlockedBadges: [],
    deloadShieldUntil: profile.deloadShield ? Date.now() + 86400000 * 5 : 0
  };

  const initialProfile = getFullHonorProfile();
  const baselineScore = initialProfile.score;
  const baselineRawScore = initialProfile.rawScore;
  const baselineTierId = initialProfile.tier.id;
  const baselineTierName = initialProfile.tier.name;
  const baselineDecayPoints = initialProfile.decayInfo.decayPoints;
  const baselineIsDeload = initialProfile.isDeloadActive;

  let modeSwitchErrors = 0;
  let domSyncErrors = 0;
  let metaColorErrors = 0;
  const startTime = Date.now();

  for (let i = 1; i <= 100; i++) {
    const nextMode = toggleThemeMode();
    const expectedMode = i % 2 === 1 ? 'light' : 'dark';

    if (nextMode !== expectedMode || store.settings.themeMode !== expectedMode || store.settings.theme !== expectedMode) {
      modeSwitchErrors++;
    }

    const htmlTheme = document.documentElement.getAttribute('data-theme');
    const htmlMode = document.documentElement.getAttribute('data-mode');
    const bodyTheme = document.body.getAttribute('data-theme');
    const bodyMode = document.body.getAttribute('data-mode');
    if (htmlTheme !== expectedMode || htmlMode !== expectedMode || bodyTheme !== expectedMode || bodyMode !== expectedMode) {
      domSyncErrors++;
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    const expectedColor = expectedMode === 'light' ? '#F6F8FA' : '#0B0D11';
    if (!meta || meta.getAttribute('content') !== expectedColor) {
      metaColorErrors++;
    }

    // Assert Rank Score & Tier Immutability at every switch
    const current = getFullHonorProfile();
    if (
      current.score !== baselineScore ||
      current.rawScore !== baselineRawScore ||
      current.tier.id !== baselineTierId ||
      current.tier.name !== baselineTierName ||
      current.decayInfo.decayPoints !== baselineDecayPoints ||
      current.isDeloadActive !== baselineIsDeload
    ) {
      assert(false, `Switch ${i}: getFullHonorProfile mutated!`, `Expected score ${baselineScore}, got ${current.score}`);
    }
  }

  const duration = Date.now() - startTime;

  assert(modeSwitchErrors === 0, `100 rapid mode toggles for [${profile.name}] state consistency`, `errors: ${modeSwitchErrors}`);
  assert(domSyncErrors === 0, `100 rapid mode toggles for [${profile.name}] DOM data-* sync`, `errors: ${domSyncErrors}`);
  assert(metaColorErrors === 0, `100 rapid mode toggles for [${profile.name}] meta theme-color sync`, `errors: ${metaColorErrors}`);
  assert(duration < 1000, `100 switches executed in ${duration}ms (target < 1000ms)`);

  const finalProfile = getFullHonorProfile();
  assert(finalProfile.score === baselineScore, `Final score strictly preserved for [${profile.name}] (${finalProfile.score} === ${baselineScore})`);
  assert(finalProfile.tier.id === baselineTierId, `Final tier strictly preserved for [${profile.name}] (${finalProfile.tier.name})`);
  assert(finalProfile.decayInfo.decayPoints === baselineDecayPoints, `Inactivity decay strictly preserved for [${profile.name}]`);
  assert(finalProfile.isDeloadActive === baselineIsDeload, `Deload state strictly preserved for [${profile.name}]`);
}

// --------------------------------------------------------------------
// SUITE 2: All 8 Skin x Mode Combinations Matrix (4 skins x 2 modes)
// --------------------------------------------------------------------
console.log('\n--- SUITE 2: All 8 Skin x Mode Combinations Matrix ---');

const expectedThemeColors = {
  default: { dark: '#0B0D11', light: '#F6F8FA' },
  cs: { dark: '#090D15', light: '#F1F5F9' },
  chamber: { dark: '#070B14', light: '#F9F8F5' },
  monochrome: { dark: '#000000', light: '#FFFFFF' }
};

// Ensure all skins are unlocked
store.settings.unlockedSkins = ['default', 'chamber', 'cs', 'monochrome'];

for (const skin of VALID_SKINS) {
  for (const mode of VALID_THEME_MODES) {
    setUISkin(skin);
    setThemeMode(mode);

    const expColor = expectedThemeColors[skin][mode];
    const htmlSkin = document.documentElement.getAttribute('data-skin');
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    const htmlMode = document.documentElement.getAttribute('data-mode');
    const bodySkin = document.body.getAttribute('data-skin');
    const bodyTheme = document.body.getAttribute('data-theme');
    const bodyMode = document.body.getAttribute('data-mode');
    const metaTag = document.querySelector('meta[name="theme-color"]');
    const metaColor = metaTag ? metaTag.getAttribute('content') : null;

    assert(
      htmlSkin === skin && bodySkin === skin,
      `Matrix [skin=${skin}, mode=${mode}]: DOM data-skin is "${skin}"`
    );
    assert(
      htmlTheme === mode && bodyTheme === mode && htmlMode === mode && bodyMode === mode,
      `Matrix [skin=${skin}, mode=${mode}]: DOM data-theme & data-mode are "${mode}"`
    );
    assert(
      metaColor === expColor,
      `Matrix [skin=${skin}, mode=${mode}]: <meta name="theme-color"> is "${expColor}"`,
      `Got "${metaColor}"`
    );

    // Verify honor presentation responds to skin
    const honor = getFullHonorProfile();
    assert(
      honor.presentation && honor.presentation.skinName && honor.presentation.tierName,
      `Matrix [skin=${skin}, mode=${mode}]: Honor profile has skinName "${honor.presentation.skinName}" and tierName "${honor.presentation.tierName}"`
    );
  }
}

// --------------------------------------------------------------------
// SUITE 3: Meta Tag Edge Cases & Standalone applyThemeToDOM
// --------------------------------------------------------------------
console.log('\n--- SUITE 3: Meta Tag Edge Cases & Resiliency ---');

// Test 3.1: Automatically creates meta tag if missing
const existingMeta = document.querySelector('meta[name="theme-color"]');
if (existingMeta) existingMeta.remove();
assert(document.querySelector('meta[name="theme-color"]') === null, 'Pre-check: Meta tag removed');

applyThemeToDOM('chamber', 'light');
const recreatedMeta = document.querySelector('meta[name="theme-color"]');
assert(recreatedMeta !== null, 'applyThemeToDOM created <meta name="theme-color"> when missing');
assert(recreatedMeta?.getAttribute('content') === '#F9F8F5', 'Created meta tag has correct Chamber Light hex (#F9F8F5)');

// Test 3.2: Reuses meta tag without duplicate tags
applyThemeToDOM('cs', 'dark');
const allMetas = document.querySelectorAll('meta[name="theme-color"]');
assert(allMetas.length === 1, `Exactly 1 <meta name="theme-color"> element in DOM (count=${allMetas.length})`);
assert(allMetas[0].getAttribute('content') === '#090D15', 'Updated existing meta tag to CS Dark hex (#090D15)');

// Test 3.3: Invalid / Corrupt Inputs Fallback
applyThemeToDOM('corrupt_skin_xyz', 'corrupt_mode_123');
assert(document.documentElement.getAttribute('data-skin') === 'default', 'Corrupt skin falls back to "default"');
assert(document.documentElement.getAttribute('data-theme') === 'dark', 'Corrupt mode falls back to "dark"');
assert(document.querySelector('meta[name="theme-color"]')?.getAttribute('content') === '#0B0D11', 'Corrupt inputs fall back to default dark hex (#0B0D11)');

// Test 3.4: applySkinToDOM preserves current mode
applyThemeToDOM('default', 'light');
applySkinToDOM('monochrome');
assert(document.documentElement.getAttribute('data-skin') === 'monochrome', 'applySkinToDOM sets skin to "monochrome"');
assert(document.documentElement.getAttribute('data-theme') === 'light', 'applySkinToDOM preserves existing "light" mode');
assert(document.querySelector('meta[name="theme-color"]')?.getAttribute('content') === '#FFFFFF', 'applySkinToDOM updates meta to monochrome light hex (#FFFFFF)');

// --------------------------------------------------------------------
// SUITE 4: sanitizeSettings Exhaustive Backward Compatibility
// --------------------------------------------------------------------
console.log('\n--- SUITE 4: sanitizeSettings Backward Compatibility & Schema Migration ---');

// 4.1 Null / Undefined / Non-object inputs
const sNull = sanitizeSettings(null);
assert(sNull.themeMode === 'dark' && sNull.theme === 'dark', 'sanitizeSettings(null) gives themeMode: "dark"');
assert(sNull.uiSkin === 'default', 'sanitizeSettings(null) gives uiSkin: "default"');
assert(Array.isArray(sNull.unlockedSkins) && sNull.unlockedSkins.includes('default'), 'sanitizeSettings(null) contains ["default"]');

const sString = sanitizeSettings('invalid_string');
assert(sString.themeMode === 'dark' && sString.uiSkin === 'default', 'sanitizeSettings("string") returns safe defaults');

// 4.2 Legacy objects with { theme: "dark" }
const sLegacyDark = sanitizeSettings({ theme: 'dark' });
assert(sLegacyDark.themeMode === 'dark', 'Legacy { theme: "dark" } migrated to themeMode: "dark"');
assert(sLegacyDark.theme === 'dark', 'Legacy { theme: "dark" } maintains theme: "dark"');

// 4.3 Legacy objects with { theme: "light" }
const sLegacyLight = sanitizeSettings({ theme: 'light' });
assert(sLegacyLight.themeMode === 'light', 'Legacy { theme: "light" } migrated to themeMode: "light"');
assert(sLegacyLight.theme === 'light', 'Legacy { theme: "light" } maintains theme: "light"');

// 4.4 Modern schema with both themeMode and theme (themeMode takes precedence)
const sPrecedence = sanitizeSettings({ themeMode: 'light', theme: 'dark' });
assert(sPrecedence.themeMode === 'light', 'themeMode: "light" overrides legacy theme: "dark"');
assert(sPrecedence.theme === 'light', 'Legacy theme property synchronized to "light"');

// 4.5 Invalid themeMode falls back to dark
const sInvalidMode = sanitizeSettings({ themeMode: 'neon_pink', theme: 'solar' });
assert(sInvalidMode.themeMode === 'dark', 'Invalid themeMode falls back to "dark"');

// 4.6 Locked skin exploitation protection
const sHackedSkin = sanitizeSettings({ uiSkin: 'chamber', unlockedSkins: ['default'] });
assert(sHackedSkin.uiSkin === 'default', 'sanitizeSettings resets uiSkin to "default" if skin is not in unlockedSkins');

// 4.7 Corrupted unlockedSkins recovery
const sCorruptedUnlocked = sanitizeSettings({
  uiSkin: 'cs',
  unlockedSkins: ['unknown_skin', 'cs', 'cs', null, undefined, 123]
});
assert(sCorruptedUnlocked.unlockedSkins.includes('default'), 'Corrupted unlockedSkins automatically ensures "default"');
assert(sCorruptedUnlocked.unlockedSkins.includes('cs'), 'Corrupted unlockedSkins retains valid "cs"');
assert(!sCorruptedUnlocked.unlockedSkins.includes('unknown_skin'), 'Corrupted unlockedSkins strips unknown skins');
assert(sCorruptedUnlocked.uiSkin === 'cs', 'uiSkin "cs" valid when present in sanitized unlockedSkins');

// 4.8 Numerical property bounding
const sCorruptNums = sanitizeSettings({
  defaultRestSeconds: -99,
  userHeight: 500
});
assert(sCorruptNums.defaultRestSeconds === DEFAULT_SETTINGS.defaultRestSeconds, 'Invalid defaultRestSeconds reverted to default');
assert(sCorruptNums.userHeight === DEFAULT_SETTINGS.userHeight, 'Out-of-bounds userHeight reverted to default');

// --------------------------------------------------------------------
// SUITE 5: Secret Passcode Unlocking & Anti-Exploit
// --------------------------------------------------------------------
console.log('\n--- SUITE 5: Secret Passcode & Anti-Exploit Verification ---');

// Reset store to default
store.settings.uiSkin = 'default';
store.settings.unlockedSkins = ['default'];

// Attempt to set locked skin directly
setUISkin('chamber');
assert(store.settings.uiSkin === 'default', 'Direct setUISkin("chamber") rejected when locked');

// Unlock chamber
const chamberRes = unlockSkin('chamber');
assert(chamberRes.success === true, 'unlockSkin("chamber") succeeds');
assert(store.settings.unlockedSkins.includes('chamber'), 'unlockedSkins contains "chamber"');
assert(store.settings.uiSkin === 'chamber', 'Active uiSkin set to "chamber"');

// Unlock CS2
const csRes = unlockSkin('7355806');
assert(csRes.success === true, 'unlockSkin("7355806") succeeds');
assert(store.settings.unlockedSkins.includes('cs'), 'unlockedSkins contains "cs"');
assert(store.settings.uiSkin === 'cs', 'Active uiSkin set to "cs"');

// Unlock Monochrome
const monoRes = unlockSkin('典藏黑白');
assert(monoRes.success === true, 'unlockSkin("典藏黑白") succeeds');
assert(store.settings.unlockedSkins.includes('monochrome'), 'unlockedSkins contains "monochrome"');
assert(store.settings.uiSkin === 'monochrome', 'Active uiSkin set to "monochrome"');

// Invalid passcode
const invalidRes = unlockSkin('invalid_hack_code');
assert(invalidRes.success === false, 'Invalid passcode correctly rejected');

// restoreDefaultSkin
const restoreRes = restoreDefaultSkin();
assert(restoreRes.success === true, 'restoreDefaultSkin succeeds');
assert(store.settings.uiSkin === 'default', 'store.settings.uiSkin is "default"');
assert(document.documentElement.getAttribute('data-skin') === 'default', 'DOM data-skin is "default"');

// --------------------------------------------------------------------
// SUITE 6: CSS Variable & Token Consistency Audit
// --------------------------------------------------------------------
console.log('\n--- SUITE 6: CSS Variable & Token Consistency Audit ---');

const cssPath = path.resolve('src/style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const requiredSelectors = [
  '[data-skin="default"][data-theme="dark"]',
  '[data-skin="default"][data-theme="light"]',
  '[data-skin="cs"][data-theme="dark"]',
  '[data-skin="cs"][data-theme="light"]',
  '[data-skin="chamber"][data-theme="dark"]',
  '[data-skin="chamber"][data-theme="light"]',
  '[data-skin="monochrome"][data-theme="dark"]',
  '[data-skin="monochrome"][data-theme="light"]'
];

for (const sel of requiredSelectors) {
  const exists = cssContent.includes(sel);
  assert(exists, `CSS defines selector: ${sel}`);
}

const requiredTokens = [
  '--fc-bg',
  '--fc-surface-1',
  '--fc-surface-2',
  '--fc-surface-3',
  '--fc-border',
  '--fc-text-primary',
  '--fc-text-secondary',
  '--fc-text-muted',
  '--fc-accent'
];

for (const token of requiredTokens) {
  const tokenRegex = new RegExp(`${token}\\s*:`, 'g');
  const matches = cssContent.match(tokenRegex);
  // Each token should appear at least 8 times (once per palette)
  const count = matches ? matches.length : 0;
  assert(count >= 8, `Token "${token}" declared across palettes (found ${count} declarations, min 8 required)`);
}

// Verify that every background color in expectedThemeColors matches the CSS definition
for (const [skin, modes] of Object.entries(expectedThemeColors)) {
  for (const [mode, hex] of Object.entries(modes)) {
    // Check if the hex appears in the css near the selector
    const sel = `[data-skin="${skin}"][data-theme="${mode}"]`;
    const selIdx = cssContent.indexOf(sel);
    let hexFound = false;
    if (selIdx !== -1) {
      const blockSlice = cssContent.slice(selIdx, selIdx + 400);
      hexFound = blockSlice.toLowerCase().includes(hex.toLowerCase());
    }
    assert(hexFound, `CSS definition for ${skin} ${mode} contains matching --fc-bg hex (${hex})`);
  }
}

// --------------------------------------------------------------------
// SUITE 7: Backup JSON Import With Legacy Schema & Corrupt Settings
// --------------------------------------------------------------------
console.log('\n--- SUITE 7: Backup JSON Import With Legacy Schema & Corrupt Settings ---');

import { importBackupJSON, exportBackupJSON } from '../src/store/fitnessStore.js';

// 7.1 Import legacy backup with { theme: "light" } and no themeMode
const legacyBackup = {
  plans: [{ id: 'p1', name: 'Test Plan', cycleDays: [] }],
  activeCycle: 'p1',
  settings: {
    theme: 'light',
    uiSkin: 'chamber',
    unlockedSkins: ['default', 'chamber']
  }
};

const importRes1 = importBackupJSON(JSON.stringify(legacyBackup));
assert(importRes1 === true, 'importBackupJSON succeeds with legacy schema');
assert(store.settings.themeMode === 'light', 'Imported legacy theme: "light" properly set store.settings.themeMode to "light"');
assert(store.settings.theme === 'light', 'Imported legacy theme property synchronized to "light"');
assert(store.settings.uiSkin === 'chamber', 'Imported uiSkin "chamber" set');
assert(document.documentElement.getAttribute('data-skin') === 'chamber', 'DOM data-skin updated to "chamber"');
assert(document.documentElement.getAttribute('data-theme') === 'light', 'DOM data-theme updated to "light"');
assert(document.querySelector('meta[name="theme-color"]')?.getAttribute('content') === '#F9F8F5', 'Meta theme-color updated to Chamber Light (#F9F8F5)');

// 7.2 Import malicious/corrupted settings backup
const corruptedBackup = {
  plans: [{ id: 'p1', name: 'Test Plan', cycleDays: [] }],
  activeCycle: 'p1',
  settings: {
    themeMode: 'corrupt_neon',
    uiSkin: 'cs',
    unlockedSkins: ['default'] // cs is NOT unlocked!
  }
};

const importRes2 = importBackupJSON(JSON.stringify(corruptedBackup));
assert(importRes2 === true, 'importBackupJSON handles corrupted settings');
assert(store.settings.themeMode === 'dark', 'Corrupt themeMode in backup sanitized to "dark"');
assert(store.settings.uiSkin === 'default', 'Locked uiSkin "cs" in backup reset to "default"');
assert(document.documentElement.getAttribute('data-skin') === 'default', 'DOM data-skin sanitized to "default"');
assert(document.documentElement.getAttribute('data-theme') === 'dark', 'DOM data-theme sanitized to "dark"');
assert(document.querySelector('meta[name="theme-color"]')?.getAttribute('content') === '#0B0D11', 'Meta theme-color sanitized to Default Dark (#0B0D11)');

// --------------------------------------------------------------------
// FINAL SUMMARY
// --------------------------------------------------------------------
console.log('\n===============================================================');
console.log(`STRESS TEST EXECUTION COMPLETE:`);
console.log(`Total Assertions: ${totalTests}`);
console.log(`Passed:           ${passedTests}`);
console.log(`Failed:           ${failedTests}`);
console.log('===============================================================');

if (failedTests > 0) {
  console.error('\nFAILED ASSERTIONS:');
  failures.forEach(f => console.error(f));
  process.exit(1);
} else {
  console.log('\n🎉 ALL 100+ EMPIRICAL STRESS TESTS PASSED WITH ZERO ERRORS.');
  process.exit(0);
}

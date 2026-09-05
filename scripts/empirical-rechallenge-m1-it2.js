/**
 * Empirical Adversarial Re-Challenge Test Harness for Milestone 1 Iteration 2
 * Author: teamwork_preview_challenger_m1_it2_1
 * Verifies BUG-CHALLENGE-01 through 05 fixes and boundary robustness
 */

import { Window } from 'happy-dom';

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLElement = window.HTMLElement;
globalThis.localStorage = window.localStorage;

try {
  Object.defineProperty(globalThis.navigator, 'vibrate', {
    value: () => true,
    configurable: true,
    writable: true
  });
} catch (e) {
  // Ignore
}

const { DEFAULT_EXERCISES } = await import("../src/data/defaultPlans.js");
const { recognizeMachineByQuery } = await import("../src/engine/machineRecognitionEngine.js");
const { getExerciseMemoryPool, getExerciseHistoricalPrefill } = await import("../src/engine/exerciseMemoryEngine.js");
const { store, moveActiveWorkoutExercise, pinActiveWorkoutExercise, addExerciseToActiveWorkout, startWorkout, finishWorkout } = await import("../src/store/fitnessStore.js");
const { openAICoachWithContext } = await import("../src/ai/aiSession.js");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${message}`);
  } else {
    failedTests++;
    failures.push(message);
    console.error(`  ✗ [FAIL] ${message}`);
  }
}

function assertDoesNotThrow(fn, message) {
  totalTests++;
  try {
    const res = fn();
    passedTests++;
    console.log(`  ✓ [PASS] ${message}`);
    return res;
  } catch (e) {
    failedTests++;
    failures.push(`${message} (Threw ${e.name}: ${e.message})`);
    console.error(`  ✗ [FAIL] ${message} (Threw ${e.name}: ${e.message})`);
  }
}

console.log("\n================================================================");
console.log("🔥 EMPIRICAL ADVERSARIAL RE-CHALLENGE SUITE (ITERATION 2)");
console.log("================================================================\n");

// -----------------------------------------------------------------------------
// VECTOR 1: BUG-CHALLENGE-01 — Punctuation Soup Re-Challenge
// -----------------------------------------------------------------------------
console.log("▶ [TEST GROUP 1] BUG-CHALLENGE-01: Pure Punctuation Inputs");

const purePunctuationSamples = [
  ",,,,,,,,",
  "？？？？？",
  "，，，。！？",
  "   ,,,   ",
  "---___---",
  ";;;;;;;",
  "！？！？！？",
  " \t\n ,,, ... ;;; ！？ \t ",
  "-,_，。！？!?;；",
  "??????????",
  "!!!!!!!!!!",
  "............."
];

for (const p of purePunctuationSamples) {
  const res = recognizeMachineByQuery(p, DEFAULT_EXERCISES);
  assert(Array.isArray(res) && res.length === 0, `Punctuation '${p}' must return empty array (got ${res?.length} items)`);
  if (res && res.length > 0) {
    assert(!res.some(r => r.confidence >= 0.90), `Punctuation '${p}' must not have any match with >= 0.90 confidence`);
  }
}

// Mixed punctuation with legitimate text: should still match legitimate text!
console.log("\n▶ [TEST GROUP 1b] Mixed Punctuation with Valid Exercise Text");
const mixedSamples = [
  { input: ",,,卧推,,,", expectedName: "卧推" },
  { input: "！杠铃卧推？", expectedName: "杠铃卧推" },
  { input: "，，高位下拉！！", expectedName: "高位下拉" }
];

for (const m of mixedSamples) {
  const res = recognizeMachineByQuery(m.input, DEFAULT_EXERCISES);
  assert(Array.isArray(res) && res.length > 0, `Mixed input '${m.input}' should yield recommendations`);
  assert(res.some(r => r.exercise.name.includes(m.expectedName)), `Mixed input '${m.input}' should match '${m.expectedName}'`);
}

// -----------------------------------------------------------------------------
// VECTOR 2: BUG-CHALLENGE-02 — Single-Character Queries Re-Challenge
// -----------------------------------------------------------------------------
console.log("\n▶ [TEST GROUP 2] BUG-CHALLENGE-02: Single-Character Queries");

const singleCharSamples = ["a", "b", "c", "z", "A", "Z", "1", "9"];
for (const ch of singleCharSamples) {
  const res = recognizeMachineByQuery(ch, DEFAULT_EXERCISES);
  // Must never trigger 0.95 confidence exact name match
  const exact95Matches = res.filter(r => r.confidence >= 0.95);
  assert(exact95Matches.length === 0, `Single character '${ch}' must NOT trigger >=0.95 confidence matches (got ${exact95Matches.length})`);
  // In fact, single gibberish char has no gym tag matches, so length should be 0
  assert(res.length === 0, `Single char '${ch}' with no tags should return 0 results (got ${res.length})`);
}

// Multi-character legitimate query should still get exact name match (score >= 0.90)
const legitQueries = ["卧推", "引体向上", "深蹲", "硬拉", "阿诺德推举"];
for (const lq of legitQueries) {
  const res = recognizeMachineByQuery(lq, DEFAULT_EXERCISES);
  assert(res.length > 0, `Legitimate query '${lq}' should return matches`);
  assert(res[0].confidence >= 0.90, `Legitimate query '${lq}' should have top match confidence >= 0.90 (got ${res[0]?.confidence})`);
}

// -----------------------------------------------------------------------------
// VECTOR 3: BUG-CHALLENGE-03 / 04 / 05 — Corrupted Data & Null Tolerance
// -----------------------------------------------------------------------------
console.log("\n▶ [TEST GROUP 3] BUG-CHALLENGE-03: Corrupted workoutLogs (null / undefined / sparse)");

const corruptedLogsArrays = [
  [null],
  [undefined],
  [null, null, null],
  [null, undefined, 42, "corrupt", {}],
  new Array(10).fill(null),
  [null, { id: "valid-1", completedAt: Date.now(), exercises: [] }, null]
];

for (let i = 0; i < corruptedLogsArrays.length; i++) {
  const logs = corruptedLogsArrays[i];
  assertDoesNotThrow(() => {
    const pool = getExerciseMemoryPool(logs);
    assert(pool && typeof pool === "object", `Pool returned an object for corrupted logs index ${i}`);
    assert(Array.isArray(pool.pinned) && Array.isArray(pool.recent) && Array.isArray(pool.frequent), `Pool has pinned/recent/frequent arrays`);
  }, `getExerciseMemoryPool with corrupted logs sample #${i} does not throw`);

  assertDoesNotThrow(() => {
    const prefill = getExerciseHistoricalPrefill("ex-bench-press", logs);
    assert(prefill && typeof prefill === "object", `Prefill returned an object for corrupted logs index ${i}`);
    assert(Array.isArray(prefill.sets), `Prefill sets is an array`);
  }, `getExerciseHistoricalPrefill with corrupted logs sample #${i} does not throw`);
}

console.log("\n▶ [TEST GROUP 4] BUG-CHALLENGE-04: Corrupted log.exercises (null / undefined / sparse items)");

const corruptedExercisesLogs = [
  [{ id: "log-1", completedAt: Date.now(), exercises: [null] }],
  [{ id: "log-2", completedAt: Date.now(), exercises: [undefined, null, "invalid", 99] }],
  [{ id: "log-3", completedAt: Date.now(), exercises: null }],
  [{ id: "log-4", completedAt: Date.now(), exercises: [null, { exerciseId: "ex-barbell-bench-press", sets: [{ completed: true, weight: 100, reps: 8 }] }] }]
];

for (let i = 0; i < corruptedExercisesLogs.length; i++) {
  const logs = corruptedExercisesLogs[i];
  assertDoesNotThrow(() => {
    const pool = getExerciseMemoryPool(logs);
    assert(pool && typeof pool === "object", `Pool handled corrupted exercises logs #${i}`);
  }, `getExerciseMemoryPool with corrupted exercises sample #${i} does not throw`);

  assertDoesNotThrow(() => {
    const prefill = getExerciseHistoricalPrefill("ex-barbell-bench-press", logs);
    assert(prefill && typeof prefill === "object", `Prefill handled corrupted exercises logs #${i}`);
    if (i === 3) {
      // In sample 3, the valid exercise was embedded alongside null!
      assert(prefill.source === "history", `Prefill extracted history despite preceding null`);
      assert(prefill.sets[0].weight === 100, `Prefill preserved weight 100 from valid exercise`);
    }
  }, `getExerciseHistoricalPrefill with corrupted exercises sample #${i} does not throw`);
}

console.log("\n▶ [TEST GROUP 5] BUG-CHALLENGE-05: Corrupted logEx.sets (null / undefined / sparse sets)");

const corruptedSetsLogs = [
  [{ id: "log-s1", completedAt: Date.now(), exercises: [{ exerciseId: "ex-barbell-bench-press", sets: [null] }] }],
  [{ id: "log-s2", completedAt: Date.now(), exercises: [{ exerciseId: "ex-barbell-bench-press", sets: [null, undefined, 123] }] }],
  [{ id: "log-s3", completedAt: Date.now(), exercises: [{ exerciseId: "ex-barbell-bench-press", sets: null }] }],
  [{ id: "log-s4", completedAt: Date.now(), exercises: [{ exerciseId: "ex-barbell-bench-press", sets: [null, { completed: true, weight: 120, reps: 6 }, null] }] }]
];

for (let i = 0; i < corruptedSetsLogs.length; i++) {
  const logs = corruptedSetsLogs[i];
  assertDoesNotThrow(() => {
    const pool = getExerciseMemoryPool(logs);
    assert(pool && typeof pool === "object", `Pool handled corrupted sets logs #${i}`);
  }, `getExerciseMemoryPool with corrupted sets sample #${i} does not throw`);

  assertDoesNotThrow(() => {
    const prefill = getExerciseHistoricalPrefill("ex-barbell-bench-press", logs);
    assert(prefill && typeof prefill === "object", `Prefill handled corrupted sets logs #${i}`);
    if (i === 3) {
      assert(prefill.source === "history", `Prefill extracted valid set despite null sibling sets`);
      assert(prefill.sets[0].weight === 120, `Prefill preserved weight 120 from valid set`);
    }
  }, `getExerciseHistoricalPrefill with corrupted sets sample #${i} does not throw`);
}

// -----------------------------------------------------------------------------
// VECTOR 4: Additional Hardening Verification (Store & AI Session Null-Guards)
// -----------------------------------------------------------------------------
console.log("\n▶ [TEST GROUP 6] Store & AI Session Robustness (NaN / null guards)");

assertDoesNotThrow(() => {
  moveActiveWorkoutExercise(NaN, 0);
  moveActiveWorkoutExercise(0, NaN);
  moveActiveWorkoutExercise("bad", 0);
  moveActiveWorkoutExercise(0, "bad");
}, "moveActiveWorkoutExercise handles NaN and invalid types without crashing");

assertDoesNotThrow(() => {
  pinActiveWorkoutExercise(NaN);
  pinActiveWorkoutExercise("bad");
  pinActiveWorkoutExercise(null);
}, "pinActiveWorkoutExercise handles NaN and invalid types without crashing");

assertDoesNotThrow(() => {
  addExerciseToActiveWorkout(null);
  addExerciseToActiveWorkout(undefined);
  addExerciseToActiveWorkout("invalid-string");
}, "addExerciseToActiveWorkout handles null/undefined without crashing");

assertDoesNotThrow(() => {
  openAICoachWithContext(null);
  openAICoachWithContext(undefined);
}, "openAICoachWithContext handles null/undefined options without crashing");

// -----------------------------------------------------------------------------
// SUMMARY & VERDICT
// -----------------------------------------------------------------------------
console.log("\n================================================================");
console.log(`TOTAL EMPIRICAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log("================================================================\n");

if (failedTests > 0) {
  console.error("❌ ADVERSARIAL RE-CHALLENGE DETECTED FAILURES:");
  failures.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
} else {
  console.log("🌟 ALL 5 EMPIRICAL RE-CHALLENGE BUGS ARE VERIFIED FIXED WITH 100% SUCCESS!\n");
  process.exit(0);
}

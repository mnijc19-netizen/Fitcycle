/**
 * FitCycle Milestone 1 Empirical Stress Test Harness — Part 2
 * Challenger: teamwork_preview_challenger_m1_2
 * 
 * Empirically stress-tests:
 * 1. fitnessStore.js actions:
 *    - togglePinExercise
 *    - moveActiveWorkoutExercise
 *    - pinActiveWorkoutExercise
 *    - addExerciseToActiveWorkout
 * 2. openAICoachWithContext options and context generation
 * 3. machineRecognitionEngine edge cases & performance
 * 4. exerciseMemoryEngine edge cases & full set inheritance
 * 5. dopamineFeedbackEngine edge cases & recovery invariants
 */

import { Window } from 'happy-dom';

// 1. Setup Happy DOM environment for Vue store & browser globals
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
  // Ignore if already set
}

// Dynamic imports so globals are guaranteed to be active before modules load
const {
  store,
  startWorkout,
  finishWorkout,
  togglePinExercise,
  moveActiveWorkoutExercise,
  pinActiveWorkoutExercise,
  addExerciseToActiveWorkout,
  removeExerciseFromActiveWorkout,
  getExerciseDetails
} = await import('../src/store/fitnessStore.js');

const {
  aiSession,
  openAICoachWithContext
} = await import('../src/ai/aiSession.js');

function resetAiSession() {
  aiSession.drawerOpen = false;
  aiSession.pendingAutoRun = false;
  aiSession.conversation = [];
  aiSession.apiMessages = [];
}

const {
  recognizeMachineByQuery,
  FEATURE_CATEGORIES
} = await import('../src/engine/machineRecognitionEngine.js');

const {
  getExerciseMemoryPool,
  getExerciseHistoricalPrefill,
  resolveExercise
} = await import('../src/engine/exerciseMemoryEngine.js');

const {
  calculateTonnageMetaphor,
  calculateSupercompensationStatus,
  calculateTierAdvancement
} = await import('../src/engine/dopamineFeedbackEngine.js');

const { DEFAULT_EXERCISES } = await import('../src/data/defaultPlans.js');

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

console.log('================================================================');
console.log('⚡ FITCYCLE EMPIRICAL STRESS TEST HARNESS — M1 CHALLENGER 2');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// SUITE 1: fitnessStore.js — togglePinExercise Stress Test
// -----------------------------------------------------------------------------
console.log('--- SUITE 1: fitnessStore.js — togglePinExercise Stress Test ---');

// Reset pinnedExerciseIds
store.pinnedExerciseIds = [];

// 1.1 Valid exercise toggle
togglePinExercise('ex-bench-press');
assert(store.pinnedExerciseIds.includes('ex-bench-press'), 'togglePinExercise adds valid exercise ID to pinned list');
assert(store.pinnedExerciseIds.length === 1, 'pinned list length is 1 after 1 pin');

// 1.2 Unpin by toggling again
togglePinExercise('ex-bench-press');
assert(!store.pinnedExerciseIds.includes('ex-bench-press'), 'togglePinExercise removes exercise ID when toggled again');
assert(store.pinnedExerciseIds.length === 0, 'pinned list length is 0 after unpin');

// 1.3 Non-existent exercise ID (custom or unknown ID)
togglePinExercise('ex-non-existent-999');
assert(store.pinnedExerciseIds.includes('ex-non-existent-999'), 'togglePinExercise safely handles non-existent/custom IDs');
togglePinExercise('ex-non-existent-999');
assert(store.pinnedExerciseIds.length === 0, 'togglePinExercise unpins non-existent/custom IDs cleanly');

// 1.4 Edge cases: null, undefined, empty string, false, 0, NaN
const invalidIds = [null, undefined, '', false, 0, NaN];
invalidIds.forEach(val => {
  togglePinExercise(val);
});
assert(store.pinnedExerciseIds.length === 0, 'togglePinExercise rejects falsy/invalid exercise IDs without corruption');

// 1.5 Corrupted store.pinnedExerciseIds state recovery
store.pinnedExerciseIds = null;
togglePinExercise('ex-squat');
assert(Array.isArray(store.pinnedExerciseIds) && store.pinnedExerciseIds.includes('ex-squat'), 'togglePinExercise auto-recovers when store.pinnedExerciseIds is null');

store.pinnedExerciseIds = 'corrupted_string';
togglePinExercise('ex-deadlift');
assert(Array.isArray(store.pinnedExerciseIds) && store.pinnedExerciseIds.includes('ex-deadlift'), 'togglePinExercise auto-recovers when store.pinnedExerciseIds is non-array');

// 1.6 High frequency toggle stress (1,000 rapid toggles)
store.pinnedExerciseIds = [];
const startToggleTime = Date.now();
for (let i = 0; i < 1000; i++) {
  togglePinExercise('ex-stress-test');
}
const toggleDuration = Date.now() - startToggleTime;
assert(store.pinnedExerciseIds.length === 0, '1,000 toggles cleanly returns to initial state (even number of toggles)');
assert(toggleDuration < 500, `1,000 toggles executed in ${toggleDuration}ms (< 500ms)`);

console.log('');

// -----------------------------------------------------------------------------
// SUITE 2: fitnessStore.js — moveActiveWorkoutExercise Stress Test
// -----------------------------------------------------------------------------
console.log('--- SUITE 2: fitnessStore.js — moveActiveWorkoutExercise Stress Test ---');

// Helper to init workout with 4 items
function resetTestWorkout() {
  store.activeWorkout = {
    planId: 'test-plan',
    planName: '测试计划',
    date: '2026-09-06',
    startTime: Date.now(),
    exercises: [
      { id: 'ex-0', exerciseId: 'ex-bench', name: '杠铃卧推', sets: [] },
      { id: 'ex-1', exerciseId: 'ex-incline', name: '上斜哑铃卧推', sets: [] },
      { id: 'ex-2', exerciseId: 'ex-fly', name: '蝴蝶机夹胸', sets: [] },
      { id: 'ex-3', exerciseId: 'ex-dip', name: '双杠臂屈伸', sets: [] }
    ]
  };
}

resetTestWorkout();

// 2.1 Normal move: move index 2 to index 0
moveActiveWorkoutExercise(2, 0);
assert(store.activeWorkout.exercises[0].name === '蝴蝶机夹胸', 'moveActiveWorkoutExercise: moved item 2 to index 0');
assert(store.activeWorkout.exercises[1].name === '杠铃卧推', 'moveActiveWorkoutExercise: item 0 shifted to index 1');
assert(store.activeWorkout.exercises[2].name === '上斜哑铃卧推', 'moveActiveWorkoutExercise: item 1 shifted to index 2');
assert(store.activeWorkout.exercises[3].name === '双杠臂屈伸', 'moveActiveWorkoutExercise: item 3 remains at index 3');
assert(store.activeWorkout.exercises.length === 4, 'moveActiveWorkoutExercise preserves total exercise count');

// 2.2 Normal move: move index 0 to index 3 (first to last)
moveActiveWorkoutExercise(0, 3);
assert(store.activeWorkout.exercises[3].name === '蝴蝶机夹胸', 'moveActiveWorkoutExercise: moved first to last');
assert(store.activeWorkout.exercises[0].name === '杠铃卧推', 'moveActiveWorkoutExercise: second became first');

// 2.3 Same index: fromIndex === toIndex
const preNames = store.activeWorkout.exercises.map(e => e.name);
moveActiveWorkoutExercise(1, 1);
const postNames = store.activeWorkout.exercises.map(e => e.name);
assert(JSON.stringify(preNames) === JSON.stringify(postNames), 'moveActiveWorkoutExercise: fromIndex === toIndex is a safe no-op');

// 2.4 Negative fromIndex
moveActiveWorkoutExercise(-1, 2);
assert(store.activeWorkout.exercises.length === 4 && store.activeWorkout.exercises[0].name === '杠铃卧推', 'moveActiveWorkoutExercise: negative fromIndex (-1) rejected');

moveActiveWorkoutExercise(-100, 1);
assert(store.activeWorkout.exercises.length === 4, 'moveActiveWorkoutExercise: large negative fromIndex (-100) rejected');

// 2.5 Negative toIndex
moveActiveWorkoutExercise(1, -1);
assert(store.activeWorkout.exercises.length === 4 && store.activeWorkout.exercises[0].name === '杠铃卧推', 'moveActiveWorkoutExercise: negative toIndex (-1) rejected');

// 2.6 Out of bounds fromIndex
moveActiveWorkoutExercise(4, 1); // length is 4, valid indexes are 0..3
assert(store.activeWorkout.exercises.length === 4, 'moveActiveWorkoutExercise: fromIndex === length rejected');

moveActiveWorkoutExercise(999, 1);
assert(store.activeWorkout.exercises.length === 4, 'moveActiveWorkoutExercise: large out-of-bounds fromIndex rejected');

// 2.7 Out of bounds toIndex
moveActiveWorkoutExercise(1, 4);
assert(store.activeWorkout.exercises.length === 4, 'moveActiveWorkoutExercise: toIndex === length rejected');

moveActiveWorkoutExercise(1, 999);
assert(store.activeWorkout.exercises.length === 4, 'moveActiveWorkoutExercise: large out-of-bounds toIndex rejected');

// 2.8 Moving in empty list
store.activeWorkout.exercises = [];
let emptyMoveThrew = false;
try {
  moveActiveWorkoutExercise(0, 1);
  moveActiveWorkoutExercise(-1, -1);
} catch (e) {
  emptyMoveThrew = true;
}
assert(!emptyMoveThrew && store.activeWorkout.exercises.length === 0, 'moveActiveWorkoutExercise in empty list does not throw and remains empty');

// 2.9 Moving when store.activeWorkout is null
store.activeWorkout = null;
let nullWorkoutMoveThrew = false;
try {
  moveActiveWorkoutExercise(0, 1);
} catch (e) {
  nullWorkoutMoveThrew = true;
}
assert(!nullWorkoutMoveThrew, 'moveActiveWorkoutExercise when activeWorkout is null does not throw');

// 2.10 Moving when exercises property is not an array
store.activeWorkout = { exercises: "not-an-array" };
let nonArrayMoveThrew = false;
try {
  moveActiveWorkoutExercise(0, 1);
} catch (e) {
  nonArrayMoveThrew = true;
}
assert(!nonArrayMoveThrew, 'moveActiveWorkoutExercise when exercises is not an array does not throw');

// 2.11 Permutation fuzzing stress test (500 random moves on a 10-item list)
resetTestWorkout();
// Expand to 10 items
for (let i = 4; i < 10; i++) {
  store.activeWorkout.exercises.push({ id: `ex-${i}`, exerciseId: `ex-id-${i}`, name: `动作-${i}`, sets: [] });
}
const initialIds = new Set(store.activeWorkout.exercises.map(e => e.id));

for (let iter = 0; iter < 500; iter++) {
  const from = Math.floor(Math.random() * 16) - 3; // -3 to 12
  const to = Math.floor(Math.random() * 16) - 3;   // -3 to 12
  moveActiveWorkoutExercise(from, to);
}
assert(store.activeWorkout.exercises.length === 10, '500 random moves strictly preserves 10-item list length');
const finalIds = new Set(store.activeWorkout.exercises.map(e => e.id));
assert(finalIds.size === 10 && [...initialIds].every(id => finalIds.has(id)), '500 random moves preserves 100% element identity (0 lost, 0 duplicates)');

console.log('');

// -----------------------------------------------------------------------------
// SUITE 3: fitnessStore.js — pinActiveWorkoutExercise Stress Test
// -----------------------------------------------------------------------------
console.log('--- SUITE 3: fitnessStore.js — pinActiveWorkoutExercise Stress Test ---');

resetTestWorkout();
// Active workout exercises:
// 0: 杠铃卧推
// 1: 上斜哑铃卧推
// 2: 蝴蝶机夹胸
// 3: 双杠臂屈伸

// 3.1 Pin item at index 2 to top
pinActiveWorkoutExercise(2);
assert(store.activeWorkout.exercises[0].name === '蝴蝶机夹胸', 'pinActiveWorkoutExercise moves index 2 to index 0');
assert(store.activeWorkout.exercises[1].name === '杠铃卧推', 'previous index 0 shifted to index 1');
assert(store.activeWorkout.exercises.length === 4, 'pinActiveWorkoutExercise preserves total count (4)');

// 3.2 Pin item already at index 0 (should be safe no-op)
pinActiveWorkoutExercise(0);
assert(store.activeWorkout.exercises[0].name === '蝴蝶机夹胸', 'pinActiveWorkoutExercise(0) is a safe no-op');
assert(store.activeWorkout.exercises.length === 4, 'pinActiveWorkoutExercise(0) does not duplicate or drop item');

// 3.3 Pin with negative index
pinActiveWorkoutExercise(-1);
assert(store.activeWorkout.exercises.length === 4 && store.activeWorkout.exercises[0].name === '蝴蝶机夹胸', 'pinActiveWorkoutExercise(-1) safely rejected');

pinActiveWorkoutExercise(-99);
assert(store.activeWorkout.exercises.length === 4, 'pinActiveWorkoutExercise(-99) safely rejected');

// 3.4 Pin with out-of-bounds index
pinActiveWorkoutExercise(4); // length is 4
assert(store.activeWorkout.exercises.length === 4 && store.activeWorkout.exercises[0].name === '蝴蝶机夹胸', 'pinActiveWorkoutExercise(length) safely rejected');

pinActiveWorkoutExercise(999);
assert(store.activeWorkout.exercises.length === 4, 'pinActiveWorkoutExercise(999) safely rejected');

// 3.5 Pin in empty exercises list
store.activeWorkout.exercises = [];
let emptyPinThrew = false;
try {
  pinActiveWorkoutExercise(0);
  pinActiveWorkoutExercise(1);
  pinActiveWorkoutExercise(-1);
} catch (e) {
  emptyPinThrew = true;
}
assert(!emptyPinThrew && store.activeWorkout.exercises.length === 0, 'pinActiveWorkoutExercise in empty list does not throw');

// 3.6 Pin when activeWorkout is null
store.activeWorkout = null;
let nullWorkoutPinThrew = false;
try {
  pinActiveWorkoutExercise(1);
} catch (e) {
  nullWorkoutPinThrew = true;
}
assert(!nullWorkoutPinThrew, 'pinActiveWorkoutExercise when activeWorkout is null does not throw');

// 3.7 Non-numeric inputs: NaN, undefined, null, string
resetTestWorkout();
pinActiveWorkoutExercise(NaN);
assert(store.activeWorkout.exercises.length === 4, 'pinActiveWorkoutExercise(NaN) does not corrupt length');

pinActiveWorkoutExercise(undefined);
assert(store.activeWorkout.exercises.length === 4, 'pinActiveWorkoutExercise(undefined) does not corrupt length');

pinActiveWorkoutExercise(null);
assert(store.activeWorkout.exercises.length === 4, 'pinActiveWorkoutExercise(null) does not corrupt length');

console.log('');

// -----------------------------------------------------------------------------
// SUITE 4: fitnessStore.js — addExerciseToActiveWorkout Stress Test
// -----------------------------------------------------------------------------
console.log('--- SUITE 4: fitnessStore.js — addExerciseToActiveWorkout Stress Test ---');

resetTestWorkout();

// 4.1 Add standard exercise from library
const benchItem = DEFAULT_EXERCISES.find(e => e.name === '平板杠铃卧推') || { id: 'ex-bench', name: '平板杠铃卧推' };
addExerciseToActiveWorkout(benchItem);
const addedEx = store.activeWorkout.exercises[store.activeWorkout.exercises.length - 1];
assert(addedEx.name === '平板杠铃卧推', 'addExerciseToActiveWorkout adds standard exercise');
assert(Array.isArray(addedEx.sets) && addedEx.sets.length > 0, 'addExerciseToActiveWorkout initializes sets array');
assert(addedEx.sets.every(s => typeof s.weight === 'number' && typeof s.reps === 'number'), 'addExerciseToActiveWorkout sets contain numeric weight and reps');

// 4.2 Add custom/non-existent exercise ID
const customItem = {
  id: 'custom-dragon-fly',
  name: '自制重力飞鸟机',
  category: '胸部',
  defaultSets: 4,
  defaultWeight: 32,
  defaultReps: '12-15'
};
addExerciseToActiveWorkout(customItem);
const addedCustom = store.activeWorkout.exercises[store.activeWorkout.exercises.length - 1];
assert(addedCustom.name === '自制重力飞鸟机', 'addExerciseToActiveWorkout adds custom exercise');
assert(addedCustom.sets.length === 4, 'addExerciseToActiveWorkout honors custom defaultSets (4)');
assert(addedCustom.sets[0].weight === 32, 'addExerciseToActiveWorkout honors custom defaultWeight (32kg)');

// 4.3 Add with historical workout logs prefill
store.workoutLogs = [
  {
    id: 'log-hist-1',
    completedAt: Date.now() - 3600000,
    exercises: [
      {
        exerciseId: 'custom-dragon-fly',
        name: '自制重力飞鸟机',
        sets: [
          { setNum: 1, weight: 40, reps: 12, completed: true },
          { setNum: 2, weight: 45, reps: 10, completed: true },
          { setNum: 3, weight: 50, reps: 8, completed: true },
          { setNum: 4, weight: 55, reps: 6, completed: true },
          { setNum: 5, weight: 60, reps: 4, completed: true }
        ]
      }
    ]
  }
];

addExerciseToActiveWorkout({ id: 'custom-dragon-fly', name: '自制重力飞鸟机' });
const addedFromHist = store.activeWorkout.exercises[store.activeWorkout.exercises.length - 1];
assert(addedFromHist.sets.length === 5, 'addExerciseToActiveWorkout inherits full historical 5 sets (NO 3-set truncation)');
assert(addedFromHist.sets[4].weight === 60, 'addExerciseToActiveWorkout inherits historical weight for 5th set (60kg)');

// 4.4 Add when store.activeWorkout is null
store.activeWorkout = null;
let nullActiveAddThrew = false;
try {
  addExerciseToActiveWorkout(benchItem);
} catch (e) {
  nullActiveAddThrew = true;
}
assert(!nullActiveAddThrew, 'addExerciseToActiveWorkout when activeWorkout is null does not throw');

// 4.5 Add bare minimal item (only name)
resetTestWorkout();
addExerciseToActiveWorkout({ name: '徒手深蹲' });
const bareEx = store.activeWorkout.exercises[store.activeWorkout.exercises.length - 1];
assert(bareEx && bareEx.name === '徒手深蹲', 'addExerciseToActiveWorkout handles bare item with only name');
assert(bareEx.sets.length > 0, 'bare item gets fallback sets');

// 4.6 Stress test: 100 rapid additions
const startAdd = Date.now();
for (let i = 0; i < 100; i++) {
  addExerciseToActiveWorkout({ id: `bulk-${i}`, name: `批量动作-${i}` });
}
const addDuration = Date.now() - startAdd;
assert(store.activeWorkout.exercises.length === 4 + 1 + 100, '100 rapid additions correctly pushed (105 total)');
assert(addDuration < 500, `100 additions executed in ${addDuration}ms (< 500ms)`);

console.log('');

// -----------------------------------------------------------------------------
// SUITE 5: openAICoachWithContext Stress Test
// -----------------------------------------------------------------------------
console.log('--- SUITE 5: openAICoachWithContext Stress Test ---');

resetAiSession();

// 5.1 Call with default options
const res1 = openAICoachWithContext({});
assert(res1.success === true, 'openAICoachWithContext({}) returns success: true');
assert(typeof res1.fullPromptText === 'string' && res1.fullPromptText.length > 0, 'fullPromptText is non-empty string');
assert(aiSession.drawerOpen === true, 'drawerOpen set to true');
assert(aiSession.pendingAutoRun === true, 'pendingAutoRun set to true by default');
assert(aiSession.conversation.length === 1, 'conversation has 1 message');
assert(aiSession.apiMessages.length === 1, 'apiMessages has 1 message');

// 5.2 Call with autoRun: false
resetAiSession();
const res2 = openAICoachWithContext({ autoRun: false, prompt: '如何安排超量恢复？' });
assert(res2.success === true, 'openAICoachWithContext with prompt returns success: true');
assert(aiSession.pendingAutoRun === false, 'pendingAutoRun set to false when autoRun: false');
assert(res2.fullPromptText.includes('如何安排超量恢复？'), 'fullPromptText contains custom prompt');

// 5.3 Call with full exercise context
resetAiSession();
const sampleExercise = {
  id: 'ex-incline-bench',
  name: '上斜杠铃卧推',
  englishName: 'Incline Barbell Bench Press',
  category: '胸部',
  target: '胸大肌上束、三角肌前束',
  scienceDetail: '保持肩胛骨后缩下沉，下落至锁骨下方2-3指处，避免肩内旋。'
};
const res3 = openAICoachWithContext({ exercise: sampleExercise });
assert(res3.fullPromptText.includes('上斜杠铃卧推'), 'fullPromptText includes exercise name');
assert(res3.fullPromptText.includes('Incline Barbell Bench Press'), 'fullPromptText includes english name');
assert(res3.fullPromptText.includes('胸大肌上束'), 'fullPromptText includes target muscles');
assert(res3.fullPromptText.includes('保持肩胛骨后缩下沉'), 'fullPromptText includes science biomechanics detail');

// 5.4 Call with custom userProfile
resetAiSession();
const customProfile = {
  userHeight: 182,
  userWeight: 80,
  strengthLevel: 'advanced',
  trainingGoal: 'strength'
};
const res4 = openAICoachWithContext({ userProfile: customProfile, exercise: sampleExercise });
assert(res4.fullPromptText.includes('182cm'), 'fullPromptText includes custom height (182cm)');
assert(res4.fullPromptText.includes('80kg'), 'fullPromptText includes custom weight (80kg)');
assert(res4.fullPromptText.includes('高阶健力'), 'fullPromptText maps advanced to 高阶健力');
assert(res4.fullPromptText.includes('纯力量突破'), 'fullPromptText maps strength to 纯力量突破');

// 5.5 Edge cases: extreme profile values & zero height
resetAiSession();
const edgeProfile = {
  userHeight: 0,
  userWeight: 0,
  strengthLevel: 'unknown_level',
  trainingGoal: 'unknown_goal'
};
let edgeProfileThrew = false;
try {
  const resEdge = openAICoachWithContext({ userProfile: edgeProfile });
  assert(resEdge.success === true, 'openAICoachWithContext handles height: 0 without throwing (BMI Infinity safe)');
} catch (e) {
  edgeProfileThrew = true;
}
assert(!edgeProfileThrew, 'edge profile does not throw');

// 5.6 Edge cases: bare exercise without scienceDetail / englishName
resetAiSession();
const bareExContext = { name: '自定义器械' };
const resBare = openAICoachWithContext({ exercise: bareExContext });
assert(resBare.fullPromptText.includes('自定义器械'), 'openAICoachWithContext handles bare exercise without scienceDetail');

// 5.7 Rapid call burst (50 consecutive calls)
resetAiSession();
for (let i = 0; i < 50; i++) {
  openAICoachWithContext({ prompt: `测试问题 ${i}` });
}
assert(aiSession.conversation.length === 50, 'conversation contains 50 messages after burst');
assert(aiSession.apiMessages.length === 50, 'apiMessages contains 50 messages after burst');

console.log('');

// -----------------------------------------------------------------------------
// SUITE 6: machineRecognitionEngine Edge Cases & Performance
// -----------------------------------------------------------------------------
console.log('--- SUITE 6: machineRecognitionEngine Edge Cases & Performance ---');

// 6.1 Empty / whitespace / punctuation queries
assert(recognizeMachineByQuery('', DEFAULT_EXERCISES).length === 0, 'empty string query returns []');
assert(recognizeMachineByQuery('   ', DEFAULT_EXERCISES).length === 0, 'whitespace query returns []');
assert(recognizeMachineByQuery('？？？？……！！', DEFAULT_EXERCISES).length === 0, 'punctuation query returns []');
assert(recognizeMachineByQuery(null, DEFAULT_EXERCISES).length === 0, 'null query returns []');
assert(recognizeMachineByQuery(undefined, DEFAULT_EXERCISES).length === 0, 'undefined query returns []');

// 6.2 Non-existent / sci-fi equipment
const fantasyRes = recognizeMachineByQuery('反物质曲速引擎超光速粒子加速器', DEFAULT_EXERCISES);
assert(fantasyRes.length === 0, 'non-gym sci-fi queries return 0 matches below threshold');

// 6.3 Standard colloquial fitness queries
const q1 = '一个坐着手往前推的黄色杠杆器械';
const resQ1 = recognizeMachineByQuery(q1, DEFAULT_EXERCISES);
assert(resQ1.length > 0, `colloquial query "${q1}" yields matches`);
const top1 = resQ1[0];
assert(top1.exercise.category === '胸部' || top1.exercise.name.includes('推胸'), `top match for forward push is chest machine (got: ${top1.exercise.name})`);
assert(top1.confidence >= 0.70, `top match has strong confidence (${top1.confidence} >= 0.70)`);
assert(Array.isArray(top1.matchedFeatures) && top1.matchedFeatures.length > 0, 'matchedFeatures list is populated');
assert(typeof top1.reasoning === 'string' && top1.reasoning.length > 0, 'reasoning text is populated');

// 6.4 Pull-down colloquial query
const q2 = '两只手抓住横杆往下拉背的机器';
const resQ2 = recognizeMachineByQuery(q2, DEFAULT_EXERCISES);
assert(resQ2.length > 0, `colloquial query "${q2}" yields matches`);
const top2 = resQ2[0];
assert(top2.exercise.name.includes('下拉') || top2.exercise.category === '背部', `top match for pull down is back pulldown (got: ${top2.exercise.name})`);

// 6.5 Leg extension / curl colloquial query
const q3 = '坐着双腿向前向上伸直踢腿的器械';
const resQ3 = recognizeMachineByQuery(q3, DEFAULT_EXERCISES);
assert(resQ3.length > 0, `colloquial query "${q3}" yields matches`);
const top3 = resQ3[0];
assert(top3.exercise.name.includes('腿屈伸') || top3.exercise.category === '腿部', `top match for leg kicking is leg extension (got: ${top3.exercise.name})`);

// 6.6 Performance benchmark: 100 queries speed test
const perfStart = Date.now();
for (let i = 0; i < 100; i++) {
  recognizeMachineByQuery('坐姿推胸黄色把手杠杆器械', DEFAULT_EXERCISES);
}
const perfDuration = Date.now() - perfStart;
assert(perfDuration < 500, `100 machine recognition queries completed in ${perfDuration}ms (avg ${(perfDuration/100).toFixed(2)}ms/query, benchmark < 5ms)`);

console.log('');

// -----------------------------------------------------------------------------
// SUITE 7: exerciseMemoryEngine Edge Cases & Invariants
// -----------------------------------------------------------------------------
console.log('--- SUITE 7: exerciseMemoryEngine Edge Cases & Invariants ---');

// 7.1 Empty / null logs & empty pinned
const pool1 = getExerciseMemoryPool([], [], DEFAULT_EXERCISES);
assert(Array.isArray(pool1.pinned) && pool1.pinned.length === 0, 'empty logs produce empty pinned');
assert(Array.isArray(pool1.recent) && pool1.recent.length === 0, 'empty logs produce empty recent');
assert(Array.isArray(pool1.frequent) && pool1.frequent.length === 0, 'empty logs produce empty frequent');

const poolNull = getExerciseMemoryPool(null, null, null);
assert(Array.isArray(poolNull.pinned) && Array.isArray(poolNull.recent) && Array.isArray(poolNull.frequent), 'null arguments handled safely with default empty arrays');

// 7.2 Pinned exercises deduplication in recent
const sampleLogs = [
  {
    id: 'log-1',
    completedAt: 1000,
    exercises: [
      { exerciseId: 'ex-barbell-bench-press', name: '平板杠铃卧推', sets: [{ completed: true, weight: 80, reps: 8 }] },
      { exerciseId: 'ex-squat', name: '杠铃深蹲', sets: [{ completed: true, weight: 100, reps: 5 }] }
    ]
  }
];
const poolWithPin = getExerciseMemoryPool(sampleLogs, ['ex-barbell-bench-press'], DEFAULT_EXERCISES);
assert(poolWithPin.pinned.length === 1 && poolWithPin.pinned[0].name === '平板杠铃卧推', 'pinned list contains pinned exercise');
assert(!poolWithPin.recent.some(e => e.id === 'ex-barbell-bench-press'), 'pinned exercise is excluded from recent to avoid UI duplication');

// 7.3 Frequency sorting based on total completed sets
const multiLogs = [
  {
    id: 'log-1',
    completedAt: 1000,
    exercises: [
      { exerciseId: 'ex-squat', name: '杠铃深蹲', sets: [{ completed: true }, { completed: true }, { completed: true }] }, // 3 sets
      { exerciseId: 'ex-bench', name: '平板杠铃卧推', sets: [{ completed: true }] } // 1 set
    ]
  },
  {
    id: 'log-2',
    completedAt: 2000,
    exercises: [
      { exerciseId: 'ex-squat', name: '杠铃深蹲', sets: [{ completed: true }, { completed: true }] }, // +2 = 5 sets
      { exerciseId: 'ex-bench', name: '平板杠铃卧推', sets: [{ completed: true }, { completed: true }] } // +2 = 3 sets
    ]
  }
];
const poolFreq = getExerciseMemoryPool(multiLogs, [], DEFAULT_EXERCISES);
assert(poolFreq.frequent[0].name === '杠铃深蹲', 'exercise with more total completed sets (5) ranks first in frequent');
assert(poolFreq.frequent[1].name === '平板杠铃卧推', 'exercise with fewer total completed sets (3) ranks second in frequent');

// 7.4 Historical prefill with no history returns default fallback
const prefillDefault = getExerciseHistoricalPrefill('ex-unknown-exercise', [], { defaultSets: 4, defaultWeight: 25, defaultReps: '8-10' });
assert(prefillDefault.source === 'default', 'no history returns source: default');
assert(prefillDefault.sets.length === 4, 'fallback setsCount is 4');
assert(prefillDefault.sets[0].weight === 25, 'fallback weight is 25');
assert(prefillDefault.sets[0].reps === 8, 'fallback reps parsed from "8-10" as 8');

// 7.5 Historical prefill returns ALL completed sets (e.g. 7 sets) without 3-set cap
const sevenSetLogs = [
  {
    id: 'log-7',
    completedAt: 5000,
    exercises: [
      {
        exerciseId: 'ex-bench',
        name: '平板杠铃卧推',
        sets: [
          { setNum: 1, weight: 60, reps: 12, completed: true },
          { setNum: 2, weight: 70, reps: 10, completed: true },
          { setNum: 3, weight: 80, reps: 8, completed: true },
          { setNum: 4, weight: 85, reps: 6, completed: true },
          { setNum: 5, weight: 90, reps: 4, completed: true },
          { setNum: 6, weight: 95, reps: 2, completed: true },
          { setNum: 7, weight: 100, reps: 1, completed: true }
        ]
      }
    ]
  }
];
const prefill7 = getExerciseHistoricalPrefill('ex-bench', sevenSetLogs);
assert(prefill7.source === 'history', 'found history returns source: history');
assert(prefill7.sets.length === 7, 'historical prefill returns all 7 sets without truncation');
assert(prefill7.sets[6].weight === 100, '7th set weight is accurately preserved (100kg)');

console.log('');

// -----------------------------------------------------------------------------
// SUITE 8: dopamineFeedbackEngine Edge Cases & Invariants
// -----------------------------------------------------------------------------
console.log('--- SUITE 8: dopamineFeedbackEngine Edge Cases & Invariants ---');

// 8.1 Tonnage metaphors across all benchmark tiers
const t0 = calculateTonnageMetaphor(0);
assert(t0.tonnage === 0 && t0.metaphorName === '开练待蓄力', '0 kg tonnage returns 开练待蓄力');

const tNegative = calculateTonnageMetaphor(-500);
assert(tNegative.tonnage === 0, 'negative kg safely clamped to 0 tonnage');

const tNaN = calculateTonnageMetaphor(NaN);
assert(tNaN.tonnage === 0, 'NaN safely clamped to 0 tonnage');

const tMoto = calculateTonnageMetaphor(600);
assert(tMoto.metaphorName === '重型防暴机车', '600 kg maps to 重型防暴机车');

const tCar = calculateTonnageMetaphor(4500);
assert(tCar.metaphorName === '家用轿车' && tCar.tonnage === 4.5, '4,500 kg maps to 家用轿车 (4.5 吨)');

const tElephant = calculateTonnageMetaphor(12000);
assert(tElephant.metaphorName === '成年非洲大象' && tElephant.tonnage === 12, '12,000 kg maps to 成年非洲大象 (12 吨)');

const tBus = calculateTonnageMetaphor(35000);
assert(tBus.metaphorName === '标准城市公交大巴', '35,000 kg maps to 标准城市公交大巴');

const tPlane = calculateTonnageMetaphor(85000);
assert(tPlane.metaphorName === '波音737客机', '85,000 kg maps to 波音737客机');

const tWhale = calculateTonnageMetaphor(250000);
assert(tWhale.metaphorName === '蓝鲸', '250,000 kg maps to 蓝鲸');

// 8.2 Supercompensation 0~72h biological recovery invariant
const now = Date.now();

// Just finished workout (0 hours)
const sAcute = calculateSupercompensationStatus(now, now);
assert(sAcute.hoursElapsed === 0, '0h elapsed right after workout');
assert(sAcute.stage === 'acute', '0h is acute recovery stage');
assert(sAcute.progressPercent >= 0 && sAcute.progressPercent <= 100, 'progressPercent is between 0 and 100');

// 12 hours elapsed (< 24h) -> acute stage
const sAcute12 = calculateSupercompensationStatus(now - 12 * 3600000, now);
assert(sAcute12.hoursElapsed === 12, '12h elapsed identified');
assert(sAcute12.stage === 'acute', '12h (<24h) is acute recovery stage');

// 36 hours elapsed (24-48h) -> synthesis stage
const sSynthesis = calculateSupercompensationStatus(now - 36 * 3600000, now);
assert(sSynthesis.hoursElapsed === 36, '36h elapsed identified');
assert(sSynthesis.stage === 'synthesis', '36h (24-48h) is synthesis recovery stage');

// 60 hours elapsed (48-72h) -> supercompensation stage
const sSuper = calculateSupercompensationStatus(now - 60 * 3600000, now);
assert(sSuper.hoursElapsed === 60, '60h elapsed identified');
assert(sSuper.stage === 'supercompensation', '60h (48-72h) is supercompensation peak stage');

// 96 hours elapsed (> 72h) -> recovered / ready stage
const sPast = calculateSupercompensationStatus(now - 96 * 3600000, now);
assert(sPast.hoursElapsed === 96, '96h elapsed identified');
assert(sPast.stage === 'ready', '96h (>72h) is ready stage');
assert(sPast.progressPercent === 100, 'past 72h progressPercent is 100%');

// Future or null timestamp
const sFuture = calculateSupercompensationStatus(now + 3600000, now);
assert(sFuture.hoursElapsed === 0, 'future timestamp clamped to 0 elapsed hours');

const sNull = calculateSupercompensationStatus(null);
assert(sNull.stage === 'ready', 'null workout timestamp defaults to ready stage');

// 8.3 Tier advancement calculations
const adv1 = calculateTierAdvancement(850, 40); // 850 total, gained 40 -> prev: 810 (Tier 3)
assert(adv1.currentScore === 850, 'currentScore is 850');
assert(adv1.previousScore === 810, 'previousScore is 850 - 40 = 810');
assert(adv1.hasLeveledUp === false, 'no level up within same tier (810 to 850, both Tier 3)');

const advLevelUp = calculateTierAdvancement(320, 50); // crosses 300 threshold from Tier 1 (270) to Tier 2 (320)
assert(advLevelUp.hasLeveledUp === true, 'hasLeveledUp is true when crossing tier threshold (270 to 320, Tier 1 to Tier 2)');
assert(advLevelUp.previousTier.tier !== advLevelUp.currentTier.tier, 'previousTier !== currentTier on level up');

console.log('');
console.log('================================================================');
console.log(`TOTAL EMPIRICAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('================================================================');

if (failedTests > 0) {
  console.error('\nFAILURES DETECTED:');
  failures.forEach(f => console.error(f));
  process.exit(1);
} else {
  console.log('\n🌟 ALL M1 EMPIRICAL STRESS TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}

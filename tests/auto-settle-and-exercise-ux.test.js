import { describe, it, expect, beforeEach } from 'vitest';
import { 
  store, 
  startWorkout, 
  toggleSetCompletion, 
  finishWorkout, 
  discardActiveWorkout, 
  checkAndHandleWorkoutInactivity, 
  clearAutoFinishNotice,
  getExerciseDetails
} from '../src/store/fitnessStore.js';
import { findGymEquipmentVisual } from '../src/data/gymEquipmentVisuals.js';

describe('Workout Inactivity Auto-Settlement & UX Improvements', () => {
  beforeEach(() => {
    discardActiveWorkout();
    clearAutoFinishNotice();
    store.workoutLogs = [];
  });

  it('records completedAt on completed sets and updates lastSetCompletedAt on activeWorkout', () => {
    startWorkout('plan-push');
    expect(store.activeWorkout).toBeTruthy();
    expect(store.activeWorkout.lastSetCompletedAt).toBeNull();

    const t1 = Date.now();
    toggleSetCompletion(0, 0);

    expect(store.activeWorkout.exercises[0].sets[0].completed).toBe(true);
    expect(store.activeWorkout.exercises[0].sets[0].completedAt).toBeGreaterThanOrEqual(t1);
    expect(store.activeWorkout.lastSetCompletedAt).toBe(store.activeWorkout.exercises[0].sets[0].completedAt);

    // Toggle off
    toggleSetCompletion(0, 0);
    expect(store.activeWorkout.exercises[0].sets[0].completed).toBe(false);
    expect(store.activeWorkout.exercises[0].sets[0].completedAt).toBeNull();
    expect(store.activeWorkout.lastSetCompletedAt).toBeNull();
  });

  it('auto-finishes workout when inactivity exceeds 40 minutes and uses lastSetCompletedAt as duration', () => {
    const fakeStartTime = Date.now() - (120 * 60 * 1000); // started 2 hours ago
    startWorkout('plan-push');
    store.activeWorkout.startTime = fakeStartTime;

    // Complete set 1 at 45 minutes after start (75 minutes ago)
    const set1Time = fakeStartTime + (45 * 60 * 1000);
    store.activeWorkout.exercises[0].sets[0].completed = true;
    store.activeWorkout.exercises[0].sets[0].completedAt = set1Time;
    store.activeWorkout.exercises[0].sets[0].weight = 50;
    store.activeWorkout.exercises[0].sets[0].reps = 10;
    store.activeWorkout.lastSetCompletedAt = set1Time;

    // User left the app! Current time is 75 minutes after last set (> 40 min threshold)
    const result = checkAndHandleWorkoutInactivity(40 * 60 * 1000);

    expect(result).toBeTruthy();
    expect(store.activeWorkout).toBeNull(); // Active workout cleared
    expect(store.workoutLogs.length).toBe(1);

    const savedLog = store.workoutLogs[0];
    expect(savedLog.autoSettled).toBe(true);
    // Duration should be exactly 45 minutes (2700s), NOT 120 minutes!
    expect(savedLog.durationSeconds).toBe(45 * 60);

    // Notice should be set for next app open
    expect(store.autoFinishNotice).toBeTruthy();
    expect(store.autoFinishNotice.durationMinutes).toBe(45);
    expect(store.autoFinishNotice.completedSets).toBe(1);
    expect(store.autoFinishNotice.totalVolume).toBe(500);

    // Clear notice
    clearAutoFinishNotice();
    expect(store.autoFinishNotice).toBeNull();
  });

  it('does not auto-finish if user completed a set recently (< 40 min)', () => {
    startWorkout('plan-push');
    const recentTime = Date.now() - (10 * 60 * 1000); // 10 minutes ago
    store.activeWorkout.exercises[0].sets[0].completed = true;
    store.activeWorkout.exercises[0].sets[0].completedAt = recentTime;
    store.activeWorkout.lastSetCompletedAt = recentTime;

    const result = checkAndHandleWorkoutInactivity(40 * 60 * 1000);
    expect(result).toBeNull();
    expect(store.activeWorkout).toBeTruthy();
    expect(store.autoFinishNotice).toBeNull();
  });

  it('discards abandoned empty workouts after 45 minutes if 0 sets completed', () => {
    startWorkout('plan-push');
    store.activeWorkout.startTime = Date.now() - (50 * 60 * 1000); // 50 mins ago, 0 completed sets

    checkAndHandleWorkoutInactivity();
    expect(store.activeWorkout).toBeNull();
    expect(store.workoutLogs.length).toBe(0);
  });

  it('getExerciseDetails resolves correctly when passed an object', () => {
    const exObj = {
      id: 'ex-pec-deck',
      name: '蝴蝶机夹胸 (Pec Deck)',
      category: '胸部'
    };
    const details = getExerciseDetails(exObj);
    expect(details).toBeTruthy();
    expect(details.name).toContain('蝴蝶机');
    expect(details.gifUrl).toBeTruthy();
  });

  it('getExerciseDetails resolves seated triceps pushdown variations and custom id objects', () => {
    // 1. By string name -> maps to dedicated seated dip machine
    const detailsByName = getExerciseDetails('坐姿三头下压');
    expect(detailsByName).toBeTruthy();
    expect(detailsByName.gifUrl).toBe('./exercises/lever-seated-dip.gif');

    // 2. By alias variations
    const detailsByMachine = getExerciseDetails('坐姿器械三头下压');
    expect(detailsByMachine).toBeTruthy();
    expect(detailsByMachine.gifUrl).toBe('./exercises/lever-seated-dip.gif');

    const detailsByCable = getExerciseDetails('坐姿绳索三头下压');
    expect(detailsByCable).toBeTruthy();
    expect(detailsByCable.gifUrl).toBe('./exercises/machine-triceps-pressdown.gif');

    // 3. By object with custom exerciseId fallback to name
    const detailsByCustomExId = getExerciseDetails({ exerciseId: 'custom-1788800640', name: '坐姿三头下压' });
    expect(detailsByCustomExId).toBeTruthy();
    expect(detailsByCustomExId.gifUrl).toBe('./exercises/lever-seated-dip.gif');

    // 4. By object with custom id fallback to name
    const detailsByCustomId = getExerciseDetails({ id: 'custom-1788800640', name: '坐姿三头下压' });
    expect(detailsByCustomId).toBeTruthy();
    expect(detailsByCustomId.gifUrl).toBe('./exercises/lever-seated-dip.gif');
  });

  it('workout review prompt does not match equipment visual card in AI assistant', () => {
    const reviewPrompt = '我刚刚完成了【推日】！\n各动作实测明细:\n1. 蝴蝶机夹胸: 4组(32kg x 12次)\n2. 固定器械推胸: 4组';
    const isWorkoutReview = /我刚刚完成了|深度复盘|本次训练客观数据|训练总评|各动作实测明细/i.test(reviewPrompt);
    const isEquipmentIntent = /器械|长啥样|长什么样|外观|实物|调节|插销|座椅|照片/i.test(reviewPrompt);
    const shouldMatch = (!isWorkoutReview && isEquipmentIntent) ? findGymEquipmentVisual(reviewPrompt) : null;
    
    expect(isWorkoutReview).toBe(true);
    expect(shouldMatch).toBeNull();
  });

  it('specific equipment question matches equipment visual card', () => {
    const eqQuestion = '请问健身房里的蝴蝶机长啥样？怎么调节座椅插销？';
    const isWorkoutReview = /我刚刚完成了|深度复盘|本次训练客观数据|训练总评|各动作实测明细/i.test(eqQuestion);
    const isEquipmentIntent = /器械|长啥样|长什么样|外观|实物|调节|插销|座椅|照片/i.test(eqQuestion);
    const shouldMatch = (!isWorkoutReview && isEquipmentIntent) ? findGymEquipmentVisual(eqQuestion) : null;

    expect(isWorkoutReview).toBe(false);
    expect(isEquipmentIntent).toBe(true);
    expect(shouldMatch).toBeTruthy();
    expect(shouldMatch.name).toContain('蝴蝶机');
  });
});

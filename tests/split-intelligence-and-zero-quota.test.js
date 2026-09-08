import { describe, it, expect, beforeEach } from 'vitest';
import { 
  store, 
  startWorkout, 
  toggleSetCompletion, 
  finishWorkout, 
  discardActiveWorkout, 
  pruneUntouchedExercisesFromActiveWorkout,
  addExerciseToActiveWorkout
} from '../src/store/fitnessStore.js';
import { 
  detectSplitType, 
  classifyExerciseMuscle, 
  analyzeActiveWorkoutCoverage,
  getInstantSubstitutes
} from '../src/engine/splitIntelligenceEngine.js';
import { DEFAULT_EXERCISES } from '../src/data/defaultPlans.js';

describe('Split Muscle Intelligence Engine & Frictionless Customization', () => {
  beforeEach(() => {
    discardActiveWorkout();
    store.workoutLogs = [];
  });

  describe('1. Split & Muscle Biological Classification', () => {
    it('accurately detects standard split types', () => {
      expect(detectSplitType('推日 (Push) —— 打造铠甲胸', '推')).toBe('push');
      expect(detectSplitType('拉日 (Pull) —— 拓宽V字腰身', '拉')).toBe('pull');
      expect(detectSplitType('腿日 (Legs) —— 黄金比例', '腿')).toBe('legs');
      expect(detectSplitType('上肢综合日 (Upper Body)', '上肢')).toBe('upper');
      expect(detectSplitType('下肢力量日 (Lower Body)', '下肢')).toBe('lower');
      expect(detectSplitType('自由漫游', '自选')).toBe('custom');
    });

    it('classifies exercises into physiological muscle targets', () => {
      expect(classifyExerciseMuscle({ name: '上斜哑铃卧推', category: '胸部' })).toBe('chest');
      expect(classifyExerciseMuscle({ name: '绳索侧平举', category: '肩部' })).toBe('shoulders');
      expect(classifyExerciseMuscle({ name: '过头绳索臂屈伸', category: '手臂' })).toBe('triceps');
      expect(classifyExerciseMuscle({ name: '绳索面拉 (Face Pull)', category: '肩部' })).toBe('rear_delts');
      expect(classifyExerciseMuscle({ name: '对握/宽握高位下拉', category: '背部' })).toBe('back');
      expect(classifyExerciseMuscle({ name: '上斜哑铃弯举', category: '手臂' })).toBe('biceps');
      expect(classifyExerciseMuscle({ name: '哈克深蹲 / 倒蹬腿举', category: '腿部' })).toBe('quads');
      expect(classifyExerciseMuscle({ name: '罗马尼亚硬拉 (RDL)', category: '腿部' })).toBe('posterior');
      expect(classifyExerciseMuscle({ name: '站姿/坐姿提踵', category: '腿部' })).toBe('calves');
    });
  });

  describe('2. Real-Time Split Muscle Coverage Analysis (Zero Quota / Zero Latency)', () => {
    it('diagnoses missing muscles at workout start and generates recommendations', () => {
      startWorkout('plan-push');
      const analysis = analyzeActiveWorkoutCoverage(store.activeWorkout, DEFAULT_EXERCISES);

      expect(analysis.splitKey).toBe('push');
      expect(analysis.isCustom).toBe(false);
      expect(analysis.muscles.length).toBe(3); // chest, shoulders, triceps
      
      // Initially 0 completed sets
      analysis.muscles.forEach(m => {
        expect(m.completedSets).toBe(0);
        expect(m.status).toBe('missing');
      });

      expect(analysis.deficits.length).toBe(3);
      expect(analysis.recommendedAddons.length).toBeGreaterThanOrEqual(1);
    });

    it('updates in real time as sets are completed and detects specific muscle deficits', () => {
      startWorkout('plan-push');
      // Exercise 0: 上斜哑铃卧推 (chest) - 3 sets
      // Exercise 1: 固定器械推胸 (chest) - 3 sets
      // Complete all 6 chest sets
      toggleSetCompletion(0, 0);
      toggleSetCompletion(0, 1);
      toggleSetCompletion(0, 2);
      toggleSetCompletion(1, 0);
      toggleSetCompletion(1, 1);
      toggleSetCompletion(1, 2);

      const analysis = analyzeActiveWorkoutCoverage(store.activeWorkout, DEFAULT_EXERCISES);
      
      const chest = analysis.muscles.find(m => m.key === 'chest');
      expect(chest.completedSets).toBe(6);
      expect(chest.status).toBe('optimal'); // 6 sets >= minSets (6)

      const shoulders = analysis.muscles.find(m => m.key === 'shoulders');
      expect(shoulders.completedSets).toBe(0);
      expect(shoulders.status).toBe('missing');

      const triceps = analysis.muscles.find(m => m.key === 'triceps');
      expect(triceps.completedSets).toBe(0);
      expect(triceps.status).toBe('missing');

      // Headline should highlight the missing shoulder & tricep stimulation
      expect(analysis.headline).toContain('三角肌');
      expect(analysis.headline).toContain('肱三头肌');

      // Recommendations should provide exercises for the missing groups (not chest)
      const recNames = analysis.recommendedAddons.map(r => r.name);
      expect(recNames.some(n => n.includes('侧平举') || n.includes('推肩') || n.includes('臂屈伸') || n.includes('下压'))).toBe(true);
    });

    it('achieves overall success state when all targets reach scientific volume thresholds', () => {
      startWorkout('plan-push');

      // Add shoulder and tricep exercises to active workout
      addExerciseToActiveWorkout({
        name: '绳索侧平举',
        category: '肩部',
        defaultSets: 4,
        targetReps: '12-15次'
      });
      addExerciseToActiveWorkout({
        name: '站姿绳索三头下压',
        category: '手臂',
        defaultSets: 4,
        targetReps: '10-12次'
      });

      // Complete 6 sets of chest, 4 sets of shoulders, 4 sets of triceps
      // Exercise 0: 3 sets
      toggleSetCompletion(0, 0);
      toggleSetCompletion(0, 1);
      toggleSetCompletion(0, 2);
      // Exercise 1: 3 sets
      toggleSetCompletion(1, 0);
      toggleSetCompletion(1, 1);
      toggleSetCompletion(1, 2);
      // Exercise 3 (added shoulders): 4 sets
      toggleSetCompletion(3, 0);
      toggleSetCompletion(3, 1);
      toggleSetCompletion(3, 2);
      toggleSetCompletion(3, 3);
      // Exercise 4 (added triceps): 4 sets
      toggleSetCompletion(4, 0);
      toggleSetCompletion(4, 1);
      toggleSetCompletion(4, 2);
      toggleSetCompletion(4, 3);

      const analysis = analyzeActiveWorkoutCoverage(store.activeWorkout, DEFAULT_EXERCISES);
      expect(analysis.overallStatus).toBe('success');
      expect(analysis.deficits.length).toBe(0);
      expect(analysis.headline).toContain('超量恢复黄金区');
    });
  });

  describe('3. Auto-Pruning Untouched Exercises & Frictionless Customization', () => {
    it('automatically prunes untouched exercises (0 completed sets) on finishWorkout', () => {
      startWorkout('plan-push');
      expect(store.activeWorkout.exercises.length).toBe(3);

      // User only does exercise 0 (e.g. 2 sets) and leaves exercises 1 & 2 untouched
      toggleSetCompletion(0, 0);
      toggleSetCompletion(0, 1);

      const summary = finishWorkout();

      // Only the completed exercise is saved, untouched exercises are pruned!
      expect(summary.exercises.length).toBe(1);
      expect(summary.exercises[0].name).toBe(store.workoutLogs[0].exercises[0].name);
      expect(store.workoutLogs[0].exercises.length).toBe(1);
    });

    it('supports 1-click manual pruning of untouched exercises during workout', () => {
      startWorkout('plan-push');
      expect(store.activeWorkout.exercises.length).toBe(3);

      // Complete 1 set on exercise 0
      toggleSetCompletion(0, 0);

      // 1-click prune untouched
      const removed = pruneUntouchedExercisesFromActiveWorkout();
      expect(removed).toBe(2);
      expect(store.activeWorkout.exercises.length).toBe(1);
      expect(store.activeWorkout.exercises[0].sets[0].completed).toBe(true);
    });

    it('supports starting a blank workout with zero pre-filled exercises', () => {
      startWorkout('plan-push', null, { mode: 'blank' });
      expect(store.activeWorkout).toBeTruthy();
      expect(store.activeWorkout.exercises.length).toBe(0);

      // Add one exercise on the fly
      addExerciseToActiveWorkout({
        name: '哑铃平板卧推',
        category: '胸部',
        defaultSets: 3,
        defaultWeight: 24,
        targetReps: '8-10次'
      });

      expect(store.activeWorkout.exercises.length).toBe(1);
      toggleSetCompletion(0, 0);

      const summary = finishWorkout();
      expect(summary.exercises.length).toBe(1);
      expect(summary.exercises[0].name).toBe('哑铃平板卧推');
    });
  });

  describe('4. Instant Biomechanical Substitutes (One-Second Equipment Swapping)', () => {
    it('retrieves instant substitutes with reasons from exercise library', () => {
      const subs = getInstantSubstitutes('上斜哑铃卧推', DEFAULT_EXERCISES);
      expect(subs.length).toBeGreaterThan(0);
      expect(subs.some(s => s.name === '平板杠铃卧推' || s.name === '上斜器械推胸')).toBe(true);
      expect(subs[0].reason).toBeTruthy();
    });
  });

  describe('5. Extended Scientific Splits & Interactive Deficit Target Selection', () => {
    it('accurately identifies advanced splits: Arnold, Full Body, Chest Focus, Back Focus', () => {
      expect(detectSplitType('阿诺德胸背超级组', '胸背')).toBe('arnold_chest_back');
      expect(detectSplitType('阿诺德肩臂雕刻日', '肩臂')).toBe('arnold_shoulders_arms');
      expect(detectSplitType('全身力量与代谢综合日', '全身')).toBe('full_body');
      expect(detectSplitType('大重量纯胸突破日', '纯胸')).toBe('chest_focus');
      expect(detectSplitType('大重量纯背增厚日', '纯背')).toBe('back_focus');
    });

    it('generates biomechanical deficit diagnosis and targeted addons for each selectable muscle', () => {
      startWorkout('plan-pull'); // Exercises: 高位下拉 (3 sets), 坐姿划船 (3 sets), 哑铃锤式弯举 (3 sets)
      // User completes all 3 sets of 高位下拉
      toggleSetCompletion(0, 0);
      toggleSetCompletion(0, 1);
      toggleSetCompletion(0, 2);

      const analysis = analyzeActiveWorkoutCoverage(store.activeWorkout, DEFAULT_EXERCISES);
      expect(analysis.splitKey).toBe('pull');

      // 1. Back has 3 completed sets, still needs 3 sets
      const back = analysis.muscles.find(m => m.key === 'back');
      expect(back.completedSets).toBe(3);
      expect(back.status).toBe('insufficient');
      expect(back.deficitReason).toContain('划船');
      expect(back.specificAddons.length).toBeGreaterThan(0);

      // 2. Rear delts has 0 sets
      const rearDelts = analysis.muscles.find(m => m.key === 'rear_delts');
      expect(rearDelts.completedSets).toBe(0);
      expect(rearDelts.status).toBe('missing');
      expect(rearDelts.deficitReason).toContain('水平外展');
      expect(rearDelts.specificAddons.some(a => a.name.includes('面拉') || a.name.includes('飞鸟'))).toBe(true);

      // 3. Biceps has 0 sets
      const biceps = analysis.muscles.find(m => m.key === 'biceps');
      expect(biceps.completedSets).toBe(0);
      expect(biceps.status).toBe('missing');
      expect(biceps.deficitReason).toContain('弯举');
      expect(biceps.specificAddons.some(a => a.name.includes('弯举'))).toBe(true);
    });
  });
});


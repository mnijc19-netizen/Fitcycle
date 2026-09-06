import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../src/store/fitnessStore.js';
import ExercisesView from '../src/views/ExercisesView.vue';
import { 
  getExerciseEquipment, 
  getExerciseSubTarget, 
  isStapleExercise, 
  EQUIPMENT_OPTIONS, 
  SUB_TARGET_MAP 
} from '../src/utils/exerciseFilterUtils.js';

describe('Multi-Dimensional Exercise Taxonomy & Biomechanical Filtering', () => {
  it('classifies equipment types accurately across barbells, dumbbells, cables, machines, and bodyweight', () => {
    const bench = store.exercises.find(e => e.id === 'ex-barbell-bench-press');
    expect(bench).toBeDefined();
    expect(getExerciseEquipment(bench)).toBe('杠铃');

    const dbCurl = store.exercises.find(e => e.id === 'ex-incline-db-curl' || e.id === 'ex-db-bicep-curl');
    expect(dbCurl).toBeDefined();
    expect(getExerciseEquipment(dbCurl)).toBe('哑铃');

    const cablePushdown = store.exercises.find(e => e.id === 'ex-single-cable-pushdown');
    expect(cablePushdown).toBeDefined();
    expect(getExerciseEquipment(cablePushdown)).toBe('绳索');

    const hackSquat = store.exercises.find(e => e.id === 'ex-hack-squat');
    expect(hackSquat).toBeDefined();
    expect(getExerciseEquipment(hackSquat)).toBe('固定器械');

    const dips = store.exercises.find(e => e.id === 'ex-chest-dips' || e.id === 'ex-diamond-push-up');
    expect(dips).toBeDefined();
    expect(getExerciseEquipment(dips)).toBe('自重');
  });

  it('correctly maps sub-targets across chest, back, shoulders, arms, legs and core', () => {
    const inclineBench = store.exercises.find(e => e.id === 'ex-incline-db-bench');
    expect(inclineBench).toBeDefined();
    expect(getExerciseSubTarget(inclineBench)).toBe('上胸');

    const latPulldown = store.exercises.find(e => e.id === 'ex-lat-pulldown');
    expect(latPulldown).toBeDefined();
    expect(getExerciseSubTarget(latPulldown)).toBe('背阔肌 (宽度)');

    const lateralRaise = store.exercises.find(e => e.id === 'ex-dumbbell-lateral-raise');
    expect(lateralRaise).toBeDefined();
    expect(getExerciseSubTarget(lateralRaise)).toBe('中束 (侧平举)');

    const rotatorCuff = store.exercises.find(e => e.id === 'ex-rotator-cuff-ext-rotation');
    expect(rotatorCuff).toBeDefined();
    expect(getExerciseSubTarget(rotatorCuff)).toBe('肩袖防伤');

    const goodMorning = store.exercises.find(e => e.id === 'ex-good-morning');
    expect(goodMorning).toBeDefined();
    expect(getExerciseSubTarget(goodMorning)).toBe('下背/竖脊肌');

    const dragonFlag = store.exercises.find(e => e.id === 'ex-dragon-flag');
    expect(dragonFlag).toBeDefined();
    expect(getExerciseSubTarget(dragonFlag)).toBe('腹直肌 (上腹/下腹)');
  });

  it('verifies newly expanded exercises exist in library with non-empty cues and 1-to-1 local GIFs', () => {
    const fs = require('fs');
    const path = require('path');
    const publicGifs = new Set(fs.readdirSync(path.resolve(__dirname, '../public/exercises')));

    const targetIds = [
      'ex-good-morning',
      'ex-zottman-curl',
      'ex-pendulum-squat',
      'ex-dragon-flag',
      'ex-lever-decline-chest-press',
      'ex-behind-back-shrug',
      'ex-nordic-curl',
      'ex-tibialis-raise',
      'ex-waiter-curl',
      'ex-curtsy-lunge'
    ];

    for (const id of targetIds) {
      const ex = store.exercises.find(e => e.id === id);
      expect(ex).toBeDefined();
      expect(ex.name).toBeTruthy();
      expect(ex.tips.execution).toBeTruthy();
      expect(ex.gifUrl).toBeDefined();
      const filename = ex.gifUrl.replace(/^\.?\/exercises\//, '');
      expect(publicGifs.has(filename)).toBe(true);
    }
  });

  it('renders equipment filter pills and dynamic sub-target chips in ExercisesView', async () => {
    const wrapper = mount(ExercisesView);

    // Verify equipment pills exist
    expect(wrapper.text()).toContain('全部器械');
    expect(wrapper.text()).toContain('杠铃');
    expect(wrapper.text()).toContain('哑铃');
    expect(wrapper.text()).toContain('固定器械');

    // Click '胸部 (胸肌)' category
    const chestButton = wrapper.findAll('button').find(b => b.text().includes('胸部'));
    expect(chestButton).toBeDefined();
    await chestButton.trigger('click');

    // Verify sub-target chips appear for chest
    expect(wrapper.text()).toContain('上胸');
    expect(wrapper.text()).toContain('中胸');
    expect(wrapper.text()).toContain('下胸');
    expect(wrapper.text()).toContain('中缝内收');

    // Click '上胸' sub-target chip
    const upperChestChip = wrapper.findAll('button').find(b => b.text().trim() === '上胸');
    expect(upperChestChip).toBeDefined();
    await upperChestChip.trigger('click');

    // Should contain incline press movements
    expect(wrapper.text()).toContain('上斜');
  });

  it('filters exercises by equipment type (e.g. 哑铃 only)', async () => {
    const wrapper = mount(ExercisesView);

    // Click '哑铃' equipment pill
    const dumbbellPill = wrapper.findAll('button').find(b => b.text().includes('哑铃'));
    expect(dumbbellPill).toBeDefined();
    await dumbbellPill.trigger('click');

    // Should switch to list view with dumbbell indicator
    expect(wrapper.text()).toContain('全部 · 哑铃');
    expect(wrapper.text()).not.toContain('杠铃平凳卧推');
  });
});

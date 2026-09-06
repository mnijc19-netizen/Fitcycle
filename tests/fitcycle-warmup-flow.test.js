import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../src/store/fitnessStore.js';
import { WARMUP_EXERCISES } from '../src/data/exercisesWarmup.js';
import WarmupFlowModal from '../src/components/WarmupFlowModal.vue';
import StretchFlowModal from '../src/components/StretchFlowModal.vue';
import { STRETCH_EXERCISES } from '../src/data/exercisesStretches.js';
import TodayView from '../src/views/TodayView.vue';

describe('FitCycle Dynamic Warm-up System (NSCA RAMP Protocol)', () => {
  it('defines 10 verified warm-up exercises with non-empty scientific cues and valid local GIFs', () => {
    expect(WARMUP_EXERCISES).toHaveLength(10);

    const fs = require('fs');
    const path = require('path');
    const publicExercises = fs.readdirSync(path.resolve(__dirname, '../public/exercises'));

    for (const ex of WARMUP_EXERCISES) {
      expect(ex.category).toBe('热身');
      expect(ex.name).toBeTruthy();
      expect(ex.englishName).toBeTruthy();
      expect(ex.tips.execution).toBeTruthy();
      expect(ex.tips.prep).toBeTruthy();
      expect(ex.commonMistakes.length).toBeGreaterThan(0);

      const filename = ex.gifUrl.replace(/^\.?\/exercises\//, '');
      expect(publicExercises).toContain(filename);
    }
  });

  it('renders WarmupFlowModal for a Push plan with shoulder, scapular and wrist activations', async () => {
    const pushPlan = { name: '推日 (Push) —— 打造铠甲胸与加宽肩膀', category: '推' };
    const wrapper = mount(WarmupFlowModal, {
      props: {
        visible: true,
        plan: pushPlan
      },
      global: {
        stubs: { Teleport: true }
      }
    });

    expect(wrapper.text()).toContain('3 分钟动态热身流');
    expect(wrapper.text()).toContain('推日专属');
    // First exercise is wrist circles or arm circles
    expect(wrapper.text()).toContain('动作 1 / 4');
    expect(wrapper.text()).toContain('为什么练前必做');

    // Click next step
    const nextBtn = wrapper.find('button.bg-amber-500');
    expect(nextBtn.exists()).toBe(true);
    await nextBtn.trigger('click');

    expect(wrapper.text()).toContain('动作 2 / 4');
  });

  it('renders WarmupFlowModal for a Leg plan with hip flexor and glute activation', async () => {
    const legPlan = { name: '腿日 (Legs) —— 强化力量深蹲与下肢动力链', category: '腿' };
    const wrapper = mount(WarmupFlowModal, {
      props: {
        visible: true,
        plan: legPlan
      },
      global: {
        stubs: { Teleport: true }
      }
    });

    expect(wrapper.text()).toContain('腿日专属');
    expect(wrapper.text()).toContain('髂腰肌');
  });


  it('defines 20 verified stretch exercises with ACSM scientific cues and valid local GIFs', () => {
    expect(STRETCH_EXERCISES).toHaveLength(20);

    const fs = require('fs');
    const path = require('path');
    const publicExercises = fs.readdirSync(path.resolve(__dirname, '../public/exercises'));

    for (const ex of STRETCH_EXERCISES) {
      expect(ex.category).toBe('拉伸');
      expect(ex.name).toBeTruthy();
      expect(ex.englishName).toBeTruthy();
      expect(ex.tips.execution).toBeTruthy();
      expect(ex.tips.prep).toBeTruthy();
      expect(ex.commonMistakes.length).toBeGreaterThan(0);

      const filename = ex.gifUrl.replace(/^\.?\/exercises\//, '');
      expect(publicExercises).toContain(filename);
    }
  });

  it('renders StretchFlowModal for a Push plan with pec, shoulder, triceps and rotator cuff stretches', async () => {
    const pushPlan = { name: '推日 (Push) —— 打造铠甲胸与加宽肩膀', category: '推' };
    const wrapper = mount(StretchFlowModal, {
      props: {
        visible: true,
        plan: pushPlan
      },
      global: {
        stubs: { Teleport: true }
      }
    });

    expect(wrapper.text()).toContain('3 分钟练后拉伸流');
    expect(wrapper.text()).toContain('推日专属拉伸');
    expect(wrapper.text()).toContain('动作 1 / 4');
    expect(wrapper.text()).toContain('ACSM 科学原理');

    // Click next step (locate the next-step button specifically)
    const buttons = wrapper.findAll('button');
    const nextBtn = buttons.find(b => b.text().includes('下一个拉伸'));
    expect(nextBtn).toBeDefined();
    await nextBtn.trigger('click');

    expect(wrapper.text()).toContain('动作 2 / 4');
  });

  it('renders 练后 3 分钟筋膜拉伸流 entry card in TodayView when not rest day', async () => {
    const wrapper = mount(TodayView);
    expect(wrapper.text()).toContain('练后 3 分钟筋膜拉伸流');
  });

  it('renders 练前 3 分钟动态热身流 entry card in TodayView when not rest day', async () => {
    const wrapper = mount(TodayView);
    expect(wrapper.text()).toContain('练前 3 分钟动态热身流');
    expect(wrapper.text()).toContain('跟练');
  });
});

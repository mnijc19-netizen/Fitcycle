import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { store } from '../src/store/fitnessStore.js';
import FitCycleLogo from '../src/components/FitCycleLogo.vue';
import ExercisesView from '../src/views/ExercisesView.vue';

describe('FitCycle Brand & Dynamic Vector Logo', () => {
  it('renders SVG vector logo with dual-loop Möbius kinetic curves', () => {
    const wrapper = mount(FitCycleLogo, {
      props: { size: 32 }
    });
    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('width')).toBe('32');
    expect(svg.attributes('height')).toBe('32');
    expect(wrapper.html()).toContain('fitcycle-grad-primary');
  });
});

describe('Exercise Library 1-to-1 Accuracy & Alias Search', () => {
  it('contains exactly 63 verified exercises across all major muscle categories', () => {
    expect(store.exercises).toHaveLength(63);
    const categories = new Set(store.exercises.map(e => e.category));
    expect(categories.has('胸部')).toBe(true);
    expect(categories.has('背部')).toBe(true);
    expect(categories.has('肩部')).toBe(true);
    expect(categories.has('手臂')).toBe(true);
    expect(categories.has('腿部')).toBe(true);
    expect(categories.has('核心')).toBe(true);
  });

  it('verifies posture-corrected exercises match their physical biomechanics', () => {
    const lyingLegCurl = store.exercises.find(e => e.id === 'ex-seated-leg-curl');
    expect(lyingLegCurl).toBeDefined();
    expect(lyingLegCurl.name).toContain('俯卧器械腿弯举');
    expect(lyingLegCurl.aliases).toContain('坐姿腿弯举');
    expect(lyingLegCurl.aliases).toContain('卧姿腿弯举');

    const pullover = store.exercises.find(e => e.id === 'ex-straight-arm-pulldown');
    expect(pullover).toBeDefined();
    expect(pullover.name).toContain('仰卧哑铃上拉');
    expect(pullover.aliases).toContain('直臂下压');
    expect(pullover.aliases).toContain('哑铃套衫');

    const pushdown = store.exercises.find(e => e.id === 'ex-machine-triceps-pressdown');
    expect(pushdown).toBeDefined();
    expect(pushdown.name).toContain('站姿绳索三头下压');
    expect(pushdown.aliases).toContain('绳索下压');
  });

  it('allows alias search in ExercisesView', async () => {
    const wrapper = mount(ExercisesView);
    const searchInput = wrapper.find('input[type="text"]');
    expect(searchInput.exists()).toBe(true);

    // Search by alias "直臂下压" -> should find the pullover exercise
    await searchInput.setValue('直臂下压');
    expect(wrapper.text()).toContain('仰卧哑铃上拉');

    // Search by alias "坐姿腿弯举" -> should find the lying leg curl exercise
    await searchInput.setValue('坐姿腿弯举');
    expect(wrapper.text()).toContain('俯卧器械腿弯举');

    // Search by English name "Military" -> should find overhead barbell press
    await searchInput.setValue('Military');
    expect(wrapper.text()).toContain('杠铃推肩');
  });
});

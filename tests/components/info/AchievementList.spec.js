import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AchievementList from '@/components/info/AchievementList.vue';
import { achievements, getAchievementStatuses } from '@/achievements';
import { getDate } from '@/utils';
import { mountWithI18n } from '../../helpers/mount.js';

const NOW = '2026-01-15T12:00:00Z';

const realItems = (wrapper) => wrapper.findAll('.item').filter((w) => !w.classes().includes('offset'));

describe('AchievementList', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders all 18 achievements plus flex-alignment offset fillers', () => {
    const wrapper = mountWithI18n(AchievementList, { props: { statusData: {} } });
    expect(realItems(wrapper)).toHaveLength(18);
    expect(wrapper.findAll('.item.offset')).toHaveLength(5 - (achievements.length % 5));
  });

  it('shows the plural header for a total of 0 achievements', () => {
    const wrapper = mountWithI18n(AchievementList, { props: { statusData: {} } });
    expect(wrapper.find('h2').text()).toBe('0 achievements');
  });

  it('shows the singular header for a total of exactly 1 achievement', () => {
    const statusData = { '2026-01-15': 1, '2026-01-10': -1 }; // only "beginning" achieved
    const total = Object.values(getAchievementStatuses(statusData)).reduce((s, a) => s + a.state, 0);
    expect(total).toBe(1);
    const wrapper = mountWithI18n(AchievementList, { props: { statusData } });
    expect(wrapper.find('h2').text()).toBe('1 achievement');
  });

  it('marks an achievement active once its state is above 0, without a badge at state 1', () => {
    const statusData = { '2026-01-15': 1, '2026-01-10': -1 }; // "beginning" achieved once
    const wrapper = mountWithI18n(AchievementList, { props: { statusData } });
    const items = realItems(wrapper);
    expect(items[0].classes()).toContain('active'); // beginning
    expect(items[0].find('.badge').exists()).toBe(false);
    expect(items[1].classes()).not.toContain('active'); // ten
  });

  it('shows a numeric badge once an achievement has been reached more than once', () => {
    // two disjoint 7-day success streaks -> "speed" reaches state 2
    const statusData = {};
    for (let d = 1; d <= 7; d++) statusData[getDate(2026, 1, d)] = 1;
    statusData[getDate(2026, 1, 8)] = -1;
    for (let d = 9; d <= 15; d++) statusData[getDate(2026, 1, d)] = 1;
    const wrapper = mountWithI18n(AchievementList, { props: { statusData } });
    const speedItem = realItems(wrapper)[2]; // achievements[2] === 'speed'
    expect(speedItem.classes()).toContain('active');
    expect(speedItem.find('.badge').text()).toBe('2');
  });

  it('shows no progress line when progress is exactly 0', () => {
    const wrapper = mountWithI18n(AchievementList, { props: { statusData: {} } });
    const text = wrapper.text();
    expect(text).not.toContain('completed');
    expect(text).not.toContain('done');
  });

  it('shows a "completed" line when progress reaches 100', () => {
    const statusData = { '2026-01-15': 1, '2026-01-10': -1 };
    const wrapper = mountWithI18n(AchievementList, { props: { statusData } });
    expect(realItems(wrapper)[0].text()).toContain('completed'); // beginning is instantly 100%
  });

  it('shows a percentage/left line when progress is between 0 and 100', () => {
    const statusData = { '2026-01-01': 1, '2026-01-03': 1, '2026-01-05': 1, '2026-01-07': 1, '2026-01-09': 1 }; // 5 scattered successes
    const wrapper = mountWithI18n(AchievementList, { props: { statusData } });
    const tenItem = realItems(wrapper)[1]; // achievements[1] === 'ten'
    expect(tenItem.text()).toContain('50.0% done');
    expect(tenItem.text()).toContain('5 days left');
  });

  it('pulses a newly unlocked achievement and clears it after the animation', async () => {
    const wrapper = mountWithI18n(AchievementList, { props: { statusData: {}, unlockedAchievements: [] } });
    await wrapper.setProps({ unlockedAchievements: ['beginning'] });
    expect(realItems(wrapper)[0].classes()).toContain('pulse');
    vi.advanceTimersByTime(1300);
    await wrapper.vm.$nextTick();
    expect(realItems(wrapper)[0].classes()).not.toContain('pulse');
  });
});

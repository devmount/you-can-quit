import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import InfoPanel from '@/components/InfoPanel.vue';
import { mountWithI18n } from '../helpers/mount.js';

const NOW = '2026-01-15T12:00:00Z';

describe('InfoPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('passes statusData through to StatsPanel and AchievementList', () => {
    const statusData = { '2026-01-15': 1, '2026-01-14': 1, '2026-01-13': 1 };
    const wrapper = mountWithI18n(InfoPanel, { props: { statusData } });
    // StatsPanel: 3 successful days surfaces as the "total successful" stat
    expect(wrapper.findAll('.stats .box .data')[2].text()).toContain('3 days');
    // AchievementList: "beginning" (index 0) becomes active from a real success
    expect(wrapper.findAll('.achievements .item:not(.offset)')[0].classes()).toContain('active');
    // DayLegend renders unconditionally
    expect(wrapper.text()).toContain('Legend');
  });

  it('mounts without unlockedAchievements, defaulting to no pulse', () => {
    const wrapper = mountWithI18n(InfoPanel, { props: { statusData: {} } });
    expect(wrapper.find('.item.pulse').exists()).toBe(false);
  });
});

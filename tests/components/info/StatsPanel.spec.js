import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import StatsPanel from '@/components/info/StatsPanel.vue';
import { mountWithI18n } from '../../helpers/mount.js';

const NOW = '2026-01-15T12:00:00Z';

describe('StatsPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows all three stats as zero for empty data', () => {
    const wrapper = mountWithI18n(StatsPanel, { props: { statusData: {} } });
    const boxes = wrapper.findAll('.box .data');
    expect(boxes).toHaveLength(3);
    boxes.forEach((box) => {
      expect(box.classes()).toContain('zero');
      expect(box.text()).toContain('0 days');
    });
  });

  it('computes current streak, longest streak and total successful days', () => {
    const statusData = {
      '2026-01-15': 1, '2026-01-14': 1, '2026-01-13': 1, // current streak: 3
      '2026-01-07': 1, '2026-01-06': 1, '2026-01-05': 1, '2026-01-04': 1,
      '2026-01-03': 1, '2026-01-02': 1, '2026-01-01': 1, // historical streak: 7
    };
    const wrapper = mountWithI18n(StatsPanel, { props: { statusData } });
    const boxes = wrapper.findAll('.box .data');
    expect(boxes[0].text()).toContain('3 days'); // current streak
    expect(boxes[1].text()).toContain('7 days'); // longest streak
    expect(boxes[2].text()).toContain('10 days'); // total successful
    boxes.forEach((box) => expect(box.classes()).not.toContain('zero'));
  });

  it('uses the singular form for a value of exactly 1', () => {
    const wrapper = mountWithI18n(StatsPanel, { props: { statusData: { '2026-01-15': 1 } } });
    const boxes = wrapper.findAll('.box .data');
    expect(boxes[0].text()).toContain('1 day');
    expect(boxes[0].text()).not.toContain('1 days');
  });
});

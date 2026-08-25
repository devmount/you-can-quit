import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MonthOverview from '@/components/MonthOverview.vue';
import { mountWithI18n } from '../helpers/mount.js';

// component captures "now" once at setup, so fake time must be set BEFORE mount
const NOW = '2026-01-15T12:00:00Z'; // Thursday

const mountMonth = (overrides = {}) => mountWithI18n(MonthOverview, {
  props: {
    dayOfWeekOffset: 4, // 2026-01-01 is a Thursday
    daysInMonth: 31,
    fillOffset: 1,
    statusData: {},
    date: { year: 2026, month: 1 },
    ...overrides,
  },
});

// real day cells, excluding the weekday-label row and the pre/post offset filler divs
const dayDivs = (wrapper) => wrapper.findAll('.day').filter((w) => !w.classes().includes('label') && !w.classes().includes('offset'));

describe('MonthOverview', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders exactly daysInMonth day cells', () => {
    const wrapper = mountMonth();
    expect(dayDivs(wrapper)).toHaveLength(31);
  });

  it('renders the correct count of pre- and post-offset filler cells', () => {
    const wrapper = mountMonth({ dayOfWeekOffset: 4, fillOffset: 1 });
    expect(wrapper.findAll('.day.offset')).toHaveLength(5);
  });

  it('marks today, past and future days correctly, and only shows actions for past/today', () => {
    const wrapper = mountMonth();
    const cells = dayDivs(wrapper);

    const today = cells[14]; // day 15
    expect(today.classes()).toContain('today');
    expect(today.attributes('title')).toBe('Today');
    expect(today.find('.action').exists()).toBe(true);

    const past = cells[13]; // day 14
    expect(past.classes()).toContain('past');
    expect(past.find('.action').exists()).toBe(true);

    const future = cells[19]; // day 20
    expect(future.classes()).toContain('future');
    expect(future.find('.action').exists()).toBe(false);
  });

  it('reflects statusData as success/fail classes', () => {
    const wrapper = mountMonth({ statusData: { '2026-01-10': 1, '2026-01-05': -1 } });
    const cells = dayDivs(wrapper);
    expect(cells[9].classes()).toContain('success'); // day 10
    expect(cells[4].classes()).toContain('fail'); // day 5
    expect(cells[0].classes()).not.toContain('success');
    expect(cells[0].classes()).not.toContain('fail');
  });

  it('shows the correct weekday abbreviation for a given day', () => {
    const wrapper = mountMonth();
    // day 15 is a Thursday
    expect(dayDivs(wrapper)[14].find('.day-weekday').text()).toBe('Th');
  });

  it('emits update with (year, month, day, status) from the action buttons', async () => {
    const wrapper = mountMonth();
    const past = dayDivs(wrapper)[13]; // day 14
    const buttons = past.findAll('button');
    await buttons[0].trigger('click'); // success
    await buttons[1].trigger('click'); // undo
    await buttons[2].trigger('click'); // fail
    expect(wrapper.emitted('update')).toEqual([
      [2026, 1, 14, 1],
      [2026, 1, 14, 0],
      [2026, 1, 14, -1],
    ]);
  });
});

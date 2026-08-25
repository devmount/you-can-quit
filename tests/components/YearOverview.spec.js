import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import YearOverview from '@/components/YearOverview.vue';
import { mountWithI18n } from '../helpers/mount.js';

// component captures "now" once at setup, so fake time must be set BEFORE mount
const NOW = '2026-01-15T12:00:00Z'; // Thursday, 2026-01-01 is also a Thursday

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const mountYear = (overrides = {}) => mountWithI18n(YearOverview, {
  props: {
    statusData: {},
    date: { year: 2026, month: 3 }, // viewing March
    ...overrides,
  },
});

// real day cells, excluding the weekday-label row and the pre-offset filler divs
const dayDivs = (wrapper) => wrapper.findAll('.day').filter((w) => !w.classes().includes('label') && !w.classes().includes('offset'));

// index (within dayDivs()) of a given (month 1-12, day) in the given year's grid
const indexOf = (year, month, day) => {
  let index = 0;
  for (let m = 1; m < month; m++) index += daysInMonth(year, m);
  return index + day - 1;
};

describe('YearOverview', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders one cell per day of the year (non-leap)', () => {
    const wrapper = mountYear({ date: { year: 2026, month: 3 } });
    expect(dayDivs(wrapper)).toHaveLength(365);
  });

  it('renders one cell per day of a leap year', () => {
    const wrapper = mountYear({ date: { year: 2024, month: 3 } });
    expect(dayDivs(wrapper)).toHaveLength(366);
  });

  it('renders dayOfWeekOffset pre-offset filler cells for the year start weekday', () => {
    const wrapper = mountYear();
    // 2026-01-01 is a Thursday -> getDay() === 4
    expect(wrapper.findAll('.day.offset')).toHaveLength(4);
  });

  it('marks exactly one cell as today, at the correct position', () => {
    const wrapper = mountYear();
    const cells = dayDivs(wrapper);
    const todays = cells.filter((c) => c.classes().includes('today'));
    expect(todays).toHaveLength(1);
    expect(todays[0].element).toBe(cells[indexOf(2026, 1, 15)].element);
    expect(todays[0].attributes('title')).toBe('Today');
  });

  it('marks only the days of the currently viewed month as tomonth', () => {
    const wrapper = mountYear({ date: { year: 2026, month: 3 } });
    const cells = dayDivs(wrapper);
    expect(cells.filter((c) => c.classes().includes('tomonth'))).toHaveLength(daysInMonth(2026, 3));
    expect(cells[indexOf(2026, 3, 1)].classes()).toContain('tomonth');
    expect(cells[indexOf(2026, 1, 1)].classes()).not.toContain('tomonth');
  });

  it('reflects statusData as success/fail classes at the correct positions', () => {
    const wrapper = mountYear({ statusData: { '2026-03-10': 1, '2026-03-20': -1 } });
    const cells = dayDivs(wrapper);
    expect(cells[indexOf(2026, 3, 10)].classes()).toContain('success');
    expect(cells[indexOf(2026, 3, 20)].classes()).toContain('fail');
  });

  it('renders the month initial only on the first day of each month', () => {
    const wrapper = mountYear();
    const cells = dayDivs(wrapper);
    expect(cells[indexOf(2026, 1, 1)].text()).toBe('J');
    expect(cells[indexOf(2026, 3, 1)].text()).toBe('M');
    expect(cells[indexOf(2026, 1, 2)].text()).toBe('');
  });
});

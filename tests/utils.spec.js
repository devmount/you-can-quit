import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { languages, getDate, getMinDate, getStateString, getCurrentStreak, getLongestStreak } from '@/utils';

// fixed "today" used by every date-dependent function below: Thu 2026-01-15
const NOW = '2026-01-15T12:00:00Z';

describe('languages', () => {
  it('lists all supported locales with their native names', () => {
    expect(languages).toEqual({
      'de': 'Deutsch',
      'en': 'English',
      'fr': 'Francais',
      'it': 'Italiano',
      'pt-BR': 'Português (brasileiro)',
    });
  });
});

describe('getDate', () => {
  it('zero-pads single-digit month and day', () => {
    expect(getDate(2026, 1, 5)).toBe('2026-01-05');
  });

  it('leaves double-digit month and day unpadded', () => {
    expect(getDate(2026, 12, 31)).toBe('2026-12-31');
  });
});

describe('getMinDate', () => {
  it('returns the Unix epoch when there is no data yet', () => {
    expect(getMinDate({})).toEqual(new Date(1970, 0, 1));
  });

  it('returns the single tracked date', () => {
    expect(getMinDate({ '2026-03-05': 1 })).toEqual(new Date('2026-03-05'));
  });

  it('returns the earliest tracked date regardless of key order or status', () => {
    const statusData = { '2026-03-05': 1, '2020-01-01': -1, '2025-12-31': 1 };
    expect(getMinDate(statusData)).toEqual(new Date('2020-01-01'));
  });
});

describe('date-dependent functions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getStateString', () => {
    it('walks backward from today to minDate, newest first', () => {
      const statusData = {
        '2026-01-15': 1,
        '2026-01-14': -1,
        '2026-01-12': 1,
        '2026-01-10': -1,
      };
      expect(getStateString(statusData, '2026-01-10')).toBe('sfnsnf');
    });

    it('includes minDate itself (inclusive lower bound via time-of-day)', () => {
      const statusData = { '2026-01-15': 1 };
      expect(getStateString(statusData, '2026-01-15')).toBe('s');
    });

    it('filters to only matching weekdays, skipping non-matching days entirely', () => {
      const statusData = { '2026-01-11': 1, '2026-01-04': -1 };
      const sundaysOnly = (d) => d.getDay() === 0;
      expect(getStateString(statusData, '2026-01-01', sundaysOnly)).toBe('sf');
    });
  });

  describe('getCurrentStreak', () => {
    it('returns 0 for empty data', () => {
      expect(getCurrentStreak({})).toBe(0);
    });

    it('returns 0 when today is explicitly failed', () => {
      expect(getCurrentStreak({ '2026-01-15': -1 })).toBe(0);
    });

    it('skips a trailing undecided (absent) today without breaking the streak', () => {
      const statusData = { '2026-01-14': 1, '2026-01-13': 1, '2026-01-12': 1 };
      expect(getCurrentStreak(statusData)).toBe(3);
    });

    it('stops at the first fail, ignoring older successes behind it', () => {
      const statusData = {
        '2026-01-15': 1,
        '2026-01-14': -1,
        '2026-01-13': 1,
        '2026-01-12': 1,
      };
      expect(getCurrentStreak(statusData)).toBe(1);
    });

    it('counts an uninterrupted run all the way back to minDate (inclusive)', () => {
      const statusData = {};
      for (let d = 10; d <= 15; d++) statusData[`2026-01-${d}`] = 1;
      expect(getCurrentStreak(statusData)).toBe(6);
    });
  });

  describe('getLongestStreak', () => {
    it('returns 0 for empty data', () => {
      expect(getLongestStreak({})).toBe(0);
    });

    it('picks a longer historical streak over a shorter, more recent one', () => {
      const statusData = {
        '2026-01-15': 1,
        '2026-01-14': -1,
        '2026-01-13': 1,
        '2026-01-12': 1,
        '2026-01-11': 1,
        '2026-01-10': 1,
        '2026-01-09': -1,
      };
      expect(getLongestStreak(statusData)).toBe(4);
    });

    it('counts a streak that runs uninterrupted through minDate', () => {
      const statusData = { '2026-01-12': 1, '2026-01-11': 1, '2026-01-10': 1 };
      expect(getLongestStreak(statusData)).toBe(3);
    });

    it('does not sum two equal-length streaks', () => {
      const statusData = {
        '2026-01-15': -1,
        '2026-01-14': 1,
        '2026-01-13': 1,
        '2026-01-12': -1,
        '2026-01-11': 1,
        '2026-01-10': 1,
        '2026-01-09': -1,
      };
      expect(getLongestStreak(statusData)).toBe(2);
    });
  });
});

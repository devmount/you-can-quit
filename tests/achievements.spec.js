import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { achievements, getAchievementStatuses } from '@/achievements';
import { getDate } from '@/utils';

// --- fixture helpers, all built from real Date arithmetic (never hand-counted calendar dates) ---

const key = (d) => getDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
const daysBack = (from, n) => new Date(from.getFullYear(), from.getMonth(), from.getDate() - n);

// marks `length` consecutive days as `status`, the most recent being `endOffset` days before `from`
const successRun = (from, endOffset, length, status = 1) => {
  const data = {};
  for (let i = 0; i < length; i++) {
    data[key(daysBack(from, endOffset + i))] = status;
  }
  return data;
};

// marks every day of the given weekday (0=Sunday..6=Saturday) as `status`, going back `count` occurrences
// from the most recent one on/before `from`
const weekdayRun = (from, dow, count, status = 1) => {
  let d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (d.getDay() !== dow) d = daysBack(d, 1);
  const data = {};
  for (let i = 0; i < count; i++) data[key(daysBack(d, i * 7))] = status;
  return data;
};

// marks every day of a month as successful, except the given 'yyyy-mm-dd' keys
const fillMonth = (year, month, exceptDates = []) => {
  const data = {};
  const days = new Date(year, month, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const k = getDate(year, month, d);
    if (!exceptDates.includes(k)) data[k] = 1;
  }
  return data;
};

// marks every day of a year as successful, except the given 'yyyy-mm-dd' keys
const fillYear = (year, exceptDates = []) => {
  const data = {};
  for (let m = 1; m <= 12; m++) Object.assign(data, fillMonth(year, m, exceptDates));
  return data;
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('getAchievementStatuses shape', () => {
  it('returns exactly the 18 documented achievements, each with the expected fields', () => {
    expect(achievements).toHaveLength(18);
    const statuses = getAchievementStatuses({});
    expect(Object.keys(statuses).sort()).toEqual([...achievements].sort());
    for (const a of achievements) {
      expect(statuses[a]).toMatchObject({
        state: expect.any(Number),
        progress: expect.any(Number),
        left: expect.any(Number),
        unit: expect.any(String),
      });
    }
  });
});

describe('beginning', () => {
  it('is not achieved with zero successes', () => {
    expect(getAchievementStatuses({}).beginning).toMatchObject({ state: 0, progress: 0, left: 1 });
  });

  it('is achieved after the first success', () => {
    const data = { '2026-01-01': 1 };
    expect(getAchievementStatuses(data).beginning).toMatchObject({ state: 1, progress: 100, left: 0 });
  });
});

describe('ten', () => {
  const build = (n) => {
    const data = {};
    for (let i = 0; i < n; i++) data[`2026-01-${String(i + 1).padStart(2, '0')}`] = 1;
    return data;
  };

  it('is not achieved with 9 successes', () => {
    expect(getAchievementStatuses(build(9)).ten).toMatchObject({ state: 0, left: 1 });
  });

  it('is achieved with exactly 10 successes', () => {
    expect(getAchievementStatuses(build(10)).ten).toMatchObject({ state: 1, progress: 100, left: 0 });
  });

  it('stays at state 1 past 10 successes (non-repeatable)', () => {
    expect(getAchievementStatuses(build(15)).ten).toMatchObject({ state: 1 });
  });
});

describe('speed (7-day streak)', () => {
  it('counts a historical 7-day streak separately from an unrelated current streak', () => {
    const now = new Date('2026-01-31T12:00:00Z');
    vi.setSystemTime(now);
    const data = {
      ...successRun(now, 0, 3), // trailing current streak of 3, ending today
      '2026-01-28': -1, // breaks it from anything older
      ...successRun(now, 24, 7), // historical 7-day streak (2026-01-01..07)
    };
    const statuses = getAchievementStatuses(data);
    expect(statuses.speed.state).toBe(1);
    expect(statuses.speed.progress).toBe((3 % 7) / 7 * 100);
    expect(statuses.speed.left).toBe(7 - 3 % 7);
  });
});

describe('alea (a month with <=6 non-successes)', () => {
  it('counts a fully-elapsed month with exactly 6 missing days', () => {
    vi.setSystemTime(new Date('2026-02-01T12:00:00Z'));
    const data = fillMonth(2026, 1, ['2026-01-26', '2026-01-27', '2026-01-28', '2026-01-29', '2026-01-30', '2026-01-31']);
    expect(getAchievementStatuses(data).alea.state).toBe(1);
  });

  it('does not count the same month with 7 missing days', () => {
    vi.setSystemTime(new Date('2026-02-01T12:00:00Z'));
    const data = fillMonth(2026, 1, ['2026-01-25', '2026-01-26', '2026-01-27', '2026-01-28', '2026-01-29', '2026-01-30', '2026-01-31']);
    expect(getAchievementStatuses(data).alea.state).toBe(0);
  });
});

describe('tide (more successes than fails)', () => {
  it('is achieved when successes outnumber fails', () => {
    const data = { a: 1, b: 1, c: 1, d: -1, e: -1 };
    const keyed = { '2026-01-01': 1, '2026-01-02': 1, '2026-01-03': 1, '2026-01-04': -1, '2026-01-05': -1 };
    expect(getAchievementStatuses(keyed).tide).toMatchObject({ state: 1, progress: 100, left: 0 });
  });

  it('is not achieved when successes only equal fails', () => {
    const data = { '2026-01-01': 1, '2026-01-02': 1, '2026-01-03': -1, '2026-01-04': -1 };
    expect(getAchievementStatuses(data).tide.state).toBe(0);
  });
});

describe('defense (6 successes right after exactly one fail)', () => {
  it('matches the success-fail-6xsuccess pattern', () => {
    const now = new Date('2026-03-10T12:00:00Z');
    vi.setSystemTime(now);
    const data = {
      ...successRun(now, 0, 6), // today and the 5 days before it
      [key(daysBack(now, 6))]: -1, // the fail right before that run
      [key(daysBack(now, 7))]: 1, // a success right before the fail
    };
    const statuses = getAchievementStatuses(data);
    expect(statuses.defense.state).toBe(1);
  });

  it('does not match with only 5 successes after the fail', () => {
    const now = new Date('2026-03-10T12:00:00Z');
    vi.setSystemTime(now);
    const data = {
      ...successRun(now, 0, 5),
      [key(daysBack(now, 5))]: -1,
      [key(daysBack(now, 6))]: 1,
    };
    expect(getAchievementStatuses(data).defense.state).toBe(0);
  });
});

describe('praise (5 successful Sundays in a row)', () => {
  it('is achieved with 5 consecutive successful Sundays', () => {
    const now = new Date('2026-01-11T12:00:00Z'); // a Sunday
    vi.setSystemTime(now);
    const data = weekdayRun(now, 0, 5);
    expect(getAchievementStatuses(data).praise.state).toBe(1);
  });

  it('is not achieved with only 4 consecutive successful Sundays', () => {
    const now = new Date('2026-01-11T12:00:00Z');
    vi.setSystemTime(now);
    const data = weekdayRun(now, 0, 4);
    expect(getAchievementStatuses(data).praise.state).toBe(0);
  });

  it('breaks the run on a failed Sunday, even if 5 total Sundays are marked', () => {
    const now = new Date('2026-01-11T12:00:00Z');
    vi.setSystemTime(now);
    const data = weekdayRun(now, 0, 5);
    // fail the 3rd-most-recent Sunday, splitting the run into 2 + 3
    const thirdSunday = key(daysBack(now, 14));
    data[thirdSunday] = -1;
    expect(getAchievementStatuses(data).praise.state).toBe(0);
  });
});

describe('uptrend (successes > 4x fails)', () => {
  it('is achieved when successes exceed 4x fails', () => {
    const data = { '2026-01-01': 1, '2026-01-02': 1, '2026-01-03': 1, '2026-01-04': 1, '2026-01-05': 1, '2026-01-06': -1 };
    expect(getAchievementStatuses(data).uptrend).toMatchObject({ state: 1, progress: 100, left: 0 });
  });

  it('is not achieved when successes exactly equal 4x fails', () => {
    const data = { '2026-01-01': 1, '2026-01-02': 1, '2026-01-03': 1, '2026-01-04': 1, '2026-01-05': -1 };
    expect(getAchievementStatuses(data).uptrend.state).toBe(0);
  });
});

describe('gatherer (collected 15 other achievements)', () => {
  it('is not achieved with no data', () => {
    expect(getAchievementStatuses({}).gatherer).toMatchObject({ state: 0, progress: 0, left: 15 });
  });

  it('always matches the formula derived from the sum of the other 17 achievement states', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    const data = successRun(now, 0, 60);
    const statuses = getAchievementStatuses(data);
    const sum = achievements.filter((a) => a !== 'gatherer').reduce((s, a) => s + statuses[a].state, 0);
    const expectedState = Math.floor((Math.floor(sum / 14) + sum) / 15);
    expect(statuses.gatherer.state).toBe(expectedState);
  });
});

describe('news (longest streak reaches a multiple of 10)', () => {
  it('is not achieved with a longest streak of 9', () => {
    const now = new Date('2026-01-15T12:00:00Z');
    vi.setSystemTime(now);
    const data = { '2026-01-15': -1, ...successRun(now, 6, 9) };
    expect(getAchievementStatuses(data).news.state).toBe(0);
  });

  it('is achieved once with a longest streak of exactly 10', () => {
    const now = new Date('2026-01-15T12:00:00Z');
    vi.setSystemTime(now);
    const data = { '2026-01-15': -1, ...successRun(now, 5, 10) };
    expect(getAchievementStatuses(data).news.state).toBe(1);
  });

  it('reports left=10 (not 0) when the current streak is itself an exact multiple of 10', () => {
    const now = new Date('2026-01-15T12:00:00Z');
    vi.setSystemTime(now);
    const data = successRun(now, 0, 20); // current streak == longest streak == 20
    const news = getAchievementStatuses(data).news;
    expect(news.state).toBe(2);
    expect(news.left).toBe(10);
    expect(news.progress).toBe(20 * 100 / 30);
  });
});

describe('spock (50 successes total)', () => {
  it('is not achieved with 49 successes', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(successRun(now, 0, 49)).spock.state).toBe(0);
  });

  it('is achieved with 50 successes', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(successRun(now, 0, 50)).spock.state).toBe(1);
  });
});

describe('madness (8 successful Wednesdays in a row)', () => {
  it('is achieved with 8 consecutive successful Wednesdays', () => {
    const now = new Date('2026-01-14T12:00:00Z'); // a Wednesday
    vi.setSystemTime(now);
    expect(getAchievementStatuses(weekdayRun(now, 3, 8)).madness.state).toBe(1);
  });

  it('is not achieved with only 7 consecutive successful Wednesdays', () => {
    const now = new Date('2026-01-14T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(weekdayRun(now, 3, 7)).madness.state).toBe(0);
  });
});

describe('clean (a whole month without a single fail or gap)', () => {
  it('counts a fully-elapsed month with every day marked successful', () => {
    vi.setSystemTime(new Date('2026-02-01T12:00:00Z'));
    const data = fillMonth(2026, 1);
    expect(getAchievementStatuses(data).clean.state).toBe(1);
  });

  it('does not count the same month with a single missing day', () => {
    vi.setSystemTime(new Date('2026-02-01T12:00:00Z'));
    const data = fillMonth(2026, 1, ['2026-01-15']);
    expect(getAchievementStatuses(data).clean.state).toBe(0);
  });
});

describe('strike (successes reach a multiple of 100)', () => {
  it('is not achieved with 99 successes', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(successRun(now, 0, 99)).strike.state).toBe(0);
  });

  it('is achieved with 100 successes', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(successRun(now, 0, 100)).strike.state).toBe(1);
  });
});

describe('epic (40-day streak)', () => {
  it('counts a historical 40-day streak, with progress driven by the separate live current streak', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    const data = {
      ...successRun(now, 0, 3), // live current streak of 3
      [key(daysBack(now, 3))]: -1, // breaks it
      ...successRun(now, 10, 40), // isolated historical 40-day streak
    };
    const statuses = getAchievementStatuses(data);
    expect(statuses.epic.state).toBe(1);
    expect(statuses.epic.progress).toBe(3 % 40 / 40 * 100);
    expect(statuses.epic.left).toBe(40 - 3 % 40);
  });

  it('does not count a 39-day streak', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(successRun(now, 0, 39)).epic.state).toBe(0);
  });
});

describe('master (365 successes total)', () => {
  it('is not achieved with 364 successes', () => {
    const now = new Date('2027-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(successRun(now, 0, 364)).master.state).toBe(0);
  });

  it('is achieved with 365 successes', () => {
    const now = new Date('2027-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(successRun(now, 0, 365)).master.state).toBe(1);
  });
});

describe('strength (100-day streak)', () => {
  it('is not achieved with a 99-day streak', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(successRun(now, 0, 99)).strength.state).toBe(0);
  });

  it('is achieved with a 100-day streak', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    vi.setSystemTime(now);
    expect(getAchievementStatuses(successRun(now, 0, 100)).strength.state).toBe(1);
  });
});

describe('legend (a whole year without a single fail or gap)', () => {
  it('counts a fully-elapsed year with every day marked successful', () => {
    vi.setSystemTime(new Date('2027-01-01T12:00:00Z'));
    const data = fillYear(2026);
    expect(getAchievementStatuses(data).legend.state).toBe(1);
  });

  it('does not count the same year with a single missing day', () => {
    vi.setSystemTime(new Date('2027-01-01T12:00:00Z'));
    const data = fillYear(2026, ['2026-07-04']);
    expect(getAchievementStatuses(data).legend.state).toBe(0);
  });
});

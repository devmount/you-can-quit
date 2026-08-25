import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import App from '@/App.vue';
import { getDate } from '@/utils';
import { mountWithI18n } from './helpers/mount.js';

vi.mock('@/database', () => {
  const store = {};
  const collection = {
    each: vi.fn(async (cb) => {
      Object.entries(store).forEach(([name, status]) => cb({ name, status }));
    }),
    delete: vi.fn(async () => {
      for (const k in store) delete store[k];
    }),
  };
  const days = {
    toCollection: vi.fn(() => collection),
    put: vi.fn(async (record) => { store[record.name] = record.status; }),
    delete: vi.fn(async (name) => { delete store[name]; }),
  };
  return { default: { days }, __store: store };
});

vi.mock('@kyvg/vue3-notification', () => ({ notify: vi.fn() }));

const { default: db, __store } = await import('@/database');
const { notify } = await import('@kyvg/vue3-notification');

const NOW = '2026-01-15T12:00:00Z'; // Thursday

const mountApp = async () => {
  const wrapper = mountWithI18n(App, { global: { stubs: { notifications: true } } });
  await flushPromises(); // let onMounted's fetchData() resolve
  return wrapper;
};

const btn = (wrapper, text) => wrapper.findAll('button').find((b) => b.text() === text);
const navigation = (wrapper, index) => wrapper.findAll('.navigation')[index]; // 0 = month, 1 = year

const dayCell = (wrapper, day) => wrapper.findAll('.month-day-grid .day')
  .filter((w) => !w.classes().includes('label') && !w.classes().includes('offset'))[day - 1];

beforeEach(() => {
  for (const k in __store) delete __store[k];
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(NOW));
  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('data loading', () => {
  it('populates the month grid from seeded database data on mount', async () => {
    __store['2026-01-10'] = 1;
    __store['2026-01-05'] = -1;
    const wrapper = await mountApp();
    expect(dayCell(wrapper, 10).classes()).toContain('success');
    expect(dayCell(wrapper, 5).classes()).toContain('fail');
  });
});

describe('updateDay', () => {
  it('no-ops when a day already has the clicked status', async () => {
    __store['2026-01-05'] = 1;
    const wrapper = await mountApp();
    await dayCell(wrapper, 5).findAll('button')[0].trigger('click'); // success, already 1
    await flushPromises();
    expect(db.days.put).not.toHaveBeenCalled();
    expect(db.days.delete).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it('marks a day successful, persists it and notifies without an achievement line', async () => {
    __store['2026-01-01'] = 1; // "beginning" already achieved beforehand
    const wrapper = await mountApp();
    await dayCell(wrapper, 5).findAll('button')[0].trigger('click'); // success
    await flushPromises();
    expect(db.days.put).toHaveBeenCalledWith({ name: '2026-01-05', status: 1 });
    expect(dayCell(wrapper, 5).classes()).toContain('success');
    expect(notify).toHaveBeenCalledOnce();
    expect(notify.mock.calls[0][0].text).not.toContain('You earned');
  });

  it('resets a day to undecided by deleting its record, without notifying', async () => {
    __store['2026-01-05'] = 1;
    const wrapper = await mountApp();
    await dayCell(wrapper, 5).findAll('button')[1].trigger('click'); // undo
    await flushPromises();
    expect(db.days.delete).toHaveBeenCalledWith('2026-01-05');
    expect(dayCell(wrapper, 5).classes()).not.toContain('success');
    expect(notify).not.toHaveBeenCalled();
  });

  it('notifies about a newly unlocked achievement when a success crosses its threshold', async () => {
    // 9 non-adjacent successes so no streak-based achievement interferes
    for (const d of [1, 3, 5, 7, 9, 11, 13, 17, 19]) __store[getDate(2026, 1, d)] = 1;
    const wrapper = await mountApp();
    await dayCell(wrapper, 14).findAll('button')[0].trigger('click'); // 10th success
    await flushPromises();
    expect(notify).toHaveBeenCalledOnce();
    expect(notify.mock.calls[0][0].text).toContain('First Ten');
  });

  it('notifies about an achievement unlocked by a fail update, not just a success', async () => {
    // "Strong Defense": a fail immediately preceded by a success and followed by 6 successes.
    // The pattern must end on (fake) today: date-walking functions only ever look backward
    // from "now", so any entry dated after today would be invisible to them.
    __store['2026-01-08'] = 1;
    for (let d = 10; d <= 15; d++) __store[getDate(2026, 1, d)] = 1;
    const wrapper = await mountApp();
    await dayCell(wrapper, 9).findAll('button')[2].trigger('click'); // fail, completes the pattern
    await flushPromises();
    expect(db.days.put).toHaveBeenCalledWith({ name: '2026-01-09', status: -1 });
    expect(notify).toHaveBeenCalledOnce();
    expect(notify.mock.calls[0][0].text).toContain('Strong Defense');
  });
});

describe('navigation', () => {
  it('moves to the next/previous month via MonthNavigation buttons', async () => {
    const wrapper = await mountApp();
    await navigation(wrapper, 0).find('button[title^="Next Month"]').trigger('click');
    expect(navigation(wrapper, 0).find('h2').text()).toBe('February 2026');
    await navigation(wrapper, 0).find('button[title^="Previous Month"]').trigger('click');
    await navigation(wrapper, 0).find('button[title^="Previous Month"]').trigger('click');
    expect(navigation(wrapper, 0).find('h2').text()).toBe('December 2025');
  });

  it('moves to the next/previous year via YearNavigation buttons', async () => {
    const wrapper = await mountApp();
    await navigation(wrapper, 1).find('button[title^="Next Year"]').trigger('click');
    expect(navigation(wrapper, 1).find('h2').text()).toBe('2027');
  });

  it('resets to the current month via the reset button after navigating away', async () => {
    const wrapper = await mountApp();
    await navigation(wrapper, 0).find('button[title^="Next Month"]').trigger('click');
    await navigation(wrapper, 0).find('button[title^="Reset"]').trigger('click');
    expect(navigation(wrapper, 0).find('h2').text()).toBe('January 2026');
  });

  it('navigates months and years via keyboard shortcuts', async () => {
    const wrapper = await mountApp();
    await wrapper.trigger('keydown', { key: 'ArrowRight' });
    expect(navigation(wrapper, 0).find('h2').text()).toBe('February 2026');
    await wrapper.trigger('keydown', { key: 'ArrowLeft' });
    expect(navigation(wrapper, 0).find('h2').text()).toBe('January 2026');
    await wrapper.trigger('keydown', { key: 'ArrowRight', ctrlKey: true });
    expect(navigation(wrapper, 1).find('h2').text()).toBe('2027');
    await wrapper.trigger('keydown', { key: 'ArrowLeft', ctrlKey: true });
    expect(navigation(wrapper, 1).find('h2').text()).toBe('2026');
    await wrapper.trigger('keydown', { key: 'ArrowRight' });
    await wrapper.trigger('keydown', { key: 'r' });
    expect(navigation(wrapper, 0).find('h2').text()).toBe('January 2026');
  });
});

describe('export', () => {
  it('downloads the current data as JSON and notifies success', async () => {
    __store['2026-01-05'] = 1;
    const wrapper = await mountApp();

    const realCreateElement = document.createElement.bind(document);
    let createdAnchor;
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = realCreateElement(tag);
      if (tag === 'a') createdAnchor = el;
      return el;
    });
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await btn(wrapper, 'Export Database').trigger('click');

    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    const blob = URL.createObjectURL.mock.calls[0][0];
    expect(await blob.text()).toBe(JSON.stringify({ '2026-01-05': 1 }));
    expect(createdAnchor.download).toBe('backup.json');
    expect(createdAnchor.click).toHaveBeenCalledOnce();
    expect(notify).toHaveBeenCalledOnce();
    expect(notify.mock.calls[0][0].title).toBe('Export successful');
  });
});

describe('import', () => {
  const chooseFile = async (wrapper, file) => {
    await btn(wrapper, 'Import Database').trigger('click');
    await btn(wrapper, 'Yes').trigger('click');
    const input = wrapper.find('input[type=file]');
    Object.defineProperty(input.element, 'files', { value: [file], configurable: true });
    await input.trigger('change');
  };

  it('imports a valid backup file, overwriting the database', async () => {
    vi.useRealTimers(); // FileReader's onload is scheduled asynchronously
    const wrapper = await mountApp();
    const backup = { '2026-02-01': 1, '2026-02-02': -1 };
    const file = new File([JSON.stringify(backup)], 'backup.json', { type: 'application/json' });

    await chooseFile(wrapper, file);
    await vi.waitFor(() => expect(db.days.put).toHaveBeenCalledTimes(2));

    expect(db.days.put).toHaveBeenCalledWith({ name: '2026-02-01', status: 1 });
    expect(db.days.put).toHaveBeenCalledWith({ name: '2026-02-02', status: -1 });
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ title: 'Import successful' }));
  });

  it('rejects a file with the wrong MIME type without touching the database', async () => {
    vi.useRealTimers();
    const wrapper = await mountApp();
    const file = new File(['not json'], 'backup.png', { type: 'image/png' });

    await chooseFile(wrapper, file);
    await vi.waitFor(() => expect(notify).toHaveBeenCalled());

    expect(db.days.put).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ title: 'Import failed' }));
  });

  it('rejects invalid JSON content without touching the database', async () => {
    vi.useRealTimers();
    const wrapper = await mountApp();
    const file = new File(['{not valid json'], 'backup.json', { type: 'application/json' });

    await chooseFile(wrapper, file);
    await vi.waitFor(() => expect(notify).toHaveBeenCalled());

    expect(db.days.put).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ title: 'Import failed' }));
  });

  it('rejects a backup with an invalid key/value shape without touching the database', async () => {
    vi.useRealTimers();
    const wrapper = await mountApp();
    const file = new File([JSON.stringify({ 'not-a-date': 1 })], 'backup.json', { type: 'application/json' });

    await chooseFile(wrapper, file);
    await vi.waitFor(() => expect(notify).toHaveBeenCalled());

    expect(db.days.put).not.toHaveBeenCalled();
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ title: 'Import failed' }));
  });
});

describe('clear database', () => {
  it('wipes all data and notifies success', async () => {
    __store['2026-01-05'] = 1;
    const wrapper = await mountApp();
    await btn(wrapper, 'Clear Database').trigger('click');
    await btn(wrapper, 'Yes').trigger('click');
    await flushPromises();

    expect(db.days.toCollection().delete).toHaveBeenCalledOnce();
    expect(dayCell(wrapper, 5).classes()).not.toContain('success');
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ title: 'Clearing successful' }));
  });
});

describe('unhandled rejections', () => {
  it('notifies a generic database error', async () => {
    await mountApp();
    window.dispatchEvent(new Event('unhandledrejection'));
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ type: 'error', title: 'Something went wrong' }));
  });
});

describe('language switcher', () => {
  it('changes the active locale', async () => {
    const wrapper = await mountApp();
    const select = wrapper.find('#language');
    await select.setValue('de');
    expect(select.element.value).toBe('de');
  });
});

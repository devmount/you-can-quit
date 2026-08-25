import { describe, it, expect } from 'vitest';
import MonthNavigation from '@/components/MonthNavigation.vue';
import { mountWithI18n } from '../helpers/mount.js';

describe('MonthNavigation', () => {
  it('renders the month name and year', () => {
    const wrapper = mountWithI18n(MonthNavigation, { props: { date: { month: 1, year: 2026 } } });
    expect(wrapper.find('h2').text()).toBe('January 2026');
  });

  it('emits previous, change and next on the respective button clicks', async () => {
    const wrapper = mountWithI18n(MonthNavigation, { props: { date: { month: 6, year: 2026 } } });
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');
    await buttons[1].trigger('click');
    await buttons[2].trigger('click');
    expect(wrapper.emitted('previous')).toHaveLength(1);
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect(wrapper.emitted('next')).toHaveLength(1);
  });
});

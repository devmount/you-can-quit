import { describe, it, expect } from 'vitest';
import DayLegend from '@/components/info/DayLegend.vue';
import { mountWithI18n } from '../../helpers/mount.js';

describe('DayLegend', () => {
  it('renders the legend title and all four day-status labels', () => {
    const wrapper = mountWithI18n(DayLegend);
    const text = wrapper.text();
    expect(text).toContain('Legend');
    expect(text).toContain('Today');
    expect(text).toContain('Successful day');
    expect(text).toContain('Undecided day');
    expect(text).toContain('Failed day');
  });
});

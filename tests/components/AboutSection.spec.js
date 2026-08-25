import { describe, it, expect } from 'vitest';
import AboutSection from '@/components/AboutSection.vue';
import { mountWithI18n } from '../helpers/mount.js';

describe('AboutSection', () => {
  it('renders the about title and both explanatory sections', () => {
    const wrapper = mountWithI18n(AboutSection);
    const text = wrapper.text();
    expect(text).toContain('About this app');
    expect(text).toContain('What is this?');
    expect(text).toContain('How does it work?');
  });
});

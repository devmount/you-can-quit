import { describe, it, expect, vi } from 'vitest';
import AdminSection from '@/components/AdminSection.vue';
import { mountWithI18n } from '../helpers/mount.js';

const btn = (wrapper, text) => wrapper.findAll('button').find((b) => b.text() === text);

describe('AdminSection', () => {
  it('initially shows the export/import/clear buttons and no confirm rows', () => {
    const wrapper = mountWithI18n(AdminSection);
    expect(btn(wrapper, 'Export Database')).toBeTruthy();
    expect(btn(wrapper, 'Import Database')).toBeTruthy();
    expect(btn(wrapper, 'Clear Database')).toBeTruthy();
    expect(wrapper.text()).not.toContain('Really Overwrite Data?');
    expect(wrapper.text()).not.toContain('Really Remove Data?');
  });

  it('emits export immediately, without any confirm step', async () => {
    const wrapper = mountWithI18n(AdminSection);
    await btn(wrapper, 'Export Database').trigger('click');
    expect(wrapper.emitted('export')).toHaveLength(1);
  });

  describe('import flow', () => {
    it('reveals a confirm row without emitting', async () => {
      const wrapper = mountWithI18n(AdminSection);
      await btn(wrapper, 'Import Database').trigger('click');
      expect(wrapper.text()).toContain('Really Overwrite Data?');
      expect(wrapper.emitted('import')).toBeUndefined();
    });

    it('cancels back to the initial state on "No"', async () => {
      const wrapper = mountWithI18n(AdminSection);
      await btn(wrapper, 'Import Database').trigger('click');
      await btn(wrapper, 'No').trigger('click');
      expect(wrapper.text()).not.toContain('Really Overwrite Data?');
      expect(btn(wrapper, 'Import Database')).toBeTruthy();
      expect(wrapper.emitted('import')).toBeUndefined();
    });

    it('clicks the hidden file input on "Yes", without emitting yet', async () => {
      const wrapper = mountWithI18n(AdminSection);
      const input = wrapper.find('input[type=file]');
      const clickSpy = vi.spyOn(input.element, 'click');
      await btn(wrapper, 'Import Database').trigger('click');
      await btn(wrapper, 'Yes').trigger('click');
      expect(clickSpy).toHaveBeenCalledOnce();
      expect(wrapper.emitted('import')).toBeUndefined();
      // the confirm row only closes once a file is actually chosen (the input's change event)
      expect(wrapper.text()).toContain('Really Overwrite Data?');
    });

    it('emits import with the file input element once a file is chosen, and closes the confirm row', async () => {
      const wrapper = mountWithI18n(AdminSection);
      await btn(wrapper, 'Import Database').trigger('click');
      const input = wrapper.find('input[type=file]');
      await input.trigger('change');
      expect(wrapper.emitted('import')).toEqual([[input.element]]);
      expect(wrapper.text()).not.toContain('Really Overwrite Data?');
    });
  });

  describe('clear flow', () => {
    it('reveals a confirm row without emitting', async () => {
      const wrapper = mountWithI18n(AdminSection);
      await btn(wrapper, 'Clear Database').trigger('click');
      expect(wrapper.text()).toContain('Really Remove Data?');
      expect(wrapper.emitted('clear')).toBeUndefined();
    });

    it('cancels back to the initial state on "No"', async () => {
      const wrapper = mountWithI18n(AdminSection);
      await btn(wrapper, 'Clear Database').trigger('click');
      await btn(wrapper, 'No').trigger('click');
      expect(wrapper.text()).not.toContain('Really Remove Data?');
      expect(wrapper.emitted('clear')).toBeUndefined();
    });

    it('emits clear and closes the confirm row on "Yes"', async () => {
      const wrapper = mountWithI18n(AdminSection);
      await btn(wrapper, 'Clear Database').trigger('click');
      await btn(wrapper, 'Yes').trigger('click');
      expect(wrapper.emitted('clear')).toHaveLength(1);
      expect(wrapper.text()).not.toContain('Really Remove Data?');
    });
  });
});

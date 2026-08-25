import { mount } from '@vue/test-utils';
import { createTestI18n } from './i18n.js';

// every component uses useI18n(), so wire up a fresh i18n instance per mount;
// 'version' is provided since App.vue injects it (harmless for other components)
export const mountWithI18n = (component, options = {}) => {
  const { global: globalOpts = {}, ...rest } = options;
  return mount(component, {
    ...rest,
    global: {
      plugins: [createTestI18n()],
      provide: { version: 'test' },
      ...globalOpts,
    },
  });
};

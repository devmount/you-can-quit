import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';

// factory, not a shared singleton: some tests (e.g. App.vue's language
// switcher) mutate the locale, which must not leak into other tests
export const createTestI18n = (locale = 'en') => createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: { en },
});

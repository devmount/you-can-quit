import { createI18n } from 'vue-i18n';
import de from '@/locales/de.json';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import it from '@/locales/it.json';
import ptbr from '@/locales/pt-br.json';

// factory, not a shared singleton: some tests (e.g. App.vue's language
// switcher) mutate the locale, which must not leak into other tests
export const createTestI18n = (locale = 'en') => createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages: { de, en, fr, it, 'pt-BR': ptbr },
});

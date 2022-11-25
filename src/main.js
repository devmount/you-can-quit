// init app
import { createApp } from 'vue';
import App from '@/App.vue';
const app = createApp(App);

// service worker
import '@/registerServiceWorker';

// FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faTimes,
  faPlus,
  faCircle,
  faChevronRight,
  faChevronUp,
  faChevronLeft,
  faChevronDown,
  faDotCircle,
  faUndoAlt,
  faAngleUp,
  faAngleDoubleUp,
  faCheck,
  faSignOutAlt,
  faTachometerAlt,
  faGraduationCap,
  faBroom,
  faDiceSix,
  faUmbrellaBeach,
  faMonument,
  faTrophy,
  faShieldAlt,
  faChurch,
  faChartLine,
  faAward,
  faNewspaper,
  faBowlingBall,
  faLeaf,
  faGrinTongueWink,
  faTasks,
  faDumbbell,
  faHandSpock,
  faInfoCircle,
  faShoePrints
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faGithub,
  faDev
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(
  faTimes,
  faPlus,
  faCircle,
  faChevronRight,
  faChevronUp,
  faChevronLeft,
  faChevronDown,
  faDotCircle,
  faUndoAlt,
  faAngleUp,
  faAngleDoubleUp,
  faCheck,
  faSignOutAlt,
  faTachometerAlt,
  faGraduationCap,
  faBroom,
  faDiceSix,
  faUmbrellaBeach,
  faMonument,
  faTrophy,
  faShieldAlt,
  faChurch,
  faChartLine,
  faAward,
  faNewspaper,
  faBowlingBall,
  faLeaf,
  faGrinTongueWink,
  faTasks,
  faDumbbell,
  faHandSpock,
  faInfoCircle,
  faShoePrints,
  faTwitter,
  faGithub,
  faDev
);
app.component('font-awesome-icon', FontAwesomeIcon);

// Vue Notifications
import Notifications from 'vue-notification';
app.use(Notifications)

// global mixin
app.mixin({
  computed: {
		// static language list of existing translations
		languages: () => ({
			'de': 'Deutsch',
			'en': 'English',
			'fr': 'Francais',
      'it': 'Italiano',
      'pt-br': 'Português (brasileiro)'
    }),
  }
})

// Vue i18n
import { createI18n } from 'vue-i18n';
const i18n = createI18n({
  locale: navigator.language || navigator.userLanguage,
  fallbackLocale: 'en',
  messages: {
    'en': require('./locales/en.json'),
    'de': require('./locales/de.json'),
    'fr': require('./locales/fr.json'),
    'it': require('./locales/it.json'),
    'pt-br': require('./locales/pt-br.json'),
  }
});
app.use(i18n);

// set global properties
app.provide('version', process.env.VUE_APP_VERSION);

// ready? let's go!
app.mount('#app');

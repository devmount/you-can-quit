// Vue
import Vue from 'vue'
import App from './App.vue'

// service worker
import './registerServiceWorker'

// FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
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
} from '@fortawesome/free-solid-svg-icons'
import {
  faTwitter,
  faGithub,
  faDev
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
)
Vue.component('font-awesome-icon', FontAwesomeIcon)
// Vue Notifications
import Notifications from 'vue-notification'
Vue.use(Notifications)
// Vue i18n
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: navigator.language.substring(0, 2),
  fallbackLocale: 'en',
  messages: {
    "en": require("./locales/en.json"),
    "de": require("./locales/de.json"),
  }
})

// turns off the 'You are running Vue in development mode.' msg
Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')

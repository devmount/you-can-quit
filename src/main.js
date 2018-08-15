// Vue Js
import Vue from 'vue'
import App from './App.vue'
// Firestore
import VueFirestore from 'vue-firestore'
Vue.use(VueFirestore)
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
  faAward
} from '@fortawesome/free-solid-svg-icons'
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
  faAward
)
Vue.component('font-awesome-icon', FontAwesomeIcon)
// Vue Shortkey
Vue.use(require('vue-shortkey'))
// Vue Notifications
import Notifications from 'vue-notification'
Vue.use(Notifications)

// turns off the 'You are running Vue in development mode.' msg
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
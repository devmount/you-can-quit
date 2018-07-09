// Vue Js
import Vue from 'vue'
import App from './App.vue'
// Firestore
import VueFirestore from 'vue-firestore'
Vue.use(VueFirestore)
// FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faPlus, faCircle, faChevronRight, faCaretUp, faChevronLeft, faCaretDown, faDotCircle, faUndoAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTimes, faPlus, faCircle, faChevronRight, faCaretUp, faChevronLeft, faCaretDown, faDotCircle, faUndoAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// turns off the 'You are running Vue in development mode.' msg
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
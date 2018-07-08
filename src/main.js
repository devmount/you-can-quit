// Vue Js
import Vue from 'vue'
import App from './App.vue'
// Firestore
import VueFirestore from 'vue-firestore'
Vue.use(VueFirestore)
// Bootstrap
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faPlus, faCircle, faCaretRight, faCaretUp, faCaretLeft, faCaretDown, faDotCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTimes, faPlus, faCircle, faCaretRight, faCaretUp, faCaretLeft, faCaretDown, faDotCircle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// turns off the 'You are running Vue in development mode.' msg
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
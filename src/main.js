import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router'
import lodash from 'lodash'
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import common from '@/components/common/'
import 'font-awesome/css/font-awesome.css'
import utils from './utils'
import './filter/'

Vue.use(common)
Vue.use(ElementUI)

Vue.http = Vue.prototype.$http = axios
Vue.utils = Vue.prototype.$utils = utils
Vue._ = Vue.prototype.$_ = lodash
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

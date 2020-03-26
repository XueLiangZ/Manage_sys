import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

import './assets/css/global.css'

// import axios from './API/interceptor.js'
// Vue.prototype.$http = axios;


//请求接口api导入
import API from './API/API.js'



Vue.prototype.$http = API;





Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

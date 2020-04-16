import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '../src/assets/css/global.css'
// 导入icon样式表
import '../src/assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

//导入axios
import axios from 'axios'
//axios的感觉不是很懂,配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  console.log(config);
  config.headers.Authorization  = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config;
})
//挂载axios，从而每个组件都可以通过this.$http使用axios请求
Vue.prototype.$http = axios;

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

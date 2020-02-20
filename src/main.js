import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '../src/assets/css/global.css'
// 导入icon样式表
import '../src/assets/fonts/iconfont.css'

//导入axios
import axios from 'axios'
//axios的感觉不是很懂,配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//挂载axios，从而每个组件都可以通过this.$http使用axios请求
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

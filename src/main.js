import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '../src/assets/css/global.css'
// 导入icon样式表
import '../src/assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//引入另一个互文本编辑器
 

// 导入互文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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

// 将互文本编辑器注册文全局使用
Vue.use(VueQuillEditor)

// 全局过滤器
Vue.filter('dataFarmat',function(originVal){
  const dt =new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

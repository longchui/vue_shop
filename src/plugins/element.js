import Vue from 'vue'
import { Message ,Button ,Form, FormItem ,Input} from 'element-ui'



Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//导入弹框提示,它的使用需要全局挂载
Vue.prototype.$message=Message


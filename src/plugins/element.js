import Vue from 'vue'
import { Message,
         Button ,
         Form, 
         FormItem ,
         Input, 
         Container , 
         Main , 
         Aside , 
         Header,
         Menu,
         Submenu,
         MenuItemGroup,
         MenuItem,
         BreadcrumbItem,
         Breadcrumb,
         Card,
         Row,
         Col,
         TableColumn,
         Table,
         Switch,
         Tooltip,
         Pagination,
         Dialog,
         MessageBox,
         
        } from 'element-ui'



Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container )
Vue.use(Main)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)



//导入弹框提示,它的使用需要全局挂载
Vue.prototype.$message=Message
Vue.prototype.$confirm = MessageBox.confirm


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
         Tag,
         Tree,
         Cascader,
         Alert,
         Tabs,
         TabPane,
         Steps,
         Step,
         CheckboxGroup,
         Checkbox,
         Upload,
        
         
         
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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)





//导入弹框提示,它的使用需要全局挂载
Vue.prototype.$message=Message
Vue.prototype.$confirm = MessageBox.confirm


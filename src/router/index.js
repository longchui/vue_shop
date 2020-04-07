import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/User/User.vue'


Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
    //redirect:访问的是/，重新定向到/login 
  },
  {
    path:'/login',
    component:login
  },
  {path:'/home',
   component:Home,
   redirect:'/welcome',
   children:[
     { path: '/welcome', component: Welcome},
     { path: '/users', component: User}
   ]
  }
  
]

const router = new VueRouter({
  routes
}) 

/*挂载一个路由导航守卫
  目的是为当有人直接通过url访问到home后台时
  直接将他跳转到login登录页
 */
router.beforeEach((to , from , next)=>{
  //to:router即将进入的路由对象
  //from：当前导航正要离开的路由
  //next:一个函数，执行效果依赖,表示方行
  //其中 next（）：方行  next('/login):表示强制跳转
  
  //如果访问的是login，直接放行
  if(to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()

})


export default router

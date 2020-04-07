<!-- home主界面 -->
<template>
  
  
    
   
  <el-container class="home-container">
    <!-- 主体部分 -->
   <el-header> 
     <div>
       <img src="../assets/logo.png" alt="">
       <span>电商后台管理系统</span>
     </div> 
     <el-button type='info' @click="logout">退出</el-button></el-header>
     
   <el-container>

     <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px': '200px' " >
      <!-- 折叠区域 -->
    <div class="toggle-button" @click="toggleCollaps"> | | |</div>

      <!-- 侧边栏菜单区 active-text-color:激活文字颜色 -->
      <el-menu background-color="#333744" text-color="#fff" active-text-color="#ff4356"
      unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true"
      :default-active="activePath">
        <!-- 一级菜单 -->
        <!-- 绑定index，使每一个一级菜单都不一样 -->
      <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
        <!-- 一级菜单的模板区 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

        <!-- 二级菜单 -->
        <el-menu-item :index=" '/'+subItem.path " v-for="subItem in item.children" 
        :key="subItem.id" @click="saveNavState('/'+subItem.path)">
          <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
      
    </el-menu>
    </el-aside>
    <!-- 侧边主体部分 -->
    <el-main>
      <!-- welcome -->
      <router-view></router-view>
    </el-main>
    </el-container>
 </el-container>

</template>

<script>
export default {
  data(){
    return{
      // 左侧菜单数据
      menuList:[],
      //一级菜单的图片对象
      iconObj:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      },
      isCollapse:false,
      //被激活的链接地址
      activePath:''
    }
  },

  //希望在加载时，就显示商品信息，所以创建生命周期函数
  created(){
    this.getMenulist()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods:{
    logout(){
      //1.清空token
      window.sessionStorage.clear()
      //2.回到login页面
      this.$router.push('/login')
    },
    //获取所有的菜单
    async getMenulist()
    {
      // get函数返回的是一个promise。await是简化promise操作
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status!==200) return this.$message.erroe(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    //折叠点击事件
    toggleCollaps(){
      this.isCollapse = ! this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.getItem('activePath',activePath)
      this.activePath = activePath
    }
  }
  
}

</script>
<style lang='less' scoped>
// 给container自定一个属性。使属性撑满全屏
.home-container{
  height: 100%;

}
.el-header{
  background-color:#373d4e;
  // 想让左右分别对齐，所以使用flex属性 
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  // 使按钮居中
  align-items: center;
  color: #fff;
  font-size: 20px;

  // 这个属于嵌套布局，使左侧的div在此flex
  > div{
    display: flex;
    align-items: center;
  }
  span{
    margin-left: 15px;
  }

}
.el-aside{
  background-color: #333744;

  // 使右边边框对齐
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #c1c3ca
}

//  为了图标和文本间距
.iconfont{
  margin-right: 10px;
}

//折叠样式
.toggle-button{
  background-color: #4A5046;
  font-size: 10px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  // 三条线增加距离
  letter-spacing: 0.2em;
  //鼠标放上去时变成一只小手
  cursor: pointer;
}
</style>
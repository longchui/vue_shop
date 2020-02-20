<!-- home主界面 -->
<template>
  <div>
    <!-- 退出按钮 -->
    <el-button type='info' @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods:{
    logout(){
      //1.清空token
      window.sessionStorage.clear()
      //2.回到login页面
      this.$router.push('/login')

    }
  }
  
}

</script>
<style lang='less' scoped>
</style>
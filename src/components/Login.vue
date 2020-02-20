<!-- login组件 -->
<template>
  <div class = "login_container">
    <div class="login_box">
      <!-- 放头像的盒子 -->
      <div class="avatar_box"> 
        <img src="../assets/touxiang.jpg" alt="">
      </div>
      <!-- 登录表单区 -->
      <div>
        <!-- ref相当于返回dom对象，使用ref为了得到表单，实现重置按钮 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form" >
          <!-- 上面的:rules="rules":是表单验证 -->
          <!-- username -->
           <el-form-item prop="username" >
           <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" >
           </el-input>
           </el-form-item>

           <!-- password -->
           <el-form-item prop="password">
           <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"
           type="password">
           <!-- type="password":表明这是一个密码框 -->
           </el-input>
           </el-form-item>

           <!-- button -->
           <el-form-item class='btns'>
               <el-button type="primary" @click="login">登录</el-button>
               <el-button type="danger" @click="resetLoginForm">重置</el-button>
           </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      //登录表单的绑定对象
      loginForm:{
        username:'admin',
        password:'123456'
      },
      
      //这是表单的验证规则对象
      loginFormRules: {
          //验证username是否合法
          //requiredtrue：表示当前必填 'trigger':表示触发验证方式是鼠标离开
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          //验证密码是否合法
          password:[
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
          
        }
    }
  },
  methods: {
    // 点击重置按钮，实现重置
    resetLoginForm(){
      // console.log(this)
      // resetFields是ui的一个方法，重置
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async valid=>{
         if(!valid) return;
         //其中post请求方式和login路径都是api文档规定好的
         //必须携带username和password
         //因为result返回的是promise数据，使用await简化promise操作
         //而await只能用在被async修饰的方法中，所以首先需要使用async修饰方法
         const {data:res}=await this.$http.post('login',this.loginForm);
         if(res.meta.status!==200) return this.$message.error('登录失败')
         this.$message.success('登录成功')
         


         //将登录成功后的token，保存到客服端接口的sessionStorage中
         //通过编程试导航跳转到后台主页，路由地址是/home
        //console.log(res)
         window.sessionStorage.setItem('token',res.data.token);
         //编程试导航,跳转到后台页面
         this.$router.push('/home');
      });
    }
  },
}

</script>
<style lang='less' scoped>
  .login_container{
    // background-color: #2b4b6b;
    background: url('../assets/back.png');
    height: 100%;
  }

  .login_box{
    width: 450px;
    height: 300px;
    background: #eee;
    border-radius: 3px;
    // absolute：可以再页面上进行位移
    position: absolute;
    left: 50%;
    top: 50%;
    //向xy移动自身长度的50%，从而达到居中的效果
    transform: translate(-50%,-50%);


    // less语法嵌套
    .avatar_box{
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px rgb(221, 221, 221);
      
      //想position变得可移动，然后向右移动50%，在translate自身的50%（横向移动自身的-50%的距离），再在y轴上移动-50% 
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img{
        width:100%;
        height: 100%;
        //撑满盒子
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    // 右边超出部分回到盒子内
    box-sizing: border-box;
  }

  .btns{
    display: flex;
    justify-content:flex-end;
  }
</style>
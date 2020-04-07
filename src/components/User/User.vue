<!-- 用户列表组件 -->
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片导航区域 -->
      <el-card >
        <!-- 搜索区域 -->
        <el-row :gutter="20">
          <!-- 搜索区 -->
          <el-col :span="7">
            <el-input placeholder="请输入内容" 
            v-model="queryInfo.query" clearable  @clear="getUsersList">
           <!-- @clear事件时清空时返回全部数据 -->
            <!-- queryinfo 是数据绑定搜索的数据,双向绑定数据，实现点击按钮时搜索到已存在的数据 -->
              <el-button slot="append" icon="el-icon-search"
              @click="getUsersList"></el-button>
            </el-input>
          </el-col>
          <!-- 添加按钮区 -->
          <el-col :span="4">
            <!-- 添加用户单击事件 -->
            <el-button type="primary" @click="addDialogVisable = true">添加</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区 -->
        <el-table :data="userlist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" prop="mg_state">
            <!-- 插槽 -->
            <template v-slot="scope">
              <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
              @change="userStateChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180px">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <!--修改按钮-->
              <el-tooltip  effect="dark" content="修改角色" placement="top-start" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" 
                @click = "showEditDialog(scope.row.id)"></el-button>
              </el-tooltip>
              
              <!--  刪除按鈕  -->
              <el-tooltip  effect="dark" content="删除角色" placement="top-start" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              </el-tooltip>
              
              <!--分配按钮  -->
              <el-tooltip  effect="dark" content="分配角色" placement="top-start" :enterable="false">
               <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
              
                
              
            </template>
          </el-table-column>
          
        </el-table>

        <!-- 分页区 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisable"
        width="50%" 
        @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addFrom"  :rules="addFromRules" ref="addFromRef" label-width="70px" >
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="username" >
          <el-input v-model="addFrom.username" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password" >
          <el-input type="password" v-model="addFrom.password" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email" >
          <el-input  v-model="addFrom.email" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 电话 -->
          <el-form-item label="电话" prop="mobile" >
          <el-input  v-model="addFrom.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"  @close="editDialogClosed">
        <!-- 主体区 -->
          <el-form :model="editFrom"  :rules="editFromRules" ref="editFromRef" label-width="70px" >
          <!-- 用户名 -->
          <el-form-item label="用户名" >
          <el-input v-model="editFrom.username" autocomplete="off" disabled></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email" >
          <el-input  v-model="editFrom.email" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 电话 -->
          <el-form-item label="电话" prop="mobile" >
          <el-input  v-model="editFrom.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="idetUserInfo">取 消</el-button>
          <el-button type="primary" @click="idetUserInfo">确 定</el-button>
        </span>
      </el-dialog>
  
  
  </div>
</template>

<script>
export default {
  data()
  {
  // 添加用户邮箱和电话的校验规则
  var checkMail = (rule,value,cal)=>{
    
  }


  var checkMobile = (rule,value,cal)=>{}

    return{
      // 获取用户列表的参数对象
      queryInfo:{
        query:'',
        // 当前页数
        pagenum:1,
        //当前每页显示多少条数据
        pagesize:2

      },
      userlist:{},
      total:0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisable:false,
      // 添加用户的表单数据
      addFrom:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      // 添加表单的验证规则对象
      addFromRules:{
       username:[
         {required:true, message:'请输入用户名',trigger:'blur'},
         {min:3,max:10,message:'用户名长度在3-10的字符之间',trigger:'blur'}
       ],

       password:[
         {required:true, message:'请输入密码',trigger:'blur'},
         {min:6,max:15,message:'用密码长度在6-15的字符之间',trigger:'blur'}
       ],
       email:[
         {required:true, message:'请输入邮箱',trigger:'blur'},
       ],
       mobile:[
         {required:true, message:'请输入电话',trigger:'blur'},
       ]
       
      },
      // 这是修改用户对话框的显示与隐藏
      editDialogVisible:false,
      //查询到的用户信息对象
      editFrom:{} ,
      // 修改用户信息的电话和邮件的校验规则
      editFromRules:{
         email:[
         {required:true, message:'请输入邮箱',trigger:'blur'},
       ],
       mobile:[
         {required:true, message:'请输入电话',trigger:'blur'},
       ]
      }
    }
    
  },
  created() {
    this.getUsersList()
  },
  methods: {
    async getUsersList(){
      const {data:res} = await this.$http.get('users',{params:this.queryInfo})
      if(res.meta.status !== 200) return this.$message.error('获取用户列表失败 失败!')
      this.userlist = res.data.users
      this.total = res.data.total 
    },
    // 监听pagination改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 页码值发生切换
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    // 监听swith开关的改变 
    async userStateChange(userinfo){
      console.log(userinfo);
      const {data:res} = await this.$http.put('users/${userinfo.id}/state/${userinfo.mg_state}')
      if(res.meta.status !== 200){
        userinfo.mg_state != userinfo.mg_state;
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户转态成功！')
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFromRef.resetFields()
    },

    // 点击按钮，添加新用户
    addUser(){
       this.$refs.addFromRef.validate( async valid => {
         if(!valid) return
        //  可以发起添加用户的网络请求
        const {data:res} = await this.$http.post('users',this.addFrom)
         if(res.meta.status !== 201){
          this.$message.error('添加用户失败!')
         }
         this.$message.success('添加用户成功！')
        //  隐藏对话框(我也没搞清楚为什么有这一步)
        this.addDialogVisable=false
        // 重新刷新列表
        this.getUsersList();
       })
    },

    // 修改角色事件
   async showEditDialog(id){
      const {data:res} = await this.$http.get('users/'+id)
      if(res.meta.status !== 200){
         this.$message.error('查询用户信息失败！')
      }
      this.editFrom = res.data
      this.editDialogVisible = true
      
      
    },

    // 修改用户对话框确定后重置按钮
    editDialogClosed(){
      this.$refs.editFromRef.resetFields()
    },

    // 
    idetUserInfo(){
    this.$refs.editFromRef.validate(async valid=>{
      // console.log(valid);
      if(! valid) return 
      const {data:res} = await this.$http.put('users/'+ this.editFrom.id,{
        email:this.editFrom.email, 
        mobile:this.editFrom.mobile
      })
      if(res.meta.status !==200){
        return this.$message.error('更新用户失败！')
      }
      // 关闭对话框
      this.editDialogVisible = false
      // 刷新用户列表
      this.getUsersList()
      // 提示用户更新成功
      this.$message.success("更新用户成功！")
    })
    },

    // 根据id删除对应的用户信息
    async removeUserById(id){
      // 弹框询问用户是否删除数据
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // console.log(res);
        if(res !== "confirm"){
          return this.$message.info('已经取消操作~！')
        }
        console.log("确认了删除");
        const {data:del} = await this.$http.delete('users/'+id)
        if(del.meta.status !==200){
          return this.$message.error('删除用户失败！')
        }
        this.$message.success('删除用户成功！')
        this.getUsersList()
        
        
    }
  },
 
}

</script>
<style lang='less' scoped>
</style>
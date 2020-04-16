<!-- 角色列表组件 -->
<template>
<div>
  <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
     <el-card>
       <!-- 添加角色按钮区 -->
       <el-row>
         <el-col>
           <el-button type="primary">添加角色</el-button>
         </el-col>
       </el-row>

       <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
           <el-row :class="['bdbottom',i1 === 0 ? 'bdtop':'','vcenter']" 
           v-for="(item1,i1) in scope.row.children " :key="item1.id">
             <!-- 渲染一级权限 -->
             <el-col :span="5">
               <el-tag  closable @close="removeRightById(scope.row,item1.id)">
                 {{item1.authName}}
               </el-tag>
               <i class="el-icon-caret-right"></i>
             </el-col>

             <!-- 渲染二级和三级权限 -->
             <el-col :span="19">
               <!-- 通过for循环渲染所有的二级权限 -->
               <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                 <!-- 二级权限 -->
                 <el-col :span="6">
                   <el-tag type="success"
                    closable @close="removeRightById(scope.row,item2.id)">
                   {{item2.authName}}
                   </el-tag>
                    <i class="el-icon-caret-right"></i>
                 </el-col>
                 <!-- 三级权限 -->
                 <el-col :span="18" >
                   <el-tag type="warning"
                    v-for="(item3) in item2.children" :key=item3.id
                    closable @close="removeRightById(scope.row,item3.id)">
                     {{item3.authName}}
                   </el-tag>
                 </el-col>
               </el-row>
             </el-col>
             
           </el-row>
            <!-- <pre> {{scope.row}}</pre> -->
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px" >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit ">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete ">删除</el-button>

            <el-button size="mini" type="warning" icon="el-icon-setting " @click="showSetRightTag(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
     </el-card>


     <!-- 分配权限的对话框 -->
      <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox
      ndoe-key="id" default-expand-all :default-checked-keys="defkeys">

      </el-tree>

      <span slot="footer" class="dialog-footer">
      <el-button @click="setRightDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
      </span>
      </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    // 所有觉得列表数据
    return {
      rolelist:[],
      // 控制分配权限的对话框的显示与隐藏
      setRightDialogVisible:false,
      // 所有权限的数据
      rightsList:[],
      // 树形控件的属性绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      // 默认选定的结果id值数组
      defkeys:[]
    };
  },
  created(){
    this.getRoleList()
  },

  methods: {
    // 获取所有角色的列表
    async getRoleList(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
        return this.$message.error("获取角色信息失败！")
      }
      this.rolelist = res.data
      // console.log(this.rolelist);
      
    },

    // 根据id删除对应的权限
    async removeRightById(role,rightId){
      // 弹框提示用户是否要删除权限
     const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(confirmResult !== 'confirm'){
          return this.$message.info('取消了此次操作！')
        }
        // console.log("确认了删除！");
        // 删除操作
        const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        
        if(res.meta.status !== 200){
          return this.$message.error("删除权限失败！")
        }
        // this.getRoleList()
        role.children =res.data
    },

    // 权限分配设置按钮
    async showSetRightTag(role){
      //获取所有权限的数据 
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200){
        return this.$message.error("获取权限信息失败！")
      }
      // 吧获取到的权限数据保存到rightsList中
      this.rightsList = res.data
      // console.log(this.rightsList);
      
      // 通过递归将当前节点的属性
      this.getLeafKeys(role,this.defkeys)

      this.setRightDialogVisible = true
    },

    // 通过递归的形式获取角色下所有三级权限的id
    // 并保存到数组中
    getLeafKeys(node,arr){
      // 如果当前node节点不包含children属性，那就是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item =>
      this.getLeafKeys(item,arr))
    }
  }
}

</script>
<style lang='less' scoped>
.el-tag{
  margin:7px;

}

.bdtop{
  border-top: 1px solid #eee;
}

.bdbottom{
   border-bottom: 1px solid #eee;
}

// 使列表区域区中
.vcenter{
  display: flex;
  align-items: center;
}
</style>
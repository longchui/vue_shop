<!-- 分类参数 -->
<template>
  <div>
<!-- 面包屑导航 -->
 <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
 </el-breadcrumb>

 <!-- 卡片视图 -->
 <el-card>
  <!-- 头部警告区域 -->
  <el-alert show-icon closeable="false" 
    title="注意！只允许第三季分类设置参数"
    type="warning">
  </el-alert>

  <!-- 选中商品分类区 -->
  <el-row class="cat_pat">
    <el-col>
      <span>选中商品分类： </span>
      <!-- 选中商品分类的级联选者框 -->
      <el-cascader 
        v-model="selctedCateKsys"
        :options="cateList"
        :props="cateProps"
        expand-trigger="hover"
        @change="handleChange">
    </el-cascader>
    </el-col>
  </el-row>

  <!-- tab页签区域 -->
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <!-- 添加动态参数的面板 -->
    <el-tab-pane label="动态参数" name="many">
      <el-button type="primary" size="mini"
      :disabled="isBtnDisabled" @click="adddialogVisible = true">
      添加参数</el-button>
      <!-- 动态参数表格 -->
      <el-table :data='manyTableData' border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand"></el-table-column>
      <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type='primary' size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type='danger' size="mini" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-tab-pane>
   
    <!-- 添加静态属性的面板 -->
    <el-tab-pane label="静态属性" name="only">
       <el-button type="primary" size="mini"
       :disabled="isBtnDisabled"  @click="adddialogVisible = true">
       添加属性</el-button>
        <!--静态态参数表格 -->
      <el-table :data='onlyTableDate' border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand"></el-table-column>
      <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type='primary' size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type='danger' size="mini" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-tab-pane>
  </el-tabs>
 </el-card>

 <!-- 添加参数的对话框 -->
 <el-dialog
  :title="'添加'+titleText"
  :visible.sync="adddialogVisible"
  width="50%">
 <!-- 添加参数的对话框 -->
 <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" 
 label-width="100px" @close="addDialogClosed" >
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addFrom.attr_name"></el-input>
  </el-form-item>
 </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adddialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类列表
      cateList:[],
      // 级联选择框的配置对象
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 级联选择框双向绑定到的数组
      selctedCateKsys:[],
      // 被激活的页签的名称
      activeName:'many',
      // 动态参数的数据
      manyTableData:[],
      // 静态参数的数据
      onlyTableDate:[],
      // 控制添加对话框的显示与隐藏
      adddialogVisible:false,
      // 添加数据的表单对象
      addFrom:{},
      // 添加表单的验证规则
      addFromRules:{
        attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
      }
    };
  },

  created(){
    this.getCateList()
  },

  computed: {
    // 如果按钮需要被警用，返回true
    isBtnDisabled(){
      if(this.selctedCateKsys.length !== 3){
        return true
      }
      return false
    },
    
    // 当前选中的三级分类的id
    cateId(){
      if(this.selctedCateKsys.length === 3){
        return this.selctedCateKsys[2]
      }
      return null
    },
    //动态计算标题的文本 
    titleText(){
      if(this.activeName = 'only'){
        return '动态参数'
      }
      return '静态属性'
    }
  },

  methods: {
    // 获取所有的商品分类列表
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200){
        return this.$message.error('获取商品分类失败！')
       }
    this.cateList = res.data
    // console.log(this.cateList);
    },

    // 级联选择框变化，会触发这个函数
    handleChange(){
      this.getParamsDate()
    },

    // tab页签点击事件的处理函数
    handleTabClick(){
      this.getParamsDate()
    },

    // 获取参数的列表数据
    async getParamsDate(){
      // 说明你选中的不是三级分类
      if(this.selctedCateKsys.length !== 3){
        this.selctedCateKsys = []
        return
      }


      // 根据所选分类的id和当前所处的面板，获取对应的参数
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,
      {params:{sel : this.activeName}})
      
      if(res.meta.status !== 200){
        return this.$message.error("获取失败！")
      }
      console.log(res.data);
     //判定获取的数据是动态的还是静态的 
      if(this.activeName = "many"){
        this.manyTableData = res.data
      }else{
        this.onlyTableDate = res.data
      }

      
    },
    // 监听添加对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFromRef.resetFileds()
    }
  },
}
</script>

<style lang='less' scoped>
  .cat_pat{
    margin: 15px 0;
  }
</style>
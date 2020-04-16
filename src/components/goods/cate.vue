<!-- 商品页面 -->
<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 添加按钮的对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        width="50%" @close="addCateDialogClosed">
       <!-- 内容 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" 
      ref="addCateFormRef" label-width="100px" >
      <el-form-item label="分类名称" prop="cate_name" >
      <el-input v-model="addCateForm.cate_name"></el-input>
      </el-form-item>
      <el-form-item label="父级名称">
        <!-- options是用来绑定数据源的 -->
        <!-- props用来指定配置对象 -->
          <el-cascader
          expand-trigger="hover"
          class="el-cascader-menu"
          v-model="selectksys"
          :options="parentCateList"
          :props="castcardProps"
          clearable change-on-select
          @change="parentCateChange">
          </el-cascader>
      </el-form-item>
      </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>

      <!-- 表格区域 -->
    <tree-table class="terrtable" :data="catelist" :columns="columns"
    :selection-type="false" :expand-type="false"
    show-index index-text="#" border>
    <!-- 第一个模板 是否有效 -->
      <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted === false"
        style="color:lightgreen"></i>
        <i class="el-icon-error" v-else></i>
      </template>
      <!-- 第二个模板，排序 -->
      <template slot="order" slot-scope="scope">
       <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
       <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
       <el-tag size="mini" type="warning" v-else>三级</el-tag>
      </template>
      <!-- 第三个模板，操作 -->
      <template slot="opt" slot-scope="scope">
        <el-button  type="primary" icon="el-icon-edit"  size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
      </template>
    </tree-table>

      <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querinfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="querinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      querinfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      
      // 商品分类的数据列表
      catelist:[],
      // 总数据条数
      total:0,
      // 为table指定列的定义
      columns:[{
        label:'分类名称',
        prop:'cat_name'
      },
      {
        label:'是否有效',
        // 表示将当前列定义为模板列
        type:"template",
        // 表示当前这一列使用的模板名称
        template:'isok'
      },
      {
        label:'排序',
        // 表示将当前列定义为模板列
        type:"template",
        // 表示当前这一列使用的模板名称
        template:'order'
      },
      {
        label:'操作',
        // 表示将当前列定义为模板列
        type:"template",
        // 表示当前这一列使用的模板名称
        template:'opt'
      }],
      // 控制添加分类框的显示与隐藏
      addCateDialogVisible:false,
      // 添加分类的表单数据对象
      addCateForm:{
        // 将要添加的分类的名称
        cate_name:'',
        // 父级分类的名称
        cate_pid:0,
        // 分类的等级，默认为一级
        cate_level:0
      },
      // 添加分类表单的验证规则
      addCateFormRules:{
        cate_name:[
          {required:true, message:'请输入分类名称',trigger:'blur'}
        ]
      },
      // 父级分类的数据列表
      parentCateList:[],
      // 指定级联的配置对象
      castcardProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 选中的父级分类的id数组
      selectksys:[]
    };
  },

  created() {
    this.getCateList()
  },

  methods: {
    // 获取商品分类数据
    async getCateList(){
      const {data:res} = await this.$http.get('categories',{
        params: this.querinfo})
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }

      this.catelist = res.data.result
      this.total = res.data.total 
   
    
      
    
    },
    // 分页处理函数
    handleSizeChange(newSize){
      this.querinfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage){
      this.querinfo.pagenum = newPage
      this.getCateList()
    },

    // 添加商品框的显示
    showAddCate(){
      // 获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },

    // 获取父级分类的数据列表
      async getParentCateList(){
        const {data:res} = await this.$http.get('categories',{
          params: { type : 2}
        })
        if(res.meta.status !== 200){
          return this.$message.error('请求父级失败！')
        }
        console.log(res.data);
        this.parentCateList = res.data
      },
    
    // 选择项发生变化触发这个函数
    parentCateChange(){
      console.log(this.selectksys);
      // 如果这个selectksys 这个数组中的length大于0 证明选中这个父级分类
      if(this.selectksys.length >0 ){
        // 父级分类的id
        this.addCateForm.cate_pid = this.selectksys[this.selectksys.length-1]
        // 为当前分类的等级赋值
        this.addCateForm.cate_level = this.selectksys.length
        return
      }else{
        this.addCateForm.cate_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cate_level = 0
      }
    },

    // 点击按钮添加心得分类
     addCate(){
    this.$refs.addCateFormRef.validate(async valid =>{
      if(!valid) return
      const {data:res} = await this.$http.post('categories',this.addCateForm)
    
      if(res.meta.status !== 201){
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false
    })
      
    },

    //监听对话框的关闭事件，重置表单数据 
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectksys = []
      this.addCateForm.cate_level = 0
      this.addCateForm.cate_pid= 0

  }
  }
}

</script>
<style lang='less' scoped>
.terrtable{
  margin-top: 15px;
}
</style>
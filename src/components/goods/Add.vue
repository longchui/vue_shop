<!-- 添加页面 -->
<template>
  <div>  
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>

    <!-- 警告区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        ceter show-icon :closeable='false'>
      </el-alert>
      <!-- 步骤跳区域 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
      </el-steps>

      <!-- tabs区域 -->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" 
      label-width="100px" label-position="top">
    <el-tabs :tab-position="'left'" v-model="activeIndex"
    :before-leave="beforeTagLeave" @tab-click='tabClicked'>
      <el-tab-pane label="基本信息" name="0">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addFrom.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="addFrom.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="addFrom.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="addFrom.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="good_cat">
            <el-cascader
            expand-trigger="hover"
            v-model="addFrom.goods_cat"
            :options="catelist"
            :props='cateProps'
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane label="商品参数" name="1">
        <!-- 渲染表单的item项 -->
        <el-form-item :label="item.attr_name" 
        v-for="item in manyTableData" 
        :key="item.attr_id" prop="goods_name">
        <!-- 复选框组 -->
        <el-checkbox-group v-model="item.attr_vals">
        <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals"
        :key="i" ></el-checkbox>
        
        </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane label="商品属性" name="2">
        <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
         :key="item.attr_id">
         <el-input v-model="item.attr_vals"></el-input>
         </el-form-item>
      </el-tab-pane>
      
      <el-tab-pane label="商品图片" name="3">
        <!-- action表示图片要上传的地址 -->
        <el-upload
        :action="uploadURL"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        list-type="picture"
        :headers="headerObj"
        :on-success="handleSuccess">
        <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      
      <el-tab-pane label="商品内容" name="4">
        <!-- 互文本编辑器组件 -->
        <quill-editor v-model="addFrom.goods_introduce">
        </quill-editor>
        <!-- 添加商品的按钮 -->
        <el-button type="primary" @click="add" class="btnAdd">添加商品</el-button>
      </el-tab-pane>
 
    </el-tabs>
    </el-form>
    </el-card>
    
    <!-- 图片预览 -->
        <el-dialog
        title="图片预览"
        :visible.sync="previewVisible"
        width="50%">
        
        <img :src="previewPath" alt="" class="preImg">
        </el-dialog>
   

    </div>
</template>

<script>
import _ from 'lodash'


export default {
  data () {
    return {
      activeIndex:'0',
      // 添加商品表单数据对象
      addFrom:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        // 商品所属的分类数组
        goods_cat:[],
        //图片的数组
        pics:[] ,
        // 商品的详情
        goods_introduce:'',
        attrs:[]
        
      },
      addFromRules:{
        goods_name:
          [{required:true,
        message:'请输入商品名称',trigger:'blur'}],
        goods_price:[{required:true,
        message:'请输入商品价格',trigger:'blur'}],
        goods_weight:[{required:true,
        message:'请输入商品重量',trigger:'blur'}],
        goods_number:[{required:true,
        message:'请输入商品数量',trigger:'blur'}],
        goods_cat:[{required:true,
        message:'请选择商品分类',trigger:'blur'}]
      },
      // 商品分类列表
      catelist:[],
      cateProps:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      // 动态参数列表数据
      manyTableData:[],
      // 静态属性列表
      onlyTableData:[],
      // 上传图片的url地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      //图片上传图片组件headers的请求头
      headerObj:{
        Authorization:window.sessionStorage.getItem
        ('token')
      },
      // 预览图片时的路径
      previewPath:'',
      // 隐藏与显示预览图片
      previewVisible:false,
      
      
    };
  },
  created() {
    this.getCateList()
  },
    computed: {
    cateId(){
      if(this.addFrom.goods_cat.length === 3){
        return this.addFrom.goods_cat[2]
      }
      return null 
    }
  },

  

  methods: {
    // 获取所有商品分类数据
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      }

      this.catelist = res.data
      console.log(this.catelist);
      
    
  },

  // 级联选择器选中变化项，会触发这个函数
  handleChange(){
    if(this.addFrom.goods_cat.length !== 3){
      this.addFrom.goods_cat = []
    }

    
  },
  // 
  beforeTagLeave(activeName,oldActiveName){
    // console.log(activeName,oldActiveName);
    if(oldActiveName ==='0' && this.addFrom.goods_cat.length !==3){
      this.$message.error('请先选择商品分类！')
      return false
    }
  },

  // 
  async tabClicked(){
    // 证明访问的是动态参数列表
    if(this.activeIndex === '1'){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params : {sel : 'many'}
      })

       if(res.meta.status !== 200) {
        return this.$message.error('获取动态参数列表失败!')
      }
      // console.log(res.data);
      res.data.forEach(item=>{
       item.attr_vals =  item.attr_vals.length === 0 ?[] 
        : item.attr_vals.split(' ')
      })
      this.manyTableData = res.data 
      
    }
    // 证明访问的静态属性列表
    else if(this.activeIndex === '2'){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
        params : {sel : 'only'}
      })

       if(res.meta.status !== 200) {
        return this.$message.error('获取静态属性数列表失败!')
      }
      // console.log(res.data);
      // res.data.forEach(item=>{
      //  item.attr_vals =  item.attr_vals.length === 0 ?[] 
      //   : item.attr_vals.split(' ')
      // })
      console.log(res.data);
      
      this.onlyTableData = res.data 
      
    }
  },

  // 处理图片预览效果
  handlePreview(file){
     this.previewPath = file.response.data.url
     this.previewVisible = true
  },
  // 处理移除图片的操作
  handleRemove(file){
    // 1.获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
    // 2.从pics数组中找到对应的图片的索引值,其中x代表pics数组中的每一项
      const i = this.addFrom.pics.findIndex(x =>x.pic === filePath)
    // 3，调用数组的splice方法，吧图片信息对象，从pics中删除
      this.addFrom.pics.splice(i,1)
      console.log(this.addFrom);
      

  },
  // 监听图片上传成功的时间
  handleSuccess(response){
    console.log(response);
    // 1.先拼接得到一个图片信息对象
    // 2.将图片信息对象push到pics数组中
    const picInfo = {pic:response.data.tmp_path}
    this.addFrom.pics.push(picInfo)
    console.log(this.addFrom);
    
  },

  // 添加商品1
  add(){
    this.$refs.addFromRef.validate
    (async valid => {
      if(!valid) {
        return this.$message.error('请填写必要的表单项！')
      }
      // 执行添加的业务逻辑
      // 将数组改为字符串
      // lodash clonedeep(obj) 深拷贝
      const from = _.cloneDeep(this.addFrom)
     from.goods_cat = from.goods_cat.join(',')
      
      // 处理动态参数
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id:item.attr_id,
          attr_value:item.attr_vals.join(' ')
        }
        this.addFrom.attrs.push(newInfo)
      })
      // 处理静态属性
      this.onlyTableData.forEach(item => {
        const newInfo = {
          attr_id:item.attr_id,
          attr_value:item.attr_vals
        }
        this.addFrom.attrs.push(newInfo)
      })
      from.attrs = this.addFrom.attrs


      // 发起请求添加商品
      // 商品的名称必须是唯一的
    const {data:res} =  await this.$http.post('goods',from)
    if(res.meta.status !== 201){
      return this.$message.error('添加商品失败！')
    }
    this.$message.success('添加商品成功！')
    this.$router.push('/goods')
    })
  }
},




}

</script>

<style lang='less' scoped>
.preImg{
  width:100%
}

.btnAdd{
  margin-top: 15px;
}
</style>
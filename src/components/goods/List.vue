<!-- 商品列表 -->
<template>
  <div>
  <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

<!-- 卡片视图区域 -->
<el-card>
  <el-row :gutter="20">
    <el-col :span="8">
      <!-- 搜索框 -->
        <el-input placeholder="请输入内容"
         v-model="querryInfo.query" clearable @clear="getGoodsList">
          <el-button slot="append" icon="el-icon-search"  
          @click="getGoodsList"></el-button>
        </el-input>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" @click="goaddPage">添加商品</el-button>
    </el-col>
  </el-row>

  <!-- table表格区域 -->
  <el-table :data="goodslist" border stripe >
   <el-table-column type="index"></el-table-column>
   <el-table-column label="商品名称" prop="goods_name"></el-table-column>
   <el-table-column label="商品价格（元）" prop="goods_price" width="90px"></el-table-column>
   <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
   <el-table-column label="创建时间" prop="add_time" width="150px">
     <template slot-scope="scope">
            {{scope.row.add_time | dataFarmat}}
     </template>
   </el-table-column>
   <el-table-column label="操作" width="180px">
     <template slot-scope="scope">
            <el-button type='primary' size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type='danger' size="mini" 
            icon="el-icon-delete" @click="removeByID(scope.row.goods_id)">删除</el-button>
     </template>
   </el-table-column>
  </el-table>

  <!-- 分页区域 -->
  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="querryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
  </el-pagination>
</el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询参数对象
      querryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      // 商品列表
      goodslist:[],
      // 总数据条数
      total:0
    };
  },
  created() {
    this.getGoodsList()
  },

  computed: {},



  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{params:this.querryInfo})
    
     if(res.meta.status !==200){
       return this.$message.error("获取失败！")
     }
     this.$message.success("获取成功！") 
     this.goodslist = res.data.goods
     this.total = res.data.total
    },
    
    handleSizeChange(newSize){
      this.querryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage){
      this.querryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除按钮
    async removeByID(id){
       const comfirmResult =  await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if(comfirmResult !== 'confirm'){
          return this.$message.info('已取消删除！')
        }

        const {data:res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !== 200){
          return this.$message.error('删除失败！')
        }
        return this.$message.success('删除成功！')
        this.getGoodsList()
    },
   // 添加商品跳转页面
    goaddPage(){
      this.$router.push('/goods/add')
    }

  }
}

</script>
<style lang='less' scoped>
</style>
<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 信息提示 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单 ,该表单贯穿整个tab，因此需要嵌套在外部-->
      <el-form
        :model="Form"
        :rules="FormRules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
      >
        <!-- Tab栏目 -->
        <el-tabs tab-position="left" v-model="activeIndex">
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="Form.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="Form.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="Form.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="Form.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_name">
              <el-cascader
                v-model="cascaderValue"
                :options="categoriesList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">配置管理</el-tab-pane>
          <el-tab-pane name="2" label="商品属性">角色管理</el-tab-pane>
          <el-tab-pane name="3" label="商品图片">定时任务补偿</el-tab-pane>
          <el-tab-pane name="4" label="商品内容">定时任务补偿</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import requests from '@/networks'
export default {
  data() {
    return {
      activeIndex: '0',
      Form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: '',
        attrs: '',
      },
      FormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
      // cascader系列参数
      categoriesList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //cascader被选择value的数组
      cascaderValue:[]
    }
  },
  methods: {
    async getCategories() {
      const { data: res } = await requests({
        url: 'categories',
        method: 'get',
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败！请检查网络是否连接！')
      }
      this.categoriesList = res.data
      console.log(res.data)
    },
    handleChange(){
      if(this.cascaderValue.length!==3){
        this.$message.error("只能选择三级分类")
        this.cascaderValue = []
      }
      // console.log(this.cascaderValue)
    }
  },
  created() {
    this.getCategories()
  },
}
</script>

<style>
.el-card {
  margin-top: 15px;
}
/* 直接审查元素的方式进行获取并修改样式 */
.el-step__title {
  font-size: 15px;
  line-height: 38px;
}
.el-steps {
  margin: 15px;
}
</style>
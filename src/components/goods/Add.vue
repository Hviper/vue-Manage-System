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
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
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
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <el-tag
              v-for="item in tabCategoriesList"
              closable
              @close="handleClose(item)"
              :key="item.attr_id"
              >{{ item.attr_name ? item.attr_name : item }}</el-tag
            >
            <el-input
              style="width: 100px"
              v-if="tabPane1_inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else size="small" @click="showInput"
              >+ New Tag</el-button
            >
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">角色管理</el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <!-- 图片上传组件没有经过axios的网络请求，因此需要补全指定header的请求头信息 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              list-type="picture"
              :headers="headersObj"
              :on-success="onSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
              <quill-editor
    ref="myQuillEditor"
    v-model="content"
    :options="editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
  />
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片展示框 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img class="imgCls" :src="imgUrl" alt="获取失败" />
    </el-dialog>
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
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //cascader被选择value的数组
      cascaderValue: [],
      //tab标签二的列表值
      tabCategoriesList: [],
      tabPane1_inputVisible: false,
      inputValue: '',
      //文件上传
      fileList: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //图片显示
      dialogVisible: false,
      imgUrl: '',

      //内容
      content:'',
      editorOption: {
          // Some Quill options...
        }
    }
  },
  computed: {
    getId() {
      if (this.cascaderValue.length !== 3) {
        return null
      }
      return this.cascaderValue[2]
    },
  },
  methods: {
    //内容区域
    onEditorBlur(){

    },
    onEditorFocus(){

    },
    onEditorReady(){

    },
    onSuccess(response, file) {
      console.log(response)
      console.log(file)
    },
    //图片相关api
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      // console.log(file)
      this.imgUrl = file.response.data.url
      this.dialogVisible = true
    },
    //角色管理
    handleClose(tag) {
      this.tabCategoriesList.splice(this.tabCategoriesList.indexOf(tag), 1)
      //再发起网络请求
    },
    //push操作
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (this.inputValue) {
        console.log(this.inputValue)
        this.tabCategoriesList.push(inputValue)
      }
      this.tabPane1_inputVisible = false
      this.inputValue = ''
    },
    showInput() {
      this.tabPane1_inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async tabClick() {
      // console.log(this.activeIndex)
      if (this.activeIndex == 1) {
        const { data: res } = await requests({
          url: `categories/${this.getId}/attributes`,
          method: 'get',
          params: {
            sel: 'many',
          },
        })
        if (res.meta.status !== 200) {
          this.$message.error('获取动态数据失败，请检查网络是否连接')
        }
        this.tabCategoriesList = res.data
        console.log(res.data)
      }
    },
    beforeLeave(activeName, oldName) {
      if (oldName == 0 && this.cascaderValue.length !== 3) {
        this.$message.error('请选择三级分类列表')
        return false
      }
      return true
    },
    async getCategories() {
      const { data: res } = await requests({
        url: 'categories',
        method: 'get',
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败！请检查网络是否连接！')
      }
      this.categoriesList = res.data
    },
    handleChange() {
      if (this.cascaderValue.length !== 3) {
        this.$message.error('只能选择三级分类')
        this.cascaderValue = []
      }

      // console.log(this.cascaderValue)
    },
  },
  created() {
    this.getCategories()
  },
}
</script>

<style scoped>
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
.el-tag {
  margin: 15px;
}
.imgCls {
  width: 100%;
}
.el-dialog {
  height: 100%;
  width: 100%;

}

</style>
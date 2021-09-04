<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row style="margin-top: -10px">
        <el-col :span="6">
          <el-button type="primary" style="margin-bottom: 10px" @click="addCls"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="CategoriesList"
        stripe
        :columns="columns"
        :selection-type="false"
        :show-index="true"
        :expand-type="false"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" scope="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === true"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>

        <!-- 排序 -->
        <template slot="sort" scope="scope">
          <!-- {{scope.row}}  -->
          <el-tag v-if="scope.row.cat_level == 0">等级一</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level == 1"
            >等级二</el-tag
          >
          <el-tag type="info" v-else>等级三</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" scope="scope">
          <!-- {{scope.row}}  -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页管理-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Categories_params.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="Categories_params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加分类弹窗 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addClassificationDialogVisible"
        width="30%"
        @close="closeAddCls"
      >
        <el-form
          :model="ClassificationForm"
          status-icon
          :rules="rules"
          ref="ClsFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input
              type="text"
              v-model="ClassificationForm.cat_name"
              autocomplete="off"
              :rules="[
                { required: true, message: '输入值不能为空' },
                
              ]"
            ></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- 父级级联选择器 @change="handleChange"-->
            <el-cascader
              v-model="SelectedKeys"
              :options="parentCateList"
              :props="CascaderProps"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addClassificationDialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="submitAddCate()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import requests from '@/networks'
export default {
  data() {
    return {
      addCateForm:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      //父级级联选择器
      parentCateList: [],
      CascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      //选择的keys，因为是多级，选择的保存在一个数组中
      SelectedKeys: [],
      CategoriesList: [],
      total: 0,
      Categories_params: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //显示分类弹窗可见性
      addClassificationDialogVisible: false,

      ClassificationForm: {
        cat_name: '',
        cat_pid: '',
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // prop: 'cat_deleted',
          type: 'template',
          template: 'isok',
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort',
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt',
        },
      ],
    }
  },
  methods: {
    submitAddCate() {
      this.$refs.ClsFormRef.validate(async (valid) => {
        if (valid) {
          this.addCateForm.cat_name = this.ClassificationForm.cat_name
          this,this.addCateForm.cat_level = this.SelectedKeys.length;
          this,this.addCateForm.cat_pid = this.SelectedKeys.length>0?this.SelectedKeys[this.SelectedKeys.length-1]:0;
          //发起请求
          const {data:res} = await requests({
            method: 'POST',
            url: 'categories',
            data: this.addCateForm
          })
          if(res.meta.status!==201){
            return this.$message.error("提交失败，请检查网络是否连接")
          }
          this.getCategoriesList();
          this.$message.success("提交成功")
          this.addClassificationDialogVisible = false
        } else {
          this.$message.error('请填写正确的输入值')
          return false
        }
      })
    },
    //关闭添加分类弹窗
    closeAddCls() {
      //清空form
      this.$refs.ClsFormRef.resetFields()
      //被选择的数组也清空
      this.SelectedKeys = []
    },
    //获取父级分类的
    async getParentCateList() {
      const { data: res } = await requests({
        url: 'categories',
        method: 'get',
        params: {
          type: 2,
        },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('请求失败，请检查网络')
      }
      this.parentCateList = res.data
    },
    addCls() {
      //先获取数据，再展示弹框
      this.getParentCateList()
      this.addClassificationDialogVisible = true
    },
    handleCurrentChange(num) {
      this.Categories_params.pagenum = num
      this.getCategoriesList()
    },
    handleSizeChange(size) {
      this.Categories_params.pagesize = size
      this.getCategoriesList()
    },
    async getCategoriesList() {
      const { data: res } = await requests({
        url: 'categories',
        method: 'get',
        params: this.Categories_params,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败，请检查网络是否连接！')
      }
      this.CategoriesList = res.data.result
      this.total = res.data.total
    },
  },
  created() {
    this.getCategoriesList()
  },
}
</script>

<style scoped>
.el-card {
  margin-top: 10px;
}
.el-cascader {
  width: 100%;
}
</style>
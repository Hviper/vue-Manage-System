<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card style="margin-top: 15px">
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三分类配置相关参数！" type="warning">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="changeKeys"
            :options="CateList"
            :props="props"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="dialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  closable
                  v-for="(value, index) in props.row.attr_vals"
                  :key="index"
                  @close="handleClose(props.row)"
                  >{{ value }}</el-tag
                >
                <!-- 添加tag -->
                <el-input

                  v-if="props.row.inputVisible"
                  v-model="props.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(props.row)"
                  @blur="handleInputConfirm(props.row)"
                >
                </el-input>
                <el-button v-else size="small" @click="showInput(props.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="dialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-tag
                  closable
                  v-for="(value, index) in props.row.attr_vals.split(' ')"
                  :key="index"
                  >{{ value }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editParams(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加弹窗对话框对话框 -->
    <el-dialog
      :title="'添加' + DialogtitleName"
      :visible.sync="dialogVisible"
      width="30%"
      @close="DialogClose"
    >
      <!-- 添加内容表单对话框 -->
      <el-form
        :model="AddForm"
        ref="AddFormRef"
        label-width="100px"
        :rules="AddFormRules"
      >
        <el-form-item :label="DialogtitleName" prop="attr_name">
          <el-input v-model="AddForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑弹窗对话框 -->
    <el-dialog
      :title="'添加' + DialogtitleName"
      :visible.sync="editdialogVisible"
      width="30%"
      @close="editDialogClose"
    >
      <!-- 内容表单 -->
      <el-form
        :model="editForm"
        ref="editFormRef"
        label-width="100px"
        :rules="editFormRules"
      >
        <el-form-item :label="DialogtitleName" prop="attr_name">
          <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import requests from '@/networks'
export default {
  data() {
    var validateParams = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入参数'))
      } else {
        callback()
      }
    }
    return {
      CateList: [],
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      //级联选择器选择value的数组
      changeKeys: [],
      //tab页签默认选择的区域
      activeName: 'many',
      //动态参数列表
      manyTableData: [],
      //静态参数列表
      onlyTableData: [],
      //弹窗可见性
      dialogVisible: false,
      //表单对象
      AddForm: {
        attr_name: '',
      },
      AddFormRules: {
        attr_name: [
          {
            validator: validateParams,
            trigger: 'blur',
          },
        ],
      },
      //edit表单参数
      editForm: {
        attr_name: '',
      },
      editdialogVisible: false,
      editFormRules: {
        attr_name: [
          {
            validator: validateParams,
            trigger: 'blur',
          },
        ],
      },
      row: '',
    }
  },
  created() {
    this.getCateList()
  },
  computed: {
    //如果按钮需要被警用，返回true
    isBtnDisabled() {
      return this.changeKeys.length !== 3
    },
    //分类ID
    IdParam() {
      return this.changeKeys.length == 3 ? this.changeKeys[2] : null
    },
    DialogtitleName() {
      if (this.activeName == 'many') {
        return '动态属性'
      }
      return '静态属性'
    },
  },
  methods: {
    async handleInputConfirm(props) {
      if(props.inputValue.trim().length==0){
        props.inputValue=''
        props.inputVisible=false
        return
      }
      //直接push进就可以
      props.attr_vals.push(props.inputValue.trim())
      props.inputValue=''
      props.inputVisible=false
      

      // let inputValue = props.inputValue
      // if (inputValue) {
      //   console.log("添加并重新渲染等操作",props)
      //   const {data:res} = await requests({
      //     url:`categories/${this.IdParam}/attributes/${props.attr_id}`,
      //     methods:'put',
      //     data:{
      //       //新追加的数据
      //       attr_vals:props.inputValue,
      //       attr_sel:props.attr_sel,
      //       attr_name:props.attr_name
      //     }
      //   })
      //   if(res.meta.status!==200){
      //     return this.$message.error("添加失败，请检查网络是否连接")
      //   }
      //   console.log(res);
      //   console.log(inputValue);
      //   this.$message.success("添加成功")
      // }
      // props.inputVisible = false
      // props.inputValue = ''
    },
    handleClose(props) {
      console.log(props, 'api后续删除操作')
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput(props) {
      console.log(props)
      props.inputVisible = true
      //让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      // this.$nextTick(()=> {
      //     this.$refs.saveTagInput.$refs.input.focus();
      //   });
      // this.$nextTick(()=> {
      //   this.$refs.saveTagInput.$refs.input.focus()
      // })
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    async editFormSubmit() {
      const { data: res } = await requests({
        url: `categories/${this.IdParam}/attributes/${this.row.attr_id}`,
        method: 'put',
        data: {
          attr_name: this.editForm.attr_name,
          attr_sel: this.row.attr_sel,
        },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('编辑失败，请检查网络是否连接')
      }
      //重新加载数据
      this.getParamsList()
      this.$message.success('编辑成功！')
      this.editdialogVisible = false
    },

    async editParams(row) {
      this.editdialogVisible = true
      this.row = row
      this.editForm.attr_name = row.attr_name
    },
    addSubmit() {
      this.$refs.AddFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await requests({
            url: `categories/${this.IdParam}/attributes`,
            method: 'post',
            data: {
              attr_name: this.AddForm.attr_name,
              attr_sel: this.activeName,
            },
          })
          if (res.meta.status !== 201) {
            return this.$message.error('请求失败，请检查网络是否连接')
          }
          this.$message.success('添加成功')
          //重新刷新参数列表
          this.getParamsList()
          this.dialogVisible = false
        } else {
          return this.$message.error('请输入正确的输入框')
        }
      })
    },
    async handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await requests({
            url: `categories/${this.IdParam}/attributes/${row.attr_id}`,
            method: 'delete',
          })
          if (res.meta.status == 200) {
            this.getParamsList()
            return this.$message.success('删除成功')
          }
          return this.$message.error('删除失败')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    DialogClose() {
      //关闭弹话框的时候充值表单
      this.$refs.AddFormRef.resetFields()
    },
    //获取参数列表
    async getParamsList() {
      if (this.IdParam === null) {
        return this.$message.error('请选择三分类配置！')
      }
      const { data: res } = await requests({
        url: `categories/${this.IdParam}/attributes`,
        method: 'GET',
        params: {
          sel: this.activeName,
        },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败，请检查网络是否连接')
      }

      if (this.activeName == 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals !== '' ? item.attr_vals.split(' ') : []
        //控制文本框的显示和隐藏
        item.inputVisible = false
        //文本框输入的值
        item.inputValue = ''
      })
    },
    handleTabClick() {
      this.getParamsList()
    },
    handleChange() {
      if (this.changeKeys.length == 1 || this.changeKeys.length == 2) {
        setTimeout(() => {
          this.changeKeys = []
        }, 1000)
        return this.$message.error('请选择三级分类')
      }
      this.getParamsList()
    },
    async getCateList() {
      const { data: res } = await requests({
        url: 'categories',
        method: 'get',
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败，请检查网络是否连接')
      }

      this.CateList = res.data
    },
  },
}
</script>

<style scoped>
.el-row {
  margin-top: 15px;
}
.el-tag {
  margin: 5px;
}
</style>>


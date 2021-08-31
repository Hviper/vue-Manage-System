<template>
  <div id="wai" v-loading.fullscreen.lock="fullscreenLoading">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/about' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <div>
            <!-- 搜索框 -->
            <el-input placeholder="请输入内容" v-model="queryInfo.query">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="searchUser"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 数据表格table,tableData数据传递到了table组件中，字段分配给了每一个table-column，
        tableData可以取出每个字段中的数据，再传递给tableData子组件table-column
       -->
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column prop="id" label="ID" width="100"> </el-table-column>

        <el-table-column prop="username" label="用户名" width="200">
        </el-table-column>

        <el-table-column prop="mobile" label="电话号码" width="200">
        </el-table-column>

        <el-table-column prop="email" label="email" width="200">
        </el-table-column>
        <el-table-column prop="role_name" label="身份" width="200">
        </el-table-column>
        <!-- 
        <el-table-column prop="wealth" label="财富" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.wealth }}</span>
          </template>
        </el-table-column> -->

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="medium" @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="medium"
              type="danger"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      @close="DialogClose"
      width="30%"
    >
      <!-- 表单 -->
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="Form"
        label-width="70px"
        size="medium"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            type="text"
            v-model="ruleForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input
            type="text"
            v-model="ruleForm.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗用于编辑用户 -->
    <el-dialog title="编辑用户"
     :visible.sync="editVisible" 
     @close="closeEditDialog"
     width="30%">
      <!-- 表单 -->
      <el-form
        :model="editForm"
        status-icon
        :rules="editrules"
        ref="EditFormRef"
        label-width="70px"
        size="medium"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input
            type="text"
            v-model="editForm.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="mobile">
          <el-input
            type="text"
            v-model="editForm.mobile"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import requests from '@/networks'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 5) {
        callback(new Error('密码长度应该大于5'))
      }
      callback()
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }

    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }

    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }

    return {
      tableData: [],
      editVisible: false,
      fullscreenLoading: true,
      dialogVisible: false,
      ruleForm: {
        password: '',
        username: '',
        email: '',
        mobile: '',
      },
      
      rules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        username: [{ validator: validatePass2, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }],
      },
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },

      editID: '',
      editForm: {
        email: '',
        mobile: '',
      },
      editrules: {
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }],
      },
    }
  },
  methods: {
    closeEditDialog(){
      this.$refs.EditFormRef.resetFields();
    },
     editSubmit() {
      this.$refs.EditFormRef.validate(async(valid) => {
        if (!valid) {
          return
        } else {
          const { data: res } = await requests({
            url: 'users/' + this.editID,
            method: 'put',
            data: {
              id: this.editID,
              mobile: this.editForm.mobile,
              email: this.editForm.email,
            },
          })
          if (res.meta.status == 200) {
            this.editVisible = false
            this.getUSers()
            this.$message.success('更新成功')
            console.log(res)
          } else {
            this.$message('更新失败，请检查网络是否连接')
          }
        }
      })
    },
    searchUser() {
      this.getUSers()
    },
    openFrame(msg) {
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    async handleDelete(index) {
      this.openFrame('此操作将永久删除该用户, 是否继续?')
      //删除
      const { data: res } = await requests({
        url: 'users/' + index,
        method: 'delete',
      })
      if (res.meta.status == 200) {
        this.$message.success('删除成功')
        this.getUSers()
      }
    },
    async handleEdit(id) {
      this.editVisible = true
      this.editID = id
    },
    onSubmit() {
      this.$refs.Form.validate(async (valid) => {
        if (valid) {
          const { data: res } = await requests({
            url: 'users',
            method: 'POST',
            data: this.ruleForm,
          })
          console.log(res)
          if (res.meta.status == 201) {
            this.$message({
              message: '恭喜你，添加成功',
              type: 'success',
            })
            //添加成功后，重新请求数据
            this.getUSers()
          } else {
            this.$message.error('添加失败，请检查网络是否连接')
          }
        } else {
          this.$message.error('添加失败,请输入正确的输入格式')
          return false
        }
      })
      this.dialogVisible = false
    },
    DialogClose() {
      this.$refs.Form.resetFields()
    },
    async getUSers() {
      const { data: res } = await requests({
        url: 'users',
        method: 'get',
        params: this.queryInfo,
      }).catch((err) => err)
      if (res.meta.status == 200) {
        this.tableData = res.data.users
      } else {
        this.$message.fail('获取失败')
      }
      this.fullscreenLoading = false
    },
  },

  created() {
    this.getUSers()
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
}
.el-card {
  height: 540px;
}
#wai {
  height: 100%;
}
</style>
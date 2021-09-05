<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="inputSearch">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格数据展示 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column label="订单编号" width="250" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" width="100" prop="order_price">
        </el-table-column>
        <el-table-column label="是否付款" width="100">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->

            <el-tag v-if="scope.row.order_pay == 1" type="danger">否</el-tag>
            <el-tag v-else type="success">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="100">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->

            <el-tag v-if="scope.row.is_send == '是'" type="danger">否</el-tag>
            <el-tag v-else type="success">是</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="下单时间" width="200">
          <template slot-scope="scope">
            <!-- <i class="el-icon-time"></i> -->
            <span style="margin-left: 10px">{{
              scope.row.create_time | dataFormat
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- Pagination 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[5, 15, 30, 50]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <!-- 表单 -->
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item
          label="省市区/县"
          prop="address1"
          :rules="[{ required: true, message: '请选择地址', trigger: 'blur' }]"
        >
          <el-cascader
            v-model="checkoutValue"
            :options="form.address1"
            :props="props"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          :rules="[
            { required: true, message: '请填写详细地址', trigger: 'blur' },
          ]"
          prop="address2"
        >
          <el-input v-model="form.address2"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import requests from '@/networks'
import citydata from './citydata.js'
export default {
  data() {
    return {
      inputSearch: '',
      //table的数据源
      tableData: [],
      total: 0,
      queryParams: {
        pagenum: 1,
        pagesize: 10,
      },
      //编辑弹窗
      dialogVisible: false,
      //表单
      form: {
        address1: citydata,
        address2: '',
      },

      //Cascader
      checkoutValue: [],
      props: { expandTrigger: 'hover' },
    }
  },
  methods: {
    handleChange(value) {
        console.log(value)
    },
    handleEdit(row) {
      this.dialogVisible = true

      console.log(row)
    },
    handleDelete(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getOrdersList()
    },
    handleCurrentChange(val) {
      this.queryParams.pagenum = val
      this.getOrdersList()
    },
    async getOrdersList() {
      const { data: res } = await requests({
        url: 'orders',
        method: 'get',
        params: this.queryParams,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取表格数据失败')
      }
      this.tableData = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
  },
  created() {
    this.getOrdersList()
  },
}
</script>

<style>
</style>
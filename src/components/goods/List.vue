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
      <!-- 搜索框 -->
      <el-input
        placeholder="请输入内容"
        v-model="queryInfo.query"
        clearable
        style="width: 380px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="search"
        ></el-button>
      </el-input>
      <el-button style="margin-left: 18px" type="primary" @click="addGoods"
        >添加商品</el-button
      >

      <!-- 表单table展示 -->
      <el-table :data="goods" style="width: 100%">
        <!-- 序号 -->
        <el-table-column label="序号" type="index"> </el-table-column>
        <!-- 商品名称 -->
        <el-table-column label="商品名称" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.goods_name }}</span>
          </template>
        </el-table-column>
        <!-- 商品价格 -->
        <el-table-column label="价格" width="90">
          <template slot-scope="scope">
            <p>{{ scope.row.goods_price }}</p>
          </template>
        </el-table-column>
        <!-- 商品重量 -->
        <el-table-column label="重量" width="90">
          <template slot-scope="scope">
            <p>{{ scope.row.goods_weight }}</p>
          </template>
        </el-table-column>
        <!-- 商品创建时间 -->
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <p>
              <!-- 过滤器的使用，全局过滤器dataFormat -->
              {{ scope.row.upd_time | dataFormat }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能实现 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>


  </div>
</template>

<script>
import requests from '@/networks'

export default {
  data() {
    return {
      goods: [],
      total: 0,
      queryInfo: {
        pagenum: 1,
        pagesize: 10,
        //搜索框的内容
        query: '',
      },

    }
  },
  watch: {
    'queryInfo.pagenum': function () {
      this.getGoods(
        this.queryInfo.pagenum,
        this.queryInfo.pagesize,
        this.queryInfo.query
      )
    },
    'queryInfo.pagesize': function () {
      this.getGoods(
        this.queryInfo.pagenum,
        this.queryInfo.pagesize,
        this.queryInfo.query
      )
    },
    'queryInfo.query': function () {
      this.getGoods(
        this.queryInfo.pagenum,
        this.queryInfo.pagesize,
        this.queryInfo.query
      )
    },
  },
  methods: {
    //   添加一行数据
    addGoods() {
      this.$router.push("/add.do")
    },
    //删除该行数据
    handleDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await requests({
            url: `goods/${row.goods_id}`,
            method: 'delete',
          })
          if (res.meta.status !== 200) {
            return this.$$message.error('删除失败，请检查网络是否连接')
          }

          //更新数据,渲染前台
          await this.getGoods(
            this.queryInfo.pagenum,
            this.queryInfo.pagesize,
            this.queryInfo.query
          )

          this.$message.success('删除成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    handleEdit(row) {
      console.log(row)
    },

    // 改变每一页显示的大小
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
    },
    // 改变页码
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
    },
    search() {
      this.getGoods(
        this.queryInfo.pagenum,
        this.queryInfo.pagesize,
        this.queryInfo.query
      )
    },
    async getGoods(pagenum, pagesize, query) {
      const { data: res } = await requests({
        url: 'goods',
        method: 'get',
        params: {
          query: query,
          pagenum: pagenum,
          pagesize: pagesize,
        },
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取数据失败，请检查网络是否连接')
      }
      this.goods = res.data.goods
      this.total = res.data.total
      //   this.$message.success('更新数据成功！')
      //   console.log(res)
    },
  },
  created() {
    this.getGoods(
      this.queryInfo.pagenum,
      this.queryInfo.pagesize,
      this.queryInfo.query
    )
  },
}
</script>

<style>
.el-card {
  margin-top: 15px;
}
</style>
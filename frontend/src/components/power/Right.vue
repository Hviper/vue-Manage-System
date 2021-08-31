<template>
  <div style="height=100%">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/about' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/about">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="authName" type="index" label="编号" width="180">
        </el-table-column>

        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180">
        </el-table-column>

        <el-table-column prop="level" label="权限等级" width="180">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import requests from '@/networks'
export default {
  data() {
    return {
      tableData: [],
    }
  },
  async created() {
    this.getTablesData();
  },
  methods: {
    async getTablesData() {
      const { data: res } = await requests({
        method: 'get',
        url: 'rights/list',
      })
      if (res.meta.status !== 200) {
        this.$message.error('请求失败，请检查网络')
      } else {
        this.tableData = res.data
      }
    },
  },
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.box-card {
  height: 450px;
}
</style>
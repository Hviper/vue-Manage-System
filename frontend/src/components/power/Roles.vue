<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/about' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/about">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row style="margin-top: 15px">
      <el-col :span="6">
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="rolesList">
      <el-table-column type="expand" width="180">
        <template slot-scope="props">
          <el-row  v-for="item in props.row.children" :key="item.id">
            <el-col :span="5"
              >
                <el-tag>{{item.authName}}</el-tag>
              </el-col>
            <el-col :span="19"
              >

              </el-col>
          </el-row>
         
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" width="180">
      </el-table-column>

      <el-table-column prop="roleDesc" label="角色描述" width="180">
      </el-table-column>

      <el-table-column prop="date" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >

          <el-button
            size="mini"
            type="warning"
            icon="el-icon-s-promotion"
            @click="handleDelete(scope.$index, scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import requests from '@/networks'
export default {
  data() {
    return {
      rolesList: [],
    }
  },
  methods: {
    async getRolesList() {
      const { data: res } = await requests({
        url: 'roles',
        method: 'get',
      })
      if (res.meta.status !== 200) {
        this.$message.error('网络出差了。请检查网络')
        return
      } else {
        this.rolesList = res.data
      }
    },
  },
  created() {
    this.getRolesList()
  },
}
</script>

<style scoped>
</style>
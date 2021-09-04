<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/about' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/about">权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row style="margin-top: 15px">
      <el-col :span="6" style="margin-bottom:5px">
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="rolesList">
      <el-table-column type="expand" width="180">
        <template slot-scope="props">
          <el-row v-for="item in props.row.children" :key="item.id">
            <el-col :span="5">
              <el-tag>{{ item.authName }}</el-tag>
            </el-col>
            <el-col :span="19"> </el-col>
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
            @click="handlePermissions(scope.row)"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 权限分配对话框，树形控件展示 -->
    <el-dialog title="权限展示"
     :visible.sync="TreeVisible" 
     @close="closeTreeDialog"
     
     width="50%">
      <!-- 展示列表tree @check-change="handleCheckChange"-->
      <el-tree
        :data="PermissionsTree"
        :props="TreeProps"
        node-key="id"
        :default-checked-keys="defaultKeys"
        default-expand-all
        show-checkbox
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="TreeVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTreeSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import requests from '@/networks'
export default {
  data() {
    return {
      rolesList: [],
      // 控制权限分配tree是否可见
      TreeVisible: false,
      PermissionsTree: [],
      TreeProps: {
        children: 'children',
        label: 'authName',
      },
      defaultKeys: [],
      roleId:''
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
    async getTreeList() {
      const { data: res } = await requests({
        url: 'rights/tree',
        method: 'get',
      })
      if (res.meta.status !== 200) {
        this.$message.error('请求失败，请检查网络是否连接')
        return
      }
      this.PermissionsTree = res.data
    },
    // 为所选的分配权限行进行控制输出默认的keys
    handlePermissions(row) {
      this.roleId=row.id;
      // console.log('row',row)
      this.TreeVisible = true
      this.getLeafkeys(row,this.defaultKeys)
     
    },
        // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys (node, arr) {
      // 没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
    //关闭弹窗，然后清空keys列表
    closeTreeDialog(){
      this.defaultKeys = []
    },
    //点击处理并提交分配权限勾选框至后端
    async dialogTreeSubmit(){
      this.TreeVisible = false;
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const {data:res} = await requests({
        method:'POST',
        url:`roles/${this.roleId}/rights`,
        data:{
          rids:keys.join(','),
        },
      })
      
      if(res.meta.status!==200){
        this.$message.error("更新权限失败，请检查网络是否连接");
        return;
      }
      this.$message.success("更新成功！")
    }
  },
  created() {
    this.getRolesList()
    this.getTreeList()
  },
}
</script>

<style scoped>
</style>
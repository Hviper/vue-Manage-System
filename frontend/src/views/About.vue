<template>
  <el-container class="container">
    <el-header>
      <div class="header-first">
        <img id="logo" src="../assets/favicon.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <div>
        <el-button @click="close">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 边导航栏 -->
      <el-aside width="200px">
        <div @click="isCollapseClick" class="Collapsefun">
          <span>|||</span>
        </div>
        <el-menu
          :unique-opened="true"
          :collapse-transition="false"
          background-color="#303133"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          router
          :default-active="activeIndex"
        >
          <el-submenu :index="item.id + ''" v-for="item in list" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.title }}</span>
            </template>

            <el-submenu
              :index="i.id + ''"
              v-for="i in item.children"
              :key="i.id" 
            >
              <template slot="title">{{ i.title }}</template>
              <el-menu-item @click="SaveactiveIndex(i.path)" :index="i.path">{{ i.msg }}</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
       
      </el-main>
      <!-- <router-view/> -->
    </el-container>
  </el-container>
</template>

<script>

export default {

  data() {
    return {
      isCollapse: false,
      activeIndex:'',
      list: [
        {
          title: '导航一',
          id: 2,
          children: [
            {
              title: '选项一',
              id: 21,
              path: '/user',
              msg: '用户',
            },
            {
              title: '选项二',
              id: 32,
              path: '/right',
              msg: '权限管理',
            },
            {
              title: '选项三',
              id: 23,
              path: '/roles',
              msg: '角色列表',
            },
          ],
        },
        {
          title: '导航二',
          id: 3,
          children: [
            {
              title: '选项一',
              id: 31,
              path: '/user',
              msg: '用户',
            },
            {
              title: '选项二',
              id: 32,
              path: '/right',
              msg: '权限管理',
            },
            {
              title: '选项三',
              id: 33,
              path: '/goods',
              msg: '商品',
            },
          ],
        },
        {
          title: '导航三',
          id: 4,
        },
        {
          title: '导航四',
          id: 5,
        },
      ],
    }
  },
  methods: {
    close() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    isCollapseClick() {
      this.isCollapse = !this.isCollapse
    },
    SaveactiveIndex(activeIndex){
      window.sessionStorage.setItem('activeIndex',activeIndex)
      this.activeIndex = activeIndex
    }
  },
  created() {
    this.activeIndex = window.sessionStorage.getItem('activeIndex')
  },
}
</script>

<style scoped>
.Collapsefun {
  height: 30px;
  color: #fff;
  font-size: 20px;
  position: relative;
}
.Collapsefun span {
  position: absolute;
  top: -80px;
  cursor: pointer;
}
#logo {
  width: 50px;
  height: 50px;
  margin-top: 25px;
}
.container {
  width: 100%;
  height: 100%;
  position: absolute;
}
.el-header {
  padding-left: 4px;
  background-color: #303133;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  /* align-items: center; */
}

.el-aside {
  background-color: #303133;
  /* color: #333; */
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;

  
}
</style>
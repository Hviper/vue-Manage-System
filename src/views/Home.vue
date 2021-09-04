<template>
  <el-container>
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
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409FFF"
        >
          <!-- :unique-opened="true"->只允许展开一个菜单 -->
          <!-- :collapse-transition="false" -> 关闭动画 -->
          <!-- router -> 导航开启路由模式 -->
          <!-- 一级菜单  -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 导航开启路由模式：
                将index值作为导航路由 -->
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <router-view>
          
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import requests from '@/networks'
export default {

  data() {
    return {
    // 被激活导航地址
      activePath: '',
       // 默认不折叠
      isCollapse: false,
      activeIndex:'',
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      menuList: [],
    }
  },


  methods: {
    // 获取请求菜单
    async getMenuList() {
      const { data: res } = await requests({
        url:'menus',
        method:'get',
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
    },
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
    },

    // 保存连接的激活地址
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    },

     // 菜单的折叠与展开
    togleCollapse () {
      this.isCollapse = !this.isCollapse
    },
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
}
</script>

<style scoped>

.el-container {
  height: 100%;
}
.el-header {
  background-color: #373f41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

}

.el-header div {
    display: flex;
    align-items: center;
    
    
  }
.el-header div img {
      height: 40px;
    }
.el-header div span {
      margin-left: 15px;
    }
.el-aside {
  background-color: #333744;

  
}
.el-menu {
    border: none;
  }
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  
  cursor: pointer;
}
</style>
<template>
  <div class="container">
      <h1 class="content">
        <el-button type="primary">
          <router-link to="/user">user</router-link>
        </el-button>
      </h1>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
*{
  text-decoration: none;
}
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(../assets/xz.gif);
}
.content{
  color:#fff;
}
</style>
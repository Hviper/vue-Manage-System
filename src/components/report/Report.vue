<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 视图区域 -->
    <my-echarts class="echar" :dataSource="getData"></my-echarts>
  </div>
</template>

<script>
import MyEcharts from './MyEcharts.vue'
import _ from 'lodash'
import requests from '@/networks'
export default {
  components: {
    MyEcharts,
  },
  computed: {
      getData() {
          return _.merge(this.dataSource,this.options)
      }
  },
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
      dataSource: {},
    }
  },
  methods: {
    async getdataSource() {
      const { data: res } = await requests({
        url: 'reports/type/1',
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败，请检查网络是否连接')
      }
      this.dataSource = res.data
      console.log('report', res)
    },
  },
  created() {
    this.getdataSource()
  },
}
</script>

<style>
.echar{
    margin-top:20px;
}
</style>
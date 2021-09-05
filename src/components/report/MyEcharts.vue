<template>
  <div>
    <div id="main" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    dataSource: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      required: true
    },
  },
  //此时dom元素渲染完毕
  mounted() {
    var myChart = echarts.init(document.getElementById('main'))
       
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.dataSource)
  },

}
</script>

<style>
</style>
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';

import ZkTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor, /* { default global options } */)


Vue.config.productionTip = false
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
 

Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.component('tree-table', ZkTable)
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')

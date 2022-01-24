import Vue from 'vue'
import Cookies from 'js-cookie'
import App from './App.vue';
import VueSocketIO from 'vue-socket.io'
import './assets/reset.css'
import ElementUI from 'element-ui';
import store from './store'
import router from './router'
import permission from './directive/permission'
import './permission' // permission control
import AuthJwt from "@/utils/auth";
import jwt_decode from 'jwt-decode';

import './assets/icons' // icon
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/final.scss' // ruoyi css
import 'element-ui/lib/theme-chalk/index.css';



import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, dateFormatISO, selectDictLabels, download, handleTree } from "@/utils/unique";

import Pagination from "@/components/Pagination/index.vue";
// 自定义表格工具扩展
import RightToolbar from "@/components/RightToolbar/index.vue"
// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.dateFormatISO = dateFormatISO
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree


Vue.prototype.msgSuccess = function (msg: any) {
  this.$message({ showClose: true, message: msg, type: "success" });
}

Vue.prototype.msgError = function (msg: any) {
  this.$message({ showClose: true, message: msg, type: "error" });
}

Vue.prototype.msgInfo = function (msg: any) {
  this.$message.info(msg);
}

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)

Vue.use(permission)

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(new VueSocketIO({
  debug: false,
  connection: 'http://39.105.75.113:8300',
  vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
  }
}));
AuthJwt.setup({
  storage: {
      get: x => Promise.resolve(localStorage.getItem(x)),
      set: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
      delete: x => Promise.resolve(localStorage.removeItem(x)),
      clear: () => Promise.resolve(localStorage.clear()),
  },
  decoder: jwt => jwt_decode(jwt)
});
Vue.prototype.$authJwt = AuthJwt;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

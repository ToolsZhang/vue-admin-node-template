import hasRole from './hasRole'
import hasPermi from './hasPermi'
import Vue from 'vue'
const install = function(Vue: any) {
  Vue.directive('hasRole', hasRole)
  Vue.directive('hasPermi', hasPermi)
}

if (window.Vue) {
  window['hasRole'] = hasRole
  window['hasPermi'] = hasPermi
  Vue.use(install); // eslint-disable-line
}

export default install

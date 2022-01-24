import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu';
import { getAppealCount } from "@/api/appeal/appeal";
import Layout from '@/layout/index.vue';
import ParentView from '@/components/ParentView/index.vue';

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    sidebarRouters: [],
    handlecount:0,
    debtcount:0
  },
  mutations: {
    SET_ROUTES: (state: any, routes: any) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    SET_SIDEBAR_ROUTERS: (state: any, routers: any) => {
      state.sidebarRouters = constantRoutes.concat(routers)
    },
    SET_HANDLE_COUNT: (state: any, handleCount: any) => {
      state.handlecount = handleCount;
    },
    SET_DEBT_COUNT: (state: any, debtCount: any) => {
      state.debtcount = debtCount;
    },
    
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }: any) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then((res: any) => {
          const sdata = JSON.parse(JSON.stringify(res))
          const rdata = JSON.parse(JSON.stringify(res))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, true)
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', sidebarRoutes)
          resolve(rewriteRoutes)
        })
      })
    },
    // 获取未处理诉求数量
    GetAppealCount({ commit }: any){
      return new Promise(resolve => {
        // 向后端请求数据
        getAppealCount().then((response: any) => {
          console.log(response);
          
          commit('SET_HANDLE_COUNT', response.handlecount)
          commit('SET_DEBT_COUNT', response.debtcount)
          resolve(response)
        })
      })
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any, isRewrite = false) {
  return asyncRouterMap.filter((route: any) => {
    if (isRewrite && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, isRewrite)
    }
    return true
  })
}

function filterChildren(childrenMap: any) {
  var children: any[] = []
  childrenMap.forEach((el: any, index: any) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView') {
        el.children.forEach((c: any) => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children))
            return
          }
          children.push(c)
        })
        return
      }
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = (view: any) => { // 路由懒加载
  return (resolve: any) => require([`@/views${view}`], resolve)
}

export default permission

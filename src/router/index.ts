import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import workspace from '../views/workspace.vue'
import Layout from '@/layout/index.vue'

Vue.use(VueRouter)

export const constantRoutes: Array<RouteConfig> = [
  // {
  //   path: '/',
  //   component: workspace,
  //   children:[
  //     {
  //       path:'',
  //       name:'appeal',
  //       component: ()=>import('../views/AppealHandle.vue')
  //     },
  //     {
  //       path: 'appeal',
  //       component: () => import('../views/AppealHandle.vue')
  //     },
  //     {
  //       path: 'village',
  //       component: () => import('../views/VillageHandle.vue')
  //     },
  //     {
  //       path: 'township',
  //       component: () => import('../views/TownshipHandle.vue')
  //     },
  //     {
  //       path: 'department',
  //       component: () => import('../views/DepartmentHandle.vue')
  //     },
      
  //     {
  //       path: 'blrh',
  //       component: () => import('../views/Baolianruhu.vue')
  //     },
  //     {
  //       path: 'cardmanage',
  //       component: () => import('../views/CardManage.vue')
  //     },
  //     {
  //       path: 'blqz',
  //       component: () => import('../views/Baolianqunzhong.vue')
  //     },
  //     {
  //       path: 'system',
  //       component: () => import('../views/SystemSetting.vue')
  //     },
  //     {
  //       path: 'system/menus',
  //       component: () => import('../views/SystemSetting.vue')
  //     },
  //   ]
  // },  
  {
    path: '/redirect',
    component: Layout,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    children: [
      {
        path: 'type/data/:dictId',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/chart1',
    component: () => import('../views/chart1.vue')
  },
  {
    path: '/chart2',
    component: () => import('../views/chart2.vue')
  },
  {
    path: '/chart3',
    component: () => import('../views/chart3.vue')
  }
]

const router = new VueRouter({
  mode: 'history', // 去掉url中的#
  routes : constantRoutes
})

export default router

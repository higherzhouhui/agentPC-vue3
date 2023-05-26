import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

import Layout from '@/layout'
import agentManagement from './modules/agentManagement'
import reportFormManagement from './modules/reportFormManagement'
import { RoleTypeDictory } from '@/utils/index';

// 图片
import sy from '../assets/imgs/sy/sy.png'
import sys from '../assets/imgs/sy/sys.png'

import lj from '../assets/imgs/sy/lj.png'
import ljs from '../assets/imgs/sy/ljs.png'
import { translateTitle } from '@/locale'
// import customComponents from './modules/customComponents'

// 配置路由信息
export const constantRoutes = [ 
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('@/views/login/index.vue')
  },
  // {
  //   path: '/',
  //   name: 'Dashboard',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'Dashboard',
  //       component: () => import('@/views/dashboard/index.vue'),
  //       meta: {
  //         title: '主页',
  //         icon: 'list_left_ic_home',
  //         noCache: true,
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('@/views/error/500.vue'),
    hidden: true
  }

]

export const dynamicRoutes = [
  {
    path: '/',
    name: 'UserOverview',
    component: Layout,
    redirect: '/userOverview',
    children: [
      {
        path: 'userOverview',
        name: 'userOverview',
        component: () => import('@/views/UserManagement/user-overview'),
        meta: {
          title: translateTitle('CUST.translate11'),
          // icon: 'list_left_ic_home',
          icon: [sy, sys],
          noCache: true,
          affix: true,
        }
      }
    ]
  },

  {
    path: '/PersonalCenter',
    component: Layout,
    name: 'personalCenter',
    redirect: '/PersonalCenter/personalCenter',
    meta: { title: translateTitle('CUST.translate60') },
    children: [
      {
        path: 'personalCenter',
        component: () => import('@/views/PersonalCenter/personalCenter.vue'),
        name: 'PersonalCenter',
        hidden: false,
      },
    ]
  },
  agentManagement, //代理
  reportFormManagement, //报表中心
  {
    path: '/monitor',
    component: Layout,
    name: 'monitor',
    redirect: '/monitor/monitorJob',
    children: [
      {
        path: 'monitorJob',
        name: 'monitorJob',
        component: () => import('@/views/monitor/job'),
        meta: {
          title: '定时任务',
          // icon: 'list_left_ic_home',
          icon: [lj, ljs],
          noCache: true,
          roles: [RoleTypeDictory.SuperAdmin]
          // affix: true,
        }
      }
    ]
  },
  {
    path: '/monitors',
    component: Layout,
    name: 'monitors',
    redirect: '/monitors/monitorJobLog',
    meta: {
      title: '调度日志',
      roles: [RoleTypeDictory.SuperAdmin]
    },
    children: [
      {
        path: 'monitorJobLog',
        name: 'monitorJobLog',
        component: () => import('@/views/monitor/job/log.vue'),
      }
    ]
  },
  {
    path: '/ExtensionManagement',
    component: Layout,
    name: 'ExtensionManagement',
    redirect: '/ExtensionManagement/extensionDomainName',
    children: [
      {
        path: 'extensionDomainName',
        name: 'extensionDomainName',
        component: () => import('@/views/ExtensionManagement/extensionDomainName'),
        meta: {
          title: translateTitle('CUST.translate184'),
          // icon: 'list_left_ic_home',
          icon: [lj, ljs],
          noCache: true,
          // affix: true,
        }
      }
    ]
  },

  { path: '/:pathMatch(.*)', redirect: '/404', hidden: true }

  // {
  //   path : '/guide',
  //   name : 'Guide',
  //   component : Layout,
  //   redirect : '/guide',
  //   children : [
  //     {
  //       path : '',
  //       name : 'Guide',
  //       component : () => import( '@/views/guide/index' ),
  //       meta : {
  //         title : '用户指引',
  //         icon : 'guide'
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/directive',
  //   name: 'Directive',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/directive/index'),
  //       name: 'Index',
  //       meta: { title: '指令', icon: 'directive', noCache: true }
  //     }
  //   ]
  // },

  // TODO 自定义组件
  // customComponents,

]

const router = createRouter({
  history: createWebHashHistory('./'),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export function resetRouter() {
  const WHITE_NAME_LIST = ['Login']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router

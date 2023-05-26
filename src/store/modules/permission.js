import { defineStore } from 'pinia'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import Layout from '@/layout'
import { systemmenu } from '@/api/SystemManagement'
import auth from '@/plugins/auth'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

const usePermissionStore = defineStore({
  id: 'permission',
  state: () => {
    return {
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRouters: [],
      sidebarRouters: []
    }
  },
  actions: {
    SET_ROUTES(roles) {
      // this.addRoutes = routes
      // this.routes = constantRoutes.concat(routes)
      return new Promise(resolve => {
        let accessedRoutes = filterAsyncRoutes(dynamicRoutes, roles);
        // let accessedRoutes = dynamicRoutes;
        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    SET_DIRECTIVE_ROLE(roles) {
      this.directivePermission = roles
    },
    setDefaultRoutes(routes) {
      this.defaultRoutes = constantRoutes.concat(routes)
    },
    setTopbarRoutes(routes) {
      this.topbarRouters = routes
    },
    setSidebarRouters(routes) {
      this.sidebarRouters = routes
    },
    generateRoutes(roles) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        systemmenu().then(res => {
          console.log(dynamicRoutes)
          const sdata = JSON.parse(JSON.stringify(res.rows.children))
          const rdata = JSON.parse(JSON.stringify(res.rows.children))
          const defaultData = JSON.parse(JSON.stringify(res.rows.children))
          const sidebarRoutes = filterAsyncRouter(sdata)
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const defaultRoutes = filterAsyncRouter(defaultData)
          // const dynamicRoutes = filterDynamicRoutes(dynamicRoutes)
          // dynamicRoutes.forEach(route => { router.addRoute(route) })
          this.SET_ROUTES(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(defaultRoutes)
          resolve(rewriteRoutes)
          // resolve(res)
        })
      })
    }
  }
})

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      // if (route.component === 'Layout') {
      //   route.component = Layout
      // } else {
      //   route.component = loadView(route.component)
      // }
      route.component = Layout
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  let res
  for (const path in modules) {
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export default usePermissionStore

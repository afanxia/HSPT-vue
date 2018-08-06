import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/

let Menu = []
let backendMenus = []
export const initMenu = (mainMenu = []) => {
  const tmpMenu = JSON.stringify(mainMenu)
  if (tmpMenu && typeof (JSON.parse(tmpMenu) === 'object')) {
    Menu = JSON.parse(tmpMenu)
  }
  const routes = sessionRouters(Menu)
  backendMenus = routes
  return backendMenus
  // Menu = mainMenu
}

/**
 * 动态循环菜单
 * @param menu 菜单
 * @param routes 路由
 * @returns {Array}
 */
const eachMenu = (menus = [], routes = []) => {
  if (menus.length <= 0) return routes
  for (const item of menus) {
    // if (item.menuUrl && (item.menuLev === 1)) {
    if (item.menuUrl) {
      const arr = {
        id: item.pkMenu,
        name: item.menuName,
        path: item.menuUrl,
        meta: {
          title: item.menuName,
          icon: item.menuIco
        },
        // hidden: item.hidden,
        // component: item.menuLev === 1 ? Layout : _import('user/user')
        component: item.isEnd === 'N' ? Layout : resolve => require([`../views${item.menuUrl}`], resolve)
      }
      // 递归子菜单
      if (item.children && item.children.length !== 0) {
        arr.children = eachMenu(item.children)
      }
      routes.push(arr)
    }
  }
  return routes
}

/**
 * 导出循环处理结果
 * @param menu 菜单
 * @param routes 路由
 * @returns {Array}
 */
export const sessionRouters = menus => eachMenu(menus)

/**
 * 导出过滤路由结果
 * @param old 原路由
 * @param routes 要过滤的路由
 */
export const filterRouters = (old = [], routes = []) => {
  if (old.length === 0 || routes.length === 0) return []
  const newRoutes = []
  for (const route of old) {
    for (const tmp of routes) {
      if (!route.id && route.id !== tmp.id) {
        newRoutes.push(route)
        break
      }
    }
  }
  return newRoutes
}

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [{
      path: 'dashboard', component: _import('dashboard/index')
    }]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  ...sessionRouters(Menu),
  { path: '*', redirect: '/404', hidden: true }
]

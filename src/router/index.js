import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style
// 引入菜单路由数组
import pageArr from './menu'

Vue.use(VueRouter)

import Layout from '@/layout'
// import EmptyLayout from '@/layout/empty'
import Home from '@/views/index'

/**
 * 默认路由，不需要权限
 */
const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'home',
                component: Home,
                meta: {
                    title: '首页'
                }
            },
            // {
            //     path: 'personal',
            //     component: EmptyLayout,
            //     redirect: '/personal/setting',
            //     meta: {
            //         title: '个人中心',
            //         breadcrumb: false
            //     },
            //     children: [
            //         {
            //             path: 'setting',
            //             name: 'personalSetting',
            //             component: () => import('@/views/personal/setting'),
            //             meta: {
            //                 title: '个人设置'
            //             }
            //         },
            //         {
            //             path: 'edit/password',
            //             name: 'personalEditPassword',
            //             component: () => import('@/views/personal/edit.password'),
            //             meta: {
            //                 title: '修改密码'
            //             }
            //         },
            //         {
            //             path: 'seatInfo',
            //             name: 'seatInfo',
            //             component: () => import('@/views/personal/seatInfo'),
            //             meta: {
            //                 title: '个人信息'
            //             }
            //         }
            //     ]
            // },
            {
                path: 'reload',
                name: 'reload',
                component: () => import('@/views/reload')
            }
        ]
    }
]

/**
 * 主导航、侧边菜单
 * 当 children 不为空的主导航只有一项时，则隐藏
 */
let asyncRoutes = [
    {
        meta: {
            title: '默认',
            icon: 'sidebar-default'
        },
        children: pageArr
    }
]

// 404页面，放在最后
const lastRoute = [{
    path: '*',
    component: () => import('@/views/404'),
    meta: {
        title: '404',
        sidebar: false
    }
}]

const router = new VueRouter({
    routes: constantRoutes
})

// 解决路由在 push/replace 了相同地址报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

// 设置全局路由守卫
router.beforeEach(async(to, from, next) => {
    store.state.settings.enableProgress && NProgress.start()
    // 已经登录，但还没根据权限动态挂载路由
    if (store.getters['user/isLogin'] && !store.state.menu.isGenerate) {
        /**
         * 重置 matcher
         * https://blog.csdn.net/baidu_28647571/article/details/101711682
         */
        router.matcher = new VueRouter({
            routes: constantRoutes
        }).matcher
        const accessRoutes = await store.dispatch('menu/generateRoutes', {
            asyncRoutes,
            currentPath: to.path
        })
        accessRoutes.push(...lastRoute)
        accessRoutes.forEach(route => {
            router.addRoute(route)
        })
        next({ ...to, replace: true })
    }
    if (store.state.menu.isGenerate) {
        store.commit('menu/setHeaderActived', to.path)
    }
    to.meta.title && store.commit('settings/setTitle', to.meta.title)
    if (store.getters['user/isLogin']) {
        if (to.name) {
            if (to.matched.length !== 0) {
                // 如果已登录状态下，进入登录页会强制跳转到控制台页面
                if (to.name == 'login') {
                    next({
                        name: 'bill',
                        replace: true
                    })
                } else if (!store.state.settings.enableDashboard && to.name == 'home') {
                    // 如果未开启控制台页面，则默认进入侧边栏导航第一个模块
                    next({
                        name: store.getters['menu/sidebarRoutes'][0].name,
                        replace: true
                    })
                }
            } else {
                // 如果是通过 name 跳转，并且 name 对应的路由没有权限时，需要做这步处理，手动指向到 404 页面
                next({
                    path: '/404'
                })
            }
        }
    } else {
        // console.log(to.name)
        if (to.name != 'login') {
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    }
    // 百度统计代码
    if (process.env.VUE_APP_TYPE == 'example') {
        if (window._hmt) {
            window._hmt.push(['_trackPageview', location.pathname + '#' + to.fullPath])
        }
    }
    next()
})

router.afterEach(() => {
    store.state.settings.enableProgress && NProgress.done()
})

export default router

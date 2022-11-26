import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

// 引入全局接口
import api from './api'
Vue.prototype.$api = api

// 引入日期格式化组件
import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

// 引入meta组件
import VueMeta from 'vue-meta'
Vue.use(VueMeta)

// 引入ui组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
Vue.use(ElementUI)

// 引入复制组件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 引入热键组件，监听键盘按键
import hotkeys from 'hotkeys-js'
Vue.prototype.$hotkeys = hotkeys

// 设置全局baseurl，用于拼接音频、文件
Vue.prototype.$baseUrl = '/obc'
Vue.prototype.$stat = '/stat'

// 系统标题
Vue.prototype.$title = '触达云'

// 判断是否是手机竖屏小于480
Vue.prototype.$isXs =  window.innerWidth < 765
// 判断屏幕宽度是否小于1200
Vue.prototype.$isMd =  window.innerWidth < 1200
// 判断屏幕宽度是否小于1640
Vue.prototype.$isLg =  window.innerWidth < 1640

// 全局组件自动注册
import './components/autoRegister'

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

import './assets/styles/reset.scss'
import '@/assets/js/directives'

Vue.config.productionTip = false

Vue.prototype.$eventBus = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

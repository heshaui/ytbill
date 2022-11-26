<template>
    <div id="app">
        <RouterView />
    </div>
</template>

<script>
export default {
    data() {
        return {
            enableSdk: this.$store.state.settings.enableSdk
        }
    },
    watch: {
        '$store.state.keepAlive.list'(val) {
            process.env.NODE_ENV == 'development' && console.log(`[ keepAliveList ] ${val}`)
        },
        '$store.state.settings.mode': {
            handler() {
                if (this.$store.state.settings.mode == 'pc') {
                    this.$store.commit('settings/updateThemeSetting', {
                        'sidebarCollapse': this.$store.state.settings.sidebarCollapseLastStatus
                    })
                } else if (this.$store.state.settings.mode == 'mobile') {
                    this.$store.commit('settings/updateThemeSetting', {
                        'sidebarCollapse': true
                    })
                }
                document.body.setAttribute('data-mode', this.$store.state.settings.mode)
            },
            immediate: true
        },
        '$store.state.user.agentId'(val) {
            this.isShow =  val
        },
        // 监听路由，切换路由时，初始化菜单的scrollTop
        $route() {
            this.$nextTick(() => {
                if (document.getElementById('sidebarCon')) document.getElementById('sidebarCon').scrollTop = Number(localStorage.sidebarScrollTop)
            })
        }
    },
    // 监听是否登录
    created() {
        this.$watch(
            function() {
                return this.$store.getters['user/isLogin']
            },
            function(val) {
                this.isLogin = val
            }
        )
    },
    mounted() {
        window.onresize = () => {
            this.$store.commit('settings/setMode', document.body.clientWidth)
        }
        window.onresize()
    },
    metaInfo() {
        return {
            title: this.$store.state.settings.enableDynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${this.$title}` : this.$title
            }
        }
    }
}
</script>

<style scoped>
#app {
    height: 100%;
}
</style>

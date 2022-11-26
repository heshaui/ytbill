<template>
    <div class="agentState" :class="$store.state.settings.mode == 'pc' ? $store.state.settings.screenW == 'sc' ? 'h50' : 'h70' : 'isXs'">
        <div id="sdkBox" />
        <div id="phoneBox" />
        <SdkTip :tip-dialog="tipDialog" @onClose="tipDialog = false" />
    </div>
</template>

<script>
import SdkTip from '../SdkTip'
// import SoftPhone from 'soft-phone-sdk'

export default {
    name: 'AgentState',
    components: { SdkTip },
    data() {
        return {
            isShow: localStorage.agentId,
            isLogin: !this.$store.getters['user/isLogin'],
            tipDialog: false,
            enableSdk: this.$store.state.settings.enableSdk
        }
    },
    watch: {
        '$store.state.user.agentId'(val) {
            if (!this.enableSdk) return
            if (val) {
                console.log('初始化sdk')
                this.initSdk()
            } else {
                console.log('登出sdk')
                this.$sdk.logout()
            }
        }
    },
    mounted() {
        if (!this.isShow || this.isLogin || !this.enableSdk) return
        this.initSdk()
    },
    destroyed() {
        console.log('控件销毁')
    },
    methods: {
        initSdk() {
            this.$sdk.init({
                ...this.$sdkOption(),
                loginType: localStorage.loginType,
                el: '#sdkBox'
            })
            this.onError()
            this.onException()
            this.onMakeCallFail()
            this.onLogout()
        },
        onError() {
            this.$sdk.on('Error', err => {
                console.log('链接失败', err)
                this.$message.error('链接失败')
            })
        },
        onLogout() {
            this.$sdk.on('Logout', data => {
                this.$message.info(data.data.cause)
            })
        },
        onException() {
            this.$sdk.on('Exception', data => {
                console.log('Exception', data)
                if (data.message === '话机未注册') {
                    this.tipDialog = true
                    return
                }
                this.$message.error(data.message)
            })
        },
        onMakeCallFail() {
            this.$sdk.on('MakeCallFail', data => {
                console.log('MakeCallFail', data)
                this.$message.error('呼叫失败，请先设置为空闲状态!' + data?.cause ?? '')
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.agentState {
    // margin-left: 50px;
    position: fixed;
    z-index: 1012;
    left: 120px;
    &.h70 {
        top: 19.75px;
        color: #fff;
    }
    &.h50 {
        top: 12.25px;
        color: #fff;
    }
    &.isXs {
        top: 9.75px;
        left: 60px;
        color: #555;
    }
    ::v-deep .ccs-sdk-container {
        #ccs-sdk-symbol-selections {
            display: inline-block;
            width: auto;
            white-space: nowrap;
        }
    }
}
::v-deep .infoP {
    text-align: left;
    line-height: 30px;
    color: #777;
    .infoLabel {
        width: 120px;
        text-align: right;
        color: #555;
    }
}
</style>

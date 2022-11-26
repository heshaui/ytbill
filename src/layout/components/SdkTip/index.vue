<template>
    <el-dialog :visible.sync="sipDialog" title="提示" append-to-body :close-on-click-modal="false" width="50%" class="hBg" @close="onClose">
        <el-form label-width="140px">
            <h3 class="err">座席SDK登录失败</h3>
            <el-form-item label="原因："><span class="err">话机未注册</span></el-form-item>
            <h3>话机注册方式</h3>
            <el-form-item label="sip话机下载链接：">
                <el-button type="primary" @click="downSip">下载话机</el-button>
            </el-form-item>
            <el-form-item label="sip账号：">{{ sipId }}</el-form-item>
            <el-form-item label="sip密码：">{{ sipPass }}</el-form-item>
            <el-form-item label="注册IP：">{{ sipIp }}</el-form-item>
            <el-form-item label="注册端口：">{{ sipPort }}</el-form-item>
            <el-form-item label="操作步骤：">
                <el-image
                    style="width: 100px; height: 100px;"
                    :src="url"
                    :preview-src-list="srcList"
                />
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { downMethod } from '@/util/index'
export default {
    name: 'SdkTip',
    props: {
        tipDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            sipId: '',
            sipPass: '',
            sipIp: localStorage.sipIP ?? '',
            sipPort: localStorage.sipPort ?? '',
            url: '',
            srcList: [],
            sipDialog: false
        }
    },
    watch: {
        'tipDialog'(val) {
            this.sipDialog = val
            if (val) {
                if (localStorage.userInfo) {
                    const userInfo = JSON.parse(localStorage.userInfo)
                    this.sipId = userInfo.sipId
                    this.sipPass = userInfo.sipPassword
                    this.sipIp = localStorage.sipIP
                    this.sipPort = localStorage.sipPort
                }
            }
        }
    },
    methods: {
        downSip() {
            downMethod('https://cc.v-call.cn/file/MicroSIP-3.19.21.zip')
        },
        onClose() {
            this.$emit('onClose')
        }
    }
}
</script>

<style lang="scss" scoped>
.err {
    color: #f56c6c;
}
</style>

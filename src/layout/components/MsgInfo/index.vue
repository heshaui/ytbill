<template>
    <div class="msgInfo">
        <div class="header">
            <div class="left">
                <el-select v-model="readState" placeholder="请选择" @change="handleReadState">
                    <el-option label="显示全部" value="" />
                    <el-option label="显示未读" :value="0" />
                </el-select>
            </div>
            <div class="right tabs">
                <span class="tabItem" :class="activeName==='msg' ? 'active' : ''" @click="tabClick('msg')">消息</span>
                <span class="tabItem" :class="activeName==='notice' ? 'active' : ''" @click="tabClick('notice')">公告</span>
                <div class="close" @click="closeDetailDialog">
                    <i class="el-icon-close" />
                </div>
            </div>
        </div>
        <div class="content">
            <div class="msgList left">
                <div v-if="activeName==='msg'">
                    <div v-for="(v, k) of msgList" :key="k" class="listItem" :class="activeId===v.id ? 'active' : ''" :title="v.content" @click="listClick(v)">
                        <div class="icon">
                            <span><i class="el-icon-user-solid" /></span>
                        </div>
                        <div class="con">
                            <span class="name">{{ v.publishUser }}</span>
                            <span class="text">{{ v.content }}</span>
                            <span class="time">{{ handleTime(v.publishTime) }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="activeName==='notice'">
                    <div v-for="(v, k) of noticeList" :key="k" class="listItem" :class="activeId===v.id ? 'active' : ''" :title="v.content" @click="listClick(v)">
                        <div class="icon">
                            <span><i class="el-icon-s-cooperation" /></span>
                        </div>
                        <div class="con">
                            <span class="name">{{ v.title }}</span>
                            <span class="text">{{ v.content }}</span>
                            <span class="time">{{ handleTime(v.publishTime) }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="msgContent right hidden-md-and-down">
                <div v-if="!isEmpty">
                    <div class="remove">
                        <i class="el-icon-delete" @click="delMsg" />
                    </div>
                    <div class="tit">
                        <span class="icon"><i :class="activeName==='msg'?'el-icon-user-solid':'el-icon-s-cooperation'" /></span>
                        <span class="name">{{ renderData.publishUser }} </span>
                        <span class="text">发送给你</span>
                        <span class="time">{{ handleTime(renderData.publishTime) }}</span>
                    </div>
                    <div class="msgText">
                        <p style="font-size: 16px; color: #333;">内容:</p>
                        <p style="font-size: 15px; color: #666; text-indent: 2em;">{{ renderData.content }}</p>
                    </div>
                </div>
                <el-empty v-if="isEmpty" description="暂无内容" />
            </div>
        </div>
        <el-drawer v-if="!$isXs" :visible.sync="drawer" direction="rtl" :with-header="false" size="300px" :append-to-body="true">
            <div class="msgInfo">
                <div class="content">
                    <div class="msgContent right">
                        <div v-if="!isEmpty">
                            <div class="remove">
                                <i class="el-icon-delete" @click="delMsg" />
                            </div>
                            <div class="tit">
                                <span class="icon"><i :class="activeName==='msg'?'el-icon-user-solid':'el-icon-s-cooperation'" /></span>
                                <span class="name">{{ renderData.publishUser }} </span>
                                <span class="text">发送给你</span>
                                <span class="time">{{ handleTime(renderData.publishTime) }}</span>
                            </div>
                            <div class="msgText">
                                <p style="font-size: 16px; color: #333;">内容:</p>
                                <p style="font-size: 15px; color: #666; text-indent: 2em;">{{ renderData.content }}</p>
                            </div>
                        </div>
                        <el-empty v-if="isEmpty" description="暂无内容" />
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { receiveNoticeList, delReadNotice, noticeIsRead } from '@/api/noticeServe'
import { receiveMsgList, delReadMsg, msgIsRead } from '@/api/msgManage'
import { isToday } from '@/util/index'
export default {
    name: 'MsgInfo',
    props: {
        msgInfoData: {
            type: Object,
            default() {
                return null
            }
        },
        msgInfoType: {
            type: String,
            default: 'msg'
        }
    },
    data() {
        return {
            msgList: [ ],
            noticeList: [],
            readState: '',
            activeName: 'msg',
            activeId: '',
            renderData: {
                name: '',
                content: '',
                time: ''
            },
            renderMsg: null,
            renderNotice: null,
            msgNum: 0,
            noticeNum: 0,
            isEmpty: false,
            drawer: false
        }
    },
    mounted() {
        // 消息类型
        this.activeName = this.msgInfoType
        this.receiveNoticeList('', 'init')
        this.receiveMsgList('', 'init')
    },
    methods: {
        handleTime(time) {
            return isToday(time)
        },
        // 初始化页面
        initMsg() {
            // 判断有无数据
            if (this.msgInfoData) { // 有就赋值
                this.renderData = this.msgInfoData
                this.activeId = this.renderData.id
                if (this.msgInfoType === 'notice') {
                    this.renderNotice = this.msgInfoData
                } else {
                    this.renderMsg = this.msgInfoData
                }
            } else { // 没有默认拿第一个
                if (this.msgInfoType === 'notice' && this.noticeList.length > 0) {
                    this.activeId = this.noticeList[0].id
                    this.renderData = this.noticeList[0]
                    noticeIsRead(this.activeId)
                } else if (this.msgInfoType === 'msg' && this.msgList.length > 0) {
                    this.activeId = this.msgList[0].id
                    this.renderData = this.msgList[0]
                    msgIsRead(this.activeId)
                } else {
                    this.isEmpty = true
                }
            }
        },
        // 获取公告
        receiveNoticeList(state, type) {
            receiveNoticeList({
                companyId: localStorage.companyId,
                isRead: state
            }).then(res => {
                if (type === 'num') {
                    this.noticeNum = res.data.length
                    this.$emit('getNoticeNum', this.noticeNum)
                } else {
                    this.noticeList = res.data
                    if (type !== 'changeState') {
                        if (this.noticeList.length > 0) {
                            this.isEmpty = false
                            if (type === 'init') {
                                this.initMsg()
                            }
                            if (type === 'reset') {
                                this.renderData = this.noticeList[0]
                                this.activeId = this.noticeList[0].id
                            }
                        } else {
                            this.isEmpty = true
                        }
                    }
                }
            })
        },
        // 获取消息
        receiveMsgList(state, type) {
            receiveMsgList({
                isRead: state
            }).then(res => {
                if (type === 'num') {
                    this.msgNum = res.data.length
                    this.$emit('getMsgNum', this.msgNum)
                } else {
                    this.msgList = res.data
                    if (type !== 'changeState') {
                        if (this.msgList.length > 0) {
                            this.isEmpty = false
                            if (type === 'init') {
                                this.initMsg()
                            }
                            if (type === 'reset') {
                                this.renderData = this.msgList[0]
                                this.activeId = this.msgList[0].id
                            }
                        } else {
                            this.isEmpty = true
                        }
                    }

                }
            })
        },
        handleReadState(val) {
            if (val === 0) {
                this.isEmpty = true
            }
            this.receiveNoticeList(val, 'changeState')
            this.receiveMsgList(val, 'changeState')

        },
        tabClick(type) {
            this.activeName = type
            if (type === 'notice') {
                if (this.noticeList.length > 0) {
                    this.isEmpty = false
                    if (this.renderNotice) {
                        this.activeId = this.renderNotice.id
                        this.renderData = this.renderNotice
                    } else {
                        this.activeId = this.noticeList[0].id
                        this.renderData = this.noticeList[0]
                        this.noticeIsRead(this.activeId)
                    }
                } else {
                    this.isEmpty = true
                }
            } else {
                if (this.msgList.length > 0) {
                    this.isEmpty = false
                    if (this.renderMsg) {
                        this.activeId = this.renderMsg.id
                        this.renderData = this.renderMsg
                    } else {
                        this.activeId = this.msgList[0].id
                        this.renderData = this.msgList[0]
                        this.msgIsRead(this.activeId)
                    }
                } else {
                    this.isEmpty = true
                }
            }
        },
        listClick(data) {
            this.renderData = data
            this.activeId = data.id
            this.isEmpty = false
            if (this.$isXs) this.drawer = true
            if (this.activeName === 'notice') {
                this.renderNotice = data
                this.noticeIsRead(data.id)
            } else {
                this.renderMsg = data
                this.msgIsRead(data.id)
            }
        },
        delMsg() {
            if (this.activeName === 'notice') {
                delReadNotice({
                    companyId: localStorage.companyId,
                    id: this.renderData.id
                }).then(() => {
                    this.$message.success('删除成功')
                    this.receiveNoticeList(this.readState, 'reset')
                })
            } else {
                delReadMsg({
                    id: this.renderData.id
                }).then(() => {
                    this.$message.success('删除成功')
                    this.receiveMsgList(this.readState, 'reset')
                })
            }
        },
        // 标记公告已读
        noticeIsRead(id) {
            noticeIsRead(id).then(() => {
                this.receiveNoticeList(0, 'num')
            })
        },
        // 标记消息已读
        msgIsRead(id) {
            msgIsRead(id).then(() => {
                this.receiveMsgList(0, 'num')
            })
        },
        closeDetailDialog() {
            this.$emit('closeDetailDialog')
        }
    }
}
</script>

<style lang="scss" scoped>
.msgInfo {
    height: 100%;
    .left {
        width: 250px;
        float: left;
        height: 100%;
    }
    .right {
        overflow: hidden;
        margin-left: 250px;
        height: 100%;
    }
    .header {
        height: 60px;
        border-bottom: 1px solid #ececec;
        .left {
            text-align: center;
            padding-top: 10px;
        }
        .tabs {
            height: 60px;
            padding-left: 100px;
            .tabItem {
                height: 60px;
                display: inline-block;
                padding: 0 10px;
                line-height: 60px;
                font-size: 14px;
                font-weight: bold;
                margin: 0 50px;
                cursor: default;
                &.active {
                    border-bottom: 4px solid #3985f4;
                    color: #3985f4;
                }
            }
            .close {
                width: 60px;
                height: 100%;
                font-size: 20px;
                text-align: center;
                line-height: 60px;
                color: #666;
                float: right;
            }
        }
    }
    .content {
        height: calc(100% - 60px);
        .left {
            border-right: 1px solid #ececec;
            padding: 10px 0;
            overflow: auto;
            .listItem {
                padding: 0 10px;
                height: 60px;
                font-size: 12px;
                margin-bottom: 10px;
                &:hover,
                &.active {
                    background: #f4f4f4;
                }
                .icon {
                    width: 30px;
                    height: 100%;
                    padding: 15px 0;
                    float: left;
                    text-align: center;
                    span {
                        display: inline-block;
                        width: 100%;
                        height: 30px;
                        border-radius: 50%;
                        background: #458df0;
                        font-size: 20px;
                        color: #fff;
                        line-height: 30px;
                    }
                }
                .con {
                    overflow: hidden;
                    margin-left: 40px;
                    height: 100%;
                    span {
                        display: block;
                        line-height: 20px;
                        cursor: default;
                    }
                    .name {
                        font-size: 13px;
                        color: #333;
                    }
                    .text {
                        color: #999;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    .time {
                        color: #666;
                    }
                }
            }
        }
        .msgContent {
            padding: 20px;
            .remove {
                height: 20px;
                font-size: 20px;
                text-align: right;
                line-height: 20px;
                color: #f56c6c;
            }
            .tit {
                height: 30px;
                line-height: 30px;
                span {
                    float: left;
                    font-size: 12px;
                }
                .icon {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: #458df0;
                    font-size: 20px;
                    color: #fff;
                    margin-right: 10px;
                    text-align: center;
                }
                .name {
                    font-size: 14px;
                    color: #333;
                    margin-right: 10px;
                }
                .text {
                    font-size: 12px;
                    color: #666;
                }
                .time {
                    font-size: 12px;
                    color: #888;
                    float: right;
                }
            }
        }
    }
}
@media screen and (max-width: 768px) {
    .msgInfo {
        .header {
            .left {
                width: 120px !important;
            }
            .right {
                margin-left: 120px !important;
                &.tabs {
                    padding-left: 20px !important;
                    .tabItem {
                        margin: 0 10px !important;
                    }
                    .close {
                        width: 20px !important;
                        font-size: 16px !important;
                        color: #999;
                        padding-right: 5px !important;
                    }
                }
            }
        }
    }
    .content {
        .msgList {
            width: 100% !important;
        }
        .msgContent {
            margin: 0 !important;
        }
    }
}
</style>

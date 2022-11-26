<template>
    <div class="msgCard">
        <el-tabs v-model="msgCardType" @tab-click="handleClick">
            <el-tab-pane label="消息" name="msg">
                <div v-for="(v, k) of msgList" :key="k" class="listItem" :title="v.content" @click="openMsgInfo(v)">
                    <div class="icon">
                        <span><i class="el-icon-user-solid" /></span>
                    </div>
                    <div class="con">
                        <span class="name">{{ v.publishUser }}</span>
                        <span class="text">{{ v.content }}</span>
                        <span class="time">{{ handleTime(v.publishTime) }}</span>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="公告" name="notice">
                <div v-for="(v, k) of noticeList" :key="k" class="listItem" :title="v.content" @click="openMsgInfo(v)">
                    <div class="icon">
                        <span><i class="el-icon-s-cooperation" /></span>
                    </div>
                    <div class="con">
                        <span class="name">{{ v.title }}</span>
                        <span class="text">{{ v.content }}</span>
                        <span class="time">{{ handleTime(v.publishTime) }}</span>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="btns">
            <span style="color: #409eff; margin-right: 20px;" @click="openMsgInfo()">查看历史</span>
            <span style="color: #f56c6c;" @click="closeMsgCard">关闭</span>
        </div>
    </div>
</template>

<script>
import { receiveNoticeList, noticeIsRead } from '@/api/noticeServe'
import { receiveMsgList,  msgIsRead} from '@/api/msgManage'
import { isToday } from '@/util/index'
export default {
    data() {
        return {
            msgCardType: 'msg',
            msgList: [],
            noticeList: [],
            msgNum: 0,
            noticeNum: 0
        }
    },
    mounted() {
        this.receiveNoticeList()
        this.receiveMsgList()
    },
    methods: {
        // 处理时间
        handleTime(time) {
            return isToday(time)
        },
        // 获取未读公告
        receiveNoticeList() {
            receiveNoticeList({
                companyId: localStorage.companyId,
                isRead: 0
            }).then(res => {
                this.noticeList = res.data
                this.noticeNum = res.data.length
                this.$emit('getNoticeNum', this.noticeNum)
            })
        },
        // 获取未读消息
        receiveMsgList() {
            receiveMsgList({
                isRead: 0
            }).then(res => {
                this.msgList = res.data
                this.msgNum = res.data.length
                this.$emit('getMsgNum', this.msgNum)
            })
        },
        // 标记公告已读
        noticeIsRead(id) {
            noticeIsRead(id).then(() => {
                this.receiveNoticeList()
            })
        },
        // 标记消息已读
        msgIsRead(id) {
            msgIsRead(id).then(() => {
                this.receiveMsgList()
            })
        },
        // 点击查看详情或者查看历史
        openMsgInfo(data) {
            if (this.msgCardType === 'notice') {
                if (data) this.noticeIsRead(data.id)
            } else {
                if (data) this.msgIsRead(data.id)
            }
            this.$emit('openMsgInfo', data ?? null, this.msgCardType)
        },
        // 关闭卡片
        closeMsgCard() {
            this.$emit('closeMsgCard')
        },
        // tabs点击
        handleClick() {
            this.$emit('cardTabClick', this.msgCardType)
        }
    }
}
</script>

<style lang="scss" scoped>
// 消息卡片
.msgCard {
    width: 220px;
    height: 300px;
    background: #fff;
    position: fixed;
    box-shadow: 0 0 10px #888;
    top: 130px;
    right: 0;
    border-radius: 10px;
    z-index: 4;
    @media screen and (max-width: 1440px) {
        top: 105px;
    }
    @media screen and (max-width: 992px) {
        top: 50px;
    }
    .btns {
        padding-right: 10px;
        line-height: 30px;
        font-size: 14px;
        text-align: right;
        span {
            cursor: pointer;
        }
    }
    ::v-deep .el-tabs {
        height: 270px;
        .el-tabs__header {
            margin: 0;
            .el-tabs__nav-scroll {
                padding: 0 20px;
            }
        }
        .el-tabs__content {
            height: calc(100% - 40px);
            padding: 10px 0 0;
            .el-tab-pane {
                height: 100%;
                overflow-y: auto;
            }
        }
    }
    .listItem {
        padding: 0 10px;
        height: 60px;
        font-size: 12px;
        margin-bottom: 10px;
        &:hover {
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
</style>

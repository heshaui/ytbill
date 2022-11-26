<template>
    <div class="remindCard">
        <div class="cardTop">
            <span><i class="el-icon-alarm-clock" /></span>
            <span> 任务提醒 </span>
        </div>
        <div class="cardCon">
            <p>
                <el-row>
                    <el-col :span="6" align="right">内容：</el-col>
                    <el-col :span="18" align="justify">{{ remindData.content }}</el-col>
                </el-row>
            </p>
            <p>
                <el-row>
                    <el-col :span="6" align="right">时间：</el-col>
                    <el-col :span="18" align="justify">今天 {{ remindData.time }}</el-col>
                </el-row>
            </p>
        </div>
        <div class="cardBtn">
            <span @click="delayRemind">稍后提醒</span>
            <el-button type="primary" size="small" @click="closeRemind">我已完成</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            remindData: {
                content: '今天是7月14日，您需要前往***执行重要任务，任务相关文件已发送到您的邮箱。',
                time: '15:43'
            }
        }
    },
    methods: {
        delayRemind() {
            this.$emit('delayRemind')
        },
        closeRemind() {
            this.$emit('closeRemind')
        }
    }
}
</script>

<style lang="scss" scoped>
// 提醒卡片
.remindCard {
    width: 400px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 20px;
    position: fixed;
    top: 120px;
    right: 0;
    border-radius: 10px;
    z-index: 4;
    @media screen and (max-width: 1440px) {
        top: 95px;
    }
    .cardTop {
        height: 30px;
        display: flex;
        align-items: center;
        & > span {
            margin-right: 15px;
            font-size: 14px;
            font-weight: bold;
            & > i {
                font-size: 20px;
                color: #2769f4;
            }
        }
    }
    .cardCon {
        font-size: 12px;
    }
    .cardBtn {
        text-align: right;
        span {
            margin-right: 20px;
            font-size: 14px;
            cursor: pointer;
            &:hover {
                color: #2769f4;
            }
        }
    }
}
</style>

<template>
    <div class="page-main" :class="{'hasPadding':isPadding}">
        <div v-if="pageTit" class="pageTit" :class="{'hasBottom':isPadding}" :style="$isXs ? 'margin: 20px 0;' : ''">
            <div class="titbox">
                <i v-if="goBack" class="el-icon-arrow-left" title="返回" @click="$router.go(-1)" />
                <span>{{ pageTit }}</span>
            </div>
            <div class="rightBox">
                <slot name="titBtns" />
            </div>
        </div>
        <div :class="{'background':background, 'padB0': padB0, 'padB10': padB10}"><slot /></div>
    </div>
</template>

<script>
export default {
    name: 'PageMain',
    props: {
        pageTit: {
            type: String,
            default: ''
        },
        background: {
            type: Boolean,
            default: false
        },
        padB0: {
            type: Boolean,
            default: false
        },
        padB10: {
            type: Boolean,
            default: false
        },
        goBack: {
            type: Boolean,
            default: false
        },
        isPadding: {
            type: Boolean,
            default: true
        }

    }
}
</script>

<style lang="scss" scoped>
.page-main {
    position: relative;
    border-radius: 5px;
    &.hasPadding {
        padding: 20px;
    }
    @media screen and (max-width: 765px) {
        &.hasPadding {
            padding: 0;
        }
    }
    .pageTit {
        border-bottom: 2px solid #eee;
        position: relative;
        & > .titbox {
            display: inline-block;
            font-weight: 400;
            border-bottom-style: solid;
            border-bottom-width: 2px;
            padding: 10px;
            padding-top: 0;
            color: #606266;
            position: relative;
            top: 2px;
            & > i {
                font-size: 25px;
                margin-right: 10px;
                float: left;
            }
            & > span {
                font-size: 18px;
            }
            @media (max-width: 1440px) {
                & > span {
                    font-size: 16px;
                }
            }
        }
        .rightBox {
            width: 50%;
            float: right;
            text-align: right;
        }
        &.hasBottom {
            margin-bottom: 20px;
        }
    }
    .background {
        background-color: #fff;
        padding: 20px;
    }
    .padB0 {
        padding-bottom: 0;
    }
    .padB10 {
        padding-bottom: 5px;
    }
}
</style>

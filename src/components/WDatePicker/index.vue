<template>
    <el-date-picker
        v-model="time"
        v-timeBlur
        :type="type"
        unlink-panels
        :editable="false"
        :range-separator="$isXs ? '-' : '至'"
        :format="format"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        value-format="timestamp"
        style="width: 100%;"
        :default-time="['00:00:00', '23:59:59']"
        :picker-options="pickerOptions"
        :size="size"
        @change="changeTime"
    />
</template>

<script>
import { timeFrame } from '@/util/index'
export default {
    name: 'WDatePicker',
    props: {
        value: {
            type: Array,
            default() {
                return []
            }
        },
        type: {
            type: String,
            default: 'datetimerange'
        },
        format: {
            type: String
        },
        size: {
            type: String
        },
        pickerOptions: {
            type: Object,
            default() {
                return {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            timeFrame(picker, 7)
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            timeFrame(picker, 30)
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            timeFrame(picker, 90)
                        }
                    }]
                }
            }
        }
    },
    data() {
        return {
            time: []
        }
    },
    watch: {
        value(newValue) {
            this.time = newValue
        }
    },
    methods: {
        changeTime(val) {
            this.$emit('changeTime', val)
        }
    }
}
</script>

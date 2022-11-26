<template>
    <page-main background>
        <el-form :model="form" :label-width="$isXs ? '' : '80px'" class="searchForm">
            <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                    <el-form-item label="呼叫时间">
                        <w-date-picker :value="form.time" :size="$isLg ? 'small' : ''" type="daterange" @changeTime="val => form.time=val" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                    <el-form-item :align="$isXs ? 'right' : 'center' ">
                        <el-button type="primary" :loading="isLoading" :size="$isLg ? 'small' : ''" @click="onSearch">查 询</el-button>
                        <el-button type="danger" :loading="isLoading" :size="$isLg ? 'small' : ''" @click="onReset">重 置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <w-table
            ref="myTable"
            :data="tableData.records"
            :columns="columns"
            :total="tableData.total"
            :tools="tools"
            :t-height="tHeight"
            :is-loading="isLoading"
            :pagination="pagination"
        >
            <template #operation>
                <el-table-column label="操作" width="100" align="center" :fixed="$isXs ? null : 'right'">
                    <template #default="scope">
                        <el-button size="mini" type="success" icon="el-icon-edit" @click="toDetail(scope.row, 'edit')">编辑</el-button>
                    </template>
                </el-table-column>
            </template>
        </w-table>
    </page-main>
</template>

<script>
import { getBillList } from '@/api/ytbill'
import { getHeight, initTableData, timeSlot } from '@/util/index'
import exportAll from '@/util/exportAll'
const tHeight = () => {
    let otherH = getHeight() - 360
    let tHeight = otherH > 528 ? otherH : 528
    return tHeight
}
export default {
    // 注销监听事件
    beforeRouteLeave(to, from, next) {
        window.removeEventListener('resize', this.handleH)
        next()
    },
    data() {
        let _this = this
        return {
            // from表单
            form: {
                time: []
            },
            isLoading: false,
            // 表格高度
            tHeight: tHeight(),
            // 表格数据
            tableData: {
                records: [],
                total: 0
            },
            tools: [
                {
                    label: '全部导出',
                    icon: 'el-icon-upload2',
                    size: 'small',
                    type: 'success',
                    method: () => {
                        const params = {
                            startTime: this.form.time[0],
                            endTime: this.form.time[1]
                        }
                        exportAll.call(this, '', params, '账单')
                    }
                }
            ],
            // 列组
            columns: [
                {
                    prop: 'ctime', label: '日期', minWidth: '120px', align: 'center',
                    formatter(row) {
                        if (row.ctime) {
                            return _this.$dayjs(row.ctime).format('YYYY-MM-DD')
                        } else {
                            return ''
                        }
                    }
                },
                {prop: 'callNum', label: '外呼总数', minWidth: '120px', align: 'center', tooltip: true},
                {prop: 'shopName', label: '计费分钟量', minWidth: '120px', align: 'center', tooltip: true},
                {prop: 'shopId', label: '呼出量', minWidth: '120px', align: 'center', tooltip: true},
                {prop: 'shopId', label: '呼出计费分钟数量', minWidth: '120px', align: 'center', tooltip: true},
                {prop: 'shopId', label: '呼入量', minWidth: '120px', align: 'center', tooltip: true},
                {prop: 'shopId', label: '呼入计费分钟数量', minWidth: '120px', align: 'center', tooltip: true}
            ],
            // 分页组件
            pagination: {
                pagesize: 10,
                currentPage: 1
            }
        }
    },
    mounted() {
        // 监听resize事件
        window.addEventListener('resize', this.handleH)
        this.form.time = timeSlot(1)
        // 渲染列表
        this.getList()
    },
    methods: {
        // 监听表格高度函数
        handleH() {
            this.tHeight = tHeight()
        },
        // 查询
        onSearch() {
            this.pagination.currentPage = 1
            this.getList()
        },
        // 重置
        onReset() {
            this.form = this.$options.data().form
            this.pagination.currentPage = 1
            this.getList()
        },
        // 获取列表数据
        getList() {
            this.isLoading = true
            const params = {
                pageNo: this.pagination.currentPage,
                pageSize: this.pagination.pagesize
            }
            if (this.form.time?.length > 1) {
                params.startTime = this.form.time[0]
                params.endTime = this.form.time[1]
            }
            getBillList(params).then(res => {
                this.isLoading = false
                if (res.data) {
                    this.tableData = res.data
                }
            }).catch(() => {
                this.isLoading = false
                initTableData(this)
            })
        }
    }
}
</script>


import { local } from '@/util/storage'
const state = {
    // 任务列表消息推送
    msgNum: 0,
    // main的高度  autoH： true 自适应高度  false 100%
    autoH: false,
    // 座席监控数据
    seatsMonitorData: local.getItem('seatsMonitorData') || {},
    // 座席状态
    seatState: '空闲',
    // 任务提醒数据
    remindData: local.getItem('remindData') || {},
    // 机器人数据
    robotData: local.getItem('robotData') || {},
    // 聊天数据
    imMessage: local.getItem('imMessage') || {},
    msgList: local.getItem('msgList') || [],
    imNum: local.getItem('imNum') || 0
}
const mutations = {
    addMsgNum(state) {
        return state.msgNum++
    },
    autoH(state, onOff) {
        state.autoH = onOff
    },
    setSeatsData(state, data) {
        state.seatsMonitorData = data
        local.setItem('seatsMonitorData', data)
    },
    editSeatState(state, seatState) {
        state.seatState = seatState
    },
    setRemindData(state, data) {
        state.remindData = data
        local.setItem('remindData', data)
    },
    setRobotData(state, data) {
        state.robotData = data
        local.setItem('robotData', data)
    },
    setImMessage(state, data) {
        state.imMessage = data
        local.setItem('imMessage', data)
    },
    setImNum(state, mark) {
        if (mark === 'add') {
            state.imNum++
            local.setItem('imNum', state.imNum)
        } else {
            state.imNum = 0
            local.setItem('imNum', 0)
        }
    },
    setMsgList(state, data, type) {
        if (type === 'unread') {
            state.msgList.push(data)
            local.setItem('msgList', state.msgList)
        } else {
            state.msgList = []
            local.setItem('msgList', [])
        }
    }
}
export default {
    state,
    mutations
}

// 圆通账单
import api from './index'

// 获取账单列表
export function getBillList(params) {
    return api.get('/bill/page', {
        params: params
    })
}

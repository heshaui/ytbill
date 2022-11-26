import axios from 'axios'
import { downMethod } from '@/util/index'
/**
 *
 * @param {*} url 服务地址
 * @param {*} params 参数对象
 * @param {*} fileName 导出的文件名称
 * @param {*} type 服务的路由 目前两种：obc / stat
 */
function exportAll (url, params, fileName = '呼叫记录', type = 'stat', method = 'post') {
    const info = this.$message({
        type: 'info',
        message: '正在导出，请耐心等待！',
        duration: 0,
        showClose: true
    })
    let name = fileName
    let baseUrl = type === 'obc' ? this.$baseUrl : this[`$${type}`]
    try {
        let config = {
            url: `${baseUrl}${url}`,
            method,
            responseType: 'arraybuffer',
            headers: {
                Authorization: localStorage.token
            }
        }
        if (method == 'post') {
            config.data = params
        } else if (method == 'get') {
            config.params = params
        }
        axios(config).then(res => {
            const sblod = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })
            let dUrl = ''
            if (window.URL) {
                dUrl = window.URL.createObjectURL(sblod)
            } else {
                dUrl = sblod
            }
            downMethod(dUrl, name)
            info.close()
        }).catch((err) => {
            info.close()
            this.$message.error(err)
        })
    } catch(err) {
        console.log(err)
        info.close()
    }
}
export default exportAll

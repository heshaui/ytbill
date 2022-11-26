import axios from 'axios'

export default async function isToken() {
    try {
        const res = await axios.get(`${window.config.APP_HOST || '/obc'}/user/token/check/${localStorage.token}`)
        if (res.data.code === '0' && res.data.msg === 'success') {
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}


/**
 * 引入需要展示的各页面
 */
const pages = []
const require_pages = require.context('./modules', true, /.js$/)
require_pages.keys().forEach(file_name => {
    pages.push(require_pages(file_name).default)
})
export default pages

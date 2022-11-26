import Vue from 'vue'

// table表格拖拽滚动指令
Vue.directive('tableDrag', {
    inserted: function(el, binding) {
        if (binding.value == '1') {
            el = el.getElementsByClassName('el-table__body-wrapper')[0]
            el.style.cursor = 'grab'
            el.onmousedown = function() {
                let gapX = event.clientX
                let startX = el.scrollLeft
                document.onmousemove = function(e) {
                    let x = e.clientX - gapX
                    el.scrollLeft = startX - x
                    return false
                }
                document.onmouseup = function() {
                    document.onmousemove = null
                    document.onmouseup = null
                }
            }
        }
    }
})

// 时间组件在移动端不显示软键盘指令
Vue.directive('timeBlur', {
    inserted: function(el) {
        el = el.querySelectorAll('input')[0]
        el.addEventListener('focus', () => {
            const elPicker = document.querySelectorAll('.el-picker-panel')
            elPicker.forEach(j => {
                document.activeElement.blur()
                let inputTime = j.querySelectorAll('.el-input__inner')
                inputTime.forEach(v => {
                    v.addEventListener('focus', () => {
                        document.activeElement.blur()
                    })
                })
            })

        })
    }
})

Vue.directive('trigger', {
    inserted(el) {
        el.click()
    }
})

// 滚动加载更多
Vue.directive('loadMore', {
    bind(el, binding) {
        // 获取element，定义scroll
        let select_dom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        select_dom.addEventListener('scroll', function() {
            let height = this.scrollHeight - this.scrollTop <= this.clientHeight
            if (height) {
                binding.value()
            }
        })
    }
})

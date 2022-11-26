import store from '@/store/index'
import dayjs from 'dayjs'

// 深拷贝
export function deepClone(target) {
    // 定义一个变量
    let result
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
    // 如果是一个数组的话
        if (Array.isArray(target)) {
            result = [] // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
                // 递归克隆数组中的每一项
                result.push(deepClone(target[i]))
            }
            // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
            result = null
            // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
            result = target
        } else {
            // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {}
            for (let i in target) {
                result[i] = deepClone(target[i])
            }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
        result = target
    }
    // 返回最终结果
    return result
}

// 判断对象是否相等
export function deepCompare(x, y) {
    var i, l, leftChain, rightChain;

    function compare2Objects(x, y) {
        var p;

        // remember that NaN === NaN returns false
        // and isNaN(undefined) returns true
        if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
            return true;
        }

        // Compare primitives and functions.
        // Check if both arguments link to the same object.
        // Especially useful on the step where we compare prototypes
        if (x === y) {
            return true;
        }

        // Works in case when functions are created in constructor.
        // Comparing dates is a common scenario. Another built-ins?
        // We can even handle functions passed across iframes
        if ((typeof x === 'function' && typeof y === 'function') ||
            (x instanceof Date && y instanceof Date) ||
            (x instanceof RegExp && y instanceof RegExp) ||
            (x instanceof String && y instanceof String) ||
            (x instanceof Number && y instanceof Number)) {
            return x.toString() === y.toString();
        }

        // At last checking prototypes as good as we can
        if (!(x instanceof Object && y instanceof Object)) {
            return false;
        }

        if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
            return false;
        }

        if (x.constructor !== y.constructor) {
            return false;
        }

        if (x.prototype !== y.prototype) {
            return false;
        }

        // Check for infinitive linking loops
        if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
            return false;
        }

        // Quick checking of one object being a subset of another.
        // todo: cache the structure of arguments[0] for performance
        for (p in y) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }
        }

        for (p in x) {
            if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
                return false;
            } else if (typeof y[p] !== typeof x[p]) {
                return false;
            }

            switch (typeof(x[p])) {
                case 'object':
                case 'function':

                    leftChain.push(x);
                    rightChain.push(y);

                    if (!compare2Objects(x[p], y[p])) {
                        return false;
                    }

                    leftChain.pop();
                    rightChain.pop();
                    break;

                default:
                    if (x[p] !== y[p]) {
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
    }

    for (i = 1, l = arguments.length; i < l; i++) {

        leftChain = []; //Todo: this can be cached
        rightChain = [];

        if (!compare2Objects(arguments[0], arguments[i])) {
            return false;
        }
    }

    return true;
}

// 获取权限
function hasPermission(permission) {
    if (store.state.settings.openPermission) {
        return store.state.user.permissions.some(v => {
            return v === permission
        })
    } else {
        return true
    }
}

// 鉴权函数
export function auth(value) {
    let auth
    if (typeof value === 'string') {
        auth = hasPermission(value)
    } else {
        auth = value.some(item => {
            return hasPermission(item)
        })
    }
    return auth
}

// 鉴权函数
export function authAll(value) {
    const auth = value.every(item => {
        return hasPermission(item)
    })
    return auth
}

// 获取屏幕可见区域宽度
export function getWidth() {
    return document.documentElement.clientWidth || document.body.clientWidth
}

// 获取屏幕可见区域高度
export function getHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight
}

/**
 *  下载文件方法
 *  @param {Object}    param       文件参数
 *  @param {function}  callback    返回结果
 *  @param return
 */
export function downloadFiles(param, callback) {
    if (param.response.length > 1) {
        let str = ''
        // console.log(str)
        param.response.map(v => {
            let n = ''
            v.split(',').map((val, key) => {
                if ((val && val.length > 15) && (!isNaN(Number(val)))) {
                    n += `${val}\t,`
                } else {
                    if (key === v.split(',').length - 1) {
                        n += `${val}`
                    } else {
                        n += `${val},`
                    }
                }
            })
            if (n) str += n + '\n'
            else str += v + '\n'
        })
        param.response = str
    }
    const blob = new Blob(['\ufeff' + param.response])

    // const blob = new Blob([param.response], {type: 'text/csv,charset=UTF-8'})
    if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = param.filename
        elink.style.display = 'none'
        elink.href = window.URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        window.URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        setTimeout(() => {
            if (callback) callback()
        }, 100)
    } else { // IE10+下载
        window.navigator.msSaveBlob(blob, param.filename)
        setTimeout(() => {
            if (callback) callback()
        }, 100)
    }
}

/**
 * 导出csv
 */
// 导入
import json2csv from 'json2csv'
export function exportCsv(name, fields) {
    const result = json2csv.parse([], {
        fields: fields,
        excelStrings: true
    })
    let url = 'data:text/csv;charset=utf-8,\ufeff' + result
    downMethod(url, name)
}

/**
 * 创建下载方法
 */
export function downMethod(url, name) {
    let downloadLink = document.createElement('a')
    downloadLink.href = encodeURI(url)
    downloadLink.download =  name || '' // `${name}.csv`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}

/**
 * 获取周数
 */
export function getWeek(dateTime) {
    let temptTime = dateTime
    // 周几
    let weekday = temptTime.getDay() || 7
    // 周1+5天=周六
    temptTime.setDate(temptTime.getDate() - weekday + 1 + 5)
    let firstDay = new Date(temptTime.getFullYear(), 0, 1)
    let dayOfWeek = firstDay.getDay()
    let spendDay = 1
    if (dayOfWeek != 0) {
        spendDay = 7 - dayOfWeek + 1
    }
    firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay)
    let d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000)
    let result = Math.ceil(d / 7)
    return result
}

/**
 * 将小数转换为百分数
 */
export function toPercent(point, num) {
    var str = Number(point * 100).toFixed(0)
    if (num) str = Number(point * 100).toFixed(num)
    str += '%'
    return str
}

/**
 * 功能： 提取url中某个参数的值
 * 第二个参数url可以没有(如果url没有或者为空，取得的是本页面的url)
 * name为url中的变量名 url为请求的url
 *
 * 举例
 * *******************************************************************************************
 * 请求的url为
 * http://localhost:8081/lar-center-search-web/page/periodical/periodical.html?thisPPPara=31415926
 * var result =
 * getParamFromUrl('thisPPPara','http://localhost:8081/lar-center-search-web/page/periodical/periodical.html?thisPPPara=31415926')
 * result的结果为'31415926'
 * *******************************************************************************************
 */
export function getParamFromUrl(name, url) {
    if (!url) {
        url = location.href
    }
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
    let regexS = '[\\?&]' + name + '=([^&#]*)'
    let regex = new RegExp(regexS)
    let results = regex.exec(url)
    return results === null ? null : results[1]
}

/**
 * 时间置末
 * 分： 默认到最后一秒
 * 时： 默认到最后一分最后一秒
 * 也就是不管选择的日期格式是啥，都默认到最后一秒
 * type: 时间类型
 * time: 需要处理的时间，一般为结束时间
 */
export function timeCompletion(type, time) {
    let endTime, oneDay, nextMonthFirstDay
    switch (type) {
        case 'minute': endTime = dayjs(time).format('YYYY-MM-DD HH:mm:59'); break
        case 'hour': endTime = dayjs(time).format('YYYY-MM-DD HH:59:59'); break
        case 'day': endTime = dayjs(time).format('YYYY-MM-DD 23:59:59'); break
        case 'month':
            oneDay = 1000 * 60 * 60 * 24 // 一天时间的毫秒数
            nextMonthFirstDay = dayjs(time).add('1', 'month') // 获取到下个月的第一天
            endTime = dayjs(nextMonthFirstDay - oneDay).format('YYYY-MM-DD 23:59:59')
            break
        case 'week': endTime = dayjs(time).add('6', 'day').format('YYYY-MM-DD 23:59:59'); break
        case 'year': endTime = dayjs(time).format('YYYY-12-31 23:59:59')
    }
    return endTime
}

// 校验失败后获取焦点
export function getFocus() {
    setTimeout(() => {
        var isError = document.getElementsByClassName('is-error')
        isError[0].querySelector('input').focus()
    }, 100)
    return false
}

// 将秒转化为时分秒
export function second(value) {
    let theTime = parseInt(value) // 秒
    let middle = 0 // 分
    let hour = 0 // 小时

    if (theTime > 60) {
        middle = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (middle > 60) {
            hour = parseInt(middle / 60)
            middle = parseInt(middle % 60)
        }
    }
    let result = `${parseInt(theTime)}秒` // '' + parseInt(theTime) + '秒'
    if (middle > 0) {
        result = `${parseInt(middle)}分${result}` // '' + parseInt(middle) + '分' + result
    }
    if (hour > 0) {
        result = `${parseInt(hour)}小时${result}` // '' + parseInt(hour) + '小时' + result
    }
    return result
}

// 将秒转化为分，且向上取整
export function getMinute(val) {
    let m =  Math.ceil(val / 60)
    return m + '分'
}

// 将对象数组按某个属性分类
const  groupBy = (array, f) => {
    const groups = {}
    array.forEach(function(o) {
        const group = JSON.stringify(f(o))
        groups[group] = groups[group] || []
        groups[group].push(o)
    })
    return Object.keys(groups).map(function(group) {
        return groups[group]
    })
}
export function arrayGroupBy(list, groupId) {
    const sorted = groupBy(list, function(item) {
        return [item[groupId]]
    })
    return sorted
}

// 根据语音文件转换成可用的url
export function readerAudio(file) {
    // 将语音文件转换成可播放的url
    const reader = new FileReader()
    let result = null
    reader.readAsDataURL(file)
    // 转换成功后的操作，reader.result即为转换后的DataURL
    result = reader.onload = () => reader.result
    return result
}

// 判断今天还是昨天
export function isToday(time) {
    const today = dayjs().format('YYYY-MM-DD')
    const yesterday = dayjs().subtract(1).format('YYYY-MM-DD')
    const dayTime = dayjs(time).format('YYYY-MM-DD')
    let hourTime = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    if (dayTime === today) {
        hourTime = hourTime.replace(dayTime, '今天')
    } else if (dayTime === yesterday) {
        hourTime = hourTime.replace(dayTime, '昨天')
    }
    return hourTime
}

// 脱敏通用方法
export function tuoM(str, beginLen, repLen){
    if (str && str !== '' && str !== 'null') {
        const strArr = str.split('')
        strArr.splice(beginLen, repLen, '*'.repeat(repLen))
        const tempStr = strArr.join('')
        return tempStr
    } else {
        return ''
    }
}

// 时间组件初始化默认时间00:00:00 - 23:59:59
export function initStart(value) {
    const start = dayjs(value).format('YYYY-MM-DD 00:00:00')
    const startTime = dayjs(start)
    return startTime
}
export function initEnd(value) {
    const end = dayjs(value).format('YYYY-MM-DD 23:59:59')
    const endTime = dayjs(end)
    return endTime
}
export function timeFrame(picker, days) {
    const end = dayjs(initEnd(new Date())).valueOf()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
    const startTime = dayjs(initStart(start)).valueOf()
    picker.$emit('pick', [startTime, end])
}

export function timeSlot(days) {
    const end = dayjs(initEnd(new Date())).valueOf()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
    const startTime = dayjs(initStart(start)).valueOf()
    return [
        startTime,
        end
    ]
}

// 默认今天00:00 - 23:59
export function initToday(target) {
    const startTime = new Date(new Date(new Date().toLocaleDateString()).getTime()) // 当天0点
    const endTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) // 当天23:59
    target.form.time = [dayjs(startTime).valueOf(), dayjs(endTime).valueOf()]

}

// 初始化表格数据
export function initTableData(target) {
    target.tableData = {
        records: [],
        total: 0
    }
}

// 根据parentId将数据递归成树状
export function arrToTree1(data) {
    let parents = data.filter(value => value.parentId == 'undefined' || value.parentId == null)
    let children = data.filter(value => value.parentId !== 'undefined' && value.parentId != null)
    let translator = (parents, children) => {
      parents.forEach((parent) => {
        children.forEach((current, index) => {
          if (current.parentId === parent.id) {
            let temp = JSON.parse(JSON.stringify(children))
            temp.splice(index, 1)
            translator([current], temp)
            parent?.children ? parent.children.push(current) : parent.children = [current]
          }
        }
        )
      }
      )
    }

    translator(parents, children)
    return parents
}

export function arrToTree(data) {
    var array = [];
    var iterator1 = function (treeNodes) {
        if (!treeNodes || !treeNodes.length) return;
        var node,parent,i = 0,obj = {};
        while(i < treeNodes.length ){
            node = treeNodes[i++];
            obj[node.id] = node;
            if(node.parentId){
                parent = obj[node.parentId];
                if (parent) {
                    if(parent?.children){
                        parent.children.push(node);
                    }else{
                        parent.children = [node];
                    }
                } else {
                    node["parIndex"] = 1;
                    array.push(node);
                }
            }else{
                node["parIndex"] = 1;
                array.push(node);
            }
        }
        return array;
    }
    return iterator1(data)
}

/**
 * 生产uuid
 */
export function getUUID() {
    return Math.random().toString(36).substr(3, 10)
}

/**
 * 将数组分割成多个数组
 */
export function  setArrGroup(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}

/**
 * 对象数组去重
 */
export function objArrRepeat(data, key) {
    const obj = {}
    const arr = data.reduce((targetArr, current) => {
        obj[current[key]] ? '' : obj[current[key]] = true && targetArr.push(cuttent)
        return targetArr
    }, [])
    return arr
}

/**
 * 处理area, 删除区，只留省市
 */

export function getCity(area) {
    const data = deepClone(area)
    const handleData = (function f(citys, isChild){
        for (let item of citys) {
            if (isChild) {
                delete item.children
            }
            if (item.name.lastIndexOf('市') > -1) {
                delete item.children
            } else if (item.name.lastIndexOf('省') > -1 || item.name.lastIndexOf('自治区') > -1) {
                f(item.children, true)
            }
        }
    })
    handleData(data, false)
    return data
}

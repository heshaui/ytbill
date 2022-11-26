const fs = require('fs');
const path = require('path');

if (fs.existsSync(path.join('./obc_web/static'))) {
    removeFileDir('./obc_web/static')
    addVersion()
    console.log('已删除./obc_web/static')
} else {
    console.log('未找到./obc_web/static')
}

function removeFileDir (path) {
    var files = fs.readdirSync(path);
    for (let item of files) {
        var stats = fs.statSync(`${path}/${item}`);
        if (stats.isDirectory()) {
            removeFileDir(`${path}/${item}`)
        } else {
            fs.unlinkSync(`${path}/${item}`)
        }
    }
    fs.rmdirSync(path)
}

function addVersion() {
    fs.copyFile('./src/version.json', './obc_web/js/version.json', err => {
        if (err) console.log('version添加失败')
        else console.log('version添加成功')
    })
}

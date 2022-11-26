const archiver = require('archiver')
const fs = require('fs')
const path = require('path')

// 读取version
const versionObj = fs.readFileSync('./src/version.json')
const version = JSON.parse(versionObj).version

// 输入路径
const filePath = path.resolve(__dirname, '../obc_web/')
// 输出路径
const zipPath = path.resolve(__dirname, `../obc_web-${version}.zip`)

// 压缩
function compress() {
	const output = fs.createWriteStream(zipPath)//设置一下输出流
	const archive = archiver('zip', {
	  zlib: {
	    level: 9// 配置压缩等级
	  }
	})
	archive.directory(filePath, false)
	archive.pipe(output) // 将打包对象与输出流关联
	// 监听所有archive数据都写完
	output.on('close', function () {
	  console.log(`压缩完成，文件为obc_web-${version}.zip`, archive.pointer() / 1024 / 1024 + 'M')
	})
	archive.on('error', function (err) {
	  throw err
	})
	// 打包
	archive.finalize()
}
compress()

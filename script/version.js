const fs = require('fs');
const path = require('path');
const version = require('../src/version.json').version;

// 版本号末位 ++

let versionArr = version.split('.');

let right = versionArr[versionArr.length - 1];

right++;

versionArr[versionArr.length - 1] = right;

let newVersion = versionArr.join('.');

console.log('当前发布OBC版本: ', newVersion);

replaceFile(path.join(__dirname, '../src/version.json'), `"version": "${version}"`, `"version": "${newVersion}"`);



function replaceFile (filePath,sourceRegx,targetStr){
    fs.readFile(filePath,function(err,data){
        if(err){
            return err;
        }
        let str = data.toString();
        str = str.replace(sourceRegx,targetStr);
        fs.writeFile(filePath, str, function (err) {
            if (err) return err;
        });
    });
}
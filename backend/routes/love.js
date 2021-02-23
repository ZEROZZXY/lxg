const express = require('express');
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const {user} = require('../db/index')

let public_key = fs.readFileSync(path.join(__dirname, '../rsa/public_key.pem'))

router.post('/', async(req, res, next) => {
    const decode = jwt.verify(req.body.token, public_key); //解码后通过decode去数据库找用户的相关信息
    console.log(req.body.type)
    switch (req.body.type) {
        case 'mark': //收藏
            req.body.token=decode
            const markResult= await user.mark(req.body);
            res.render('love', {
                data: JSON.stringify({
                    status: markResult.status,
                    info: markResult.info
                })
            })
            break;
        case 'markFlag': //是否收藏
            req.body.token=decode
            const markFlagResult= await user.markFlag(req.body);
            res.render('love', {
                data: JSON.stringify({
                    status: markFlagResult.status,
                    info: markFlagResult.info
                })
            })
            break;       
        case 'getLove': //获取收藏列表
            req.body.token=decode
            const result=await user.getLove(req.body);
            res.render('love', {
                data: JSON.stringify({
                    status: result.status,
                    info: result.info
                })
            })
            break;
        case 'saveLove': //保存收藏列表
            req.body.token=decode
            user.saveLove(req.body);
            break;
        default:
            break;
    }
    
})

//导出模块
module.exports = router;
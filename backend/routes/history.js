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
        case 'addHistory': //足迹
            req.body.token=decode
            user.addHistory(req.body);
            break;    
        case 'getHistory': //获取购物车列表
            req.body.token=decode
            const result=await user.getHistory(req.body);
            res.render('history', {
                data: JSON.stringify({
                    status: result.status,
                    info: result.info
                })
            })
            break;
        case 'saveHistory': //保存购物车
            req.body.token=decode
            user.saveHistory(req.body);
            break;
        default:
            break;
    }
    
})

//导出模块
module.exports = router;
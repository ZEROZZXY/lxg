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
        case 'mine': //获取用户个人信息
            res.render('mine', { 
                data: JSON.stringify({
                    status: 200,
                    info: decode
                })
            })
            break;
        case 'home': //首页判断token
            res.render('mine', { 
                data: JSON.stringify({
                    status: 200,
                    info: '已登录'
                })
            })
            break; 
        default:
            break;
    }
    
})

//导出模块
module.exports = router;
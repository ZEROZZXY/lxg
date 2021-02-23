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
        case 'addShop': //加入购物车
            req.body.token=decode
            user.addShop(req.body);
            res.render('shopCar', {
                data: JSON.stringify({
                    status: 200,
                    info: '添加成功'
                })
            })
            break;
         case 'getShopCar': //获取购物车列表
            req.body.token=decode
            const result=await user.getShop(req.body);
            console.log(result)
            res.render('shopCar', {
                data: JSON.stringify({
                    status: result.status,
                    info: result.info
                })
            })
            break;
        case 'saveShopCar': //保存购物车
            req.body.token=decode
            const saveResult=await user.saveShop(req.body);
            console.log(saveResult)
            res.render('shopCar',{
                data:JSON.stringify({
                    status:saveResult.status
                })
            })
            break;
        default:
            break;
    }
    
})

//导出模块
module.exports = router;
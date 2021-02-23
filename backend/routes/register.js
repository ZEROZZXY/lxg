// 注册接口
const express = require('express');
const {user} = require('../db/index')

// 1.创建router模块
const router = express.Router();

// 2.创建接口
router.post('/', async(req, res, next) => {
    // reg.render(模板，数据)

    const result = await user.reg(req.body)
    
    res.render('reg', {
        data: JSON.stringify({
            status: result.status,
            info: result.info
        })
    })
})

//导出模块
module.exports = router;



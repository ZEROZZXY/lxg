const express = require('express');
const {user} = require('../db/index')
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
var cookie = require('cookie-parser');

let private_key = fs.readFileSync(path.join(__dirname, '../rsa/private_key.pem'))
let public_key = fs.readFileSync(path.join(__dirname, '../rsa/public_key.pem'))

router.post('/', async(req, res, next) => {
    const result = await user.login(req.body)

    if(result.status){ //登录失败
        res.render('login', {
            data: JSON.stringify({
                status: result.status,
                info: result.info
            })
        })
    }else{ //登录成功
        const token = jwt.sign(req.body.username, private_key, { algorithm: 'RS256' });
        res.render('login', {
            data: JSON.stringify({
                status: result.status,
                info: result.info,
                token
            })
        })
    }
    
})

module.exports = router;
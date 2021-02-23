const mongoose = require('mongoose')

const connect = require('./connect.js')

connect.init()

const {userSchema} = require('./schema/index')

const userModel = mongoose.model('users',userSchema)

const db = {
  user:{
    //登录注册修改密码
    reg(data){ //注册
      return new Promise((resovle,reject) => {
        console.log('reg',data)
        userModel.find({username:data.username},(err,doc) => {
          const userFlag = doc.length; //用户名是否存在
          if(userFlag){
            resovle({
              status:1,
              info:'用户名已存在'
            })
          }else{
            userModel.find({mail:data.mail},(err,doc)=>{
              const mailFlag=doc.length; //邮箱是否存在
              if(mailFlag){
                resovle({
                  status:2,
                  info:'邮箱已被使用'
                })
              }else{
                const user = new userModel(data);
                user.save(err => {
                  if (err) {
                      resovle({
                          status: 3,
                          info: '系统错误'
                      })
                  } else {
                      resovle({
                          status: 0,
                          info: '注册成功'
                      })
                  }
                })
              }
            })
          }
        })
      })
    },
    login(data){ //登录
      return new Promise((resovle,reject) => {
        userModel.find({username:data.username},(err,doc) => {
          const f=doc.some(item=>(item.password == data.password));
          console.log(f)
          if(f){
            resovle({
              status:0,
              info:'登录成功'
            })
          }else{
            resovle({
              status:1,
              info:'用户名或密码错误'
            })
          }
        })
      })
    },
    modify(data){ //修改密码
      return new Promise((resovle,reject) => {
        userModel.find({username:data.username}, (err,doc) => {
          if(doc.length){
            const id = doc[0]._id;
            userModel.findById(id,(err,docs)=>{
              docs.password = data.password;
              docs.save(err =>{
                if(err){
                  resovle({
                    status: 1,
                    info: '系统错误'
                  })
                }else{
                  resovle({
                    status: 0,
                    info: '修改成功'
                  })
                }
              })
            })
          }else{
            resovle({
              status: 2,
              info: '用户名不存在'
            })
          }
        })
      })
    },
    //验证码
    checkVerInfo(data){ //获取验证码前，判断用户名邮箱是否匹配
      return new Promise((resovle,reject) => {
        userModel.find({username:data.username},(err,doc) => {
          const f=doc.some(item=>(item.mail == data.mail));
          if(f){
            resovle({
              status:0,
              info:'验证码已发送，有效期为5分钟'
            })
          }else{
            resovle({
              status:1,
              info:'用户名与邮箱不匹配'
            })
          }
        })
      })
    },
    saveVer(data){ //保存验证码和获取时间
      return new Promise((resolve,reject)=>{
        userModel.find({username:data.username},(err,doc)=>{
          const id = doc[0].id;
          userModel.findById(id,(err,docs)=>{
            docs.verCode = data.verCode;
            docs.codeTime = Date.now();
            docs.save();
          })
        })
      })
    },
    checkVer(data){ //验证码是否正确、是否失效
      return new Promise((resolve,reject)=>{
        userModel.find({username:data.username},(err,doc)=>{
          if(doc.length){
            if(data.verification == doc[0].verCode){
              if(Date.now()-doc[0].codeTime>300000){
                resolve({
                  status: 1,
                  info: '验证码已失效'
                })
              }else{
                resolve({
                  status: 0,
                  info: '验证成功'
                })
              }
            }else{
              resolve({
                status: 2,
                info: '验证码错误'
              })
            }
          }else{
            resolve({
              status: 3,
              info: '用户名不存在'
            })
          }
        })
      })
    },
    //购物车
    addShop(data){ //加入购物车
      // console.log(data)
      return new Promise((resovle,reject) => {
        userModel.find({username:data.token},(err,doc) => {
          const id = doc[0].id;
          userModel.findById(id,(err,docs)=>{
            if(docs.shopCar.some(item=>item.id==data.data.shopItem.id)){
              // console.log('已存在')
              const newShopCar=JSON.parse(JSON.stringify(docs.shopCar))
              newShopCar.map(item=>{
                if(item.id==data.data.shopItem.id){
                  item.num=item.num+1;
                }
              })
              docs.shopCar=newShopCar
              docs.save();
            }else{
                // console.log('不存在')
                docs.shopCar = docs.shopCar.concat(data.data.shopItem);
                docs.save();
              }   
          })
        })
      })
    },
    getShop(data){ //获取购物车列表
      // console.log(data)
      return new Promise((resovle,reject) => {
        userModel.find({username:data.token},(err,doc) => {
          resovle({
            status:0,
            info:doc[0].shopCar
          })
        })
      })
    },
    saveShop(data){ //保存购物车列表
      // console.log(data)
      return new Promise((resovle,reject) => {
        // console.log(data)
        userModel.find({username:data.token},(err,doc) => {
          const id = doc[0].id;
          userModel.findById(id,(err,docs)=>{
            if(err){
              resovle({
                status:0
              })
            }else{
              docs.shopCar=data.shopCar;
              docs.save();
              resovle({
                status:1
              })
            }
            
          })
        })
      })
    },
    //收藏
    mark(data){ //收藏
      return new Promise((resovle,reject) => {
        userModel.find({username:data.token},(err,doc) => {
          const id = doc[0].id;
          userModel.findById(id,(err,docs)=>{
            if(docs.love.some(item=>item.id==data.data.loveItem.id)){
              // console.log('已存在')
              const newLove=JSON.parse(JSON.stringify(docs.love))
              newLove.map((item,i)=>{
                if(newLove[i].id == data.data.loveItem.id){
                  newLove.splice(i,1)
                }
              })
              docs.love=newLove
              docs.save();
              resovle({
                status:0,
                info:'取消收藏成功'
              })
            }else{
                // console.log('不存在')
                docs.love = docs.love.concat(data.data.loveItem);
                docs.save();
                resovle({
                  status:0,
                  info:'收藏成功'
                })
              }   
          })
        })
      })
    },
    markFlag(data){ //是否收藏
      return new Promise((resovle,reject) => {
        console.log(data)
        userModel.find({username:data.token},(err,doc) => {
          const id = doc[0].id;
          userModel.findById(id,(err,docs)=>{
            console.log(data.data.id)
            if(docs.love.some(item=>item.id==data.data.id)){
              resovle({
                status:0,
                info:true
              })
            }else{
              resovle({
                status:1,
                info:false
              })
            }   
          })
        })
      })
    },
    getLove(data){ //获取收藏列表
      // console.log(data)
      return new Promise((resovle,reject) => {
        userModel.find({username:data.token},(err,doc) => {
          resovle({
            status:0,
            info:doc[0].love
          })
        })
      })
    },
    saveLove(data){ //保存收藏列表
      // console.log(data)
      return new Promise((resovle,reject) => {
        userModel.find({username:data.token},(err,doc) => {
          const id = doc[0].id;
          userModel.findById(id,(err,docs)=>{
            docs.love=data.love;
            docs.save();
          })
        })
      })
    },
    //足迹
    addHistory(data){ //足迹
      return new Promise((resovle,reject) => {
        userModel.find({username:data.token},(err,doc) => {
          const id = doc[0].id;
          userModel.findById(id,(err,docs)=>{
            if(!docs.history.some(item=>item.id==data.data.historyItem.id)){
              // console.log('不存在') //不存在需要写入，存在就不需要写入了
              docs.history=docs.history.concat(data.data.historyItem)
              docs.save();
            }
          })
        })
      })
    },
    getHistory(data){ //获取足迹列表
      // console.log(data)
      return new Promise((resovle,reject) => {
        userModel.find({username:data.token},(err,doc) => {
          resovle({
            status:0,
            info:doc[0].history
          })
        })
      })
    },
    saveHistory(data){ //保存足迹列表
      // console.log(data)
      return new Promise((resovle,reject) => {
        userModel.find({username:data.token},(err,doc) => {
          const id = doc[0].id;
          userModel.findById(id,(err,docs)=>{
            docs.history=data.history;
            docs.save();
          })
        })
      })
    }
  }
}


module.exports = {
  user:db.user
}
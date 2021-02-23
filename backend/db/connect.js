//数据库连接模块
const mongoose = require('mongoose')

const HOST_NAME = '127.0.0.1'

const PORT = '27017'

const DB_NAME = 'lxg'

const DB_URL = `mongodb://${HOST_NAME}:${PORT}/${DB_NAME}`

const connect = {
  init(){
    mongoose.connect(DB_URL,(err) => {
      if(err){
        console.log(err)
      }else{
        console.log('数据库连接成功')
      }
    })
  }
}

module.exports=connect
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username:String,
  password:String,
  mail:String,
  shopCar:Array,
  history:Array,
  love:Array,
  verCode:String,
  codeTime:Number
})

module.exports = userSchema;
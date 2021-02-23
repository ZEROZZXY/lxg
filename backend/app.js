var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var regRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var modifyRouter = require('./routes/modify');
var shopCarRouter = require('./routes/shopCar');
var loveRouter = require('./routes/love');
var historyRouter = require('./routes/history');
var getVerRouter = require('./routes/getVer');
var checkVerRouter = require('./routes/checkVer');
var mineRouter = require('./routes/mine');

var app = express(); //中间件

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//通过app对象的use方法来调用中间件，中间件是一个函数，具有一定的功能
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 跨域
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
}));

//路由配置，路由中间件
const api = express()
app.use('/api', api)
api.use('/register', regRouter);
api.use('/login', loginRouter);
api.use('/modify', modifyRouter);
api.use('/shopCar', shopCarRouter);
api.use('/love', loveRouter);
api.use('/history', historyRouter);
api.use('/getVer', getVerRouter);
api.use('/checkVer', checkVerRouter);
api.use('/mine', mineRouter);

// catch 404 and forward to error handler 错误处理
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

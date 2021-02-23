### 介绍
本项目是一个基于React的webapp，主要功能有：登录、注册、修改密码、找回密码、邮箱验证、返回顶部、模糊搜索、搜索记录、清除搜索记录、首页、分类、
个人中心、商品列表、条件查询、商品详情（商品信息、商品评价、商品详情、商品推荐）、定位滑动、收藏、加
入购物车、购物车所有功能、历史记录、退出登录等。

### 主要技术
#### 前端
1. 整个项目运用React框架进行搭建
2. 运用redux、react-redux进行分块式状态管理
3. 运用 react-router进行路由配置，页面跳转，路由传参
4. 使用 react-thunk中间件实现异步请求
5. 利用Ant Design Mobile中的组件进行页面的编写
6. 使用axios发送请求，并搭配使用axios拦截器
7. 运用rc-form进行表单编写

##### 使用
启动
```
yarn start or npm run start
```
打包
```
yarn build or npm run build
```

#### 后端
1. 使用express框架搭建后端
2. 数据库采用mongoDB
3. 商品数据拉取亲亲网数据
4. 使用nodemailer进行邮箱验证
5. 使用jsonwebtoken加密token

##### 使用
启动
```
yarn start or npm run start
```

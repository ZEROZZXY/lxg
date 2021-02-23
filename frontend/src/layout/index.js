import React, { Component } from 'react'
import Tabbar from '../components/tabbar'
import {Route,Switch,Redirect,withRouter} from 'react-router-dom'

import Home from '../pages/home'
import Category from '../pages/category'
import Shopcar from '../pages/shopcar'
import Mine from '../pages/mine'
import Error from '../pages/error'
import Login from '../pages/login'
import Register from '../pages/register'
import ForgetKey from '../pages/forgetKey'
import EditPassword from '../pages/editPassword'
import Search from '../pages/search'
import Nine from '../pages/nine'
import ShopList from '../pages/shopList'
import ShopDetail from '../pages/shopDetail'
import Favourite from '../pages/favourite'
import History from '../pages/history'
import Set from '../pages/set'
import Mask from '../components/mask'



class Layout extends Component {
  render() {
    return (
      <div className="layout">
        <Mask></Mask>
        <Switch>
          <Redirect from='/' to='/home' exact></Redirect>
          <Route path='/home' component={Home} exact></Route>
          <Route path='/category' component={Category} exact></Route>
          <Route path='/shopcar' component={Shopcar} exact></Route>
          <Route path='/mine' component={Mine} exact></Route>
          <Route path='/login' component={Login} exact></Route>
          <Route path='/register' component={Register}></Route>
          <Route path='/forgetKey' component={ForgetKey}></Route>
          <Route path='/editPassword' component={EditPassword}></Route>
          <Route path='/search' component={Search}></Route>
          <Route path='/nine' component={Nine}></Route>
          <Route path='/shopList' component={ShopList}></Route>
          <Route path='/shopDetail' component={ShopDetail}></Route>
          <Route path='/favourite' component={Favourite}></Route>
          <Route path='/history' component={History}></Route>
          <Route path='/set' component={Set}></Route>
          <Route component={Error}></Route>
        </Switch>
        <Tabbar></Tabbar>
      </div>
    )
  }
}
export default withRouter(Layout)
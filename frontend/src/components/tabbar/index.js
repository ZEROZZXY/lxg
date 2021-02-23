import React, { Component } from 'react'
import {NavLink,withRouter} from 'react-router-dom'
import './index.scss'

class Tabbar extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       tabbar:[
         {
           id:1,
           text:'首页',
           icon:'home',
           path:'/home'
         },
         {
          id:2,
          text:'分类',
          icon:'th-large',
          path:'/category'
        },
        {
          id:3,
          text:'购物车',
          icon:'shopping-cart',
          path:'/shopcar'
        },
        {
          id:4,
          text:'我的',
          icon:'user',
          path:'/mine'
        }
       ],
       hide:['/login','/register','/forgetKey','/editPassword','/shopList','/shopDetail','/search','/nine','/favourite','/history','/set','/error']
    }
  }
  
  renderItem = () =>{
    return this.state.tabbar.map(item=>{
      return (
        <li key={item.id}>
          <NavLink to={item.path} activeClassName='active'>
            <i className={'fa fa-'+item.icon}></i>
            <span>{item.text}</span>
          </NavLink>
        </li>
      )
    })
  }

  render() {
    let flag=this.state.hide.includes(this.props.location.pathname);
    return (
      flag?null:<footer className="tabbar">
        <ul>
          {this.renderItem()}
        </ul>
      </footer>
    )
  }
}
export default withRouter(Tabbar)

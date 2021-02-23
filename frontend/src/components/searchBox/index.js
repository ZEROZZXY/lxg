import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import './index.scss'
import request from '../../actions/request'

export default class SearchBox extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isLogin:false
    }
  }
  
  componentDidMount(){
    if(window.cookie.get('token')){
      this.checkLogin()
    }
  }

  checkLogin=()=>{ //判断是否登录
    request({
      method:'POST',
      url:'/api/mine',
      data:{
        type:'home',
        token:window.cookie.get('token')
      }
    }).then(res=>{
      this.setState({
        isLogin:true
      })
    })
  }
  render() {
    const {isLogin}=this.state
    return (
      <div className="searchBox">
        <Link to="/search" className="searchLink">
          <input placeholder="请输入您想要的商品"/>
          <i className="fas fa-search"></i>
        </Link>
        
        {isLogin?<Link to="/mine"><i className="fas fa-user-circle" style={{color:'#fff',fontSize:'0.26rem'}}></i></Link>:<Link to="/login"><span>登录</span></Link>}
        
      </div>
    )
  }
}

import React, { Component } from 'react'
import './index.scss'
import {Link,withRouter} from 'react-router-dom'
import {Tab} from '../../components/tab'
import {Modal,Toast} from 'antd-mobile'

const alert = Modal.alert
class Set extends Component {
  componentDidMount(){
    if(!window.cookie.get('token')){ //判断身份并获取购物车数据
      Toast.fail('请先登录', 2 ,()=>{
        this.props.history.push('/login')
      });
    }
  }

  quit=()=>{
    
    alert('您确定退出登录吗？', '', [
      { text: '我再想想', onPress: () => console.log('cancel') },
      { text: '退出登录', onPress: ()=>  {window.cookie.set('token','',0);this.props.history.push('/home')} },
    ])
  }
  render() {
    const SetTab=Tab('设置')
    return (
      <div className="container set-page">
        <SetTab></SetTab>
        <div className="info">
          <img src="https://img11.360buyimg.com/jdphoto/s120x120_jfs/t21160/90/706848746/2813/d1060df5/5b163ef9N4a3d7aa6.png" alt=""/>
          <span>{this.props.location.state?this.props.location.state.name:null}</span>
          <i>编辑</i>
        </div>
        <div className="set-line bottom-line">
          <li>
            <span>我的收货地址</span><i className="fa fa-angle-right"></i>
          </li>
        </div>
        <div className="set-line bottom-line" >
            <Link to="/forgetKey">
              <span>修改密码</span><i className="fa fa-angle-right"></i>
            </Link>
        </div>
        <div className="set-line">
          <li>
            <span>地区设置</span><i className="fa fa-angle-right"></i>
          </li>
        </div>
        <div className="set-line">
          <li>
            <span>音效与通知</span><i className="fa fa-angle-right"></i>
          </li>
        </div>
        <div className="set-line">
          <li>
            <span>隐私</span><i className="fa fa-angle-right"></i>
          </li>
        </div>
        <div className="set-line bottom-line">
          <li>
            <span>通用</span><i className="fa fa-angle-right"></i>
          </li>
        </div>
        <div className="set-line">
          <li>
            <span>主题模式</span><i className="fa fa-angle-right"></i>
          </li>
        </div>
        <div className="set-line">
          <li>
            <span>问题反馈</span><i className="fa fa-angle-right"></i>
          </li>
        </div>
        <div className="set-line bottom-line">
          <li>
            <span>关于乐享购</span><i className="fa fa-angle-right"></i>
          </li>
        </div>
        <div className="set-line bottom-line" style={{textAlign:'center'}}>
          <span onClick={()=>{this.quit()}}>退出登录</span>
        </div>
      </div>
    )
  }
}
export default withRouter(Set)
import React, { Component } from 'react'
import {InputItem,Button,Toast} from 'antd-mobile'
import {Link} from 'react-router-dom'
import {createForm,formShape} from 'rc-form'
import request from '../../actions/request'
import './index.scss'

class Login extends Component {
  static propTypes={   //定义属性数据类型
    form:formShape   
  }
  constructor(props) {
    super(props)
  
    this.state = {
       loginFlag:false
    }
  }
  
  componentDidMount(){
    const that=this;
    document.querySelector('.login').addEventListener('keyup',function(){
      that.props.form.validateFields((error, value) => { 
        if(error){
          that.setState({
            loginFlag:false
          })
        }else{
          that.setState({
            loginFlag:true
          })
        }
      })
    })
  }

  submit = () => {    //提交事件
    const that = this
    this.props.form.validateFields((error, value) => {  //validateFields：获取错误信息和input值
      if(error) return
      request({
        method:'POST',
        url:'/api/login',
        data:value
      }).then(res=>{
        if(res.data.status){
          Toast.fail(res.data.info, 2);
          console.log('错误')
        }else{
          window.cookie.set('token',res.data.token,7)
          console.log('正确')
          Toast.success(res.data.info, 2,()=>{
            that.props.history.push('/home');
            console.log('去首页')
          });
        }
      })
    });
  }


  checkFalse=(number,message)=>{  //input值出错时
    document.querySelectorAll('.login .am-list-item')[number].style.border='1px solid #fa3200'
    return this.props.form.getFieldError(message)[0]
  }
  checkTrue=(number,item)=>{ //input值不为空时
    document.querySelectorAll('.login .am-list-item')[number].style.border='none'
    switch (item) {
      case 'username':
        return <span className="fas fa-times-circle" onClick={()=>{this.props.form.setFieldsValue({username:''})}}></span>;
      case 'password':
        return <span className="fas fa-times-circle" onClick={()=>{this.props.form.setFieldsValue({password:''})}}></span>;
      default:
        break;
    }
  }
  changeType=()=>{ //更改密码是否可见
    if(document.querySelectorAll('.login input')[1].getAttribute('type')==='text'){
      document.querySelectorAll('.login input')[1].setAttribute('type','password');
      document.querySelectorAll('.login i')[1].setAttribute('class','fas fa-lock')
    }else{
      document.querySelectorAll('.login input')[1].setAttribute('type','text');
      document.querySelectorAll('.login i')[1].setAttribute('class','fas fa-unlock')
    }
  }
  
  render() {
    const { getFieldProps,getFieldError,getFieldValue } = this.props.form;
    return (
      <div className="container">
        <div className="login-box">
        <div className="tab">
          <i className="fa fa-angle-left" onClick={()=>{this.props.history.push('/home')}}></i>
          <span>登录</span>
        </div>
        <div className="login">
          
            <InputItem
              placeholder="用户名"
              {...getFieldProps('username',{  //getFieldProps：设置input数据，使input变成受控组件
                rules: [
                {required: true,pattern: new RegExp(/^[A-z]/, "g"),message: '用户名由字母开头' },
                {required: true,pattern: new RegExp(/^[A-z][A-z0-9]{5,14}$/, "g"),message: '用户名由6-15位字母、数字组成' }],  //rules：规则 
              })}
            >      
              <i className="fas fa-user"></i> 
              {/* getFieldValue：获得对应的input值 */}
              {/* setFieldsValue：修改Input值 */}
              {getFieldValue('username')&&this.checkTrue(0,'username')}
            </InputItem> 
              {/* getFieldProps：获得对应的input错误信息 */}
            <p>{getFieldError('username') && this.checkFalse(0,'username')}</p>  

            <InputItem
              placeholder="密码"
              type="password"
              {...getFieldProps('password',{
                rules: [
                {required: true,pattern: new RegExp(/^[A-z0-9]{6,15}$/, "g"),message: '密码由6-15位字母、数字组成' }],
              })}
            >
              <i className="fas fa-lock" onClick={this.changeType}></i>
              {getFieldValue('password')&&this.checkTrue(1,'password')}
            </InputItem>
            <p>{getFieldError('password') &&this.checkFalse(1,'password')}</p>
     
          <div className="other">
            <Link to='/register'>快速注册</Link>
            <Link to='/forgetKey'>忘记密码</Link>
          </div>
          {this.state.loginFlag?<Button type="warning" onClick={this.submit}>登录</Button>:<Button type="warning" disabled>登录</Button>}
          <img src={require('../../assets/img/1.png')} alt="" className="logo"/>
        </div>
        </div>
      </div> 
    )
  }
}


export default createForm()(Login); //createForm：高阶组件，使组件获得表单功能


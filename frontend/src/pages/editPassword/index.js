import React, { Component } from 'react'
import {Tab} from '../../components/tab'
import {InputItem,Button,Toast} from 'antd-mobile'
import {createForm,formShape} from 'rc-form'
import request from '../../actions/request'
import './index.scss'

const TabComp=Tab('重置密码');
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
    if(this.props.location.state){
      this.props.form.setFieldsValue({ //获取前一页面传来的用户名和邮箱
        username:this.props.location.state.username,
        mail:this.props.location.state.mail
      })
    }else{
      window.location.href="http://localhost:3000/error"
    }
   
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
        url:'/api/modify',
        data:value
      }).then(res=>{
        if(res.data.status){
          Toast.fail(res.data.info, 2);
        }else{
          Toast.success(res.data.info, 2,()=>{
            that.props.history.push('/login');
          });
        }
      })
    });
  }


  checkFalse=(number,message)=>{  //input值为空时
    document.querySelectorAll('.login .am-list-item')[number].style.border='1px solid red'
    return this.props.form.getFieldError(message)[0]
  }
  checkTrue=(number,item)=>{ //input值不为空时
    document.querySelectorAll('.login .am-list-item')[number].style.border='none'
  }
  changeType=()=>{ //更改密码是否可见
    if(document.querySelectorAll('.login input')[2].getAttribute('type')==='text'){
      document.querySelectorAll('.login input')[2].setAttribute('type','password');
      document.querySelectorAll('.login span')[0].setAttribute('class','fas fa-eye')
    }else{
      document.querySelectorAll('.login input')[2].setAttribute('type','text');
      document.querySelectorAll('.login span')[0].setAttribute('class','fas fa-eye-slash')
    }
  }
  
  render() {
    const { getFieldProps,getFieldError,getFieldValue } = this.props.form;
    return (
      <div className="container">
        <div className="login-box">
        <TabComp></TabComp>
        <div className="login">
            <InputItem
              placeholder="用户名"
              disabled
              {...getFieldProps('username')}
            >      
              <i className="fas fa-user"></i> 
            </InputItem>  

            <InputItem
              placeholder="邮箱"
              disabled
              type="text"
              {...getFieldProps('mail')}
            >
              <i className="fas fa-envelope"></i>
            </InputItem>

            <InputItem
              placeholder="新密码"
              type="password"
              maxLength="15"
              {...getFieldProps('password',{
                rules: [{required: true,message: '密码不能为空' },
                {required: true,pattern: new RegExp(/^[A-z0-9]{6,15}$/, "g"),message: '密码由6-15位字母、数字组成' }],
              })}
            >
              <i className="fas fa-lock"></i>
              <span className="fas fa-eye" onClick={()=>{this.changeType()}}></span>
              {getFieldValue('password')&&this.checkTrue(2,'password')}
            </InputItem>

            <p>{getFieldError('password') &&this.checkFalse(2,'password')}</p>
            {this.state.loginFlag?<Button type="warning" onClick={this.submit}>确认</Button>:<Button type="warning" disabled>确认</Button>}
            <img src={require('../../assets/img/1.png')} alt="" className="logo"/>
        </div>
        </div>
      </div>
    )
  }
}


export default createForm()(Login); //createForm：高阶组件，使组件获得表单功能


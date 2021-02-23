import React, { Component } from 'react'
import {Tab} from '../../components/tab'
import {InputItem,Button,Toast} from 'antd-mobile'
import {createForm,formShape} from 'rc-form'
import request from '../../actions/request'
import './index.scss'

const TabComp=Tab('注册');
 class Register extends Component {
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
    document.querySelector('.login').addEventListener('keyup',function(){ //keyup事件，用于控制注册按钮的disabled属性，当有error时，disabled
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
    const that=this
    this.props.form.validateFields((error, value) => {  //validateFields：获取错误信息和input值
      if(error) return
      request({
        method:'POST',
        url:'/api/register',
        data:value
      }).then(res=>{
        if(res.data.status){
          Toast.fail(res.data.info, 2);
        }else{
          Toast.success(res.data.info,2,()=>{
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
    switch (item) {
      case 'username':
        return <span className="fas fa-times-circle" onClick={()=>{this.props.form.setFieldsValue({username:''})}}></span>;
      case 'password':
        return <span className="fas fa-times-circle" onClick={()=>{this.props.form.setFieldsValue({password:''})}}></span>;
      case 'mail':
        return <span className="fas fa-times-circle" onClick={()=>{this.props.form.setFieldsValue({mail:''})}}></span>;  
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
        <TabComp></TabComp>
        <div className="login">
            <InputItem
              placeholder="用户名"
              {...getFieldProps('username',{  //getFieldProps：设置input数据，使input变成受控组件
                rules: [{required: true,pattern: new RegExp(/^[A-z]/, "g"),message: '用户名由字母开头' },
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
                rules: [{required: true,pattern: new RegExp(/^[A-z0-9]{6,15}$/, "g"),message: '密码由6-15位字母、数字组成' }],
              })}
            >
              <i className="fas fa-lock" onClick={this.changeType}></i>
              {getFieldValue('password')&&this.checkTrue(1,'password')}
            </InputItem>
            <p>{getFieldError('password') &&this.checkFalse(1,'password')}</p>
            
            <InputItem
              placeholder="邮箱"
              type="text"
              {...getFieldProps('mail',{
                rules: [{required: true,pattern: new RegExp(/^[A-Za-z0-9]+([_.][A-Za-z0-9]+)*@([A-Za-z0-9-]+\.)+[A-Za-z]{2,6}$/, "g"),message: '邮箱格式错误' }],
              })}
            >
              <i className="fas fa-envelope" onClick={this.changeType}></i>
              {getFieldValue('mail')&&this.checkTrue(2,'mail')}
            </InputItem>
            <p>{getFieldError('mail') &&this.checkFalse(2,'mail')}</p>
            {this.state.loginFlag?<Button type="warning" onClick={this.submit}>注册</Button>:<Button type="warning" disabled>注册</Button>}
            <img src={require('../../assets/img/1.png')} alt="" className="logo"/>
        </div>
        </div>
      </div>
      
    )
  }
}


export default createForm()(Register); //createForm：高阶组件，使组件获得表单功能


import React, { Component,Fragment } from 'react'
import './index.scss'
import {Toast} from 'antd-mobile'

let Searchtimer=null;
export default class Search extends Component {
  
  constructor(props) {
    super(props)
  
    this.state = {
       val:'', //value值
       search_list:null, //模糊搜索值
       hot_flag:true, //热门搜索显示/隐藏
       history:['airpods'] //历史记录
    }
  }


  //onChange事件改编val
  changeVal=(e)=>{
    this.setState({
      val:e.target.value
    })
  }

  //模糊搜索onKeyUp事件
  getSearchList=()=>{
    if(Searchtimer) clearTimeout(Searchtimer)
    Searchtimer=setTimeout(() => {
      this.state.val&&fetch(`/index.php?r=index/kwarr&kw=${this.state.val}&token=false`)
      .then(data=>data.json())
      .then(res=>{
        this.setState({
          search_list:res.data
        })
      })
    }, 300);
  }
  
  //事件委托，点击模糊搜索列表中的内容（LI)，历史搜索热门搜索(SPAN)中的内容，直接进行搜索
  sendSearch=(e)=>{
    if(e.target.nodeName==='LI'||e.target.nodeName==='SPAN'){
      this.setState({
        val:e.target.innerText
      },function(){
        this.getSearchList()
        this.search()
      })
    } 
  }

  //更改热门搜索是否可见
  changeHotHide=()=>{
    if(this.state.hot_flag){
      this.setState({
        hot_flag:false
      })
      document.querySelector('.search-hot-top i').setAttribute('class','fas fa-eye-slash')
    }else{
      this.setState({
        hot_flag:true
      })
      document.querySelector('.search-hot-top i').setAttribute('class','fas fa-eye')
    }
  }

  //搜索事件
  search=()=>{
    if(this.state.val){
      this.props.history.push(`/shopList?cid=165&name=${this.state.val}`)
    }else{
      Toast.fail('请输入您想要的商品!', 1);
    }
  }
  
  render() {
    return (
      <Fragment>
        <div className="category_search tab">
          <i className="fa fa-angle-left" onClick={()=>{console.log(1);this.props.history.goBack()}}></i>
          <div className="searchLink" style={{marginLeft:'0.3rem'}}>
            <i className="fas fa-search" ></i>
            <input placeholder="请输入您想要的商品" value={this.state.val} onChange={this.changeVal} onKeyUp={this.getSearchList}/>
            {this.state.val&&<span className="fas fa-times-circle" onClick={()=>{this.setState({val:'',search_list:''})}}></span>}
          </div>
          <span style={{fontSize:'0.14rem',color:'#333'}} onClick={this.search}>搜索</span>
        </div>
        <div className="container search-page" onClick={this.sendSearch}>
          {window.cookie.get('token')?<div className="search-box" style={{marginBottom:'0.1rem'}}>
            <div className="search-top">
              <p>历史搜索</p>
              {this.state.history!==0?<i className='fas fa-trash-alt' onClick={()=>{this.setState({history:[]})}}></i>:<i></i>}
            </div>
            {this.state.history.length>0?<div className="search-content">
              {this.state.history.map((item,index)=>{
                return(
                  <span key={index}>{item}</span>
                )
              })}
            </div>:<div className="empty-box">当前历史记录为空</div>}
          </div>:null}
          <div className="search-box">
            <div className="search-top search-hot-top">
              <p>热门搜索</p>
              <i className='fas fa-eye' onClick={this.changeHotHide}></i>
            </div>
            {this.state.hot_flag?<div className="search-content">
              <span>抽纸</span><span>airpods</span><span>春装</span><span>游戏本</span><span>口红</span><span>aj312高帮</span><span>口罩</span><span>耳机挂脖式</span>
            </div>:<div className="empty-box">当前热门搜索已隐藏</div>}
          </div>
          {this.state.val&&<div className="search-list" >
            <ul>
              {
                this.state.search_list&&this.state.search_list.map((item,index)=>{
                 return (<li key={index}>{item}</li>)
                })
              }
            </ul>
          </div>}
        </div>
      </Fragment>
      
    )
  }
}

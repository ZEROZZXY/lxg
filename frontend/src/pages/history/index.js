import React, { Component } from 'react'
import './index.scss'
import {Link,withRouter} from 'react-router-dom'
import {Toast,Modal} from 'antd-mobile'
import request from '../../actions/request'

const alert = Modal.alert
class History extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      editFlag:false,
      allChoose:false,
      historyList:[],
      chooseList:[],
      unChooseList:[]
    }
  }

  componentDidMount(){
    if(window.cookie.get('token')){
      this.getHistory();
    }else{
      Toast.fail('请先登录', 2 ,()=>{
        this.props.history.push('/login')
      });
    }
  }


  //进入商品详情
  goShopDetail=(e,item)=>{
    let arr=['IMG','P','DEL','EM'];
    let arr2=['detail-content',`shopcar-item goodid-${item.id}`]
    if(arr.includes(e.target.nodeName)||arr2.includes(e.target.className)){
      this.props.history.push(`/shopDetail?id=${item.id}&goodsId=${item.goodsId}`,{
        id:item.id,
        title:item.title,
        yuanjia:item.yuanjia,
        jiage:item.jiage,
        miaoshu:item.miaoshu,
        pic:item.pic,
        xiaoliang:item.xiaoliang,
        quan:item.quan
      })
    }
  }

  //单个选择
  checkTrue=(item)=>{
    const {historyList,unChooseList,chooseList} = this.state
    let newdata=historyList,newUnChooseList=unChooseList,newChooseList=chooseList;                        
    newdata.map(i=>{
      if(i.id===item.id){
        i.flag=!i.flag;
        this.setState({
          chooseList:newChooseList.concat(item)
        },function(){
          if(this.state.chooseList.length===this.state.historyList.length){
            this.setState({
              allChoose:true
            })
          }
        })
      }
      return null
    })
    newUnChooseList.map((i,index)=>{
      if(i.id===item.id){
        newUnChooseList.splice(index,1)
      }
      return null
    })
    this.setState({
      historyList:newdata,
      unChooseList:newUnChooseList
      })
  }

  //单个取消选择
  checkFalse=(item)=>{
    const {historyList,unChooseList,chooseList} = this.state
    let newdata=historyList,newChooseList=chooseList,newUnChooseList=unChooseList;
    newdata.map(i=>{
      if(i.id===item.id){
        i.flag=!i.flag;
        this.setState({
          unChooseList:newUnChooseList.concat(item),
          allChoose:false
        })
      }
      return null
    })
    newChooseList.map((i,index)=>{
      if(i.id===item.id){
        newChooseList.splice(index,1)
      }
      return null
    })
    this.setState({
      historyList:newdata,
      chooseList:newChooseList
    })
  }

  //是否全选
  chooseAll=(val)=>{
    let newShopList=this.state.historyList;
    newShopList.map(item=>{
      return item.flag=val
    })
    if(val){
      this.setState({
        allChoose:val,
        historyList:JSON.parse(JSON.stringify(newShopList)),
        chooseList:JSON.parse(JSON.stringify(newShopList)),
        unChooseList:[]
      })
    }else{
      this.setState({
        allChoose:val,
        historyList:JSON.parse(JSON.stringify(newShopList)),
        chooseList:[],
        unChooseList:JSON.parse(JSON.stringify(newShopList))
      })
    }
  }

  //确认删除
  delConfirm=()=>{
    if(!this.state.chooseList.length){
      Toast.info('您还没有选择物品哦', 2);
    }else{
      alert('您确定删除吗？', '', [
        { text: '我再想想', onPress: () => console.log('cancel') },
        { text: '删除', onPress: ()=> this.delFavouriteItem() },
      ])
    }
  }

  //删除商品
  delFavouriteItem=()=>{
    this.setState({
      historyList:JSON.parse(JSON.stringify(this.state.unChooseList)),
    },function(){
      this.setState({
        unChooseList:JSON.parse(JSON.stringify(this.state.historyList)),
        chooseList:[]
      },function(){
        this.saveHistory()
      })
    })
  }

   //获取收藏列表
   getHistory=()=>{
    request({
      method:'POST',
      url:'/api/history',
      data:{
        type:'getHistory',
        token:window.cookie.get('token')
      }
    }).then(res=>{
      this.setState({
        historyList:JSON.parse(JSON.stringify(res.data.info)),
        unChooseList:JSON.parse(JSON.stringify(res.data.info))
      })
    })
  }

  //保存收藏列表
  saveHistory=()=>{
    request({
      method:'POST',
      url:'/api/history',
      data:{
        type:'saveHistory',
        token:window.cookie.get('token'),
        history:this.state.historyList
      }
    })
  }
  
  render() {
    const {editFlag,allChoose,historyList} =this.state
    return (
      <div className="favourite-page">
        <div className="shopcar-tab">
          <span>我的足迹</span>
          <i className="fa fa-angle-left" onClick={()=>{this.props.history.goBack()}}></i>
          {editFlag?<em onClick={()=>{this.setState({editFlag:!this.state.editFlag})}}>完成</em>: <em onClick={()=>{this.setState({editFlag:!this.state.editFlag})}}>管理</em>}
        </div>
        <div className="container">
            {
            historyList.length===0?<div className="fav-empty">
              <img src="https://wq.360buyimg.com/fd/h5/wx/mhistory/images/mh-goods-empty@2x_2b18bd9d.png" alt=""/>
              <p>您还没有浏览过商品</p>
              <Link to="/home">去逛逛</Link>
            </div>:
            <div className="shopcar-has">
              {
                historyList.map(item=>{
                  return (
                    <div className={"shopcar-item goodid-"+item.id} key={item.id} onClick={(e)=>{this.goShopDetail(e,item)}}>
                      {
                        editFlag?(item.flag?<i className="fas fa-check-circle check" onClick={()=>{this.checkFalse(item)}}></i>
                        :<i className="fas fa-circle uncheck"  onClick={()=>{this.checkTrue(item)}}></i>):null
                      }
                        
                      <img src={item.pic} alt=""/>
                      <div className="item-detail">
                        <p>{item.title}</p>
                        <div className="detail-content">
                        <del>原价：￥{item.yuanjia}</del>
                        <i>{item.quan}元券</i>
                        </div>
                        <div className="detail-content">
                        <em>￥{item.jiage}</em>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          }
        </div>
        {
          editFlag? <div className="shopcar-tabbar">
          <div className="select">
            {allChoose?<i className="fas fa-check-circle check" onClick={()=>{this.chooseAll(false)}}></i>:<i className="fas fa-circle uncheck" onClick={()=>{this.chooseAll(true)}}></i>}
            <span>全选</span>
          </div>
            <div className="edit">
              <span className="del-btn" onClick={() =>{this.delConfirm()}}>删除</span>
            </div>
        </div>:null
        }
       
      </div>
     
    )
  }
}
export default withRouter(History)
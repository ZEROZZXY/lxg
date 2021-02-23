import React, { Component } from 'react'
import {Tab} from '../../components/tab'
import {Link} from 'react-router-dom'
import request from '../../actions/request'
import './index.scss'

const NineTab=Tab('9.9包邮')
export default class Nine extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       nineList:[]
    }
  }

  componentDidMount(){
    this.getNineList()
  }

  //获取9.9包邮列表
  getNineList=()=>{
    request({
      url: "/index.php",
      params: {
        r: 'nine/listajax',
        n_id: 58,
        page: 1,
        cac_id: ''
      }
    }).then(res=>{
      this.setState({
        nineList: res.data.data.data
      })
    });
  }
  
  renderItem=()=>{
    if(this.state.nineList){
      return this.state.nineList.map(item=>{
        return(
          <Link className={'goods_item1 goodsid-'+item.id} key={item.goodsid}
            to={{
              pathname:'/shopDetail',
              search:`id=${item.id}&goodsId=${item.goodsid}`,
              state:{
                id:item.id,
                title:item.d_title,
                yuanjia:item.yuanjia,
                jiage:item.jiage,
                miaoshu:item.miaoshu,
                pic:item.pic,
                xiaoliang:item.xiaoliang,
                quan:item.quan_jine
              }
            }}
          >
            <div className="pic_box">
              <img src={item.pic} alt=""/>
            </div>
            <div className="goods_detail">
              <p>{item.title}</p>
              <div className="detail-1">
                <span><em>券后 </em><i>￥</i>{item.jiage}</span>
                <strong>{item.quan_jine}元券</strong>
              </div>
              <div className="detail-2">
                <em>已售{item.xiaoliang>10000?(item.xiaoliang/10000).toFixed(1)+'万':item.xiaoliang}</em>
                <i></i>
                <span>评价{item.comment>10000?(item.comment/10000).toFixed(1)+'万':item.comment}</span>
              </div>
            </div>
          </Link>
        )
      })  
    }else{
      return <div></div>
    }
  }


  render() {
    return (
      <div className="shop_list_box">
        <NineTab className="NineTab"></NineTab>
        <div className="container">
          <div className="title-box">
            <i className="fas fa-heartbeat"></i>
            <p>为您精选</p>
          </div>
          <div className="guess_ulove">
            <div className="goods_list1" >
              {this.renderItem()}
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}

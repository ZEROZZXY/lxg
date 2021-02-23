import React, { Component } from 'react'
import qs from 'querystring'
import './index.scss'
import {Link} from 'react-router-dom'
import {Tab} from '../../components/tab'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {get_shop_list,del_shop_list} from '../../actions'

class ShopList extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       page:1, //发送请求的页面
       type:'t',  //查询类型
       backFlag:false,  //返回顶部
    }
  }
  
  componentDidMount(){
    const {cid}=qs.parse(this.props.location.search.slice(1))
    const cac_id='DnF1ZXJ5VGhlbkZldGNoBAAAAACBTFO8FjRvaTVfS3dpVEZtX01ndEpDc29DVVEAAAAAoeqU7xZkSkd5bFJSa1JUYXU1WUx1OUp2SVZBAAAAAKHqlPAWZEpHeWxSUmtSVGF1NVlMdTlKdklWQQAAAACBTFO9FjRvaTVfS3dpVEZtX01ndEpDc29DVVE='
    this.props.del_shop_list() //清空列表
    this.props.get_shop_list(cid,1,'','t') //发送请求获取第一页信息
    if (document.querySelector('.shop-list')) {
      let previous = 0; //函数节流
      document.querySelector('.shop-list').addEventListener("scroll", e => {
          const { clientHeight, scrollHeight, scrollTop } = e.target;
          const isBottom = scrollTop + clientHeight + 100 > scrollHeight&&scrollTop + clientHeight!== scrollHeight; //到底了
          var now = Date.now();
          if(scrollTop>=800){ //返回顶部按钮出现
            this.setState({
              backFlag:true
            })
          }else{
            this.setState({
              backFlag:false
            })
          }
          if (isBottom&&now - previous > 1000) {
              console.log('触发')
              this.setState({
                page:this.state.page+1
              },()=>{
                this.props.get_shop_list(cid,this.state.page,cac_id,this.state.type)
                previous = now;
              })
          }
      });
    }
  }
  
  //返回顶部
  go_top=()=>{ 
    let speed=-document.querySelector('.shop-list').scrollTop/20
    let timer=setInterval(() => {
      let top=document.querySelector('.shop-list').scrollTop
      if(top>0){
        document.querySelector('.shop-list').scrollTop+=speed
      }else{
        clearInterval(timer)
      }
    }, 10);
  }

  //改变条件查询类型
  changeType=(e)=>{
    const {cid}=qs.parse(this.props.location.search.slice(1))
    this.props.del_shop_list() //清除商品列表
    this.setState({ //page回归1
      page:1
    })
    switch (e.target.getAttribute('class').split(' ')[0]) { //类名判断
      case 'type-1':
        this.setState({ //更改type类型用于发请求
          type:'t' 
        },()=>{
          this.props.get_shop_list(cid,1,'',this.state.type) //获取更改后的条件的第一页商品列表数据
        })
        document.querySelector('.shop_list_type').childNodes.forEach(item=>{
          item.classList.remove('active') //清除兄弟元素的active类名
        })
        document.querySelector('.type-1').classList.add('active') //被点击元素添加active类名
        break;
      case 'type-2':
        this.setState({
          type:'latest'
        },()=>{
          this.props.get_shop_list(cid,1,'',this.state.type)
        })
        document.querySelector('.shop_list_type').childNodes.forEach(item=>{
          item.classList.remove('active')
        })
        document.querySelector('.type-2').classList.add('active')
        break;
      case 'type-3':
        this.setState({
          type:'sell'
        },()=>{
          this.props.get_shop_list(cid,1,'',this.state.type)
        })
        document.querySelector('.shop_list_type').childNodes.forEach(item=>{
          item.classList.remove('active')
        })
        document.querySelector('.type-3').classList.add('active')
        break;
      case 'type-4':
        this.setState({
          type:'price'
        },()=>{
          this.props.get_shop_list(cid,1,'',this.state.type)
        })
        document.querySelector('.shop_list_type').childNodes.forEach(item=>{
          item.classList.remove('active')
        })
        document.querySelector('.type-4').classList.add('active')
        break;
      default:
        break;
    }
  }

  //渲染数据
  renderItem=()=>{
    return this.props.shopList&&this.props.shopList.map(item=>{
      return(
        <li key={item.id} className={'goodsid-'+item.id}>
          <Link to={{
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
          }}>
            <div className="img-box">
              <img src={item.pic} alt=""/>
            </div>
            <div className="content-box">
              <h3>{item.d_title}</h3>
              <p>券后 <em><i>￥</i>{item.jiage}</em></p>
              <span> 券 {item.quan_jine}元 </span>
              <i>已售 {item.xiaoliang>10000?(item.xiaoliang/10000).toFixed(1)+'万':item.xiaoliang} | 评论 {item.comment>1000?(item.comment/1000).toFixed(1)+'万':item.comment} </i>
            </div>
          </Link>
        </li>
      )
    })
  }
  
  render() {
    const {name}=qs.parse(this.props.location.search.slice(1))  //search传参
    const ShopListTab=Tab(name) //头部功能性组件
    return (
      <div className="shop_list_box" >
        <ShopListTab style={{fontSize:'0.14rem'}}></ShopListTab>
        <div className="shop_list_type">
          <span className="type-1 active" onClick={this.changeType}>人气</span>
          <span className="type-2" onClick={this.changeType}>最新</span>
          <span className="type-3" onClick={this.changeType}>销量</span>
          <span className="type-4" onClick={this.changeType}>价格</span>
        </div>
        <div className="container" style={{position:'relative'}}>
          <ul className="shop-list">
            {this.renderItem()}
          </ul>
          {this.state.backFlag&&<span className="go_top" onClick={this.go_top}></span>}
        </div>
      </div>
      
    )
  }
}

export default  connect((state)=>{
  return{
    shopList:state.shopListState.shopList
  }
},dispatch=>bindActionCreators({get_shop_list,del_shop_list},dispatch))(ShopList)
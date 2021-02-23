import React, { Component } from 'react'
import request from '../../actions/request'
import qs from 'querystring'
import './index.scss'
import {Link} from 'react-router-dom'
import { Popover, NavBar, Icon, Toast } from 'antd-mobile';
import {withRouter} from 'react-router-dom'

const Item = Popover.Item;
class ShopDetail extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isLogin:false, //是否登录 
       detail_img:null, //商品详情
       recommend_goods:null, //推荐商品
       comment_introduce:null, //商品评价
       mark:false  //是否收藏
    }
  }
  
  componentDidMount(){
    console.log(this.props.location.state)
    if(window.cookie.get('token')){ //有token
      const {id} =this.props.location.state; 
      request({ //判断是否收藏此商品
        method:'POST',
        url:'/api/love',
        data:{
          type:'markFlag',
          token:window.cookie.get('token'),
          data:{
            id
          }
        }
      }).then(res=>{
        this.setState({
          mark:res.data.info, //修改mark值 判断用户是否收藏
          isLogin:true //登录成功
        },function(){
         this.history() //历史记录
        })
      })
    }

    this.getImg() //获取商品详情
    this.getRecommend()  //获取推荐商品
    this.getComment() //获取评价
  }

  componentDidUpdate(){
    //监听内容滚动，改变头部定点跳转标签的active
    if( this.scroll){
      this.scroll.addEventListener("scroll", e => {
        const { scrollHeight, scrollTop } = e.target;
        let detailTop=document.querySelector('.shop-detail-comment').offsetTop-55
        let imgTop=document.querySelector('.img-info').offsetTop-55
        let recommendTop=document.querySelector('.recommend .title-box').offsetTop-55
        if(scrollTop>=0&&scrollTop<detailTop){
          document.querySelector('.am-navbar-title').childNodes.forEach(item=>{
            item.classList.remove('active')
          })
          document.querySelector('.goods').classList.add('active')
        }else if(scrollTop>=detailTop&&scrollTop<imgTop){
          document.querySelector('.am-navbar-title').childNodes.forEach(item=>{
            item.classList.remove('active')
          })
          document.querySelector('.comment').classList.add('active')
        }
        else if(scrollTop>=imgTop&&scrollTop<recommendTop){
          document.querySelector('.am-navbar-title').childNodes.forEach(item=>{
            item.classList.remove('active')
          })
          document.querySelector('.detail').classList.add('active')
        }
        else if(scrollTop>=recommendTop&&scrollTop<scrollHeight){
          document.querySelector('.am-navbar-title').childNodes.forEach(item=>{
            item.classList.remove('active')
          })
          document.querySelector('.recommend').classList.add('active')
        }
      })
    }
  }

  //点击title，滚动至对应位置
  changeType=(e)=>{
    document.querySelector('.shop-detail-content').scrollTop=document.querySelector('.shop-detail-content').scrollTop
    switch (e.target.getAttribute('class').split(' ')[0]) {
      case 'goods':
        this.skip(0)
        break;
      case 'comment':
        this.skip(document.querySelector('.shop-detail-comment').offsetTop-50)
        break;
      case 'detail':
        this.skip(document.querySelector('.img-info').offsetTop-50)
        break;
      case 'recommend':
        this.skip(document.querySelector('.recommend .title-box').offsetTop-50)
        break;
      default:
        break;
    }
  }

  //滚动
  skip=(position)=>{
    let speed=-(document.querySelector('.shop-detail-content').scrollTop-position)/30  //设置速度
    let timer=setInterval(() => {
      let top=document.querySelector('.shop-detail-content').scrollTop
      if(speed>=0){ //向下滚动
        if(top<position){ //还没到指定位置，当前位置在目标位置上方
          document.querySelector('.shop-detail-content').scrollTop+=speed //向下滚动
        }else{
          document.querySelector('.shop-detail-content').scrollTop=position //以免超出
          clearInterval(timer) //清除计时器
        }
      }else{ //向上滚动
        if(top>position){ //还没到指定位置，当前位置在目标位置下方
          document.querySelector('.shop-detail-content').scrollTop+=speed
        }else{
          document.querySelector('.shop-detail-content').scrollTop=position
          clearInterval(timer)
        }
      }
    }, 10);
  }

  //气泡
  onSelect = (opt) => {
    switch (opt.props.value) {
      case 'home':
        this.props.history.push('/home')
        break;
      case 'search':
        this.props.history.push('/search')
        break;
      case 'shopcar':
        this.props.history.push('/shopcar')
        break;
      case 'love':
        this.props.history.push('/favourite')
        break;
      case 'my':
        this.props.history.push('/mine')
        break;
      default:
        break;
    }
  };

  //获得商品图片
  getImg=()=>{
    const {goodsId} = qs.parse(this.props.location.search.slice(1))
    request({
      url: "http://cmsjapi.ffquan.cn/api/goods/get-goods-detail-img",
      params: {
        goodsId
      }
    }).then(res=>{
      if(res.data.data){
        this.setState({
          detail_img: JSON.parse(res.data.data)
        })
      }
    });
  }

  //获取推荐商品
  getRecommend=()=>{
    const {id} = qs.parse(this.props.location.search.slice(1))
    request({
      url: "http://cmsjapi.ffquan.cn/api/goods/get-recommend-goods",
      params: {
        id
      }
    }).then(res=>{
      console.log('推荐',res.data.data)
      this.setState({
        recommend_goods: res.data.data
      })
    });
  }

  //获取评价
  getComment=()=>{
    const {goodsId} = qs.parse(this.props.location.search.slice(1))
    request({
      url: "http://cmsjapi.ffquan.cn/api/goods/get-comment-introduce",
      params: {
        goodsId
      }
    }).then(res=>{
      console.log('评价',res.data.data)
      this.setState({
        comment_introduce: res.data.data
      })
    });
  }

  //渲染评价关键字
  renderKeywords=()=>{
    return this.state.comment_introduce.keywords.map((item,index)=>{
      return (<span key={index}>{item.word}({item.count})</span>)
    })
  }

  //收藏
  mark=()=>{
    const {id,title,yuanjia,jiage,pic,xiaoliang,quan} =this.props.location.state;
    const {goodsId} = qs.parse(this.props.location.search.slice(1))
    const loveItem={id,goodsId,title,yuanjia,jiage,pic,quan,xiaoliang,flag:false}
      request({
        method:'POST',
        url:'/api/love',
        data:{
          type:'mark',
          token:window.cookie.get('token'),
          data:{
            loveItem
          }
        }
      }).then(res=>{
        Toast.success(res.data.info, 2);
        this.setState({
          mark:!this.state.mark
        })
      })
  }

  //足迹
  history=()=>{
    const {id,title,yuanjia,jiage,pic,xiaoliang,quan} =this.props.location.state;
    const {goodsId} = qs.parse(this.props.location.search.slice(1))
    const historyItem={id,goodsId,title,yuanjia,jiage,pic,quan,xiaoliang,flag:false}
      request({
        method:'POST',
        url:'/api/history',
        data:{
          type:'addHistory',
          token:window.cookie.get('token'),
          data:{
            historyItem
          }
        }
      })
  }

  //加入购物车
  pushInCar=()=>{
    const {id,title,yuanjia,jiage,pic,xiaoliang,quan} =this.props.location.state;
    const {goodsId} = qs.parse(this.props.location.search.slice(1))
    const shopItem={id,goodsId,title,yuanjia,jiage,pic,quan,xiaoliang,num:1,flag:false}
      request({
        method:'POST',
        url:'/api/shopCar',
        data:{
          type:'addShop',
          token:window.cookie.get('token'),
          data:{
            shopItem
          }
        }
      }).then(res=>{
        Toast.success(res.data.info, 2);
      })

  }


  //未登录
  notLogin=()=>{
    Toast.fail('请先登录', 1 ,()=>{
      this.props.history.push('/login')
    });
  }

  render() {
  if(this.props.location.state&&this.state.comment_introduce){
      const {id,title,yuanjia,jiage,miaoshu,pic,xiaoliang,quan} =this.props.location.state
      const {totalCount,hotComment,name} =this.state.comment_introduce
      return (
        <div className="container shop-detail" >         
          <div className="shop-detail-tab" > {/* 头部 */}
          <NavBar
            icon={<Icon type="left" />}
            onLeftClick={() => this.props.history.goBack()}
            mode="light"
            rightContent={
              <Popover mask
                overlayClassName="fortest"
                overlayStyle={{ color: 'currentColor' }}
                overlay={[
                  (<Item key="1" value="home" icon={<i className="fas fa-home"></i>} data-seed="logId">首页</Item>),
                  (<Item key="2" value="search" icon={<i className="fas fa-search"></i>} style={{ whiteSpace: 'nowrap' }}>搜索</Item>),
                  (<Item key="3" value="shopcar" icon={<i className="fas fa-shopping-cart"></i>}>购物车</Item>),
                  (<Item key="4" value="love" icon={<i className="fas fa-heart"></i>} data-seed="logId">收藏</Item>),
                  (<Item key="5" value="my" icon={<i className="fas fa-user"></i>} data-seed="logId">
                    <span style={{ marginRight: 5 }}>个人中心</span>
                  </Item>)
                ]}
                align={{
                  overflow: { adjustY: 0, adjustX: 0 },
                  offset: [-10, 0],
                }}
                onSelect={this.onSelect}
              >
                <div style={{
                  height: '100%',
                  padding: '0 15px',
                  marginRight: '-15px',
                  display: 'flex',
                  alignItems: 'center',
                  color:'#666'
                }}
                >
                  <Icon type="ellipsis" />
                </div>
              </Popover>
            }
          >
            <span className="goods active" onClick={this.changeType}>商品</span>
            <span className="comment" onClick={this.changeType}>评价</span>
            <span className="detail" onClick={this.changeType}>详情</span>
            <span className="recommend" onClick={this.changeType}>推荐</span>
          </NavBar>
          </div>
          <div className={"shop-detail-content goodid-"+id} ref={e => (this.scroll = e)} >
            <img src={pic} alt=""/>
            <div className="shop-detail-info" >
              <div className="price-box">
                <div className="price">
                  <span>券后价￥<em>{jiage}</em></span>
                  <del>原价￥{yuanjia}</del>
                </div>
                <div className="quan">
                <em>{quan}</em> 元优惠券
                </div>
              </div>
              <p className="title">{title}</p>
              <div className="promise-box">
                <div className="promise">
                  <i className="fas fa-check-circle"></i><span>包邮</span>
                  <i className="fas fa-check-circle"></i><span>运费险</span>
                  <i className="fas fa-check-circle"></i><span>7天无理由退货</span>
                </div>
                <div className="sell_count">
                  已售<em>{xiaoliang>10000?(xiaoliang/10000).toFixed(1)+'万':xiaoliang}</em>件
                </div>
              </div>
              <p className="description">{miaoshu}</p>
            </div>
            <div className="shop-detail-comment">
              {
                totalCount?<div className="total-commnet">
                <span>评价（{totalCount>1000?(totalCount/10000).toFixed(1)+'万+':totalCount}）</span>
                <em>查看全部<i className="fas fa-angle-right"></i></em>
              </div>:<span style={{fontSize:'0.14rem'}}>暂无评价</span>
              }
              
              <div className="label">
                {this.renderKeywords()}
              </div>
              <p className="name">{name} </p>
              <p className="content"> {hotComment}</p>
            </div>
            <div className="img-info">
              <div className="title">
                <span>商品介绍</span>
              </div>
              {
                  this.state.detail_img&&this.state.detail_img.map((item,index)=>{
                    return (
                      <img key={index} src={item.img} style={{width:'100%'}} alt=""/>
                    )
                  })
              }
            </div>
            <div className="recommend">
              <div className="title-box">
                <i className="fas fa-heartbeat"></i>
                <p>看了又看</p>
              </div>
              <div className="goods_list1">
                  {
                  this.state.recommend_goods&&this.state.recommend_goods.map(item=>{
                      return(
                        <div className="goods_item1" key={item.goodsId}>
                          <div className="pic_box">
                            <img src={item.pic} alt=""/>
                          </div>
                          <div className="goods_detail">
                            <p>{item.title}</p>
                            <div className="detail-1">
                              <span><em>券后 </em><i>￥</i>{item.jiage}</span>
                              <strong>{item.quanJine}元券</strong>
                            </div>
                            <div className="detail-2">
                              <em>已售{item.xiaoliang>10000?(item.xiaoliang/10000).toFixed(1)+'万':item.xiaoliang}</em>
                              <i></i>
                              <span>评价{item.comment>10000?(item.comment/10000).toFixed(1)+'万':item.comment}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
            </div>

          </div>
          <div className="shop-detail-footer">
            <div className="btn">
                {this.state.isLogin?<li onClick={()=>{this.mark()}}>
                  {this.state.mark?<svg t="1582872619503" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5963" width="20" height="20"><path d="M957.216 404.32c-3.808-11.36-13.632-19.68-25.504-21.504l-270.336-41.728-120.8-258.624C535.328 71.232 524.032 64.032 511.648 64c0 0-0.032 0-0.064 0-12.384 0-23.648 7.136-28.928 18.336l-121.856 258.016-270.72 40.8c-11.872 1.792-21.728 10.048-25.568 21.408-3.84 11.36-0.992 23.936 7.36 32.512l196.448 202.08L221.44 921.952c-1.984 12.096 3.104 24.256 13.12 31.328 9.984 7.072 23.168 7.808 33.888 1.92l241.824-133.024 241.312 133.856C756.416 958.656 761.76 960 767.104 960c0.256 0 0.48 0 0.64 0 17.696 0 32-14.304 32-32 0-3.968-0.704-7.776-2.016-11.296l-44.896-278.688 196.928-201.248C958.08 428.224 960.992 415.68 957.216 404.32z" p-id="5964" fill="#eb412b"></path></svg>
                    : <svg t="1582872574876" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5777" width="20" height="20"><path d="M767.104 959.936c-5.344 0-10.688-1.344-15.52-4.032l-241.312-133.856-241.824 133.024c-10.72 5.92-23.904 5.152-33.888-1.92-10.016-7.072-15.104-19.264-13.12-31.328l46.88-284.736-196.448-202.08c-8.256-8.512-11.168-20.928-7.456-32.192 3.68-11.296 13.312-19.616 25.024-21.632l155.072-26.592c17.632-2.944 33.984 8.736 36.96 26.144 2.976 17.408-8.704 33.952-26.144 36.96l-95.168 16.32 165.344 170.08c7.072 7.296 10.272 17.504 8.64 27.488l-38.816 235.68 199.616-109.824c9.632-5.312 21.344-5.312 30.944 0.064l199.168 110.464-38.016-235.776c-1.632-10.016 1.632-20.224 8.704-27.456l164.672-168.256-225.664-34.816c-10.56-1.632-19.584-8.416-24.128-18.08l-99.2-212.384-100.064 211.84c-7.552 16-26.624 22.816-42.624 15.264-15.968-7.552-22.816-26.624-15.264-42.624l129.152-273.44c5.312-11.2 16.576-18.336 28.928-18.336 0 0 0.032 0 0.064 0 12.416 0.032 23.68 7.232 28.928 18.464l120.8 258.624 270.336 41.728c11.872 1.824 21.696 10.144 25.504 21.504 3.776 11.36 0.864 23.936-7.488 32.48l-196.928 201.216 45.92 284.864c1.952 12.096-3.2 24.256-13.216 31.296C780 958.016 773.568 959.936 767.104 959.936z" p-id="5778"></path></svg>}
                    <span>收藏</span>
                  </li>
                :<li onClick={()=>{this.notLogin()}}>
                  {this.state.mark?<svg t="1582872619503" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5963" width="20" height="20"><path d="M957.216 404.32c-3.808-11.36-13.632-19.68-25.504-21.504l-270.336-41.728-120.8-258.624C535.328 71.232 524.032 64.032 511.648 64c0 0-0.032 0-0.064 0-12.384 0-23.648 7.136-28.928 18.336l-121.856 258.016-270.72 40.8c-11.872 1.792-21.728 10.048-25.568 21.408-3.84 11.36-0.992 23.936 7.36 32.512l196.448 202.08L221.44 921.952c-1.984 12.096 3.104 24.256 13.12 31.328 9.984 7.072 23.168 7.808 33.888 1.92l241.824-133.024 241.312 133.856C756.416 958.656 761.76 960 767.104 960c0.256 0 0.48 0 0.64 0 17.696 0 32-14.304 32-32 0-3.968-0.704-7.776-2.016-11.296l-44.896-278.688 196.928-201.248C958.08 428.224 960.992 415.68 957.216 404.32z" p-id="5964" fill="#eb412b"></path></svg>
                  : <svg t="1582872574876" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5777" width="20" height="20"><path d="M767.104 959.936c-5.344 0-10.688-1.344-15.52-4.032l-241.312-133.856-241.824 133.024c-10.72 5.92-23.904 5.152-33.888-1.92-10.016-7.072-15.104-19.264-13.12-31.328l46.88-284.736-196.448-202.08c-8.256-8.512-11.168-20.928-7.456-32.192 3.68-11.296 13.312-19.616 25.024-21.632l155.072-26.592c17.632-2.944 33.984 8.736 36.96 26.144 2.976 17.408-8.704 33.952-26.144 36.96l-95.168 16.32 165.344 170.08c7.072 7.296 10.272 17.504 8.64 27.488l-38.816 235.68 199.616-109.824c9.632-5.312 21.344-5.312 30.944 0.064l199.168 110.464-38.016-235.776c-1.632-10.016 1.632-20.224 8.704-27.456l164.672-168.256-225.664-34.816c-10.56-1.632-19.584-8.416-24.128-18.08l-99.2-212.384-100.064 211.84c-7.552 16-26.624 22.816-42.624 15.264-15.968-7.552-22.816-26.624-15.264-42.624l129.152-273.44c5.312-11.2 16.576-18.336 28.928-18.336 0 0 0.032 0 0.064 0 12.416 0.032 23.68 7.232 28.928 18.464l120.8 258.624 270.336 41.728c11.872 1.824 21.696 10.144 25.504 21.504 3.776 11.36 0.864 23.936-7.488 32.48l-196.928 201.216 45.92 284.864c1.952 12.096-3.2 24.256-13.216 31.296C780 958.016 773.568 959.936 767.104 959.936z" p-id="5778"></path></svg>}
                  <span>收藏</span>
                </li>}
                <Link to="shopcar">
                  <svg t="1582295145435" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4224" width="20" height="20"><path d="M930.304 260.096c-11.776-14.336-28.672-22.528-47.104-22.528H244.224l-17.408-111.104c-6.144-37.888-38.4-65.536-76.8-65.536H87.04a34.304 34.304 0 0 0 0 68.608h62.976c4.608 0 8.704 3.072 9.216 7.68l99.328 632.832c6.144 38.4 38.4 66.048 77.312 66.048h467.456a34.304 34.304 0 0 0 0-68.608H336.384c-5.12 0-9.216-3.584-9.728-8.704l-15.872-99.84H824.32c29.184 0 54.272-20.992 59.904-49.664l58.368-300.032c3.584-16.896-1.024-34.816-12.288-49.152z m-111.616 331.264H300.032l-45.056-285.696h619.008l-55.296 285.696z m-386.048 337.408c0 24.576-19.968 44.544-44.544 44.544-24.576 0-44.544-19.968-44.544-44.544s19.968-44.544 44.544-44.544c24.576 0.512 44.544 19.968 44.544 44.544z m336.896 0c0 24.576-19.968 44.544-44.544 44.544-24.576 0-44.544-19.968-44.544-44.544s19.968-44.544 44.544-44.544c24.576 0.512 44.544 19.968 44.544 44.544z" p-id="4225"></path></svg>
                  <span>购物车</span>
                </Link>
            </div>
            <div className="buy">
                {this.state.isLogin?<span onClick={()=>{this.pushInCar()}}>加入购物车</span>:<span onClick={()=>{this.notLogin()}}>加入购物车</span>}
                <i onClick={()=>{Toast.fail('该功能还为开放', 2)}}>立即购买</i>
            </div>
          </div>
        </div>
      )
    }else{
      return(
        <div>
          
        </div>
      )
    }
  }
    
}

export default withRouter(ShopDetail)
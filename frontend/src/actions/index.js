import request from './request'
import {GET_HOME_LOVE, DEL_HOME_PAGE,GET_SHOP_LIST,DEL_SHOP_LIST} from './actionType'
import {Toast} from 'antd-mobile'

//首页
export const get_home_love = (val)=>{
  return async dispatch =>{
    const result = await request({
      url:'http://cmsjapi.ffquan.cn/api/category/index/lingquan-live-new',
      params:{
        pageId: val,
        pageSize: 10,
        entityId: 3,
        type: 1,
        version: 'v1',
        tuserId: 771131,
        isWechat: 0
      }
    })
    if(result.data.data.list&&result.data.data.list.length===0){
      Toast.fail('到底了！', 1);
    }
    dispatch({
      type:GET_HOME_LOVE,
      payload:result.data.data.list
    })
  }
}

export const del_home_page = ()=>{
  return dispatch =>{
    dispatch({
      type:DEL_HOME_PAGE,
      payload:[]
    })
  }
}


//商品列表页
export const get_shop_list = (cid,val,cac_id,px)=>{
  return async dispatch =>{
    const result = await request({
      url:'/index.php',
      params:{
        r: 'class/cyajaxsub',
        page: val,
        cid,
        px,
        cac_id
      }
    })
    console.log(result)
    if(result.data.data.content.length===0){
      Toast.fail('到底了！', 1);
    }
    dispatch({
      type:GET_SHOP_LIST,
      payload:result.data.data.content
    })
  }
}

export const del_shop_list = ()=>{
  return dispatch =>{
    dispatch({
      type:DEL_SHOP_LIST,
      payload:[]
    })
  }
}

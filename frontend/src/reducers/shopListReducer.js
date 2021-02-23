import {GET_SHOP_LIST,DEL_SHOP_LIST} from '../actions/actionType'

const initState = {
  shopList:[]
}

const shopListReducer = (state=initState,action)=>{
  const newState={...state}
  switch (action.type) {
    case GET_SHOP_LIST:
      console.log(action.payload)
      newState.shopList=newState.shopList.concat(action.payload)
      break;
    case DEL_SHOP_LIST:
      newState.shopList=action.payload
      break;
    default:
      break;
  }
  return newState
}

export default shopListReducer
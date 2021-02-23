import {GET_HOME_LOVE,DEL_HOME_PAGE} from '../actions/actionType'

const initState = {
  loveList:[]
}

const homeReducer = (state=initState,action)=>{
  const newState={...state}
  switch (action.type) {
    case GET_HOME_LOVE:
      newState.loveList=newState.loveList.concat(action.payload)
      break;
    case DEL_HOME_PAGE:
      newState.loveList=action.payload
      break;
    default:
      break;
  }
  return newState
}

export default homeReducer
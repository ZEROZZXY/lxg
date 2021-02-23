import {combineReducers} from 'redux'
import homeState from './homeReducer'
import shopListState from './shopListReducer'

const rootReducer = combineReducers({
  homeState,
  shopListState
})

export default rootReducer
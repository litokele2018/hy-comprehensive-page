import { combineReducers } from 'redux'
import todos from './reducers/todo'
import visibilityFilter from './reducers/visibilityFilter'

export default combineReducers({
  todos,
  visibilityFilter
})
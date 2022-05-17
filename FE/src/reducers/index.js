import { combineReducers } from 'redux';

import course from "./Course"
import notification from "./Notification"
import user from "./User"

const rootReducer = combineReducers({
    course,
    notification,
    user
  });
  
  export default rootReducer;
  
  
//   export default function reducer(
    
//     state={
//         course:[]
//     }
//     ,action
// ){
//     return state
// }
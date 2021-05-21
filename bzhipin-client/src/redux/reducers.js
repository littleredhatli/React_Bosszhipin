/*
包含n个reducer函数：根据老的state和指定的action返回一个新的state
 */

import {combineReducers} from "redux";
import {
  AUTH_SUCCESS,
  ERROR_MSG, MSG_READ,
  RECEICE_MSG,
  RECEICE_MSG_LIST,
  RECEICE_USER_LIST,
  RECEIVE_USER,
  RESET_USER
} from "./action-types";
import {getRedirect} from '../utils'

const initState = {
  username: '',
  password: '',
  msg: '',
  redirectTo: ''
}
function user(state=initState, action){
  switch (action.type) {
    case AUTH_SUCCESS:
      const {type, header} = action.data;
      return {...action.data, redirectTo: getRedirect(type, header)};
    case ERROR_MSG:
      return {...state, msg: action.data};
    case RECEIVE_USER:
      return action.data;
    case RESET_USER:
      return {...initState, msg: action.data};
    default:
      return state;
  }
}

const initUserList = [];
function userList(state=initUserList, action){
  switch (action.type) {
    case RECEICE_USER_LIST:
      return action.data;
    default:
      return state;
  }
}

const initChat = {
  users: {},
  chatMsgs: [],
  unReadCount: 0 //总的未读数量
}
function chat(state = initChat, action){
  switch (action.type){
    case RECEICE_MSG_LIST: //data:{users, chatMsgs}
      const {users, chatMsgs, userid} = action.data;
      return{
        users,
        chatMsgs,
        unReadCount: chatMsgs.reduce((preTotal, msg) => preTotal+(!msg.read && msg.to === userid? 1:0), 0)
      }
    case RECEICE_MSG: //data: chatMsg
      const {chatMsg} = action.data;
      return{
        users: state.users,
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to === action.data.userid? 1:0)
      }
    case MSG_READ:
      const {from, to, count} = action.data;
      return{
        users: state.users,
        chatMsgs: state.chatMsgs.map(msg => {
          if(msg.from === from && msg.to === to && !msg.read){
            return {...msg, read: true}
          }else{
            return msg;
          }
        }),
        unReadCount: state.unReadCount -count
      }
    default:
      return state;
  }
}

export default combineReducers({
  user,
  userList,
  chat
})
//向外暴露的结构：{xxx:0,...}


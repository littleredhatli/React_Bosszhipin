/*
包含n个action creator
异步action
同步action
 */

import {reqChatMsgList, reqLogin, reqReadMsg, reqRegister, reqUpdateUser, reqUser, reqUserList} from "../api";
import {
  AUTH_SUCCESS,
  ERROR_MSG, MSG_READ,
  RECEICE_MSG,
  RECEICE_MSG_LIST,
  RECEICE_USER_LIST,
  RECEIVE_USER,
  RESET_USER
} from "./action-types";
import io from 'socket.io-client';

const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user});
const errorMsg = (msg) => ({type:ERROR_MSG, data: msg});
const receiveUser = (user) => ({type: RECEIVE_USER, data: user});
export const resetUser = (msg) => ({type: RESET_USER, data: msg});
const receiceUserList = (userList) => ({type: RECEICE_USER_LIST, data: userList});
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEICE_MSG_LIST, data: {users, chatMsgs, userid}})
const receiveMsg = (chatMsg, userid) => ({type: RECEICE_MSG, data: {chatMsg, userid}})
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})

/*
单例对象
1.创建对象之前：判断是否已经创建
2.创建对象之后：保存对象
 */
function initIO(dispatch, userid){
  if(!io.socket){
    io.socket = io('ws://localhost:4000')
    // 绑定'receiveMessage'的监听, 来接收服务器发送的消息
    io.socket.on('receiveMsg', function (chatMsg) {
      console.log('浏览器端接收到消息:', chatMsg)
      //只有当chatMsgs是与当前用户相关的信息，才会去分发同步action保存消息
      if(userid === chatMsg.from || userid === chatMsg.to){
        dispatch(receiveMsg(chatMsg, userid));
      }
    })
  }

}

//发送消息的异步action
export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    console.log('发送消息', {from, to, content});
    //发消息
    io.socket.emit('sendMsg', {from, to, content})
  }
}

// 注册异步action
export const register = (user) => {
  //表单的前台验证
  const {username, password, passwordConfirm, type} = user;
  if(!username){
    return errorMsg('用户名不能为空');
  }else if(password!=passwordConfirm){
    return errorMsg('两次密码输入不一致');
  }

  return async dispatch => {
    // const promise = reqRegister(user)
    // promise.then(response => {
    //   const result = response.data;  //{code:0, data: user}
    // })
    const response = await reqRegister(user);
    const result = response.data;  //{code:0, data: user}
    if(result.code===0){
      getMsgList(dispatch, result.data._id);
      dispatch(authSuccess(result.data));
    }else{
      dispatch(errorMsg(result.msg));
    }
  }
}

// 登录异步action
export const login = (user) => {
  const {username, password} = user;
  if(!username){
    return errorMsg('用户名不能为空');
  }else if(!password){
    return errorMsg('密码不能为空');
  }

  return async dispatch => {
    const response = await reqLogin(user);
    const result = response.data;
    if(result.code===0){
      getMsgList(dispatch, result.data._id);
      dispatch(authSuccess(result.data));
    }else{
      dispatch(authSuccess(result.msg));
    }
  }
}

//更新用户异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user);
    const result = response.data;
    if(result.code===0){
      dispatch(receiveUser(result.data));
    }else{
      dispatch(resetUser(result.msg));
    }
  }
}

//获取用户异步action
export const getUser = () => {
  return async dispatch => {
    const response = await reqUser();
    const result = response.data;
    if(result.code === 0){
      getMsgList(dispatch, result.data._id);
      dispatch(receiveUser(result.data));
    }else{
      dispatch(resetUser(result.msg));
    }
  }
}

//获取用户列表的异步action
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type);
    const result = response.data;
    if(result.code === 0){
      dispatch(receiceUserList(result.data));
    }
  }
}

//异步获取消息列表数据
async function getMsgList(dispatch, userid){
  initIO(dispatch, userid);
  const response = await reqChatMsgList();
  const result = response.data;
  if(result.code === 0){
    const {users, chatMsgs} = result.data;
    dispatch(receiveMsgList({users, chatMsgs, userid}));
  }
}

//读取消息的异步action
export const readMsg = (from, to) => {
  return async dispatch => {
    const response = await reqReadMsg(from);
    const result = response.data;
    if(result.code === 0){
      const count = result.data;
      dispatch(msgRead({count, from, to}))
    }
  }
}


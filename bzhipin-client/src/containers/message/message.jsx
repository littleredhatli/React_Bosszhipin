import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Badge, List} from "antd-mobile";
const Item = List.Item;
const Brief = Item.Brief;

function getLastMsgs(chatMsgs, userid){
  // 1. 使用{}进行分组(chat_id), 只保存每个组最后一条 msg: {chat_id1: lastMsg1, chat_id2: lastMsg2}
  const lastMsgObjs = {};
  chatMsgs.forEach(msg => {
    if(msg.to === userid && !msg.read){
      msg.unReadCount = 1;
    }else{
      msg.unReadCount = 0;
    }

    const chatId = msg.chat_id;
    let lastMsg = lastMsgObjs[chatId];
    if(!lastMsg){
      lastMsgObjs[chatId] = msg;
    }else{
      const unReadCount = lastMsg.unReadCount;
      if(msg.create_time > lastMsg.create_time){
        lastMsgObjs[chatId] = msg;
      }
      lastMsgObjs[chatId].unReadCount = unReadCount + msg.unReadCount;
    }
  })
  // 2. 得到所有分组的 lastMsg 组成数组: Object.values(lastMsgsObj) [lastMsg1, lastMsg2]
  const lastMsgs = Object.values(lastMsgObjs);
  // 3. 对数组排序(create_time, 降序)
  lastMsgs.sort(function (m1, m2){ //如果结果小于0，将m1放前面
    return m2.create_time - m1.create_time;
  })
  return lastMsgs;
}

class Message extends Component {

  render() {
    const {user} = this.props;
    const {users, chatMsgs} = this.props.chat;
    //对chatMsgs进行分组
    const lastMsgs = getLastMsgs(chatMsgs, user._id);

    return (
      <List style={{marginTop: 50, marginBottom: 50}}>
        {
          lastMsgs.map(msg => {
            const targetUserId = msg.to === user._id? msg.from : msg.to;
            const targetUser = users[targetUserId];
            return(
              <Item
                key={msg._id}
                extra={<Badge text={msg.unReadCount}/>}
                thumb={targetUser.header? require(`../../assets/images/${targetUser.header}.png`) : null}
                arrow='horizontal'
                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
              >
                {msg.content}
                <Brief>{targetUser.username}</Brief>
              </Item>
            )
          })
        }
      </List>
    );
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat})
)(Message)
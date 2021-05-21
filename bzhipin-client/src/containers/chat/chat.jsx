import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Grid, Icon, InputItem, List, NavBar} from "antd-mobile";
import {sendMsg, readMsg} from '../../redux/actions';
import QueueAnim from "rc-queue-anim";
const Item = List.Item;

class Chat extends Component {
  state = {
    content: '',
    isShow: false  //是否显示表情列表
  }

  handleSend = () => {
    const from = this.props.user._id;
    const to = this.props.match.params.userid;
    const content = this.state.content.trim();
    //发送请求
    this.props.sendMsg({from, to, content})
    //清除输入
    this.setState({content: '', isShow: false});
  }

  toggleShow = () => {
    const isShow = !this.state.isShow;
    this.setState({isShow});
    if(isShow){
      // 异步手动派发 resize 事件,解决表情列表显示的 bug
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  componentWillMount() {
    const emojis = ['🥺', '😀', '😆', '🤣', '😂', '🙂', '🙃', '😉',
                    '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '🤡',
                    '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑',
                    '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑',
                    '🥺', '😀', '😆', '🤣', '😂', '🙂', '🙃', '😉',
                    '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '🤡',
                    '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑',
                    '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑'];
    this.emojis = emojis.map(emoji => ({text: emoji}));
  }

  componentDidMount() {
    // 初始显示列表
    window.scrollTo(0, document.body.scrollHeight)
  }
  componentDidUpdate () {
  // 更新显示列表
    window.scrollTo(0, document.body.scrollHeight)
  }
  componentWillUnmount() { //在退出前
    //发请求更新消息的未读状态
    const from = this.props.match.params.userid;
    const to = this.props.user._id;
    this.props.readMsg(from, to);
  }

  render() {
    const {user} = this.props;
    const {users, chatMsgs} = this.props.chat;

    const me_id = user._id;
    if(!users[me_id]) return null; //如果还没有获取数据，不做任何显示
    const target_id = this.props.match.params.userid;
    const chatId = [me_id, target_id].sort().join('_')
    //对chatMsgs进行过滤
    const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)

    //得到目标用户的头像
    const targetHeader = users[target_id].header;
    const targetIcon = targetHeader? require(`../../assets/images/${targetHeader}.png`) : null;

    return (
      <div id='chat-page'>
        <NavBar icon={<Icon type='left'/>}
                onLeftClick={() => this.props.history.goBack()}
                className='stick-header'
        >
          {users[target_id].username}
        </NavBar>
        <List style={{marginTop: 50, marginBottom: 50}}>
          {
            msgs.map(msg => {
              if(me_id === msg.to){ //对方发给我的
                return(
                  <Item key={msg._id} thumb={targetIcon}>
                    {msg.content}
                  </Item>
                )
              }else{
                return(
                  <Item key={msg._id} className='chat-me' extra='我'>
                    {msg.content}
                  </Item>
                )
              }
            })
          }
        </List>
        <div className='am-tab-bar'>
          <InputItem
            placeholder="请输入"
            value={this.state.content}
            onChange={val => this.setState({content: val})}
            onFocus={() => this.setState({isShow: false})}
            extra={
              <span>
                <span onClick={this.toggleShow} style={{marginRight: 5}}>😀</span>
                <span onClick={this.handleSend}>发送</span>
              </span>
            }
          />

          {this.state.isShow? (
            <Grid
              data={this.emojis}
              columnNum={8}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={(item) => {
                this.setState({content: this.state.content + item.text})
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg, readMsg}
)(Chat)
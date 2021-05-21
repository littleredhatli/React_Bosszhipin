/*
主界面路由
 */
import React, {Component} from 'react';
import {Switch, Route, Redirect} from "react-router-dom";

import BossInfo from "../boss-info/boss-info";
import StudentInfo from "../student-info/student-info";
import {connect} from "react-redux";
import Cookies from 'js-cookie' //可以操作前端cookie的对象set()/remove()
import {getRedirect} from '../../utils'
import {getUser} from "../../redux/actions";
import NotFound from "../../components/not-found/not-found";
import Boss from "../boss/boss";
import Student from "../student/student";
import Message from "../message/message";
import Personal from "../personal/personal";
import {NavBar} from "antd-mobile";
import NavFooter from "../../components/nav-footer/nav-footer";
import Chat from "../chat/chat";

class Main extends Component {
  //给组件对象添加属性
  navList = [
    {
      path: '/boss', // 路由路径
      component: Boss,
      title: '学生列表',
      icon: 'student',
      text: 'student',
    },
    {
      path: '/student', // 路由路径
      component: Student,
      title: 'boss列表',
      icon: 'boss',
      text: 'boss',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    }
  ]


  componentDidMount() {
    //登陆过（cookie中有userid），但还没有登陆(redux管理的user中没有_id)，发请求获取对应的user
    const userid = Cookies.get('userid');
    const {_id} = this.props.user;
    if(userid && !_id){
      //发送异步请求，获取user
      this.props.getUser();
    }
  }

  render() {
    //读取cookie中的userid
    //如果没有，自动重定向到登陆界面
    //如果有，读取redux中的user状态
    //user没有_id，返回null，不做任何显示
    const userid = Cookies.get('userid')
    if(!userid){
      return <Redirect to='/login'/>;
    }
    const {user} = this.props;
    const unReadCount = this.props.unReadCount
    if(!user._id){
      return null;
    }else{
      let path = this.props.location.pathname;
      if(path === '/'){
        path = getRedirect(user.type, user.header);
        return <Redirect to={path}/>
      }
    }

    const {navList} = this;
    const path = this.props.location.pathname;
    const currentNav = navList.find(nav => nav.path === path);
    if(currentNav){
      //决定哪个路由需要隐藏
      if(user.type === 'boss'){
        navList[1].hide = true;
      }else{
        navList[0].hide = true;
      }
    }

    return (
      <div>
        {currentNav? <NavBar className='stick-header'>{currentNav.title}</NavBar> : null}
        <Switch>
          {navList.map(nav => <Route key={nav.path} path={nav.path} component={nav.component}/>)}
          <Route path='/bossinfo' component={BossInfo}/>
          <Route path='/studentinfo' component={StudentInfo}/>
          <Route path='/chat/:userid' component={Chat}/>

          <Route component={NotFound}/>
        </Switch>
        {currentNav? <NavFooter navList = {navList} unReadCount ={unReadCount}/> : null}
      </div>
    );
  }
}

export default connect(
  state => ({user: state.user, unReadCount: state.chat.unReadCount}),
  {getUser}
)(Main)

/*
1. 实现自动登陆:
  1. componentDidMount()
    登陆过(cookie中有userid), 但没有有登陆(redux管理的user中没有_id) 发请求获取对应的user:
  2. render()
    1). 如果cookie中没有userid, 直接重定向到login
    2). 判断redux管理的user中是否有_id, 如果没有, 暂时不做任何显示
    3). 如果有, 说明当前已经登陆, 显示对应的界面
    4). 如果请求根路径: 根据user的type和header来计算出一个重定向的路由路径, 并自动重定向
 */
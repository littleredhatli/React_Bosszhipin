/*
注册路由文件
 */
import React, {Component} from 'react';

import {NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button} from "antd-mobile";
import Logo from "../../components/logo/logo";
import {register} from "../../redux/actions";
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom";
import "../../assets/css/index.less"

const ListItem = List.Item;
class Register extends Component {
  state = {
    username : '',
    password : '',
    passwordConfirm: '',
    type : 'student'
  }
  handleRegister = () => {
    this.props.register(this.state);
  }
  handleChange = (name, val) => {
    this.setState({
      [name] : val
    })
  }
  toLogin = () => {
    this.props.history.replace('/login');
  }

  render() {
    const {type} = this.state;
    const {msg, redirectTo} = this.props;
    if(redirectTo){
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>Boss&nbsp;直&nbsp;聘</NavBar>
        <WhiteSpace/>
        <Logo/>
        <WhiteSpace/>
        <WhiteSpace/>
        <WingBlank>
          <List>
            {msg? <div className="error-msg">{msg}</div> : null}
            <WhiteSpace/>
            <InputItem placeholder='请输入用户名' onChange={val => {this.handleChange('username',val)}}>用户名：</InputItem>
            <WhiteSpace/>
            <InputItem placeholder='请输入密码' type="password" onChange={val => {this.handleChange('password', val)}}>密码：</InputItem>
            <WhiteSpace/>
            <InputItem placeholder='请再次输入密码' type="password" onChange={val => {this.handleChange('passwordConfirm', val)}}>确认密码：</InputItem>
            <WhiteSpace/>
            <ListItem>
              <span>用户类型：</span>&nbsp;&nbsp;
              <Radio checked={type==='student'} onChange={() => this.handleChange('type', 'student')}>学生</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio checked={type==='boss'} onChange={() => this.handleChange('type', 'boss')}>老板</Radio>
            </ListItem>
            <WhiteSpace/>
            <WhiteSpace/>
            <Button type="primary" onClick={this.handleRegister}>注册</Button>
            <Button onClick={this.toLogin}>已有帐户</Button>
          </List>
        </WingBlank>
      </div>
    );
  }
}

export default connect(
  state => state.user,
  {register}
)(Register)
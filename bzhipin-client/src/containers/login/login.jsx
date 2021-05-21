/*
登录路由文件
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, InputItem, List, NavBar, WhiteSpace, WingBlank} from "antd-mobile";
import Logo from "../../components/logo/logo";
import {login} from "../../redux/actions";
import {Redirect} from "react-router-dom";
import "../../assets/css/index.less"

class Login extends Component {
  state = {
    username : '',
    password : '',
  }
  handleLogin = () => {
    this.props.login(this.state);
  }
  handleChange = (name, val) => {
    this.setState({
      [name] : val
    })
  }
  toRegister = () => {
    this.props.history.replace('/register');
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
            <WhiteSpace/>
            <WhiteSpace/>
            <Button type="primary" onClick={this.handleLogin}>登录</Button>
            <Button onClick={this.toRegister}>还没有帐户</Button>
          </List>
        </WingBlank>
      </div>
    );
  }
}

export default connect(
  state => state.user,
  {login}
)(Login)
/*
boss信息完善的路由组件容器
 */
import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Button, InputItem, NavBar, TextareaItem} from "antd-mobile";
import HeadSelect from "../../components/header-select/head-select";
import {updateUser} from '../../redux/actions'
import {Redirect} from "react-router-dom";

class BossInfo extends Component {
  state = {
    header: '',
    post: '',
    info: '',
    company: '',
    salary: ''
  }
  handleChange = (name, val) => {
    this.setState({
      [name]: val
    })
  }
  setHeader = (header) => {
    this.setState({
      header
    })
  }
  handleSave = () => {
    this.props.updateUser(this.state);
  }

  render() {
    const {header, type} = this.props.user;
    if(header){
      const path = type==='student'? '/student' : '/boss';
      return <Redirect to={path}/>
    }
    return (
      <div>
        <NavBar>Boss信息完善</NavBar>
        <HeadSelect setHeader = {this.setHeader}/>
        <InputItem placeholder='请输入招聘职位' onChange={val => {this.handleChange('post',val)}}>招聘职位：</InputItem>
        <InputItem placeholder='请输入公司名称' onChange={val => {this.handleChange('company', val)}}>公司名称：</InputItem>
        <InputItem placeholder='请输入职位薪资' onChange={val => {this.handleChange('salary', val)}}>职位薪资：</InputItem>
        <TextareaItem title='职位要求' rows={3} onChange={val => {this.handleChange('info', val)}}/>
        <Button type="primary" onClick={this.handleSave}>保存</Button>
      </div>
    );
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(BossInfo)
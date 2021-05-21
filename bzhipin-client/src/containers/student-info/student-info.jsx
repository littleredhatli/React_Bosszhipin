import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Button, InputItem, NavBar, TextareaItem} from "antd-mobile";
import HeadSelect from "../../components/header-select/head-select";
import {updateUser} from '../../redux/actions'
import {Redirect} from "react-router-dom";

class StudentInfo extends Component {
  state = {
    header: '',
    post: '',
    info: ''
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
        <NavBar>学生信息完善</NavBar>
        <HeadSelect setHeader={this.setHeader}/>
        <InputItem placeholder='请输入求职岗位' onChange={val => {this.handleChange('post',val)}}>求职岗位：</InputItem>
        <TextareaItem title='个人介绍' rows={3} onChange={val => {this.handleChange('info',val)}}/>
        <Button type="primary" onClick={this.handleSave}>保存</Button>
      </div>
    );
  }
}

export default connect(
  state => ({user: state.user}),
  {updateUser}
)(StudentInfo)
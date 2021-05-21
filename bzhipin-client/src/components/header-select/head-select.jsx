/*
选择用户头像的UI组件
 */
import React, {Component} from 'react';
import {List, Grid} from "antd-mobile";
import PropTypes from 'prop-types';


export default class HeadSelect extends Component {
  static propTypes = {
    setHeader: PropTypes.func.isRequired
  }
  state = {
    icon: null
  }
  selectHeader = ({icon, text}) => {
    this.setState({icon});
    this.props.setHeader(text);
  }

  constructor(props) {
    super(props);
    this.headList=[]
    for(let i=0;i<20;i++){
      this.headList.push({
        text: '头像'+(i+1),
        icon: require(`../../assets/images/头像${i+1}.png`)
      })
    }
  }

  render() {
    const {icon} = this.state;
    const listHead = icon? <p>已选择头像：<img src={icon} alt='header'/></p> : '请选择头像';
    return (
      <List renderHeader={() => listHead}>
        <Grid data={this.headList} columnNum={5} onClick={this.selectHeader}/>
      </List>
    );
  }
}
import React, {Component} from 'react';
import {TabBar} from "antd-mobile";
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";

const Item = TabBar.Item;

class NavFooter extends Component {
  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadCount: PropTypes.number.isRequired
  }

  render() {
    let {navList,unReadCount} = this.props;
    //过滤掉hide为true的nav
    navList = navList.filter(nav => !nav.hide)
    const path = this.props.location.pathname;
    return (
      <TabBar>
        {
          navList.map((nav, index) => (
            <Item title={nav.text}
                  badge={nav.path === '/message' ? unReadCount:0}
                  key={nav.path}
                  icon={{uri: require(`./images/${nav.icon}.png`)}}
                  selectedIcon={{uri: require(`./images/${nav.icon}-selected.png`)}}
                  selected={nav.path===path}
                  onPress={() => this.props.history.replace(nav.path)}
            />
          ))
        }
      </TabBar>
    );
  }
}

//向外暴露withRouter包装产生的组件
//内部会向组件中传入一些路由组件特有的属性：history/location/math，让非路由组件可以访问到路由组件的 API
export default withRouter(NavFooter)
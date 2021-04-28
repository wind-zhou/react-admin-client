import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";

import menuList from "../../config/menuConfig";

import logo from "../../assets/logo.png";
import "antd/dist/antd.css";

import "./index.css";

const { SubMenu } = Menu;

class LeftNav extends Component {
  getMenuFromList = menuList => {
    const path = this.props.location.pathname;
    return menuList.map(item => {
      if (!item.children) {
        //没有二级项
        return (
          <Menu.Item key={item.key} icon={item.icon}>
            <Link to={item.key}>{item.title}</Link>
          </Menu.Item>
        );
      } else {
        //有二级项
        const citem = item.children.find(citem => {
          return citem.key === path;
        });

        if (citem) {
          // 如果有值
          this.openKey = item.key;
        }

        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {this.getMenuFromList(item.children)}
            {/* 使用递归进行遍历 */}

            {/* (1)判断当前的路径path是不是二级向里的*/}

            {/* (2)如果是，则将当前项的key存起来，作为 defaultOpenKeys的值*/}
          </SubMenu>
        );
      }
    });
  };

  componentWillMount(){
    // 在frender之前执行，为第一次执行准备数据
    // 必须是同步的动作
    // 这里是一次优化，如果写在render里，每次更新都会中心计算一次，没有必要，写在这里，只会执行一次。（因为他只需执行一次）
    this.menunodes=this.getMenuFromList(menuList)
  }

  render() {
    // 获取当前的路由路径
    const path = this.props.location.pathname;
    console.log(this);
    console.log(this.openKey);
    return (
      <div className="left-nav">
        <div className="left-nav-header">
          <Link to="/">
            <img src={logo} alt="" />
            <span>后台管理系统</span>
          </Link>
        </div>

        <div>
          <Menu
            selectedKeys={[path]} //默认选中
            defaultOpenKeys={[this.openKey]}
            mode="inline"
            theme="dark"
          >
            {this.menunodes}
          </Menu>
        </div>
      </div>
    );
  }
}

export default withRouter(LeftNav);

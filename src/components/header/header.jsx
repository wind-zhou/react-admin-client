import React, { Component } from "react";
import { SmileTwoTone } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { formateDate } from "../../utils/dateProcess";
import LocalUser from "../../utils/localStorage";
import memoryList from "../../utils/memoryUser";
import LinkButton from '../../components/link-button'
import { Modal } from "antd";

import menuConfig from "../../config/menuConfig";
import { reqIpAddress, reqWeather } from "../../api/index";

import "./header.css";

class Header extends Component {
  state = {
    title: "",
    province: "",
    city: "",
    currentTime: formateDate(Date.now()), //当前时间
    weather: "", //天气
    winddirection: "" //风向
  };

  // 过去当前时间。并实时更新
  getTime = () => {
    this.setInterval = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({
        currentTime
      });
    }, 1000);
  };

  // 获取天气
  getWeather = async () => {
    const cityObj = await reqIpAddress();
    const weatherInfo = await reqWeather(cityObj.cityCode);
    const { province, weather, winddirection, city } = weatherInfo.lives[0];
    this.setState({ province, weather, winddirection, city });
  };

  // 获取当前的请求路径

  getTitle = () => {
    const path = this.props.location.pathname;
    let title;

    menuConfig.forEach(item => {
      if (item.key === path) {
        //如果找到当前的pathname
        title = item.title; //去除相应的title
      } else if (item.children) {
        //如果有二级项
        item.children.map(cItem => {
          if (cItem.key === path) {
            title = cItem.title;
          }
        });
      }
    });

    return title;
  };
  // 点击退出
  louOut = () => {

    // 调用对话框函数
    Modal.confirm({
      content: "确定要退出吗？",
      onOk: () => {
        console.log("OK");

        // 1、清空memory和localstorage
        LocalUser.removeUser();
        memoryList.user = {};
        // 2、跳转路由至登录页面

        this.props.history.replace("/login");
      }
    });
  };

  componentDidMount() {
    this.getWeather();
    this.getTime();
  }

  componentWillUnmount() {
    clearInterval(this.setInterval);
  }

  render() {
    // this.getTitle();
    const { province, weather, winddirection, currentTime, city } = this.state;
    return (
      <div className="header">
        <div className="header-top">
          <span> 欢迎，admin</span>
          <LinkButton  onClick={this.louOut}>退出</LinkButton>
        </div>

        <div className="header-bottom">
          <div className="header-bottom-left">{this.getTitle()}</div>
          <div className="header-bottom-right">
            <span> {currentTime}</span>
            <span>{province}</span>
            <span>{city}</span>
            <span>{weather}</span>
            <span>风向：{winddirection}</span>
            <SmileTwoTone />
            <span>晴</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);

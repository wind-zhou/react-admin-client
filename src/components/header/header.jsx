import React, { Component } from "react";
import { SmileTwoTone } from "@ant-design/icons";

import "./header.css";

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="header-top">
          <span> 欢迎，admin</span>
          <a href="JavaScript:">退出</a>
        </div>

        <div className="header-bottom">
          <div className="header-bottom-left">首页</div>
          <div className="header-bottom-right">
            <span> 2021-4.26-22:33:23</span>
            <SmileTwoTone />
            <span>晴</span>
          </div>
        </div>
      </div>
    );
  }
}

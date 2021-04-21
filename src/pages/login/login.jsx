import React, { Component } from "react";
import './login.css'
import logo from './images/logo.png'

// d登录的路由组件
export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <header className="login-header"> 
            <img src={logo} alt=""/>
            <h1>React 后台管理系统</h1>
        </header>
        <section className="login-content">
        </section>
      </div>
    );
  }
}

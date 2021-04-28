import React, { Component } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";


import memoryUser from "../../utils/memoryUser";
import LocalUser from "../../utils/localStorage";

import "./login.css";

import logo from "../../assets/logo.png";

// 引入ajax
import { reqLogin } from "../../api/index";

// 登录的路由组件
export default class Login extends Component {
  onFinish = async values => {
    //使用async，将异步操作同步化(注意async的书写位置)
    // form表单出请求

    const { username, password } = values;

    //错误补捕获机制
    const result = await reqLogin(username, password);  
    console.log("请求成功：", result);

    // 判断是否登陆成功
    if (!result.status) {
      //登录成功
      // 1、提示成功
      message.success("登陆成功");
      // 2、将数据存起来
      memoryUser.user = result; //存到内存
      LocalUser.setUser(result); //存到本地
      //3、跳转管理界面
      this.props.history.replace("/");

      console.log(111);
    } else {
      message.success("登陆失败");
    }
  };
  render() {
    // 如果已经登录成功，则挑战到管理页面（admin）
    const user = memoryUser.user.data;
    console.log(user)

    // 自动登陆功能
    
    // if (user._id) {
    //   //如果内存中有数据，则跳转
    //   return <Redirect  to="/"/>;
    // }

    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="" />
          <h1>React 后台管理系统</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>

          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "请输入你的姓名!"
                }
              ]}
              initialValue="admin" //设置 初始值
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="姓名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                //声明式
                {
                  required: true,
                  whitespace: true,
                  message: "请输入你的密码!"
                },
                {
                  min: 2,
                  message: "密码最少四位!"
                },
                {
                  max: 10,
                  message: "密码不超过10位!"
                },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: "密码必须由数字字母下划线组成!"
                }
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}

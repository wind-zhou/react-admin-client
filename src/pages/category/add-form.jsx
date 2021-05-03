import React, { Component } from "react";
import { Form, Input } from "antd";
import { Select } from "antd";
const { Option } = Select;

export default class AddForm extends Component {
  // 表演验证成功后的回调函数
  onFinish = values => {
    console.log(values);
  };

  render() {
    return (
      <div>
        <Form onFinish={this.onFinish}>
          <p>所属分类</p>
          <Form.Item>
            <Select placeholder="Select a person" defaultValue="0">
              <Option value="0">一级列表</Option>
              <Option value="1">手机</Option>
              <Option value="2">彩电</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "您输入的内容为空!"
              }
            ]}
          >
            <p>分类名称</p>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
        </Form>
      </div>
    );
  }
}

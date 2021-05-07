import React, { Component } from "react";
import { Card, Input, Button, Form, Select, Cascader } from "antd";

import { LeftCircleTwoTone } from "@ant-design/icons";

const { TextArea } = Input;

export default class ProductAdd extends Component {
  state = {
    optionLists: [
      {
        value: "zhejiang",
        label: "Zhejiang",
        isLeaf: false
      },
      {
        value: "jiangsu",
        label: "Jiangsu",
        isLeaf: false
      }
    ]
  };
  onFinish = () => {
    //表单验证成功时的回调函数

    alert("发送ajax请求");
  };

  //加载数据的函数（里面可以放一些ajax请求）  ---什么时候触发呢？
  loadData = selectedOptions => {
    console.log("触发了加载函数", this.state.optionLists);
    const targetOption = selectedOptions[0]; //拿到当前的数据对象,这里是浅拷贝

    console.log("targetOption", targetOption);
    targetOption.loading = true; //开启加载loading

    // load options lazily
    setTimeout(() => {
      // debugger;
      targetOption.loading = false;
      targetOption.children = [
        //将异步请求到的数据塞到children的位置
        {
          label: `${targetOption.label} Dynamic 1`,
          value: "dynamic1"
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: "dynamic2"
        }
      ];
      this.setState({
        optionLists: [...this.state.optionLists]
      });
    }, 100);
  };

  //

  render() {
    const title = (
      <span>
        <LeftCircleTwoTone
          onClick={() => {
            this.props.history.goBack();
          }}
        />
        <span style={{ margin: "0 20px" }}>添加商品</span>
      </span>
    );

    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 10
      }
    };

    return (
      <Card title={title} style={{ width: "90%", margin: "20px auto" }}>
        <Form
          {...formItemLayout}
          // form={form}
          name="register"
          onFinish={this.onFinish}
        >
          <Form.Item
            name="productName"
            label="商品名称"
            rules={[
              {
                required: true,
                message: "名称不能为空"
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="ProductDesc"
            label="商品描述"
            rules={[
              {
                required: true,
                message: "Please input your password!"
              }
            ]}
          >
            <TextArea
              placeholder="请添加商品描述"
              rows={2}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="ProductPrice"
            label="商品价格"
            rules={[
              {
                required: true,
                message: "请输入价格"
              },
              () => ({
                validator(_, value) {
                  if (value > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("价格不能小于0"));
                }
              })
            ]}
          >
            <Input addonAfter="元" type="number" />
          </Form.Item>

          <Form.Item name="ProductCategory" label="商品分类">
            <Cascader
              options={this.state.optionLists}
              loadData={this.loadData}
            />
          </Form.Item>

          <Form.Item label="商品图片">
            <div>商品图片</div>
          </Form.Item>

          <Form.Item label="商品详情">
            <div>商品详情</div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

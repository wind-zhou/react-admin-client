import React, { Component } from "react";
import { Card, Input, Button, Form, Select, Cascader } from "antd";
import { reqCategorys } from "../../api/index";

import { LeftCircleTwoTone } from "@ant-design/icons";

const { TextArea } = Input;

export default class ProductAdd extends Component {
  state = {
    optionLists: []
  };
  onFinish = () => {
    //表单验证成功时的回调函数

    alert("发送ajax请求");
  };

  //加载数据的函数（里面可以放一些ajax请求）  ---什么时候触发呢？
  loadData = async selectedOptions => {
    const targetOption = selectedOptions[0]; //拿到当前的数据对象,这里是浅拷贝
    targetOption.loading = true; //开启加载loading

    // 请求二级项
    const subCategory = await this.getCategorys(targetOption.value);
    targetOption.loading = false; //开启加载loading

    // 判断是否有二级项

    if (!subCategory || subCategory.length === 0) {
      targetOption.isLeaf = true;
    } else {
      targetOption.children = subCategory;
    }

    this.setState({
      //重新设置数据
      optionLists: [...this.state.optionLists]
    });
    //这里的optionLists已经发生了改变，因为该函数的形参是一个对象，属于optionLists的浅拷贝
  };

  // 请求一级列表

  getCategorys = async parentId => {
    const result = await reqCategorys(parentId);
    if (parentId === "0") {
      //如果请求的是一级列表
      if (result.status === 0) {
        const newOptionList = result.data.map(category => {
          return {
            value: category._id,
            label: category.name,
            isLeaf: false //这里有一个问题，如何判断一级列表有没有自己列表呢？
          };
        });

        this.setState({
          optionLists: newOptionList
        });
      }
    } else {
      //如果请求二级项，则返回

      if (result.status === 0) {
        const newOptionList = result.data.map(category => {
          return {
            value: category._id,
            label: category.name,
            isLeaf: true //这里有一个问题，如何判断一级列表有没有自己列表呢？
          };
        });
        return newOptionList;
      }
    }
  };

  //发送ajax，请求一级列表
  componentDidMount() {
    this.getCategorys("0");
  }

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

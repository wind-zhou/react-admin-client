import React, { Component } from "react";
import { Card, Input, Button, Form, Select, Cascader } from "antd";
import { reqCategorys } from "../../api/index";

import { LeftCircleTwoTone } from "@ant-design/icons";

const { TextArea } = Input;

export default class ProductAdd extends Component {
  state = {
    optionLists: []
  };
  onFinish = value => {
    //表单验证成功时的回调函数

    console.log(value);

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
        /* ----------------------------------------------- */
        // 请求一级列表的数据
        const newOptionList = result.data.map(category => {
          return {
            value: category._id,
            label: category.name,
            isLeaf: false //这里有一个问题，如何判断一级列表有没有自己列表呢？
          };
        });

        /* ------------------------------ */
        //如果是点击修改进来，则需要请求时就把二级列表页请求回来并做展示
        // const { pCategoryId } = this.product;

        if (this.isUpdate && this.product.pCategoryId !== "0") {
          //这肯定是有二级列表了
          const result = await reqCategorys(this.product.pCategoryId);
          if (result.status === 0) {
            //接收二级到数据，修改成optionList的形式
            const subCategorys = result.data.map(category => {
              return {
                value: category._id,
                label: category.name,
                isLeaf: true
              };
            });

            console.log("---------------------------------");
            console.log(subCategorys);
            console.log("---------------------------------");

            // 查找targetOption
            const targetOption = newOptionList.find(item => {
              return item.value === this.product.pCategoryId;
            });

            // 添加到children字段至查找targetOption
            targetOption.children = subCategorys;

            console.log("---------------------------------");
            console.log(newOptionList);
            console.log("---------------------------------");
          }
        }

        /* ------------------------------ */
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
            isLeaf: true
          };
        });
        return newOptionList;
      }
    }
  };

  // 但点击修改进来时，做数据的预处理
  UNSAFE_componentWillMount() {
    // 取到传递过来的product
    const product = this.props.location.state;
    // 这时候要告知组件填入我传过来的数据
    // 怎么区分’添加‘进入还是‘修改’进入呢？需要一个字段，然后组件的值根据字段取相应变化

    this.isUpdate = !!product; //作用：将其转化为bool，如果优质则为true。当然也可以进行if判断
    console.log(product);

    this.product = product; //挂载到下实例上，请求时会用到
  }

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

    const product = this.props.location.state || {};
    const { pCategoryId, categoryId } = product;

    let categorys = [];

    if (this.isUpdate) {
      if (pCategoryId === "0") {
        categorys.push(categoryId);
      } else {
        categorys.push(pCategoryId);
        categorys.push(categoryId);
      }
    }

    return (
      <Card title={title} style={{ width: "90%", margin: "20px auto" }}>
        <Form
          {...formItemLayout}
          // form={form}
          name="register"
          onFinish={this.onFinish}
          initialValues={{
            productName: product.name,
            ProductDesc: product.desc,
            ProductPrice: product.price,
            ProductCategory: categorys
          }}
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

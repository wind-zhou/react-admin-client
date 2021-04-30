import React, { Component } from "react";
import LinkBUtton from "../../components/link-button";
import { PlusOutlined } from "@ant-design/icons";
import { Card, message } from "antd";
import { Table } from "antd";

import { reqCategorys } from "../../api/index";
import "antd/dist/antd.css";
import "./category.css";

export default class Category extends Component {
  state = {
    isLoading: false, //loading加载页面
    categorys: [], //一级列表的数据
    parentId: "0", //当前列表的父类id,默认取一级
    parentName: "",
    subCategorys: [] //子分类列表数据
  };

  // 初始化列
  initColum = () => {
    this.colums = [
      {
        title: "分类的名称",
        dataIndex: "name"
      },
      {
        title: "操作",
        dataIndex: "",
        width: "30%",
        render: category => {
          //返回界面显示标签，参数为每一行的分类对象（antd的语法糖）
          return (
            <div className="operation">
              <LinkBUtton>修改分类</LinkBUtton>

              {/* 条件渲染，但显示自己项时，不渲染 */}
              {this.state.parentId === "0" ? (
                <LinkBUtton onClick={() => this.showSubCategorys(category)}>
                  查看子分类
                </LinkBUtton>
              ) : null}
            </div>
          );
        }
      }
    ];
  };

  //获取categorys（一级或二级）
  getCategory = async () => {
    // 请求前加载loading
    this.setState({
      isLoading: true
    });

    const { parentId } = this.state;

    // 发送异步ajax请求
    const result = await reqCategorys(parentId);

    // 请求完成后，取消loading
    this.setState({
      isLoading: false
    });
    if (result.status === 0) {
      // 取出分类列表数据
      const categorys = result.data;

      if (parentId === "0") {
        // 更新一级分类数据
        this.setState({
          categorys
        });
      } else {
        // 更新二级分类数据
        this.setState({
          subCategorys: categorys
        });
      }
    } else {
      message.error("获取分类列表失败");
    }
  };

  // 显示一级对象的子分类列表

  showSubCategorys = category => {
    // (1)更新状态
    this.setState(
      {
        parentId: category._id,
        parentName: category.name
      },
      () => {
        //回调函数，在状态重新render后执行，这是就可以拿到更新后的 parentId
        console.log("showSubCategorys()", this.state.parentId); //这是打印输出位0，因为setState时异步的，也即是说，设置完了，但不会立马更新
        // 发送ajax请求子分类数据
        this.getCategory();
      }
    );
  };
  // 点击切换至一级列表项
  tranferToFather=() => {

    this.setState({
      parentId:'0'
    })
    
  }
  
  // 为第一次render提供初始化数据
  componentWillMount() {
    // 初始化table的列
    this.initColum();
  }

  // 发送异步请求
  componentDidMount() {
    this.getCategory();
  }

  render() {
    const {
      categorys,
      isLoading,
      subCategorys,
      parentName,
      parentId
    } = this.state;

    const title =
      parentId === "0" ? (
        "一级品类列表"
      ) : (
        <span>
          <LinkBUtton onClick={this.tranferToFather}>一级品类列表</LinkBUtton>
          <span>---></span>
          <span>{parentName}</span>
        </span>
      );
    const extra = (
      <LinkBUtton>
        <PlusOutlined />
        添加
      </LinkBUtton>
    );

    console.log("render():", parentId);
    return (
      <div>
        <Card
          title={title}
          extra={extra}
          style={{ width: "90%", margin: "20px auto" }}
        >
          <Table
            columns={this.colums}
            dataSource={parentId === "0" ? categorys : subCategorys}
            bordered
            loading={isLoading}
            pagination={{
              defaultPageSize: 5,
              showQuickJumper: true,
              responsive: true,
              pageSizeOptions: [5]
            }}
            rowKey="_id"
          />
        </Card>
      </div>
    );
  }
}

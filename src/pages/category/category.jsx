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
    // parentId:'0',  //当前列表的父分类
    // paretnName:'' 
    
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
        render: () => {
          return (
            <div className="operation">
              <LinkBUtton>修改分类</LinkBUtton>
              <LinkBUtton>查看子分类</LinkBUtton>
            </div>
          );
        }
      }
    ];
  };

  //获取categorys
  getCategory = async () => {
    this.setState({
      isLoading: true
    });
    const result = await reqCategorys("0");
    this.setState({
      isLoading: false
    });
    if (result.status === 0) {
      const categorys = result.data;
      this.setState({
        categorys
      });
    } else {
      message.error("获取分类列表失败");
    }
  };

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
    const title = "一级品类列表";
    const extra = (
      <LinkBUtton>
        <PlusOutlined />
        添加
      </LinkBUtton>
    );

    const { categorys, isLoading } = this.state;
    return (
      <div>
        <Card
          title={title}
          extra={extra}
          style={{ width: "90%", margin: "20px auto" }}
        >
          <Table
            columns={this.colums}
            dataSource={categorys}
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

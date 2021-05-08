import React, { Component } from "react";
import { Card, Table, Select, Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import LinkBUtton from "../../components/link-button/index";
import { reqProducts, reqSearch, reqUpdataStatus } from "../../api/index";
import { PAGE_SIZE } from "../../utils/constant";
const { Option } = Select;

export default class ProductHome extends Component {
  state = {
    total: "", //总数量
    products: [], //存放产品数据信息
    searchType: "productDesc", //搜索的类型  用于和select绑定
    srarchName: "" //搜索的关键字  用于和input绑定
  };

  pagNum = "1";

  // 初始化列
  initColum = () => {
    this.colums = [
      {
        title: "商品名称",
        dataIndex: "name"
      },
      {
        title: "商品描述",
        dataIndex: "desc"
      },
      {
        title: "价格",
        dataIndex: "price",
        render: price => {
          return "￥" + price;
        }
      },
      {
        width: 150,
        title: "状态",
        // dataIndex: "status",  //将其注释掉后，render里的就是当前行的对象
        render: product => {
          const { _id, status } = product; //status控制状态，1 代表在售，2代表已下架

          // console.log("当前的status值为：", status);
          return (
            <>
              <LinkBUtton
                onClick={() => this.changeStatus(_id, status === 1 ? 2 : 1)}
              >
                {status === 1 ? "下架" : "上架"}
              </LinkBUtton>
              <br />
              <span> {status === 1 ? "在售" : "已下架"}</span>
            </>
          );
        }
      },
      {
        width: 150,
        title: "操作",
        render: product => {
          return (
            <>
              <span
                style={{ color: "green", cursor: "pointer" }}
                onClick={() => {
                  this.props.history.push("/product/details", product); //编程式路由跳转 并传值
                }}
              >
                详情
              </span>
              <br />
              <span
                style={{ color: "green", cursor: "pointer" }}
                onClick={() => {
                  this.props.history.push("/product/add", product);
                }}
              >
                修改
              </span>
            </>
          );
        }
      }
    ];
  };

  // 修改上架和下架的状态

  changeStatus = async (id, status) => {
    console.log(status);
    const result = await reqUpdataStatus(id, status); //修改后台

    if (result.status === 0) {
      //修改成功
      message.success("修改成功");
      // 重新显示
      this.getproducts(this.pagNum);
    }
  };

  //   请求products数据
  getproducts = async pageNum => {
    const { srarchName, searchType } = this.state;
    // 判断一般请求还是搜索请求

    let result;
    if (srarchName === "") {
      result = await reqProducts(pageNum, PAGE_SIZE);
    } else {
      result = await reqSearch(pageNum, PAGE_SIZE, srarchName, searchType);
    }

    if (result.status === 0) {
      //请求成功
      const { total, list } = result.data;
      this.setState({
        total,
        products: list
      });
    }
  };

  //   点击页码请求
  onPageChange = pageNum => {
    console.log(pageNum);

    this.pagNum = pageNum; //告诉后面当前在第几页
    this.getproducts(pageNum);
  };

  componentDidMount() {
    //   请求products数据
    this.getproducts("1");
  }

  UNSAFE_componentWillMount() {
    this.initColum(); //初始化列
  }

  render() {
    const columns = this.colums;
    const { total, searchType, srarchName } = this.state;

    const title = (
      <span>
        <Select
          style={{ width: 150 }}
          defaultValue={searchType}
          onChange={value => {
            this.setState({ searchType: value });
          }}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc"> 按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: "0 10px" }}
          value={srarchName}
          onChange={e => {
            this.setState({ srarchName: e.target.value });
          }}
        />
        <Button
          type="primary"
          onClick={() => {
            this.getproducts("1");
          }}
        >
          搜索
        </Button>
      </span>
    );

    const extra = (
      <span>
        <LinkBUtton
          onClick={() => {
            this.props.history.push("/product/add");
          }}
        >
          <PlusOutlined />
          添加
        </LinkBUtton>
      </span>
    );

    return (
      <div>
        <Card
          title={title}
          extra={extra}
          style={{ width: "90%", margin: "20px auto" }}
        >
          <Table
            dataSource={this.state.products}
            columns={columns}
            rowKey="_id"
            pagination={{
              total,
              defaultPageSize: PAGE_SIZE,
              pageSizeOptions: [5],
              showQuickJumper: true,
              onChange: this.onPageChange
            }}
          ></Table>
        </Card>
      </div>
    );
  }
}

import React, { Component } from "react";
import { Card, Table, Button, Modal, Input, message } from "antd";
import { PAGE_SIZE } from "../../utils/constant";
import { reqRoles, reqAddRoles } from "../../api/index";

export default class Role extends Component {
  state = {
    activeRowKey: "5ff5ab2fa4aca2121c004675", //当前选中的 row
    isSetAuthority: true, //是否激活权限按钮
    roles: [],
    isAddRole: false, //是否添加角色
    input: ""
  };

  // 初始化列
  initColum = () => {
    this.colums = [
      {
        title: "角色名称",
        dataIndex: "name"
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: time => this.timestampToTime(time)
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: time => {
          if (time) {
            return this.timestampToTime(time);
          }
        }
      },
      {
        title: "授权人",
        dataIndex: "auth_name"
      }
    ];
  };

  //

  //时间戳转日期
  timestampToTime = shijian => {
    var date = new Date(shijian);
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "";
    return Y + M + D;
  };
  // row的点击事件
  rowClick = record => {
    // 点击控制state的activeRowKey，activeRowKey控制radio的选中与否
    return {
      onClick: () => {
        this.setState({
          activeRowKey: record._id,
          isSetAuthority: false
        });
      }
    };
  };

  // 获取roles列表

  getRoles = async () => {
    const result = await reqRoles();
    const roles = result.data.reverse();
    if (result.status === 0) {
      this.setState({
        roles
      });
    }
  };

  // 确认获取角色列表
  confirmToAdd = async () => {
    const roleName = this.state.input;
    this.setState({
      isAddRole: false
    });

    if (roleName !== "") {
      const result = await reqAddRoles(roleName);

      if (result.status === 0) {
        message.success("添加用户成功");
        this.getRoles(); //再次获取角色列表
      }
    }
  };

  // 为第一次render提供初始化数据
  componentWillMount() {
    // 初始化table的列
    this.initColum();
  }

  // 发送请求，获取role数据

  componentDidMount() {
    this.getRoles();
  }

  render() {
    const title = (
      <span>
        <Button
          type="primary"
          style={{ marginRight: "20px" }}
          onClick={() => {
            this.setState({ isAddRole: true });
          }}
        >
          创建角色
        </Button>
        <Button disabled={this.state.isSetAuthority} type="primary">
          设置角色权限
        </Button>
      </span>
    );

    const { roles, isAddRole } = this.state;

    return (
      <Card title={title} style={{ width: "90%", margin: "20px auto" }}>
        <Table
          columns={this.colums}
          dataSource={roles}
          bordered
          pagination={{
            defaultPageSize: PAGE_SIZE,
            pageSizeOptions: [PAGE_SIZE]
          }}
          rowKey="_id"
          rowSelection={{
            selectedRowKeys: [this.state.activeRowKey],
            type: "radio"
          }}
          onRow={this.rowClick}
        />
        {isAddRole ? (
          <Modal
            title="添加角色"
            onOk={this.confirmToAdd}
            visible={true}
            onCancel={() => {
              this.setState({ isAddRole: false });
            }}
          >
            <Input
              onChange={e => {
                this.setState({
                  input: e.target.value
                });
              }}
              placeholder="请输入角色名称"
            />
          </Modal>
        ) : null}
      </Card>
    );
  }
}

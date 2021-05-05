/* 
子组件
 */
import React, { Component } from "react";
import { Form, Input } from "antd";

export default class UpdateForm extends Component {
  state = {
    name: ""
  };

  componentWillMount() {

    console.log("执行了一次componentWillMount")
    this.setState({
      name: this.props.category.name
    });
  }

  componentWillReceiveProps(props) {
    console.log("执行了一次componentWillReceiveProps")
    this.setState({
      name: props.category.name
    });
  }

  updateInput = e => {

    console.log(this.state.name)
    // 将input和state双向绑定
    const newCon = e.target.value;
    this.setState(
      {
        name: newCon
      },
      () => {
        this.props.getNameToFather(this.state.name);
      }
    );
  };

  render() {

    return (
      <div>
        <Form>
          <Form.Item>
            <Input
              placeholder="请输入修改的名称"
              value={this.state.name}
              onChange={this.updateInput} //更新按钮
            />
          </Form.Item>
        </Form>
      </div>
    );
  }
}

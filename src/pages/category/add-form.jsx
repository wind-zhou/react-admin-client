import React, { Component } from "react";
import { Form, Input } from "antd";
import { Select } from "antd";
const { Option } = Select;

export default class AddForm extends Component {
  // 创建form的挂载点ref
  // formRef = React.createRef();

  tranfer = () => {
    this.props.getFormOfAdd(this.formRef);
    // console.log(this.formRef.getFieldValue());
  };

  UNSAFE_componentWillReceiveProps(props) {
    console.log(this.formRef.setFieldsValue({ currentId: props.parentId }));
  }

  render() {
    const { categorys, parentId } = this.props;
    console.log("执行了子组件,parentID=", parentId);

    return (
      <div>
        <Form
          onFieldsChange={this.tranfer}
          ref={element => {
            this.formRef = element;
          }}
          initialValues={{ currentId: parentId }}
        >
          <Form.Item name="currentId" label="所属分类">
            <Select key={new Date().getTime()}>
              <Option value="0">一级列表</Option>
              {categorys.map(item => {
                return (
                  <Option value={item._id} key={item._id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label="分类名称"
            name="categoryName"
            rules={[
              {
                required: true,
                message: "您输入的内容为空!"
              }
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
        </Form>
      </div>
    );
  }
}

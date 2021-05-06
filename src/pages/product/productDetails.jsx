import React, { Component } from "react";
import { Card, List } from "antd";
import { LeftCircleTwoTone } from "@ant-design/icons";
import { reqProductCategory } from "../../api/index";
import "./productDetails.css";

const Item = List.Item;

export default class ProductDetails extends Component {
  state = {
    firstName: "", //一级分类名称
    secondName: "" //二级分类名称
  };

  // 获取产品的分类信息
  // 要发送两个请求：一级分类和二级分类
  getProductCategory = async () => {
    const { pCategoryId, categoryId } = this.props.location.state;
    // 因为当pCategoryId=0时父分类已经知道了，所以只发送一个即可
    if (pCategoryId === "0") {
      const result = await reqProductCategory(categoryId);
      this.setState({
        secondName: result.name
      });
    } else {
      const result = await Promise.all([
        //使用promise封装多个请求
        reqProductCategory(pCategoryId),
        reqProductCategory(categoryId)
      ]);

      console.log(result);

      this.setState({
        firstName: result[0].data.name,
        secondName: result[1].data.name
      });
    }
  };

  componentDidMount() {
    this.getProductCategory();
  }

  render() {
    const title = (
      <span>
        <LeftCircleTwoTone
          onClick={() => {
            this.props.history.goBack();
          }}
        />
        <span style={{ margin: "0 20px" }}>商品详情</span>
      </span>
    );

    const { detail, desc, price, name, imgs } = this.props.location.state;

    const { firstName, secondName } = this.state;

    console.log(this.props.location.state);
    return (
      <Card title={title}>
        <List>
          <Item>
            <div>
              <span className="product-details-list-left">商品名称:</span>
              <span>{name}</span>
            </div>
          </Item>
          <Item>
            <div>
              <span className="product-details-list-left">商品描述:</span>
              <span>{desc}</span>
            </div>
          </Item>
          <Item>
            <div>
              <span className="product-details-list-left">商品价格:</span>
              <span>{price}元</span>
            </div>
          </Item>
          <Item>
            <div>
              <span className="product-details-list-left">所属分类:</span>
              <span>
                {firstName}---->{secondName}
              </span>
            </div>
          </Item>
          <Item>
            <div>
              <span className="product-details-list-left">商品图片:</span>
              <span>
                {imgs.map(img => {
                  return (
                    <img
                      className="product-img"
                      key={img}
                      src={"http://120.55.193.14:5000/upload/" + img}
                      alt=""
                    />
                  );
                })}
                <img src="" alt="" />
                <img src="" alt="" />
              </span>
            </div>
          </Item>
          <Item>
            <div>
              <span className="product-details-list-left">商品详情:</span>
              <span
                style={{ display: "inline-block" }}
                dangerouslySetInnerHTML={{
                  __html: detail
                }}
              ></span>
            </div>
          </Item>
        </List>
      </Card>
    );
  }
}

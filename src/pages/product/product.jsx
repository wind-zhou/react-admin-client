import React, { Component } from "react";

import { Route, Switch, Redirect } from "react-router-dom";
import ProductAdd from "./productAdd";
import ProductHome from "./productHome";
import ProductDetails from "./productDetails";

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route path="/product" component={ProductHome} exact></Route>
        <Route path="/product/add" component={ProductAdd}></Route>
        <Route path="/product/details" component={ProductDetails}></Route>
        <Redirect to="/product" />
      </Switch>
    );
  }
}

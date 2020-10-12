import React from "react";
import { Route, Link, Switch } from "react-router-dom";

import Home from "@/pages/Home";
import Hook from '@/pages/Hook';
// import Count from "../pages/Count.jsx";
const PrimaryLayout = () => (
  <div className="primary-layout">
    <header>
      <Link to="/">toHome</Link>&emsp;|&emsp;
      <Link to="/hook">toHook</Link>
    </header>
    <main>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/hook" exact component={Hook} />
      </Switch>
    </main>
  </div>
);

export default PrimaryLayout;
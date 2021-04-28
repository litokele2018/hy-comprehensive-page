import React, { useState } from "react";
import Home from "./pages/home/Home";
import Anime from "./pages/anime/Anime";
import Download from "./pages/download/Download";

import "../src/assets/global.scss";
import styles from "./App.scss";
import store from "./store/index";
import { Provider } from "react-redux";
import { Layout, Menu } from "antd";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Vip from "./pages/vip/Vip";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function App() {
  const [collapse, setCollapse] = useState(true);
  let history = useHistory();

  const handleCollapse = (c: boolean) => {
    setCollapse(c);
  };
  const handleMenuChange = ({ key }) => {
    history.push(key);
  };

  return (
    <Provider store={store}>
      <Layout className={styles["hy-layout"]}>
        <Sider collapsible collapsed={collapse} onCollapse={handleCollapse}>
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            onClick={handleMenuChange}
          >
            <Menu.Item key="/home" icon={<PieChartOutlined />}>
              首页
            </Menu.Item>
            <Menu.Item key="/anime" icon={<DesktopOutlined />}>
              动画
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="Vip解析">
              <Menu.Item key="vip">输入网址</Menu.Item>
              <Menu.Item key="4">api</Menu.Item>
              <Menu.Item key="5">etc</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="NICO下载">
              <Menu.Item key="/nicodownload">noco download</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              Files
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Content className={styles["hy-layout-content"]}>
            <Header>
              <div className={styles["hy-logo"]}>
                <img src={require("./assets/imgs/Avatar.png")} alt="" />
              </div>
              <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
                <Menu.Item key="1">nav 1</Menu.Item>
                <Menu.Item key="2">nav 2</Menu.Item>
                <Menu.Item key="3">nav 3</Menu.Item>
              </Menu>
            </Header>
            <Switch>
              <Route path="/home">
                <Home />
              </Route>
              <Route path="/anime">
                <Anime />
              </Route>
              <Route path="/vip">
                <Vip />
              </Route>
              <Route path="/nicodownload">
                <Download />
              </Route>
              <Redirect exact path="/" to="/home" />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Provider>
  );
}

import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Layout, Button, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AppRoutes from './components/AppRoutes';
import SiderMenu from './components/SiderMenu';
import Clock from './components/Clock'; // Assuming Clock is a desired component
import './styles/main.scss';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <SiderMenu collapsed={collapsed} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Clock />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <AppRoutes />
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;

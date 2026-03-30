import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Typography, Flex } from 'antd';
import { MENU_ITEMS } from '../constants/menuItems';
import logoImage from '../assets/logo.png';

const { Title } = Typography;

const SiderMenu = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = MENU_ITEMS.map(item => ({
    key: item.path,
    icon: item.icon,
    label: item.label,
  }));

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <>
      <Flex align="center" justify="center" style={{ height: '64px', backgroundColor: '#002140' }}>
        <img src={logoImage} alt="Logo" style={{ height: '32px', transition: 'all 0.3s' }} />
        <Title
          level={4}
          style={{
            color: 'white',
            margin: 0,
            marginLeft: '12px',
            whiteSpace: 'nowrap',
            opacity: collapsed ? 0 : 1,
            width: collapsed ? 0 : 'auto',
            transition: 'opacity 0.2s ease-in-out, width 0.2s ease-in-out',
            overflow: 'hidden',
          }}
        >
          Parking POS
        </Title>
      </Flex>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['/']}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ backgroundColor: '#001529' }}
      />
    </>
  );
};

export default SiderMenu;

import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, CarOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/charts';

// --- Mock Data ---
const weeklyRevenueData = [
  { day: 'Senin', revenue: 7500000 },
  { day: 'Selasa', revenue: 8200000 },
  { day: 'Rabu', revenue: 9100000 },
  { day: 'Kamis', revenue: 8800000 },
  { day: 'Jumat', revenue: 10500000 },
  { day: 'Sabtu', revenue: 12300000 },
  { day: 'Minggu', revenue: 11800000 },
];

const recentActivityData = [
  { key: '1', plate: 'B 1234 ABC', time: '10:15:23', status: 'check-in' },
  { key: '2', plate: 'D 5678 XYZ', time: '10:14:55', status: 'check-in' },
  { key: '3', plate: 'F 9012 GHI', time: '10:12:11', status: 'check-out' },
  { key: '4', plate: 'B 3456 JKL', time: '10:11:02', status: 'check-in' },
  { key: '5', plate: 'A 7890 MNO', time: '10:09:48', status: 'check-out' },
];

const activityTableColumns = [
  { title: 'Plat Nomor', dataIndex: 'plate', key: 'plate' },
  { title: 'Waktu', dataIndex: 'time', key: 'time' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => (
      <Tag color={status === 'check-in' ? 'green' : 'volcano'} key={status}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
];
// --- End Mock Data ---


const Dashboard = () => {
  const chartConfig = {
    data: weeklyRevenueData,
    xField: 'day',
    yField: 'revenue',
    label: {
      position: 'middle',
      style: { fill: '#FFFFFF', opacity: 0.6 },
    },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: {
      day: { alias: 'Hari' },
      revenue: { alias: 'Pendapatan', formatter: (v) => `Rp ${(v / 1000000).toFixed(1)} Jt` },
    },
  };

  return (
    <div style={{flex: 1}}>
      {/* Top Statistic Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Kendaraan Masuk (Hari Ini)"
              value={112}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Kendaraan Keluar (Hari Ini)"
              value={93}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Pendapatan (Hari Ini)"
              value={8550000}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarCircleOutlined />}
              suffix="IDR"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic
              title="Kapasitas Terisi"
              value={19}
              valueStyle={{ color: '#d48806' }}
              prefix={<CarOutlined />}
              suffix="/ 200"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Area */}
      <Row gutter={[16, 16]} style={{ marginTop: '32px' }}>
        {/* Weekly Revenue Chart */}
        <Col xs={24} lg={16}>
          <Card title="Grafik Pendapatan Mingguan">
            <Column {...chartConfig} height={300} />
          </Card>
        </Col>

        {/* Recent Activity Table */}
        <Col xs={24} lg={8}>
          <Card title="Aktivitas Terkini">
            <Table
              columns={activityTableColumns}
              dataSource={recentActivityData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

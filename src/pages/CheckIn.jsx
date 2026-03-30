import React, { useEffect, useMemo } from 'react';
import { Card, Col, Row, Typography, Input, Select, Button, Space, Divider, Form, Modal, Spin, Flex } from 'antd';
import { FileTextOutlined, ReloadOutlined } from '@ant-design/icons';

import { formatDateIndo } from "../utils/dateFormatter";
import CameraPlaceholder from "../components/CameraPlaceholder";
import { sanitizePlate } from "../utils/sanitize";

import { useHotkeys } from "../hooks/useHotkeys";
import { useCheckIn } from "../hooks/useTicket";
import { useMemberDetail } from "../hooks/useMember";

const { Title, Text } = Typography;

function useDebounced(value, delay = 400) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

const DetailItem = ({ title, value, loading = false }) => (
  <Flex justify="space-between" style={{ width: "100%" }}>
    <Text strong>{title}</Text>
    {loading ? <Spin size="small" /> : <Text type="secondary">{value}</Text>}
  </Flex>
);

const CheckIn = () => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();

  const rawPlate = Form.useWatch("plateNumber", form) || "";
  const normalizedPlate = useMemo(() => sanitizePlate(rawPlate), [rawPlate]);
  const debouncedPlate = useDebounced(normalizedPlate, 500);

  const memberQuery = useMemberDetail(debouncedPlate, debouncedPlate.length >= 3);
  const member = memberQuery.data || null;
  const isMember = Boolean(member);

  const checkIn = useCheckIn({
    onSuccess: (data) => {
      if (data?.alreadyInside) {
        modal.error({
          title: "ERROR",
          content: `Kendaraan dengan plat ${data.plateNumber} sudah berada di area.`,
          maskClosable: true,
        });
        return;
      }
      modal.success({
        title: "SUCCESS",
        content: `Check-in berhasil untuk ${data.plateNumber}`,
      });
      form.resetFields();
    },
    onError: (err) => {
      modal.error({ title: "ERROR", content: err?.message || "Check-in gagal" });
    },
  });

  const handleReset = () => {
    form.resetFields();
  };
  
  const handleCheckIn = () => {
    if (normalizedPlate.length >= 3 && !checkIn.isPending) {
      form.submit();
      checkIn.mutate({ plateNumber: normalizedPlate, vehicleType: form.getFieldValue('vehicleType') });
    }
  }

  const handleToggleVehicle = () => {
    const currentType = form.getFieldValue('vehicleType');
    form.setFieldsValue({ vehicleType: currentType === 'm' ? 't' : 'm' });
  };
  
  useHotkeys([
    ['F5', handleReset],
    ['F8', handleToggleVehicle],
    ['F10', handleCheckIn],
  ], [normalizedPlate, checkIn.isPending]);

  return (
    <>
      {contextHolder}
      <Title level={2} style={{ marginBottom: '24px' }}>Check In Kendaraan</Title>
      <Form form={form} layout='vertical' initialValues={{ vehicleType: "m" }} onFinish={handleCheckIn}>
        <Row gutter={24}>
          {/* Sisi Kiri: Input Kendaraan */}
          <Col xs={24} md={12}>
            <Card title="Input Kendaraan">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <CameraPlaceholder label="ENTRY CAMERA" height={250} />
                <Form.Item
                  name="plateNumber"
                  label="Plat Nomor"
                  rules={[{ required: true, message: "Plat wajib diisi" }]}
                  getValueFromEvent={(e) => sanitizePlate(e.target.value)}
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="misal: B1234XYZ" allowClear size="large" autoFocus/>
                </Form.Item>
                <Form.Item
                  name="vehicleType"
                  label="Jenis Kendaraan (F8)"
                  rules={[{ required: true, message: "Jenis kendaraan wajib dipilih" }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    size="large"
                    options={[
                      { value: 'm', label: '(M) MOBIL' },
                      { value: 't', label: '(T) MOTOR' },
                    ]}
                  />
                </Form.Item>
              </Space>
            </Card>
          </Col>

          {/* Sisi Kanan: Informasi & Aksi */}
          <Col xs={24} md={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="Informasi Parkir">
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <DetailItem title="Jenis Parkir" value={isMember ? "Member" : "Reguler"} loading={memberQuery.isFetching} />
                  <Divider style={{ margin: '8px 0' }} />
                  <DetailItem title="Nama Member" value={member?.name ?? "-"} loading={memberQuery.isFetching} />
                  <Divider style={{ margin: '8px 0' }} />
                  <DetailItem title="Member Expired" value={formatDateIndo(member?.memberExpiredDate) ?? "-"} loading={memberQuery.isFetching} />
                </Space>
              </Card>

              <Card title="Aksi">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    block
                    disabled={normalizedPlate.length < 3 || checkIn.isPending}
                    loading={checkIn.isPending}
                    onClick={handleCheckIn}
                    style={{ height: 50 }}
                    size="large"
                  >
                    <FileTextOutlined /> {checkIn.isPending ? "Memproses..." : "Check-In (F10)"}
                  </Button>
                  <Button
                    block
                    onClick={handleReset}
                    icon={<ReloadOutlined />}
                  >
                    Atur Ulang (F5)
                  </Button>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default CheckIn;
import React, { useEffect, useMemo, useRef } from 'react';
import { Card, Col, Row, Typography, Input, Select, Button, Space, Divider, Form, Modal, Spin, Descriptions, Statistic } from 'antd';
import { ReloadOutlined, DollarCircleOutlined } from '@ant-design/icons';

import { formatDateIndo } from "../utils/dateFormatter";
import { formatDuration } from "../utils/durationFormatter";
import CameraPlaceholder from "../components/CameraPlaceholder";
import { sanitizePlate } from "../utils/sanitize";

import { useHotkeys } from "../hooks/useHotkeys";
import { useMemberDetail } from "../hooks/useMember";
import { usePreviewCheckOut, useCheckOut } from "../hooks/useTicket";

const { Title, Text } = Typography;

function useDebounced(value, delay = 400) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

const CheckOut = () => {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const voucherInputRef = useRef(null);

  const rawPlate = Form.useWatch("plateNumber", form) || "";
  const normalizedPlate = useMemo(() => sanitizePlate(rawPlate), [rawPlate]);
  const debouncedPlate = useDebounced(normalizedPlate, 500);

  const rawVoucher = Form.useWatch("voucherId", form) || "";
  const normalizedVoucher = useMemo(() => sanitizePlate(rawVoucher), [rawVoucher]);
  const debouncedVoucher = useDebounced(normalizedVoucher, 500);

  const memberQuery = useMemberDetail(debouncedPlate, debouncedPlate.length >= 3);
  const member = memberQuery.data || null;
  const isMember = Boolean(member);

  const previewCheckOutQuery = usePreviewCheckOut(debouncedPlate, debouncedVoucher);
  const previewCheckOut = previewCheckOutQuery.data;

  useEffect(() => {
    form.setFieldsValue({ ticketId: previewCheckOut?.id || null });
  }, [previewCheckOut, form]);

  const checkOut = useCheckOut({
    onSuccess: (data) => {
      modal.success({
        title: "SUCCESS",
        content: `Check-out berhasil untuk ${data.plateNumber}`,
      });
      form.resetFields();
    },
    onError: (err) => {
      modal.error({ title: "ERROR", content: err?.message || "Check-out gagal" });
    },
  });

  const handlePay = () => {
    if (previewCheckOut?.id && !checkOut.isPending) {
      checkOut.mutate({ plateNumber: debouncedPlate, voucherId: debouncedVoucher || null });
    }
  };

  const handleReset = () => {
    form.resetFields();
  };
  
  useHotkeys([
    ['F5', handleReset],
    ['F10', () => voucherInputRef.current?.focus()],
    ['F12', handlePay],
  ], [previewCheckOut, checkOut.isPending, debouncedPlate, debouncedVoucher]);


  const descriptionItems = [
    { key: '1', label: 'Jenis Parkir', children: isMember ? "Member" : "Reguler" },
    { key: '2', label: 'Nama Member', children: member?.name ?? "-" },
    { key: '3', label: 'Member Expired', children: formatDateIndo(member?.memberExpiredDate) ?? "-" },
    { key: '4', label: 'Waktu Masuk', children: previewCheckOut ? formatDateIndo(previewCheckOut.checkInAt) : "-" },
    { key: '5', label: 'Waktu Keluar', children: previewCheckOut ? formatDateIndo(new Date()) : "-" },
    { key: '6', label: 'Durasi', children: previewCheckOut ? formatDuration(previewCheckOut.durationMinutes) : "-" },
  ];

  return (
    <>
      {contextHolder}
      <Title level={2} style={{ marginBottom: '24px' }}>Check Out Kendaraan</Title>
      <Form form={form} layout="vertical">
        <Row gutter={[24, 24]}>
          {/* Kolom Kiri */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="Visual Kendaraan">
                <Row gutter={[16, 16]}>
                  <Col span={12}><CameraPlaceholder label="ENTRY CAMERA" /></Col>
                  <Col span={12}><CameraPlaceholder label="EXIT CAMERA" /></Col>
                  <Col span={12}><CameraPlaceholder label="FACE ENTRY CAMERA" /></Col>
                  <Col span={12}><CameraPlaceholder label="FACE EXIT CAMERA" /></Col>
                </Row>
              </Card>
              <Card title="Formulir Checkout">
                <Form.Item name="plateNumber" label="Plat Nomor" rules={[{ required: true }]} getValueFromEvent={(e) => sanitizePlate(e.target.value)}>
                  <Input placeholder="B1234XYZ" size="large" autoFocus />
                </Form.Item>
                <Form.Item name="ticketId" label="Nomor Parking Slip (F6)">
                  <Input readOnly size="large" />
                </Form.Item>
                <Form.Item name="voucherId" label="Kode Voucher (F10)" getValueFromEvent={(e) => sanitizePlate(e.target.value)}>
                  <Input ref={voucherInputRef} placeholder="Masukkan kode voucher" size="large" />
                </Form.Item>
              </Card>
            </Space>
          </Col>

          {/* Kolom Kanan */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="Detail Informasi" loading={previewCheckOutQuery.isLoading || memberQuery.isFetching}>
                <Descriptions items={descriptionItems} column={1} bordered size="small" />
              </Card>

              <Card title="Kalkulasi Biaya">
                <Statistic
                  title="Total Pembayaran"
                  value={previewCheckOut?.totalPrice ?? 0}
                  precision={0}
                  valueStyle={{ color: '#cf1322', fontSize: '2.5rem' }}
                  prefix="Rp"
                  loading={previewCheckOutQuery.isLoading}
                />
                <Divider />
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="Tarif Parkir">{`Rp ${Number(previewCheckOut?.basePrice ?? 0).toLocaleString("id-ID")}`}</Descriptions.Item>
                    <Descriptions.Item label="Diskon">{`Rp ${Number(previewCheckOut?.discount ?? 0).toLocaleString("id-ID")}`}</Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="Aksi">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    danger
                    block
                    size="large"
                    style={{ height: 'auto', padding: '10px 0' }}
                    disabled={!previewCheckOut?.id || checkOut.isPending}
                    loading={checkOut.isPending}
                    onClick={handlePay}
                  >
                    <span style={{ fontSize: '1.2rem' }}>Bayar & Buka Portal (F12)</span>
                  </Button>
                  <Button block icon={<ReloadOutlined />} onClick={handleReset}>
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

export default CheckOut;
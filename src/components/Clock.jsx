import { useEffect, useState } from "react";
import { Space, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

function useCurrentTime(interval = 1000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);

  return now;
}

export default function Clock() {
  const now = useCurrentTime();

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  return (
    <Tag color="geekblue" style={{ marginRight: '16px', padding: '8px 12px', fontSize: '14px' }}>
      <Space>
        <ClockCircleOutlined />
        {formattedDate}
      </Space>
    </Tag>
  );
}

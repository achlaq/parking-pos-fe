import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.scss';
import 'antd/dist/reset.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from 'antd';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

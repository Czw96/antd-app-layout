import { DatabaseOutlined, DesktopOutlined, HomeOutlined, MailOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Dropdown, Flex, Input, Space, Statistic, Table, Tag, Typography } from "antd";
import type { MenuProps } from "antd";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BaseLayout } from "../src/index";

const menuItems: MenuProps["items"] = [
  { key: "/home", label: "首页", icon: <HomeOutlined /> },
  {
    key: "/data",
    label: "基础数据",
    icon: <DatabaseOutlined />,
    children: [
      { key: "/customer_list", label: "客户管理" },
      { key: "/supplier_list", label: "供应商管理" },
      { key: "/product_list", label: "产品管理" },
    ],
  },
  {
    key: "/system",
    label: "系统设置",
    icon: <DesktopOutlined />,
    children: [
      { key: "/role_list", label: "角色权限" },
      { key: "/user_list", label: "用户管理" },
      { key: "/operation_log", label: "操作日志" },
    ],
  },
];

const labelMap: Record<string, string> = {
  "/home": "仪表盘",
  "/customer_list": "客户管理",
  "/supplier_list": "供应商管理",
  "/product_list": "产品管理",
  "/role_list": "角色权限",
  "/user_list": "用户管理",
  "/operation_log": "操作日志",
};

const sampleData = Array.from({ length: 20 }, (_, i) => ({
  key: i + 1,
  serial: `ORD-${String(i + 1).padStart(4, "0")}`,
  name: `项目 ${i + 1}`,
  person: ["张三", "李四", "王五", "赵六"][i % 4],
  amount: (Math.random() * 50000 + 1000).toFixed(2),
  status: ["进行中", "已完成", "待审核", "已关闭"][i % 4],
  date: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
}));

const statusColor: Record<string, string> = {
  "进行中": "blue",
  "已完成": "green",
  "待审核": "orange",
  "已关闭": "default",
};

function HomePage(): React.ReactElement {
  return (
    <Flex vertical gap={16} style={{ padding: 24 }}>
      <Typography.Title level={4} style={{ margin: 0 }}>仪表盘</Typography.Title>
      <Flex gap={16} wrap>
        <Card style={{ flex: "1 1 200px" }}>
          <Statistic title="客户总数" value={128} suffix="家" />
        </Card>
        <Card style={{ flex: "1 1 200px" }}>
          <Statistic title="本月订单" value={86} suffix="笔" />
        </Card>
        <Card style={{ flex: "1 1 200px" }}>
          <Statistic title="营业额" value={28.6} precision={1} suffix="万" />
        </Card>
      </Flex>
      <Flex gap={16}>
        <Card title="待办事项" style={{ flex: 1 }}>
          <Flex vertical gap={12}>
            {["采购订单待审核 (3)", "销售出库待处理 (2)", "库存不足预警 (5)"].map((item) => (
              <Flex key={item} align="center" justify="space-between">
                <Typography.Text>{item}</Typography.Text>
                <Tag color="blue">去处理</Tag>
              </Flex>
            ))}
          </Flex>
        </Card>
        <Card title="最近动态" style={{ flex: 1 }}>
          <Flex vertical gap={12}>
            {["张三 提交了采购订单", "李四 完成了出库操作", "系统 自动备份成功"].map((item) => (
              <Typography.Text key={item} type="secondary" style={{ fontSize: 13 }}>
                {item}
              </Typography.Text>
            ))}
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
}

function ListPage({ pageKey }: { pageKey: string }): React.ReactElement {
  return (
    <Flex vertical gap={16} style={{ padding: 24 }}>
      <Flex align="center" justify="space-between">
        <Typography.Title level={4} style={{ margin: 0 }}>{labelMap[pageKey] || pageKey}</Typography.Title>
        <Space>
          <Input placeholder="搜索..." prefix={<SearchOutlined />} allowClear style={{ width: 200 }} />
          <Button type="primary">新增</Button>
        </Space>
      </Flex>
      <Card styles={{ body: { padding: 0 } }}>
        <Table
          size="middle"
          columns={[
            { title: "单号", dataIndex: "serial", width: 120 },
            { title: "名称", dataIndex: "name", width: 150 },
            { title: "负责人", dataIndex: "person", width: 100 },
            { title: "金额", dataIndex: "amount", width: 120, align: "right", render: (v: string) => `¥${Number(v).toLocaleString()}` },
            { title: "状态", dataIndex: "status", width: 100, render: (v: string) => <Tag color={statusColor[v]}>{v}</Tag> },
            { title: "日期", dataIndex: "date", width: 120 },
          ]}
          dataSource={sampleData}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      </Card>
    </Flex>
  );
}

function PageContent({ pageKey }: { pageKey: string }): React.ReactElement {
  if (pageKey === "/home") return <HomePage />;
  if (pageKey in labelMap) return <ListPage pageKey={pageKey} />;
  return (
    <Flex style={{ padding: 24 }}>
      <Typography.Text type="secondary">页面未找到</Typography.Text>
    </Flex>
  );
}

function Preview() {
  const [activeKey, setActiveKey] = useState("/home");

  return (
    <StrictMode>
      <BaseLayout
        menuItems={menuItems}
        menuActiveKey={activeKey}
        onMenuClick={({ key }) => setActiveKey(key)}
        headerExtra={
          <Flex align="center" gap={0}>
            <Button type="text" size="large" icon={<MailOutlined style={{ fontSize: 18 }} />} />
            <Divider type="vertical" style={{ height: 36 }} />
            <Dropdown
              menu={{
                items: [
                  { key: "profile", label: `当前页面: ${labelMap[activeKey] || activeKey}`, disabled: true },
                  { type: "divider" },
                  { key: "logout", label: "退出登录", icon: <UserOutlined /> },
                ],
              }}
            >
              <Button type="text" size="large" icon={<UserOutlined style={{ fontSize: 18 }} />}>
                Admin
              </Button>
            </Dropdown>
          </Flex>
        }
        siderFooter={
          <Flex vertical style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <Flex align="center" gap={8} style={{ padding: "12px 16px" }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.65)",
                  flexShrink: 0,
                }}
              >
                A
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: "18px" }}>Admin</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, lineHeight: "16px" }}>admin@example.com</div>
              </div>
            </Flex>
          </Flex>
        }
        pageContent={
          <Flex vertical style={{ height: "100%" }}>
            <PageContent pageKey={activeKey} />
          </Flex>
        }
      />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")!).render(<Preview />);

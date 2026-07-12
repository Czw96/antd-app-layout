import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import type React from "react";
import { useEffect, useState } from "react";

import type { BaseLayoutProps } from "./types";

const { Sider, Header, Content } = Layout;

const siderWidth = 200;

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  background: "#fff",
  height: 64,
  lineHeight: "64px",
};

const contentStyle: React.CSSProperties = {
  margin: 8,
  overflow: "auto",
};

const defaultPlaceholderStyle: React.CSSProperties = {
  height: 40,
  margin: "12px 16px",
  background: "#fff5",
};

const toggleBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 40,
  height: 40,
  fontSize: 16,
  color: "#595959",
  cursor: "pointer",
  borderRadius: 6,
  border: "none",
  background: "transparent",
};

function computeParentKeys(items: MenuProps["items"], activeKey: string): string[] {
  if (!items || !activeKey) return [];
  const result: string[] = [];
  for (const item of items) {
    if (item && "children" in item && Array.isArray(item.children)) {
      const hasMatch = (item.children as { key?: string }[]).some((child) => child.key === activeKey);
      if (hasMatch) {
        result.push(item.key as string);
      }
    }
  }
  return result;
}

function BaseLayout(props: BaseLayoutProps): React.ReactElement {
  const { menuItems, menuActiveKey, onMenuClick, headerExtra, siderHeader, siderFooter, pageContent } = props;

  const [collapsed, setCollapsed] = useState(false);

  // 菜单展开状态
  const [openKeys, setOpenKeys] = useState<string[]>(() => computeParentKeys(menuItems, menuActiveKey ?? ""));

  // 路由变化时展开对应父级菜单
  useEffect(() => {
    const parentKeys = computeParentKeys(menuItems, menuActiveKey ?? "");
    setOpenKeys((prev) => {
      const merged = [...prev];
      for (const key of parentKeys) {
        if (!merged.includes(key)) merged.push(key);
      }
      return merged;
    });
  }, [menuActiveKey, menuItems]);

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        trigger={null}
        theme="dark"
        width={collapsed ? 0 : siderWidth}
        style={{
          overflow: "hidden",
          transition: "all 0.2s",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: siderWidth,
            minWidth: siderWidth,
            maxWidth: siderWidth,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            {siderHeader !== undefined ? siderHeader : <div style={defaultPlaceholderStyle} />}
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            <Menu
              theme="dark"
              mode="inline"
              items={menuItems}
              selectedKeys={menuActiveKey ? [menuActiveKey] : undefined}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              onClick={onMenuClick}
            />
          </div>
          {siderFooter !== undefined && <div style={{ flexShrink: 0 }}>{siderFooter}</div>}
        </div>
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <button
            style={toggleBtnStyle}
            onClick={() => setCollapsed((prev) => !prev)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#f5f5f5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div>{headerExtra}</div>
        </Header>
        <Content style={contentStyle}>{pageContent}</Content>
      </Layout>
    </Layout>
  );
}

export default BaseLayout;

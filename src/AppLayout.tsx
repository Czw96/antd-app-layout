import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Layout, Menu } from "antd";
import type React from "react";
import { useEffect, useState } from "react";

import type { AppLayoutProps } from "./types";

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

/**
 * 根据当前菜单项 key 查找其所有父级菜单组的 key。
 * 遍历 Menu items 顶层节点，检查每个节点的 children 是否包含 activeKey。
 * "children" in item 和 "key" in item 双重判断是为了排除 ItemGroupType
 *（有 children 但无 key），只处理 SubMenuType。
 */
function computeParentKeys(items: MenuProps["items"], activeKey: string): string[] {
  if (!items || !activeKey) return [];
  const result: string[] = [];
  for (const item of items) {
    if (item && "children" in item && "key" in item && Array.isArray(item.children)) {
      const hasMatch = (item.children as Array<{ key?: string }>).some((child) => child.key === activeKey);
      if (hasMatch) {
        result.push(item.key as string);
      }
    }
  }
  return result;
}

function AppLayout(properties: AppLayoutProps): React.ReactElement {
  const { menuItems, menuActiveKey, onMenuClick, headerExtra, siderHeader, siderFooter, pageContent } = properties;
  const [collapsed, setCollapsed] = useState(false);

  // 菜单展开状态，初始根据当前路由展开对应父级菜单
  const [openKeys, setOpenKeys] = useState<string[]>(() => computeParentKeys(menuItems, menuActiveKey ?? ""));

  // 路由变化时展开对应父级菜单，但保留用户手动展开/折叠的状态
  useEffect(() => {
    const parentKeys = computeParentKeys(menuItems, menuActiveKey ?? "");
    setOpenKeys((previous) => {
      const merged = [...previous];
      for (const key of parentKeys) {
        if (!merged.includes(key)) merged.push(key);
      }
      return merged;
    });
  }, [menuActiveKey, menuItems]);

  return (
    <Layout style={{ height: "100vh" }}>
      {/*
        不使用 Sider 的 collapsible + collapsed 机制（会触发 Menu 切换模式导致弹窗和状态丢失），
        直接用 width 在 0 ↔ siderWidth 之间切换，搭配 transition 实现折叠/展开动画。
      */}
      <Layout.Sider
        trigger={null}
        theme="dark"
        width={collapsed ? 0 : siderWidth}
        style={{
          overflow: "hidden",
          transition: "all 0.2s",
        }}
      >
        {/*
          内层容器设固定 minWidth/maxWidth 为 siderWidth，使菜单布局始终以 200px 排版。
          Sider 宽度为 0 时内容被 overflow: hidden 裁切，宽度过渡展开时自然露出，避免重影。
        */}
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
      </Layout.Sider>
      <Layout>
        <Layout.Header style={headerStyle}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            size="large"
            onClick={() => setCollapsed((previous) => !previous)}
          />
          <div>{headerExtra}</div>
        </Layout.Header>
        <Layout.Content style={contentStyle}>{pageContent}</Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;

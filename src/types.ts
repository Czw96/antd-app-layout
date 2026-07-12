import type { MenuProps } from "antd";
import type React from "react";

export interface BaseLayoutProps {
  /** 菜单配置 */
  menuItems: MenuProps["items"];
  /** 当前选中的菜单项 key */
  menuActiveKey?: string;
  /** 菜单点击回调 */
  onMenuClick?: MenuProps["onClick"];

  /** 侧边栏顶部内容，未传时显示默认占位 */
  siderHeader?: React.ReactNode;
  /** 侧边栏底部内容 */
  siderFooter?: React.ReactNode;
  /** 顶栏右侧功能插槽 */
  headerExtra?: React.ReactNode;
  /** 页面内容区域 */
  pageContent?: React.ReactNode;
}

<p align="center">
  <h1 align="center">antd-app-layout</h1>
  <p align="center">An app layout component for Ant Design with a collapsible sidebar, configurable menu, and header slot.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/antd-app-layout"><img src="https://img.shields.io/npm/v/antd-app-layout" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/antd-app-layout"><img src="https://img.shields.io/npm/dm/antd-app-layout" alt="npm downloads" /></a>
  <a href="https://github.com/Czw96/antd-app-layout/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/antd-app-layout" alt="license" /></a>
  <a href="https://github.com/Czw96/antd-app-layout"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" /></a>
</p>

[中文](./README.md) | English

---

## Installation

```bash
npm install antd-app-layout
```

## Demo

Start the local preview:

```bash
npm run preview
```

## Peer Dependencies

| Dependency | Version |
|------------|---------|
| react | >=18.2.0 |
| react-dom | >=18.2.0 |
| antd | >=6.0.0 |

## Usage

```tsx
import { AppLayout } from "antd-app-layout";
import type { MenuProps } from "antd";
import {
  DatabaseOutlined,
  DesktopOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const menuItems: MenuProps["items"] = [
  { key: "/home", label: "Home", icon: <HomeOutlined /> },
  {
    key: "/data",
    label: "Data",
    icon: <DatabaseOutlined />,
    children: [
      { key: "/customer_list", label: "Customers" },
      { key: "/product_list", label: "Products" },
    ],
  },
  {
    key: "/system",
    label: "System",
    icon: <DesktopOutlined />,
    children: [
      { key: "/role_list", label: "Roles" },
      { key: "/user_list", label: "Users" },
    ],
  },
];

function Dashboard() {
  const [activeKey, setActiveKey] = useState("/home");

  return (
    <AppLayout
      menuItems={menuItems}
      menuActiveKey={activeKey}
      onMenuClick={({ key }) => setActiveKey(key)}
      headerExtra={
        <Button type="text" icon={<UserOutlined />}>Admin</Button>
      }
      siderHeader={
        <Flex align="center" gap={8} style={{ height: 64, padding: "0 16px" }}>
          <AppstoreOutlined style={{ color: "#fff", fontSize: 24 }} />
          <span style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>MyApp</span>
        </Flex>
      }
      pageContent={<div style={{ padding: 24 }}>Page content</div>}
    />
  );
}
```

### With react-router-dom

```tsx
import { AppLayout } from "antd-app-layout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function AppLayoutWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppLayout
      menuItems={menuItems}
      menuActiveKey={location.pathname}
      onMenuClick={({ key }) => navigate(key)}
      pageContent={<Outlet />}
    />
  );
}
```

### Sidebar Footer

```tsx
<AppLayout
  menuItems={menuItems}
  siderFooter={
    <Flex align="center" gap={8} style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <Avatar size={28} style={{ background: "rgba(255,255,255,0.15)" }}>U</Avatar>
      <div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>Username</div>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>user@example.com</div>
      </div>
    </Flex>
  }
  // ...
/>
```

## API

### AppLayoutProps

| Property | Type | Description |
|----------|------|-------------|
| `menuItems` | `MenuProps["items"]` | Menu configuration, passed directly to Ant Design Menu's `items` format |
| `menuActiveKey` | `string` | The currently active menu item key, typically the current route |
| `onMenuClick` | `MenuProps["onClick"]` | Menu click callback |
| `headerExtra` | `ReactNode` | Content rendered on the right side of the header bar |
| `siderHeader` | `ReactNode` | Content at the top of the sidebar. A default placeholder is shown when omitted |
| `siderFooter` | `ReactNode` | Content at the bottom of the sidebar, commonly used for user info or version display |
| `pageContent` | `ReactNode` | Page content area |

### Exports

| Export | Description |
|--------|-------------|
| `AppLayout` | The app layout component |
| `AppLayoutProps` | Component props type |

## Features

- **Collapsible sidebar**: Toggle the sidebar visibility via the header button with smooth CSS transitions
- **Configurable menu**: Pass menu items via the `menuItems` prop, supporting two-level nesting and custom icons
- **Route integration**: `menuActiveKey` drives menu highlight and automatic submenu expansion
- **Header slot**: `headerExtra` accepts any content — notifications, user menus, settings, etc.
- **Sidebar slots**: Both `siderHeader` (top) and `siderFooter` (bottom) slots for branding and user info
- **Dark theme**: Sidebar defaults to Ant Design's dark theme
- **Content scrolling**: `pageContent` scrolls internally when content overflows, keeping the layout intact

## Development

```bash
git clone https://github.com/Czw96/antd-app-layout.git
cd antd-app-layout
npm install

npm run dev         # Watch build
npm run build       # Production build
npm run preview     # Start preview page
npm run lint        # Lint
```

## License

MIT © Czw96

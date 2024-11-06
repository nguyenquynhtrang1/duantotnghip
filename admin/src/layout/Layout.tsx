import {
  DashboardOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  InsertRowBelowOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Button,
  Flex,
  Layout,
  Menu,
  message,
  Space,
  Spin,
  theme,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../apis/user";
import { logout } from "../apis/auth";
import logo from "../assets/logo.jpg";
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <Typography.Text strong>Dashboard</Typography.Text>,
    "/",
    <DashboardOutlined />
  ),
  getItem(
    <Typography.Text strong>Bookings</Typography.Text>,
    "/bookings",
    <DatabaseOutlined />
  ),
  getItem(
    <Typography.Text strong>Rooms</Typography.Text>,
    "/rooms",
    <InsertRowBelowOutlined />
  ),
  getItem(
    <Typography.Text strong>Reviews</Typography.Text>,
    "/reviews",
    <FileTextOutlined />
  ),
  getItem(
    <Typography.Text strong>Room Types</Typography.Text>,
    "/roomtypes",
    <ProfileOutlined />
  ),
  getItem(
    <Typography.Text strong>Users</Typography.Text>,
    "/users",
    <UserOutlined />
  ),
];

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (isError || !data?.data.isAdmin) {
      navigate("/login");
    }
  }, [isError, navigate]);

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.removeQueries({
        queryKey: ["profile"],
      });
      navigate("/login");
    },
    onError: (error: Error) => {
      message.error(error.message);
    },
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        theme="light"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Flex style={{ height: 64 }} align="center" justify="center">
          {collapsed ? (
            <img src={logo} style={{ width: 64, height: 64 }} />
          ) : (
            <Typography.Text
              strong
              italic
              style={{ fontSize: 26, color: "#3d8000f2" }}
            >
              Kayla Homestay
            </Typography.Text>
          )}
        </Flex>
        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      {isLoading ? (
        <Spin fullscreen />
      ) : (
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              textAlign: "end",
            }}
          >
            <Space align="center">
              <Typography.Text strong>
                <UserOutlined style={{ marginRight: 6 }} />
                {data?.data.email}
              </Typography.Text>
              <Button danger type="text" onClick={() => mutate()}>
                Logout
                <LogoutOutlined />
              </Button>
            </Space>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      )}
    </Layout>
  );
};

export default CustomLayout;

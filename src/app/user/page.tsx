"use client";

import { Layout, Menu, Form, Input, Button, Typography } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AccountPage() {
  const [form] = Form.useForm();
  const [currentTab, setCurrentTab] = useState("home");

  const onFinish = (values: any) => {
    console.log("Form values:", values);
  };

  const handleMenuClick = (e: any) => {
    setCurrentTab(e.key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" style={{ borderRight: "1px solid #f0f0f0" }}>
        <Menu
          mode="vertical"
          defaultSelectedKeys={["home"]}
          style={{ height: "100%", borderRight: 0 }}
          onClick={handleMenuClick}
        >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            TRANG CHỦ
          </Menu.Item>
          <Menu.Item key="account" icon={<UserOutlined />}>
            TRANG TÀI KHOẢN
          </Menu.Item>
          <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
            ĐƠN HÀNG
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />}>
            Đăng Xuất
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "24px" }}>
        <Header
          style={{ background: "#fff", padding: "0", marginBottom: "24px" }}
        >
          <div style={{ color: "#666", paddingLeft: "24px" }}>TÀI KHOẢN</div>
        </Header>

        <Content style={{ background: "#fff", padding: "24px" }}>
          {currentTab === "home" && (
            <div>Đây là nội dung cho tab Trang Chủ</div>
          )}
          {currentTab === "account" && (
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                displayName: "thanhdi721",
                email: "thanhdi721@gmail.com",
              }}
            >
              <div
                style={{ display: "flex", gap: "24px", marginBottom: "24px" }}
              >
                <Form.Item
                  name="firstName"
                  label="Tên *"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label="Họ *"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                >
                  <Input />
                </Form.Item>
              </div>

              <Form.Item
                name="displayName"
                label="Tên hiển thị *"
                rules={[
                  { required: true, message: "Vui lòng nhập tên hiển thị" },
                ]}
              >
                <Input />
              </Form.Item>
              <div style={{ color: "#666", marginTop: -20, marginBottom: 24 }}>
                Tên này sẽ hiển thị trong trang Tài khoản và phần Đánh giá sản
                phẩm
              </div>

              <Form.Item
                name="email"
                label="Địa chỉ email *"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ background: "#00853C" }}
                >
                  LƯU THAY ĐỔI
                </Button>
              </Form.Item>
            </Form>
          )}
          {currentTab === "orders" && (
            <div>Đây là nội dung cho tab Đơn Hàng</div>
          )}
          {currentTab === "logout" && <div>Bạn đã đăng xuất</div>}
        </Content>
      </Layout>
    </Layout>
  );
}

"use client";

import { Layout, Menu, Form, Input, Button, Typography, Table } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { data } from "framer-motion/client";

const { Header, Sider, Content } = Layout;

export default function AccountPage() {
  const [form] = Form.useForm();
  const [currentTab, setCurrentTab] = useState("account");
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          try {
            const response = await fetch(
              "https://manager-rkz3.onrender.com/api/auth/me",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const data = await response.json();

            setUserData(data);
            form.setFieldsValue({
              _id: data._id,
              firstName: data.username,
              email: data.email,
              displayName: data.username,
              phone_number: data.phone_number,
            });
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      }
    };

    fetchUserData();
  }, [form]);

  const fetchOrders = async () => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const response = await fetch(
            "https://manager-rkz3.onrender.com/api/orders",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const data = await response.json();
          const filteredOrders = data.filter(
            (order: any) => order.idUser === userData?._id
          );
          setOrders(filteredOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
    }
  };

  useEffect(() => {
    if (currentTab === "orders") {
      fetchOrders();
    }
  }, [currentTab]);

  const onFinish = (values: any) => {
    console.log("Form values:", values);
  };

  const handleMenuClick = (e: any) => {
    setCurrentTab(e.key);
    if (typeof window !== "undefined") {
      if (e.key === "logout") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá tổng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text: any) => <span>{text.toLocaleString()} VND</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  console.log("User data:", userData);
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
            <Link href="/">TRANG CHỦ</Link>
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
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <div
                style={{ display: "flex", gap: "24px", marginBottom: "24px" }}
              >
                <Form.Item
                  name="_id"
                  label="ID*"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: "Vui lòng nhập ID" }]}
                >
                  <Input value={userData?._id} disabled />
                </Form.Item>

                <Form.Item
                  name="firstName"
                  label="Họ và tên *"
                  style={{ flex: 1 }}
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input disabled />
                </Form.Item>
              </div>

              <Form.Item
                name="phone_number"
                label="Số điện thoại *"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="email"
                label="Địa chỉ email *"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input disabled />
              </Form.Item>
            </Form>
          )}
          {currentTab === "orders" && (
            <Table
              dataSource={orders.map((order) => ({
                key: order._id,
                productName: order.products
                  .map((p: any) => p.productName)
                  .join(", "),
                quantity: order.products.reduce(
                  (total: number, p: any) => total + p.quantity,
                  0
                ),
                totalPrice: order.totalPrice,
                status: order.status,
              }))}
              columns={columns}
              pagination={false}
            />
          )}
          {currentTab === "logout" && <div>Bạn đã đăng xuất</div>}
        </Content>
      </Layout>
    </Layout>
  );
}

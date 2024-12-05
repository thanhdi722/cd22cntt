"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Menu } from "antd";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  sold: number;
  category: string;
  image: string;
  createdAt: Date;
}
function Page() {
  const [orders, setOrders] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const ordersApiUrl = "https://manager-rkz3.onrender.com/api/orders";
  const [newProduct, setNewProduct] = useState<{
    _id?: string;
    name: string;
    price: number;
    sold: number;
    image: File[];
  }>({ name: "", price: 0, sold: 0, image: [] });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchName, setSearchName] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>("");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // State for detail modal
  const [orderDetails, setOrderDetails] = useState<any>(null);
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(ordersApiUrl);
      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const handleEdit = async (id: string) => {
    const productApiUrl = `https://manager-rkz3.onrender.com/api/products/${id}`;
    const response = await fetch(productApiUrl);
    if (response.ok) {
      const productToEdit = await response.json();
      setNewProduct({
        _id: productToEdit._id,
        name: productToEdit.name,
        price: productToEdit.price,
        sold: productToEdit.sold,
        image: productToEdit.image ? [productToEdit.image] : [],
      });
      console.log("Editing product:", productToEdit);
    } else {
      console.error("Failed to fetch product for editing");
    }
  };

  const handleDelete = async (id: string) => {
    const productsDeleteApiUrl = `https://manager-rkz3.onrender.com/api/orders/${id}`;
    const response = await fetch(productsDeleteApiUrl, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Delete product with ID:", id);
      setOrders(orders.filter((product) => product._id !== id));
      setNotification(`Sản phẩm với ID ${id} đã được xóa.`);
    } else {
      console.error("Failed to delete product with ID:", id);
      setNotification(`Xóa sản phẩm với ID ${id} thất bại.`);
    }

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleCreateProduct = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price.toString());
    formData.append("sold", newProduct.sold.toString());
    newProduct.image.forEach((file) => {
      formData.append("image", file); // Append each image file
    });

    const response = await fetch(ordersApiUrl, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const createdProduct = await response.json();
      setOrders([...orders, createdProduct]);
      setNotification(`Sản phẩm ${newProduct.name} đã được tạo.`);
      setNewProduct({ name: "", price: 0, sold: 0, image: [] }); // Reset form
    } else {
      console.error("Failed to create product");
      setNotification("Tạo sản phẩm thất bại.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files); // Get the files directly
      setNewProduct({ ...newProduct, image: filesArray }); // Store the files in state
    }
  };

  const handleUpdateProduct = async (id: string) => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price.toString());
    formData.append("sold", newProduct.sold.toString());
    newProduct.image.forEach((file) => {
      formData.append("image", file); // Append each image file
    });

    const response = await fetch(
      `https://manager-rkz3.onrender.com/api/products/${id}`,
      {
        method: "PUT", // Use PUT method for updating
        body: formData,
      }
    );

    if (response.ok) {
      const updatedProduct = await response.json();
      setOrders(
        orders.map((product) => (product._id === id ? updatedProduct : product))
      );
      setNotification(`Sản phẩm ${newProduct.name} đã được cập nhật.`);
      setNewProduct({ name: "", price: 0, sold: 0, image: [] }); // Reset form
    } else {
      console.error("Failed to update product");
      setNotification("Cập nhật sản phẩm thất bại.");
    }
  };

  const handleUpdateOrderStatus = async (id: string) => {
    // New function to update order status
    const response = await fetch(
      `https://manager-rkz3.onrender.com/api/orders/${id}/status`,
      {
        method: "PATCH", // Use PUT method for updating status
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) => (order._id === id ? updatedOrder : order))
      );
      setNotification(`Trạng thái đơn hàng đã được cập nhật.`);
    } else {
      console.error("Failed to update order status");
      setNotification("Cập nhật trạng thái đơn hàng thất bại.");
    }
  };

  const handleOpenEditPopup = (id: string) => {
    setIsModalVisible(true);
  };

  const handleModalOk = async (id: string) => {
    const newStatus = "new status"; // Replace with the actual status you want to set
    await handleUpdateOrderStatus(id); // Call the new function to update order status
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setIsDetailModalVisible(false);
  };

  const handleViewDetails = async (id: string) => {
    // New function to fetch order details
    const orderDetailApiUrl = `https://manager-rkz3.onrender.com/api/orders/${id}`;
    const response = await fetch(orderDetailApiUrl);
    if (response.ok) {
      const orderData = await response.json();
      setOrderDetails(orderData);
      setIsDetailModalVisible(true); // Open the detail modal
    } else {
      console.error("Failed to fetch order details");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesName = order.customerName
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesDate = searchDate
      ? new Date(order.createdAt).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;
    return matchesName && matchesDate;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Menu mode="horizontal" className="mb-4">
        <Menu.Item key="home">
          <Link href="/">Trang Chủ</Link>
        </Menu.Item>
        <Menu.Item key="products">
          <Link href="/admin">Quản Lý Sản Phẩm</Link>
        </Menu.Item>
        <Menu.Item key="orders">
          <Link href="/admin-orders">Quản Lý Đơn Hàng</Link>
        </Menu.Item>
        <Menu.Item key="inventory">
          <Link href="/admin-products">Quản Lý Kho</Link>
        </Menu.Item>
      </Menu>
      <main className="flex-grow container mx-auto px-4 py-8">
        {notification && (
          <div className="bg-green-500 text-white p-2 rounded mb-4 text-right">
            {notification}
          </div>
        )}
        <div className="mb-4">
          <h3 className="text-2xl font-bold mb-4">Tìm kiếm đơn hàng</h3>
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <h3 className="text-2xl font-bold mb-4">Tìm theo ngày đặt</h3>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Tên khách hàng</th>
                <th className="border px-4 py-2">Tổng giá</th>
                <th className="border px-4 py-2">Trạng thái</th>
                <th className="border px-4 py-2">Ngày đặt</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="border px-4 py-2">{order._id}</td>
                  <td className="border px-4 py-2">{order.customerName}</td>
                  <td className="border px-4 py-2">
                    {order.totalPrice.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="border px-4 py-2">
                    {order.status === "pending"
                      ? "Chưa xác nhận"
                      : "Đã xác nhận"}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleViewDetails(order._id)} // Button to view details
                    >
                      Xem chi tiết
                    </button>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleModalOk(order._id)}
                    >
                      Xác nhận đơn hàng
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(order._id)}
                    >
                      Xóa đơn hàng
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          title="Chi tiết đơn hàng"
          visible={isDetailModalVisible}
          onCancel={handleModalCancel}
          footer={null} // No footer buttons
        >
          {orderDetails && (
            <div>
              <p>
                <strong>ID:</strong> {orderDetails._id}
              </p>
              <p>
                <strong>Tên khách hàng:</strong> {orderDetails.customerName}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {orderDetails.customerAddress}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {orderDetails.customerPhone}
              </p>
              <p>
                <strong>Trạng thái:</strong> {orderDetails.status}
              </p>
              <p>
                <strong>Tổng giá:</strong>{" "}
                {orderDetails.totalPrice.toLocaleString("vi-VN")} ₫
              </p>
              <h4>Sản phẩm:</h4>
              <ul>
                {orderDetails.products.map((product: any) => (
                  <li key={product._id}>
                    {product.productName} - Số lượng: {product.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}

export default Page;

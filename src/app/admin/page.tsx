"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber } from "antd";
interface Product {
  _id: string;
  name: string;
  price: number;
  sold: number;
  category: string;
  image: string;
}
function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const createProductApiUrl =
    "https://manager-rkz3.onrender.com/api/products/create";
  const [newProduct, setNewProduct] = useState<{
    _id?: string;
    name: string;
    price: number;
    sold: number;
    image: File[];
  }>({ name: "", price: 0, sold: 0, image: [] });
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    const fetchProducts = async () => {
      const productsApiUrl = "https://manager-rkz3.onrender.com/api/products";
      const response = await fetch(productsApiUrl);
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
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
    const productsDeleteApiUrl = `https://manager-rkz3.onrender.com/api/products/${id}`;
    const response = await fetch(productsDeleteApiUrl, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Delete product with ID:", id);
      setProducts(products.filter((product) => product._id !== id));
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

    const response = await fetch(createProductApiUrl, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const createdProduct = await response.json();
      setProducts([...products, createdProduct]);
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
      setProducts(
        products.map((product) =>
          product._id === id ? updatedProduct : product
        )
      );
      setNotification(`Sản phẩm ${newProduct.name} đã được cập nhật.`);
      setNewProduct({ name: "", price: 0, sold: 0, image: [] }); // Reset form
    } else {
      console.error("Failed to update product");
      setNotification("Cập nhật sản phẩm thất bại.");
    }
  };

  const handleOpenEditPopup = (id: string) => {
    handleEdit(id); // Call the existing handleEdit function
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    await handleUpdateProduct(newProduct._id!);
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Product List</h2>
        {notification && (
          <div className="bg-green-500 text-white p-2 rounded mb-4 text-right">
            {notification}
          </div>
        )}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Create New Product</h3>
          <input
            type="text"
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            required
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
            required
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Sold"
            value={newProduct.sold}
            onChange={(e) =>
              setNewProduct({ ...newProduct, sold: Number(e.target.value) })
            }
            className="border p-2 mb-2 w-full"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="border p-2 mb-2 w-full"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleCreateProduct}
          >
            Create Product
          </button>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full bg-white border border-gray-300 overflow-x-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Tên sản phẩm</th>
                <th className="border px-4 py-2">Giá</th>
                <th className="border px-4 py-2">Số lượng </th>

                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="border px-4 py-2">{product._id}</td>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">
                    {product.price.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="border px-4 py-2">{product.sold}</td>

                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleOpenEditPopup(product._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          title="Edit Product"
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              <Input
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="Price">
              <InputNumber
                value={newProduct.price}
                onChange={(value) =>
                  setNewProduct({ ...newProduct, price: value || 0 })
                }
              />
            </Form.Item>
            <Form.Item label="Sold">
              <InputNumber
                value={newProduct.sold}
                onChange={(value) =>
                  setNewProduct({ ...newProduct, sold: value || 0 })
                }
              />
            </Form.Item>
            <Form.Item label="Image">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="border p-2 mb-2 w-full"
              />
            </Form.Item>
          </Form>
        </Modal>
      </main>
    </div>
  );
}

export default Page;

"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { Modal, notification } from "antd";

import "../../public/assets/images/favicon.png";
import "../../public/assets/css/bootstrap.min.css";
import "../../public/assets/css/animate.min.css";
import "../../public/assets/css/font-awesome.min.css";
import "../../public/assets/css/nice-select.css";
import "../../public/assets/css/slick.min.css";
import "../../public/assets/css/style.css";
import "../../public/assets/css/main-color.css";
import "../app/admin/apple.scss";
import ic1 from "../../public/imagefl1.png";
import ic2 from "../../public/img2.png";
import logo from "../../public/123123.png";
import Image from "next/image";
import Link from "next/link";
import { Spin } from "antd";
const productsApiUrl = "https://manager-rkz3.onrender.com/api/products";
const searchApiUrl = "https://manager-rkz3.onrender.com/api/products/search";
import imgRocket from "../../public/rocket.png";
// Define the Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

const fetchProducts = async (
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  try {
    const response = await fetch(productsApiUrl);
    const data = await response.json();
    const formattedProducts = data.map((product: any) => ({
      id: product._id,
      name: product.name,
      price: product.price,
      category: "clothing",
      image: product.imageUrls[0],
    }));
    setProducts(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

export default function MultiProductCatalog() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [quantity, setQuantity] = useState(1);

  const categories = [
    "Tất cả",
    "iPhone",
    "iPad",
    "MacBook",
    "Laptop",
    "Tai nghe",
  ]; // Define categories

  useEffect(() => {
    const checkToken = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        setAccessToken(token);
        if (!token) {
          window.location.href = "/login";
        }
      }
    };

    checkToken(); // Initial check
    const intervalId = setInterval(checkToken, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm) {
      try {
        const response = await fetch(searchApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name: searchTerm, price: 0 }),
        });
        const data = await response.json();
        const formattedProducts = data.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          category: "clothing",
          image: product.imageUrls[0],
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    } else {
      fetchProducts(setProducts);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const filteredProducts = products.filter(
    (product: Product) =>
      (activeCategory === "Tất cả" ||
        product.name.toLowerCase().includes(activeCategory.toLowerCase())) &&
      (searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      setAccessToken(null);
    }
  };
  useEffect(() => {
    for (let i = 0; i < 400; i++) {
      let star = document.createElement("div");
      star.classList.add("star");

      let size = Math.random() * 2.6 + 1;
      //   -----------------------------------------------------------------------
      star.style.top = Math.random() * document.body.scrollHeight + "px";
      star.style.left = Math.random() * document.body.scrollWidth + "px";
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.opacity = Math.random().toString();

      star.style.animation = "moveit 2.5s infinite";

      let delayValue = Math.random() * 4;
      star.style.animationDelay = delayValue + "s";

      document.body.appendChild(star);
    }
  }, []);

  const showModal = (productId: string) => {
    setSelectedProductId(productId);
    setIsModalVisible(true);
  };
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    // Check if window is defined to ensure this code runs only on the client
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("id_user");
      setUserId(storedUserId || null);
    }
  }, []);
  const handleSubmit = async () => {
    const orderData = {
      products: [
        {
          productId: selectedProductId,
          quantity: quantity,
        },
      ],
      customerName,
      customerAddress,
      customerPhone,
      idUser: userId || "",
    };

    try {
      const response = await fetch(
        "https://manager-rkz3.onrender.com/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );
      const result = await response.json();

      // Kiểm tra nếu có lỗi
      if (!response.ok || result.error) {
        throw new Error(result.error || "Có lỗi xảy ra khi đặt hàng");
      }

      setIsModalVisible(false);
      notification.success({
        message: "Đặt hàng thành công",
        description: "Đơn hàng của bạn đã được tạo thành công.",
      });
    } catch (error: any) {
      notification.error({
        message: "Đặt hàng thất bại",
        description:
          "Có lỗi xảy ra khi tạo đơn hàng hoặc số lương hiện tại không đủ.",
      });
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ overflow: "hidden", backgroundColor: "black" }}
    >
      <div className="category-tabs"></div>
      <div className="flash-sale-banner">
        <img src={ic1.src} alt="" />
      </div>
      <div className="flash-sale-banner2">
        <img src={ic2.src} alt="" />
      </div>
      {/* <div className="rocket">
        <Image className="rocket-fly shake" src={imgRocket} alt="" />
      </div> */}
      <header id="header" className="py-4 text-white shadow-md">
        <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
          <div className="login-header">
            <a
              href="/"
              style={{ display: "block", width: "150px", height: "150px" }}
            >
              <img
                src={logo.src}
                alt="biolife logo"
                className="w-64 h-auto logoheader"
                style={{ borderRadius: "50%" }}
                width={100}
                height={100}
              />
            </a>
          </div>
          <div className="w-search-input flex-grow md:flex-grow-0 mt-4 md:mt-0">
            <div className="relative w-search-input">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="w-search-input px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-black border-radius-5"
                style={{ borderRadius: "5px !important" }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-2 mr-2 p-2"
              >
                <i className="biolife-icon icon-search text-gray-500"></i>
              </button>
            </div>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Đăng Xuất
            </button>
            <Link href="/user">
              <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                Thông tin
              </button>
            </Link>
          </div>
        </div>
      </header>
      <h1 className="text-4xl font-bold mb-8 text-center text-white">
        Danh mục sản phẩm
      </h1>
      <main className="flex-grow mx-auto md:container">
        <div className="justify-center flex gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-md tab-button ${
                activeCategory === category ? "active" : ""
              }`}
              style={{
                backgroundColor: activeCategory === category ? "blue" : "white",
                color: activeCategory === category ? "white" : "black",
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div>
          <div className="product-list-sale container mx-auto">
            <div>
              <div className="upgrade-list">
                <div className="">
                  <div>
                    <div
                      className="women-decor"
                      style={{ paddingBottom: "20px" }}
                    ></div>
                    {filteredProducts && filteredProducts.length > 0 ? (
                      <div className="upgrade">
                        {filteredProducts.map((product: any) => (
                          <div
                            key={product.id}
                            onClick={() => showModal(product.id)}
                          >
                            <div className="upgrade-item">
                              <div className="upgrade-item-header">
                                <span className="percent">Trả góp 0%</span>
                              </div>
                              <div className="upgrade-item-img">
                                <div className="img-content">
                                  <img
                                    src={product?.image}
                                    width={1400}
                                    height={1200}
                                    alt={`product-${product.id}`}
                                  />
                                </div>
                              </div>
                              <div className="upgrade-item-content">
                                <h4 className="upgrade-item-content-tt">
                                  {product?.name}
                                </h4>
                                <div className="upgrade-item-content-body">
                                  <div className="upgrade-item-content-body-price">
                                    {product?.price?.toLocaleString("vi-VN")}{" "}
                                    VNĐ
                                  </div>
                                  <div className="upgrade-item-content-body-reduced">
                                    <div className="price-reduced">
                                      {Number(
                                        product?.price + 1000000
                                      )?.toLocaleString("vi-VN")}
                                      VNĐ
                                    </div>
                                    <div className="percent">
                                      -
                                      {Math.ceil(
                                        100 -
                                          (product?.price /
                                            (product?.price + 1000000)) *
                                            100
                                      )}
                                      %
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "200px",
                          flexDirection: "column",
                        }}
                      >
                        <Spin />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        className="custom-modal"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Đặt hàng</h2>
        <div>
          <label>
            Họ và tên:
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="modal-input"
            />
          </label>
          <label>
            Địa chỉ:
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="modal-input"
            />
          </label>
          <label>
            Số điện thoại:
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="modal-input"
            />
          </label>
          <label>
            Số lượng:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
              className="modal-input"
            />
          </label>
        </div>
      </Modal>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
              <p>
                Cửa hàng trực tuyến cung cấp các sản phẩm chất lượng cao với giá
                cả hợp lý.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
              <p>Email: support@example.com</p>
              <p>Điện thoại: (123) 456-7890</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Theo dõi chúng tôi</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">
                  Facebook
                </a>
                <a href="#" className="hover:text-blue-400">
                  Twitter
                </a>
                <a href="#" className="hover:text-blue-400">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>
              &copy; 2024 Cửa hàng trực tuyến. Tất cả các quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

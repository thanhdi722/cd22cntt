"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";

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
import logo from "../../public/LOGO.png";
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
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const categories = ["Tất cả", "iPhone", "iPad", "MacBook"]; // Define categories

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
      if (!token) {
        window.location.href = "/login";
      }
    }

    fetchProducts(setProducts);
  });

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

  const filteredProducts = products.filter(
    (product: Product) =>
      (activeCategory === "all" || product.category === activeCategory) &&
      (searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setAccessToken(null);
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
      //   -----------------------------------------------------------------------

      star.style.animation = "moveit 2.5s infinite";

      let delayValue = Math.random() * 4;
      star.style.animationDelay = delayValue + "s";

      document.body.appendChild(star);
    }
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ overflow: "hidden", backgroundColor: "black" }}
    >
      <div className="flash-sale-banner">
        <Image src={ic1} alt="" />
      </div>
      <div className="flash-sale-banner2">
        <Image src={ic2} alt="" />
      </div>
      <div className="rocket">
        <Image className="rocket-fly shake" src={imgRocket} alt="" />
      </div>
      <header id="header" className="header-area style-01 layout-01">
        <div className="header-middle">
          <div className="container mx-auto">
            <div className="row flex flex-wrap items-center">
              <div className="col-lg-3 col-md-4 col-6 hidden-sm hidden-xs">
                <a href="/" className="biolife-logo">
                  <img
                    src={logo.src}
                    alt="biolife logo"
                    width="135"
                    height="36"
                  />
                </a>
              </div>
              <div className="col-lg-8 col-md-6 col-6">
                <div className="header-search-bar layout-01 no-product-cat">
                  <form
                    action="#"
                    className="form-search"
                    name="desktop-seacrh"
                    method="get"
                  >
                    <input
                      type="text"
                      placeholder="Tìm kiếm"
                      className="input-search"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleSearch(e.target.value);
                      }}
                    />
                    <button type="submit" className="btn-submit">
                      <i className="biolife-icon icon-search"></i>
                    </button>
                  </form>
                </div>
                <div className="float-right ml-2">
                  <button
                    onClick={handleLogout}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 border-radius-10 break-words"
                    style={{ borderRadius: "10px", width: "100px" }}
                  >
                    Đăng Xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow mx-auto md:container">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Danh mục sản phẩm
        </h2>

        <div>
          <div className="product-list-sale">
            <div>
              <div className="upgrade-list">
                <div className="">
                  <div>
                    <div
                      className="women-decor"
                      style={{ paddingBottom: "20px" }}
                    >
                      {/* <Image
                          src={DecorWomen}
                          width={1920}
                          height={1200}
                          alt="product-banner-01"
                          className=""
                        /> */}
                    </div>
                    {filteredProducts && filteredProducts.length > 0 ? (
                      <div className="upgrade">
                        {filteredProducts.map((product: any) => (
                          <div key={product.id}>
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

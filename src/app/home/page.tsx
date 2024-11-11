"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Search } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Áo thun basic",
    price: 199000,
    category: "clothing",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Quần jean slim fit",
    price: 499000,
    category: "clothing",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Giày sneaker",
    price: 799000,
    category: "shoes",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Túi xách da",
    price: 1299000,
    category: "accessories",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Đồng hồ thông minh",
    price: 2999000,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Tai nghe không dây",
    price: 1499000,
    category: "electronics",
    image: "/placeholder.svg?height=200&width=200",
  },
];

const categories = ["all", "clothing", "shoes", "accessories", "electronics"];

export default function MultiProductCatalog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );

  useEffect(() => {
    if (!accessToken) {
      window.location.href = "/login";
    }
  }, [accessToken]);

  const filteredProducts = products.filter(
    (product) =>
      (activeCategory === "all" || product.category === activeCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setAccessToken(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">TECH ZONE</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="py-2 px-4 pr-10 rounded-full text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute right-3 top-2.5 text-gray-500"
              size={20}
            />
          </div>
          <button
            className="bg-white text-black px-4 py-2 rounded-full"
            onClick={handleLogout}
          >
            đăng xuất
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Danh mục sản phẩm
        </h2>

        <div className="flex justify-center mb-8 space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full ${
                activeCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category === "all" ? "Tất cả" : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">
                  {product.price.toLocaleString("vi-VN")} ₫
                </p>
              </div>
              <div className="p-4 bg-gray-50">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 flex items-center justify-center">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
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
              &copy; 2023 Cửa hàng trực tuyến. Tất cả các quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

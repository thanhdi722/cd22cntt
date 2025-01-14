"use client";
import Link from "next/link";
import Image from "next/image";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { EyeIcon } from "lucide-react";
import logo from "../../../public/logo.jpg";
import background from "../../../public/bacground-login-2.jpg";
import "./index.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Component() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch(
      "https://manager-rkz3.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          phone_number: phoneNumber,
          password,
        }),
      }
    );

    if (response.ok) {
      router.push("/login");
    } else {
      alert("sai rồi nhập lại đi!");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Image
        src={background}
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
        style={{ zIndex: "-1" }}
      />
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-lg overflow-hidden bg-white shadow-xl">
        <div className="content-login bg-gradient-to-br from-orange-500 via-red-500 to-purple-500 p-8 flex items-center justify-center text-white">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-bold">
              Chào mừng đến với hệ thống quản lý kho hàng
            </h2>
            <p className="text-sm opacity-90">
              Hệ thống quản lý kho hàng được phát triển bởi DAP
            </p>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center">
          <div className="size-40 relative mb-4">
            <Image
              src={logo}
              alt="Lotus Team Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-center mb-8">
            Hệ thống quản lý kho hàng
          </h1>
          <p className="text-muted-foreground mb-6">
            Please login to your account
          </p>
          <form className="w-full max-w-sm space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nhập tên người dùng"
                className="w-full p-2"
                style={{ border: "1px solid black", borderRadius: "5px" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nhập email"
                className="w-full p-2"
                style={{ border: "1px solid black", borderRadius: "5px" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nhập số điện thoại"
                className="w-full p-2"
                style={{ border: "1px solid black", borderRadius: "5px" }}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2 relative">
              <input
                type="password"
                style={{ border: "1px solid black", borderRadius: "5px" }}
                placeholder="Nhập mật khẩu"
                className="w-full p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="absolute right-2 top-0.5" type="button">
                <span className="sr-only">Toggle password visibility</span>
              </button>
            </div>
            <div className="space-y-2 relative">
              <input
                type="password"
                style={{ border: "1px solid black", borderRadius: "5px" }}
                placeholder="Nhập lại mật khẩu"
                className="w-full p-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="absolute right-2 top-0.5" type="button">
                <span className="sr-only">Toggle password visibility</span>
              </button>
            </div>
            <button
              style={{ borderRadius: "5px" }}
              className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 hover:opacity-90 p-2 text-white"
              type="submit"
            >
              Đăng ký
            </button>
          </form>
          <div className="mt-8 flex items-center gap-2">
            <span className="text-sm">Bạn đã có tài khoản?</span>
            <Link
              href="/login"
              className="border-red-500 text-red-500 hover:bg-red-50 "
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

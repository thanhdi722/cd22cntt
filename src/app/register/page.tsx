import Link from "next/link";
import Image from "next/image";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { EyeIcon } from "lucide-react";
import logo from "../../../public/LOGO.png";
import background from "../../../public/bacground-login.jpg";
import "./index.scss";
export default function Component() {
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
              We are more than just a company
            </h2>
            <p className="text-sm opacity-90">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
        <div className="p-8 flex flex-col items-center">
          <div className="w-32 h-32 relative mb-4">
            <Image
              src={logo}
              alt="Lotus Team Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-center mb-8">
            We are The Lotus Team
          </h1>
          <p className="text-muted-foreground mb-6">
            Please login to your account
          </p>
          <form className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nhập email"
                className="w-full p-2"
                style={{ border: "1px solid black", borderRadius: "5px" }}
              />
            </div>
            <div className="space-y-2 relative">
              <input
                type="password"
                style={{ border: "1px solid black", borderRadius: "5px" }}
                placeholder="Nhập mật khẩu"
                className="w-full p-2"
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
              />
              <button className="absolute right-2 top-0.5" type="button">
                <span className="sr-only">Toggle password visibility</span>
              </button>
            </div>
            <button
              className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 hover:opacity-90 p-2"
              type="submit"
            >
              Đăng ký
            </button>
          </form>
          <div className="mt-8 flex items-center gap-2">
            <span className="text-sm">Bạn đã có tài khoản?</span>
            <Link
              href="/login"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Hexagon, Mail, Lock } from "lucide-react";
import api from "@/apis/authApi";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

type LoginProps = {
  onSuccess?: () => void;
};

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", { email, password });

      // Lưu token vào localStorage
      localStorage.setItem("token", response.data.accessToken);

      onSuccess?.();

      // Chuyển hướng về trang chủ (Dashboard)
      navigate("/");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại!",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[24px] p-8 shadow-lg">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white shadow-md">
            <Hexagon size={28} fill="currentColor" />
          </div>
          <h1 className="text-[24px] font-bold text-[#1E1E2F] tracking-wide">
            LEARNIFY
          </h1>
          <p className="text-[#666666] text-sm">
            Welcome back! Please login to your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[#1E1E2F] text-sm font-medium mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[#1E1E2F] text-sm font-medium mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button variant="default" className="w-full !mt-8" type="submit">
            Login
          </Button>
        </form>
        <p className="text-center text-sm text-[#666666] mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#8B5CF6] font-bold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

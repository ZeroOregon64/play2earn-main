import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "./globalStateForAuth";

const LoginPopup = ({
  isOpen,
  onClose,
  innSignUpLink,
  innForgetPasswordLink,
  userLoginStatusDone,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const endpoint =
      role === "Admin" ? "/api/admin/log_in" : "/api/users/log_in";
    try {
      const API_BASE_URL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:5002"
          : "https://4rzf4x59sk.execute-api.eu-north-1.amazonaws.com/dev";

      const apiUrl = `${API_BASE_URL}${endpoint}`;

      const response = await axios.post(apiUrl, {
        email,
        password,
      });

      console.log(response.data, "ss", response.data.token);
      if (response.data.message === "success") {
        if (role === "User") {
          userLoginStatusDone();
          onClose();
          localStorage.setItem('access_token', response.data.token);
          alert("Welcome to play2earn");
        } else if (role === "Admin") {
          navigate("/dashboard");
        }
      } else {
        alert("Incorrect email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  };

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === "User" ? "Admin" : "User"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white backdrop-blur-lg rounded-[20px] shadow-lg p-6 max-w-sm w-full border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Login</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              placeholder="example@gmail.com"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              style={{
                width: "calc(100% - 0.5rem)",
                backgroundColor: "#d5dbdb30",
                borderBottom: "1px solid rgba(193, 199, 205, 1)",
              }}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              placeholder="Enter your password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                width: "calc(100% - 0.5rem)",
                backgroundColor: "#d5dbdb30",
                borderBottom: "1px solid rgba(193, 199, 205, 1)",
              }}
            />
          </div>
          <div className="mb-4 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full mb-3"
            >
              Login
            </button>
            <a
              onClick={() => innForgetPasswordLink()}
              className="text-blue-500 cursor-pointer"
            >
              Forgot password?
            </a>
          </div>
        </form>

        <div className="flex items-center justify-center mb-4">
          <span className="text-gray-600">OR</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span>
            Don't have an account?{" "}
            <a
              onClick={() => innSignUpLink()}
              className="text-blue-500 cursor-pointer"
            >
              Sign up
            </a>
          </span>
        </div>

        {/* Switch Role Button at the bottom */}
        <div className="flex justify-center mb-4">
          <button
            onClick={toggleRole}
            className={`px-4 py-2 rounded-lg font-semibold focus:outline-none transition ${
              role === "Admin"
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {role === "Admin" ? "Switch to User" : "Switch to Admin"}
          </button>
        </div>

        <p className="text-center text-gray-700">
          You are logging in as: <span className="font-bold">{role}</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;

import React, { useState } from "react";
import axios from "axios";

// code by mit prajapati

const ForgetPassPopup = ({ isOpen, onClose, innResetPasswordLink }) => {
  const [email, setEmail] = useState("");

  const handleResetPass = async (e) => {
    e.preventDefault();
    const API_BASE_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5002"
        : "https://4rzf4x59sk.execute-api.eu-north-1.amazonaws.com/dev";

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/requestUserPasswordReset`,
        { email }
      );
      console.log("Response:", response.data);
      alert("Password reset link sent!");
      innResetPasswordLink();
    } catch (error) {
      console.error("Error during password reset request:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      alert("Failed to send password reset link.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white backdrop-blur-lg rounded-[20px] shadow-lg p-6 max-w-sm w-full border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Reset Password</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleResetPass}>
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
              style={{
                width: "calc(100% - 0.5rem)",
                backgroundColor: "#d5dbdb30",
                borderBottom: "1px solid rgba(193, 199, 205, 1)",
              }}
              required
            />
          </div>
          <div className="mb-4 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full mb-3"
            >
              Send a message to email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassPopup;

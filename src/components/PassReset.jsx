import React, { useState } from "react";
import axios from "axios";

const PasswordReset = ({ isOpen, onClose }) => {
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [RetypePassword, setRetypePassword] = useState("");
  // console.log(otp, newPassword, RetypePassword)

  const handlePassReset = async (e) => {
    e.preventDefault();
    const API_BASE_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5002"
        : "https://4rzf4x59sk.execute-api.eu-north-1.amazonaws.com/dev";

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/passwordSet`,
        { otp, newPassword }
      );
      console.log("response", response.data);
      if (response.data === "correct") {
        alert("The password has changed!");
      } else {
        alert("The OTP is incorrect! Try again");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white backdrop-blur-lg rounded-[20px] shadow-lg p-6 max-w-sm w-full border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Password Reset</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handlePassReset}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font mb-2"
              htmlFor="otp"
            >
              OTP
            </label>
            <input
              placeholder="Enter a OTP"
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
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
              className="block text-gray-700 text-sm font mb-2"
              htmlFor="newPassword"
            >
              Password
            </label>
            <input
              placeholder="New Password"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              className="block text-gray-700 text-sm font mb-2"
              htmlFor="re_type_password"
            >
              Retype Password
            </label>
            <input
              placeholder="Re-type The Password"
              id="re_type_password"
              type="password"
              value={RetypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="w-full p
                            x-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              style={{
                width: "calc(100% - 0.5rem)",
                backgroundColor: "#d5dbdb30",
                borderBottom: "1px solid rgba(193, 199, 205, 1)",
              }}
            />
          </div>
          {/* {err && <p className="text-red-500 mb-4">{err}</p>} */}
          <div className="mb-4 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full mb-3"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PasswordReset;

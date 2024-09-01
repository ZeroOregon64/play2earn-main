import React, { useState } from "react";
import axios from "axios";
import { FaGoogle } from "react-icons/fa";

const SignUpPopup = ({ isOpen, onClose, innLogInlink }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refBy, setRef_num] = useState("");
  // const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault();
    const API_BASE_URL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5002"
        : "https://4rzf4x59sk.execute-api.eu-north-1.amazonaws.com/dev";

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/sign_up`, {
        firstName,
        lastName,
        email,
        password,
        refBy,
      });

      console.log(response);
      alert(
        "You are signed up successfully! Now, you can log in to your account!"
      );
      innLogInlink();
    } catch (err) {
      console.error("Error during sign up:", err);
      alert("Sign up failed. Please try again.");
    }

    onClose(); // Close the sign-up form/modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white backdrop-blur-lg rounded-[20px] shadow-lg p-6 max-w-sm w-full border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sign up</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSignUp}>
          <div className="flex mb-4 space-x-4">
            <div className="w-3/5">
              <label
                className="block text-gray-700 text-sm font mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                placeholder="Enter First Name"
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                style={{
                  width: "calc(100% - 0.5rem)",
                  backgroundColor: "#d5dbdb30",
                  borderBottom: "1px solid rgba(193, 199, 205, 1)",
                }}
              />
            </div>

            <div className="w-3/5">
              <label
                className="block text-gray-700 text-sm font mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                placeholder="Enter Last Name"
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                style={{
                  width: "calc(100% - 0.5rem)",
                  backgroundColor: "#d5dbdb30",
                  borderBottom: "1px solid rgba(193, 199, 205, 1)",
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-black text-sm font mb-2"
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
              className="block text-gray-700 text-sm font mb-2"
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
              htmlFor="ref_num"
            >
              Referral code
            </label>
            <input
              placeholder="Enter the Referral code"
              id="ref_num"
              type="text"
              value={refBy}
              onChange={(e) => setRef_num(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              Sign up
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center mb-4">
          <span className="text-gray-600">OR</span>
        </div>

        {/* Google login button */}
        <button
          // onClick={handleGoogle}
          className="bg-gray-100 border border-blue-500 text-white font-small py-2 px-4 rounded-lg flex items-center justify-center w-full mb-3 text-base"
          style={{
            backgroundColor: "rgba(242, 244, 248, 1)",
            borderColor: "rgba(15, 98, 254, 1)",
            color: "rgba(15, 98, 254, 1)",
          }}
        >
          <FaGoogle className="mr-2" /> Sign up with Google
        </button>

        <div className="flex justify-between items-center">
          <span>
            Already have an account?{" "}
            <a onClick={() => innLogInlink()} className="text-blue-500">
              Login
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
export default SignUpPopup;

import React, { useState } from "react";
import api from "/src/api.js";
import logo from "/src/assets/logo.png";
import appleLogo from "/src/assets/apple-logo.jpg";
import googleLogo from "/src/assets/google-logo.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/admin/auth/login",
        {
          email,
          password,
        });

      if (response.status === 200) {
        console.log("response token", response.data?.data?.authorization?.token)
        localStorage.setItem("admin_logged_in", "true");
        localStorage.setItem("token", response.data?.data?.authorization?.token);
        window.location.href = "/";

      } else {
        setError("Login failed. Please check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-sm p-6 bg-transparent backdrop-blur-md rounded-lg">
        <div class="flex justify-center mb-20"><img src={logo} alt="logo" className="w-80 " /></div>
        <h2 className="font-serif text-3xl font-semibold text-left text-[#223140] mb-8">
          Admin Panel Login
        </h2>
        <h6 class="text-gray-500 mb-2">Login with your email and password:</h6>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grey-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-grey-500"
              required
            />
            {typeof error === "string" && error && (
              <p className="text-red-500 text-xs mt-1">✖ {error}</p>
            )}

          </div>
          <button
            type="submit"
            className="w-full bg-[#129295] text-white p-3 rounded-md hover:bg-[#0f7f81] transition"
          >
            Login
          </button>

          <div class="flex iems-center my-4">
            <span className="text-black">or Login with</span>
          </div>
          <div className="flex gap-3">
            <button
              className="w-auto bg-black text-white py-2 px-2 rounded-xl transition"
              onClick={() => console.log("Apple login triggered")}
            >
              <img src={appleLogo} class="w-10" />
            </button>
            <button
              className="w-auto bg-white border text-white py-2 px-1 rounded-xl ltransition"
              onClick={() => console.log("Google login triggered")}
            >
              <img src={googleLogo} class="w-12" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

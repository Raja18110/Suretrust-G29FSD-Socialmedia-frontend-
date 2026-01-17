import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { getUnreadNotificationCount } from "../api/notificationApi.js"
import { baseUrl } from "../baseUrl";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
}

interface LoginPopupProps {
  onClose: () => void;
  setUser: (name: string) => void;
}

interface ErrorResponse {
  message?: string;
}

const Navbar: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  console.log(isLoginPage);

  const [openPopup, setOpenPopup] = useState(false);

  const searchUser = async (query: string) => {
    try {
      const res = await axios.get<{ users: User[] }>(
        `${baseUrl}/user/search/${query}`
      );
      if (res.data.users) {
        setResults(res.data.users);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText.trim().length > 0) {
        searchUser(searchText);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!isLoginPage) {
        try {
          const res = await getUnreadNotificationCount();
          setUnreadCount(res.data.unreadCount);
        } catch (error) {
          console.error("Error fetching unread count:", error);
        }
      }
    };
    fetchUnreadCount();
  }, [isLoginPage, location.pathname]);

  const handleSelectUser = (userId: string) => {
    setShowDropdown(false);
    setSearchText("");
    console.log("Selected User ID:", userId);
    // navigate(`/profile/${userId}`);
  };

  return (
    <>
      <nav className="w-full h-13 bg-linear-to-r from-red-600 via-red-500 to-rose-500 shadow-lg border-b border-red-700/30 flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <img src="../../public/logo.png" alt="Logo" className="w-10 h-10 rounded-full flex items-center justify-center" />
          </div>
          <h1 className="font-bold text-2xl text-white tracking-tight hidden sm:block">
            PulseNet    
          </h1>
        </Link>

        {isLoginPage ? (
          <button
            className="bg-white text-red-600 font-semibold py-2.5 px-6 rounded-full hover:bg-gray-50 hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/20"
            onClick={() => setOpenPopup(true)}
          >
            Login
          </button>
        ) : (
          <>
            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchText}
                    className="w-64 bg-white/90 backdrop-blur-sm border-2 border-white/50 rounded-full px-5 py-2.5 pl-11 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 shadow-md"
                    onChange={(e) => setSearchText(e.target.value)}
                    onFocus={() => searchText && setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Search Dropdown */}
                {showDropdown && results.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 backdrop-blur-lg">
                    {results.map((user) => (
                      <div
                        key={user._id}
                        className="px-4 py-3 hover:bg-linear-to-r hover:from-red-50 hover:to-rose-50 cursor-pointer flex items-center gap-3 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSelectUser(user._id)}
                      >
                        <div className="relative">
                          <img
                            src={user.profilePic}
                            className="w-11 h-11 rounded-full object-cover ring-2 ring-red-100"
                            alt={user.name}
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <Link
                          to={`/friend/${user._id}`}
                          className="text-gray-800 font-medium hover:text-red-600 transition-colors"
                        >
                          {user.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
                {user && (
                  <div className="relative">
                    <img
                      src={localStorage.getItem("profilePic") || ""}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-red-100"
                    />  
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                )}
              {/* Navigation Icons */}
              <div className="flex items-center gap-4">
                {/* Notification Icon */}
                <Link
                  to="/notification"
                  className="relative w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                >
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Icon */}
                <Link
                  to="/profile"
                  className="w-10 h-10 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center hover:ring-4 hover:ring-white/30 transition-all duration-300 shadow-md group"
                >
                  <svg
                    className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </>
        )}
      </nav>

      {openPopup && (
        <LoginPopup onClose={() => setOpenPopup(false)} setUser={setUser} />
      )}
    </>
  );
};

export default Navbar;

const LoginPopup: React.FC<LoginPopupProps> = ({ onClose, setUser }) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(form);

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    console.log("ok");

    setLoading(true);
    setError("");
    try {
      const res = await axios.post<{
        token: string;
        message: string;
        profilePic: string;
      }>(`${baseUrl}/user/login`, {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("profilePic", res.data.profilePic);
      localStorage.setItem("loginTime", Date.now().toString());

      const userName = res.data.message.split(" ")[0];
      setUser(userName);

      alert(`Login successful for ${userName}`);
      console.log(res.data);

      onClose();
      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || "Login failed";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    if (form.password !== form.cPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post<{ message: string }>(
        `${baseUrl}/user/register`,
        {
          email: form.email,
          password: form.password,
          name: form.name,
        }
      );

      if (res.status === 201) {
        setActiveTab("login");
        alert("Registration successful! Please login.");
      } else {
        setError("Registration failed");
        alert("Registration failed");
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Registration failed";
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all max-h-[95vh] flex flex-col">
        {/* Header with linear - Compact */}
        <div className="bg-linear-to-r from-red-600 via-red-500 to-rose-500 p-4 text-center">
          <div className="w-12 h-12 bg-linear-to-br from-amber-400 to-yellow-600 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h2 className="text-xl font-bold text-white">Welcome to PulseNet</h2>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto">
          {/* Tab Buttons */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-4">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-linear-to-r from-red-600 to-rose-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === "signup"
                  ? "bg-linear-to-r from-red-600 to-rose-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2 rounded-lg mb-3 flex items-start gap-2">
              <svg
                className="w-4 h-4 mt-0.5 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs">{error}</span>
            </div>
          )}

          {/* -------------------- LOGIN FORM -------------------- */}
          {activeTab === "login" && (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <button
                className="w-full bg-linear-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              <Link to="/resetpassword" onClick={onClose}>
                <p className="text-xs text-center text-gray-600 hover:text-red-600 transition-colors cursor-pointer pt-1">
                  Forgot password?
                </p>
              </Link>

              <p className="text-xs text-gray-600 text-center pt-2">
                Don't have an account?{" "}
                <span
                  className="text-red-600 font-semibold cursor-pointer hover:text-red-700 transition-colors"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign up
                </span>
              </p>
            </div>
          )}

          {/* -------------------- SIGNUP FORM -------------------- */}
          {activeTab === "signup" && (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  onChange={handleChange}
                  value={form.name}
                  name="name"
                  className="w-full border-2 border-gray-200 p-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full border-2 border-gray-200 p-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  onChange={handleChange}
                  value={form.email}
                  name="email"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border-2 border-gray-200 p-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  onChange={handleChange}
                  value={form.password}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>

              <div className="relative">
                <input
                  type="password"
                  name="cPassword"
                  placeholder="Confirm Password"
                  className="w-full border-2 border-gray-200 p-2.5 pl-10 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                  onChange={handleChange}
                  value={form.cPassword}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              <button
                className="w-full bg-linear-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-xs text-gray-600 text-center pt-2">
                Already have an account?{" "}
                <span
                  className="text-red-600 font-semibold cursor-pointer hover:text-red-700 transition-colors"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </span>
              </p>
            </div>
          )}

          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors flex items-center justify-center gap-2 group text-sm"
          >
            <svg
              className="w-3 h-3 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

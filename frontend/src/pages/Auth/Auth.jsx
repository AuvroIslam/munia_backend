import { useState, useEffect } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../contexts/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const [showOtpForm, setShowOtpForm] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");

  //loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await apiClient.post("/register", signupData);
      setSuccessMessage(response.data.message);
      setShowOtpForm(true);
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occured.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await apiClient.post("/verify-otp", {
        email: signupData.email,
        otp: otp,
      });
      setSuccessMessage(response.data.message + " You can now sign in.");
      setShowOtpForm(false);
      setActiveTab("signin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await apiClient.post("/login", loginData);
      const { token, user } = response.data;

      // Use the login function from AuthContext
      login(user, token);

      setSuccessMessage("Login successful! Redirecting...");

      // Redirect to homepage after successful login
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const renderFeedback = () => (
    <>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      {successMessage && (
        <p className="text-sm text-green-500">{successMessage}</p>
      )}
    </>
  );

  return (
    <div
      className="min-h-screen flex justify-center items-center 
        bg-gradient-to-r from-[#f3f6ff] to-[#f3f6ff] dark:from-gray-800 dark:to-gray-800 
        py-20 text-center"
    >
      <div
        className="bg-white dark:bg-gray-900 
            rounded-2xl shadow-lg border-2 border-red-200 
            p-8 w-full max-w-md text-gray-900 dark:text-gray-100"
      >
        <div className="flex justify-center mb-4">
          <FileText className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-center text-transparent bg-gradient-to-r from-red-600 to-red-700 bg-clip-text">
          {showOtpForm ? "Verify Your Email" : "Welcome to PDF Pulse"}
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {showOtpForm
            ? "An OTP has been sent to your email."
            : "Your intelligent PDF library awaits"}
        </p>

        {showOtpForm ? (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
            </button>
            {renderFeedback()}
          </form>
        ) : (
          <>
            <div className="flex mb-6">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-2 font-medium rounded-t-lg cursor-pointer transition ${
                  activeTab === "signin"
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-300"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2 font-medium rounded-t-lg cursor-pointer transition ${
                  activeTab === "signup"
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-300"
                }`}
              >
                Sign Up
              </button>
            </div>

            {activeTab === "signin" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition flex justify-center items-center"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                </button>
                {renderFeedback()}
              </form>
            )}
            {activeTab === "signup" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="password_confirmation"
                  value={signupData.password_confirmation}
                  onChange={handleSignupChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer w-full py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:opacity-90 transition flex justify-center items-center"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
                </button>
                {renderFeedback()}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

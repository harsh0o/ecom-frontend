import { useState } from "react";
import { CheckSquare, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { CookieUtils } from "../../utils/CookieUtils";
import { useNavigate } from "react-router-dom";
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setLoginForm({ ...loginForm, email: value });
    if (touched.email) {
      setValidationErrors({
        ...validationErrors,
        email: validateEmail(value),
      });
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setLoginForm({ ...loginForm, password: value });
    if (touched.password) {
      setValidationErrors({
        ...validationErrors,
        password: validatePassword(value),
      });
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    if (field === "email") {
      setValidationErrors({
        ...validationErrors,
        email: validateEmail(loginForm.email),
      });
    } else if (field === "password") {
      setValidationErrors({
        ...validationErrors,
        password: validatePassword(loginForm.password),
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    setTouched({ email: true, password: true });

    const emailError = validateEmail(loginForm.email);
    const passwordError = validatePassword(loginForm.password);

    setValidationErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${apiEndpoint}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginForm.email,
            password: loginForm.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        CookieUtils.setCookie("authToken", data.access_token, 7);
        alert("Login successful!");
        navigate("/");
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      setError("Unable to connect to server. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-zinc-400">Sign in to manage your tasks</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className={`w-full bg-zinc-800 border ${
                    validationErrors.email && touched.email
                      ? "border-red-500"
                      : "border-zinc-700"
                  } rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
              {validationErrors.email && touched.email && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur("password")}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={`w-full bg-zinc-800 border ${
                    validationErrors.password && touched.password
                      ? "border-red-500"
                      : "border-zinc-700"
                  } rounded-lg pl-10 pr-12 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && touched.password && (
                <p className="mt-1 text-sm text-red-400">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-zinc-800 rounded-lg">
            <p className="text-xs text-zinc-400 mb-2">Test credentials:</p>
            <p className="text-xs text-zinc-300">Email: john@mail.com</p>
            <p className="text-xs text-zinc-300">Password: changeme</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

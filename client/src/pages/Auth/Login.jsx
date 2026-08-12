import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      /*
       * Login against the REAL Railway backend.
       */
      const result = await loginUser(
        formData.email,
        formData.password
      );

      /*
       * Backend returns:
       *
       * {
       *   message,
       *   token,
       *   user
       * }
       */
      const backendUser = result.user;

      const jwtToken = result.token;

      if (!backendUser || !jwtToken) {
        throw new Error(
          "Login response is missing authentication information."
        );
      }

      /*
       * Save the real backend user
       * and JWT through AuthContext.
       */
      login(
        backendUser,
        jwtToken
      );

      /*
       * Convert the backend role to lowercase
       * so the frontend can use seller/buyer.
       */
      const role = backendUser.role
        ? backendUser.role.toLowerCase()
        : "buyer";

      /*
       * Send the user to the appropriate dashboard.
       */
      if (role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Login failed. Please check your email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">

        {/* Header */}

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-3">
            Login to your Mandilas Market account.
          </p>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Login Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Email */}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 outline-none focus:border-green-600"
            required
          />

          {/* Password */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 outline-none focus:border-green-600"
            required
          />

          {/* Remember / Forgot Password */}

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 cursor-pointer">

              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />

              <span className="text-sm text-gray-600">
                Remember Me
              </span>

            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-green-700 font-semibold hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-xl transition text-white font-semibold text-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading
              ? "Logging In..."
              : "Login"}
          </button>

        </form>

        {/* Register */}

        <div className="mt-8 text-center">

          <p className="text-gray-600">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="text-green-700 font-semibold hover:underline"
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </section>
  );
}

export default Login;
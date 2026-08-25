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


  /*
   * =========================================================
   * LOGIN
   * =========================================================
   *
   * NO JWT.
   *
   * The backend only verifies:
   *
   * - email
   * - password
   *
   * The backend returns the user.
   *
   * AuthContext then stores the user in:
   *
   * mandilas-user
   *
   * =========================================================
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      /*
       * Login against the real backend.
       */
      const result = await loginUser(
        formData.email,
        formData.password
      );


      /*
       * Backend response:
       *
       * {
       *   message,
       *   user
       * }
       *
       * There is NO token.
       */
      const backendUser =
        result?.user;


      /*
       * Make sure the backend actually
       * returned a user.
       */
      if (!backendUser) {

        throw new Error(
          "Login response is missing user information."
        );
      }


      /*
       * Save the authenticated user
       * through AuthContext.
       *
       * AuthContext handles:
       *
       * mandilas-user
       *
       * in localStorage.
       *
       * NO JWT.
       */
      login(
        backendUser
      );


      /*
       * Login successful.
       *
       * Both BUYER and SELLER go
       * to the main marketplace.
       *
       * Their role remains available
       * through AuthContext.
       */
      navigate("/");


    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        error?.message ||
          "Login failed. Please check your email and password."
      );

    } finally {

      setLoading(false);

    }
  };


  /*
   * =========================================================
   * BACK BUTTON
   * =========================================================
   */

  const handleBack = () => {

    navigate(-1);

  };


  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">

        {/* =====================================================
            BACK BUTTON
        ===================================================== */}

        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-green-700 font-medium mb-8 transition"
        >

          <span className="text-xl">
            ←
          </span>

          <span>
            Back
          </span>

        </button>


        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-3">
            Login to your Mandilas Market account.
          </p>

        </div>


        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* =====================================================
            LOGIN FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ===================================================
              EMAIL
          =================================================== */}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 outline-none focus:border-green-600"
            required
          />


          {/* ===================================================
              PASSWORD
          =================================================== */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 outline-none focus:border-green-600"
            required
          />


          {/* ===================================================
              REMEMBER ME / FORGOT PASSWORD
          =================================================== */}

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


          {/* ===================================================
              LOGIN BUTTON
          =================================================== */}

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


        {/* =====================================================
            REGISTER LINK
        ===================================================== */}

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
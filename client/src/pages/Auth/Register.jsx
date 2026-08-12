import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/authService";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!formData.agree) {
      setError("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const registeredUser = await registerUser(formData);

      /*
       * The backend returns SELLER or BUYER.
       * The frontend AuthContext uses lowercase roles.
       */
      const frontendRole = registeredUser.role
        ? registeredUser.role.toLowerCase()
        : formData.role;

      login({
        id: registeredUser.id,
        firstName: registeredUser.firstName,
        lastName: registeredUser.lastName,
        email: registeredUser.email,
        phone: registeredUser.phone,
        role: frontendRole,
        sellerVerified: registeredUser.sellerVerified || false,
      });

      if (frontendRole === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.message ||
          "Registration failed. Please check your information and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

        {/* Header */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Create Account
          </h1>

          <p className="text-gray-500 mt-3">
            Join Mandilas Market and start shopping or selling.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Registration Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* First & Last Name */}

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="border rounded-lg p-4 focus:border-green-600 outline-none w-full"
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border rounded-lg p-4 focus:border-green-600 outline-none w-full"
              required
            />

          </div>

          {/* Email */}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 focus:border-green-600 outline-none"
            required
          />

          {/* Phone */}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 focus:border-green-600 outline-none"
            required
          />

          {/* Register As */}

          <div>
            <label className="block font-semibold mb-3">
              Register As
            </label>

            <div className="grid grid-cols-2 gap-4">

              {/* Buyer */}

              <button
                type="button"
                onClick={() => handleRoleChange("buyer")}
                className={`rounded-xl border p-5 font-semibold transition cursor-pointer ${
                  formData.role === "buyer"
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 hover:border-green-600 hover:bg-green-50"
                }`}
              >
                🛍️ Buyer
              </button>

              {/* Seller */}

              <button
                type="button"
                onClick={() => handleRoleChange("seller")}
                className={`rounded-xl border p-5 font-semibold transition cursor-pointer ${
                  formData.role === "seller"
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 hover:border-green-600 hover:bg-green-50"
                }`}
              >
                🏪 Seller
              </button>

            </div>

            {/* Selected Role */}

            <p className="mt-3 text-sm text-gray-500">
              You are registering as a{" "}
              <span className="font-semibold text-green-700">
                {formData.role === "seller" ? "Seller" : "Buyer"}
              </span>
              .
            </p>
          </div>

          {/* Password */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 focus:border-green-600 outline-none"
            required
            minLength={6}
          />

          {/* Confirm Password */}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 focus:border-green-600 outline-none"
            required
            minLength={6}
          />

          {/* Terms */}

          <div className="flex items-start gap-3">

            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 cursor-pointer"
              required
            />

            <p className="text-sm text-gray-600">

              I agree to the{" "}

              <Link
                to="/terms"
                className="text-green-700 font-semibold hover:underline"
              >
                Terms & Conditions
              </Link>

              {" "}and{" "}

              <Link
                to="/privacy"
                className="text-green-700 font-semibold hover:underline"
              >
                Privacy Policy
              </Link>

            </p>

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-14 rounded-xl transition text-white font-semibold text-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* Login */}

        <div className="mt-8 text-center">

          <p className="text-gray-600">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-green-700 font-semibold hover:underline"
            >
              Login
            </Link>

          </p>

        </div>

      </div>
    </section>
  );
}

export default Register;
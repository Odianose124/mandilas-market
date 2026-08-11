import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

  };

  const handleSubmit = (e) => {

  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {

    alert("Passwords do not match.");

    return;

  }

  login({

    firstName: formData.firstName,

    lastName: formData.lastName,

    email: formData.email,

    phone: formData.phone,

    role: formData.role,

  });

  if (formData.role === "seller") {

    navigate("/seller/dashboard");

  } else {

    navigate("/dashboard");

  }

};

  return (

    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold">
            Create Account
          </h1>

          <p className="text-gray-500 mt-3">
            Join Mandilas Market and start shopping or selling.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="border rounded-lg p-4 focus:border-green-600 outline-none"
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border rounded-lg p-4 focus:border-green-600 outline-none"
              required
            />

          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 focus:border-green-600 outline-none"
            required
          />

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

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "buyer",
                  })
                }
                className={`rounded-xl border p-5 font-semibold transition ${
                  formData.role === "buyer"
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 hover:border-green-600"
                }`}
              >
                🛍 Buyer
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: "seller",
                  })
                }
                className={`rounded-xl border p-5 font-semibold transition ${
                  formData.role === "seller"
                    ? "bg-green-600 text-white border-green-600"
                    : "border-gray-300 hover:border-green-600"
                }`}
              >
                🏪 Seller
              </button>

            </div>

          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 focus:border-green-600 outline-none"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 focus:border-green-600 outline-none"
            required
          />

          <div className="flex items-start gap-3">

            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1"
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

          <button
            type="submit"
            className="w-full h-14 rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-semibold text-lg"
          >
            Create Account
          </button>

        </form>

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
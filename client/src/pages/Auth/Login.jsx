import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {

  const navigate = useNavigate();

const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
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

  const user = {
    firstName: "Odianose",
    lastName: "User",
    email: formData.email,
  };

  login(user);

  navigate("/");
};

    return (
    <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-3">
            Login to your Mandilas Market account.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 outline-none focus:border-green-600"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 outline-none focus:border-green-600"
            required
          />

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

          <button
            type="submit"
            className="w-full h-14 rounded-xl bg-green-600 hover:bg-green-700 transition text-white font-semibold text-lg"
          >
            Login
          </button>

        </form>

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
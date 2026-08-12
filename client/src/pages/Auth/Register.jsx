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
    storeName: "",
    agree: false,
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  /*
   * Handle form changes.
   */
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
   * Change between BUYER and SELLER.
   */
  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,

      role,

      /*
       * Clear store name when switching
       * back to buyer.
       */
      storeName:
        role === "buyer"
          ? ""
          : prev.storeName,
    }));

    setError("");
  };


  /*
   * Go back to previous page.
   */
  const handleGoBack = () => {
    navigate(-1);
  };


  /*
   * Submit registration.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");


    /*
     * Confirm passwords.
     */
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }


    /*
     * Minimum password length.
     */
    if (
      formData.password.length < 8
    ) {
      setError(
        "Password must be at least 8 characters long."
      );

      return;
    }


    /*
     * Seller must have a store name.
     */
    if (
      formData.role === "seller" &&
      !formData.storeName.trim()
    ) {
      setError(
        "Store name is required for seller accounts."
      );

      return;
    }


    /*
     * Terms agreement.
     */
    if (!formData.agree) {
      setError(
        "You must agree to the Terms & Conditions and Privacy Policy."
      );

      return;
    }


    setLoading(true);


    try {

      /*
       * Send registration data
       * to Railway backend.
       */
      const result =
        await registerUser({
          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          password:
            formData.password,

          role:
            formData.role,

          storeName:
            formData.role === "seller"
              ? formData.storeName.trim()
              : "",
        });


      /*
       * Backend response:
       *
       * {
       *   message,
       *   token,
       *   user
       * }
       *
       * Therefore the actual user is
       * result.user.
       */
      const registeredUser =
        result.user;


      /*
       * The real JWT returned by
       * the backend.
       */
      const jwtToken =
        result.token;


      /*
       * Make sure authentication
       * information exists.
       */
      if (
        !registeredUser ||
        !jwtToken
      ) {
        throw new Error(
          "Registration response is missing authentication information."
        );
      }


      /*
       * Backend returns:
       *
       * BUYER
       * SELLER
       *
       * AuthContext uses:
       *
       * buyer
       * seller
       */
      const frontendRole =
        registeredUser.role
          ? registeredUser.role.toLowerCase()
          : formData.role;


      /*
       * Save the REAL backend user
       * and REAL JWT.
       *
       * AuthContext will save both
       * into localStorage.
       */
      login(
        {
          id:
            registeredUser.id,

          firstName:
            registeredUser.firstName,

          lastName:
            registeredUser.lastName,

          email:
            registeredUser.email,

          phone:
            registeredUser.phone,

          role:
            frontendRole,

          storeName:
            registeredUser.storeName || "",

          sellerVerified:
            registeredUser.sellerVerified || false,
        },

        jwtToken
      );


      /*
       * Registration successful.
       *
       * Both buyers and sellers
       * go to the main marketplace.
       */
      navigate("/");


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      setError(
        error.message ||
          "Registration failed. Please check your information and try again."
      );


    } finally {

      setLoading(false);
    }
  };


  return (
    <section className="min-h-screen bg-gray-100 px-4 py-8">

      <div className="max-w-2xl mx-auto">

        {/* Back Button */}

        <div className="mb-5">

          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 font-semibold transition"
          >
            <span className="text-xl">
              ←
            </span>

            Go Back
          </button>

        </div>


        <div className="bg-white rounded-2xl shadow-xl w-full p-8">

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
                  onClick={() =>
                    handleRoleChange("buyer")
                  }
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
                  onClick={() =>
                    handleRoleChange("seller")
                  }
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

                You are registering as{" "}

                <span className="font-semibold text-green-700">
                  {formData.role === "seller"
                    ? "Seller"
                    : "Buyer"}
                </span>.

              </p>

            </div>


            {/* Seller Store Name */}

            {formData.role === "seller" && (
              <div>

                <label
                  htmlFor="storeName"
                  className="block font-semibold mb-2"
                >
                  Store Name
                </label>

                <input
                  id="storeName"
                  type="text"
                  name="storeName"
                  placeholder="Enter your store name"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-4 focus:border-green-600 outline-none"
                  required
                />

                <p className="text-xs text-gray-500 mt-2">
                  This is the name buyers will see when they visit your store.
                </p>

              </div>
            )}


            {/* Password */}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:border-green-600 outline-none"
              required
              minLength={8}
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
              minLength={8}
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

              {loading
                ? "Creating Account..."
                : "Create Account"}

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

      </div>

    </section>
  );
}

export default Register;
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);

  /*
   * Restore the logged-in user and JWT
   * when the application starts.
   */
  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("mandilas-user");

      const savedToken =
        localStorage.getItem("mandilas-token");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedToken) {
        setToken(savedToken);
      }
    } catch (error) {
      console.error(
        "Failed to restore authentication:",
        error
      );

      localStorage.removeItem("mandilas-user");
      localStorage.removeItem("mandilas-token");

      setUser(null);
      setToken(null);
    }

    setLoading(false);
  }, []);

  /*
   * Login and save the real backend user
   * together with the real JWT token.
   */
  const login = (userData, jwtToken) => {
    if (!userData) {
      return;
    }

    const updatedUser = {
      /*
       * IMPORTANT:
       * Use the real database ID.
       * Do NOT use Date.now().
       */
      id: userData.id || null,

      firstName:
        userData.firstName || "",

      lastName:
        userData.lastName || "",

      email:
        userData.email || "",

      phone:
        userData.phone || "",

      avatar:
        userData.avatar || "",

      address:
        userData.address || "",

      joinedDate:
        userData.joinedDate ||
        new Date().toISOString(),

      /*
       * Convert backend SELLER/BUYER
       * to frontend seller/buyer.
       */
      role: userData.role
        ? userData.role.toLowerCase()
        : "buyer",

      /*
       * Preserve the real seller verification
       * status returned by the backend.
       */
      sellerVerified:
        userData.sellerVerified || false,

      /*
       * IMPORTANT:
       * Preserve the seller's store name.
       */
      storeName:
        userData.storeName || "",

      walletBalance:
        userData.walletBalance || 0,
    };

    /*
     * Save user information.
     */
    localStorage.setItem(
      "mandilas-user",
      JSON.stringify(updatedUser)
    );

    /*
     * Save the REAL JWT returned by Railway.
     */
    if (jwtToken) {
      localStorage.setItem(
        "mandilas-token",
        jwtToken
      );
    }

    setUser(updatedUser);

    if (jwtToken) {
      setToken(jwtToken);
    }
  };

  /*
   * Update the currently logged-in user.
   */
  const updateUser = (updatedData) => {
    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      ...updatedData,
    };

    localStorage.setItem(
      "mandilas-user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  /*
   * Logout.
   *
   * Remove BOTH the user information
   * and JWT token.
   */
  const logout = () => {
    localStorage.removeItem(
      "mandilas-user"
    );

    localStorage.removeItem(
      "mandilas-token"
    );

    setUser(null);

    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
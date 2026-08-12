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
   * ==========================================
   * RESTORE LOGIN SESSION
   * ==========================================
   *
   * When the application starts, restore the
   * saved user and JWT from localStorage.
   */
  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("mandilas-user");

      const savedToken =
        localStorage.getItem("mandilas-token");

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);

        /*
         * Make sure the role is always lowercase
         * inside the frontend.
         */
        const restoredUser = {
          ...parsedUser,
          role: parsedUser.role
            ? parsedUser.role.toLowerCase()
            : "buyer",
        };

        setUser(restoredUser);
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
   * ==========================================
   * LOGIN
   * ==========================================
   *
   * Saves the authenticated backend user and
   * JWT token.
   */
  const login = (userData, jwtToken) => {
    if (!userData) {
      return;
    }

    const updatedUser = {
      /*
       * Real database ID.
       */
      id: userData.id || null,

      /*
       * Basic user information.
       */
      firstName:
        userData.firstName || "",

      lastName:
        userData.lastName || "",

      email:
        userData.email || "",

      phone:
        userData.phone || "",

      /*
       * Optional profile information.
       */
      avatar:
        userData.avatar || "",

      address:
        userData.address || "",

      joinedDate:
        userData.joinedDate ||
        new Date().toISOString(),

      /*
       * IMPORTANT:
       *
       * Backend may return:
       * BUYER
       * SELLER
       *
       * Frontend will always use:
       * buyer
       * seller
       */
      role: userData.role
        ? userData.role.toLowerCase()
        : "buyer",

      /*
       * Seller verification status.
       */
      sellerVerified:
        userData.sellerVerified || false,

      /*
       * Seller store name.
       */
      storeName:
        userData.storeName || "",

      /*
       * Wallet balance.
       */
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
     * Save JWT if provided.
     */
    if (jwtToken) {
      localStorage.setItem(
        "mandilas-token",
        jwtToken
      );
    }

    /*
     * Update React state.
     */
    setUser(updatedUser);

    if (jwtToken) {
      setToken(jwtToken);
    }
  };

  /*
   * ==========================================
   * UPDATE USER
   * ==========================================
   *
   * Used when profile information changes.
   */
  const updateUser = (updatedData) => {
    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      ...updatedData,

      /*
       * Always keep role lowercase.
       */
      role: updatedData.role
        ? updatedData.role.toLowerCase()
        : user.role,
    };

    localStorage.setItem(
      "mandilas-user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  /*
   * ==========================================
   * LOGOUT
   * ==========================================
   *
   * Remove the user and JWT completely.
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

  /*
   * ==========================================
   * AUTH CONTEXT
   * ==========================================
   */
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

/*
 * ==========================================
 * USE AUTH HOOK
 * ==========================================
 */
export function useAuth() {
  return useContext(AuthContext);
}
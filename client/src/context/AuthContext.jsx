import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * ==========================================
   * RESTORE LOGIN SESSION
   * ==========================================
   *
   * The logged-in user is stored locally.
   * No JWT is required.
   */
  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("mandilas-user");

      if (savedUser) {
        const parsedUser =
          JSON.parse(savedUser);

        const restoredUser = {
          ...parsedUser,

          role: parsedUser.role
            ? parsedUser.role.toLowerCase()
            : "buyer",
        };

        setUser(restoredUser);
      }

    } catch (error) {
      console.error(
        "Failed to restore user session:",
        error
      );

      localStorage.removeItem(
        "mandilas-user"
      );

      setUser(null);
    }

    setLoading(false);
  }, []);

  /*
   * ==========================================
   * LOGIN
   * ==========================================
   *
   * Saves only the user information.
   *
   * JWT has been removed.
   */
  const login = (userData) => {
    if (!userData) {
      return;
    }

    const updatedUser = {
      id:
        userData.id || null,

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

      role:
        userData.role
          ? userData.role.toLowerCase()
          : "buyer",

      sellerVerified:
        userData.sellerVerified || false,

      storeName:
        userData.storeName || "",

      walletBalance:
        userData.walletBalance || 0,
    };

    localStorage.setItem(
      "mandilas-user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  /*
   * ==========================================
   * UPDATE USER
   * ==========================================
   */
  const updateUser = (updatedData) => {
    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      ...updatedData,

      role:
        updatedData.role
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
   */
  const logout = () => {
    localStorage.removeItem(
      "mandilas-user"
    );

    setUser(null);
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

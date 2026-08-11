import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const savedUser = localStorage.getItem("mandilas-user");


    if (savedUser) {

      setUser(JSON.parse(savedUser));

    }


    setLoading(false);


  }, []);



  const login = (userData) => {


    const updatedUser = {

  id: Date.now(),

  firstName: userData.firstName || "",

  lastName: userData.lastName || "",

  email: userData.email || "",

  phone: userData.phone || "",

  avatar: userData.avatar || "",

  address: userData.address || "",

  joinedDate:
    userData.joinedDate ||
    new Date().toISOString(),

  role: userData.role || "buyer",

  sellerVerified: false,

  storeName: "",

  walletBalance: 0,

};



    localStorage.setItem(
      "mandilas-user",
      JSON.stringify(updatedUser)
    );


    setUser(updatedUser);


  };



  const updateUser = (updatedData) => {


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



  const logout = () => {


    localStorage.removeItem(
      "mandilas-user"
    );


    setUser(null);


  };



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



export function useAuth() {

  return useContext(AuthContext);

}
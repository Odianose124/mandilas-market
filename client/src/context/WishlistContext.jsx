import { createContext, useContext, useEffect, useState } from "react";


const WishlistContext = createContext();



export function WishlistProvider({ children }) {


  const [wishlistItems, setWishlistItems] = useState([]);



  useEffect(() => {


    const savedWishlist = localStorage.getItem(
      "mandilas-wishlist"
    );


    if (savedWishlist) {

      setWishlistItems(
        JSON.parse(savedWishlist)
      );

    }


  }, []);




  const addToWishlist = (product) => {


    const exists = wishlistItems.find(

      (item) => item.id === product.id

    );



    if (exists) {

      return;

    }



    const updatedWishlist = [

      ...wishlistItems,

      product,

    ];



    setWishlistItems(updatedWishlist);



    localStorage.setItem(

      "mandilas-wishlist",

      JSON.stringify(updatedWishlist)

    );


  };

    const removeFromWishlist = (productId) => {


    const updatedWishlist = wishlistItems.filter(

      (item) => item.id !== productId

    );



    setWishlistItems(updatedWishlist);



    localStorage.setItem(

      "mandilas-wishlist",

      JSON.stringify(updatedWishlist)

    );


  };




  const isInWishlist = (productId) => {


    return wishlistItems.some(

      (item) => item.id === productId

    );


  };




  const clearWishlist = () => {


    setWishlistItems([]);



    localStorage.removeItem(

      "mandilas-wishlist"

    );


  };




  return (

    <WishlistContext.Provider

      value={{

        wishlistItems,

        addToWishlist,

        removeFromWishlist,

        isInWishlist,

        clearWishlist,

      }}

    >

      {children}

    </WishlistContext.Provider>

  );


}





export function useWishlist() {


  return useContext(WishlistContext);


}
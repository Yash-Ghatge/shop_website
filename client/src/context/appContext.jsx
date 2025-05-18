import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast, {Toaster} from "react-hot-toast";
const AppContext = createContext();

const AppContextProvider = ({ children }) => {

  const currency = import.meta.VITE_CCURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  //fetch all products
  const fetchProducts = async ()=>{
    setProducts(dummyProducts)
  }

  // add product to cart
  const addToCart =(itemId)=>{
    let cartData =structuredClone(cartItems);
    
    if(cartData[itemId]){
      cartData[itemId] += 1;
    }else{
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart")
  }

  // update cart Item Quantity
  const updateCartItem =(itemId,quantity)=>{
    let cartData =structuredClone(cartItems);
    cartData[itemId]=quantity;
    setCartItems(cartData)
    toast.success("Cart Updated")
  }

  // Remove Product from cart
  const removeFromcart = (itemId) => {
    let cartData =structuredClone(cartItems);
    if(cartData[itemId]){
      cartData[itemId] -= 1;
      if(cartData[itemId]===0){
        delete cartData[itemId];
      }
    }
    toast.success("Removed from cart")
    setCartItems(cartData)
  }


  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems){
      totalCount += cartItems[item];
    }
    return totalCount;
  }

  const getCartAmount = () =>{
    let totalAmount = 0;
    for (const items in cartItems){
      let itemInfo = products.find((product)=>product._id === items);
      if(cartItems[items]>0){
        totalAmount += itemInfo.offerPrice * cartItems[items]
      }
    }
    return Math.floor(totalAmount * 100)/100;
  }

  useEffect(()=>{
    fetchProducts()
  },[])

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromcart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => useContext(AppContext);


export { AppContextProvider, useAppContext };





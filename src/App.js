import React, { useState, useEffect } from "react";
import { commerce } from "./lib/commerce";
import { Products, Navbar, Cart,Checkout } from "./components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

console.log(process.env.REACT_APP_CHEC_PUBLIC_KEY);

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [order,setOrder] = useState({});
 const [errorMessage,setErrorMessage] = useState("");


  const fetchProducts = async () => {
    const { data } = await commerce.products.list();
    setProducts(data);
  };

  const fetchCart = async () => {
    setCart(await commerce.cart.retrieve());
  };

  const handleAddToCart = async (productId, quantity) => {
    const item = await commerce.cart.add(productId, quantity);
    setCart(item.cart);
  };

  const handleUpdateCartQty = async (lineItemId, quantity) => {
    const response = await commerce.cart.update(lineItemId, { quantity });
    setCart(response.cart);
  };

  const handleRemoveFromCart = async (productId) => {
    const item = await commerce.cart.remove(productId);
    setCart(item.cart);
  };

  const handleEmptyCart = async () => {
    const item = await commerce.cart.empty();
    setCart(item.cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  }

  const handleCaptureCheckout = async (checkoutTokenId,newOrder) => {
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId,newOrder);
      setOrder(incomingOrder);
      refreshCart();

    } catch (error) {
      setErrorMessage(error.data.error.message);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);


  
  return (
    <Router>
    <div>
      <Navbar totalItems={cart.total_items} />
      
      <Routes>
        <Route
          exact path="/"
          element={
            <Products products={products} onAddToCart={handleAddToCart} />
          }
        />
        <Route path="/cart" element={<Cart cart = {cart}
           onUpdateCartQty={handleUpdateCartQty} onRemoveFromCart={handleRemoveFromCart} onEmptyCart={handleEmptyCart}/>} />
        <Route exact path = "/checkout" element = {<Checkout cart = {cart}
        order = {order}
        onCaptureCheckout = {handleCaptureCheckout} 
        error = {errorMessage}
        onEmptyCart={handleEmptyCart}/>}/>
      </Routes>   
    </div>
    </Router>
  );
};

export default App;

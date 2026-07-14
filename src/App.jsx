import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { getProducts } from "./api/products";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import EditProduct from "./pages/EditProduct";
import { ToastProvider } from "./components/Toast";

function App() {
   return (

      <>
         <ToastProvider>
            <Navbar />
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/login" element={<Login />} />
               <Route path="/signup" element={<Signup />} />
               <Route path="/cart" element={<Cart />} />
               <Route path="/orders" element={<Orders />} />
               <Route path="/admin/products" element={<AddProduct />} />
               <Route path="/admin/products/:id/edit" element={<EditProduct />} />
            </Routes>
         </ToastProvider>
      </>

   );
}

export default App

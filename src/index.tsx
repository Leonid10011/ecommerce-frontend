import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import { AuthContextProvider } from './context/authContext';
import SignIn from './pages/Login/SignIn';
import RegisterForm from './pages/Register/SignUp';
import ProductList from './pages/Products/Products';
import Cart from './pages/Cart/Cart';
import { ProductProvider } from './context/ProductContext';
import useFavoriteProducts from './hooks/useFavoriteProducts';
import { ApiResponse } from './types/ApiInterfaces';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <ProductProvider>
              <Routes>
                <Route path="/" element={<App/>}>
                  <Route path="/" element={<Start/>}/>
                  <Route path="/signin" element={<SignIn/>}/>
                  <Route path="/signup" element={<RegisterForm/>}/>
                  <Route path="/test" element={<RegisterForm/>} />
                  <Route path='/p' element={<ProductList/>} />
                  <Route path='/cart' element={<Cart/>}/>
                </Route>
              </Routes>  
      </ProductProvider>
    </AuthContextProvider>
  </BrowserRouter>
);


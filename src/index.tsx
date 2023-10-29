import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import Products from './pages/Products/Products';
import { AuthContextProvider } from './context/authContext';
import SignIn from './pages/Login/SignIn';
import RegisterForm from './pages/Register/SignUp';
import ProductList from './pages/Products/P2';
import { DataContextProvider } from './context/dataContext';
import Cart from './pages/Cart/Cart';
import { OrderContextProvider } from './context/orderContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
  <OrderContextProvider>
    <AuthContextProvider>
      <DataContextProvider>
        <Routes>
          <Route path="/" element={<App/>}>
            <Route path="/start" element={<Start/>}/>
            <Route path="/products"element={<Products/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<RegisterForm/>}/>
            <Route path="/test" element={<RegisterForm/>} />
            <Route path='/p' element={<ProductList/>} />
            <Route path='/cart' element={<Cart/>}/>
          </Route>
        </Routes>  
      </DataContextProvider>
    </AuthContextProvider>
  </OrderContextProvider>
  </BrowserRouter>
);


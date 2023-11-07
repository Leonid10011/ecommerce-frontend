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
import { DataContextProvider } from './context/productContext';
import Cart from './pages/Cart/Cart';
import { OrderContextProvider } from './context/orderContext';
import { InitContextProvider } from './context/initContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
  <AuthContextProvider>
    <OrderContextProvider>
        <DataContextProvider>
          <InitContextProvider>
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
          </InitContextProvider>
        </DataContextProvider>
    </OrderContextProvider>
  </AuthContextProvider>
  </BrowserRouter>
);


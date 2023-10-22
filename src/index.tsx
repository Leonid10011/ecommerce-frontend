import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import Product from './components/Product/Product';
import Products from './pages/Products/Products';
import BasicCard from './components/common/BasicCard/BasicCard';
import { AuthContextProvider } from './context/authContext';
import SignIn from './pages/Login/Login';
import SignUp from './pages/Register/Register';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
  <AuthContextProvider>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route path="/start" element={<Start/>}/>
        <Route path="/products"element={<Products/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Route>
    </Routes>
  </AuthContextProvider>
  </BrowserRouter>
);


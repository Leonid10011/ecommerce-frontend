import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Start from './pages/Start';
import Product from './components/Product/Product';
import Products from './pages/Products/Products';
import BasicCard from './components/common/BasicCard/BasicCard';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route path="/start" element={<Start/>}/>
        <Route path="/products"element={<Products/>}/>
      </Route>
    </Routes>
  </BrowserRouter>
);


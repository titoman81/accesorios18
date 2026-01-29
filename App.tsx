
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import Craft from './pages/Craft';
import Diary from './pages/Diary';
import Collections from './pages/Collections';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import History from './pages/History';


const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/oficio" element={<Craft />} />
          <Route path="/diario" element={<Diary />} />
          <Route path="/colecciones" element={<Collections />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/historial" element={<History />} />
        </Routes>

      </div>
    </Router>
  );
};

export default App;

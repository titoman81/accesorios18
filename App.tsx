
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import { ChatBot } from './components/ChatBot';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
        </Routes>
        <ChatBot />
      </div>
    </Router>
  );
};

export default App;

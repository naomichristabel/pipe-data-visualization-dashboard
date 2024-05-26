import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes.js';
import Header from './components/Common/Header.js';

export default function App() {
  return (
    <>
    <Header />
    
    <Router>
      <AppRoutes />
    </Router>
    </>
  );
}

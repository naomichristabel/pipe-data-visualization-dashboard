import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes.js';
import Header from './components/Common/Header.js';

export default function App() {
  return (
    <>
    <Header />
    
    <HashRouter>
      <AppRoutes />
    </HashRouter>
    </>
  );
}

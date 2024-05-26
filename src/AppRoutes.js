import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WorkOrder from './components/WorkOrder/WorkOrder';
import Home from './Home';
import NotFound from './components/Pages/NotFound';

const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/#/work_order" element={<WorkOrder/>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }
  
  export default AppRoutes;
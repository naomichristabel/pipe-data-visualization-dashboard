import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WorkOrder from './components/WorkOrder/WorkOrder';
import Home from './Home';

const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/pipe-data-visualization-dashboard" element={<Home/>} />
        <Route path="/pipe-data-visualization-dashboard/work_order" element={<WorkOrder/>} />
      </Routes>
    );
  }
  
  export default AppRoutes;
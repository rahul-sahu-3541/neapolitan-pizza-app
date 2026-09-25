import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerApp from './features/customer/CustomerApp';
import AdminApp from './features/admin/AdminApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerApp />} />
      <Route path="/admin" element={<AdminApp />} />
    </Routes>
  );
}

export default App;

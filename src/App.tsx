import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import { Mission } from './pages/Mission';
import { Detection } from './pages/Detection';
import { GPR } from './pages/GPR';
import { Analytics } from './pages/Analytics';
import { Login } from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/detection" element={<Detection />} />
          <Route path="/gpr" element={<GPR />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/thermal" element={<Navigate to="/detection" replace />} />
          <Route path="/settings" element={<div className="p-8 text-on-surface-variant">Settings Module Offline</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

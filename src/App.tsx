import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import { Analytics } from './pages/Analytics';
import { Login } from './pages/Login';

import { DroneProvider } from './lib/DroneContext';
import { ThemeProvider } from './lib/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <DroneProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<div className="p-8 text-on-surface-variant">Settings Module Offline</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DroneProvider>
    </ThemeProvider>
  );
}

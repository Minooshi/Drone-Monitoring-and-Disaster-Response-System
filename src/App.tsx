import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { PartnerMap } from './pages/PartnerMap';
import { Alerts } from './pages/Alerts';
import { Analytics } from './pages/Analytics';
import { Login } from './pages/Login';

import { DroneProvider } from './lib/DroneContext';
import { ThemeProvider } from './lib/ThemeContext';

import { Settings } from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <DroneProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/partner-map" element={<PartnerMap />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DroneProvider>
    </ThemeProvider>
  );
}

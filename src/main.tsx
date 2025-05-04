
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root element
const root = createRoot(document.getElementById("root")!)

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Listen for Capacitor device ready event
document.addEventListener('deviceready', () => {
  console.log('Device is ready!');
}, false);

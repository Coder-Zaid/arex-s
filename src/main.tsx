
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wait for the DOM to be loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById("root")!).render(<App />);
});

// Listen for Capacitor device ready event
document.addEventListener('deviceready', () => {
  console.log('Device is ready!');
}, false);

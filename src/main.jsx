import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Only the Bootstrap layers this page uses (reboot, grid, utilities); no component CSS.
// The PrimalOne layer loads after it so brand styles win without !important.
import 'bootstrap/dist/css/bootstrap-reboot.min.css';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';
import './styles/base.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

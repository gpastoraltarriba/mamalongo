// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; 

// Importa el componente AppRouter que define todas tus rutas
// (Login, Boards, BoardView, etc.)
import { AppRouter } from './router'; 

// Renderiza la aplicación en el elemento 'root' del index.html
ReactDOM.createRoot(document.getElementById('root')!).render(
  // React.StrictMode es útil para detectar problemas y buenas prácticas
  <React.StrictMode>
    <AppRouter /> {/* Usa el enrutador como componente principal */}
  </React.StrictMode>
);
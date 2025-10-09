// src/router.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importa las tres vistas que creaste
import Login from './pages/Login';
import Boards from './pages/Boards';
import BoardView from './pages/BoardView';

// Este componente AppRouter es el que importamos en main.tsx
export const AppRouter: React.FC = () => {
  // Nota: Implementación temporal sin protección de ruta.
  // En Semana 2 se añadirá un componente para proteger las rutas.
  
  const isAuthenticated = true; // SIMULACIÓN: Asumimos logueado si no hay error
  
  return (
    <BrowserRouter>
      <Routes>
        
        {/* 1. Ruta de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* 2. Rutas Protegidas (Requieren Login) */}
        {isAuthenticated ? (
          <>
            {/* Ruta principal: Muestra la lista de tableros (Boards.tsx) */}
            <Route path="/" element={<Boards />} />
            
            {/* Ruta para ver un tablero específico (BoardView.tsx) */}
            <Route path="/board/:id" element={<BoardView />} />
            
            {/* Redirección para cualquier ruta desconocida que no sea login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          /* 3. Si no está logueado, redirige al login */
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

      </Routes>
    </BrowserRouter>
  );
};
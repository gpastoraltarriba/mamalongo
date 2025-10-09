// src/pages/Login.tsx
// ESTE CÓDIGO ES TEMPORAL Y SIMULA UN LOGIN EXITOSO.

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Función de Login Simulada
  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login SIMULADO: Navegando al tablero...');
    // Cuando el login simulado se completa, navega a la ruta principal
    navigate('/'); 
  };
  
  return (
    // ESTE ES EL CONTENEDOR PRINCIPAL CON LOS ESTILOS MEJORADOS
    <div style={{ 
      padding: '30px', 
      maxWidth: '400px', 
      margin: '100px auto', 
      backgroundColor: 'white', // Fondo blanco para destacarlo
      borderRadius: '8px', 
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)' // Sombra más profunda
    }}>
      <h2 style={{ textAlign: 'center', color: '#172b4d' }}>Acceso al Tablero (Modo Simulación)</h2>
      
      {/* Botón de Login Simulado (Con estilo mejorado) */}
      <button 
        onClick={handleSimulatedLogin} 
        style={{ 
          width: '100%', 
          padding: '12px', 
          cursor: 'pointer', 
          backgroundColor: '#0079bf', // Color Azul Kanban
          color: 'white', 
          border: 'none', 
          borderRadius: '3px', 
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 1px 0 rgba(0,0,0,0.4)',
          marginBottom: '10px'
        }}
      >
        Iniciar sesión (MODO DESARROLLO)
      </button>

      <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

      {/* Formulario que no hace nada, solo es estético */}
      <form onSubmit={handleSimulatedLogin}>
        <input 
          type="email" 
          placeholder="Correo electrónico (ignorado)" 
          required 
          style={{ width: '95%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input 
          type="password" 
          placeholder="Contraseña (ignorada)" 
          required 
          style={{ width: '95%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button 
          type="submit" 
          style={{ width: '100%', padding: '10px', cursor: 'pointer', backgroundColor: '#5aac44', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px' }}
        >
          Iniciar sesión (Simulado)
        </button>
      </form>
      
    </div>
  );
};

export default Login;
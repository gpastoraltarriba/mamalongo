// src/pages/Boards.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; 

const Boards: React.FC = () => {
  const navigate = useNavigate();
  
  const [boardName, setBoardName] = React.useState('');

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) return;

    // Simulación de navegación a un ID de tablero recién creado
    const newBoardId = Math.random().toString(36).substring(2, 9); 
    
    alert(`Tablero "${boardName}" creado. Navegando a /board/${newBoardId}`);
    navigate(`/board/${newBoardId}`); 
  };
  
  return (
    <> {/* <-- Abre el React Fragment */}
      <Header /> {/* <-- Añade el componente Header */}
      
      <div className="page-container">
        {/* Título y contenido principal de la página */}
        <h1 style={{ color: '#172b4d' }}>Tableros del Equipo</h1>
        
        {/* Formulario para Crear Tablero */}
        <form onSubmit={handleCreateBoard} style={{ 
          marginBottom: '30px', 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(9, 30, 66, 0.25)' 
        }}>
          <h3 style={{ marginTop: 0 }}>Crear un Tablero Nuevo</h3>
          <input 
            type="text"
            placeholder="Nombre del nuevo tablero"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            required
            style={{ padding: '10px', marginRight: '15px', width: '300px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button type="submit" disabled={!boardName.trim()} style={{ padding: '10px 20px', backgroundColor: '#5aac44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Crear
          </button>
        </form>

        {/* Simulación de lista de tableros existentes */}
        <h2>Mis Tableros</h2>
        <p style={{ color: '#5e6c84' }}>Haz clic para ver la vista de tu tablero:</p>
        <button onClick={() => navigate('/board/demo-123')}
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Ver Tablero de Demostración (ID: demo-123)
        </button>

      </div>
    </>
  );
};

export default Boards;
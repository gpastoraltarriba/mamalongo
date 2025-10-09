// src/pages/BoardView.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header'; 

const BoardView: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  
  // Las 3 columnas obligatorias para la Semana 1
  const columns = [
    { id: 'todo', name: '1. Por hacer' },
    { id: 'inprogress', name: '2. En curso' },
    { id: 'done', name: '3. Finalizado' },
  ];

  return (
    <> 
      <Header />
      
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '20px' }}>Tablero: {id}</h1>

        {/* Contenedor principal del tablero Kanban */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          overflowX: 'auto',
          padding: '10px',
          minHeight: '80vh',
          backgroundColor: '#0079bf'
        }}>
          
          {/* Mapea y renderiza las columnas */}
          {columns.map((column) => (
            <div 
              key={column.id} 
              // ¡CAMBIO CLAVE! Agrega la clase para el cursor "grab"
              className="draggable-item" 
              style={{ 
                minWidth: '272px', 
                maxWidth: '272px',
                backgroundColor: '#ebecf0', 
                borderRadius: '8px', 
                padding: '12px 8px', // Estilo mejorado
                height: 'fit-content',
                boxShadow: '0 1px 0 rgba(9,30,66,.25)' 
              }}
            >
              {/* Contenido de la columna */}
              <h3 style={{ margin: '0 0 10px 0', padding: '0 8px', color: '#172b4d', fontSize: '16px' }}>
                  {column.name}
              </h3>
              
              <div style={{ minHeight: '50px' }}>
                  <p style={{ color: '#5e6c84', fontSize: '14px', textAlign: 'center' }}>
                      *Lista vacía*
                  </p>
              </div>

              <button style={{ width: '100%', padding: '8px', marginTop: '10px', backgroundColor: 'transparent', border: 'none', color: '#5e6c84', textAlign: 'left', cursor: 'pointer', fontSize: '14px' }}>
                  + Añadir otra tarjeta
              </button>
            </div>
          ))}
          
        </div>
      </div>
    </> 
  );
};

export default BoardView;
// src/components/Header.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();
    
    // El usuario real se obtendría de Firebase, pero por ahora es simulado
    const user = { name: "Usuario Delta", email: "simulado@nexeus.com" }; 

    const handleLogout = () => {
        // aquí se llamará a Firebase auth.signOut()
        console.log("Logout SIMULADO. Redirigiendo al Login.");
        navigate('/login');
    };

    return (
        <header style={{ 
            backgroundColor: '#172b4d', 
            padding: '10px 30px', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <h2 style={{ margin: 0 }}>Kanban & Timesheets Lite</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '15px', fontSize: '14px' }}>
                    {user.name} ({user.email})
                </span>
                <button 
                    onClick={handleLogout} 
                    style={{ 
                        padding: '8px 15px', 
                        backgroundColor: '#ff5630', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '3px', 
                        cursor: 'pointer' 
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
};

export default Header;
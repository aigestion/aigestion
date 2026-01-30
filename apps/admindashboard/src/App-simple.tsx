import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#00ffff', marginBottom: '20px' }}>ADMIN DASHBOARD</h1>
      <p>Dashboard básico funcionando...</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{
          border: '1px solid #00ffff',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h3>NODOS ACTIVOS</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>142</p>
        </div>
        <div style={{
          border: '1px solid #ff6400',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h3>AUTOMATIZACIONES</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>24</p>
        </div>
        <div style={{
          border: '1px solid #ffd700',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h3>GOOGLE CLOUD</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>ONLINE</p>
        </div>
      </div>
    </div>
  );
};

export default App;

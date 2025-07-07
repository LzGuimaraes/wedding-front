"use client";

import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
      padding: isMobile ? '15px 20px' : '20px 30px',
      borderBottom: '1px solid rgba(236, 72, 153, 0.1)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      position: 'relative',
      backdropFilter: 'blur(10px)',
      zIndex: 1000
    }}>
      {/* Logo/Título */}
      <div style={{ 
        fontSize: isMobile ? '1.5em' : '2em', 
        fontWeight: '700', 
        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        flex: '1',
        letterSpacing: '-0.02em'
      }}>
        <a href="/" style={{ 
          textDecoration: 'none', 
          color: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💕 Nosso Casamento
        </a>
      </div>

      {/* Menu Desktop */}
      {!isMobile && (
        <nav>
          <ul style={{ 
            listStyle: 'none', 
            margin: 0, 
            padding: 0, 
            display: 'flex', 
            gap: '30px',
            alignItems: 'center'
          }}>
            <li>
              <a href="/" style={{ 
                textDecoration: 'none', 
                color: '#374151', 
                fontSize: '1em',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                padding: '10px 16px',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                🏠 Home
              </a>
            </li>
            <li>
              <a href="/confirmar-presenca" style={{ 
                textDecoration: 'none', 
                color: '#374151', 
                fontSize: '1em',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                padding: '10px 16px',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                ✅ Confirmar Presença
              </a>
            </li>
            <li>
              <a href="/presentes" style={{ 
                textDecoration: 'none', 
                color: '#374151', 
                fontSize: '1em',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                padding: '10px 16px',
                borderRadius: '25px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(236, 72, 153, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                🎁 Lista de Presentes
              </a>
            </li>
          </ul>
        </nav>
      )}

      {/* Botão do Menu Mobile */}
      {isMobile && (
        <button
          onClick={toggleMenu}
          style={{
            background: isMenuOpen 
              ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
              : 'rgba(236, 72, 153, 0.1)',
            border: 'none',
            fontSize: '1.5em',
            color: isMenuOpen ? 'white' : '#ec4899',
            cursor: 'pointer',
            padding: '12px 15px',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            boxShadow: isMenuOpen 
              ? '0 4px 15px rgba(236, 72, 153, 0.3)'
              : '0 2px 8px rgba(236, 72, 153, 0.1)'
          }}
          onMouseEnter={(e) => {
            if (!isMenuOpen) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'scale(1.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isMenuOpen) {
              e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
              e.currentTarget.style.color = '#ec4899';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          ☰
        </button>
      )}

      {/* Menu Mobile */}
      {isMobile && isMenuOpen && (
        <nav style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          zIndex: 999,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(236, 72, 153, 0.1)',
          borderTop: 'none',
          animation: 'slideDown 0.3s ease-out'
        }}>
          <ul style={{ 
            listStyle: 'none', 
            margin: 0, 
            padding: '20px 0', 
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
          }}>
            <li>
              <a 
                href="/" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#374151', 
                  fontSize: '1.1em',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '15px 25px',
                  margin: '0 10px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
                  e.currentTarget.style.transform = 'translateX(10px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.2em' }}>🏠</span>
                Home
              </a>
            </li>
            <li>
              <a 
                href="/confirmar-presenca" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#374151', 
                  fontSize: '1.1em',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '15px 25px',
                  margin: '0 10px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
                  e.currentTarget.style.transform = 'translateX(10px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.2em' }}>✅</span>
                Confirmar Presença
              </a>
            </li>
            <li>
              <a 
                href="/presentes" 
                style={{ 
                  textDecoration: 'none', 
                  color: '#374151', 
                  fontSize: '1.1em',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '15px 25px',
                  margin: '0 10px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
                  e.currentTarget.style.transform = 'translateX(10px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <span style={{ fontSize: '1.2em' }}>🎁</span>
                Lista de Presentes
              </a>
            </li>
          </ul>
        </nav>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}
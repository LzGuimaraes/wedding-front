"use client";

import Link from 'next/link';
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
      backgroundColor: 'var(--color-white)',
      padding: isMobile ? '10px 15px' : '15px 20px',
      borderBottom: '1px solid var(--color-light-gray)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'inherit',
      position: 'relative'
    }}>
      {/* Logo/Título */}
      <div style={{ 
        fontSize: isMobile ? '1.3em' : '1.8em', 
        fontWeight: 'bold', 
        color: 'var(--color-deep-rose)',
        flex: '1'
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Nosso Casamento
        </Link>
      </div>

      {/* Menu Desktop */}
      {!isMobile && (
        <nav>
          <ul style={{ 
            listStyle: 'none', 
            margin: 0, 
            padding: 0, 
            display: 'flex', 
            gap: '25px',
            alignItems: 'center'
          }}>
            <li>
              <Link href="/" style={{ 
                textDecoration: 'none', 
                color: 'var(--color-deep-rose)', 
                fontSize: '1.1em',
                whiteSpace: 'nowrap'
              }}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/confirmar-presenca" style={{ 
                textDecoration: 'none', 
                color: 'var(--color-deep-rose)', 
                fontSize: '1.1em',
                whiteSpace: 'nowrap'
              }}>
                Confirmar Presença
              </Link>
            </li>
            <li>
              <Link href="/presentes" style={{ 
                textDecoration: 'none', 
                color: 'var(--color-deep-rose)', 
                fontSize: '1.1em',
                whiteSpace: 'nowrap'
              }}>
                Lista de Presentes
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* Botão do Menu Mobile */}
      {isMobile && (
        <button
          onClick={toggleMenu}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5em',
            color: 'var(--color-deep-rose)',
            cursor: 'pointer',
            padding: '5px'
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
          backgroundColor: 'var(--color-white)',
          borderBottom: '1px solid var(--color-light-gray)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <ul style={{ 
            listStyle: 'none', 
            margin: 0, 
            padding: '10px 0', 
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}>
            <li>
              <Link 
                href="/" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--color-deep-rose)', 
                  fontSize: '1.1em',
                  display: 'block',
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--color-light-gray)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/confirmar-presenca" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--color-deep-rose)', 
                  fontSize: '1.1em',
                  display: 'block',
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--color-light-gray)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Confirmar Presença
              </Link>
            </li>
            <li>
              <Link 
                href="/presentes" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--color-deep-rose)', 
                  fontSize: '1.1em',
                  display: 'block',
                  padding: '12px 20px'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Lista de Presentes
              </Link>
            </li>
          </ul>
        </nav>
      )}

    </header>
  );
}
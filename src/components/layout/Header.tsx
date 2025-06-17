// your-wedding-frontend/src/components/layout/Header.tsx

import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      backgroundColor: 'var(--color-white)',
      padding: '20px 40px',
      borderBottom: '1px solid var(--color-light-gray)', // Borda cinza claro
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'inherit' // Herda a fonte do body
    }}>
      <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: 'var(--color-deep-rose)' }}> {/* Título em tom de rosa mais escuro */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Nosso Casamento
        </Link>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '25px' }}>
          <li>
            <Link href="/" style={{ textDecoration: 'none', color: 'var(--color-deep-rose)', fontSize: '1.1em' }}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/confirmar-presenca" style={{ textDecoration: 'none', color: 'var(--color-deep-rose)', fontSize: '1.1em' }}>
              Confirmar Presença
            </Link>
          </li>
          <li>
            <Link href="/presentes" style={{ textDecoration: 'none', color: 'var(--color-deep-rose)', fontSize: '1.1em' }}>
              Lista de Presentes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
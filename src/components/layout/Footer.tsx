// your-wedding-frontend/src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)',
        padding: '40px 30px',
        borderTop: '1px solid rgba(236, 72, 153, 0.1)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        marginTop: '50px',
        backdropFilter: 'blur(10px)',
        position: 'relative'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Logo/Título Principal */}
        <div style={{ 
          fontSize: '1.8em', 
          fontWeight: '700', 
          background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px',
          letterSpacing: '-0.02em'
        }}>
          💕 Vitória & André Luiz
        </div>

        {/* Divider */}
        <div style={{
          width: '80px',
          height: '2px',
          background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
          margin: '0 auto 25px auto',
          borderRadius: '2px'
        }}></div>

        {/* Submensagem */}
        <p style={{
          color: '#6b7280',
          fontSize: '0.95em',
          margin: '0 0 30px 0',
          lineHeight: '1.5',
          fontWeight: '400'
        }}>
          Feito com carinho para o nosso grande dia! 💖
        </p>

        {/* Decoração com corações */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          fontSize: '1.5em',
          marginBottom: '25px',
          opacity: '0.7'
        }}>
          <span style={{
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '0s'
          }}>💖</span>
          <span style={{
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '0.3s'
          }}>✨</span>
          <span style={{
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: '0.6s'
          }}>💕</span>
        </div>
      </div>
      </footer>
  );
}

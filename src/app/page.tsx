"use client";

import { useState, useEffect } from 'react';

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  eventPassed?: boolean;
}

interface FloralParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  animationDuration: number;
  type: 'flower' | 'petal' | 'leaf';
  color: string;
}

export default function HomePage() {
  const weddingDate = new Date('2025-09-13T00:00:00');
  const [isClient, setIsClient] = useState(false);
  const [floralParticles, setFloralParticles] = useState<FloralParticle[]>([]);

  const calculateTimeLeft = (): TimeLeft => {
    if (!isClient) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const difference = +weddingDate - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, eventPassed: true };
    }
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  // Gerar partículas florais
  useEffect(() => {
    const generateFloralParticles = () => {
      const particles: FloralParticle[] = [];
      const colors = ['#ffb3ba', '#ffdfba', '#bae1ff', '#baffc9', '#ffffba', '#e6ccff'];
      const types: ('flower' | 'petal' | 'leaf')[] = ['flower', 'petal', 'leaf'];
      
      for (let i = 0; i < 25; i++) {
        particles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 15 + 8,
          rotation: Math.random() * 360,
          animationDuration: Math.random() * 10 + 8,
          type: types[Math.floor(Math.random() * types.length)],
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setFloralParticles(particles);
    };

    generateFloralParticles();
  }, []);

  useEffect(() => {
    setIsClient(true);
    if (isClient) {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isClient, timeLeft]);

  const formatTime = (time: number | undefined) => String(time ?? 0).padStart(2, '0');

  const FloralParticle = ({ particle }: { particle: FloralParticle }) => {
    const getParticleShape = (type: string) => {
      switch (type) {
        case 'flower':
          return '🌸';
        case 'petal':
          return '🌺';
        case 'leaf':
          return '🍃';
        default:
          return '🌸';
      }
    };

    return (
      <div
        className="floral-particle"
        style={{
          position: 'absolute',
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          fontSize: `${particle.size}px`,
          color: particle.color,
          transform: `rotate(${particle.rotation}deg)`,
          animation: `floralFloat ${particle.animationDuration}s ease-in-out infinite alternate`,
          zIndex: -1,
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        {getParticleShape(particle.type)}
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        @keyframes floralFloat {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-20px) rotate(360deg);
            opacity: 0.7;
          }
        }

        @keyframes petalFall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .btn {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 25px;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 154, 158, 0.3);
          border: none;
          cursor: pointer;
          font-size: 1.1em;
        }

        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(255, 154, 158, 0.4);
          background: linear-gradient(135deg, #ff8a8e 0%, #fdc4df 100%);
        }

        .home-content {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.9);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .floral-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -2;
          pointer-events: none;
        }

        .falling-petals {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .falling-petal {
          position: absolute;
          font-size: 20px;
          animation: petalFall 8s linear infinite;
          opacity: 0;
        }

        .falling-petal:nth-child(1) { left: 10%; animation-delay: 0s; }
        .falling-petal:nth-child(2) { left: 20%; animation-delay: 1s; }
        .falling-petal:nth-child(3) { left: 30%; animation-delay: 2s; }
        .falling-petal:nth-child(4) { left: 40%; animation-delay: 3s; }
        .falling-petal:nth-child(5) { left: 50%; animation-delay: 4s; }
        .falling-petal:nth-child(6) { left: 60%; animation-delay: 5s; }
        .falling-petal:nth-child(7) { left: 70%; animation-delay: 6s; }
        .falling-petal:nth-child(8) { left: 80%; animation-delay: 7s; }
        .falling-petal:nth-child(9) { left: 90%; animation-delay: 8s; }

        /* Responsividade do contador */
        .countdown-container {
          display: flex;
          gap: 20px;
          margin: 30px 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 20px;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          flex-wrap: nowrap;
          overflow: hidden;
        }

        .countdown-item {
          flex: 1;
          min-width: 0;
          text-align: center;
        }

        .countdown-number {
          color: #dc3545;
          font-size: 3em;
          margin: 0;
          line-height: 1;
          font-weight: bold;
          white-space: nowrap;
        }

        .countdown-label {
          color: #6c757d;
          font-size: 1em;
          margin: 5px 0 0 0;
          white-space: nowrap;
        }

        /* Responsividade para telas pequenas */
        @media (max-width: 768px) {
          .countdown-container {
            gap: 10px;
            padding: 20px 10px;
          }
          
          .countdown-number {
            font-size: 2em;
          }
          
          .countdown-label {
            font-size: 0.8em;
          }
        }

        @media (max-width: 480px) {
          .countdown-container {
            gap: 8px;
            padding: 15px 8px;
          }
          
          .countdown-number {
            font-size: 1.5em;
          }
          
          .countdown-label {
            font-size: 0.7em;
          }
        }

        @media (max-width: 380px) {
          .countdown-container {
            gap: 5px;
            padding: 12px 5px;
          }
          
          .countdown-number {
            font-size: 1.2em;
          }
          
          .countdown-label {
            font-size: 0.6em;
          }
        }
      `}</style>

      <div className="floral-background">
        {/* Flores flutuantes de fundo */}
        {floralParticles.map((particle) => (
          <FloralParticle key={particle.id} particle={particle} />
        ))}
        
        {/* Pétalas caindo */}
        <div className="falling-petals">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="falling-petal">🌸</div>
          ))}
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        padding: '50px 20px',
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'inherit',
        background: 'linear-gradient(135deg, #ffeef8 0%, #fff5f5 100%)',
        position: 'relative'
      }}>
        <div className="home-content">
          <h1 style={{ 
            color: '#d63384', 
            fontSize: '2.5em', 
            marginBottom: '20px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            💐 Nosso Grande Dia Está Chegando! 💐
          </h1>

          <p style={{ 
            color: '#6c757d', 
            fontSize: '1.2em', 
            maxWidth: '700px', 
            lineHeight: '1.6em',
            margin: '0 auto 30px'
          }}>
            Estamos muito felizes em compartilhar esse momento tão especial com vocês! Contamos com sua presença.
          </p>

          {timeLeft.eventPassed ? (
            <h2 style={{ color: '#dc3545', fontSize: '2em', marginTop: '30px' }}>
              🎉 O grande dia chegou! 🎉
            </h2>
          ) : (
            <div className="countdown-container">
              {["Dias", "Horas", "Minutos", "Segundos"].map((label, index) => {
                const value = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][index];
                return (
                  <div key={label} className="countdown-item">
                    <h2 className="countdown-number">{formatTime(value)}</h2>
                    <p className="countdown-label">{label}</p>
                  </div>
                );
              })}
            </div>
          )}

          <nav>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn" 
                onClick={() => window.open('/confirmar-presenca', '_self')}
              >
                💐 Confirmar Presença
              </button>
              <button 
                className="btn" 
                onClick={() => window.open('/presentes', '_self')}
              >
                🎁 Lista de Presentes
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
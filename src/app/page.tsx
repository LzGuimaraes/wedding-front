// your-wedding-frontend/src/app/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// 1. Crie uma interface para o objeto de tempo restante
interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  eventPassed?: boolean;
}

export default function HomePage() {
  const weddingDate = new Date('2025-09-13T00:00:00'); 

  const [isClient, setIsClient] = useState(false);

  const calculateTimeLeft = (): TimeLeft => { // 2. Garanta que a função sempre retorne o tipo TimeLeft
    if (!isClient) {
        // Retorna um objeto com valores padrão que correspondem à interface
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }; 
    }

    const difference = +weddingDate - +new Date();
    let timeLeft: TimeLeft = {}; // Tipagem local para garantir conformidade

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        eventPassed: true
      };
    }
    return timeLeft;
  };

  // 3. Tipar explicitamente o useState com a interface TimeLeft
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    setIsClient(true); 

    // O timer só deve ser configurado uma vez após o componente ser montado e ser cliente
    // E ser limpo ao desmontar ou se o evento já passou
    if (isClient) { 
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Limpeza do temporizador
        return () => clearTimeout(timer);
    }
  }, [isClient, timeLeft]); // isClient como dependência inicial, timeLeft para re-executar

  // 4. Melhorar a verificação de `undefined` para `formatTime`
  const formatTime = (time: number | undefined) => String(time ?? 0).padStart(2, '0'); // Usar nullish coalescing (??)

  // Renderiza um placeholder ou nada até que o componente seja hidratado no cliente
  if (!isClient) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '50px 20px',
        minHeight: 'calc(100vh - 160px)', // Ajustado para header e footer
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'inherit'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderRadius: '15px',
          padding: '40px 30px',
          maxWidth: '800px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)'
        }}>
          <h1 style={{ 
            color: 'var(--color-deep-rose)', 
            fontSize: '2.5em', 
            marginBottom: '20px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}> 
            Nosso Grande Dia Está Chegando!
          </h1>
          <p style={{ 
            color: 'var(--color-dark-gray)', 
            fontSize: '1.2em', 
            maxWidth: '700px', 
            lineHeight: '1.6em',
            margin: '0 auto 30px'
          }}> 
            Carregando contagem regressiva...
          </p>
          
          <nav>
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link 
                href="/confirmar-presenca" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--color-pink-deep)', 
                  fontSize: '1.1em', 
                  padding: '12px 20px', 
                  border: '2px solid var(--color-gold-soft)', 
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  minWidth: '160px',
                  textAlign: 'center',
                  display: 'inline-block'
                }}
              >
                Confirmar Presença
              </Link>
              <Link 
                href="/presentes" 
                style={{ 
                  textDecoration: 'none', 
                  color: 'var(--color-pink-deep)', 
                  fontSize: '1.1em', 
                  padding: '12px 20px', 
                  border: '2px solid var(--color-gold-soft)', 
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  minWidth: '160px',
                  textAlign: 'center',
                  display: 'inline-block'
                }}
              >
                Lista de Presentes
              </Link>
            </div>
          </nav>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '50px 20px',
      minHeight: 'calc(100vh - 160px)', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'inherit'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderRadius: '15px',
        padding: '40px 30px',
        maxWidth: '800px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{ 
          color: 'var(--color-deep-rose)', 
          fontSize: '2.5em', 
          marginBottom: '20px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}> 
          Nosso Grande Dia Está Chegando!
        </h1>
        
        <p style={{ 
          color: 'var(--color-dark-gray)', 
          fontSize: '1.2em', 
          maxWidth: '700px', 
          lineHeight: '1.6em',
          margin: '0 auto 30px'
        }}> 
          Estamos muito felizes em compartilhar esse momento tão especial com vocês! Contamos com sua presença.
        </p>

        {timeLeft.eventPassed ? (
          <h2 style={{ 
            color: 'var(--color-pink-deep)', 
            fontSize: '2em', 
            marginTop: '30px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}> 
            O grande dia chegou!
          </h2>
        ) : (
          <div style={{
            display: 'flex',
            gap: '20px',
            marginTop: '30px',
            marginBottom: '30px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1), 0 0 0 1px rgba(255, 255, 255, 0.3)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div style={{ minWidth: '80px' }}>
              <h2 style={{ 
                color: 'var(--color-pink-deep)', 
                fontSize: '3em', 
                margin: 0,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                {formatTime(timeLeft.days)}
              </h2>
              <p style={{ color: 'var(--color-dark-gray)', fontSize: '1em', margin: 0 }}>Dias</p>
            </div>
            <div style={{ minWidth: '80px' }}>
              <h2 style={{ 
                color: 'var(--color-pink-deep)', 
                fontSize: '3em', 
                margin: 0,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                {formatTime(timeLeft.hours)}
              </h2>
              <p style={{ color: 'var(--color-dark-gray)', fontSize: '1em', margin: 0 }}>Horas</p>
            </div>
            <div style={{ minWidth: '80px' }}>
              <h2 style={{ 
                color: 'var(--color-pink-deep)', 
                fontSize: '3em', 
                margin: 0,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                {formatTime(timeLeft.minutes)}
              </h2>
              <p style={{ color: 'var(--color-dark-gray)', fontSize: '1em', margin: 0 }}>Minutos</p>
            </div>
            <div style={{ minWidth: '80px' }}>
              <h2 style={{ 
                color: 'var(--color-pink-deep)', 
                fontSize: '3em', 
                margin: 0,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                {formatTime(timeLeft.seconds)}
              </h2>
              <p style={{ color: 'var(--color-dark-gray)', fontSize: '1em', margin: 0 }}>Segundos</p>
            </div>
          </div>
        )}
        
        <nav>
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              href="/confirmar-presenca" 
              className="btn"
              style={{ 
                textDecoration: 'none', 
                color: 'var(--color-pink-deep)', 
                fontSize: '1.1em', 
                padding: '12px 20px', 
                border: '2px solid var(--color-gold-soft)', 
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                minWidth: '160px',
                textAlign: 'center',
                display: 'inline-block'
              }}
            >
              Confirmar Presença
            </Link>
            <Link 
              href="/presentes" 
              className="btn"
              style={{ 
                textDecoration: 'none', 
                color: 'var(--color-pink-deep)', 
                fontSize: '1.1em', 
                padding: '12px 20px', 
                border: '2px solid var(--color-gold-soft)', 
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                minWidth: '160px',
                textAlign: 'center',
                display: 'inline-block'
              }}
            >
              Lista de Presentes
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
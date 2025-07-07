// page.tsx com efeitos florais

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
      <div className="home-content">
        <div className="flower" style={{ top: '10px', left: '30px' }}></div>
        <div className="flower" style={{ top: '80px', right: '50px' }}></div>
        <div className="flower" style={{ bottom: '40px', left: '70px' }}></div>

        <h1 style={{ 
          color: 'var(--color-deep-rose)', 
          fontSize: '2.5em', 
          marginBottom: '20px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>Nosso Grande Dia Está Chegando!</h1>

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
          <h2 style={{ color: 'var(--color-pink-deep)', fontSize: '2em', marginTop: '30px' }}>
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
            padding: '30px',
            borderRadius: '10px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {["Dias", "Horas", "Minutos", "Segundos"].map((label, index) => {
              const value = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][index];
              return (
                <div key={label} style={{ minWidth: '80px' }}>
                  <h2 style={{ color: 'var(--color-pink-deep)', fontSize: '3em', margin: 0 }}>{formatTime(value)}</h2>
                  <p style={{ color: 'var(--color-dark-gray)', fontSize: '1em', margin: 0 }}>{label}</p>
                </div>
              );
            })}
          </div>
        )}

        <nav>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/confirmar-presenca" className="btn">Confirmar Presença</Link>
            <Link href="/presentes" className="btn">Lista de Presentes</Link>
          </div>
        </nav>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const background =
    theme === 'dark'
      ? 'linear-gradient(120deg, #181c2f 60%, #3a3f5a 100%)' // midnight palette
      : 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)'; // lightest blue

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background,
        transition: 'background 0.5s',
      }}
    >
      <img
        src={'/arex-logo-1.png'}
        alt="AREX Logo"
        style={{
          width: 160,
          height: 160,
          marginBottom: 24,
          animation: 'bounceIn 1.2s cubic-bezier(.68,-0.55,.27,1.55)',
        }}
      />
      <div
        style={{
          fontWeight: 700,
          fontSize: 'clamp(1.2rem, 6vw, 2rem)',
          color: theme === 'dark' ? '#000' : '#0a2240',
          marginBottom: 16,
          letterSpacing: 0.5,
          textAlign: 'center',
          padding: '0 1rem',
          lineHeight: 1.3,
          width: '100%',
          maxWidth: 400
        }}
      >
        Experience Smart Shop, Arex.
      </div>
      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
} 
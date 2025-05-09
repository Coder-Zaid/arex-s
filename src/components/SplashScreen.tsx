import React, { useEffect } from 'react';

const splashColors = {
  background: 'linear-gradient(180deg, #F24B4B 0%, #B36AE2 100%)', // red to purple
};

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: splashColors.background,
        transition: 'background 0.5s',
      }}
    >
      <img
        src={'/arex-bag.png'}
        alt="AREX Bag Logo"
        style={{
          width: 120,
          height: 120,
          marginBottom: 24,
          animation: 'bounceIn 1.2s cubic-bezier(.68,-0.55,.27,1.55)',
        }}
      />
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
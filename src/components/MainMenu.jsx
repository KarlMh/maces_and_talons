import { PLAYERS } from '../game/constants.js';

export default function MainMenu({ onStartGame }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f0804 0%, #1a1208 50%, #0f0804 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{ 
        position: 'fixed', 
        inset: 0, 
        pointerEvents: 'none', 
        background: 'radial-gradient(ellipse at 50% 30%, rgba(196,146,42,0.1), transparent 70%),radial-gradient(ellipse at 80% 20%, rgba(100,180,255,0.05), transparent 60%)',
        zIndex: 0,
      }}/>

      <div style={{ 
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
        maxWidth: 500,
        animation: 'fade-in 0.8s ease-out forwards',
      }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '1rem',
            color: '#c4922a',
            letterSpacing: '0.2em',
            marginBottom: 8,
            fontFamily: "'Cinzel Decorative', serif",
            textTransform: 'uppercase',
          }}>
            ⚔️ Welcome to ⚔️
          </div>
          <h1 style={{ 
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '3.5rem',
            fontWeight: 700,
            color: '#e8c060',
            textShadow: '0 0 20px rgba(232,192,96,0.6), 2px 2px 8px rgba(0,0,0,0.9)',
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: '0.1em',
          }}>
            MACES<br/>&amp; TALONS
          </h1>
          <div style={{ 
            fontFamily: "'IM Fell English', serif",
            fontSize: '1.1rem',
            color: '#a08a70',
            marginTop: 12,
            fontStyle: 'italic',
            letterSpacing: '0.15em',
          }}>
            of Berk
          </div>
          
          {/* Decorative line */}
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 20,
            justifyContent: 'center',
          }}>
            <div style={{ width: 30, height: 2, background: 'linear-gradient(90deg, transparent, #c4922a, transparent)' }}/>
            <span style={{ color: '#c4922a', opacity: 0.7 }}>┃</span>
            <div style={{ width: 30, height: 2, background: 'linear-gradient(90deg, transparent, #c4922a, transparent)' }}/>
          </div>
        </div>

        {/* Subtitle/Description */}
        <div style={{ 
          textAlign: 'center',
          color: '#c8a870',
          fontFamily: "'IM Fell English', serif",
          fontSize: '0.95rem',
          lineHeight: 1.6,
          maxWidth: 420,
        }}>
          <p>
            A strategic medieval battle on the high seas. 
            Command your warriors, seize the mace, and claim victory!
          </p>
        </div>

        {/* Buttons */}
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          width: '100%',
          maxWidth: 300,
        }}>
          {/* PvP Button */}
          <button
            onClick={() => onStartGame({ mode: 'pvp' })}
            style={{
              padding: '16px 24px',
              background: 'linear-gradient(180deg, #8b6914 0%, #5a3d10 100%)',
              border: '2px solid #3a2800',
              borderRadius: 8,
              color: '#e8c060',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              boxShadow: '0 6px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)';
              e.target.style.background = 'linear-gradient(180deg, #a07a1a 0%, #6b4a18 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)';
              e.target.style.background = 'linear-gradient(180deg, #8b6914 0%, #5a3d10 100%)';
            }}
          >
            ⚔️ Player vs Player
          </button>

          {/* AI Button */}
          <button
            onClick={() => onStartGame({ mode: 'ai', playerSide: PLAYERS.VIKING })}
            style={{
              padding: '16px 24px',
              background: 'linear-gradient(180deg, #4a7fa5 0%, #2a4f7a 100%)',
              border: '2px solid #1a2f5a',
              borderRadius: 8,
              color: '#80c0ff',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              boxShadow: '0 6px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)';
              e.target.style.background = 'linear-gradient(180deg, #5a8fb5 0%, #3a5f8a 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)';
              e.target.style.background = 'linear-gradient(180deg, #4a7fa5 0%, #2a4f7a 100%)';
            }}
          >
            🐉 vs Dragon
          </button>

          {/* vs Marauders AI */}
          <button
            onClick={() => onStartGame({ mode: 'ai', playerSide: PLAYERS.VIKING, opponent: PLAYERS.MARAUDER })}
            style={{
              padding: '16px 24px',
              background: 'linear-gradient(180deg, #8b2020 0%, #5a0000 100%)',
              border: '2px solid #3a0000',
              borderRadius: 8,
              color: '#ff9090',
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              boxShadow: '0 6px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)';
              e.target.style.background = 'linear-gradient(180deg, #9b3a3a 0%, #6a1a1a 100%)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)';
              e.target.style.background = 'linear-gradient(180deg, #8b2020 0%, #5a0000 100%)';
            }}
          >
            🗡️ vs Marauders
          </button>
        </div>

        {/* Footer decorations */}
        <div style={{ 
          textAlign: 'center',
          color: '#c4922a',
          fontSize: '0.9rem',
          letterSpacing: '0.3em',
          opacity: 0.6,
          marginTop: 20,
        }}>
          ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ
        </div>
      </div>
    </div>
  );
}

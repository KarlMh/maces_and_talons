import { PLAYERS } from '../game/constants.js';

export default function TopBar({ state, playerSide, isAIThinking }) {
  const { currentPlayer, gamePhase, winner, pieces } = state;
  const isVikingTurn = currentPlayer === PLAYERS.VIKING;
  
  // Count pieces
  const vikingCount = pieces.filter(p => p.player === PLAYERS.VIKING && !p.isMaceObject).length;
  const marauderCount = pieces.filter(p => p.player === PLAYERS.MARAUDER && !p.isMaceObject).length;
  
  // Get phase display
  const phaseText = gamePhase === 'SHIP_PLACEMENT' ? 'SHIP PLACEMENT' : 'PLAYING';

  return (
    <div style={{ 
      width: '100%', 
      background: 'linear-gradient(180deg, rgba(26,24,16,0.95) 0%, rgba(10,8,4,0.98) 100%)',
      border: '2px solid #5a4a3a',
      borderBottom: '3px solid #c4922a',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
      position: 'relative',
      zIndex: 50,
    }}>
      {/* Left side - Phase */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ 
          fontFamily: "'Cinzel Decorative', serif", 
          fontSize: '0.65rem',
          color: '#c4922a',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
        }}>
          ⚔️ {phaseText}
        </div>
        <div style={{ 
          width: 1, 
          height: 24, 
          background: 'linear-gradient(180deg, transparent, #c4922a, transparent)',
          opacity: 0.5,
        }}/>
        <div style={{ 
          color: '#c8a870', 
          fontSize: '0.7rem',
          fontFamily: "'IM Fell English', serif",
        }}>
          {gamePhase === 'PLAYING' 
            ? `Turn ${Math.floor((pieces.length - 9) / 2) + 1}`
            : 'Setup Phase'
          }
        </div>
      </div>

      {/* Center - Current player/status */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12,
        textAlign: 'center',
      }}>
        {winner ? (
          <div style={{ 
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '1rem',
            color: isVikingTurn ? '#80c0ff' : '#ff8080',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
          }}>
            🏆 {winner} WINS!
          </div>
        ) : isAIThinking ? (
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Cinzel Decorative', serif",
            color: '#8ab8e6',
          }}>
            <span style={{ fontSize: '1.2rem' }}>🐉</span>
            <span style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>Thinking...</span>
          </div>
        ) : (
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: '1.4rem' }}>
              {isVikingTurn ? '⚔️' : '🗡️'}
            </span>
            <div>
              <div style={{ 
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '0.85rem',
                color: isVikingTurn ? '#80c0ff' : '#ff8080',
                fontWeight: 'bold',
              }}>
                {isVikingTurn ? 'VIKINGS' : 'MARAUDERS'}
              </div>
              <div style={{ 
                fontSize: '0.6rem',
                color: '#806040',
                fontStyle: 'italic',
              }}>
                {currentPlayer === playerSide ? 'Your Move' : 'Enemy Move'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right side - Unit counts */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 16,
        fontFamily: "'IM Fell English', serif",
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: '#80c0ff',
        }}>
          <span style={{ fontSize: '0.9rem' }}>⚔️</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{vikingCount}</span>
        </div>
        <div style={{ 
          width: 1, 
          height: 20, 
          background: 'linear-gradient(180deg, transparent, #c4922a, transparent)',
          opacity: 0.5,
        }}/>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: '#ff8080',
        }}>
          <span style={{ fontSize: '0.9rem' }}>🗡️</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{marauderCount}</span>
        </div>
      </div>
    </div>
  );
}

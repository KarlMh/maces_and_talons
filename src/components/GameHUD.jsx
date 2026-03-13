import { PLAYERS } from '../game/constants.js';

function WoodDivider() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 8, 
      margin: '12px 0',
    }}>
      <div style={{ 
        flex: 1, 
        height: '2px', 
        background: 'linear-gradient(90deg, transparent, rgba(196,146,42,0.6), transparent)',
        borderRadius: '1px',
      }}/>
      <span style={{ 
        color: '#c4922a', 
        fontSize: 12, 
        fontFamily: 'serif',
        opacity: 0.8,
      }}>✦</span>
      <div style={{ 
        flex: 1, 
        height: '2px', 
        background: 'linear-gradient(90deg, transparent, rgba(196,146,42,0.6), transparent)',
        borderRadius: '1px',
      }}/>
    </div>
  );
}

function ScrollPanel({ title, children, icon }) {
  return (
    <div style={{ 
      position: 'relative', 
      borderRadius: 6, 
      background: 'linear-gradient(180deg, #2a1a08 0%, #1e1208 100%)', 
      border: '2px solid #5a3d1a',
      padding: '14px', 
      boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.5)',
      animation: 'fade-in 0.4s ease-out forwards',
    }}>
      <div style={{ 
        position: 'absolute', 
        top: -5, 
        left: 12, 
        right: 12, 
        height: 10, 
        background: 'linear-gradient(90deg, #7a5230 0%, #c4922a 50%, #7a5230 100%)',
        borderRadius: '4px 4px 0 0',
      }}/>
      {title && (
        <div style={{ 
          fontSize: '0.7rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.15em', 
          marginBottom: 10, 
          textAlign: 'center', 
          color: '#c4922a', 
          fontFamily: "'Cinzel Decorative', serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          {icon && <span style={{ fontSize: '0.8rem' }}>{icon}</span>}
          {title}
        </div>
      )}
      {children}
      <div style={{ 
        position: 'absolute', 
        bottom: -5, 
        left: 12, 
        right: 12, 
        height: 10, 
        background: 'linear-gradient(90deg, #7a5230 0%, #c4922a 50%, #7a5230 100%)',
        borderRadius: '0 0 4px 4px',
      }}/>
    </div>
  );
}

export default function GameHUD({ state, playerSide, isAIThinking, onReset, onHelp, onTriggerTraitor, onDeclineTraitor }) {
  const { currentPlayer, gamePhase, winner, log, pieces } = state;

  const vikingPieces = pieces.filter(p => p.player === PLAYERS.VIKING && !p.isMaceObject).length;
  const marauderPieces = pieces.filter(p => p.player === PLAYERS.MARAUDER && !p.isMaceObject).length;
  const vikingHasMace = pieces.some(p => p.player === PLAYERS.VIKING && p.hasMace);
  const marauderHasMace = pieces.some(p => p.player === PLAYERS.MARAUDER && p.hasMace);
  const isVikingTurn = currentPlayer === PLAYERS.VIKING;

  const titleStyle = { 
    fontFamily: "'Cinzel Decorative', serif", 
    fontSize: '1.6rem', 
    fontWeight: 700, 
    color: '#e8c060', 
    textShadow: '0 0 16px rgba(232,192,96,0.6), 2px 2px 6px rgba(0,0,0,0.9)', 
    letterSpacing: '0.08em', 
    lineHeight: 1.3,
    textTransform: 'uppercase',
  };
  
  const btnBase = { 
    width: '100%', 
    padding: '11px 12px', 
    borderRadius: 6, 
    fontFamily: "'Cinzel Decorative', serif", 
    fontSize: '0.75rem', 
    letterSpacing: '0.1em', 
    cursor: 'pointer', 
    boxShadow: '0 4px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    fontWeight: 600,
    border: 'none',
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 12, 
      minWidth: 240, 
      maxWidth: 270, 
      color: '#e8d8b0',
      animation: 'fade-in-delay-1 0.6s ease-out both',
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        padding: '12px',
        background: 'linear-gradient(135deg, rgba(42,31,14,0.8) 0%, rgba(26,18,8,0.9) 100%)',
        border: '2px solid #5a3d1a',
        borderRadius: 6,
        boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
      }}>
        <div style={titleStyle}>
          ⚔️ M&T ⚔️
        </div>
        <div style={{ 
          fontFamily: "'IM Fell English', serif", 
          fontStyle: 'italic', 
          fontSize: '0.65rem', 
          color: '#9,8a70', 
          marginTop: 4, 
          letterSpacing: '0.1em',
        }}>
          of Berk
        </div>
        <WoodDivider/>
      </div>

      {/* Status Panel */}
      <ScrollPanel icon={gamePhase === 'SHIP_PLACEMENT' ? '⚓' : '⚔️'}>
        {gamePhase === 'SHIP_PLACEMENT' ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ 
              fontFamily: "'IM Fell English', serif",
              fontSize: '0.9rem', 
              color: '#c4922a', 
              marginBottom: 6,
              fontWeight: 'bold',
            }}>
              ⚓ Ship Placement
            </div>
            <div style={{ 
              fontSize: '0.7rem', 
              color: '#a08070',
              lineHeight: 1.4,
              fontStyle: 'italic',
            }}>
              Place your vessels on the board
            </div>
          </div>
        ) : winner ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: 4 }}>🏆</div>
            <div style={{ 
              fontFamily: "'Cinzel Decorative', serif",
              color: '#e8c060', 
              fontSize: '0.95rem', 
              fontWeight: 'bold',
              marginBottom: 4,
            }}>
              {winner} WINS!
            </div>
            <div style={{ 
              fontSize: '0.65rem', 
              color: '#888',
              fontStyle: 'italic',
            }}>
              Game Complete
            </div>
          </div>
        ) : isAIThinking ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: 4, animation: 'rune-shimmer 2s ease-in-out infinite' }}>🐉</div>
            <div style={{ 
              fontFamily: "'IM Fell English', serif",
              color: '#80c0ff', 
              fontSize: '0.8rem', 
              fontStyle: 'italic',
            }}>
              Dragon Thinking
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ 
              fontFamily: "'IM Fell English', serif",
              fontSize: '0.65rem', 
              color: '#806040', 
              letterSpacing: '0.15em', 
              marginBottom: 6,
              textTransform: 'uppercase',
            }}>
              Active Turn
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 8,
              marginBottom: 6,
            }}>
              <span style={{ fontSize: '1.4rem', animation: 'pulse 2s ease-in-out infinite' }}>
                {isVikingTurn ? '⚔️' : '🗡️'}
              </span>
              <span style={{ 
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: '0.95rem', 
                fontWeight: 'bold',
                color: isVikingTurn ? '#80c0ff' : '#ff8080',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {isVikingTurn ? 'Vikings' : 'Marauders'}
              </span>
            </div>
            <div style={{ 
              fontSize: '0.65rem', 
              color: '#c8a870', 
              fontStyle: 'italic',
            }}>
              {currentPlayer === playerSide ? '→ Your Move' : '← Enemy Move'}
            </div>
          </div>
        )}
      </ScrollPanel>

      {/* Forces Panel */}
      <ScrollPanel title="Forces" icon="⚔️">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Vikings */}
          <div style={{ 
            background: 'rgba(74,127,165,0.15)',
            border: '1px solid rgba(74,127,165,0.3)',
            borderRadius: 4,
            padding: '8px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              fontSize: '0.8rem',
            }}>
              <span style={{ fontSize: '1rem' }}>⚔️</span>
              <span style={{ color: '#80c0ff', fontWeight: 'bold' }}>Vikings</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              fontSize: '0.8rem',
              color: '#c8b080',
              fontWeight: 'bold',
            }}>
              {vikingHasMace && <span style={{ fontSize: '0.9rem', color: '#c4922a' }}>✦</span>}
              {vikingPieces}
            </div>
          </div>

          {/* Marauders */}
          <div style={{ 
            background: 'rgba(204,51,51,0.15)',
            border: '1px solid rgba(204,51,51,0.3)',
            borderRadius: 4,
            padding: '8px 10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              fontSize: '0.8rem',
            }}>
              <span style={{ fontSize: '1rem' }}>🗡️</span>
              <span style={{ color: '#ff8080', fontWeight: 'bold' }}>Marauders</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              fontSize: '0.8rem',
              color: '#c8b080',
              fontWeight: 'bold',
            }}>
              {marauderHasMace && <span style={{ fontSize: '0.9rem', color: '#c4922a' }}>✦</span>}
              {marauderPieces}
            </div>
          </div>
        </div>
      </ScrollPanel>

      {/* Log Panel */}
      <ScrollPanel title="Chronicle" icon="📜">
        <div style={{ 
          overflowY: 'auto', 
          maxHeight: 120, 
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}>
          {[...log].reverse().slice(0, 5).map((entry, i) => (
            <div 
              key={i} 
              style={{ 
                fontFamily: "'IM Fell English', serif", 
                fontStyle: 'italic', 
                fontSize: '0.7rem', 
                color: i === 0 ? '#e8c060' : '#a08070', 
                lineHeight: 1.3,
                borderBottom: i < 4 ? '1px solid rgba(90,61,26,0.2)' : 'none', 
                paddingBottom: i < 4 ? 4 : 0,
              }}>
              {entry}
            </div>
          ))}
        </div>
      </ScrollPanel>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {state.pendingTraitor && currentPlayer === playerSide && !state.pendingTraitorSelection && gamePhase === 'PLAYING' && (
          <button 
            onClick={onTriggerTraitor} 
            style={{ 
              ...btnBase, 
              background: 'linear-gradient(180deg, #6a1a1a 0%, #3a0a0a 100%)', 
              border: '2px solid #8b0000', 
              color: '#ff8080',
              boxShadow: '0 4px 12px rgba(139,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(139,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(139,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
            }}
          >
            ⚔️ Activate Traitor
          </button>
        )}
        {state.pendingTraitorSelection && state.pendingTraitor && currentPlayer === playerSide && (
          <button 
            onClick={onDeclineTraitor} 
            style={{ 
              ...btnBase, 
              background: 'transparent', 
              border: '2px dashed #888', 
              color: '#888',
              boxShadow: 'none',
            }}
          >
            Cancel Selection
          </button>
        )}
        <button 
          onClick={onHelp} 
          style={{ 
            ...btnBase, 
            background: 'linear-gradient(180deg, #2a4a1e 0%, #1a2a0e 100%)', 
            border: '2px solid #4a7a2a', 
            color: '#90c060',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.background = 'linear-gradient(180deg, #3a5a2e 0%, #2a3a1e 100%)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.background = 'linear-gradient(180deg, #2a4a1e 0%, #1a2a0e 100%)';
          }}
        >
          ❓ How to Play
        </button>
        <button 
          onClick={onReset} 
          style={{ 
            ...btnBase, 
            background: 'linear-gradient(180deg, #4a3a1a 0%, #2a1a08 100%)', 
            border: '2px solid #6a5a2a', 
            color: '#c4a870',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.background = 'linear-gradient(180deg, #5a4a2a 0%, #3a2a18 100%)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.background = 'linear-gradient(180deg, #4a3a1a 0%, #2a1a08 100%)';
          }}
        >
          ⟳ New Game
        </button>
      </div>
    </div>
  );
}

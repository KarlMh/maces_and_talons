import { useRef, useEffect, useState } from 'react';
import Cell from './Cell.jsx';
import { BOARD_SIZE, PIECE_TYPES, PLAYERS } from '../game/constants.js';
import { isWater, getPieceAt, getMaceAt, getShipAt, getPlacementMoves } from '../game/logic.js';

const COL_LABELS = 'ABCDEFGHIJKLM';
const RUNES = 'ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ ᛇ';

function SelectionMenu({ piece, ship, onSelect, onCancel }) {
  return (
    <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:100, background:'rgba(20,15,10,0.95)', border:'2px solid #c4922a', borderRadius:8, padding:'16px', boxShadow:'0 0 30px rgba(0,0,0,0.9)', display:'flex', flexDirection:'column', gap:12, minWidth:160 }}>
      <div style={{ color:'#c4922a', fontSize:'0.75rem', textAlign:'center', fontFamily:"'Cinzel Decorative',serif", borderBottom:'1px solid #c4922a40', pb:8, mb:4 }}>CHOOSE UNIT</div>
      <button onClick={() => onSelect(piece)} style={{ background:'#3d2406', color:'#e8d8b0', border:'1px solid #c4922a80', padding:'10px', cursor:'pointer', borderRadius:4, fontFamily:'serif', fontWeight:'bold' }}>
        MOVE {piece.type.toUpperCase()}
      </button>
      <button onClick={() => onSelect(ship)} style={{ background:'#3d2406', color:'#e8d8b0', border:'1px solid #c4922a80', padding:'10px', cursor:'pointer', borderRadius:4, fontFamily:'serif', fontWeight:'bold' }}>
        MOVE {ship.type.toUpperCase()}
      </button>
      <button onClick={onCancel} style={{ color:'#888', background:'none', border:'none', fontSize:'0.65rem', cursor:'pointer', marginTop:4 }}>CANCEL</button>
    </div>
  );
}

function LongshipOverlay({ ship, cellSize }) {
  if (!ship?.shipCells || ship.shipCells.length < 2) return null;
  const [[r1,c1],[r2,c2]] = ship.shipCells;
  const isH = r1 === r2;
  const top  = Math.min(r1,r2) * cellSize + cellSize * 0.08;
  const left = Math.min(c1,c2) * cellSize + cellSize * 0.04;
  const w = isH ? cellSize * 2 - cellSize * 0.08 : cellSize * 0.92;
  const h = isH ? cellSize * 0.84 : cellSize * 2 - cellSize * 0.08;
  const isV = ship.player === PLAYERS.VIKING;
  const hull = isV ? '#7a5810' : '#5a1010';
  const sail = isV ? '#c4922a' : '#8b0000';
  const strk = isV ? '#2a1800' : '#1a0800';
  return (
    <div style={{ position:'absolute', top, left, width:w, height:h, pointerEvents:'none', zIndex:6 }}>
      <svg viewBox="0 0 100 46" preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
        <path d="M2 28 Q5 40 50 43 Q95 40 98 28 Q80 18 50 17 Q20 18 2 28Z" fill={hull} stroke={strk} strokeWidth="1.5"/>
        <path d="M2 28 Q1 23 6 20 Q25 15 50 14 Q75 15 94 20 Q99 23 98 28" fill={isV?'#a07820':'#7a1818'} stroke={strk} strokeWidth="1"/>
        <line x1="28" y1="17" x2="28" y2="3" stroke={strk} strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 3 L44 13 L28 17Z" fill={sail} stroke={strk} strokeWidth="1"/>
        <line x1="72" y1="17" x2="72" y2="3" stroke={strk} strokeWidth="2" strokeLinecap="round"/>
        <path d="M72 3 L88 13 L72 17Z" fill={sail} stroke={strk} strokeWidth="1"/>
        <text x="50" y="40" textAnchor="middle" fontSize="6" fill={strk} fontFamily="serif" opacity="0.35">≈ ≈ ≈ ≈</text>
      </svg>
    </div>
  );
}

function ShipPlacementPanel({ state }) {
  const { placementTurn, placingShipType } = state;
  const isLong = placingShipType === PIECE_TYPES.LONGSHIP;
  const side = placementTurn === PLAYERS.VIKING ? 'Vikings' : 'Marauders';
  const color = placementTurn === PLAYERS.VIKING ? '#4a6fa5' : '#8b2020';
  return (
    <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', zIndex:20, background:'rgba(10,6,2,0.92)', border:`2px solid ${color}`, borderRadius:8, padding:'24px 32px', textAlign:'center', minWidth:280, boxShadow:'0 8px 32px rgba(0,0,0,0.8)' }}>
      <div style={{ fontFamily:"'Cinzel Decorative',serif", fontSize:'1rem', color:'#c4922a', marginBottom:8 }}>⚓ Ship Placement</div>
      <div style={{ color, fontFamily:"'Cinzel Decorative',serif", fontSize:'0.85rem', marginBottom:4 }}>{side}</div>
      <div style={{ color:'#c8a870', fontSize:'0.75rem', marginBottom:12 }}>
        Place your <strong style={{color:'#e8c060'}}>{isLong ? 'Longship (2 cells)' : 'Kingship (1 cell)'}</strong>
      </div>
    </div>
  );
}

export default function Board({ state, onCellClick, onActivateTraitor }) {
  const { pieces, selectedPiece, validMoves, gamePhase, placementTurn, placingShipType } = state;
  const [cellSize, setCellSize] = useState(40);
  const [ambiguousClick, setAmbiguousClick] = useState(null);

  useEffect(() => {
    const update = () => {
      const maxW = Math.min(window.innerWidth * 0.65, 700);
      setCellSize(Math.floor(maxW / BOARD_SIZE));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleBoardClick = (row, col) => {
    // if the user is selecting a traitor target, intercept
    if (state.pendingTraitorSelection) {
      const piece = getPieceAt(pieces, row, col);
      if (piece && piece.player !== state.currentPlayer && HUNTER_TYPES.includes(piece.type)) {
        onActivateTraitor(piece.id);
        return;
      }
      // otherwise ignore clicks until selection made or cancelled
      return;
    }

    if (selectedPiece) {
      onCellClick(row, col, null);
      return;
    }
    const piece = getPieceAt(pieces, row, col);
    const ship = getShipAt(pieces, row, col);
    if (piece && ship && gamePhase === 'PLAYING' && piece.player === state.currentPlayer) {
      setAmbiguousClick({ piece, ship, row, col });
    } else {
      onCellClick(row, col, piece || ship);
    }
  };

  const longships = pieces.filter(p => p.type === PIECE_TYPES.LONGSHIP && !p.unplaced);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'32px 12px' }}>
      <div style={{ display:'flex', marginLeft:26, marginBottom:3 }}>
        {Array.from({length:BOARD_SIZE},(_,i) => (
          <div key={i} style={{ width:cellSize, textAlign:'center', fontSize:'0.58rem', color:'#c4922a', fontFamily:"'Cinzel Decorative',serif", fontWeight:'bold' }}>{COL_LABELS[i]}</div>
        ))}
      </div>
      <div style={{ display:'flex', gap:3 }}>
        <div style={{ display:'flex', flexDirection:'column' }}>
          {Array.from({length:BOARD_SIZE},(_,i) => (
            <div key={i} style={{ height:cellSize, width:22, display:'flex', alignItems:'center', justifyContent:'flex-end', paddingRight:2, fontSize:'0.55rem', color:'#c4922a', fontFamily:"'Cinzel Decorative',serif", fontWeight:'bold' }}>{BOARD_SIZE - i}</div>
          ))}
        </div>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', top:-18, left:0, right:0, textAlign:'center', fontSize:'0.58rem', color:'#c4922a', letterSpacing:'0.2em', opacity:0.6 }}>{RUNES}</div>
          <div style={{ position:'absolute', bottom:-18, left:0, right:0, textAlign:'center', fontSize:'0.58rem', color:'#c4922a', letterSpacing:'0.2em', opacity:0.6 }}>{RUNES}</div>
          
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${BOARD_SIZE}, ${cellSize}px)`, border:'3px solid #3d2406', boxShadow:'0 4px 32px rgba(0,0,0,0.7)', position:'relative' }}>
            {Array.from({length:BOARD_SIZE},(_,vi) => {
              const row = BOARD_SIZE - 1 - vi;
              return Array.from({length:BOARD_SIZE},(_,col) => {
                const piece = getPieceAt(pieces, row, col);
                const mace  = getMaceAt(pieces, row, col);
                const ship  = getShipAt(pieces, row, col);
                const isSel = selectedPiece?.row===row && selectedPiece?.col===col;
                const isVM  = validMoves.some(m => m.row===row && m.col===col);
                return (
                  <Cell key={`${row}-${col}`} row={row} col={col}
                    piece={piece} mace={mace} ship={ship}
                    isWater={isWater(row, col)} isSelected={isSel} isValidMove={isVM}
                    cellSize={cellSize}
                    onClick={() => handleBoardClick(row, col)} />
                );
              });
            })}
            
            {longships.map(ship => (
              <LongshipOverlay key={ship.id} ship={{ ...ship, shipCells: ship.shipCells.map(([r,c]) => [BOARD_SIZE-1-r, c]) }} cellSize={cellSize} />
            ))}
          </div>

          {ambiguousClick && (
            <SelectionMenu 
              piece={ambiguousClick.piece} 
              ship={ambiguousClick.ship} 
              onSelect={(unit) => {
                onCellClick(ambiguousClick.row, ambiguousClick.col, unit);
                setAmbiguousClick(null);
              }}
              onCancel={() => setAmbiguousClick(null)}
            />
          )}

          {gamePhase === 'SHIP_PLACEMENT' && <ShipPlacementPanel state={state} />}
        </div>
      </div>
    </div>
  );
}

import { PIECE_TYPES, PLAYERS } from '../game/constants.js';
const V = PLAYERS.VIKING, M = PLAYERS.MARAUDER;

const SVGS = {
  [`${PIECE_TYPES.HUNTER}_${V}`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><ellipse cx="16" cy="10" rx="5" ry="6" fill="#d4c4a0" stroke="#2a1800" strokeWidth="1.5"/><path d="M10 22 Q8 30 16 30 Q24 30 22 22 Q20 16 16 16 Q12 16 10 22Z" fill="#4a6fa5" stroke="#2a1800" strokeWidth="1.5"/><path d="M6 14 L10 22 M26 14 L22 22" stroke="#2a1800" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="12" stroke="#8b6914" strokeWidth="2" strokeLinecap="round"/><path d="M13 5 L16 2 L19 5" fill="#c0392b" stroke="#2a1800" strokeWidth="1"/><circle cx="14" cy="10" r="1" fill="#2a1800"/><circle cx="18" cy="10" r="1" fill="#2a1800"/></svg>,
  [`${PIECE_TYPES.HUNTER}_${M}`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><ellipse cx="16" cy="10" rx="5" ry="6" fill="#c4a878" stroke="#1a0800" strokeWidth="1.5"/><path d="M10 22 Q8 30 16 30 Q24 30 22 22 Q20 16 16 16 Q12 16 10 22Z" fill="#8b2020" stroke="#1a0800" strokeWidth="1.5"/><path d="M6 14 L10 22 M26 14 L22 22" stroke="#1a0800" strokeWidth="2" strokeLinecap="round"/><path d="M11 6 Q16 3 21 6" fill="#3a1a00" stroke="#1a0800" strokeWidth="1.5"/><path d="M13 4 L11 1 M19 4 L21 1" stroke="#1a0800" strokeWidth="1.5" strokeLinecap="round"/><circle cx="14" cy="10" r="1" fill="#1a0800"/><circle cx="18" cy="10" r="1" fill="#1a0800"/></svg>,
  [`${PIECE_TYPES.KING}_${V}`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><ellipse cx="16" cy="11" rx="6" ry="7" fill="#e8d8b0" stroke="#2a1800" strokeWidth="1.5"/><path d="M9 23 Q7 31 16 31 Q25 31 23 23 Q21 16 16 16 Q11 16 9 23Z" fill="#c4922a" stroke="#2a1800" strokeWidth="1.5"/><path d="M5 13 L9 23 M27 13 L23 23" stroke="#2a1800" strokeWidth="2" strokeLinecap="round"/><path d="M10 7 L13 3 L16 6 L19 1 L22 7" fill="#c4922a" stroke="#2a1800" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="19" cy="2" r="2" fill="#e74c3c" stroke="#2a1800" strokeWidth="1"/><circle cx="14" cy="11" r="1.2" fill="#2a1800"/><circle cx="18" cy="11" r="1.2" fill="#2a1800"/></svg>,
  [`${PIECE_TYPES.KING}_${M}`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><ellipse cx="16" cy="11" rx="6" ry="7" fill="#c89858" stroke="#1a0800" strokeWidth="1.5"/><path d="M9 23 Q7 31 16 31 Q25 31 23 23 Q21 16 16 16 Q11 16 9 23Z" fill="#6a1a1a" stroke="#1a0800" strokeWidth="1.5"/><path d="M5 13 L9 23 M27 13 L23 23" stroke="#1a0800" strokeWidth="2" strokeLinecap="round"/><path d="M10 7 Q16 2 22 7" fill="#3a1a00" stroke="#1a0800" strokeWidth="1.5"/><path d="M9 8 L7 4 M16 5 L16 2 M23 8 L25 4" stroke="#1a0800" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="3.5" r="1.5" fill="#8b0000" stroke="#1a0800"/><circle cx="16" cy="1.5" r="1.5" fill="#8b0000" stroke="#1a0800"/><circle cx="25" cy="3.5" r="1.5" fill="#8b0000" stroke="#1a0800"/><circle cx="14" cy="11" r="1.2" fill="#1a0800"/><circle cx="18" cy="11" r="1.2" fill="#1a0800"/></svg>,
  [`${PIECE_TYPES.MACE}_null`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><line x1="8" y1="28" x2="19" y2="17" stroke="#5a3010" strokeWidth="3.5" strokeLinecap="round"/><line x1="8" y1="28" x2="19" y2="17" stroke="#8b5a20" strokeWidth="2" strokeLinecap="round"/><circle cx="22" cy="13" r="7.5" fill="#b8820a" stroke="#2a1800" strokeWidth="1.2"/><circle cx="22" cy="13" r="5.5" fill="#d4a020" stroke="#2a1800" strokeWidth="0.8"/><line x1="22" y1="5" x2="22" y2="21" stroke="#2a1800" strokeWidth="1.5" strokeLinecap="round"/><line x1="14" y1="13" x2="30" y2="13" stroke="#2a1800" strokeWidth="1.5" strokeLinecap="round"/><line x1="16.5" y1="7.5" x2="27.5" y2="18.5" stroke="#2a1800" strokeWidth="1.2" strokeLinecap="round"/><line x1="27.5" y1="7.5" x2="16.5" y2="18.5" stroke="#2a1800" strokeWidth="1.2" strokeLinecap="round"/><circle cx="22" cy="13" r="2.5" fill="#f0d040" stroke="#2a1800" strokeWidth="0.8"/></svg>,
  [`${PIECE_TYPES.DRAGON}_null`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><path d="M16 19 Q5 11 1 15 Q3 22 9 21 Q13 21 16 19Z" fill="#13132a" stroke="#3a3a8a" strokeWidth="0.9"/><path d="M16 19 Q27 11 31 15 Q29 22 23 21 Q19 21 16 19Z" fill="#13132a" stroke="#3a3a8a" strokeWidth="0.9"/><path d="M12 23 Q10 29 16 31 Q22 29 20 23 Q19 19 16 18 Q13 19 12 23Z" fill="#0d0d1e" stroke="#2a2a8a" strokeWidth="1"/><path d="M14 19 Q12 15 13 12 Q14 9 16 9 Q18 9 19 12 Q20 15 18 19Z" fill="#0d0d1e" stroke="#2a2a8a" strokeWidth="1"/><path d="M11 11 Q10 8 13 7 Q16 6 19 7 Q22 8 21 11 Q20 14 16 14 Q12 14 11 11Z" fill="#0a0a1a" stroke="#4040c0" strokeWidth="1.2"/><path d="M13 8 L11 5 L14 7Z" fill="#1a1a3a"/><path d="M19 8 L21 5 L18 7Z" fill="#1a1a3a"/><ellipse cx="14" cy="10.5" rx="2" ry="1.6" fill="#00e050"/><ellipse cx="18" cy="10.5" rx="2" ry="1.6" fill="#00e050"/><ellipse cx="14.4" cy="10.5" rx="1" ry="1.2" fill="#002010"/><ellipse cx="18.4" cy="10.5" rx="1" ry="1.2" fill="#002010"/><circle cx="14" cy="10" r="0.4" fill="white" opacity="0.9"/><circle cx="18" cy="10" r="0.4" fill="white" opacity="0.9"/><path d="M20 11 Q24 9 27 10 Q25 13 22 12Z" fill="#ff5500" opacity="0.75"/></svg>,
  [`${PIECE_TYPES.TRAITOR}_null`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><ellipse cx="16" cy="10" rx="5" ry="6" fill="#888" stroke="#333" strokeWidth="1.5"/><path d="M10 22 Q8 30 16 30 Q24 30 22 22 Q20 16 16 16 Q12 16 10 22Z" fill="#555" stroke="#333" strokeWidth="1.5"/><path d="M6 14 L10 22 M26 14 L22 22" stroke="#333" strokeWidth="2" strokeLinecap="round"/><path d="M11 6 Q10 1 16 1 Q22 1 21 6 Q19 4 16 4 Q13 4 11 6Z" fill="#444" stroke="#222" strokeWidth="1"/><ellipse cx="14" cy="10" rx="1" ry="0.8" fill="#222"/><ellipse cx="18" cy="10" rx="1" ry="0.8" fill="#222"/><line x1="24" y1="18" x2="28" y2="14" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round"/><path d="M27 13 L29 12 L28 14Z" fill="#ccc"/></svg>,
  [`${PIECE_TYPES.ACCOMPLICE}_null`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><ellipse cx="16" cy="10" rx="5" ry="6" fill="#7a7a6a" stroke="#3a3a2a" strokeWidth="1.5"/><path d="M10 22 Q8 30 16 30 Q24 30 22 22 Q20 16 16 16 Q12 16 10 22Z" fill="#4a4a3a" stroke="#3a3a2a" strokeWidth="1.5"/><path d="M6 14 L10 22 M26 14 L22 22" stroke="#3a3a2a" strokeWidth="2" strokeLinecap="round"/><path d="M12 7 Q11 3 16 2 Q21 3 20 7" fill="#3a3a2a" stroke="#2a2a1a" strokeWidth="1"/><circle cx="14" cy="10" r="1" fill="#2a2a1a"/><circle cx="18" cy="10" r="1" fill="#2a2a1a"/><rect x="22" y="16" width="5" height="7" rx="1" fill="#c8a870" stroke="#5a3d10" strokeWidth="0.8"/><line x1="23.5" y1="18" x2="25.5" y2="18" stroke="#5a3d10" strokeWidth="0.6"/><line x1="23.5" y1="20" x2="25.5" y2="20" stroke="#5a3d10" strokeWidth="0.6"/></svg>,
  [`${PIECE_TYPES.KINGSHIP}_${V}`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><path d="M5 22 Q7 28 16 29 Q25 28 27 22 Q20 16 16 16 Q12 16 5 22Z" fill="#8b6914" stroke="#2a1800" strokeWidth="1.5"/><path d="M5 22 Q4 19 7 17 Q11 14 16 14 Q21 14 25 17 Q28 19 27 22" fill="#a07820" stroke="#2a1800" strokeWidth="1"/><line x1="16" y1="16" x2="16" y2="7" stroke="#5a3d14" strokeWidth="2" strokeLinecap="round"/><path d="M16 7 L22 14 L16 16Z" fill="#c4922a" stroke="#2a1800" strokeWidth="1"/><circle cx="16" cy="6" r="2.5" fill="#c4922a" stroke="#2a1800" strokeWidth="1"/></svg>,
  [`${PIECE_TYPES.KINGSHIP}_${M}`]: <svg viewBox="0 0 32 32" fill="none" style={{width:'100%',height:'100%'}}><path d="M5 22 Q7 28 16 29 Q25 28 27 22 Q20 16 16 16 Q12 16 5 22Z" fill="#6a1a1a" stroke="#1a0800" strokeWidth="1.5"/><path d="M5 22 Q4 19 7 17 Q11 14 16 14 Q21 14 25 17 Q28 19 27 22" fill="#8b2020" stroke="#1a0800" strokeWidth="1"/><line x1="16" y1="16" x2="16" y2="7" stroke="#3a1a00" strokeWidth="2" strokeLinecap="round"/><path d="M16 7 L22 14 L16 16Z" fill="#8b0000" stroke="#1a0800" strokeWidth="1"/><circle cx="16" cy="6" r="2.5" fill="#8b0000" stroke="#1a0800" strokeWidth="1"/></svg>,
};

function getSVG(piece) {
  if (!piece) return null;
  const key = `${piece.type}_${piece.player||'null'}`;
  return SVGS[key] ?? SVGS[`${piece.type}_null`] ?? null;
}

export default function Cell({ row, col, piece, mace, ship, isSelected, isValidMove, isPlacementTarget, isWater: water, cellSize, onClick }) {
  const displayPiece = piece || mace || null;
  const size = cellSize || 40;
  const isLight = (row + col) % 2 === 0;
  const bg = water ? (isLight?'#1a4878':'#12305a') : (isLight?'#c8a870':'#a07840');
  const bgImg = water
    ? 'radial-gradient(ellipse at 30% 30%,#1e5a9a,#0a1e3a)'
    : isLight ? 'radial-gradient(ellipse at 40% 30%,#c8a870,#b09050)' : 'radial-gradient(ellipse at 60% 70%,#a07840,#8a6430)';
  const outline = isSelected
    ? 'inset 0 0 0 2px #e85d04, 0 0 10px #e85d0460'
    : isValidMove ? 'inset 0 0 0 2px #6aaa40'
    : isPlacementTarget ? 'inset 0 0 0 2px #00aaff'
    : 'none';

  return (
    <div onClick={onClick} style={{ position:'relative', width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center', background:bg, backgroundImage:bgImg, border:'1px solid rgba(42,24,0,0.28)', boxShadow:outline, cursor:'pointer', boxSizing:'border-box', overflow:'visible' }}>
      {water && <div style={{ position:'absolute', inset:0, opacity:0.1, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(255,255,255,0.5) 4px,rgba(255,255,255,0.5) 5px)', pointerEvents:'none' }}/>}
      {!water && <div style={{ position:'absolute', inset:0, opacity:0.06, backgroundImage:'repeating-linear-gradient(87deg,transparent,transparent 3px,rgba(0,0,0,0.3) 3px,rgba(0,0,0,0.3) 4px)', pointerEvents:'none' }}/>}
      
      {/* Ship Layer */}
      {ship && (
        <div style={{ position: 'absolute', width:'82%', height:'82%', zIndex:4, pointerEvents:'none', opacity: displayPiece ? 0.6 : 1 }}>
          {SVGS[`${PIECE_TYPES.KINGSHIP}_${ship.player}`]}
        </div>
      )}

      {/* Move / Placement Dots */}
      {(isValidMove || isPlacementTarget) && !displayPiece && (
        <div style={{ width:11, height:11, borderRadius:'50%', background: isPlacementTarget ? 'radial-gradient(circle,#60ddff,#0088cc 60%)' : 'radial-gradient(circle,#8aff60,#4a8a20 60%)', boxShadow: isPlacementTarget ? '0 0 6px #00aaff' : '0 0 6px #6aaa40', zIndex:8 }}/>
      )}

      {/* Piece Layer */}
      {displayPiece && (
        <div style={{ width: ship ? '60%' : '80%', height: ship ? '60%' : '80%', position:'relative', zIndex:10, transform:isSelected?'scale(1.12)':'scale(1)', transition:'transform 0.1s' }}>
          {getSVG(displayPiece)}
          {displayPiece.hasMace && (
            <div style={{ position:'absolute', top:-5, right:-5, width:13, height:13, zIndex:20 }}>
              <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" fill="#c4922a" stroke="#2a1800" strokeWidth="1.2"/><text x="8" y="11.5" textAnchor="middle" fontSize="8" fill="#2a1800" fontFamily="serif">✦</text></svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

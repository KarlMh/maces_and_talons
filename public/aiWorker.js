/**
 * MACES & TALONS - KNOWLEDGE-BASED AI
 * ===================================
 * Instead of blind evaluation, teach the AI actual strategic patterns:
 * - Zones of Control
 * - Sandwich Geometry
 * - Ship Lanes & Bridges
 * - Tempo & Initiative
 */

const PT = { 
  HUNTER: 'HUNTER', KING: 'KING', LONGSHIP: 'LONGSHIP', KINGSHIP: 'KINGSHIP', 
  MACE: 'MACE', TRAITOR: 'TRAITOR', ACCOMPLICE: 'ACCOMPLICE', DRAGON: 'DRAGON' 
};
const PL = { VIKING: 'VIKING', MARAUDER: 'MARAUDER' };
const HUNTER_TYPES = [PT.HUNTER, PT.TRAITOR, PT.ACCOMPLICE];
const SHIP_TYPES = [PT.LONGSHIP, PT.KINGSHIP];
const BS = 13;

const BL = [[1,1,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,1,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,0,0,0,0,1,1,1],[0,1,1,1,1,1,1,1,1,1,1,1,0],[0,0,1,1,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,1,0],[1,1,1,0,0,0,0,1,1,1,1,1,1],[1,1,0,0,0,0,0,0,1,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1]];

const iW = (r, c) => r >= 0 && r < BS && c >= 0 && c < BS && BL[r][c] === 1;
const iB = (r, c) => r >= 0 && r < BS && c >= 0 && c < BS;
const d = (r1, c1, r2, c2) => Math.abs(r1 - r2) + Math.abs(c1 - c2);

const gP = (ps, r, c) => ps.find(p => p.row === r && p.col === c && !p.isMaceObject && !p.unplaced && !SHIP_TYPES.includes(p.type)) || null;
const gS = (ps, r, c) => ps.find(p => SHIP_TYPES.includes(p.type) && !p.unplaced && p.shipCells?.some(([sr, sc]) => sr === r && sc === c)) || null;
const gM = (ps, r, c) => ps.find(p => p.row === r && p.col === c && p.isMaceObject) || null;

// ============================================================================
// KNOWLEDGE MODULE 1: UNDERSTANDING SANDWICH GEOMETRY
// ============================================================================

/**
 * A sandwich requires TWO allied pieces on opposite sides.
 * The AI needs to understand "sandwich setups" - positions where
 * we're ONE MOVE away from completing a sandwich.
 */
function analyzeSandwichOpportunities(pieces, player) {
  const opportunities = [];
  const dirs = [[1,0], [0,1]]; // Only need to check 2 directions (symmetry)
  
  pieces.forEach(target => {
    // Skip our own pieces and unplaceable stuff
    if (target.player === player || target.isMaceObject || target.unplaced) return;
    
    const tr = target.row, tc = target.col;
    
    dirs.forEach(([dr, dc]) => {
      const pos1 = [tr + dr, tc + dc];
      const pos2 = [tr - dr, tc - dc];
      
      const p1 = gP(pieces, pos1[0], pos1[1]);
      const p2 = gP(pieces, pos2[0], pos2[1]);
      
      // Case 1: We have ONE side, the other is empty - SETUP POSITION
      if (p1 && p1.player === player && !SHIP_TYPES.includes(p1.type) && !p2) {
        opportunities.push({
          type: 'SANDWICH_SETUP',
          target: target,
          needPosition: pos2,
          anchor: p1,
          value: target.type === PT.DRAGON ? 3000 : target.type === PT.TRAITOR ? 1500 : target.type === PT.ACCOMPLICE ? 1200 : 400
        });
      }
      
      if (p2 && p2.player === player && !SHIP_TYPES.includes(p2.type) && !p1) {
        opportunities.push({
          type: 'SANDWICH_SETUP',
          target: target,
          needPosition: pos1,
          anchor: p2,
          value: target.type === PT.DRAGON ? 3000 : target.type === PT.TRAITOR ? 1500 : target.type === PT.ACCOMPLICE ? 1200 : 400
        });
      }
      
      // Case 2: BOTH sides occupied by us - COMPLETED SANDWICH
      if (p1 && p1.player === player && p2 && p2.player === player) {
        opportunities.push({
          type: 'SANDWICH_COMPLETE',
          target: target,
          value: (target.type === PT.DRAGON ? 3000 : target.type === PT.TRAITOR ? 1500 : target.type === PT.ACCOMPLICE ? 1200 : 400) * 2
        });
      }
    });
  });
  
  return opportunities;
}

/**
 * Check which of our pieces can REACH a sandwich setup position
 */
function findPiecesCanCompleteSandwich(pieces, player, opportunity) {
  if (opportunity.type !== 'SANDWICH_SETUP') return [];
  
  const [targetRow, targetCol] = opportunity.needPosition;
  const canReach = [];
  
  pieces.forEach(p => {
    if (p.player !== player || p.unplaced) return;
    const moves = getValidMoves(pieces, p);
    if (moves.some(m => m.row === targetRow && m.col === targetCol)) {
      canReach.push(p);
    }
  });
  
  return canReach;
}

// ============================================================================
// KNOWLEDGE MODULE 2: ZONE CONTROL (Chess-inspired)
// ============================================================================

/**
 * A square is "controlled" if we can move a piece there.
 * Understanding control helps the AI see:
 * - Safe zones for king
 * - Contested areas (both sides can reach)
 * - Weak squares (enemy controls, we don't)
 */
function analyzeControl(pieces, player) {
  const control = Array(BS).fill(null).map(() => Array(BS).fill(0));
  
  pieces.forEach(p => {
    if (p.player !== player || p.unplaced) return;
    const moves = getValidMoves(pieces, p);
    moves.forEach(m => {
      control[m.row][m.col] += 1;
    });
  });
  
  return control;
}

function isSquareSafe(pieces, player, row, col) {
  const ourControl = analyzeControl(pieces, player);
  const opp = player === PL.VIKING ? PL.MARAUDER : PL.VIKING;
  const theirControl = analyzeControl(pieces, opp);
  
  // Safe if: we control it AND (they don't, OR we control it more)
  return ourControl[row][col] > 0 && ourControl[row][col] >= theirControl[row][col];
}

// ============================================================================
// KNOWLEDGE MODULE 3: SHIP BRIDGE STRATEGY
// ============================================================================

/**
 * Ships should form "bridges" between land masses to enable fast movement.
 * A good bridge:
 * - Touches land on both ends (not floating in ocean)
 * - Provides path to strategic areas (center, neutrals, enemy territory)
 */
function analyzeShipBridgeQuality(ship, pieces) {
  if (!ship.shipCells) return 0;
  
  let score = 0;
  let touchesLand = 0;
  let centerDistance = 0;
  
  ship.shipCells.forEach(([r, c]) => {
    // Check adjacent land
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr, dc]) => {
      if (iB(r + dr, c + dc) && !iW(r + dr, c + dc)) {
        touchesLand += 1;
      }
    });
    
    centerDistance += d(r, c, 6, 6);
  });
  
  // Bridges touching land on both ends are gold
  if (touchesLand >= 3) score += 500;
  else if (touchesLand >= 2) score += 300;
  else if (touchesLand === 1) score += 100;
  else score -= 300; // Floating in ocean = bad
  
  // Favor central bridges
  score += (26 - centerDistance) * 10;
  
  return score;
}

// ============================================================================
// KNOWLEDGE MODULE 4: THREAT DETECTION
// ============================================================================

function analyzeThreat(pieces, aiPlayer) {
  const threats = {
    immediateWinThreat: false,
    kingInDanger: false,
    aboutToLoseNeutral: [],
    maceRace: null
  };
  
  const opp = aiPlayer === PL.VIKING ? PL.MARAUDER : PL.VIKING;
  const aiKing = pieces.find(p => p.type === PT.KING && p.player === aiPlayer);
  const oppKing = pieces.find(p => p.type === PT.KING && p.player === opp);
  
  // Check if enemy can win next turn
  pieces.forEach(p => {
    if (p.player === opp && p.hasMace) {
      const moves = getValidMoves(pieces, p);
      if (aiKing && moves.some(m => m.row === aiKing.row && m.col === aiKing.col)) {
        threats.immediateWinThreat = true;
        threats.kingInDanger = true;
      }
    }
  });
  
  // Check if we can win next turn
  pieces.forEach(p => {
    if (p.player === aiPlayer && p.hasMace) {
      const moves = getValidMoves(pieces, p);
      if (oppKing && moves.some(m => m.row === oppKing.row && m.col === oppKing.col)) {
        threats.immediateWinThreat = true; // We should take the win!
      }
    }
  });
  
  // Check neutral threats
  [PT.DRAGON, PT.TRAITOR, PT.ACCOMPLICE].forEach(neutralType => {
    const neutral = pieces.find(p => p.type === neutralType);
    if (!neutral || neutral.player) return;
    
    const oppOpps = analyzeSandwichOpportunities(pieces, opp);
    const canTake = oppOpps.some(op => op.target.id === neutral.id && op.type === 'SANDWICH_COMPLETE');
    
    if (canTake) {
      threats.aboutToLoseNeutral.push(neutral);
    }
  });
  
  return threats;
}

// ============================================================================
// MOVEMENT GENERATION
// ============================================================================

function getValidMoves(pieces, piece) {
  const moves = [];
  const { row, col, type, player, hasMace } = piece;

  if (HUNTER_TYPES.includes(type)) {
    for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      let r = row + dr, c = col + dc;
      while (iB(r, c)) {
        if (iW(r, c)) {
          const ship = gS(pieces, r, c);
          if (ship?.type === PT.LONGSHIP && !gP(pieces, r, c)) moves.push({ row: r, col: c });
          break;
        }
        const occ = gP(pieces, r, c);
        if (occ?.type === PT.DRAGON) break;
        if (occ) {
          if (occ.type === PT.KING && occ.player !== player && hasMace) moves.push({ row: r, col: c });
          break;
        }
        moves.push({ row: r, col: c });
        r += dr; c += dc;
      }
    }
  } else if (type === PT.KING) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const r = row + dr, c = col + dc;
        if (!iB(r, c)) continue;
        const occ = gP(pieces, r, c);
        if (occ?.type === PT.DRAGON || gM(pieces, r, c)) continue;
        if (occ && !(occ.type === PT.KING && occ.player !== player && hasMace)) continue;
        if (iW(r, c)) {
          const ship = gS(pieces, r, c);
          if (ship?.type === PT.KINGSHIP && ship.player === player) moves.push({ row: r, col: c });
          continue;
        }
        moves.push({ row: r, col: c });
      }
    }
  } else if (type === PT.DRAGON) {
    for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      let r = row + dr, c = col + dc, jumped = false;
      while (iB(r, c)) {
        if (iW(r, c) && !gS(pieces, r, c)) {
          if (!jumped) { jumped = true; r += dr; c += dc; continue; }
          else break;
        }
        const occ = gP(pieces, r, c);
        if (occ) {
          if (occ.player !== player && HUNTER_TYPES.includes(occ.type)) moves.push({ row: r, col: c });
          break;
        }
        moves.push({ row: r, col: c });
        r += dr; c += dc;
      }
    }
  } else if (SHIP_TYPES.includes(type)) {
    for (let r = 0; r < BS; r++) {
      for (let c = 0; c < BS; c++) {
        if (!iW(r, c)) continue;
        const existing = gS(pieces, r, c);
        if (existing && existing.id !== piece.id) continue;
        if (type === PT.LONGSHIP) {
          for (const [r2, c2] of [[r, c+1], [r, c-1], [r+1, c], [r-1, c]]) {
            if (iB(r2, c2) && iW(r2, c2)) {
              const s2 = gS(pieces, r2, c2);
              if (!s2 || s2.id === piece.id) moves.push({ row: r, col: c, shipCells: [[r, c], [r2, c2]] });
            }
          }
        } else {
          moves.push({ row: r, col: c, shipCells: [[r, c]] });
        }
      }
    }
  }
  return moves;
}

// ============================================================================
// GAME SIMULATION (with proper capture rules)
// ============================================================================

function applyMove(state, piece, targetRow, targetCol, shipCells = null) {
  let pieces = state.pieces.map(p => ({ ...p }));
  const moving = pieces.find(p => p.id === piece.id);
  if (!moving) return state;
  
  const currentPlayer = moving.player;
  const nextPlayer = currentPlayer === PL.VIKING ? PL.MARAUDER : PL.VIKING;

  // WIN CHECK
  const targetKing = pieces.find(p => p.row === targetRow && p.col === targetCol && p.type === PT.KING && p.player !== currentPlayer && p.player !== null);
  if (targetKing && moving.hasMace && (HUNTER_TYPES.includes(moving.type) || moving.type === PT.KING)) {
    moving.row = targetRow; moving.col = targetCol;
    return { ...state, pieces, winner: currentPlayer, gamePhase: 'GAME_OVER', currentPlayer };
  }

  // DRAGON CAPTURE
  if (moving.type === PT.DRAGON) {
    const victim = pieces.find(p => p.row === targetRow && p.col === targetCol && HUNTER_TYPES.includes(p.type) && p.player && p.player !== currentPlayer);
    if (victim) {
      pieces = pieces.filter(p => p.id !== victim.id);
      if (victim.hasMace) {
        const nextId = Math.max(...pieces.map(x => x.id), 0) + 1;
        pieces.push({ id: nextId, type: PT.MACE, row: targetRow, col: targetCol, isMaceObject: true });
      }
    }
  }

  // SHIP CARRYING
  if (SHIP_TYPES.includes(moving.type)) {
    const oldCells = moving.shipCells || [[moving.row, moving.col]];
    const newCells = shipCells || [[targetRow, targetCol]];
    pieces.forEach(p => {
      if (!SHIP_TYPES.includes(p.type) && !p.isMaceObject) {
        const idx = oldCells.findIndex(([r, c]) => r === p.row && c === p.col);
        if (idx !== -1) { p.row = newCells[idx][0]; p.col = newCells[idx][1]; }
      }
    });
    moving.shipCells = newCells;
  }

  // MACE PICKUP
  const mace = pieces.find(p => p.row === targetRow && p.col === targetCol && p.isMaceObject);
  if (mace && HUNTER_TYPES.includes(moving.type)) {
    moving.hasMace = true;
    pieces = pieces.filter(p => p.id !== mace.id);
  }

  moving.row = targetRow; moving.col = targetCol;

  // SANDWICH CAPTURES
  const toRemove = [];
  pieces.forEach(p => {
    if (p.id === moving.id || p.isMaceObject || p.unplaced) return;
    if (p.player && p.player !== currentPlayer) {
      if (HUNTER_TYPES.includes(p.type) || p.type === PT.DRAGON) {
        const r = p.row, c = p.col;
        const friend = (dr, dc) => {
          const f = gP(pieces, r + dr, c + dc);
          return f && f.player === currentPlayer && !SHIP_TYPES.includes(f.type) && (HUNTER_TYPES.includes(f.type) || f.type === PT.KING);
        };
        if ((friend(0,-1) && friend(0,1)) || (friend(-1,0) && friend(1,0))) {
          // Neutrals get recruited, others captured
          if ([PT.DRAGON, PT.TRAITOR, PT.ACCOMPLICE].includes(p.type) && !p.player) {
            p.player = currentPlayer;
          } else {
            toRemove.push(p.id);
            if (p.hasMace) {
              const nextId = Math.max(...pieces.map(x => x.id), 0) + 1;
              pieces.push({ id: nextId, type: PT.MACE, row: r, col: c, isMaceObject: true });
            }
          }
        }
      }
    }
    // Neutral recruitment via sandwich
    if (!p.player && [PT.DRAGON, PT.TRAITOR, PT.ACCOMPLICE].includes(p.type)) {
      const r = p.row, c = p.col;
      const friend = (dr, dc) => {
        const f = gP(pieces, r + dr, c + dc);
        return f && f.player === currentPlayer && !SHIP_TYPES.includes(f.type);
      };
      if ((friend(0,-1) && friend(0,1)) || (friend(-1,0) && friend(1,0))) {
        p.player = currentPlayer;
      }
    }
  });
  
  pieces = pieces.filter(p => !toRemove.includes(p.id));

  // TRAP CAPTURES (King + Hunter pincer)
  pieces.forEach(p => {
    if (!p.player && [PT.DRAGON, PT.TRAITOR, PT.ACCOMPLICE].includes(p.type)) {
      const r = p.row, c = p.col;
      for (const [dr, dc] of [[0,1], [1,0]]) {
        const p1 = gP(pieces, r+dr, c+dc);
        const p2 = gP(pieces, r-dr, c-dc);
        
        if (p1?.type === PT.KING && p1.player === currentPlayer && p2?.player === currentPlayer && HUNTER_TYPES.includes(p2.type)) {
          pieces = pieces.filter(x => x.id !== p2.id);
          if (p2.hasMace) {
            const nextId = Math.max(...pieces.map(x => x.id), 0) + 1;
            pieces.push({ id: nextId, type: PT.MACE, row: p2.row, col: p2.col, isMaceObject: true });
          }
          p.player = currentPlayer;
          return;
        }
        
        if (p2?.type === PT.KING && p2.player === currentPlayer && p1?.player === currentPlayer && HUNTER_TYPES.includes(p1.type)) {
          pieces = pieces.filter(x => x.id !== p1.id);
          if (p1.hasMace) {
            const nextId = Math.max(...pieces.map(x => x.id), 0) + 1;
            pieces.push({ id: nextId, type: PT.MACE, row: p1.row, col: p1.col, isMaceObject: true });
          }
          p.player = currentPlayer;
          return;
        }
      }
    }
  });

  // TRAITOR SETUP
  let pendingTraitor = null;
  if (HUNTER_TYPES.includes(moving.type) && pieces.find(p => p.id === moving.id)) {
    const traitor = pieces.find(p => p.type === PT.TRAITOR && p.player === nextPlayer);
    const accomplice = pieces.find(p => p.type === PT.ACCOMPLICE && p.player === nextPlayer);
    if (traitor && accomplice) {
      pendingTraitor = { player: nextPlayer, movedId: moving.id, row: moving.row, col: moving.col };
    }
  }

  // WIN CHECK
  let winner = null;
  for (const p of pieces) {
    if (p.hasMace && (HUNTER_TYPES.includes(p.type) || p.type === PT.KING)) {
      const ek = pieces.find(k => k.type === PT.KING && k.player !== p.player && k.player);
      if (ek && p.row === ek.row && p.col === ek.col) {
        winner = p.player;
        break;
      }
    }
  }

  return { ...state, pieces, currentPlayer: winner ? currentPlayer : nextPlayer, winner, gamePhase: winner ? 'GAME_OVER' : 'PLAYING', pendingTraitor };
}

// ============================================================================
// KNOWLEDGE-BASED EVALUATION
// ============================================================================

function evaluate(state, aiPlayer) {
  if (state.winner === aiPlayer) return 1000000;
  if (state.winner) return -1000000;

  const opp = aiPlayer === PL.VIKING ? PL.MARAUDER : PL.VIKING;
  let score = 0;

  // THREAT ANALYSIS (most important)
  const threats = analyzeThreat(state.pieces, aiPlayer);
  
  if (threats.immediateWinThreat && threats.kingInDanger) {
    score -= 900000; // MUST DEFEND!
  }
  
  if (threats.aboutToLoseNeutral.length > 0) {
    score -= threats.aboutToLoseNeutral.length * 5000; // Very bad
  }

  // SANDWICH OPPORTUNITIES
  const ourOpps = analyzeSandwichOpportunities(state.pieces, aiPlayer);
  const theirOpps = analyzeSandwichOpportunities(state.pieces, opp);
  
  ourOpps.forEach(op => {
    if (op.type === 'SANDWICH_COMPLETE') {
      score += op.value * 3; // About to capture!
    } else {
      score += op.value * 0.5; // Setup position
      
      // Check if we can complete it
      const canComplete = findPiecesCanCompleteSandwich(state.pieces, aiPlayer, op);
      if (canComplete.length > 0) {
        score += op.value * 2; // We can complete next turn!
      }
    }
  });
  
  theirOpps.forEach(op => {
    if (op.type === 'SANDWICH_COMPLETE') {
      score -= op.value * 3; // They're about to capture!
    } else {
      score -= op.value * 0.3;
    }
  });

  // SHIP BRIDGE QUALITY
  state.pieces.forEach(p => {
    if (SHIP_TYPES.includes(p.type) && !p.unplaced) {
      const quality = analyzeShipBridgeQuality(p, state.pieces);
      if (p.player === aiPlayer) score += quality;
      else if (p.player === opp) score -= quality;
    }
  });

  // MATERIAL
  const vals = {[PT.KING]: 10000, [PT.DRAGON]: 2000, [PT.TRAITOR]: 1500, [PT.ACCOMPLICE]: 1200, [PT.HUNTER]: 200};
  state.pieces.forEach(p => {
    if (p.isMaceObject || p.unplaced) return;
    const v = vals[p.type] || 100;
    if (p.player === aiPlayer) score += v;
    else if (p.player === opp) score -= v;
  });

  // MACE CONTROL
  const aiMace = state.pieces.find(p => p.player === aiPlayer && p.hasMace);
  const oppMace = state.pieces.find(p => p.player === opp && p.hasMace);
  const aiKing = state.pieces.find(p => p.type === PT.KING && p.player === aiPlayer);
  const oppKing = state.pieces.find(p => p.type === PT.KING && p.player === opp);
  
  if (aiMace && oppKing) {
    const dist = d(aiMace.row, aiMace.col, oppKing.row, oppKing.col);
    score += (26 - dist) * 300;
  }
  
  if (oppMace && aiKing) {
    const dist = d(oppMace.row, oppMace.col, aiKing.row, aiKing.col);
    score -= (26 - dist) * 400; // Higher penalty for danger
  }

  return score;
}

// ============================================================================
// MINIMAX
// ============================================================================

function minimax(state, depth, alpha, beta, maximizing, aiPlayer, startTime) {
  if (depth === 0 || state.winner || Date.now() - startTime > 2000) {
    return evaluate(state, aiPlayer);
  }

  const turnPlayer = maximizing ? aiPlayer : (aiPlayer === PL.VIKING ? PL.MARAUDER : PL.VIKING);
  const moves = [];
  
  state.pieces.filter(p => p.player === turnPlayer && !p.unplaced).forEach(p => {
    getValidMoves(state.pieces, p).forEach(m => {
      moves.push({ piece: p, move: m });
    });
  });

  if (!moves.length) return evaluate(state, aiPlayer);

  // SMART MOVE ORDERING: Prioritize sandwich completions
  const opps = analyzeSandwichOpportunities(state.pieces, turnPlayer);
  moves.sort((a, b) => {
    let scoreA = 0, scoreB = 0;
    
    opps.forEach(op => {
      if (op.type === 'SANDWICH_SETUP') {
        if (a.move.row === op.needPosition[0] && a.move.col === op.needPosition[1]) {
          scoreA += op.value;
        }
        if (b.move.row === op.needPosition[0] && b.move.col === op.needPosition[1]) {
          scoreB += op.value;
        }
      }
    });
    
    return scoreB - scoreA;
  });

  if (maximizing) {
    let maxEval = -Infinity;
    for (const m of moves) {
      const newState = applyMove(state, m.piece, m.move.row, m.move.col, m.move.shipCells);
      const ev = minimax(newState, depth - 1, alpha, beta, false, aiPlayer, startTime);
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      const newState = applyMove(state, m.piece, m.move.row, m.move.col, m.move.shipCells);
      const ev = minimax(newState, depth - 1, alpha, beta, true, aiPlayer, startTime);
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// ============================================================================
// MAIN
// ============================================================================

self.onmessage = function(e) {
  const { state, aiPlayer } = e.data;
  const startTime = Date.now();

  if (state.gamePhase !== 'PLAYING') {
    self.postMessage(null);
    return;
  }

  // Traitor
  if (state.pendingTraitor && state.pendingTraitor.player === aiPlayer) {
    self.postMessage({ type: 'SKIP_TRAITOR' });
    return;
  }

  const moves = [];
  state.pieces.filter(p => p.player === aiPlayer && !p.unplaced).forEach(p => {
    getValidMoves(state.pieces, p).forEach(m => moves.push({ piece: p, move: m }));
  });

  if (!moves.length) {
    self.postMessage(null);
    return;
  }

  // Instant win check
  for (const m of moves) {
    const result = applyMove(state, m.piece, m.move.row, m.move.col, m.move.shipCells);
    if (result.winner === aiPlayer) {
      self.postMessage(m);
      return;
    }
  }

  // Iterative deepening
  let bestMove = null;
  for (let d = 1; d <= 5; d++) {
    if (Date.now() - startTime > 2000 && bestMove) break;
    
    let bestScore = -Infinity;
    for (const m of moves) {
      if (Date.now() - startTime > 2000 && bestMove) break;
      const newState = applyMove(state, m.piece, m.move.row, m.move.col, m.move.shipCells);
      const score = minimax(newState, d - 1, -Infinity, Infinity, false, aiPlayer, startTime);
      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
    }
  }

  self.postMessage(bestMove);
};
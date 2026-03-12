/**
 * MACES & TALONS - UNBEATABLE AI ENGINE (FINAL VERSION)
 * ---------------------------------------------------
 * - Strategic Ship Placement (Center Bridge)
 * - Hunter-Carrier Synergy (Ships as Transports)
 * - Pincer/Sandwich Recruitment (Neutral Targeting)
 * - Iterative Deepening with Alpha-Beta Pruning
 */

const PT = { 
  HUNTER: 'HUNTER', KING: 'KING', LONGSHIP: 'LONGSHIP', KINGSHIP: 'KINGSHIP', 
  MACE: 'MACE', TRAITOR: 'TRAITOR', ACCOMPLICE: 'ACCOMPLICE', DRAGON: 'DRAGON' 
};
const PL = { VIKING: 'VIKING', MARAUDER: 'MARAUDER' };
const HUNTER_TYPES = [PT.HUNTER, PT.TRAITOR, PT.ACCOMPLICE];
const SHIP_TYPES = [PT.LONGSHIP, PT.KINGSHIP];
const BOARD_SIZE = 13;

const BOARD_LAYOUT = [[1,1,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,1,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,0,0,0,0,1,1,1],[0,1,1,1,1,1,1,1,1,1,1,1,0],[0,0,1,1,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,1,1,0,0],[0,0,1,1,0,0,0,0,0,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,1,0],[1,1,1,0,0,0,0,1,1,1,1,1,1],[1,1,0,0,0,0,0,0,1,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,1,1]];

// --- HELPER UTILS ---
const isWater = (r, c) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && BOARD_LAYOUT[r][c] === 1;
const isInBounds = (r, c) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
const dist = (r1, c1, r2, c2) => Math.abs(r1 - r2) + Math.abs(c1 - c2);

const getPieceAt = (pieces, r, c) => pieces.find(p => p.row === r && p.col === c && !p.isMaceObject && !p.unplaced && !SHIP_TYPES.includes(p.type)) || null;
const getShipAt = (pieces, r, c) => pieces.find(p => SHIP_TYPES.includes(p.type) && !p.unplaced && p.shipCells?.some(([sr, sc]) => sr === r && sc === c)) || null;

// --- MOVEMENT GENERATION ---
function getValidMoves(pieces, piece) {
  const moves = [];
  const { row, col, type, player, hasMace } = piece;

  if (HUNTER_TYPES.includes(type)) {
    for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      let r = row + dr, c = col + dc;
      while (isInBounds(r, c)) {
        if (isWater(r, c)) {
          const ship = getShipAt(pieces, r, c);
          if (ship?.type === PT.LONGSHIP && !getPieceAt(pieces, r, c)) moves.push({ row: r, col: c });
          break;
        }
        const occ = getPieceAt(pieces, r, c);
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
        if (!isInBounds(r, c)) continue;
        const occ = getPieceAt(pieces, r, c);
        if (occ?.type === PT.DRAGON || pieces.find(p => p.row === r && p.col === c && p.isMaceObject)) continue;
        if (occ && !(occ.type === PT.KING && occ.player !== player && hasMace)) continue;
        if (isWater(r, c)) {
          const ship = getShipAt(pieces, r, c);
          if (ship?.type === PT.KINGSHIP && ship.player === player) moves.push({ row: r, col: c });
          continue;
        }
        moves.push({ row: r, col: c });
      }
    }
  } else if (SHIP_TYPES.includes(type)) {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (!isWater(r, c)) continue;
        if (type === PT.LONGSHIP) {
          for (const [dr, dc] of [[0,1],[1,0]]) {
            const r2 = r + dr, c2 = c + dc;
            if (isInBounds(r2, c2) && isWater(r2, c2)) moves.push({ row: r, col: c, shipCells: [[r, c], [r2, c2]] });
          }
        } else {
          moves.push({ row: r, col: c, shipCells: [[r, c]] });
        }
      }
    }
  }
  return moves;
}

// --- SANDWICH/TRAP LOGIC (The Secret Sauce) ---
function processCaptures(pieces, currentPlayer) {
  let updatedPieces = [...pieces];
  const neutrals = [PT.DRAGON, PT.TRAITOR, PT.ACCOMPLICE];
  let toRemove = [];

  updatedPieces.forEach(p => {
    // We only care about capturing enemies or neutrals not currently on our side
    if (p.player && p.player !== currentPlayer) {
      const r = p.row, c = p.col;
      const isFriend = (rr, cc) => {
        const occ = updatedPieces.find(q => q.row === rr && q.col === cc && !SHIP_TYPES.includes(q.type));
        return occ && occ.player === currentPlayer;
      };

      const horizontal = isFriend(r, c-1) && isFriend(r, c+1);
      const vertical = isFriend(r-1, c) && isFriend(r+1, c);

      if (horizontal || vertical) {
        if (neutrals.includes(p.type)) {
          p.player = currentPlayer; // Recruitment!
        } else {
          toRemove.push(p.id); // Standard capture
        }
      }
    }
  });

  return updatedPieces.filter(p => !toRemove.includes(p.id));
}

// --- SIMULATION ---
function applyMove(state, piece, targetRow, targetCol, shipCells = null) {
  let pieces = state.pieces.map(p => ({ ...p }));
  const moving = pieces.find(p => p.id === piece.id);
  const currentPlayer = moving.player;

  // King Strike
  const targetKing = pieces.find(p => p.row === targetRow && p.col === targetCol && p.type === PT.KING && p.player !== currentPlayer);
  if (targetKing && moving.hasMace) return { ...state, pieces, winner: currentPlayer };

  // Ship Carrying
  if (SHIP_TYPES.includes(moving.type)) {
    const oldCells = moving.shipCells || [[moving.row, moving.col]];
    const newCells = shipCells || [[targetRow, targetCol]];
    pieces.forEach(p => {
      if (!SHIP_TYPES.includes(p.type)) {
        const idx = oldCells.findIndex(([r, c]) => r === p.row && c === p.col);
        if (idx !== -1) { p.row = newCells[idx][0]; p.col = newCells[idx][1]; }
      }
    });
    moving.shipCells = newCells;
  }

  moving.row = targetRow; moving.col = targetCol;
  
  // Mace Pickup
  const mace = pieces.find(p => p.row === targetRow && p.col === targetCol && p.isMaceObject);
  if (mace && HUNTER_TYPES.includes(moving.type)) {
    moving.hasMace = true;
    pieces = pieces.filter(p => p.id !== mace.id);
  }

  // Handle Captures/Recruitments
  pieces = processCaptures(pieces, currentPlayer);

  return { ...state, pieces, currentPlayer: currentPlayer === PL.VIKING ? PL.MARAUDER : PL.VIKING };
}

function canSandwich(state, player, target) {

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  for (const [dr,dc] of dirs) {

    const r1 = target.row + dr;
    const c1 = target.col + dc;

    const r2 = target.row - dr;
    const c2 = target.col - dc;

    const p1 = getPieceAt(state.pieces, r1, c1);
    const p2 = getPieceAt(state.pieces, r2, c2);

    if (p1 && p1.player === player && !SHIP_TYPES.includes(p1.type)) {
      if (!p2 || p2.player !== player) {
        return true;
      }
    }

  }

  return false;
}

function enemyCanRecruit(state, enemy, target) {

  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];

  for (const [dr,dc] of dirs) {

    const r1 = target.row + dr;
    const c1 = target.col + dc;

    const r2 = target.row - dr;
    const c2 = target.col - dc;

    const p1 = getPieceAt(state.pieces, r1, c1);
    const p2 = getPieceAt(state.pieces, r2, c2);

    if (p1 && p1.player === enemy && !SHIP_TYPES.includes(p1.type)) {
      if (!p2 || p2.player !== enemy) {
        return true;
      }
    }

  }

  return false;
}

// --- EVALUATION ---
function evaluate(state, aiPlayer) {

  if (state.winner === aiPlayer) return 1000000;
  if (state.winner) return -1000000;

  const opp = aiPlayer === PL.VIKING ? PL.MARAUDER : PL.VIKING;
  let score = 0;

  const aiKing = state.pieces.find(p => p.type === PT.KING && p.player === aiPlayer);
  const oppKing = state.pieces.find(p => p.type === PT.KING && p.player === opp);

  const dragon = state.pieces.find(p => p.type === PT.DRAGON);
  const traitor = state.pieces.find(p => p.type === PT.TRAITOR);
  const accomplice = state.pieces.find(p => p.type === PT.ACCOMPLICE);

  state.pieces.forEach(p => {

    if (p.unplaced || p.isMaceObject) return;

    let val = 0;

    switch(p.type) {
      case PT.KING: val = 10000; break;
      case PT.DRAGON: val = 1500; break;
      case PT.TRAITOR: val = 900; break;
      case PT.ACCOMPLICE: val = 800; break;
      case PT.LONGSHIP:
      case PT.KINGSHIP: val = 700; break;
      default: val = 200;
    }

    // =========================
    // AI PIECES
    // =========================
    if (p.player === aiPlayer) {

      score += val;

      const progress = aiPlayer === PL.VIKING ? (12 - p.row) : p.row;
      score += progress * 20;

      // ---- MACE KING HUNT ----
      if (p.hasMace && oppKing) {
        const d = dist(p.row, p.col, oppKing.row, oppKing.col);
        score += (26 - d) * 200;
      }

      // ---- DRAGON AGGRESSION ----
      if (p.type === PT.DRAGON) {

        score += 1200;

        if (oppKing) {
          const d = dist(p.row, p.col, oppKing.row, oppKing.col);
          score += (20 - d) * 200;
        }

      }

      // =========================
      // SHIP STRATEGY
      // =========================
      if (SHIP_TYPES.includes(p.type) && p.shipCells) {

        let waterAround = 0;
        let islandSides = 0;

        p.shipCells.forEach(([r,c]) => {

          const adj = [[1,0],[-1,0],[0,1],[0,-1]];

          adj.forEach(([dr,dc]) => {

            const rr = r + dr;
            const cc = c + dc;

            if (!isInBounds(rr,cc)) return;

            if (isWater(rr,cc)) waterAround++;
            else islandSides++;

          });

        });

        // avoid drifting in ocean
        if (waterAround > 6) score -= 1200;

        // reward bridge formation
        if (islandSides >= 2) score += 1000;

        // ---- SEEK SOLDIERS TO EMBARK ----
        let nearestSoldierDist = 100;

        state.pieces.forEach(f => {

          if (
            f.player === aiPlayer &&
            HUNTER_TYPES.includes(f.type)
          ) {

            const onShip = getShipAt(state.pieces, f.row, f.col);
            if (onShip) return;

            const d = dist(p.row, p.col, f.row, f.col);
            nearestSoldierDist = Math.min(nearestSoldierDist, d);

          }

        });

        if (nearestSoldierDist < 8) {
          score += (20 - nearestSoldierDist) * 120;
        } else {
          score -= 800;
        }

        // ---- FAVOR COAST SOLDIERS ----
        state.pieces.forEach(f => {

          if (
            f.player === aiPlayer &&
            HUNTER_TYPES.includes(f.type)
          ) {

            const adj = [[1,0],[-1,0],[0,1],[0,-1]];

            adj.forEach(([dr,dc]) => {

              const rr = f.row + dr;
              const cc = f.col + dc;

              if (isInBounds(rr,cc) && isWater(rr,cc)) {

                const d = dist(p.row, p.col, f.row, f.col);
                score += (20 - d) * 60;

              }

            });

          }

        });

        // reward ships carrying units
        p.shipCells.forEach(([r,c]) => {

          const cargo = getPieceAt(state.pieces, r, c);

          if (cargo && cargo.player === aiPlayer) {
            score += 800;
          }

        });

      }

      // ---- CAPTURE ENEMY HUNTERS ----
      state.pieces.forEach(enemy => {

        if (enemy.player === opp && enemy.type !== PT.KING) {

          if (canSandwich(state, aiPlayer, enemy)) {
            score += 400;
          }

        }

      });

      // ---- NEUTRAL HUNTING ----
      if (dragon && dragon.player !== aiPlayer) {
        const d = dist(p.row, p.col, dragon.row, dragon.col);
        score += (20 - d) * 80;
      }

      if (traitor && traitor.player !== aiPlayer) {
        const d = dist(p.row, p.col, traitor.row, traitor.col);
        score += (20 - d) * 70;
      }

      if (accomplice && accomplice.player !== aiPlayer) {
        const d = dist(p.row, p.col, accomplice.row, accomplice.col);
        score += (20 - d) * 60;
      }

    }

    // =========================
    // ENEMY PIECES
    // =========================
    else if (p.player === opp) {

      score -= val;

      if (p.hasMace && aiKing) {
        const d = dist(p.row, p.col, aiKing.row, aiKing.col);
        score -= (26 - d) * 250;
      }

      if (
        p.type === PT.DRAGON ||
        p.type === PT.TRAITOR ||
        p.type === PT.ACCOMPLICE
      ) {
        score -= 2000;
      }

    }

    // =========================
    // NEUTRAL PIECES
    // =========================
    else {

      let neutralValue = 0;

      if (p.type === PT.DRAGON) neutralValue = 2500;
      else if (p.type === PT.TRAITOR) neutralValue = 1200;
      else if (p.type === PT.ACCOMPLICE) neutralValue = 1000;

      const aiNearest = state.pieces
        .filter(f => f.player === aiPlayer)
        .reduce((min, f) => Math.min(min, dist(p.row, p.col, f.row, f.col)), 26);

      const oppNearest = state.pieces
        .filter(f => f.player === opp)
        .reduce((min, f) => Math.min(min, dist(p.row, p.col, f.row, f.col)), 26);

      score += (oppNearest - aiNearest) * 120;

      if (canSandwich(state, aiPlayer, p)) score += neutralValue;
      if (enemyCanRecruit(state, opp, p)) score -= neutralValue * 1.2;

    }

  });

  return score;

}


// --- MINIMAX ---
function minimax(state, depth, alpha, beta, maximizing, aiPlayer, startTime) {
  if (depth === 0 || state.winner || Date.now() - startTime > 1800) return evaluate(state, aiPlayer);

  const turnPlayer = maximizing ? aiPlayer : (aiPlayer === PL.VIKING ? PL.MARAUDER : PL.VIKING);
  const moves = [];
  state.pieces.filter(p => p.player === turnPlayer).forEach(p => {
    getValidMoves(state.pieces, p).forEach(m => moves.push({ piece: p, move: m }));
  });

  // Heuristic Ordering: Score wins and captures higher to prune faster
  moves.sort((a, b) => {
    if (a.move.row === 6) return -1;
    return 0;
  });

  if (maximizing) {
    let maxEval = -Infinity;
    for (const m of moves) {
      const ev = minimax(applyMove(state, m.piece, m.move.row, m.move.col, m.move.shipCells), depth - 1, alpha, beta, false, aiPlayer, startTime);
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      const ev = minimax(applyMove(state, m.piece, m.move.row, m.move.col, m.move.shipCells), depth - 1, alpha, beta, true, aiPlayer, startTime);
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// --- MAIN LISTENER ---
self.onmessage = function(e) {
  const { state, aiPlayer, type } = e.data;
  const startTime = Date.now();

  // Ship Placement Strategy
  if (type === 'PLACEMENT') {
    const { moves } = e.data;
    const bestPlacement = moves.sort((a, b) => {
      const distCenter = Math.abs(a.col - 6);
      const distFront = aiPlayer === PL.VIKING ? a.row : (12 - a.row);
      return (distCenter + distFront) - (Math.abs(b.col - 6) + (aiPlayer === PL.VIKING ? b.row : (12 - b.row)));
    })[0];
    self.postMessage({ placement: bestPlacement });
    return;
  }

  // Iterative Deepening
  let bestMove = null;
  const moves = [];
  state.pieces.filter(p => p.player === aiPlayer).forEach(p => {
    getValidMoves(state.pieces, p).forEach(m => moves.push({ piece: p, move: m }));
  });

  for (let d = 1; d <= 4; d++) {
    let currentBestScore = -Infinity;
    for (const m of moves) {
      const score = minimax(applyMove(state, m.piece, m.move.row, m.move.col, m.move.shipCells), d - 1, -Infinity, Infinity, false, aiPlayer, startTime);
      if (score > currentBestScore) {
        currentBestScore = score;
        bestMove = m;
      }
      if (Date.now() - startTime > 1800) break;
    }
    if (Date.now() - startTime > 1800) break;
  }

  self.postMessage(bestMove);
};
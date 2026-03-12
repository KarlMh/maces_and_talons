import { PIECE_TYPES, PLAYERS } from '../game/constants.js';
import { getValidMoves, applyMove, applyTraitorAbility, checkWinCondition, HUNTER_TYPES } from '../game/logic.js';

// increase depth to look 3–4 moves ahead; higher makes AI stronger but slower
const MAX_DEPTH = 2;

// piece values used by evaluation
const PIECE_VALUES = {
  [PIECE_TYPES.KING]: 150,
  [PIECE_TYPES.DRAGON]: 60,
  [PIECE_TYPES.TRAITOR]: 40,
  [PIECE_TYPES.ACCOMPLICE]: 40,
  [PIECE_TYPES.LONGSHIP]: 30,
  [PIECE_TYPES.KINGSHIP]: 30,
  [PIECE_TYPES.HUNTER]: 10,
};

// ==================== EVALUATION ====================
function evaluate(state, aiPlayer) {
  if (state.winner === aiPlayer) return 100000;
  if (state.winner && state.winner !== aiPlayer) return -100000;

  const { pieces } = state;
  const human = aiPlayer === PLAYERS.VIKING ? PLAYERS.MARAUDER : PLAYERS.VIKING;

  let score = 0;

  const aiPieces = pieces.filter(p => p.player === aiPlayer && !p.isMaceObject);
  const humanPieces = pieces.filter(p => p.player === human && !p.isMaceObject);

  // piece values sum
  aiPieces.forEach(p => { score += PIECE_VALUES[p.type] || 0; });
  humanPieces.forEach(p => { score -= PIECE_VALUES[p.type] || 0; });

  // extra bonus for controlling special neutrals
  aiPieces.forEach(p => {
    if (p.type === PIECE_TYPES.DRAGON) score += 20;
    if (p.type === PIECE_TYPES.TRAITOR) score += 15;
    if (p.type === PIECE_TYPES.ACCOMPLICE) score += 15;
  });
  humanPieces.forEach(p => {
    if (p.type === PIECE_TYPES.DRAGON) score -= 20;
    if (p.type === PIECE_TYPES.TRAITOR) score -= 15;
    if (p.type === PIECE_TYPES.ACCOMPLICE) score -= 15;
  });

  // mace control
  const aiHasMace = aiPieces.some(p => p.hasMace);
  const humanHasMace = humanPieces.some(p => p.hasMace);
  if (aiHasMace) score += 60;
  if (humanHasMace) score -= 60;

  // mobility bonus (more options = more control)
  aiPieces.forEach(p => { score += getValidMoves(state, p).length * 0.5; });
  humanPieces.forEach(p => { score -= getValidMoves(state, p).length * 0.5; });

  // king safety and threat penalties
  const aiKing = pieces.find(p => p.type === PIECE_TYPES.KING && p.player === aiPlayer);
  const humanKing = pieces.find(p => p.type === PIECE_TYPES.KING && p.player === human);
  function threatened(piece) {
    if (!piece) return false;
    const opponent = piece.player === PLAYERS.VIKING ? PLAYERS.MARAUDER : PLAYERS.VIKING;
    const enemies = pieces.filter(p => p.player === opponent && HUNTER_TYPES.includes(p.type));
    for (const e of enemies) {
      const moves = getValidMoves(state, e);
      if (moves.some(m => m.row === piece.row && m.col === piece.col)) return true;
    }
    return false;
  }

  if (aiKing && threatened(aiKing)) score -= 80;
  if (humanKing && threatened(humanKing)) score += 80;

  // dragon positioning: reward being near enemy hunters
  aiPieces.filter(p => p.type === PIECE_TYPES.DRAGON).forEach(d => {
    const dists = humanPieces
      .filter(h => HUNTER_TYPES.includes(h.type))
      .map(h => Math.abs(h.row - d.row) + Math.abs(h.col - d.col));
    if (dists.length) score += (20 - Math.min(...dists)) * 1.5;
  });
  humanPieces.filter(p => p.type === PIECE_TYPES.DRAGON).forEach(d => {
    const dists = aiPieces
      .filter(h => HUNTER_TYPES.includes(h.type))
      .map(h => Math.abs(h.row - d.row) + Math.abs(h.col - d.col));
    if (dists.length) score -= (20 - Math.min(...dists)) * 1.5;
  });

  // piece near friendly ship bonus
  function nearFriendlyShip(piece) {
    if (!piece) return 0;
    const ships = aiPieces.filter(p => [PIECE_TYPES.LONGSHIP, PIECE_TYPES.KINGSHIP].includes(p.type));
    for (const s of ships) {
      if (s.shipCells && s.shipCells.some(([r, c]) => Math.abs(r - piece.row) + Math.abs(c - piece.col) <= 1)) {
        return 5;
      }
    }
    return 0;
  }
  aiPieces.forEach(p => { score += nearFriendlyShip(p); });
  // subtract for opponent
  function nearEnemyShip(piece) {
    if (!piece) return 0;
    const ships = humanPieces.filter(p => [PIECE_TYPES.LONGSHIP, PIECE_TYPES.KINGSHIP].includes(p.type));
    for (const s of ships) {
      if (s.shipCells && s.shipCells.some(([r, c]) => Math.abs(r - piece.row) + Math.abs(c - piece.col) <= 1)) {
        return 5;
      }
    }
    return 0;
  }
  humanPieces.forEach(p => { score -= nearEnemyShip(p); });

  return score;
}

// ==================== GET ALL MOVES ====================
function getAllMovesForPlayer(state, player) {
  const moves = [];
  const playerPieces = state.pieces.filter(p => p.player === player &&
    [PIECE_TYPES.HUNTER, PIECE_TYPES.KING, PIECE_TYPES.TRAITOR, PIECE_TYPES.ACCOMPLICE,
     PIECE_TYPES.LONGSHIP, PIECE_TYPES.KINGSHIP].includes(p.type)
  );

  for (const piece of playerPieces) {
    const validMoves = getValidMoves(state, piece);
    for (const move of validMoves) {
      moves.push({ piece, move });
    }
  }
  return moves;
}

// ==================== MINIMAX ====================
function minimax(state, depth, alpha, beta, maximizing, aiPlayer) {
  const winner = checkWinCondition(state);
  if (winner || depth === 0) {
    return evaluate(state, aiPlayer);
  }

  const currentPlayer = maximizing ? aiPlayer : (aiPlayer === PLAYERS.VIKING ? PLAYERS.MARAUDER : PLAYERS.VIKING);

  // Handle pending traitor ability before generating normal moves
  if (state.pendingTraitor && state.pendingTraitor.player === currentPlayer) {
    const opponent = currentPlayer === PLAYERS.VIKING ? PLAYERS.MARAUDER : PLAYERS.VIKING;
    const enemyHunters = state.pieces.filter(p => p.player === opponent && HUNTER_TYPES.includes(p.type));
    let bestVal = maximizing ? -Infinity : Infinity;

    const skipState = { ...state, pendingTraitor: null };
    const skipEval = minimax(skipState, depth, alpha, beta, maximizing, aiPlayer);
    bestVal = maximizing ? Math.max(bestVal, skipEval) : Math.min(bestVal, skipEval);
    if (maximizing) alpha = Math.max(alpha, skipEval); else beta = Math.min(beta, skipEval);

    for (const target of enemyHunters) {
      const newState = applyTraitorAbility(state, target.id);
      const val = minimax(newState, depth, alpha, beta, maximizing, aiPlayer);
      bestVal = maximizing ? Math.max(bestVal, val) : Math.min(bestVal, val);
      if (maximizing) alpha = Math.max(alpha, val); else beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }

    return bestVal;
  }

  let allMoves = getAllMovesForPlayer(state, currentPlayer);
  if (allMoves.length === 0) return evaluate(state, aiPlayer);

  // order moves to explore promising ones first (captures, etc.)
  allMoves.sort((a, b) => {
    const va = evaluate(applyMove(state, a.piece, a.move.row, a.move.col, a.move.shipCells), aiPlayer);
    const vb = evaluate(applyMove(state, b.piece, b.move.row, b.move.col, b.move.shipCells), aiPlayer);
    return maximizing ? vb - va : va - vb;
  });

  if (maximizing) {
    let maxEval = -Infinity;
    for (const { piece, move } of allMoves) {
      const newState = applyMove(state, piece, move.row, move.col, move.shipCells);
      const evalScore = minimax(newState, depth - 1, alpha, beta, false, aiPlayer);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const { piece, move } of allMoves) {
      const newState = applyMove(state, piece, move.row, move.col, move.shipCells);
      const evalScore = minimax(newState, depth - 1, alpha, beta, true, aiPlayer);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

// ==================== BEST MOVE ====================
// Iterative deepening with time limit: search at depth 1, 2, 3... until time runs out
const TIME_LIMIT_MS = 800; // Stop search after ~800ms to stay responsive

export function getBestMove(state, aiPlayer) {
  const startTime = Date.now();
  
  // if there's a pending traitor ability this player may choose to use it
  if (state.pendingTraitor && state.pendingTraitor.player === aiPlayer) {
    const opponent = aiPlayer === PLAYERS.VIKING ? PLAYERS.MARAUDER : PLAYERS.VIKING;
    const enemyHunters = state.pieces.filter(p => p.player === opponent && HUNTER_TYPES.includes(p.type));
    let bestScore = -Infinity;
    let bestAction = { type: 'SKIP' };

    const skipEval = minimax({ ...state, pendingTraitor: null }, 1, -Infinity, Infinity, false, aiPlayer);
    bestScore = skipEval;

    for (const target of enemyHunters) {
      if (Date.now() - startTime > TIME_LIMIT_MS) break;
      const newState = applyTraitorAbility(state, target.id);
      const score = minimax(newState, 1, -Infinity, Infinity, false, aiPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestAction = { type: 'TRAITOR', targetId: target.id };
      }
    }

    if (bestAction.type === 'TRAITOR') {
      console.log('[AI] Activating traitor on target', bestAction.targetId);
      return { traitor: true, targetId: bestAction.targetId };
    }
    console.log('[AI] Skipping traitor activation');
    return { type: 'SKIP_TRAITOR' };
  }

  const allMoves = getAllMovesForPlayer(state, aiPlayer);
  if (allMoves.length === 0) {
    console.warn('[AI] No moves available for', aiPlayer);
    return null;
  }
  console.log('[AI] Found', allMoves.length, 'possible moves for', aiPlayer);

  // look for immediate winning move
  for (const { piece, move } of allMoves) {
    const newState = applyMove(state, piece, move.row, move.col, move.shipCells);
    if (newState.winner === aiPlayer) {
      console.log('[AI] Found instant win!');
      return { piece, move };
    }
  }

  // iterative deepening: search at depth 1, 2, 3... until time limit
  let bestMove = null;
  let bestScore = -Infinity;

  for (let depth = 1; depth <= 4; depth++) {
    if (Date.now() - startTime > TIME_LIMIT_MS) {
      console.log('[AI] Time limit reached at depth', depth);
      break;
    }
    
    console.log('[AI] Searching depth', depth);
    let depthBestMove = null;
    let depthBestScore = -Infinity;
    const shuffled = [...allMoves].sort(() => Math.random() - 0.5);

    for (const { piece, move } of shuffled) {
      if (Date.now() - startTime > TIME_LIMIT_MS) break;
      
      const newState = applyMove(state, piece, move.row, move.col, move.shipCells);
      const score = minimax(newState, depth - 1, -Infinity, Infinity, false, aiPlayer);
      if (score > depthBestScore) {
        depthBestScore = score;
        depthBestMove = { piece, move };
      }
    }

    if (depthBestMove) {
      bestMove = depthBestMove;
      bestScore = depthBestScore;
    }
  }

  const elapsed = Date.now() - startTime;
  if (bestMove) {
    console.log('[AI] Best move:', bestMove.piece.type, 'to', bestMove.move.row, bestMove.move.col, 'score:', bestScore, 'time:', elapsed, 'ms');
  }
  return bestMove;
}

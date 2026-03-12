// ai/masterAI.js

import {
  getValidMoves,
  applyMove,
  applyTraitorAbility,
  getPlacementMoves,
  checkWinCondition
} from "../game/logic.js";

import { PIECE_TYPES, PLAYERS } from "../game/constants.js";

const MAX_DEPTH = 6;
const TIME_LIMIT = 900;

const PIECE_VALUE = {
  [PIECE_TYPES.KING]: 200,
  [PIECE_TYPES.DRAGON]: 70,
  [PIECE_TYPES.TRAITOR]: 60,
  [PIECE_TYPES.ACCOMPLICE]: 60,
  [PIECE_TYPES.HUNTER]: 20
};

let transposition = new Map();

function opponent(p) {
  return p === PLAYERS.VIKING ? PLAYERS.MARAUDER : PLAYERS.VIKING;
}

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function evaluate(state, ai) {

  if (state.winner === ai) return 100000;
  if (state.winner && state.winner !== ai) return -100000;

  const enemy = opponent(ai);
  const pieces = state.pieces;

  let score = 0;

  const aiPieces = pieces.filter(p => p.player === ai);
  const enemyPieces = pieces.filter(p => p.player === enemy);

  for (const p of aiPieces)
    score += PIECE_VALUE[p.type] || 0;

  for (const p of enemyPieces)
    score -= PIECE_VALUE[p.type] || 0;

  const aiMace = pieces.find(p => p.player === ai && p.hasMace);
  const enemyMace = pieces.find(p => p.player === enemy && p.hasMace);

  if (aiMace) score += 120;
  if (enemyMace) score -= 120;

  const enemyKing = pieces.find(p => p.type === PIECE_TYPES.KING && p.player === enemy);
  const aiKing = pieces.find(p => p.type === PIECE_TYPES.KING && p.player === ai);

  if (aiMace && enemyKing) {
    const d = manhattan(aiMace, enemyKing);
    score += (20 - d) * 10;
  }

  if (enemyMace && aiKing) {
    const d = manhattan(enemyMace, aiKing);
    score -= (20 - d) * 10;
  }

  return score;
}

function getAllMoves(state, player) {

  const moves = [];

  const pieces = state.pieces.filter(p =>
    p.player === player &&
    !p.isMaceObject
  );

  for (const piece of pieces) {

    const valid = getValidMoves(state, piece);

    for (const m of valid) {
      moves.push({
        piece,
        move: m
      });
    }
  }

  return moves;
}

function scoreMove(state, piece, move) {

  let score = 0;

  const target = state.pieces.find(
    p => p.row === move.row && p.col === move.col
  );

  if (target)
    score += 500;

  if (piece.hasMace)
    score += 300;

  if (piece.type === PIECE_TYPES.DRAGON)
    score += 100;

  return score;
}

function hashState(state) {
  return JSON.stringify(
    state.pieces.map(p => [
      p.id,
      p.row,
      p.col,
      p.player,
      p.hasMace
    ])
  );
}

function minimax(state, depth, alpha, beta, maximizing, ai) {

  const hash = hashState(state);

  if (transposition.has(hash))
    return transposition.get(hash);

  const winner = checkWinCondition(state);

  if (winner)
    return winner === ai ? 100000 : -100000;

  if (depth === 0)
    return evaluate(state, ai);

  const player = maximizing ? ai : opponent(ai);

  const moves = getAllMoves(state, player)
    .sort((a, b) =>
      scoreMove(state, b.piece, b.move) -
      scoreMove(state, a.piece, a.move)
    );

  if (maximizing) {

    let value = -Infinity;

    for (const { piece, move } of moves) {

      const newState = applyMove(
        cloneState(state),
        piece,
        move.row,
        move.col,
        move.shipCells
      );

      const evalScore = minimax(
        newState,
        depth - 1,
        alpha,
        beta,
        false,
        ai
      );

      value = Math.max(value, evalScore);
      alpha = Math.max(alpha, value);

      if (beta <= alpha)
        break;
    }

    transposition.set(hash, value);
    return value;

  } else {

    let value = Infinity;

    for (const { piece, move } of moves) {

      const newState = applyMove(
        cloneState(state),
        piece,
        move.row,
        move.col,
        move.shipCells
      );

      const evalScore = minimax(
        newState,
        depth - 1,
        alpha,
        beta,
        true,
        ai
      );

      value = Math.min(value, evalScore);
      beta = Math.min(beta, value);

      if (beta <= alpha)
        break;
    }

    transposition.set(hash, value);
    return value;
  }
}

function getBestPlacement(state, ai) {

  const placements = getPlacementMoves(
    state.pieces,
    state.placingShipType,
    ai
  );

  let best = null;
  let bestScore = -Infinity;

  for (const p of placements) {

    let score = 0;

    const avgRow =
      p.shipCells.reduce((a, [r]) => a + r, 0) /
      p.shipCells.length;

    if (ai === PLAYERS.VIKING)
      score += (12 - avgRow) * 5;
    else
      score += avgRow * 5;

    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }

  return best;
}

export function getBestMove(state, ai) {

  if (
    state.gamePhase === "SHIP_PLACEMENT" &&
    state.placementTurn === ai
  ) {

    const placement = getBestPlacement(state, ai);

    if (placement)
      return {
        placement: true,
        ...placement
      };

    return null;
  }

  transposition.clear();

  let bestMove = null;
  let bestScore = -Infinity;

  const moves = getAllMoves(state, ai)
    .sort((a, b) =>
      scoreMove(state, b.piece, b.move) -
      scoreMove(state, a.piece, a.move)
    );

  for (const { piece, move } of moves) {

    const newState = applyMove(
      cloneState(state),
      piece,
      move.row,
      move.col,
      move.shipCells
    );

    const score = minimax(
      newState,
      MAX_DEPTH - 1,
      -Infinity,
      Infinity,
      false,
      ai
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = {
        piece,
        move
      };
    }
  }

  return bestMove;
}
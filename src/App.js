import React, { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className={`square ${isWinningSquare ? 'winning' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  return (
    <div className="board">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          onSquareClick={() => handleClick(index)}
          isWinningSquare={winningSquares && winningSquares.includes(index)}
        />
      ))}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const winner = calculateWinner(currentSquares);
  let status;
  let winningSquares;
  if (winner) {
    status = 'Winner: ' + winner.player;
    winningSquares = winner.line;
  } else if (isBoardFull(currentSquares)) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const moves = history.map((squares, move) => {
    const description = move ? 'Go to move #' + move : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winningSquares={winningSquares}
        />
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <button onClick={restartGame}>Restart</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        player: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}

function isBoardFull(squares) {
  return squares.every((square) => square !== null);
}

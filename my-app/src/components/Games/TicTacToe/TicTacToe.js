// src/components/TicTacToe.js
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
 // Ensure to add your CSS here

const TicTacToe = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [value, setValue] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [gameBoard, setGameBoard] = useState(Array(9).fill(""));
  const [whosTurn, setWhosTurn] = useState("X's Turn");
  const [allPlayers, setAllPlayers] = useState([]);

  const socket = io();

  useEffect(() => {
    socket.on("find", (e) => {
      const foundObject = e.allPlayers.find(
        (obj) => obj.p1.p1name === name || obj.p2.p2name === name
      );

      if (foundObject) {
        setOpponentName(
          foundObject.p1.p1name === name
            ? foundObject.p2.p2name
            : foundObject.p1.p1name
        );
        setValue(foundObject.p1.p1name === name ? "X" : "O");
        setWhosTurn(foundObject.sum % 2 === 0 ? "O's Turn" : "X's Turn");
      }
    });

    socket.on("playing", (e) => {
      const foundObject = e.allPlayers.find(
        (obj) => obj.p1.p1name === name || obj.p2.p2name === name
      );
      if (foundObject) {
        const newGameBoard = [...gameBoard];
        if (foundObject.p1.p1move) newGameBoard[foundObject.p1.p1move] = "X";
        if (foundObject.p2.p2move) newGameBoard[foundObject.p2.p2move] = "O";
        setGameBoard(newGameBoard);

        setWhosTurn(foundObject.sum % 2 === 0 ? "O's Turn" : "X's Turn");
      }
    });

    return () => {
      socket.off("find");
      socket.off("playing");
    };
  }, [gameBoard, name]);

  const handleFindPlayer = () => {
    if (name) {
      socket.emit("find", { name });
    }
  };

  const handleClick = (index) => {
    if (gameBoard[index] === "") {
      socket.emit("playing", { value, id: index, name });
    }
  };

  const handleGameOver = () => {
    socket.emit("gameOver", { name });
  };

  const checkWinner = () => {
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
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
        setTimeout(() => {
          alert(`${gameBoard[a]} wins!`);
          handleGameOver();
        }, 500);
        return;
      }
    }

    if (!gameBoard.includes("")) {
      setTimeout(() => {
        alert("It's a draw!");
        handleGameOver();
      }, 500);
    }
  };

  useEffect(() => {
    checkWinner();
  }, [gameBoard]);

  return (
    <div className="game-container">
      <h1>Tic-Tac-Toe</h1>
      {!userName ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleFindPlayer}>Find Player</button>
        </div>
      ) : (
        <div>
          <p>You: {name}</p>
          <p>Opponent: {opponentName}</p>
          <p>You're playing as: {value}</p>
          <p>{whosTurn}</p>
          <div className="game-board">
            {gameBoard.map((cell, index) => (
              <button
                key={index}
                className="btn"
                onClick={() => handleClick(index)}
                disabled={cell !== ""}
              >
                {cell}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;

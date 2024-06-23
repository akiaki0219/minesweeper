import {useState, useEffect} from 'react';
import CreateBoard from './CreateBoard';
import Cell from './Cell';

const Board = ({row, col, mines}) => {
  const [gameData, setGameData] = useState({});
  const [resetGame, setResetGame] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const newBoard = CreateBoard(row, col, mines);
    console.log(newBoard);
    setGameData({
      board: newBoard,
      gameStatus: 'Game in Progress',
      cellsWithoutMines: row*col - mines,
      numOfMines: mines
    });
    setResetGame(false);
    setCount(0);
  },
  // eslint-disable-next-line
  [resetGame]);

  const revealEmpty = (x, y, data) => {
    if (data.board[x][y].revealed) {return;}

    data.board[x][y].revealed = true;
    data.cellsWithoutMines--;
    if (data.cellsWithoutMines === 0) {
      data.gameStatus = 'You Win';
    }
    if (data.board[x][y].value === 0) {
      for (let y2 = Math.max(y-1, 0); y2 < Math.min(y+2, col); y2++) {
        for (let x2 = Math.max(x-1, 0); x2 < Math.min(x+2, row); x2++) {
          if (x2 !== x || y2 !== y) {revealEmpty(x2, y2, data);}
        }
      }
    }
    return data;
  }

  const handleUpdateFlag = (e, x, y) => {
    e.preventDefault();
    if (gameData.gameStatus === 'You Lost' || gameData.gameStatus === 'You Win') {return;}
    if (gameData.board[x][y].revealed) {return;}

    setGameData((prev) => {
      const newBoard = [...prev.board];
      const newFlag = !newBoard[x][y].flagged;
      let newNumOfMines = prev.numOfMines;
      newFlag ? newNumOfMines-- : newNumOfMines++;
      newBoard[x][y].flagged = newFlag;

      return {
        ...prev,
        numOfMines: newNumOfMines,
        board: newBoard
      }
    });
  }
  const handleRevealCell = (x, y) => {
    if (gameData.gameStatus === 'You Lost' || gameData.gameStatus === 'You Win') {return;}
    if (gameData.board[x][y].revealed || gameData.board[x][y].flagged) {return;}

    const newGameData = {...gameData};
    if (newGameData.board[x][y].value === 'X') {
      for (let y2 = 0; y2 < col; y2++) {
        for (let x2 = 0; x2 < row; x2++) {
          newGameData.board[x2][y2].revealed = true;
        }
      }
      newGameData.gameStatus = 'You Lost';
    }
    else if (newGameData.board[x][y].value === 0) {
      const newRevealedData = revealEmpty(x, y, newGameData);
      setGameData(newRevealedData);
      return;
    }
    else {
      newGameData.board[x][y].revealed = true;
      newGameData.cellsWithoutMines--;
      if (newGameData.cellsWithoutMines === 0) {
        newGameData.gameStatus = 'You Win';
      }
    }
    setGameData(newGameData);
  }

  if (!gameData.board) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <div>
        🚩 {gameData.numOfMines} &nbsp;&nbsp;
        ⏰ {count} &nbsp;&nbsp;
        <button onClick={() => {setResetGame(true);}}>Reset</button>
      </div>
      <div>Game Status: {gameData.gameStatus}</div>
      <div>
        {gameData.board.map((singleRow, index1) => {
          return (
            <div style={{display: 'flex'}} key={index1}>{
              singleRow.map((singleCell, index2) => {
                return <Cell details={singleCell} onUpdateFlag={handleUpdateFlag} onRevealCell={handleRevealCell} key={index2} />
                }
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Board;

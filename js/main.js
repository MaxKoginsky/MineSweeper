'use strict'

var gBoard

var gLevel = {
    beginner: { SIZE: 4, MINES: 2 },
    medium: { SIZE: 8, MINES: 14 },
    expert: { SIZE: 12, MINES: 32 }
  }

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  isOver: false,
  timerInterval: null
}


function onInit(difficulty = 'beginner') {
    var level = gLevel[difficulty]
    gLevel.SIZE = level.SIZE
    gLevel.MINES = level.MINES
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.isOver = false
    gBoard = createBoard()
    setMinesNegsCount()
    renderBoard()
  }

function createBoard() {
    var board = []
  
    for (var i = 0; i < gLevel.SIZE; i++) {
      board.push([])
      for (var j = 0; j < gLevel.SIZE; j++) {
        board[i].push({
          minesAroundCount: 0,
          isShown: false,
          isMine: false,
          isMarked: false
        })
      }
    }
  
    // placeMines(board)
  
    return board
  }

  function firstClick(row, col) {
    placeMines(gBoard, row, col)
    setMinesNegsCount()
    expandShown(gBoard, document.querySelector(`.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`), row, col)
    checkGameOver()
  }


  function placeMines(board, row, col) {
    var minesCount = 0
  
    while (minesCount < gLevel.MINES) {
      var randomRow = getRandomInt(0, gLevel.SIZE)
      var randomCol = getRandomInt(0, gLevel.SIZE)
  
      if (
        !board[randomRow][randomCol].isMine &&
        !(randomRow === row && randomCol === col) &&
        !isNeighbor(row, col, randomRow, randomCol)
      ) {
        board[randomRow][randomCol].isMine = true
        minesCount++
        //here i am
      }
    }
  }
  ///check why not working
  function isNeighbor(row1, col1, row2, col2) {
    return (
      Math.abs(row1 - row2) <= 1 &&
      Math.abs(col1 - col2) <= 1
    )
  }

  function restartGame() {
    var difficulty = ''
    if (gLevel.SIZE === 4) {
      difficulty = 'beginner'
    } else if (gLevel.SIZE === 8) {
      difficulty = 'medium'
    } else if (gLevel.SIZE === 12) {
      difficulty = 'expert'
    }
    onInit(difficulty)
  }

  function setMinesNegsCount() {
    for (var i = 0; i < gLevel.SIZE; i++) {
      for (var j = 0; j < gLevel.SIZE; j++) {
        var cell = gBoard[i][j]
  
        if (!cell.isMine) {
          cell.minesAroundCount = countNeighborMines(i, j)
          //im here
        }
      }
    }
  }

  function countNeighborMines(row, col) {
    var count = 0
  
    for (var i = row - 1; i <= row + 1; i++) {
      for (var j = col - 1; j <= col + 1; j++) {
        if (i === row && j === col) {
          continue
        }
  
        if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
          if (gBoard[i][j].isMine) {
            count++
          }
        }
      }
    }
  
    return count
  }

function setDifficulty(difficulty) {
    onInit(difficulty)
  }


  function renderBoard() {
    var boardContainer = document.getElementById('board')
    boardContainer.innerHTML = ''
    boardContainer.className = ''
    if (gLevel.SIZE === 4){
        boardContainer.classList.add('beginner')
    } else if (gLevel.SIZE === 8) {
        boardContainer.classList.add('medium')
      } else if (gLevel.SIZE === 12) {
        boardContainer.classList.add('expert')
      }
    
  
    for (var i = 0; i < gLevel.SIZE; i++) {
      var rowContainer = document.createElement('div')
      rowContainer.className = 'row'

    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = gBoard[i][j]
      var cellClass = 'cell'

      if (cell.isShown) {
        cellClass += ' shown'
      }

      if (cell.isMarked) {
        cellClass += ' marked'
      }

      if (cell.isMine && cell.isShown) {
        cellClass += ' mine'
      }

      var cellElement = document.createElement('div')
      cellElement.className = cellClass
      cellElement.textContent = cell.isShown && cell.minesAroundCount > 0 ? cell.minesAroundCount : ''
      cellElement.onclick = onCellClicked.bind(null, i, j)
      cellElement.oncontextmenu = markCell.bind(null, i, j)

      rowContainer.appendChild(cellElement)
    }

    boardContainer.appendChild(rowContainer)
  }

  var remainingMines = gLevel.MINES - gGame.markedCount
  document.getElementById('remaining-mines').textContent = remainingMines
  document.getElementById('timer').textContent = gGame.secsPassed
  //console.log(gBoard)
}
//last changed
function expandShown(board, elCell, row, col) {
  if (!board[row][col].isShown && !board[row][col].isMarked) {
    board[row][col].isShown = true
    gGame.shownCount++
    elCell.classList.add('shown')
    elCell.textContent = board[row][col].minesAroundCount > 0 ? board[row][col].minesAroundCount : ''

    if (board[row][col].minesAroundCount === 0) {
      for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
          if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
            expandShown(board, document.querySelector(`.row:nth-child(${i + 1}) .cell:nth-child(${j + 1})`), i, j)
          }
        }
      }
    }
  }
}

function onCellClicked(row, col) {
  var cell = gBoard[row][col]

  if (gGame.isOver) {
    return
  }
//check timer
  if (!gGame.isOn) {
    gGame.isOn = true
    startTimer()
  }

  if (!cell.isShown && !cell.isMarked) {
    if (cell.isMine) {
      cell.isShown = true
      renderBoard()
      gGame.isOver = true
      gameOver()
      return
    }
    //to check!/
    if (gGame.shownCount === 0) {
      firstClick(row, col)
    } else {
      expandShown(gBoard, document.querySelector(`.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`), row, col)
      checkGameOver()
    }
  }
}

function startTimer() {
  gGame.timerInterval = setInterval(function() {
    gGame.secsPassed++
    document.getElementById('timer').textContent = gGame.secsPassed
    ///you are here 
  }, 1000)
}

function markCell(row, col) {
  var cell = gBoard[row][col]

  if (!gGame.isOn || gGame.isOver) {
    return false
  }

  if (!cell.isShown) {
    if (!cell.isMarked && gGame.markedCount === gLevel.MINES) {
      return false
    }

    cell.isMarked = !cell.isMarked
    gGame.markedCount += cell.isMarked ? 1 : -1
    renderBoard()
    checkGameOver()
  }

  return false
}

function checkGameOver() {
  var totalCells = gLevel.SIZE * gLevel.SIZE
  var totalMines = gLevel.MINES

  if (
    gGame.markedCount === totalMines &&
    gGame.shownCount === totalCells - totalMines
  ) {

    gameOver(true)
  }
}

function gameOver(isWin = false) {
  gGame.isOn = false

  
  if (isWin) {
    setTimeout(function() {
      clearInterval(gGame.timerInterval)
      alert('You won!')
    }, 500)
    
  } else {
    for (var i = 0; i < gLevel.SIZE; i++) {
      for (var j = 0; j < gLevel.SIZE; j++) {
        if (gBoard[i][j].isMine) {
          gBoard[i][j].isShown = true
        }
      }
    }
    renderBoard()
    clearInterval(gGame.timerInterval)

    setTimeout(function() {
      alert('Game over!')
    }, 500)
  }
}


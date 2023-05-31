'use strict'

var gBoard

var gLevel = {
  SIZE: 4,
  MINES: 2
}

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0
  
}


function onInit() {
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

  placeMines(board)

  return board
}


function placeMines(board) {
  var minesCount = 0

  while (minesCount < gLevel.MINES) {
    var row = getRandomInt(0, gLevel.SIZE)
    var col = getRandomInt(0, gLevel.SIZE)

    if (!board[row][col].isMine) {
      board[row][col].isMine = true
      minesCount++
    }
  }
}

function setMinesNegsCount() {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = gBoard[i][j]

      if (!cell.isMine) {
        cell.minesAroundCount = countNeighborMines(i, j)
      }
    }
  }
}

function countNeighborMines(row, col) {
  var count = 0

  for (var i = row - 1; i <= row + 1; i++) {
    for (var j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
        if (gBoard[i][j].isMine) {
          count++
        }
      }
    }
  }

  return count
}


function renderBoard() {
  var boardContainer = document.getElementById('board')
  boardContainer.innerHTML = ''

  for (var i = 0; i < gLevel.SIZE; i++) {
    var rowContainer = document.createElement('div')
    rowContainer.className = 'row'

    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = gBoard[i][j]
      var cellClass = 'cell'

      // if (cell.isShown) {
      //   cellClass += ' shown'
      // }

      if (cell.isMarked) {
        cellClass += ' marked'
      }

      if (cell.isMine && cell.isShown) {
        cellClass += ' mine'
      }

      var cellElement = document.createElement('div')
      cellElement.className = cellClass
      cellElement.textContent = cell.isShown ? cell.minesAroundCount : ''
      cellElement.onclick = onCellClicked.bind(null, i, j)
      cellElement.oncontextmenu = markCell.bind(null, i, j)

      rowContainer.appendChild(cellElement)
    }

    boardContainer.appendChild(rowContainer)
  }
  //console.log(gBoard)
}

function onCellClicked(row, col) {
  var cell = gBoard[row][col]

  if (!gGame.isOn) {
    gGame.isOn = true
    // Start the game timer
    // startTimer();
  }

  if (!cell.isShown && !cell.isMarked) {
    if (cell.isMine) {
    
      gameOver()
      return
    }
    cell.isShown = true
    gGame.shownCount++
    renderBoard()
    checkGameOver()
  }
}

function markCell(row, col) {
  var cell = gBoard[row][col]

  if (!gGame.isOn) {
    gGame.isOn = true
    // need to put here timer
    // startTimer();
  }

  if (!cell.isShown) {
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
  
  // Stop timer
  // stopTimer();
  
  if (isWin) {
    // alert('You won!')
  } else {
    for (var i = 0; i < gLevel.SIZE; i++) {
      for (var j = 0; j < gLevel.SIZE; j++) {
        if (gBoard[i][j].isMine) {
          gBoard[i][j].isShown = true
        }
      }
    }
    renderBoard()

    // setTimeout(function() {
    //   alert('Game over!')
    // }, 500)
  }
}
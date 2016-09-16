document.addEventListener('DOMContentLoaded', function (e) {

    // TODO: Should these be properties on the window object?
    var GAME_ROOT_LENGTH = 70
    var CELL_LENGTH = 10

    initializeGameState(GAME_ROOT_LENGTH, GAME_ROOT_LENGTH)

    var gameRoot = document.getElementById('gameRoot')
    populateGridElements(gameRoot, GAME_ROOT_LENGTH, CELL_LENGTH)

    // Run game at 30 FPS
    setInterval(function() {
        onGameTick(GAME_ROOT_LENGTH)
    }, 1/30*1000)

})

function initializeGameState(numberOfRows, numberOfCellsPerRow) {
    var gameState = new Array(numberOfRows)

    for (var i = 0; i<gameState.length; i++) {
        gameState[i] = new Array(numberOfCellsPerRow)
    }

    // TODO: Should the gameState be a property of the window object or should we pass
    // it around?
    window.gameState = gameState
}

function randomBinary() {
    return Math.floor(Math.random() + 0.5)
}

function getDiv(className) {
    var el = document.createElement('DIV')
    el.classList.add(className)
    return el
}

function populateGridElements(gameRoot, gameRootLength, cellLength) {
    for (var i=0; i<gameRootLength; i++) {
        var newRow = getDiv('row')

        for (var j=0; j<gameRootLength; j++) {
            var newCell = getDiv('cell')

            if (randomBinary()) {
                newCell.classList.add('on')
            }

            newCell.style.left = j*cellLength + 'px'
            newCell.setAttribute('data-x-coordinate', i)
            newCell.setAttribute('data-y-coorderinate', j)
            newRow.appendChild(newCell)
            window.gameState[i][j] = newCell
        }

        newRow.style.top = i*cellLength + 'px'
        gameRoot.appendChild(newRow)
    }
}

// Gets the state for a cell based on the rules of the game
function getStateByCount(isCurrentlyAlive, numberOfNeighbours) {
    var newState = null;

    if (isCurrentlyAlive) {
        if (numberOfNeighbours < 2) {
            // Living cell dies due to under-population
            newState = false
        } else if (numberOfNeighbours === 2 || numberOfNeighbours === 3) {
            // Adequate population to remain alive
            newState = true
        } else {
            // Count must be > 3, living cell dies due to over-population
            newState = false
        }
    } else {
        if (numberOfNeighbours === 3) {
            // Dead cell is born due to correct conditions
            newState = true
        } else {
            // Otherwise cell remains dead
            newState = false
        }
    }

    return newState
}

function getNeighbourCount(cell) {
    var currentX = Number(cell.getAttribute('data-x-coordinate'))
    var currentY = Number(cell.getAttribute('data-y-coorderinate'))
    var count = 0

    // TODO: Try to find a more elegant way to inspect all 8 neighbours
    // Top left
    if (gameState[currentX-1] && gameState[currentX-1][currentY-1]) {
        if (gameState[currentX-1][currentY-1].classList.contains('on')) {
            count++
        }
    }
    // Above
    if (gameState[currentX][currentY-1]) {
        if (gameState[currentX][currentY-1].classList.contains('on')) {
            count++;
        }
    }
    // Top right
    if (gameState[currentX+1] && gameState[currentX+1][currentY-1]) {
        if (gameState[currentX+1][currentY-1].classList.contains('on')) {
            count++
        }
    }
    // Left
    if (gameState[currentX-1] && gameState[currentX-1][currentY]) {
        if (gameState[currentX-1][currentY].classList.contains('on')) {
            count++
        }
    }
    // Right
    if (gameState[currentX+1] && gameState[currentX+1][currentY]) {
        if (gameState[currentX+1][currentY].classList.contains('on')) {
            count++
        }
    }
    // Bottom left
    if (gameState[currentX-1] && gameState[currentX-1][currentY+1]) {
        if (gameState[currentX-1][currentY+1].classList.contains('on')) {
            count++
        }
    }
    // Below
    if (gameState[currentX][currentY+1]) {
        if (gameState[currentX][currentY+1].classList.contains('on')) {
            count++
        }
    }
    // Bottom right
    if (gameState[currentX+1] && gameState[currentX+1][currentY+1]) {
        if (gameState[currentX+1][currentY+1].classList.contains('on')) {
            count++
        }
    }

    return count
}

function setCellState(cell) {
    var isCurrentlyAlive = cell.classList.contains('on')
    var numberOfNeighbours = getNeighbourCount(cell)

    if (getStateByCount(isCurrentlyAlive, numberOfNeighbours)) {
        cell.classList.add('on')
    } else {
        cell.classList.remove('on')
    }
}

function onGameTick(gameRootLength) {
    for (var i=0; i<gameRootLength; i++) {
        for(var j=0; j<gameRootLength; j++) {
            setCellState(window.gameState[i][j])
        }
    }
}

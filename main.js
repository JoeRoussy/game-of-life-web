document.addEventListener('DOMContentLoaded', function (e) {

    // TODO: Should these be properties on the window object?
    var GAME_ROOT_LENGTH = 70
    var CELL_LENGTH = 10

    initializeGameState(GAME_ROOT_LENGTH, GAME_ROOT_LENGTH)

    var gameRoot = document.getElementById('gameRoot')
    populateGridElements(gameRoot, GAME_ROOT_LENGTH, CELL_LENGTH)

    // TODO: Set interval for each iteration of the game

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
            newRow.appendChild(newCell)
            window.gameState[i][j] = newCell
        }

        newRow.style.top = i*cellLength + 'px'
        gameRoot.appendChild(newRow)
    }
}

// TODO: Create function to run on each iteration of the game
function onGameTick(gameRootLength) {
    for (var i=0; i<gameRootLength; i++) {
        for(var j=0; j<gameRootLength; i++) {
            // TODO: Count number of 'on' cells adjacent to this one and set this cell according to the rules of the game
        }
    }
}

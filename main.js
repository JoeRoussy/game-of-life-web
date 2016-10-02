document.addEventListener('DOMContentLoaded', function (e) {

    var GAME_ROOT_LENGTH = 70
    var CELL_LENGTH = 10

    initializeGameState(GAME_ROOT_LENGTH, GAME_ROOT_LENGTH)

    var gameRoot = document.getElementById('gameRoot')
    populateGridElements(gameRoot, GAME_ROOT_LENGTH, CELL_LENGTH)

    // NOTE: We use a virtual representation of the DOM to improve game performance.
    // In previous versions, the DOM was queried at multiple time per frame since key information
    // about a cell such as its state and position on the board were stored only in its class list
    // and data attributes respectively. However, this method of state managements was replaced with
    // a single 2D array containing an object for each cell on the board. Each object contains
    // the state and position of the cell along with a reference to the associated DOM element.
    // Thus, we only interact with the DOM when the state of the cell is changed (which
    // is at most, once per frame for every cell and amounts to changing an element's classList).
    // We refer to the associated elements in the store for queries about an elements position and state.
    // The caused a 42% decrease in the time taken to run a single frame. Note that a frame is the amount
    // of time it takes to update all cells on the board, or in other words, a round of the game.
    //
    // Interestingly, when the virtual DOM was not used, the performance of the game was dependent
    // on how much activity was occuring on the board. However, the frame rate when using the virtual
    // DOM representation remains rather constent for all amounts of board activity. This does not make
    // sense as each cell is examined in the same way regardless of whether its state is going to be changed.
    // Since there was a universal reduction in the amount of DOM queries executed during a frame, we would
    // not expect to see even more performance benefits during times of high board activity. Addressing this
    // issue also reuqires an explination for why more board activity caused the game to run slower even though
    // the DOM was queried the same amount of times per frame regardless of how many cells were changing state.
    // Perhaps the answer lies in some kind of caching used by the DOM wherein queries on a cell that was not
    // changing state were faster than on one that changed state frequently, an effect which went away once
    // queries on game state were on a store with O(1) time complexity for queries.

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
    // it around? Instead, consider passing it into the onGameTick function and having
    // that function modify it.
    window.gameState = gameState
}

// Has a probability of 0.05 to return true
// TODO: Allow users to input their own value for the probability a cell begins as on.
// Should probably implement a build process since form validation and listeners that would
// go along with this should be broken out in a separate module.
function randomBinary() {
    return !!Math.floor(Math.random() <= 0.05)
}

function getDiv(className) {
    var el = document.createElement('div')
    el.classList.add(className)
    return el
}

function populateGridElements(gameRoot, gameRootLength, cellLength) {
    for (var i=0; i<gameRootLength; i++) {
        var newRow = getDiv('row')

        for (var j=0; j<gameRootLength; j++) {
            var newCell = getDiv('cell')
            var isOn = randomBinary()

            if (isOn) {
                newCell.classList.add('on')
            }

            newCell.style.left = j*cellLength + 'px'
            newRow.appendChild(newCell)

            // Each element of the game state is a representation of the cell at
            // the same position on the game board, with useful aspects of the cell's
            // state included to minimize DOM queries. The DOM element itself is also
            // cached in case its state (on or off) needs to be changed.
            gameState[i][j] = {
                isOn,
                position: {
                    x: i,
                    y: j
                },
                domElement: newCell
            }
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
    var currentX = cell.position.x
    var currentY = cell.position.y
    var count = 0

    // TODO: Try to find a more elegant way to inspect all 8 neighbours. Maybe
    // defining the rules using a config object would be better. Each rule in the config
    // would have a coordinate defining the relative position of the cell to test for being on

    // Top left
    if (gameState[currentX-1] && gameState[currentX-1][currentY-1]) {
        if (gameState[currentX-1][currentY-1].isOn) {
            count++
        }
    }
    // Above
    if (gameState[currentX][currentY-1]) {
        if (gameState[currentX][currentY-1].isOn) {
            count++
        }
    }
    // Top right
    if (gameState[currentX+1] && gameState[currentX+1][currentY-1]) {
        if (gameState[currentX+1][currentY-1].isOn) {
            count++
        }
    }
    // Left
    if (gameState[currentX-1] && gameState[currentX-1][currentY]) {
        if (gameState[currentX-1][currentY].isOn) {
            count++
        }
    }
    // Right
    if (gameState[currentX+1] && gameState[currentX+1][currentY]) {
        if (gameState[currentX+1][currentY].isOn) {
            count++
        }
    }
    // Bottom left
    if (gameState[currentX-1] && gameState[currentX-1][currentY+1]) {
        if (gameState[currentX-1][currentY+1].isOn) {
            count++
        }
    }
    // Below
    if (gameState[currentX][currentY+1]) {
        if (gameState[currentX][currentY+1].isOn) {
            count++
        }
    }
    // Bottom right
    if (gameState[currentX+1] && gameState[currentX+1][currentY+1]) {
        if (gameState[currentX+1][currentY+1].isOn) {
            count++
        }
    }

    return count
}

function setCellState(cell) {
    var newState = getStateByCount(cell.isOn, getNeighbourCount(cell))

    if (newState !== cell.isOn) {
        // Must interact with the DOM to update color of cell.
        if (newState) {
            cell.domElement.classList.add('on')
            cell.isOn = true
        } else {
            cell.domElement.classList.remove('on')
            cell.isOn = false
        }
    }
}

function onGameTick(gameRootLength) {
    for (var i=0; i<gameRootLength; i++) {
        for (var j=0; j<gameRootLength; j++) {
            setCellState(gameState[i][j])
        }
    }
}

document.addEventListener('DOMContentLoaded', function (e) {

    // TODO: Should these be properties on the window object?
    var GAME_ROOT_LENGTH = 70
    var CELL_LENGTH = 10

    initializeGameState(GAME_ROOT_LENGTH, GAME_ROOT_LENGTH)

    var gameRoot = document.getElementById('gameRoot')
    populateGridElements(gameRoot, GAME_ROOT_LENGTH, CELL_LENGTH)

    // Try and run game at 30 FPS
    // NOTE: Basic tests showed the game runs at 20FPS on my machine
    // with a full board (50ms per frame). Note that with an empty, static
    // board, the game runs a 28FPS (35ms per frame).

    // NOTE: Implementing a virtual representation of the DOM improved game performance.
    // Previsouly, the DOM was queried at multiple time per frame. Now, we only interact
    // with the DOM when the state of the cell is changed (which is at most, once per frame
    // for every cell). After implementing this change, the game runs at about 28FPS (35ms
    // per frame) regardless of board state. As the game runs for a long period of time with
    // many changes happening per frame, each frame can take up to 40ms. However, reducing the
    // number of DOM queries was still helpful as frames with a busy board used to take 50ms.

    // TODO: Try seeing if keeping a virtual representation of the DOM yields better performance
    // than caching actual DOM elements. These virtual DOM elements should have all the values we
    // are interested in (coordinates, isOn etc.) and a reference to the real DOM element it represents.
    // The DOM should only be used when nessesary (such as when the state of a cell needs to change, and at
    // the begining of the game during set up).
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

// Has a probability of 0.05 to return true
// TODO: Allow users to input their own value for the probability a cell begins as on.
// Should probably implement a build process since form validation and listeners that would
// go along with this should be broken out in a separate module.
function randomBinary() {
    return !!Math.floor(Math.random() <= 0.05)
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

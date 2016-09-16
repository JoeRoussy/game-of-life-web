document.addEventListener('DOMContentLoaded', function (e) {

    var gameRoot = document.getElementById('gameRoot')
    populateGridElements(gameRoot)

})

function randomBinary() {
    return Math.floor(Math.random() + 0.5)
}

function getDiv(className) {
    var el = document.createElement('DIV')
    el.classList.add(className)
    return el
}

function populateGridElements(gameRoot) {
    var GAME_ROOT_LENGTH = 70
    var CELL_LENGTH = 10

    for (var i=0; i<GAME_ROOT_LENGTH; i++) {
        var newRow = getDiv('row')

        for (var j=0; j<GAME_ROOT_LENGTH; j++) {
            var newCell = getDiv('cell')

            if (randomBinary()) {
                newCell.classList.add('on')
            }

            newCell.style.left = j*CELL_LENGTH + 'px'
            newRow.appendChild(newCell)
        }

        newRow.style.top = i*CELL_LENGTH + 'px'
        gameRoot.appendChild(newRow)
    }
}

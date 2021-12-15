let
    X = true,
    gameMode = 3,
    boardArray = [],
    gameHistory = [],
    dm = []

renderBoard()
function renderBoard() {
    const tiles = []

    let index = 0

    for (let i = 0; i < gameMode; i++) {
        for (let j = 0; j < gameMode; j++) {
            const tile = boardArray[index]

            if (!dm[i]) dm[i] = []
            if (!dm[i][j]) dm[i][j] = []
            dm[i][j] = tile

            tiles.push(`
                <div class="tile" onclick="tileClicked(${index},${i},${j})">
                        ${tile ? `<div class="${tile}">${tile}</div>` : ''}
                </div>`)
            if (!boardArray[index])
                boardArray[index] = ''
            index++
        }
    }
    const board = document.querySelector('#board')
    board.innerHTML = tiles.join('')
    board.style.width = `${gameMode * 100}px`
    document.querySelector('h2').innerHTML = `${X ? 'X' : 'O'} Turn`
}

function tileClicked(index, i, j) {
    if (!boardArray[index]) {
        gameHistory.push([...boardArray])
        boardArray[index] = X ? 'X' : 'O'
        X = !X
        renderBoard()
        checkGame(i, j)
    }
}

function checkGame(i, j) {
    const winning = {
        row: dm[i],
        col: dm.map(row => row[j]),
        d1: dm.map((row, a) => row[a]),
        d2: dm.reverse().map((row, a) => row[a])
    }

    let win = false
    Object.keys(winning).forEach(w => {
        const r = winning[w]
        if (r.every(t => (t && t == r[0]))) {
            document.querySelector('h2').innerHTML = (`${X ? 'O' : 'X'} Win! ${w} ${w == 'row' ? i : w == 'col' ? j : ''}`)

            win = true
        }
    })

    if (!win && boardArray.every(t => t))
        document.querySelector('h2').innerHTML = 'Tie'
}

document.querySelector('#resetBtn').onclick = resetGame
function resetGame() {
    boardArray.forEach((t, i) => boardArray[i] = '')
    gameHistory = []
    X = true
    renderBoard()
}

document.querySelector('#backBtn').onclick = goBack
function goBack() {
    const lastStep = gameHistory.pop()
    if (lastStep) {
        lastStep.forEach((tile, i) => boardArray[i] = tile)
        X = !X
        renderBoard()
    }
}

document.querySelector('#saveBtn').onclick = save
function save() {
    localStorage.savedGame = JSON.stringify(boardArray)
    alert('The Game Saved')
}

document.querySelector('#loadBtn').onclick = load
function load() {
    if (localStorage.savedGame) {
        boardArray = JSON.parse(localStorage.savedGame)
        renderBoard()
    }
}
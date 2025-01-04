let turn = true
let gameboard = [];

function setGameboard() {
    turn = true
    gameboard = [];
    for (let i = 0; i < 6; i++) {
        gameboard.push([]);
        for (let j = 0; j < 7; j++) {
            gameboard[i].push('');
            document.getElementById(`circle-${i}-${j}`).style.backgroundColor = '#00004E';
        }
    }
}

function putToken(col) {
    colNum = parseInt(col.charAt(col.length - 1))
    for (let i = gameboard.length-1; i >= 0; i--) {
        if (gameboard[i][colNum] == '') {
            if (turn) {
                gameboard[i][colNum] = 'R';
                turn = !turn;
                document.getElementById("turnText").textContent = "Yellow\'s Turn";
                return [i, colNum, 'red'];
            }
            else {
                gameboard[i][colNum] = 'Y';
                turn = !turn;
                document.getElementById('turnText').textContent = "Red\'s Turn";
                return [i, colNum, 'yellow'];
            }
        }
    }

    return [-1, -1, null];
}

function checkForWin(row, col, color) {
    if (color == 'red') {
        color = 'R'
    }
    else if (color == 'yellow') {
        color = 'Y'
    }

    // horizontal
    count = 0
    for (let i = -3; i <= 3; i++) {
        if (col+i >= 0 && col+i < gameboard[row].length && gameboard[row][col+i] == color) {
            count++
        }
        else {
            count = 0
        }

        if (count == 4) {
            return true
        }
    }

    // vertical
    count = 0
    for (let i = -3; i <= 3; i++) {
        if (row+i >= 0 && row+i < gameboard.length && gameboard[row+i][col] == color) {
            count++
        }
        else {
            count = 0
        }

        if (count == 4) {
            return true
        }
    }

    // down diagonal
    count = 0
    for (let i = -3; i <= 3; i++) {
        if (row+i >= 0 && row+i < gameboard.length && col+i >= 0 && col+i < gameboard[row].length && gameboard[row+i][col+i] == color) {
            count++
        }
        else {
            count = 0
        }

        if (count == 4) {
            return true
        }
    }

    // up diagonal
    count = 0
    for (let i = -3; i <= 3; i++) {
        if (row-i >= 0 && row-i < gameboard.length && col+i >= 0 && col+i < gameboard[row].length && gameboard[row-i][col+i] == color) {
            count++
        }
        else {
            count = 0
        }

        if (count == 4) {
            return true
        }
    }
}

setGameboard();

const divs = document.querySelectorAll('.selected-col');
handlers = [];

const resetButton = document.querySelector('.btn-reset');

var resetClick = function() {
    var handler = function(event) {
        setGameboard();
        document.getElementById('turnText').textContent = "Red\'s Turn";

        divs.forEach((d, i) => {
            d.removeEventListener('click', handlers[i])
        });

        handlers = [];
        
        divs.forEach(div => {
            div.addEventListener('click', colClick(div));
        });
    }

    return handler;
}

var colClick = function(div) {
    var handler = function(event) {
        const [row, col, color] = putToken(div.id);
        if (color) {
            const circle = document.getElementById(`circle-${row}-${col}`);
            circle.style.backgroundColor = color;
            if (checkForWin(row, col, color)) {
                const capitalizeColor = color.charAt(0).toUpperCase() + color.slice(1);
                document.getElementById("turnText").textContent = `${capitalizeColor} Wins!`;
                divs.forEach((d, i) => {
                    d.removeEventListener('click', handlers[i])
                });
            }
        }
    }

    handlers.push(handler)
    return handler
}

divs.forEach(div => {
    div.addEventListener('click', colClick(div));
});

resetButton.addEventListener('click', resetClick());
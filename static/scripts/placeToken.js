let turn = true
let gameboard = [];
for (let i = 0; i < 6; i++) {
    gameboard.push([]);
    for (let j = 0; j < 7; j++) {
        gameboard[i].push('');
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

const divs = document.querySelectorAll('.selected-col');
divs.forEach(div => {
    div.addEventListener('click', () => {
        const [row, col, color] = putToken(div.id);
        if (color) {
            const circle = document.getElementById(`circle-${row}-${col}`);
            circle.style.backgroundColor = color;
        }
    });
});
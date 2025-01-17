let turn = true
let gameboard = [];

// function putToken(col) {
//     colNum = parseInt(col.charAt(col.length - 1))
//     for (let i = gameboard.length-1; i >= 0; i--) {
//         if (gameboard[i][colNum] == '') {
//             if (turn) {
//                 gameboard[i][colNum] = 'R';
//                 turn = !turn;
//                 document.getElementById("turnText").textContent = "Yellow\'s Turn";
//                 return [i, colNum, 'red'];
//             }
//             else {
//                 gameboard[i][colNum] = 'Y';
//                 turn = !turn;
//                 document.getElementById('turnText').textContent = "Red\'s Turn";
//                 return [i, colNum, 'yellow'];
//             }
//         }
//     }

//     return [-1, -1, null];
// }

// function checkForWin(row, col, color) {
//     if (color == 'red') {
//         color = 'R'
//     }
//     else if (color == 'yellow') {
//         color = 'Y'
//     }

//     // horizontal
//     count = 0
//     for (let i = -3; i <= 3; i++) {
//         if (col+i >= 0 && col+i < gameboard[row].length && gameboard[row][col+i] == color) {
//             count++
//         }
//         else {
//             count = 0
//         }

//         if (count == 4) {
//             return true
//         }
//     }

//     // vertical
//     count = 0
//     for (let i = -3; i <= 3; i++) {
//         if (row+i >= 0 && row+i < gameboard.length && gameboard[row+i][col] == color) {
//             count++
//         }
//         else {
//             count = 0
//         }

//         if (count == 4) {
//             return true
//         }
//     }

//     // down diagonal
//     count = 0
//     for (let i = -3; i <= 3; i++) {
//         if (row+i >= 0 && row+i < gameboard.length && col+i >= 0 && col+i < gameboard[row].length && gameboard[row+i][col+i] == color) {
//             count++
//         }
//         else {
//             count = 0
//         }

//         if (count == 4) {
//             return true
//         }
//     }

//     // up diagonal
//     count = 0
//     for (let i = -3; i <= 3; i++) {
//         if (row-i >= 0 && row-i < gameboard.length && col+i >= 0 && col+i < gameboard[row].length && gameboard[row-i][col+i] == color) {
//             count++
//         }
//         else {
//             count = 0
//         }

//         if (count == 4) {
//             return true
//         }
//     }
// }

async function setGameboard() {
    console.log('resetting gameboard');
    await fetch('reset', { method: 'POST' });
    console.log('reset done');
}

const divs = document.querySelectorAll('.selected-col');
const resetButton = document.querySelector('.btn-reset');

// Array to store event handler references
const handlers = [];

var resetClick = async function(event) {    
    // Reset the backend game state
    await fetch('/reset', { method: 'POST' });

    // Reset the frontend state
    document.getElementById('turnText').textContent = "Red's Turn";

    // Clear the board's visuals
    const circles = document.querySelectorAll('.circle');
        circles.forEach(circle => {
            circle.style.backgroundColor = ''; // Reset to default (usually transparent or white)
        });

    // Remove old event listeners
    divs.forEach((div, i) => {
        div.removeEventListener('click', handlers[i]);
    });

    // Clear and reattach new listeners
    handlers.length = 0; // Clear handlers array
    divs.forEach(div => {
        const handler = colClick(div); // Get new handler
        handlers.push(handler); // Store it
        div.addEventListener('click', handler); // Attach it
    });

};

var colClick = function(div) {
    return async function(event) {
        let data = { id: div.id }; // Send div ID as data
        let response = await fetch('/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        let result = await response.json();
        const { row, col, color } = result;

        if (color) {
            const circle = document.getElementById(`circle-${row}-${col}`);
            if (circle) circle.style.backgroundColor = color;

            data = { row: row, col: col, color: color }; // Send div ID as data
            response = await fetch('/check-win', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            result = await response.json();
            const winner = result.winner;

            if (winner) {
                const capitalizeColor = color.charAt(0).toUpperCase() + color.slice(1);
                document.getElementById("turnText").textContent = `${capitalizeColor} Wins!`;

                // Remove all event listeners after the game ends
                divs.forEach((div, i) => {
                    div.removeEventListener('click', handlers[i]);
                });
            }
        }
    };
};

// Attach event listeners on page load
divs.forEach(div => {
    const handler = colClick(div);
    handlers.push(handler);
    div.addEventListener('click', handler);
});

// Attach reset button event listener
resetButton.addEventListener('click', resetClick);
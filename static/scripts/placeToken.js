let gameboard = [];
for (let i = 0; i < 6; i++) {
    gameboard.push([]);
    for (let j = 0; j < 5; j++) {
        gameboard[i].push('');
    }
}

const divs = document.querySelectorAll('.selected-col');
divs.forEach(div => {
    div.addEventListener('click', () => {
        alert(`Clicked ${div.id}`);
    })
});
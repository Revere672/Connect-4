from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)

turn = True
gameboard = []

def setGameboard():
    global turn
    global gameboard

    turn = True
    gameboard = []
    for i in range(6):
        gameboard.append([])
        for j in range(7):
            gameboard[i].append('')

@app.route('/move', methods=['POST'])
def putToken():
    data = request.get_json()
    col = data['id']

    global turn
    global gameboard

    colNum = int(col[len(col) - 1])
    for i in range(len(gameboard)-1, -1, -1):
        if gameboard[i][colNum] == '':
            if turn:
                gameboard[i][colNum] = 'R'
                turn = not turn
                return jsonify({'row': i, 'col': colNum, 'color': 'red'})
            else:
                gameboard[i][colNum] = 'Y'
                turn = not turn
                return jsonify({'row': i, 'col': colNum, 'color': 'yellow'})
    
    return jsonify({'row': -1, 'col': -1, 'color': None}), 400

@app.route('/check-win', methods=['POST'])
def checkForWin():
    data = request.get_json()
    row = data['row']
    col = data['col']
    color = data['color']

    global gameboard

    if color == 'red':
        color = 'R'
    elif color == 'yellow':
        color = 'Y'

    # horizontal
    count = 0
    for i in range(-3, 4):
        if col+i >= 0 and col+i < len(gameboard[row]) and gameboard[row][col+i] == color:
            count += 1
        else:
            count = 0
        
        if count == 4:
            return jsonify({'winner': True})
    
    # vertical
    count = 0
    for i in range(-3, 4):
        if row+i >= 0 and row+i < len(gameboard) and gameboard[row+i][col] == color:
            count += 1
        else:
            count = 0
        
        if count == 4:
            return jsonify({'winner': True})
    
    # down diagonal
    count = 0
    for i in range(-3, 4):
        if row+i >= 0 and row+i < len(gameboard) and col+i >= 0 and col+i < len(gameboard[row]) and gameboard[row+i][col+i] == color:
            count += 1
        else:
            count = 0
        
        if count == 4:
            return jsonify({'winner': True})
    
    # up diagonal
    count = 0
    for i in range(-3, 4):
        if row-i >= 0 and row-i < len(gameboard) and col+i >= 0 and col+i < len(gameboard[row]) and gameboard[row-i][col+i] == color:
            count += 1
        else:
            count = 0
        
        if count == 4:
            return jsonify({'winner': True})
    
    return jsonify({'winner': False})

setGameboard()

@app.route('/reset', methods=['POST'])
def resetGameboard():
    setGameboard()
    return jsonify({'ready': True})

@app.route('/play', methods=['GET', 'POST'])
def play():
    if request.method == 'POST':
        name = request.form['button_name']
        print(name)
        return redirect(url_for('game_board'))

    return render_template('index.html')

@app.route('/gameboard')
def game_board():
    return render_template('play.html')


if __name__ == '__main__':
    app.run(debug=True)
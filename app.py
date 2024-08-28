from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

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
    app.run()
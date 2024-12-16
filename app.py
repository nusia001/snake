from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

@app.route('/get_highscore', methods=['GET'])
def get_highscore():
    conn = mysql.connector.connect(
        host = "10.2.2.32",
        user = "root",
        password = "",
        database = "SnakeGame"
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT MAX(score) AS high_score FROM HighScore")
    result = cursor.fetchone()
    conn.close()
    return jsonify(result)

@app.route('/update_highscore', methods=['POST'])
def update_highscore():
    data = request.json
    new_score = data.get('score', 0)
    player_name = data.get('player_name', 'Unknown')

    conn = mysql.connector.connect(
         host = "10.2.2.32",
        user = "root",
        password = "",
        database = "SnakeGame"
    )
    cursor = conn.cursor(dictionary=True)

    # Finn nåværende høyeste score
    cursor.execute("SELECT MAX(score) AS high_score FROM HighScore")
    result = cursor.fetchone()
    high_score = result['high_score'] if result['high_score'] is not None else 0

    # Oppdater hvis den nye scoren er høyere
    if new_score > high_score:
        cursor.execute("INSERT INTO HighScore (player_name, score) VALUES (%s, %s)", (player_name, new_score))
        conn.commit()

    conn.close()
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True)
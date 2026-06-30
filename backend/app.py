from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    session,
    flash,
    redirect,
    url_for,
    get_flashed_messages,
    make_response,
    g,
)
from flask_cors import CORS
from config import SECRET_KEY
from common.connection import get_connection

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app)

conn = get_connection()
cursor = conn.cursor()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    cursor.execute(
        "SELECT * FROM users WHERE name = "+ "'"+ username +"'"+ " AND password = "+ "'"+ password + "'"
    )
    user = cursor.fetchone()

    if user:
        session['user_id'] = user[0]
        session['username'] = user[1]
        session['role'] = user[4]
        return jsonify({"message": "Login success"})

    else:
        return jsonify({"message": "Login failed"})

@app.route('/api/store/create',methods=['POST'])
def create_store():
    data = request.get_json()
    name = data.get('name')
    address = data.get('address')
    cursor.execute(
        "INSERT INTO stores (name, address) VALUES ("+ "'"+ name +"'"+ " AND password = "+ "'"+ address + "'"
    )
    conn.commit()
    return jsonify({"message": "Store created successfully"})
    


if __name__ == '__main__':
    app.run(debug=True)
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
    email = data.get('email')
    password = data.get('password')

    cursor.execute(
        "SELECT * FROM users WHERE email = "+ "'"+ email +"'"+ " AND password = "+ "'"+ password + "'"
    )
    user = cursor.fetchone()

    if user:
        session['user_id'] = user[0]
        session['username'] = user[1]
        session['role'] = user[4]
        session['store_id'] = user[5]
        return jsonify({"message": "Login success"})

    else:
        return jsonify({"message": "Login failed"})

##super Admin

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

@app.route('/api/product/create',methods=['POST'])
def create_product():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    category = data.get('category')
    store_id = session.get('store_id')
    cursor.execute(
        "INSERT INTO products (name, price, category, store_id) VALUES ("+ "'"+ name +"'"+ ", "+ "'"+ price +"'"+ ", "+ "'"+ category +"'"+ ", "+ "'"+ str(store_id) +"'")

    conn.commit()
    return jsonify({"message": "Product created successfully"})

@app.route('/api/supplier/create',methods=['POST'])
def create_supplier():
    data = request.get_json()
    name = data.get('name')
    phone_number = data.get('phoneNumber')
    address = data.get('address')
    cursor.execute(
        "INSERT INTO suppliers (name, phone_number, address) VALUES ("+ "'"+ name +"'"+ ", "+ "'"+ phone_number +"'"+ ", "+ "'"+ address +"'"+")"
    )
    conn.commit()
    return jsonify({"message": "Supplier created successfully"})

@app.route('/api/user/create',methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    cursor.execute(
        "INSERT INTO users (name, email, password, role) VALUES ("+ "'"+ name +"'"+ ", "+ "'"+ email +"'"+ ", "+ "'"+ password +"'"+ ", "+ "'"+ role +"'"+")"
    )
    conn.commit()
    return jsonify({"message": "User created successfully"})

if __name__ == '__main__':
    app.run(debug=True)
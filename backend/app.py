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
from psycopg2.extras import execute_values
from middleware.LoginAuth import login_required
import bcrypt

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

conn = get_connection()
cursor = conn.cursor()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    cursor.execute(
        "SELECT id,name,email,store_id,role,password FROM users WHERE email = "+ "'"+ email +"'"
    )
    user = cursor.fetchone()

    if user:
        column = [desc[0] for desc in cursor.description]
        user = dict(zip(column, user))

        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            session['user_id'] = user['id']
            session['username'] = user['name']
            session['role'] = user['role']
            session['store_id'] = user['store_id']
            return jsonify({"isLoggedIn": True, "role": user['role']})

    return jsonify({"isLoggedIn": False})

##super Admin

@app.route('/api/store',methods=['GET'])
@login_required
def get_stores():
    cursor.execute(
        "SELECT id,name FROM stores"
    )
    stores = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    stores = [dict(zip(columns, row)) for row in stores]
    return jsonify({"stores": stores})

@app.route('/api/store/create',methods=['POST'])
@login_required
def create_store():
    data = request.get_json()
    name = data.get('name')
    address = data.get('address')
    cursor.execute(
        "INSERT INTO stores (name, address) VALUES (%s, %s)",
        (name, address)
    )
    conn.commit()
    return jsonify({"message": "Store created successfully"})


@app.route('/api/product/create',methods=['POST'])
@login_required
def create_product():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    category = data.get('category')
    store_id = session.get('store_id')
    cursor.execute(
        "INSERT INTO products (name, price, category, store_id) VALUES (%s, %s, %s, %s)",
        (name, price, category, store_id)
    )

    conn.commit()
    return jsonify({"message": "Product created successfully"})

@app.route('/api/supplier/create',methods=['POST'])
@login_required
def create_supplier():
    data = request.get_json()
    name = data.get('name')
    phone_number = data.get('phoneNumber')
    address = data.get('address')
    cursor.execute(
        "INSERT INTO suppliers (name, phone_number, address) VALUES (%s, %s, %s)",
        (name, phone_number, address)
    )
    conn.commit()
    return jsonify({"message": "Supplier created successfully"})

@app.route('/api/user/create',methods=['POST'])
@login_required
def create_user_admin():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    store_id = data.get('store_id')
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cursor.execute(
        "INSERT INTO users (name, email, password, store_id, role) VALUES (%s, %s, %s, %s, %s)",
        (name, email, hashed_password, store_id, 'Admin')
    )
    conn.commit()
    return jsonify({"message": "User created successfully"})

@app.route('/api/product', methods=['GET'])
@login_required
def get_products():
    cursor.execute(
        "SELECT id, name, price, category FROM products"
    )
    columns = [desc[0] for desc in cursor.description]
    products = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return jsonify({"products": products})

@app.route('/api/transactions', methods=['GET'])
@login_required
def get_transactions():
    store_id = session.get('store_id')
    cursor.execute(
        """
        SELECT id,total_price,amount_paid,change,payment_method
        FROM transactions
        WHERE store_id = %s 
        """,(store_id,)
    )
    result = cursor.fetchall()
    column = [desc[0] for desc in cursor.description]
    transactions = [dict(zip(column,row)) for row in result]
    return jsonify({"transactions": transactions})

@app.route('/api/transaction/<id>',methods=['GET'])
@login_required
def get_transaction(id):
    cursor.execute(
        """
        SELECT * FROM transactions WHERE id = %s
        """,
        (id,)
    )
    result = cursor.fetchone()
    column = [desc[0] for desc in cursor.description]
    transaction = dict(zip(column,result))
    return jsonify({"transaction": transaction})

@app.route('/api/transaction/create', methods=['POST'])
@login_required
def create_transaction():
    data = request.get_json()
    store_id = session.get('store_id') 
    products = data.get('products')
    payment_method = data.get('payment_method')

    status = "Selesai"

    if payment_method == "Qris":
        status = "Pending"

    if not products:
        return jsonify({"message": "Keranjang kosong"}), 400

    total_price = sum(float(product['price']) * int(product['quantity']) for product in products)

    amount_paid = data.get('amount_paid')
    change = amount_paid - total_price

    try:
        cursor.execute(
            """
            INSERT INTO orders (store_id, total_price,payment_method,amount_paid,change,status) VALUES (%s, %s,%s,%s,%s,%s)
            RETURNING id
            """,
            (store_id, total_price,payment_method,amount_paid,change,status)
        )
        order_id = cursor.fetchone()[0]

        detail_insert = [
            (order_id, product['id'], int(product['quantity']), float(product['price']) * int(product['quantity']))
            for product in products
        ]
        
        execute_values(
            cursor,
            "INSERT INTO detail_order (order_id, product_id, quantity, total) VALUES %s",
            detail_insert
        )

        conn.commit()
        return jsonify({"message": "Order created successfully"})
    except Exception as e:
        conn.rollback()
        print(f"Error creating transaction: {e}")
        return jsonify({"message": f"Transaction failed: {str(e)}"}), 500

@app.route('/api/stock/create',methods=['POST'])
@login_required
def create_stock():
    data = request.get_json()
    product_id = data.get('product_id')
    supplier_id = data.get('supplier_id')
    store_id = session.get('store_id')

    # Gunakan parameterized query dan masukkan None agar diterjemahkan sebagai NULL oleh psycopg2
    cursor.execute(
        "INSERT INTO stocks (warehouse_id, product_id, supplier_id, store_id) VALUES (%s, %s, %s, %s)",
        (None, product_id, supplier_id, store_id)
    )
    conn.commit()
    return jsonify({"message": "Stock created successfully"})

@app.route('/api/stock/updateWarehouse')
@login_required
def get_warehouse_null():
    # Gunakan 'IS NULL' alih-alih '= NULL' karena perbandingan NULL di SQL harus menggunakan operator 'IS'
    cursor.execute(
        """
        SELECT id, product_id, supplier_id FROM stocks WHERE warehouse_id IS NULL AND store_id = %s
        """,
        (session['store_id'],)
    )
    result = cursor.fetchall()
    column = [desc[0] for desc in cursor.description]
    stocks = [dict(zip(column, row)) for row in result]
    return jsonify({"stocks": stocks})

    
    
if __name__ == '__main__':
    app.run(debug=True)
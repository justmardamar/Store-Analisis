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

@app.route('/api/store',methods=['GET'])
def get_stores():
    cursor.execute(
        "SELECT id,name FROM stores"
    )
    stores = cursor.fetchall()
    return jsonify({"stores": stores})

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
def create_user_admin():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    store_id = data.get('store_id')
    cursor.execute(
        "INSERT INTO users (name, email, password, store_id, role) VALUES ("+ "'"+ name +"'"+ ", "+ "'"+ email +"'"+ ", "+ "'"+ password +"'"+ ", "+ str(store_id) + ", "+ 'Admin' + ")")
    conn.commit()
    return jsonify({"message": "User created successfully"})

@app.route('/api/product', methods=['GET'])
def get_products():
    cursor.execute(
        "SELECT id, name, price, category FROM products"
    )
    columns = [desc[0] for desc in cursor.description]
    products = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return jsonify({"products": products})

@app.route('/api/transaction/create', methods=['POST'])
def create_transaction():
    data = request.get_json()
    store_id = session.get('store_id')
    products = data.get('products')
    detail_insert = []
    total_price = 0

    cursor.execute(
        """
        INSERT INTO transactions (store_id, total_price,payment) VALUES (%s, %s)
        RETURNING id
        """,
        (store_id, total_price,)
    )
    transaction_id = cursor.fetchone()[0]
    total_price = 0
    for product in products:
        cursor.executemany(
            """
            INSERT INTO detail_transaction (transaction_id, product_id, quantity, total) VALUES %s
            """,
            detail_insert
        )
    
    conn.commit()
    return jsonify({"message": "Order created successfully"})
    
@app.route('/api/warehouse/create',methods=['POST'])
def create_warehouse():
    data = request.get_json()
    location = data.get('location')
    store_id = session.get('store_id')
    cursor.execute(
        "SELECT location FROM warehouse WHERE location = "+ "'"+ location +"'"+ " AND store_id = "+ str(store_id)
    )
    warehouse = cursor.fetchone()
    if warehouse:
        return jsonify({"message": "Tempat Gudang sudah ada"})
    else:
        cursor.execute(
            "INSERT INTO warehouse (location, store_id) VALUES ("+ "'"+ location +"'"+ ", "+ str(store_id) + ")"
        )
        conn.commit()
        return jsonify({"message": "Warehouse created successfully"})

@app.route('/api/stock/create',methods=['POST'])
def create_stock():
    data = request.get_json()
    product_id = data.get('product_id')
    supplier_id = data.get('supplier_id')

    cursor.execute(
        "INSERT INTO stocks (warehouse_id,product_id, supplier_id) VALUES ("+ "'"+ "NULL" +"'"+ ", "+ "'"+ str(product_id) +"'"+ ", "+ "'"+ str(supplier_id) +"'"+ ")")
    conn.commit()
    return jsonify({"message": "Stock created successfully"})
    
    
if __name__ == '__main__':
    app.run(debug=True)
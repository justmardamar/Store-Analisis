from flask import Flask, request, jsonify, session
from flask_cors import CORS
from psycopg2.extras import execute_values
import bcrypt

from config import SECRET_KEY
from middleware.LoginAuth import login_required
from common.database import get_db_cursor

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# ================= ================= =================
# AUTHENTICATION
# ================= ================= =================

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"isLoggedIn": False, "message": "Email dan password wajib diisi"}), 400

    with get_db_cursor(commit=False) as cursor:
        cursor.execute(
            "SELECT id, name, email, store_id, role, password FROM users WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        session['user_id'] = user['id']
        session['username'] = user['name']
        session['role'] = user['role']
        session['store_id'] = user['store_id']
        return jsonify({"isLoggedIn": True, "role": user['role']})

    return jsonify({"isLoggedIn": False, "message": "Email atau password salah"}), 401


# ================= ================= =================
# SUPER ADMIN (STORES & USER MANAGEMENT)
# ================= ================= =================

@app.route('/api/store', methods=['GET'])
@login_required
def get_stores():
    with get_db_cursor(commit=False) as cursor:
        cursor.execute("SELECT id, name, address, status FROM stores ORDER BY id ASC")
        stores = cursor.fetchall()
    return jsonify({"stores": stores})

@app.route('/api/store/<int:id>', methods=['GET'])
@login_required
def get_store(id):
    with get_db_cursor(commit=False) as cursor:
        cursor.execute("SELECT name, address FROM stores WHERE id = %s", (id,))
        store = cursor.fetchone()
    if not store:
        return jsonify({"message": "Store not found"}), 404
    return jsonify({"store": store})

@app.route('/api/store/create', methods=['POST'])
@login_required
def create_store():
    data = request.get_json() or {}
    name = data.get('name')
    address = data.get('address')

    if not name:
        return jsonify({"message": "Nama toko wajib diisi"}), 400

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO stores (name, address) VALUES (%s, %s)",
            (name, address)
        )
    return jsonify({"message": "Store created successfully"})

@app.route('/api/store/update/<int:id>', methods=['PUT'])
@login_required
def update_store(id):
    data = request.get_json() or {}
    name = data.get('name')
    address = data.get('address')
    status = data.get('status')

    if not name:
        return jsonify({"message": "Nama toko wajib diisi"}), 400

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "UPDATE stores SET name = %s, address = %s , status = %s WHERE id = %s",
            (name, address, status, id)
        )
    return jsonify({"message": "Store updated successfully"})

@app.route('/api/superAdmin/user/create', methods=['POST'])
@login_required
def create_user_admin():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    store_id = data.get('store_id')

    if not name or not email or not password:
        return jsonify({"message": "Nama, email, dan password wajib diisi"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO users (name, email, password, store_id, role) VALUES (%s, %s, %s, %s, %s)",
            (name, email, hashed_password, store_id, 'Admin')
        )
    return jsonify({"message": "User created successfully"})

@app.route('/api/admin/user/create', methods=['POST'])
@login_required
def create_user_admin():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    store_id = session.get('store_id')

    if not name or not email or not password:
        return jsonify({"message": "Nama, email, dan password wajib diisi"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO users (name, email, password, store_id, role) VALUES (%s, %s, %s, %s, %s)",
            (name, email, hashed_password, store_id, role)
        )
    return jsonify({"message": "User created successfully"})

# ================= ================= =================
# PRODUCT & SUPPLIER MANAGEMENT
# ================= ================= =================

@app.route('/api/product', methods=['GET'])
@login_required
def get_products():
    store_id = session.get('store_id')
    with get_db_cursor(commit=False) as cursor:
        cursor.execute(
            "SELECT id, name, price, category FROM products WHERE store_id = %s ORDER BY id ASC",
            (store_id,)
        )
        products = cursor.fetchall()
        
    # Konversi data price NUMERIC menjadi float untuk serialisasi JSON yang aman
    for p in products:
        if 'price' in p and p['price'] is not None:
            p['price'] = float(p['price'])

    return jsonify({"products": products})

@app.route('/api/product/create', methods=['POST'])
@login_required
def create_product():
    data = request.get_json() or {}
    name = data.get('name')
    price = data.get('price')
    category = data.get('category')
    store_id = session.get('store_id')

    if not name or price is None:
        return jsonify({"message": "Nama produk dan harga wajib diisi"}), 400

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO products (name, price, category, store_id) VALUES (%s, %s, %s, %s)",
            (name, price, category, store_id)
        )
    return jsonify({"message": "Product created successfully"})

@app.route('/api/supplier', methods=['GET'])
@login_required
def get_suppliers():
    with get_db_cursor(commit=False) as cursor:
        cursor.execute("SELECT id, name, phone_number, address, created_at FROM suppliers ORDER BY id ASC")
        suppliers = cursor.fetchall()
        
    for s in suppliers:
        if s.get('created_at'):
            s['created_at'] = s['created_at'].isoformat()

    return jsonify({"suppliers": suppliers})

@app.route('/api/supplier/create', methods=['POST'])
@login_required
def create_supplier():
    data = request.get_json() or {}
    name = data.get('name')
    phone_number = data.get('phoneNumber') or data.get('phone_number')
    address = data.get('address')

    if not name or not phone_number:
        return jsonify({"message": "Nama supplier dan nomor telepon wajib diisi"}), 400

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO suppliers (name, phone_number, address) VALUES (%s, %s, %s)",
            (name, phone_number, address)
        )
    return jsonify({"message": "Supplier created successfully"})


# ================= ================= =================
# TRANSACTIONS & ORDERS
# ================= ================= =================

@app.route('/api/transactions', methods=['GET'])
@login_required
def get_transactions():
    store_id = session.get('store_id')
    query = """
        SELECT o.id, o.total_price, t.payment_method, o.created_at
        FROM orders o
        LEFT JOIN transactions t ON o.id = t.order_id
        WHERE o.store_id = %s
        ORDER BY o.id DESC
    """
    with get_db_cursor(commit=False) as cursor:
        cursor.execute(query, (store_id,))
        transactions = cursor.fetchall()

    for t in transactions:
        if 'total_price' in t and t['total_price'] is not None:
            t['total_price'] = float(t['total_price'])
        if t.get('created_at'):
            t['created_at'] = t['created_at'].isoformat()

    return jsonify({"transactions": transactions})

@app.route('/api/transaction/<int:id>', methods=['GET'])
@login_required
def get_transaction(id):
    with get_db_cursor(commit=False) as cursor:
        # 1. Ambil data Order & Transaction
        cursor.execute("""
            SELECT o.id, o.store_id, o.total_price, t.payment_method, o.created_at
            FROM orders o
            LEFT JOIN transactions t ON o.id = t.order_id
            WHERE o.id = %s
        """, (id,))
        order = cursor.fetchone()

        if not order:
            return jsonify({"message": "Transaction not found"}), 404

        # 2. Ambil Detail Order + Nama Produk
        cursor.execute("""
            SELECT d.product_id, p.name AS product_name, d.quantity, d.total
            FROM detail_order d
            LEFT JOIN products p ON d.product_id = p.id
            WHERE d.order_id = %s
        """, (id,))
        items = cursor.fetchall()

    order['total_price'] = float(order['total_price'])
    if order.get('created_at'):
        order['created_at'] = order['created_at'].isoformat()

    for item in items:
        item['total'] = float(item['total'])

    order['items'] = items
    return jsonify({"transaction": order})

@app.route('/api/transaction/create', methods=['POST'])
@login_required
def create_transaction():
    data = request.get_json() or {}
    store_id = session.get('store_id')
    products = data.get('products', [])
    payment_method = data.get('payment_method', 'Tunai')

    if not products:
        return jsonify({"message": "Keranjang kosong"}), 400

    total_price = sum(float(p['price']) * int(p['quantity']) for p in products)

    try:
        with get_db_cursor(commit=True) as cursor:
            # 1. Insert ke tabel orders dan dapatkan ID nya
            cursor.execute(
                "INSERT INTO orders (store_id, total_price) VALUES (%s, %s) RETURNING id",
                (store_id, total_price)
            )
            order_id = cursor.fetchone()['id']

            # 2. Batch insert ke detail_order menggunakan execute_values
            detail_tuples = [
                (order_id, p['id'], int(p['quantity']), float(p['price']) * int(p['quantity']))
                for p in products
            ]
            execute_values(
                cursor,
                "INSERT INTO detail_order (order_id, product_id, quantity, total) VALUES %s",
                detail_tuples
            )

            # 3. Insert ke tabel transactions
            cursor.execute(
                "INSERT INTO transactions (order_id, payment_method) VALUES (%s, %s)",
                (order_id, payment_method)
            )

        return jsonify({"message": "Order created successfully", "order_id": order_id})

    except Exception as e:
        print(f"Error creating transaction: {e}")
        return jsonify({"message": f"Transaction failed: {str(e)}"}), 500


# ================= ================= =================
# STOCKS & WAREHOUSE
# ================= ================= =================

@app.route('/api/warehouse/store', methods=['GET'])
@login_required
def get_warehouses():
    store_id = session.get('store_id')
    with get_db_cursor(commit=False) as cursor:
        cursor.execute("SELECT id, name, location FROM warehouses WHERE store_id = %s ORDER BY id ASC", (store_id,))
        warehouses = cursor.fetchall()
    return jsonify({"warehouses": warehouses})

@app.route('/api/warehouse/create', methods=['POST'])
@login_required
def create_warehouse():
    data = request.get_json() or {}
    name = data.get('name')
    location = data.get('location')

    if not name or not location:
        return jsonify({"message": "Nama gudang dan lokasi wajib diisi"}), 400

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO warehouses (name, location) VALUES (%s, %s)",
            (name, location)
        )
    return jsonify({"message": "Gudang berhasil dibuat"})

@app.route('/api/stock/create', methods=['POST'])
@login_required
def create_stock():
    data = request.get_json() or {}
    product_id = data.get('product_id')
    supplier_id = data.get('supplier_id')
    store_id = session.get('store_id')

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO stocks (warehouse_id, product_id, supplier_id, store_id, quantity) VALUES (%s, %s, %s, %s, %s)",
            (None, product_id, supplier_id, store_id, 0)
        )
    return jsonify({"message": "Stock created successfully"})

@app.route('/api/stock/updateWarehouse', methods=['GET'])
@login_required
def get_warehouse_null():
    store_id = session.get('store_id')
    query = """
        SELECT 
            s.id, 
            s.product_id, 
            s.supplier_id, 
            p.name AS product_name, 
            p.category AS product_category,
            p.price AS product_price
        FROM stocks s
        LEFT JOIN products p ON s.product_id = p.id
        WHERE s.warehouse_id IS NULL AND s.store_id = %s
        ORDER BY s.id ASC
    """
    with get_db_cursor(commit=False) as cursor:
        cursor.execute(query, (store_id,))
        stocks = cursor.fetchall()

    for s in stocks:
        if 'product_price' in s and s['product_price'] is not None:
            s['product_price'] = float(s['product_price'])

    return jsonify({"stocks": stocks})

@app.route('/api/stock/set-warehouse/<int:stock_id>', methods=['POST'])
@login_required
def set_warehouse(stock_id):
    data = request.get_json() or {}
    warehouse_id = data.get('warehouse_id')

    if not stock_id or not warehouse_id:
        return jsonify({"message": "ID stok dan ID gudang wajib diisi"}), 400

    with get_db_cursor(commit=True) as cursor:
        cursor.execute(
            "UPDATE stocks SET warehouse_id = %s WHERE id = %s",
            (warehouse_id, stock_id)
        )
    return jsonify({"message": "Lokasi gudang berhasil diperbarui"})

if __name__ == '__main__':
    app.run(debug=True)
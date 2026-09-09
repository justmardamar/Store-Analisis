from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_restful import Api, Resource
from psycopg2.extras import execute_values
import bcrypt

from config import SECRET_KEY
from middleware.LoginAuth import login_required
from database import get_db_cursor

app = Flask(__name__)
app.secret_key = SECRET_KEY
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
        "supports_credentials": True,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
}, supports_credentials=True)

api = Api(app)

# ================= ================= =================
# AUTHENTICATION RESOURCE
# ================= ================= =================

class LoginResource(Resource):
    def post(self):
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {"isLoggedIn": False, "message": "Email dan password wajib diisi"}, 400

        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, email, store_id, branch_id, role, password FROM users WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            session['user_id'] = user['id']
            session['username'] = user['name']
            session['role'] = user['role']
            session['store_id'] = user['store_id']
            session['branch_id'] = user['branch_id']
            return {
                "isLoggedIn": True,
                "role": user['role'],
                "username": user['name'],
                "store_id": user['store_id'],
                "branch_id": user['branch_id']
            }, 200

        return {"isLoggedIn": False, "message": "Email atau password salah"}, 401

class logoutAuth(Resource):
    def post(self):
        session.pop('user_id', None)
        session.pop('username', None)
        session.pop('role', None)
        session.pop('store_id', None)
        session.pop('branch_id', None)
        return {"message": "logout berhasil"}, 200


# ================= ================= =================
# BRANCH & SUPER ADMIN MANAGEMENT
# ================= ================= =================

class BranchListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute("SELECT id, name, location, created_at FROM branches ORDER BY id ASC")
            branches = cursor.fetchall()
        for b in branches:
            if b.get('created_at'):
                b['created_at'] = b['created_at'].isoformat()
        return {"branches": branches}, 200

    def post(self):
        data = request.get_json() or {}
        name = data.get('name')
        location = data.get('location')

        if not name:
            return {"message": "Nama cabang wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO branches (name, location) VALUES (%s, %s)",
                (name, location)
            )
        return {"message": "Cabang berhasil dibuat"}, 200


class StoreListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute("""
                SELECT s.id, s.name, s.address, s.status, s.branch_id, b.name AS branch_name
                FROM stores s
                LEFT JOIN branches b ON s.branch_id = b.id
                ORDER BY s.id ASC
            """)
            stores = cursor.fetchall()
        return {"stores": stores}, 200

class StoreItemResource(Resource):
    method_decorators = [login_required]

    def get(self, id):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute("SELECT name, address, branch_id FROM stores WHERE id = %s", (id,))
            store = cursor.fetchone()
        if not store:
            return {"message": "Store not found"}, 404
        return {"store": store}, 200

class StoreCreateResource(Resource):
    method_decorators = [login_required]

    def post(self):
        data = request.get_json() or {}
        name = data.get('name')
        address = data.get('address')
        branch_id = data.get('branch_id')

        if not name:
            return {"message": "Nama toko wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO stores (name, address, branch_id) VALUES (%s, %s, %s)",
                (name, address, branch_id)
            )
        return {"message": "Store created successfully"}, 200

class StoreUpdateResource(Resource):
    method_decorators = [login_required]

    def put(self, id):
        data = request.get_json() or {}
        name = data.get('name')
        address = data.get('address')
        status = data.get('status')
        branch_id = data.get('branch_id')

        if not name:
            return {"message": "Nama toko wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "UPDATE stores SET name = %s, address = %s, status = %s, branch_id = %s WHERE id = %s",
                (name, address, status, branch_id, id)
            )
        return {"message": "Store updated successfully"}, 200


class SuperAdminUserListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, email, role FROM users WHERE role IN ('Admin', 'Cabang') ORDER BY id ASC",
            )
            users = cursor.fetchall()
        return {"users": users}, 200

class SuperAdminUserCreateResource(Resource):
    method_decorators = [login_required]

    def post(self):
        data = request.get_json() or {}
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        store_id = data.get('store_id')
        branch_id = data.get('branch_id')
        role = data.get('role', 'Admin')

        if not name or not email or not password:
            return {"message": "Nama, email, dan password wajib diisi"}, 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO users (name, email, password, store_id, branch_id, role) VALUES (%s, %s, %s, %s, %s, %s)",
                (name, email, hashed_password, store_id, branch_id, role)
            )
        return {"message": "User created successfully"}, 200

class SuperAdminUserItemResource(Resource):
    method_decorators = [login_required]

    def get(self, id):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, email, role, store_id, branch_id FROM users WHERE id = %s",
                (id,)
            )
            user = cursor.fetchone()
        return {"user": user}, 200

    def put(self, id):
        data = request.get_json() or {}
        name = data.get('name')
        email = data.get('email')

        if not name or not email:
            return {"message": "Nama dan email wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "UPDATE users SET name = %s, email = %s WHERE id = %s",
                (name, email, id)
            )
        return {"message": "User updated successfully"}, 200


# ================= ================= =================
# ADMIN USER MANAGEMENT
# ================= ================= =================

class AdminUserCreateResource(Resource):
    method_decorators = [login_required]

    def post(self):
        data = request.get_json() or {}
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        store_id = session.get('store_id')

        if not name or not email or not password:
            return {"message": "Nama, email, dan password wajib diisi"}, 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO users (name, email, password, store_id, role) VALUES (%s, %s, %s, %s, %s)",
                (name, email, hashed_password, store_id, role)
            )
        return {"message": "User created successfully"}, 200

class AdminUserListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        store_id = session.get('store_id')
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, email, role FROM users WHERE store_id = %s ORDER BY id ASC",
                (store_id,)
            )
            users = cursor.fetchall()
        return {"users": users}, 200

class AdminUserItemResource(Resource):
    method_decorators = [login_required]

    def get(self, id):
        store_id = session.get('store_id')
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, email, role FROM users WHERE id = %s AND store_id = %s",
                (id, store_id)
            )
            user = cursor.fetchone()

        if not user:
            return {"message": "User not found"}, 404

        return {"user": user}, 200

class AdminUserEditResource(Resource):
    method_decorators = [login_required]

    def put(self, id):
        data = request.get_json() or {}
        name = data.get('name')
        email = data.get('email')
        role = data.get('role')
        store_id = session.get('store_id')

        if not name or not email or not role:
            return {"message": "Nama, email, and role wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "UPDATE users SET name = %s, email = %s, role = %s WHERE id = %s AND store_id = %s",
                (name, email, role, id, store_id)
            )
        return {"message": "User updated successfully"}, 200


# ================= ================= =================
# PRODUCT & STORE CATALOG MANAGEMENT
# ================= ================= =================

class ProductListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        # Global Master Product list for SuperAdmin and store selection catalog
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, price, category, status FROM products ORDER BY id ASC"
            )
            products = cursor.fetchall()

        for p in products:
            if 'price' in p and p['price'] is not None:
                p['price'] = float(p['price'])

        return {"products": products}, 200

class ProductCreateResource(Resource):
    method_decorators = [login_required]

    def post(self):
        # Only SuperAdmin can create master products
        if session.get('role') != 'superAdmin':
            return {"message": "Hanya SuperAdmin yang dapat membuat master produk baru"}, 403

        data = request.get_json() or {}
        name = data.get('name')
        price = data.get('price')
        category = data.get('category')

        if not name or price is None:
            return {"message": "Nama produk dan harga wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO products (name, price, category) VALUES (%s, %s, %s)",
                (name, price, category)
            )
        return {"message": "Product created successfully"}, 200

class ProductItemResource(Resource):
    method_decorators = [login_required]

    def get(self, id):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, price, category FROM products WHERE id = %s",
                (id,)
            )
            product = cursor.fetchone()

        if not product:
            return {"message": "Product not found"}, 404

        if 'price' in product and product['price'] is not None:
            product['price'] = float(product['price'])

        return {"product": product}, 200

class ProductUpdateResource(Resource):
    method_decorators = [login_required]

    def put(self, id):
        if session.get('role') != 'superAdmin':
            return {"message": "Hanya SuperAdmin yang dapat mengedit produk master"}, 403

        data = request.get_json() or {}
        name = data.get('name')
        price = data.get('price')
        category = data.get('category')

        if not name or price is None:
            return {"message": "Nama produk dan harga wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "UPDATE products SET name = %s, price = %s, category = %s WHERE id = %s",
                (name, price, category, id)
            )
        return {"message": "Product updated successfully"}, 200


# STORE CATALOG RESOURCE (Select/Remove products for specific store)

class StoreProductCatalogResource(Resource):
    method_decorators = [login_required]

    def get(self):
        store_id = session.get('store_id')
        if not store_id:
            return {"message": "Store ID tidak terdaftar dalam sesi"}, 400

        query = """
            SELECT 
                p.id, 
                p.name, 
                p.price, 
                p.category,
                CASE WHEN sp.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_in_store,
                COALESCE(st.quantity, 0) AS stock_quantity
            FROM products p
            LEFT JOIN store_products sp ON p.id = sp.product_id AND sp.store_id = %s AND sp.is_active = TRUE
            LEFT JOIN stocks st ON p.id = st.product_id AND st.store_id = %s
            ORDER BY p.id ASC
        """
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(query, (store_id, store_id))
            products = cursor.fetchall()

        for p in products:
            if 'price' in p and p['price'] is not None:
                p['price'] = float(p['price'])

        return {"products": products}, 200

    def post(self):
        store_id = session.get('store_id')
        data = request.get_json() or {}
        product_id = data.get('product_id')

        if not store_id or not product_id:
            return {"message": "Store ID dan Product ID wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            # 1. Insert into store_products catalog
            cursor.execute("""
                INSERT INTO store_products (store_id, product_id, is_active)
                VALUES (%s, %s, TRUE)
                ON CONFLICT (store_id, product_id) DO UPDATE SET is_active = TRUE
            """, (store_id, product_id))

            # 2. Ensure entry exists in stocks table with quantity = 0 if missing
            cursor.execute("""
                INSERT INTO stocks (store_id, product_id, quantity)
                SELECT %s, %s, 0
                WHERE NOT EXISTS (
                    SELECT 1 FROM stocks WHERE store_id = %s AND product_id = %s
                )
            """, (store_id, product_id, store_id, product_id))

        return {"message": "Produk berhasil ditambahkan ke katalog toko dengan stok 0"}, 200

class StoreProductItemResource(Resource):
    method_decorators = [login_required]

    def delete(self, product_id):
        store_id = session.get('store_id')
        if not store_id or not product_id:
            return {"message": "Store ID dan Product ID wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute("""
                UPDATE store_products SET is_active = FALSE 
                WHERE store_id = %s AND product_id = %s
            """, (store_id, product_id))

        return {"message": "Produk berhasil dihapus dari katalog toko"}, 200


class SupplierListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute("SELECT id, name, phone_number, address, created_at FROM suppliers ORDER BY id ASC")
            suppliers = cursor.fetchall()

        for s in suppliers:
            if s.get('created_at'):
                s['created_at'] = s['created_at'].isoformat()

        return {"suppliers": suppliers}, 200

class SupplierCreateResource(Resource):
    method_decorators = [login_required]

    def post(self):
        data = request.get_json() or {}
        name = data.get('name')
        phone_number = data.get('phoneNumber') or data.get('phone_number')
        address = data.get('address')

        if not name or not phone_number:
            return {"message": "Nama supplier dan nomor telepon wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO suppliers (name, phone_number, address) VALUES (%s, %s, %s)",
                (name, phone_number, address)
            )
        return {"message": "Supplier created successfully"}, 200


# ================= ================= =================
# TRANSACTIONS & ORDERS
# ================= ================= =================

class TransactionListResource(Resource):
    method_decorators = [login_required]

    def get(self):
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

        return {"transactions": transactions}, 200

class TransactionItemResource(Resource):
    method_decorators = [login_required]

    def get(self, id):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute("""
                SELECT o.id, o.store_id, o.total_price, t.payment_method, o.created_at
                FROM orders o
                LEFT JOIN transactions t ON o.id = t.order_id
                WHERE o.id = %s
            """, (id,))
            order = cursor.fetchone()

            if not order:
                return {"message": "Transaction not found"}, 404

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
        return {"transaction": order}, 200

class TransactionCreateResource(Resource):
    method_decorators = [login_required]

    def post(self):
        data = request.get_json() or {}
        store_id = session.get('store_id')
        products = data.get('products', [])
        payment_method = data.get('payment_method', 'Tunai')

        if not products:
            return {"message": "Keranjang kosong"}, 400

        total_price = sum(float(p['price']) * int(p['quantity']) for p in products)

        try:
            with get_db_cursor(commit=True) as cursor:
                cursor.execute(
                    "INSERT INTO orders (store_id, total_price) VALUES (%s, %s) RETURNING id",
                    (store_id, total_price)
                )
                order_id = cursor.fetchone()['id']

                detail_tuples = [
                    (order_id, p['id'], int(p['quantity']), float(p['price']) * int(p['quantity']))
                    for p in products
                ]
                execute_values(
                    cursor,
                    "INSERT INTO detail_order (order_id, product_id, quantity, total) VALUES %s",
                    detail_tuples
                )

                cursor.execute(
                    "INSERT INTO transactions (order_id, payment_method) VALUES (%s, %s)",
                    (order_id, payment_method)
                )

            return {"message": "Order created successfully", "order_id": order_id}, 200

        except Exception as e:
            print(f"Error creating transaction: {e}")
            return {"message": f"Transaction failed: {str(e)}"}, 500


# ================= ================= =================
# STOCK REQUEST WORKFLOW (TOKO -> CABANG)
# ================= ================= =================

class StockRequestResource(Resource):
    method_decorators = [login_required]

    def get(self):
        role = session.get('role')
        store_id = session.get('store_id')
        branch_id = session.get('branch_id')

        with get_db_cursor(commit=False) as cursor:
            if role == 'Cabang':
                # Cabang views requests from all stores under its branch
                query = """
                    SELECT 
                        sr.id, sr.store_id, s.name AS store_name,
                        sr.product_id, p.name AS product_name, p.category AS product_category,
                        sr.quantity, sr.status, sr.created_at, sr.updated_at
                    FROM stock_requests sr
                    JOIN stores s ON sr.store_id = s.id
                    JOIN products p ON sr.product_id = p.id
                    WHERE sr.branch_id = %s OR s.branch_id = %s
                    ORDER BY sr.id DESC
                """
                cursor.execute(query, (branch_id, branch_id))
            else:
                # Toko (Admin) views requests submitted by their store
                query = """
                    SELECT 
                        sr.id, sr.store_id, s.name AS store_name,
                        sr.product_id, p.name AS product_name, p.category AS product_category,
                        sr.quantity, sr.status, sr.created_at, sr.updated_at
                    FROM stock_requests sr
                    JOIN stores s ON sr.store_id = s.id
                    JOIN products p ON sr.product_id = p.id
                    WHERE sr.store_id = %s
                    ORDER BY sr.id DESC
                """
                cursor.execute(query, (store_id,))

            requests_data = cursor.fetchall()

        for r in requests_data:
            if r.get('created_at'):
                r['created_at'] = r['created_at'].isoformat()
            if r.get('updated_at'):
                r['updated_at'] = r['updated_at'].isoformat()

        return {"stock_requests": requests_data}, 200

    def post(self):
        # Toko submits a stock request to Cabang
        store_id = session.get('store_id')
        data = request.get_json() or {}
        product_id = data.get('product_id')
        quantity = data.get('quantity')

        if not store_id or not product_id or not quantity or int(quantity) <= 0:
            return {"message": "Produk dan kuantitas valid wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            # Get assigned branch_id for this store
            cursor.execute("SELECT branch_id FROM stores WHERE id = %s", (store_id,))
            store_res = cursor.fetchone()
            branch_id = store_res.get('branch_id') if store_res else None

            # Fallback to first branch if unassigned
            if not branch_id:
                cursor.execute("SELECT id FROM branches ORDER BY id ASC LIMIT 1")
                b_res = cursor.fetchone()
                branch_id = b_res['id'] if b_res else None

            cursor.execute("""
                INSERT INTO stock_requests (store_id, branch_id, product_id, quantity, status)
                VALUES (%s, %s, %s, %s, 'pending')
            """, (store_id, branch_id, product_id, int(quantity)))

        return {"message": "Request barang berhasil diajukan ke Cabang"}, 200


class StockRequestStatusResource(Resource):
    method_decorators = [login_required]

    def put(self, id):
        data = request.get_json() or {}
        new_status = data.get('status')

        valid_statuses = ['pending', 'accepted', 'delivered', 'completed']
        if new_status not in valid_statuses:
            return {"message": f"Status tidak valid. Pilihan: {', '.join(valid_statuses)}"}, 400

        with get_db_cursor(commit=True) as cursor:
            # Fetch stock request
            cursor.execute("SELECT id, store_id, product_id, quantity, status FROM stock_requests WHERE id = %s", (id,))
            req = cursor.fetchone()

            if not req:
                return {"message": "Data request stok tidak ditemukan"}, 404

            # Update status
            cursor.execute("""
                UPDATE stock_requests 
                SET status = %s, updated_at = CURRENT_TIMESTAMP 
                WHERE id = %s
            """, (new_status, id))

            # When status changes to 'completed', automatically add stock quantity to store
            if new_status == 'completed' and req['status'] != 'completed':
                store_id = req['store_id']
                product_id = req['product_id']
                qty = req['quantity']

                # Upsert stock quantity for store
                cursor.execute("""
                    INSERT INTO stocks (store_id, product_id, quantity)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (id) DO NOTHING
                """, (store_id, product_id, qty))

                # Update quantity if record exists
                cursor.execute("""
                    UPDATE stocks 
                    SET quantity = quantity + %s, updated_at = CURRENT_TIMESTAMP 
                    WHERE store_id = %s AND product_id = %s
                """, (qty, store_id, product_id))

        return {"message": f"Status request stok berhasil diperbarui menjadi {new_status}"}, 200


# ================= ================= =================
# STOCKS & WAREHOUSE
# ================= ================= =================

class WarehouseListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        store_id = session.get('store_id')
        with get_db_cursor(commit=False) as cursor:
            cursor.execute("SELECT id, location FROM warehouse WHERE store_id = %s ORDER BY id ASC", (store_id,))
            warehouses = cursor.fetchall()
        return {"warehouses": warehouses}, 200

class WarehouseCreateResource(Resource):
    method_decorators = [login_required]

    def post(self):
        data = request.get_json() or {}
        location = data.get('location')
        store_id = session.get('store_id')

        if not location:
            return {"message": "Nama gudang dan lokasi wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO warehouse (store_id, location) VALUES (%s, %s)",
                (store_id, location)
            )
        return {"message": "Gudang berhasil dibuat"}, 200

class StockListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        store_id = session.get('store_id')
        query = """
            SELECT s.id, p.name, s.warehouse_id, s.product_id, s.store_id, s.quantity, w.location
            FROM stocks s
            LEFT JOIN products p ON s.product_id = p.id
            LEFT JOIN warehouse w ON s.warehouse_id = w.id
            WHERE s.store_id = %s
        """
        with get_db_cursor(commit=True) as cursor:
            cursor.execute(query, (store_id,))
            stock = cursor.fetchall()
            if not stock:
                return {"message": "Stock tidak ditemukan atau tidak memiliki akses"}, 404

        return {"stocks": stock}, 200

class StockCreateResource(Resource):
    method_decorators = [login_required]

    def post(self):
        data = request.get_json() or {}
        product_id = data.get('product_id')
        supplier_id = data.get('supplier_id')
        store_id = session.get('store_id')

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO stocks (warehouse_id, product_id, supplier_id, store_id, quantity) VALUES (%s, %s, %s, %s, %s)",
                (None, product_id, supplier_id, store_id, 0)
            )
        return {"message": "Stock created successfully"}, 200

class StockUnlocatedResource(Resource):
    method_decorators = [login_required]

    def get(self):
        store_id = session.get('store_id')
        query = """
            SELECT 
                s.id AS stock_id, 
                p.id AS product_id, 
                p.name AS product_name, 
                s.warehouse_id,
                s.supplier_id,
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

        return {"stocks": stocks}, 200

class StockSetWarehouseResource(Resource):
    method_decorators = [login_required]

    def post(self, stock_id):
        data = request.get_json() or {}
        warehouse_id = data.get('warehouse_id')

        if not stock_id or not warehouse_id:
            return {"message": "ID stok dan ID gudang wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "UPDATE stocks SET warehouse_id = %s WHERE id = %s",
                (warehouse_id, stock_id)
            )
        return {"message": "Lokasi gudang berhasil diperbarui"}, 200


# ================= ================= =================
# ROUTE REGISTRATIONS VIA FLASK-RESTFUL API
# ================= ================= =================

# Auth
api.add_resource(LoginResource, '/api/login')
api.add_resource(logoutAuth, '/api/logout')

# Branch Management
api.add_resource(BranchListResource, '/api/branches')

# Super Admin Stores
api.add_resource(StoreListResource, '/api/store')
api.add_resource(StoreItemResource, '/api/store/<int:id>')
api.add_resource(StoreCreateResource, '/api/store/create')
api.add_resource(StoreUpdateResource, '/api/store/update/<int:id>')

# Super Admin Users
api.add_resource(SuperAdminUserListResource, '/api/superAdmin/user')
api.add_resource(SuperAdminUserCreateResource, '/api/superAdmin/user/create')
api.add_resource(SuperAdminUserItemResource, '/api/superAdmin/user/edit/<int:id>')

# Admin Users
api.add_resource(AdminUserListResource, '/api/admin/user')
api.add_resource(AdminUserCreateResource, '/api/admin/user/create')
api.add_resource(AdminUserItemResource, '/api/admin/user/<int:id>')
api.add_resource(AdminUserEditResource, '/api/admin/editUser/<int:id>')

# Products & Store Catalog
api.add_resource(ProductListResource, '/api/product')
api.add_resource(ProductCreateResource, '/api/product/create')
api.add_resource(ProductItemResource, '/api/product/<int:id>')
api.add_resource(ProductUpdateResource, '/api/product/update/<int:id>')
api.add_resource(StoreProductCatalogResource, '/api/store/products')
api.add_resource(StoreProductItemResource, '/api/store/product/<int:product_id>')

# Suppliers
api.add_resource(SupplierListResource, '/api/supplier')
api.add_resource(SupplierCreateResource, '/api/supplier/create')

# Transactions
api.add_resource(TransactionListResource, '/api/transactions')
api.add_resource(TransactionItemResource, '/api/transaction/<int:id>')
api.add_resource(TransactionCreateResource, '/api/transaction/create')

# Stock Requests Workflow (Toko -> Cabang)
api.add_resource(StockRequestResource, '/api/stock/requests')
api.add_resource(StockRequestStatusResource, '/api/stock/request/<int:id>/status')

# Warehouse
api.add_resource(WarehouseListResource, '/api/warehouse/store')
api.add_resource(WarehouseCreateResource, '/api/warehouse/create')

# Stocks
api.add_resource(StockListResource, '/api/stock')
api.add_resource(StockCreateResource, '/api/stock/create')
api.add_resource(StockUnlocatedResource, '/api/stock/updateWarehouse', '/api/stock/fetch-stock')
api.add_resource(StockSetWarehouseResource, '/api/stock/set-warehouse/<int:stock_id>')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
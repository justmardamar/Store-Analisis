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
                "SELECT id, name, email, store_id, role, password FROM users WHERE email = %s",
                (email,)
            )
            user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            session['user_id'] = user['id']
            session['username'] = user['name']
            session['role'] = user['role']
            session['store_id'] = user['store_id']
            return {
                "isLoggedIn": True,
                "role": user['role'],
                "username": user['name'],
                "store_id": user['store_id']
            }, 200

        return {"isLoggedIn": False, "message": "Email atau password salah"}, 401


# ================= ================= =================
# SUPER ADMIN (STORES & USER MANAGEMENT)
# ================= ================= =================

class StoreListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute("SELECT id, name, address FROM stores ORDER BY id ASC")
            stores = cursor.fetchall()
        return {"stores": stores}, 200

class StoreItemResource(Resource):
    method_decorators = [login_required]

    def get(self, id):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute("SELECT name, address FROM stores WHERE id = %s", (id,))
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

        if not name:
            return {"message": "Nama toko wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO stores (name, address) VALUES (%s, %s)",
                (name, address)
            )
        return {"message": "Store created successfully"}, 200

class StoreUpdateResource(Resource):
    method_decorators = [login_required]

    def put(self, id):
        data = request.get_json() or {}
        name = data.get('name')
        address = data.get('address')
        status = data.get('status')

        if not name:
            return {"message": "Nama toko wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "UPDATE stores SET name = %s, address = %s , status = %s WHERE id = %s",
                (name, address, status, id)
            )
        return {"message": "Store updated successfully"}, 200


class SuperAdminUserListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, email, role FROM users WHERE role = 'Admin' ORDER BY id ASC",
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

        if not name or not email or not password:
            return {"message": "Nama, email, dan password wajib diisi"}, 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO users (name, email, password, store_id, role) VALUES (%s, %s, %s, %s, %s)",
                (name, email, hashed_password, store_id, 'Admin')
            )
        return {"message": "User created successfully"}, 200

class SuperAdminUserItemResource(Resource):
    method_decorators = [login_required]

    def get(self, id):
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, email, role FROM users WHERE id = %s AND role = 'Admin'",
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
# PRODUCT & SUPPLIER MANAGEMENT
# ================= ================= =================

class ProductListResource(Resource):
    method_decorators = [login_required]

    def get(self):
        store_id = session.get('store_id')
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, price, category, status FROM products WHERE store_id = %s ORDER BY id ASC",
                (store_id,)
            )
            products = cursor.fetchall()

        for p in products:
            if 'price' in p and p['price'] is not None:
                p['price'] = float(p['price'])

        return {"products": products}, 200

class ProductCreateResource(Resource):
    method_decorators = [login_required]

    def post(self):
        data = request.get_json() or {}
        name = data.get('name')
        price = data.get('price')
        category = data.get('category')
        store_id = session.get('store_id')

        if not name or price is None:
            return {"message": "Nama produk dan harga wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO products (name, price, category, store_id) VALUES (%s, %s, %s, %s)",
                (name, price, category, store_id)
            )
        return {"message": "Product created successfully"}, 200

class ProductItemResource(Resource):
    method_decorators = [login_required]

    def get(self, id):
        store_id = session.get('store_id')
        with get_db_cursor(commit=False) as cursor:
            cursor.execute(
                "SELECT id, name, price, category FROM products WHERE id = %s AND store_id = %s",
                (id, store_id)
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
        data = request.get_json() or {}
        name = data.get('name')
        price = data.get('price')
        category = data.get('category')
        store_id = session.get('store_id')

        if not name or price is None:
            return {"message": "Nama produk dan harga wajib diisi"}, 400

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                "UPDATE products SET name = %s, price = %s, category = %s WHERE id = %s AND store_id = %s",
                (name, price, category, id, store_id)
            )
        return {"message": "Product updated successfully"}, 200

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

# Products
api.add_resource(ProductListResource, '/api/product')
api.add_resource(ProductCreateResource, '/api/product/create')
api.add_resource(ProductItemResource, '/api/product/<int:id>')
api.add_resource(ProductUpdateResource, '/api/product/update/<int:id>')

# Suppliers
api.add_resource(SupplierListResource, '/api/supplier')
api.add_resource(SupplierCreateResource, '/api/supplier/create')

# Transactions
api.add_resource(TransactionListResource, '/api/transactions')
api.add_resource(TransactionItemResource, '/api/transaction/<int:id>')
api.add_resource(TransactionCreateResource, '/api/transaction/create')

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
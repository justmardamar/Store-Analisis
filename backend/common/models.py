"""
Dokumentasi Struktur Tabel Database StoreAnalisis (Tanpa SQLAlchemy ORM)
---------------------------------------------------------------------
Seluruh operasi database dilakukan menggunakan Raw SQL (psycopg2).
File ini berfungsi sebagai referensi struktur tabel & kolom di PostgreSQL.
"""

TABLE_SCHEMAS = {
    "stores": {
        "id": "SERIAL PRIMARY KEY",
        "name": "VARCHAR(100) NOT NULL",
        "address": "TEXT",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "users": {
        "id": "SERIAL PRIMARY KEY",
        "name": "VARCHAR(100) NOT NULL",
        "email": "VARCHAR(100) UNIQUE NOT NULL",
        "password": "VARCHAR(255) NOT NULL",
        "role": "VARCHAR(50) NOT NULL",  # 'Super Admin', 'Admin', 'kasir', 'Stok'
        "store_id": "INTEGER REFERENCES stores(id) ON DELETE CASCADE",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "products": {
        "id": "SERIAL PRIMARY KEY",
        "store_id": "INTEGER REFERENCES stores(id) ON DELETE CASCADE",
        "name": "VARCHAR(100) NOT NULL",
        "price": "NUMERIC(12,2) NOT NULL",
        "category": "VARCHAR(50)",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "suppliers": {
        "id": "SERIAL PRIMARY KEY",
        "name": "VARCHAR(100) NOT NULL",
        "phone_number": "VARCHAR(13) NOT NULL",
        "address": "TEXT",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "product_suppliers": {
        "id": "SERIAL PRIMARY KEY",
        "product_id": "INTEGER REFERENCES products(id) ON DELETE CASCADE",
        "supplier_id": "INTEGER REFERENCES suppliers(id) ON DELETE CASCADE",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "warehouse": {
        "id": "SERIAL PRIMARY KEY",
        "location": "VARCHAR(100) NOT NULL",
        "store_id": "INTEGER REFERENCES stores(id) ON DELETE CASCADE",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "stocks": {
        "id": "SERIAL PRIMARY KEY",
        "warehouse_id": "INTEGER REFERENCES warehouse(id) ON DELETE CASCADE",
        "product_id": "INTEGER REFERENCES products(id) ON DELETE CASCADE",
        "supplier_id": "INTEGER REFERENCES suppliers(id) ON DELETE CASCADE",
        "store_id": "INTEGER REFERENCES stores(id) ON DELETE CASCADE",
        "quantity": "INTEGER DEFAULT 0",
        "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "reports": {
        "id": "SERIAL PRIMARY KEY",
        "store_id": "INTEGER REFERENCES stores(id) ON DELETE CASCADE",
        "product_id": "INTEGER REFERENCES products(id) ON DELETE CASCADE",
        "quantity_change": "INTEGER NOT NULL",
        "type": "VARCHAR(10) NOT NULL", # 'in', 'out'
        "reason": "TEXT",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "orders": {
        "id": "SERIAL PRIMARY KEY",
        "store_id": "INTEGER REFERENCES stores(id) ON DELETE CASCADE",
        "total_price": "NUMERIC(12,2) NOT NULL",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    },
    "detail_order": {
        "id": "SERIAL PRIMARY KEY",
        "order_id": "INTEGER REFERENCES orders(id) ON DELETE CASCADE",
        "product_id": "INTEGER REFERENCES products(id) ON DELETE CASCADE",
        "quantity": "INTEGER NOT NULL",
        "total": "NUMERIC(12,2) NOT NULL"
    },
    "transactions": {
        "id": "SERIAL PRIMARY KEY",
        "order_id": "INTEGER REFERENCES orders(id) ON DELETE CASCADE",
        "payment_method": "VARCHAR(20)",
        "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    }
}

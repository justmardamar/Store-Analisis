import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from common.connection import get_connection
import bcrypt

conn = get_connection()

def add_store():
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO stores (name, address) VALUES (%s, %s) RETURNING id",
        ("Super Store", "Jl. KH Ahmad Dahlan No. 45")
    )
    store_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    return store_id

def create_admin_role(store_id):
    cursor = conn.cursor()
    hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    cursor.execute(
        "INSERT INTO users (name, email, password, role, store_id) VALUES (%s, %s, %s, %s, %s)",
        ("admin", "admin01@gmail.com", hashed_password, "admin", store_id)
    )
    conn.commit()
    cursor.close()

try:
    store_id = add_store()
    create_admin_role(store_id)
    print("Seeding berhasil!")
    conn.close()
except Exception as e:
    print(f"Terjadi kesalahan saat seeding: {e}")
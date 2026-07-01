import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from common.connection import get_connection
import bcrypt

conn = get_connection()

def create_super_admin():
    cursor = conn.cursor()
    hashed_password = bcrypt.hashpw("adminSupper".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    cursor.execute(
        "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
        ("Super admin", "adminSupper@gmail.com", hashed_password, "Super Admin")
    )
    conn.commit()
    cursor.close()

try:
    create_super_admin()
    print("Seeding berhasil!")
    conn.close()
except Exception as e:
    print(f"Terjadi kesalahan saat seeding: {e}")
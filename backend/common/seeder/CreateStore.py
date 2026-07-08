import sys
import os
# Menambahkan folder 'backend' ke sys.path agar modul 'common' dapat ditemukan
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from common.connection import get_connection

conn = get_connection()

def create_store():
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO stores (name, address) VALUES (%s, %s)",
        ('Toko Tembalang', 'JL Diponegoro 69')
    )
    conn.commit()
    cursor.close()

try:
    create_store()
    print('Seeding berhasil!')
    conn.close()
except Exception as e:
    print(f'Terjadi kesalahan saat seeding : {e}')

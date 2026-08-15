import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))

from backend.database import get_db_cursor


def create_store():
    try:
        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                """
                INSERT INTO stores (name, address)
                VALUES (%s, %s)
                RETURNING id, name
                """,
                ("Super Store", "Jl. KH Ahmad Dahlan No. 45"),
            )
            row = cursor.fetchone()
            store_name = row.get('name') if row else 'Super Store'
            print(f"Store '{store_name}' berhasil dibuat!")
    except Exception as e:
        print(f"Terjadi kesalahan saat seeding: {e}")

if __name__ == '__main__':
    create_store()
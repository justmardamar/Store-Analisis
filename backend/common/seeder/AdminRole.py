import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))

from backend.database import get_db_cursor
import bcrypt

def seed_admin():
    try:
        # find a store id to associate the admin with
        with get_db_cursor() as cursor:
            cursor.execute("SELECT id FROM stores ORDER BY id DESC LIMIT 1")
            row = cursor.fetchone()
            if not row:
                print("No store found. Run CreateStore.py first.")
                return
            store_id = row.get('id')

        hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                """
                INSERT INTO users (name, email, password, role, store_id)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, name
                """,
                ("admin", "admin01@gmail.com", hashed_password, "Admin", store_id),
            )
            row = cursor.fetchone()
            name = row.get('name') if row else 'admin'
            print(f"User Admin '{name}' berhasil dibuat!")

    except Exception as e:
        print(f"Terjadi kesalahan saat seeding: {e}")


if __name__ == '__main__':
    seed_admin()

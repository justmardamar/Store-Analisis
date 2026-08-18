import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))

from backend.database import get_db_cursor
import bcrypt

def seed_super_admin():
    try:


        hashed_password = bcrypt.hashpw("superadmin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                """
                INSERT INTO users (name, email, password, role, store_id)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id, name
                """,
                ("super admin", "superadmin@gmail.com", hashed_password, "Admin", None),
            )
            row = cursor.fetchone()
            name = row.get('name') if row else 'super admin'
            print(f"User Super Admin '{name}' berhasil dibuat!")

    except Exception as e:
        print(f"Terjadi kesalahan saat seeding: {e}")


if __name__ == '__main__':
    seed_super_admin()

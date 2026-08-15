import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))

from backend.database import get_db_cursor
import bcrypt

def create_super_admin():
    try:
        hashed_password = bcrypt.hashpw("adminSupper".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        email = "superadmin@example.com"

        with get_db_cursor(commit=True) as cursor:
            cursor.execute(
                """
                INSERT INTO users (name, email, password, role)
                VALUES (%s, %s, %s, %s)
                RETURNING id, name
                """,
                ("Super admin", email, hashed_password, "Super Admin"),
            )
            row = cursor.fetchone()
            name = row.get('name') if row else 'Super admin'
            print(f"User Admin '{name}' berhasil dibuat! (email: {email})")

    except Exception as e:
        print(f"Terjadi kesalahan saat seeding: {e}")


if __name__ == '__main__':
    create_super_admin()

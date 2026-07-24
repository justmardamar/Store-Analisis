import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from common.database import db_session
from common.models import User
import bcrypt

def seed_admin():
    try:
        hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        new_admin = User(
            name="admin",
            email="admin01@gmail.com",
            password=hashed_password,
            role="Admin",
            store_id="[store.id]" #masukin storeidnya
        )
        db_session.add(new_admin)
        db_session.commit()
        print(f"User Admin '{new_admin.name}' berhasil dibuat!")

    except Exception as e:
        db_session.rollback()
        print(f"Terjadi kesalahan saat seeding: {e}")
    finally:
        db_session.remove()

if __name__ == '__main__':
    seed_admin()
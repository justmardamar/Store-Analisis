import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from common.database import db_session
from common.models import Store

def create_store():
    try:
        new_store = Store(
            name="Super Store",
            address="Jl. KH Ahmad Dahlan No. 45"
        )
        db_session.add(new_store)
        db_session.commit()
        print(f"Store '{new_store.name}' berhasil dibuat!")
    except Exception as e:
        db_session.rollback()
        print(f"Terjadi kesalahan saat seeding: {e}")
    finally:
        db_session.remove()

if __name__ == '__main__':
    create_store()
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from common.database import db_session
from common.models import Product

def createProduct():
    try:
        product = Product(#tambahin store id
            store_id="[Store_id]",
            name="Biskuit",
            price=10000,
            category="Makanan",
        )
        db_session.add(product)
        db_session.commit()
        print(f"Product '{product.name}' berhasil dibuat!")
    except Exception as e:
        db_session.rollback()
        print(f"Terjadi kesalahan saat seeding: {e}")
    finally:
        db_session.remove()

if __name__ == '__main__':
    createProduct()

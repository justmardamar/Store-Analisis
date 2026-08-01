import os
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/StoreDB')

def get_connection():
    """Membuka koneksi database PostgreSQL murni menggunakan psycopg2"""
    return psycopg2.connect(DATABASE_URL)

@contextmanager
def get_db_cursor(commit=False):
    """
    Context manager untuk query database tanpa ORM.
    
    - Menggunakan RealDictCursor agar hasil query otomatis berbentuk dictionary (misal: {"id": 1, "name": "Kopi"}).
    - Jika commit=True, otomatis menjalankan conn.commit().
    - Jika terjadi exception, otomatis menjalankan conn.rollback().
    - Selalu menutup cursor dan koneksi setelah selesai.
    """
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        yield cursor
        if commit:
            conn.commit()
    except Exception as e:
        if commit:
            conn.rollback()
        raise e
    finally:
        cursor.close()
        conn.close()
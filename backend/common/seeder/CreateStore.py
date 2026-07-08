from common.connection import get_connection

conn = get_connection()

def create_store():
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO stores (name,address) VALUE (%s,%s)",('Toko Tembalang','JL Diponegoro 69')
    )
    cursor.commit()
    cursor.close()

try:
    create_store()
    print('Seeding berhasil!')
    conn.close()
except Exception as e:
    print(f'Terjadi kesalahan saat seeding : {e}')

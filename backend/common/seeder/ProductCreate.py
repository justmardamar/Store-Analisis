from common.connection import get_connection

conn = get_connection()

def create_store():
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO products (store_id,name,price,category) VALUE (%s,%s)",('[Store_id]','Kitkat',18000,'Makanan')
    )
    cursor.commit()
    cursor.close()

try:
    create_store()
    print('Seeding berhasil!')
    conn.close()
except Exception as e:
    print(f'Terjadi kesalahan saat seeding : {e}')

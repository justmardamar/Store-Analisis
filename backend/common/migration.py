from connection import get_connection

conn = get_connection()
cursor = conn.cursor()

def create_table_stores():
    cursor.execute("""
    CREATE TABLE stores(
        id SERIAL PRIMARY KEY,
        name varchar(100) not null,
        address text,
        created_at timestamp default current_timestamp,
        updated_at timestamp default current_timestamp
    );
    """)
    conn.commit()

def create_table_products():
    cursor.execute("""
        CREATE TABLE products(
            id SERIAL PRIMARY KEY,
            store_id int REFERENCES stores(id) ON DELETE CASCADE,
            name varchar(100) not null,
            price numeric(12,2) not null,
            category varchar(50) CHECK (category IN ('Makanan','Minuman', 'Kebutuhan Pokok' )),
            created_at timestamp default current_timestamp,
            updated_at timestamp default current_timestamp
        )
    """)
    conn.commit()

def create_table_supplier():
    cursor.execute("""
        CREATE TABLE suppliers(
            id SERIAL PRIMARY KEY,
            name varchar(100) not null,
            phone_number varchar(13) not null,
            address text,
            created_at timestamp default current_timestamp,
            updated_at timestamp default current_timestamp
        )
    """)
    conn.commit()

def create_table_product_suppliers():
    cursor.execute("""
        CREATE TABLE product_suppliers(
            id SERIAL PRIMARY KEY,
            product_id int REFERENCES products(id) ON DELETE CASCADE,
            supplier_id int REFERENCES suppliers(id) ON DELETE CASCADE,
            created_at timestamp default current_timestamp,
            updated_at timestamp default current_timestamp
        )
    """)
    conn.commit()

def create_table_warehouse():
    cursor.execute("""
        CREATE TABLE warehouse(
            id SERIAL PRIMARY KEY,
            location varchar(100) not null,
            store_id int REFERENCES stores(id) ON DELETE CASCADE,
            updated_at timestamp default current_timestamp
        )
    """)
    conn.commit()

def create_table_stocks():
    cursor.execute("""
        CREATE TABLE stocks(
            id SERIAL PRIMARY KEY,
            warehouse_id int REFERENCES warehouse(id) ON DELETE CASCADE,
            product_id int REFERENCES products(id) ON DELETE CASCADE,
            supplier_id int REFERENCES suppliers(id) ON DELETE CASCADE,
            quantity int default 0,
            updated_at timestamp default current_timestamp
        )
    """)
    conn.commit()

def create_table_reports():
    cursor.execute("""
        CREATE TABLE reports(
            id SERIAL PRIMARY KEY,
            store_id int REFERENCES stores(id) ON DELETE CASCADE,
            product_id int REFERENCES products(id) ON DELETE CASCADE,
            quantity_change int not null,
            type varchar(10) CHECK (type IN ('in', 'out')),
            reason text,
            created_at timestamp default current_timestamp
            )
    """)
    conn.commit()

def create_table_detail_transaction():
    cursor.execute("""
        CREATE TABLE detail_transaction(
            transaction_id int REFERENCES transactions(id) ON DELETE CASCADE,
            product_id int REFERENCES products(id) ON DELETE CASCADE,
            quantity int not null,
            total numeric(12,2) not null
        )
    """)
    conn.commit()

def create_table_transactions():
    cursor.execute("""
        CREATE TABLE transactions(
            id SERIAL PRIMARY KEY,
            store_id int REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
            total_price numeric(12,2) not null,
            amount_paid numeric(12,2) not null,
            change numeric(12,2) not null,
            status varchar(20) CHECK (status IN ('Selesai', 'Pending')),
            payment_method varchar(20) CHECK (payment_method IN ('Tunai', 'Qris')),
            created_at timestamp default current_timestamp
        )
    """)
    conn.commit()

def create_table_users():
    cursor.execute("""
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            name varchar(100) not null,
            email varchar(100) not null UNIQUE,
            password varchar(255) not null,
            role varchar(20) CHECK (role IN ('Super Admin','Admin','kasir','Stok')),
            store_id int REFERENCES stores(id) ON DELETE CASCADE default Null,
            created_at timestamp default current_timestamp,
            updated_at timestamp default current_timestamp
        )
    """)
    conn.commit()


# create_table_stores()
# create_table_products()
# create_table_supplier()
# create_table_product_suppliers()
# create_table_warehouse()
# create_table_stocks()
# create_table_reports()
create_table_transactions()
create_table_detail_transaction()

# create_table_users()

conn.close()
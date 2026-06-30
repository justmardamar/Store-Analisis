from common.connection import get_connection
import bcrypt

conn = get_connection()

def create_admin_role():
    cursor = conn.cursor()
    hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt())
    cursor.execute("INSERT INTO users (name, email, password, role) VALUES ("+ "admin" + ", " + 'admin01@gmail.com' + ", " + hashed_password + ", " + "admin" + ")")
    conn.commit()

create_admin_role()
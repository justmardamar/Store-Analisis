from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from common.database import Base

class Store(Base):
    __tablename__ = 'stores'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    address = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    store_id = Column(Integer, ForeignKey('stores.id', ondelete='CASCADE'), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    store = relationship('Store', backref='users')

class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    store_id = Column(Integer, ForeignKey('stores.id', ondelete='CASCADE'))
    name = Column(String(100), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    category = Column(String(50))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    store = relationship('Store', backref='products')

class Supplier(Base):
    __tablename__ = 'suppliers'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    phone_number = Column(String(13), nullable=False)
    address = Column(Text)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class ProductSupplier(Base):
    __tablename__ = 'product_suppliers'

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'))
    supplier_id = Column(Integer, ForeignKey('suppliers.id', ondelete='CASCADE'))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Warehouse(Base):
    __tablename__ = 'warehouse'

    id = Column(Integer, primary_key=True)
    location = Column(String(100), nullable=False)
    store_id = Column(Integer, ForeignKey('stores.id', ondelete='CASCADE'))
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Stock(Base):
    __tablename__ = 'stocks'

    id = Column(Integer, primary_key=True)
    warehouse_id = Column(Integer, ForeignKey('warehouse.id', ondelete='CASCADE'), nullable=True)
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'))
    supplier_id = Column(Integer, ForeignKey('suppliers.id', ondelete='CASCADE'))
    store_id = Column(Integer, ForeignKey('stores.id', ondelete='CASCADE'), nullable=True)
    quantity = Column(Integer, default=0)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Report(Base):
    __tablename__ = 'reports'

    id = Column(Integer, primary_key=True)
    store_id = Column(Integer, ForeignKey('stores.id', ondelete='CASCADE'))
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'))
    quantity_change = Column(Integer, nullable=False)
    type = Column(String(10), nullable=False)
    reason = Column(Text)
    created_at = Column(DateTime, default=func.now())

class Order(Base):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    store_id = Column(Integer, ForeignKey('stores.id', ondelete='CASCADE'))
    total_price = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime, default=func.now())

class DetailOrder(Base):
    __tablename__ = 'detail_order'

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'))
    product_id = Column(Integer, ForeignKey('products.id', ondelete='CASCADE'))
    quantity = Column(Integer, nullable=False)
    total = Column(Numeric(12, 2), nullable=False)

    order = relationship('Order', backref='details')
    product = relationship('Product')

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id', ondelete='CASCADE'), unique=True)
    payment_method = Column(String(20))
    created_at = Column(DateTime, default=func.now())

    order = relationship('Order', backref='transaction')

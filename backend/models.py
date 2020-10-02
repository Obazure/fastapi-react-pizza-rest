"""MODELS entities of the application, that storing in database,
    actual mapping of the database tables.

This exports:
  - Base
  - Pizza
  - Ingredient
  - pivot_pizza_ingredient
"""

from datetime import datetime
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy import Column, Table, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

# declarative metadata class `sqlalchemy.schema.Table`
Base = declarative_base()

# is an ORM M2M relationship definition between Pizza and Ingredients
pivot_pizza_ingredient = Table(
    'pizza_ingredient',
    Base.metadata,
    Column('id', Integer),
    Column('pizza_id', Integer, ForeignKey('pizzas.id')),
    Column('ingredient_id', Integer, ForeignKey('ingredients.id')),
)


class Ingredient(Base):  # pylint: disable=too-few-public-methods
    """Is an ORM model definition of the ingredients database table."""
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    name = Column(String)
    count = Column(Integer)
    __table_args__ = (
        UniqueConstraint('name', 'count', name='_unique_ingredient_set'),
    )


class Pizza(Base):  # pylint: disable=too-few-public-methods
    """Is an ORM model definition of the pizzas database table."""
    __tablename__ = "pizzas"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    name = Column(String)
    ingredients = relationship(Ingredient, secondary=pivot_pizza_ingredient)
    status = Column(String, default='waiting')

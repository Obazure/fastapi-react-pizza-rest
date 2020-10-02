"""CRUD is a module to define database queries.
It separate and encapsulate the way of interconnection with database.

This exports:
  - get_pizzas is a function get list of pizzas
  - create_pizza is a function to store pizza in database
"""
from sqlalchemy import desc
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
import models
import schemas


async def get_pizzas(db_session: Session):
    """Select all records with relationships from database.

    :param db_session: sqlalchemy.orm.session.Session instance
    :return: models.Pizza[] a list records.
    """
    return db_session.query(models.Pizza).order_by(desc('created_at')).all()


async def create_pizza(db_session: Session, pizza: schemas.PizzaBase):
    """Store Pizza with ingredients or uses ingredient
    configuration from database, if exist.

    :param db_session: sqlalchemy.orm.session.Session instance
    :param pizza: schemas.PizzaBase input data
    :return: models.Pizza a single record after saving
    """
    db_pizza = models.Pizza(name=pizza.name, status=pizza.status)

    for ingredient in pizza.ingredients:
        # find next ingredient configuration in database
        db_ingredient = db_session.query(models.Ingredient) \
            .filter_by(name=ingredient.name, count=ingredient.count).first()
        if not db_ingredient:
            # create new ingredient configuration if not exist
            db_ingredient = models.Ingredient(name=ingredient.name,
                                              count=ingredient.count)
        db_pizza.ingredients.append(db_ingredient)

    db_session.add(db_pizza)
    db_session.commit()
    return db_pizza


async def update_pizza_status(db_session: Session, pizza: schemas.PizzaBase):
    """ Updating status for pizza

    :param db_session: sqlalchemy.orm.session.Session instance
    :param pizza: schemas.PizzaBase input data
    :return: models.Pizza a single record after saving
    """
    db_pizza = db_session.query(models.Pizza) \
        .filter(models.Pizza.id == pizza.id).first()
    if db_pizza:
        db_pizza.status = pizza.status
        db_session.commit()
        db_session.add(db_pizza)
        db_session.refresh(db_pizza)
        return db_pizza
    raise NoResultFound("Entity is not found")

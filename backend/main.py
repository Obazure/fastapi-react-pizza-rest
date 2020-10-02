""" FastApi application
"""
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy.orm.exc import NoResultFound
import uvicorn

import config
import crud
import models
import schemas
import database

# initialisation tables in database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title='ScoutBee',
    docs_url="/api/docs",
    openapi_url="/api"
)
from fastapi.middleware.cors import CORSMiddleware
origins = [
    "https//localhost",
    "http://localhost:3000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    """ Helper to control database connection sessions. """

    try:
        db_session = database.SessionLocal()
        yield db_session
    except SQLAlchemyError:
        print("Database session error.")


@app.get('/api/pizzas/', response_model=List[schemas.Pizza])
async def get_pizzas(db_session: Session = Depends(get_db)):
    """ Endpoint for getting list of pizzas.

    :param db_session: sqlalchemy.orm.Session
    :return: List[schemas.Pizza]
    """
    return await crud.get_pizzas(db_session=db_session)


@app.post("/api/pizzas/", response_model=schemas.Pizza)
async def create_pizza(pizza: schemas.PizzaBase,
                       db_session: Session = Depends(get_db)):
    """ Endpoint for creation new pizzas with Ingredients in it.

    :param pizza: schemas.PizzaBase
    :param db_session: sqlalchemy.orm.Session
    :return: schemas.Pizza
    """
    return await crud.create_pizza(db_session=db_session, pizza=pizza)


@app.put("/api/pizzas/", response_model=schemas.Pizza)
async def update_pizza(pizza: schemas.PizzaEdit,
                       db_session: Session = Depends(get_db)):
    """ Endpoint for updating status in pizza.

    :param pizza: schemas.PizzaBase
    :param db_session: sqlalchemy.orm.Session
    :return: schemas.Pizza
    """
    try:
        return await crud.update_pizza_status(
            db_session=db_session,
            pizza=pizza
        )
    except (NoResultFound, IndexError, ValueError) as value_error:
        raise HTTPException(
            status_code=404,
            detail="Item not found or value is incorrect."
        ) from value_error


if __name__ == "__main__":
    uvicorn.run("main:app",
                host="0.0.0.0",
                reload=True,
                port=config.BACKEND_PORT
                )

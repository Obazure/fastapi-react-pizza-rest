"""DATABASE initialise connection to the database and provide access to it.

This exports:
  - engine Create a new sqlalchemy.Engine` instance
  - SessionLocal is a function for handling database connections
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import SQLALCHEMY_DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

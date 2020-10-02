"""CONFIG is a module to keep all configs from environments.

This exports:
  - POSTGRES_DB is a database name, default is 'test'
  - POSTGRES_USER is a database connection username , default is 'test'
  - POSTGRES_PASSWORD is a password for the username, default is 'test'
  - POSTGRES_HOST is a hostname of the database server, default is 'test'
  - POSTGRES_PORT is a port on the database host to access, default is 5432
  - SQLALCHEMY_DATABASE_URL is a final URL for connecting to the database
"""

import os

BACKEND_PORT = int(os.getenv('BACKEND_PORT', '8000'))

POSTGRES_DB = os.getenv('POSTGRES_DB', 'test')
POSTGRES_USER = os.getenv('POSTGRES_USER', 'test')
POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD', 'test')
POSTGRES_HOST = os.getenv('POSTGRES_HOST', 'localhost')
POSTGRES_PORT = os.getenv('POSTGRES_PORT', '5432')

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://%s:%s@%s:%s/%s" % (
    POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST,
    POSTGRES_PORT, POSTGRES_DB)

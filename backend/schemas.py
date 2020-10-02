"""SCHEMAS description of the serialization, validation interfaces.

This exports:
  - IngredientBase
  - Ingredient
  - PizzaBase
  - Pizza
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, validator


class IngredientBase(BaseModel):
    """Class defining main fields for the `Ingredient`.
    """
    name: str
    count: int

    @classmethod
    @validator('name', pre=True, always=True)
    def name_to_lower(cls, val):
        """Always change field value to lowercase.

        :param val: any value
        :return: String value
        """
        return str(val).lower()

    @classmethod
    @validator('count', pre=True, always=True)
    def count_positive(cls, val):
        """Check for positive value for count field.

        :param v: int value
        :return: int value
        """
        if val and isinstance(val, int) and val > 0:
            return val
        raise ValueError('Count must be number and more than 0.')


class Ingredient(IngredientBase):
    """Class defining full serialization for `Ingredient`.
    """
    id: int
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

    @classmethod
    @validator('created_at', pre=True, always=True)
    def default_created(cls, val):
        """Check is create_at value given or initiate it.

        :param val: datetime value
        :return: datetime value
        """
        return val or datetime.now()

    @classmethod
    @validator('updated_at', pre=True, always=True)
    def default_modified(cls, val, values):
        """Check is updated_at value given or initiate it.

        :param val: datetime value
        :return: datetime value
        """
        return val or values['created_at']

    class Config:  # pylint: disable=too-few-public-methods
        """Config for Ingredient Schema.
        """
        orm_mode = True


class PizzaBase(BaseModel):
    """Class defining main fields for `Pizza`.
    """
    name: str
    ingredients: List[IngredientBase] = []
    status: Optional[str]

    @classmethod
    @validator('name', pre=True, always=True)
    def name_to_lower(cls, val):
        """ Change name field income value to lowercase

        :param val: str any value
        :return: str val in lowercase
        """
        return str(val).lower()

    @classmethod
    @validator('status', pre=True, always=True)
    def status_in_list(cls, val):
        """Proofs for given value to be in list.

        :param val: value
        :return: str value
        """
        val = str(val).lower()
        if val not in ['waiting', 'ready']:
            return 'waiting'
        return val


class Pizza(PizzaBase):
    """Class defining full serialization for `Pizza`.
    """
    id: int
    ingredients: List[Ingredient] = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()
    status: str

    @classmethod
    @validator('created_at', pre=True, always=True)
    def default_created(cls, val):
        """Check is create_at value given or initiate it.

        :param val: datetime value
        :return: datetime value
        """
        return val or datetime.now()

    @classmethod
    @validator('updated_at', pre=True, always=True)
    def default_modified(cls, val, values):
        """Check is updated_at value given or initiate it.

        :param val: datetime value
        :return: datetime value
        """
        return val or values['created_at']

    class Config:  # pylint: disable=too-few-public-methods
        """Config for Pizza Schema.
        """
        orm_mode = True


class PizzaEdit(PizzaBase):  # pylint: disable=too-few-public-methods
    """Class defining full serialization for `Pizza`.
    """
    id: int
    status: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    name: Optional[str]
    ingredients: Optional[List[Ingredient]]

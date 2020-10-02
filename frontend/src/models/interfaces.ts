import {Dispatch, SetStateAction} from "react";

/**
 * IngredientInterface definition of the ingredient type
 */
export interface IngredientInterface {
    name: string,
    count: number,
    id: number,
    created_at: string,
    updated_at: string
}

/**
 * PizzaInterface definition of the pizza type
 */
export interface PizzaInterface {
    name: string,
    ingredients: IngredientInterface[],
    status: string,
    id: number,
    created_at: string,
    updated_at: string
}

/**
 * Interface for sending message to the server to create an ingredient.
 * Should be a prt of the CreatePizzaInterface.
 */
export interface CreateIngredientInterface {
    name: string,
    count: number
}

/**
 * Interface for sending message to the server to create pizza.
 */
export interface CreatePizzaInterface {
    name: string,
    ingredients: CreateIngredientInterface[],
    status: string
}

/**
 * Interface for giving access to pizza data from parent
 * to children react components
 */
export interface PizzaPropsInterface {
    items: PizzaInterface[],
    onChange: Dispatch<SetStateAction<PizzaInterface[]>>,
    isLoading?: boolean
}
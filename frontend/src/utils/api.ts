import {CreatePizzaInterface, PizzaInterface} from "../models/interfaces"

/**
 * Backend URL generator.
 */
const PIZZAS_URL = (
    window
    && "location" in window
    && "protocol" in window.location
    && "host" in window.location
    && false
)
    ? window.location.protocol + "//" + window.location.host + "/api/pizzas/"
    : 'http://localhost:8000/api/pizzas/';

/**
 * Api to fetch pizzas.
 * return empty array if response status is not 200
 */
export const apiGetPizzas = async () =>
    await fetch(PIZZAS_URL).then(res => {
        if (res.status !== 200) return []
        try {
            return res.json();
        } catch (err) {
            return []
        }
    })

/**
 * Api to create pizza.
 * return null if response status is not 200
 *
 * @param data CreatePizzaInterface
 */
export const apiCreatePizza = async (data: CreatePizzaInterface) =>
    await fetch(PIZZAS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => {
        if (res.status !== 200) return null
        try {
            return res.json();
        } catch (err) {
            return null
        }
    })

/**
 * Api to update pizzas.
 * return null if response status is not 200
 *
 * @param data CreatePizzaInterface
 */
export const apiUpdatePizza = async (data: PizzaInterface) =>
    await fetch(PIZZAS_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.status !== 200) return null
        try {
            return res.json();
        } catch (err) {
            return null
        }
    })

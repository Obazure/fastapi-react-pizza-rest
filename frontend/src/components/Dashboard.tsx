// eslint-disable-next-line
import React, {FC, useEffect, useState} from 'react'
import {Card, Col, Row} from "antd"
import ListCard from "./ListCard"
import CreateCard from "./CreateCard"
import {useQuery} from "react-query"
import {apiGetPizzas} from "../utils/api"
import {PizzaInterface} from "../models/interfaces"

/**
 * Dashboard page for pizzas
 *
 * @constructor FC
 */
const Dashboard: FC = () => {

    const {isLoading, error, data} = useQuery("getPizzas",
        async () => await apiGetPizzas()
    );
    const emptyPizzaSet: PizzaInterface[] = []
    const [pizzas, setPizzas] = useState(emptyPizzaSet)
    const [apiLoadingStatus, setLoadingStatus] = useState(false)

    useEffect(() => {
        setLoadingStatus(isLoading)
    }, [isLoading])

    useEffect(() => {
        if (Array.isArray(data)) {
            setPizzas(data)
        } else {
            setPizzas(emptyPizzaSet)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <Row>
            <Col span={16} className="padding">
                <Card title="Pizza list">
                    {
                        error ? <p>An error has occurred: {JSON.stringify(error)}</p> :
                            <ListCard items={pizzas} onChange={setPizzas} isLoading={apiLoadingStatus}/>
                    }
                </Card>
            </Col>
            <Col span={8} className="padding">
                <Card title="Create pizza">
                    <CreateCard items={pizzas} onChange={setPizzas}/>
                </Card>
            </Col>
        </Row>
    )
}

export default Dashboard
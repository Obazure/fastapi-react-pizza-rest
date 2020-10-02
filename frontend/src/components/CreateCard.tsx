// eslint-disable-next-line
import React, {FC, useState} from 'react'
import {CreatePizzaInterface, PizzaPropsInterface} from "../models/interfaces"
import {Form, Input, Button, Select, InputNumber, Space} from "antd"
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons"
import {useMutation} from "react-query";
import {apiCreatePizza} from "../utils/api";

const {Option} = Select;

/**
 * Interface for `Ingredients` in form `CreateCard`.
 *
 * @description Due to count  word is reserved is js, field name could not be `count`
 * as in `IngredientInterface`, so creating pizza form works
 * with `ingredientName` and `ingredientCount`
 */
interface FormIngredientInterface {
    ingredientName: string,
    ingredientCount: number
}

/**
 * Component for creating pizza.
 *
 * @param props PizzaPropsInterface
 * @constructor FC
 */
const CreateCard: FC<PizzaPropsInterface> = (props) => {
    const pizzas = props.items
    const setPizzas = props.onChange

    const [savingStatusMessage, setSavingStatusMessage] = useState('')
    const [createPizza] = useMutation(async (record: CreatePizzaInterface) => await apiCreatePizza(record));

    const [form] = Form.useForm();

    const verticalLabelLayout = {
        labelCol: {span: 24},
        wrapperCol: {span: 24}
    }

    const onFinish = async (values: any) => {
        const newPizza: CreatePizzaInterface = {
            name: values.name,
            ingredients: values.ingredients ?
                values.ingredients.filter((item: FormIngredientInterface) => {
                    return item.ingredientName && item.ingredientName !== 'undefined'
                }).map(
                    (item: FormIngredientInterface) => {
                        return {
                            name: item.ingredientName,
                            count: item.ingredientCount
                        }
                    }) : [],
            status: 'waiting'
        }
        const savedPizza = await createPizza(newPizza)
        if (!savedPizza) {
            setPizzas([savedPizza, ...pizzas])
            form.resetFields();
            setSavingStatusMessage('')
        } else {
            setSavingStatusMessage('Saving error. Please try again.')
        }
    };

    const onReset = () => {
        form.resetFields();
    };


    return (
        <Form
            form={form}
            name="create-pizza"
            onFinish={onFinish}

            autoComplete="off">
            <Form.Item
                {...verticalLabelLayout}
                name="name"
                label="Pizza name"
                rules={[{
                    required: true,
                    message: 'Set pizza name'
                }]}
            >
                <Input placeholder="Margarita"/>
            </Form.Item>
            <p>Ingredients:</p>
            <Form.List name="ingredients">
                {(fields, {add, remove}) => (
                    <div>
                        {
                            fields.map((field, index) => (
                                <Space
                                    key={field.key}
                                    align={"end"}
                                    style={{display: 'flex'}}
                                    className="margin-vertical big-child"
                                >
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'ingredientName']}
                                        fieldKey={[field.fieldKey, 'ingredientName']}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Set preferred ingredient'
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Select preferred ingredient."
                                        >
                                            <Option value="cheese">Cheese</Option>
                                            <Option value="bacon">Bacon</Option>
                                            <Option value="mushrooms">Mushrooms</Option>
                                            <Option value="ananas">Ananas</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'ingredientCount']}
                                        fieldKey={[field.fieldKey, 'ingredientCount']}
                                        validateTrigger={['onChange', 'onBlur']}
                                        initialValue={1}

                                    >
                                        <InputNumber min={1} max={10}/>
                                    </Form.Item>
                                    {fields.length > 0 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button circle-remove-button"
                                            onClick={() => {
                                                remove(field.name);
                                            }}
                                        />
                                    ) : null}
                                </Space>
                            ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => {
                                    add();
                                }}
                                style={{width: '100%'}}
                            >
                                <PlusOutlined/> Add ingredient
                            </Button>
                        </Form.Item>
                    </div>

                )}
            </Form.List>
            {(savingStatusMessage && savingStatusMessage !== '') ?
                <p className="ant-form-item-has-error">{savingStatusMessage}</p> : ''}
            <Form.Item>
                <Button type="primary" htmlType="submit">Create Pizza</Button>
                <Button htmlType="button" onClick={onReset}>Reset</Button>
            </Form.Item>
        </Form>
    );
}

export default CreateCard
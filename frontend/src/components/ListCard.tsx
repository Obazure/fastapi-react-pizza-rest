// eslint-disable-next-line
import React, {FC, Key, useEffect, useState} from 'react';
import {Table, Input, Button, Tag, Space, Select} from 'antd';
import {SorterResult, TableCurrentDataSource, TablePaginationConfig} from "antd/lib/table/interface";
import {CarryOutOutlined, ClockCircleOutlined, SearchOutlined} from '@ant-design/icons'
import {FilterDropdownProps} from "antd/es/table/interface"
import {ColumnType} from "antd/lib/table"
import Highlighter from 'react-highlight-words'
import {IngredientInterface, PizzaInterface, PizzaPropsInterface} from "../models/interfaces"
import {useMutation} from "react-query"
import {apiUpdatePizza} from "../utils/api"

const Option = Select.Option;

/**
 * Component for present pizzas in a list and change its' status.
 *
 * @param props PizzaPropsInterface
 * @constructor FC
 */
const ListCard: FC<PizzaPropsInterface> = (props) => {
    const pizzas = props.items
    const isLoading = props.isLoading

    const initialPagination: TablePaginationConfig = {
        current: 1,
        pageSize: 5,
        total: pizzas ? pizzas.length : 0,
        position: ['bottomCenter']
    }

    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const [pagination, setPagination] = useState(initialPagination)

    const [updatingStatusMessage, setSavingStatusMessage] = useState('')
    const [updatePizza] = useMutation(
        async (record: PizzaInterface) => await apiUpdatePizza(record)
    );

    useEffect(() => {
        const newPaginationConfig = {...pagination, total: pizzas ? pizzas.length : 0}
        setPagination(newPaginationConfig)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pizzas])

    const onChangeStatus = async (value: string, record: PizzaInterface) => {
        const clonedObject = {...record}
        clonedObject.status = value
        const savedPizza = await updatePizza(clonedObject)
        if (!savedPizza) {
            record.status = savedPizza.status
            setSavingStatusMessage('')
        } else {
            setSavingStatusMessage('Saving error. Please try again.')
        }

    }

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, Key[] | null>,
        sorter: SorterResult<PizzaInterface> | SorterResult<PizzaInterface>[],
        {currentDataSource}: TableCurrentDataSource<PizzaInterface>) => {
        pagination.total = currentDataSource.length
        setPagination(pagination)
    }

    const handleSearch = (selectedKeys: Key[], confirm: any, dataIndex: string) => {
        confirm();
        setSearchText(selectedKeys[0].toString())
        setSearchedColumn(dataIndex)
    };

    const handleReset = (clearFilters: any) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchFilterProps = (dataIndex: string) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}: FilterDropdownProps) => (
            <div className="filter-pop-up">
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        className="search-button"
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        className="search-button"
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
    })

    const columns: ColumnType<PizzaInterface>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            className: 'capitalize',
            sorter: {
                compare: (a: PizzaInterface, b: PizzaInterface) => a.name < b.name ? -1 : 1,
                multiple: 1,
            },
            width: '30%',
            render: (text) => {
                return (searchedColumn === 'name') ? (
                    <Highlighter
                        highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                )
            },
            onFilter: (value, record) => {
                return record
                    ? record.name.toString().toLowerCase().includes(value.toString().toLowerCase())
                    : false
            },
            ...getColumnSearchFilterProps('name'),
        },
        {
            title: 'Ingredients',
            dataIndex: 'ingredients',
            key: 'ingredients',
            className: 'capitalize',
            render: (value: IngredientInterface[]) => {
                return value.map((ingredient, index) => {
                        const text = ingredient.name + ' ' + ingredient.count
                        return (
                            <Tag color="blue" className="capitalize margin-sm" key={ingredient.name + index}>
                                {(searchedColumn === 'ingredients') ? (
                                    <Highlighter
                                        highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                                        searchWords={[searchText]}
                                        autoEscape
                                        textToHighlight={text ? text.toString() : ''}
                                    />
                                ) : (text)
                                }
                            </Tag>
                        )
                    }
                )
            },
            width: '25%',
            onFilter: (value, record) => {
                return record
                    ? JSON.stringify(
                        record.ingredients.map(item => item.name + ' ' + item.count)
                    ).toLowerCase()
                        .includes(value.toString().toLowerCase())
                    : false
            },
            ...getColumnSearchFilterProps('ingredients'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            className: "capitalize",
            filters: [
                {text: "Waiting", value: "waiting"},
                {text: "Ready", value: "ready"},
            ],
            sorter: {
                compare: (a: PizzaInterface, b: PizzaInterface) => a.status > b.status ? -1 : 1,
                multiple: 1,
            },
            onFilter: (status, record) => {
                return record.status === status
            },
            width: '20%'
        },
        {
            title: 'Change status',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Select

                        defaultValue={record.status}
                        className="capitalize"
                        onChange={async (e) => {
                            await onChangeStatus(e, record)
                        }}
                    >
                        <Option value="waiting" title="Waiting"><ClockCircleOutlined/></Option>
                        <Option value="ready" title="Ready"><CarryOutOutlined/></Option>
                    </Select>
                </Space>
            ),
            width: '10%'
        },
    ];

    return (
        <div>
            {(updatingStatusMessage && updatingStatusMessage !== '') ?
                <p className="ant-form-item-has-error">{updatingStatusMessage}</p> : ''}
            <Table
                key="Table"
                rowKey="created_at"
                columns={columns}
                dataSource={pizzas}
                loading={isLoading}
                pagination={pagination}
                onChange={handleTableChange}
            />
        </div>
    )
}

export default ListCard
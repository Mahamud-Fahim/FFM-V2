import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import {useHistory} from 'react-router-dom'
import { Card, Button, Table, Space, Image, Switch, Popconfirm, Tag, Input, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import CompanyAdminForm from './CompanyManagerForm';
const Search = Input.Search;

function SuperCompanyManagerList() {
    let history = useHistory()
    const { user } = useSelector(state => state.auth)
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [admins, setAdmins] = useState([])
    const [records, setRecords] = useState([])

    const [showForm, setShowForm] = useState(false)


    useEffect(() => {
        if (user.sub) {
            setIsLoading(true)
            axios.get(`${process.env.REACT_APP_API_USER}/field-force/users/superadmin/list/admin-list`)
                .then(res => {
                    setAdmins(res.data.data);
                    setRecords(res.data.data);
                    setIsLoading(false)
                })
                .catch(err => {
                    setIsLoading(false)
                    console.log(err);
                })
        }

    }, [user,showForm])

    const handleBack=()=>{
        setShowForm(false)
    }


    const deleteUser = (id) => {
        axios.delete(`${process.env.REACT_APP_API_USER}/field-force/users/superadmin/remove/admin-remove/` + id)
            .then(res => {
                setAdmins(prev => (prev.filter((item) => item.id !== id)))
                setRecords(prev => (prev.filter((item) => item.id !== id)))
            }).catch(err => {
                console.log(err);
            });
    }


    const handleSearch = val => {

        if (val == "")
            setAdmins(records);
        else
        setAdmins(records.filter(x => x.email.includes(val)))

    }


    const columns = [

        {
            title: 'SL No',
            key: 'index',
            render: (text, record, index) =>(page - 1) * 10 + (index+1),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, superadmin) =>
                <span>{superadmin.first_name} {superadmin.last_name}</span>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: email =>
                <span>{email ? email : "N/A"}</span>
        },
        {
            title: 'Company Name',
            dataIndex: 'company_name',
            key: 'company_name',
            render: company_name =>
                <span>{company_name}</span>
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm onConfirm={() => deleteUser(record.id)} title="Are you sure???" icon={<QuestionCircleOutlined style={{ color: 'red' }} />}>
                        <Button className='d-center' icon={<DeleteOutlined />} danger></Button>
                    </Popconfirm>

                </Space>
            ),
        },
    ];


    const AdminList = () => (
        <Card title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Company Manager List</span>
            <Button onClick={()=>history.push('/company-manager-add')} type='primary' icon={<PlusOutlined />} className='d_center'>Add Company Manager</Button>
        </div>}>
            <Search
                placeholder="email"
                onSearch={handleSearch}
                style={{ width: 200 }}
            />
            <Table
                rowKey="_id"
                loading={isLoading}
                columns={columns}
                dataSource={admins}
                pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'], showQuickJumper: true,onChange(current){setPage(current)} }}
            />

        </Card>
    )
    return (
        <>
            {
                showForm ?
                <CompanyAdminForm handleBack={()=>handleBack()} />:
                <AdminList  />

             }
        </>
    )
}

export default SuperCompanyManagerList

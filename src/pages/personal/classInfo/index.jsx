import './index.css'
import React, {useEffect, useState} from 'react';
import {Button, Tag, Space, Select, Input, Modal, message, Popconfirm, Tooltip} from 'antd';
import ProList from '@ant-design/pro-list';
import request, {fetch} from 'umi-request';
import {deleteFunc, get, post} from "../../../services/request";
import {Link} from "react-router-dom";

const {Option} = Select

const ClassInfo = function () {
    const [data, setData] = useState()
    const [classSelect, setClassSelect] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [inputJSON, setInputJSON] = useState("{\n" +
        "    \"name\" : \"佐井\",\n" +
        "    \"email\" : \"zuojing@qq.com\",\n" +
        "    \"introduction\" : \"我叫佐井，擅长画画\",\n" +
        "    \"password\" : \"123\",\n" +
        "    \"avatar\" : \"http://cdn.ekko306.top/bishe/zuojing.png\",\n" +
        "    \"class\" : \"7\"\n" +
        "}")

    const refreshData = ()=> {
        get('/api/student').then((res) => {
            setData(res)
        })
    }

    useEffect(() => {
        refreshData()
    }, [])
    return (
        <>
            <div className="search">
                <div>班级：</div>
                <Select
                    style={{width: 240}}
                    placeholder="请选择班级"
                    allowClear
                    onChange={(value) => {
                        setClassSelect(value)
                    }}
                >
                    <Option value="3">三班</Option>
                    <Option value="7">七班</Option>
                    <Option value="8">八班</Option>
                    <Option value="10">十班</Option>
                </Select>
                <Button
                    type="primary"
                    style={{marginLeft: 'auto', marginRight: 0}}
                    onClick={() => {
                        if (!classSelect) {
                            refreshData()
                        } else {
                            get('/api/class/student/' + classSelect).then((res) => {
                                setData(res)
                            })
                        }
                    }}
                >
                    查询
                </Button>
            </div>

            <Modal title="Basic Modal" visible={isModalVisible}
                   onOk={() => {
                       let body
                       try {
                           body = JSON.parse(inputJSON)
                           if (typeof body !== 'object') throw Error
                           console.log(body)
                           post('/api/student',body).then(res=>{
                               message.success('学生信息模板正确，创建成功！')
                               refreshData()
                               setIsModalVisible(false)
                           }).catch((e)=>{
                               message.error('学生信息格式错误，创建失败！')
                           })
                       } catch (e) {
                           message.error('学生信息格式错误！')
                       }

                   }}
                   onCancel={() => {
                       setIsModalVisible(false)
                   }}>
                <Input.TextArea
                    rows={8}
                    value={inputJSON}
                    onChange={(e) => {
                        setInputJSON(e.target.value)
                    }}/>
            </Modal>

            <div style={{backgroundColor: 'rgb(240, 242, 245)'}}>
                <ProList
                    toolBarRender={() => {
                        return [
                            <Tooltip placement="topLeft" title="以宽松JSON对象创建！注意格式！">
                            <Button key="3" type="primary" onClick={() => {
                                setIsModalVisible(true)
                            }}>
                                增加同学
                            </Button>
                            </Tooltip>

                        ]
                    }}
                    rowKey="id"
                    headerTitle="学生列表"
                    dataSource={data}
                    showActions="hover"
                    metas={{
                        title: {
                            dataIndex: 'name',
                            title: '同学',
                            search: false
                        },
                        avatar: {
                            dataIndex: 'avatar',
                            search: false
                        },
                        description: {
                            dataIndex: 'introduction',
                            search: false
                        },
                        subTitle: {
                            dataIndex: 'class',
                            render: (_, row) => {
                                const colors = new Map([['3', 'green'], ['7', 'yellow'], ['8', 'purple'], ['10', 'blue']])
                                return (<Tag color={colors.get(row.class)} key={row.id}>{'班级：' + row.class}</Tag>)
                            },
                            search: false
                        },
                        actions: {
                            render: (text, row) => [
                                <a href={row.url} target="_blank"><Link to={'/showInfo/student/' + row.id}>查看</Link></a>,
                                <Popconfirm
                                    title="确定删除吗!?"
                                    onConfirm={()=>{
                                        deleteFunc('/api/student/'+row.id).then((res)=>{
                                            message.success('删除成功！')
                                            refreshData()
                                        }).catch((err)=>{
                                            message.error('删除失败！')
                                        })
                                    }}
                                    onCancel={()=>{}}
                                    okText="是的"
                                    cancelText="取消"
                                >
                                    <a href={row.url} target="_blank">删除</a>
                                </Popconfirm>

                            ],
                            search: false
                        }
                    }}
                />
            </div>
        </>

    )
}

export default ClassInfo
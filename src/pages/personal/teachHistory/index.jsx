import './index.css'
import React, {useEffect, useState} from 'react';
import {Tag, Button, Select, Popconfirm, message} from 'antd';
import {Link} from 'react-router-dom'
import {useNavigate} from "react-router";
import ProList from '@ant-design/pro-list';
import {useSelector} from "react-redux";
import {selectUserInfo} from "../../../store/features/user/userSlice";
import {deleteFunc, get} from "../../../services/request";

const { Option } = Select
// 一次性请求所有数据 免得分页麻烦 前端再来自己分页




const TeachHistory = function() {
    const navigate = useNavigate()
    const [classSelect, setClassSelect] = useState()
    const userInfo = useSelector(selectUserInfo)

    const [allRecordSave, setAllRecordSave] = useState([])
    const [record, setRecord] = useState([])

    useEffect(()=>{
        console.log(classSelect)
        // 不选择的时候
        if(classSelect === undefined) {
            setRecord(allRecordSave)
        } else {
            setRecord(allRecordSave.filter((e)=>{
                return e.class === classSelect
            }))
        }
    }, [classSelect])

    const colorMap = new Map([['3', 'lightblue'], ['7', 'lightgreen'], ['8', 'purple'], ['10', 'pink']])

    function detailTime(timestamp) {
        var date = new Date(parseInt(timestamp));
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s
    }

    let recordData = record.map((ele)=>({
        title: <div>记录标题：{ele.title}</div>,
        subTitle: <Tag color={colorMap.get(ele.class)}>班级{ele.class}</Tag>,
        actions: [<a key="run" onClick={()=>{navigate("/personal/teachHistory/" + ele.id)}}>查看</a>, <Popconfirm
            title="确定删除该记录？"
            onConfirm={()=>{
                deleteFunc('/api/record/' + ele.id).then(res=>{
                    message.success(`删除记录成功：标题：${ele.title}`)
                    refresh()
                })
            }}
            onCancel={()=>{}}
            okText="确定"
            cancelText="取消"
        >
            <a href="#">删除</a>
        </Popconfirm>],
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg',
        content: (
            <div
                style={{
                    flex: 1,
                    padding: '0 8px'
                }}
            >
                <div>介绍：{ele.introduction !== "" ? ele.introduction : "【这个人很懒没写介绍】"}</div>
                <div>时间：{detailTime(ele.time)}</div>
                <div>教学图片：</div>
                <img src={ele?.images ? ele.images[0] : ""} width="100%" style={{border: '4px groove pink'}}/>
            </div>
        )
    }))

    const refresh = () => {
        get('/api/record/teacher/' + userInfo.id).then(res=>{
            setRecord(res)
            setAllRecordSave(res)
            if(classSelect === undefined) {
                setRecord(res)
            } else {
                setRecord(res.filter((e)=>{
                    return e.class === classSelect
                }))
            }
        })
    }
    useEffect(()=>{
        refresh()
    }, [])

    useEffect(()=>{
        console.log(record, 'record')
    }, [record])

    return (
        <>
            <div className="operate">
                <Button type="primary" onClick={()=>{navigate("/teach")}}>
                    新建教学
                </Button>
                <Select
                    style={{marginLeft: 'auto', marginRight: 0, width: '200px'}}
                        allowClear
                        placeholder="选择班级"
                        onChange={(value) => {
                    setClassSelect(value)
                }}>
                    {userInfo.class.map((e, index) => {
                        return <Option key={index} value={e}>班级{e}</Option>
                    })}
                </Select>
            </div>
            <ProList
                pagination={{
                defaultPageSize: 4,
                showSizeChanger: false,
            }}
                grid={{ gutter: 16, column: 2 }}
                metas={{
                title: {},
                subTitle: {},
                type: {},
                avatar: {},
                content: {},
                actions: {cardActionProps: 'actions'},
            }}
                headerTitle="教学历史列表"
                dataSource={recordData}
                />
        </>
    )
}

export default TeachHistory
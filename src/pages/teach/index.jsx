import './index.css'
import {HubConnectionBuilder} from '@microsoft/signalr'
import React, {useEffect, useState} from "react";
import {Select, Input, Button, Skeleton, message, Modal, notification, Form, Cascader, Menu} from "antd";
import {Link, usePrompt} from "react-router-dom";

import Area1 from "../../components/area1";
import Area2 from "../../components/area2";
import Area3 from "../../components/area3";
import Area4 from "../../components/area4";
import {selectUserInfo, selectUserKind} from "../../store/features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {deleteFunc, post, put} from "../../services/request";
import {saveImage, selectImages} from "../../store/features/images/imagesSlice";
import AccessControl from "../../components/accessControl/AccessControl";
import {get} from "../../services/request";
import {UserOutlined} from "@ant-design/icons";


const {Option} = Select

const Teach = function () {
    const dispatch = useDispatch()
    const savedImages = useSelector(selectImages)
    const userInfo = useSelector(selectUserInfo)
    const [status, setStatus] = useState('loading')

    const [classSelect, setClassSelect] = useState("")
    const [title, setTitle] = useState("")
    const [onlineInfo, setOnlineInfo] = useState()
    const [chatContentString, setChatContentString] = useState()

    const [inputJSON, setInputJSON] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false)

    const userKind = useSelector(selectUserKind)

    // useEffect(()=>{
    //     // 不销毁了 end 为 false就是瞎搞的内容
    //     return ()=> {
    //         if(status === 'teaching' && onlineInfo && status !== "loading") {
    //             deleteFunc('/api/record/' + onlineInfo.teachRecordId).then((res)=>{
    //                 notification.warn({message: '警告操作:' , description: "您的未保存教学记录已销毁！！"})
    //             }).catch((err)=>{message.error('执行销毁失败')})
    //         }
    //     }
    // }, [status, onlineInfo])

    const [stu_onlineTeacher, setStu_onlineTeacher] = useState([])
    const [stu_teacherSelect, setStu_teacherSelect] = useState()

    const refreshTeacher = () => {
        if (!Array.isArray(userInfo.class)) { // 学生class 是字符串 才开始查询
            get('/api/online/teacher/' + userInfo.class).then(res => {
                setStu_onlineTeacher(res)
            })
        }
    }
    useEffect(() => {
        refreshTeacher()
    }, [])


    const teachRecordInit = {
        "title": "",
        "time": "",
        "introduction": "",
        "end": false,
        "chatContent": "",
        "graph": [],
        "teacherId": userInfo.id,
        "signalRId": userInfo.id,    // 这个表示组名 暂时用老师id当做组名保持唯一性 以后可以选择别的id
        "class": ""
    }

    usePrompt("您有未结束的教学！离开将丢失数据！！", status === 'teaching');

    useEffect(()=>{
        console.log(onlineInfo, 'onlineInfo')
    }, [onlineInfo])

    return (
        <div style={{display: "flex", flexDirection: 'column'}}>
            <Modal title="请完善历史记录！设置end和introduction以确定！" visible={isModalVisible}
                   onOk={() => {
                       let body
                       try {
                           body = JSON.parse(inputJSON)
                           if (typeof body !== 'object') throw Error
                           console.log(body)
                           let memoId = body.id
                           delete body.id
                           put('/api/record/' + memoId, body).then(res => {
                               message.success('历史信息模板正确，创建成功！')
                               setIsModalVisible(false)
                               // 保存记录后下线
                               deleteFunc('/api/online/' + userInfo.id).then((res) => {
                                   notification.success({
                                       message: '下线成功',
                                       description: '已断开singalR，下线成功'
                                   })
                               })
                               // dispatch(selectImages())
                               setStatus('end')
                           }).catch((e) => {
                               message.error('历史信息格式错误，创建失败！')
                           })


                       } catch (e) {
                           message.error('历史信息格式错误！')
                       }
                   }}
                   onCancel={() => {
                       setIsModalVisible(false)
                   }}>
                <Input.TextArea
                    rows={12}
                    value={inputJSON}
                    onChange={(e) => {
                        setInputJSON(e.target.value)
                    }}/>
            </Modal>
            <div className="header">
                <AccessControl
                    allowedPermissions={["在线教学权限"]}
                    renderNoAccess={() => (
                        <>
                            <div style={{width: '115px'}}>请选择教学老师：</div>
                            <Select style={{width: '180px'}} placeholder="为空时请刷新！" onChange={(value) => {
                                setStu_teacherSelect(JSON.parse(value))
                            }}>
                                {stu_onlineTeacher.map((e, index) => {
                                    return <Option key={index} value={JSON.stringify(e)}>{e.name}的教学</Option>
                                })}
                            </Select>
                            <Button style={{marginLeft: '10px'}} onClick={() => {
                                refreshTeacher()
                            }}>刷新</Button>
                            <Button
                                style={{marginLeft: 'auto', marginRight: 0}}
                                type="primary"
                                onClick={() => {
                                    setOnlineInfo({
                                        "teachRecordId": stu_teacherSelect.teachRecordId,
                                        "class": stu_teacherSelect.class,
                                        "personId": userInfo.id,
                                        "name": userInfo.name,
                                        "kind": "student",
                                        "signalRId": stu_teacherSelect.signalRId
                                    })
                                    post('/api/online', {
                                        "teachRecordId": stu_teacherSelect.teachRecordId,
                                        "class": stu_teacherSelect.class,
                                        "personId": userInfo.id,
                                        "name": userInfo.name,
                                        "kind": "student",
                                        "signalRId": stu_teacherSelect.signalRId
                                    }).then((res) => {
                                        console.log("创建在线信息成功！")
                                    })
                                    setStatus('teaching')
                                }}
                            >
                                加入教学
                            </Button>
                        </>
                    )}
                >
                    <div style={{width: '115px'}}>请选择授课班级：</div>
                    <Select style={{width: '180px'}} onChange={(value) => {
                        setClassSelect(value)
                    }}>
                        {Array.isArray(userInfo.class) && userInfo.class.map((e, index) => {
                            return <Option key={index} value={e}>班级{e}</Option>
                        })}
                    </Select>
                    <div style={{width: '115px', marginLeft: '20px'}}>请输入授课标题：</div>
                    <Input onChange={(e) => {
                        setTitle(e.target.value)
                    }} style={{width: '180px'}}/>
                    <Button style={{marginLeft: 'auto', marginRight: 0}}
                            type="primary"
                            onClick={() => {
                                dispatch(saveImage())
                                if (classSelect !== "" && title !== "") {
                                    teachRecordInit.title = title
                                    teachRecordInit.class = classSelect
                                    teachRecordInit.time = (new Date()).valueOf().toString() // 通通用时间戳
                                    // 两步骤 一是创建教学id 二是在在线表加入信息
                                    post('/api/record', teachRecordInit).then(res => {
                                        setInputJSON(JSON.stringify(res, null, 2))
                                        console.log(res, '创建教学历史成功！')
                                        setOnlineInfo({
                                            "teachRecordId": res.id,
                                            "class": res.class,
                                            "personId": userInfo.id,
                                            "name": userInfo.name,
                                            "kind": "teacher",
                                            "signalRId": userInfo.id
                                        })
                                        post('/api/online', {
                                            "teachRecordId": res.id,
                                            "class": res.class,
                                            "personId": userInfo.id,
                                            "name": userInfo.name,
                                            "kind": "teacher",
                                            "signalRId": userInfo.id
                                        }).then((res) => {
                                            console.log("创建在线信息成功！")
                                        })
                                    })
                                    setStatus('teaching')
                                } else {
                                    message.warning('请输入完整班级和标题！')
                                }
                            }}
                    >
                        开始授课
                    </Button>
                </AccessControl>

            </div>
            <div className="body">
                {status === "loading" &&
                <div className="loading">
                    请选择授课班级和标题后开始教学！
                    <Skeleton loading/>
                    <Skeleton active/>
                    <Skeleton loading/>
                    <Skeleton active/>
                    <Skeleton loading/>
                </div>
                }
                {status === "teaching" &&
                <div className="teaching">
                    <Area1 setChatContentString={setChatContentString} kind={userKind}/>
                    <Area2 onlineInfo={onlineInfo} teacherSelect={stu_teacherSelect}/>
                    <Area3/>
                    <AccessControl
                        allowedPermissions={["在线教学权限"]}
                        renderNoAccess={() => (
                            <div style={{background: 'white', width: "100%", height: "380px", padding: '10px'}}>
                                学生
                            </div>
                        )
                        }
                    >
                        <Area4
                            func={setStatus}
                            onEndFunc={() => {
                                setInputJSON((prev) => {
                                    let nowObj = JSON.parse(prev)
                                    nowObj.chat_content = chatContentString
                                    nowObj.images = savedImages.images
                                    console.log(nowObj, 'nowObj')
                                    return JSON.stringify(nowObj, null, 2)
                                })
                                setIsModalVisible(true);
                            }}/>
                    </AccessControl>

                </div>
                }
                {status === "end" &&
                <div className="end">
                    结束教学
                </div>
                }
            </div>
        </div>
    )
}

export default Teach
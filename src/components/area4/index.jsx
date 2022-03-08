import "./index.css"
import {Table, Space, Button, message, notification} from 'antd'
import {useSelector, useDispatch} from "react-redux";
import {selectSignalRConnection, selectSignalRGroupName} from "../../store/features/signalR/signalRSlice";
import {saveImage} from "../../store/features/images/imagesSlice";
import React, {useEffect, useState} from "react";
import {selectUserInfo} from "../../store/features/user/userSlice";
import {selectDrawing} from "../../store/features/drawing/drawingSlice";
import AccessControl from "../accessControl/AccessControl";
import {deleteFunc} from "../../services/request";
import {Subject} from "@microsoft/signalr";

function toReadTime(time) {
    var date = new Date(time)
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return h + m + s;
}

const columns = [
    {
        title: '编号',
        dataIndex: 'key',
    },
    {
        title: '创建者',
        dataIndex: 'name',
    },
    {
        title: '时间',
        dataIndex: 'time',
        render: (time, all) => (
            <div>{time}</div>
        )
    },
    {
        title: '操作',
        dataIndex: 'data',
        render: (data, all) => (
            <Space size="middle">
                {/*// 这里操作可能还有 加载 或者 删除 能实现 但是太麻烦了 懒得搞*/}
                <a onClick={()=>{
                    console.log(data, 'data')
                    console.log(all, 'all')
                    var iframe = "<iframe width='100%' height='100%' src='" + all.data +  "'></iframe>"
                    var x = window.open()
                    x.document.write(iframe)
                    x.document.close()
                }}>查看</a>
            </Space>
        ),
    },
];




const Area4 = ({func, onEndFunc, stu_status, setStu_status}) => {
    const dispatch = useDispatch()
    const [ready, setReady] = useState(false)
    const connection = useSelector(selectSignalRConnection, (item, prev)=>{
        if(item !== null) {
            setReady(true)
        }
    })
    const groupName = useSelector(selectSignalRGroupName)
    const userInfo = useSelector(selectUserInfo)
    const drawing = useSelector(selectDrawing)


    const [data, setData] = useState([])
    const [stu_statusIn, setStu_statusIn] =useState('unAllowEdit')
    useEffect(()=>{
        setStu_statusIn(stu_status)
        notification.info({
            message: '状态改变!',
            description: '老师改变了学生状态：'+stu_status,
        })
        if(stu_status === 'end') {
            connection.invoke("SendStatusInGroup", groupName, 'end')
        }
        // 组名参数
    }, [stu_status])

    const alertSave = (user, image, time) => {
        setData((prevState => {
            let copy = prevState.slice()
            if(Array.isArray(copy)) {
                copy.push({
                    key: (copy.length + 1).toString(),
                    name: user,
                    time: toReadTime(parseInt(time)),
                    data: image
                })
                console.log(copy, 'copy')
                return copy
            }
        }))
    }
    useEffect(()=>{
        if(ready) {
            // connection.on("ReceiveSavedImage", (user, image, time) => {
            //     alertSave(user, image, time)
            // })
            connection.on("ReceiveSavedImageStream", (data)=>{
                // 字符串是base64 + $ + groupName + user + time 自己再拆分
                console.log(data, '我想要的数据')
                let spiltStrings = data.split("$");
                let objectData = JSON.parse(spiltStrings[1])

                alertSave(objectData.user, spiltStrings[0], objectData.time)
            })
            connection.on("ReceiveStatus", (groupName, status) => {
                setStu_status(status)
            })
        }
    }, [ready])

    useEffect(()=>{
        console.log(data)
        // data改变的时候 在redux里存
        if(data.length !== 0) {
            let newString = data[data.length -1].data
            dispatch(saveImage(newString))
        }
    }, [data])

    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }


    useEffect(()=>{
        return ()=>{
            deleteFunc('/api/online/' + userInfo.id).then((res) => {
                if(res.code !== -1) {
                    notification.success({
                        message: '下线成功',
                        description: '已断开singalR，下线成功'
                    })
                }
            })
        }
    }, [userInfo])

    // useEffect(()=>{
    //     console.log(handEnd, '正常')
    //     return ()=> {
    //         console.log(handEnd, '返回函数')
    //     }
    // }, [handEnd])

    function sendSavedImageByStream(groupName, user, message, time) {
        var tempObject= {
            groupName,
            user,
            time
        }
        var messages = message + "$" + JSON.stringify(tempObject) + "#"
        var subject = new Subject();
        var chunkSize = 5;
        connection.send("UploadSavedImageStream", subject).catch(err => console.error(err.toString())).catch(err => console.error(err.toString()));
        for (var i = 0; i < messages.length; i += chunkSize) {
            subject.next(messages.slice(i, i + chunkSize));
        }
    }

    return (
        <div style={{background: 'white', width: "100%", height: "380px", padding: '10px'}}>
            <AccessControl
                allowedPermissions={["在线教学权限"]}
                renderNoAccess={() => (
                    <div>
                        <div style={{border: '2px orange dotted'}}>当前状态：{stu_statusIn}</div>
                        <div>1. 若状态为unAllowEdit：你不可编辑，只能查看老师教学</div>
                        <div onClick={()=>{setStu_status('allowEdit')}}>2. 若状态为allowEdit：可编辑并且提交你的作品</div>
                        <div>3. 若状态为end：老师已结束教学您可退出</div>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Button type="primary" disabled={stu_status!=='allowEdit'} onClick={()=>{
                                sendSavedImageByStream(groupName, userInfo.name, drawing,(new Date()).valueOf().toString());
                                // connection.invoke("SendSavedImageInGroup", groupName, userInfo.name, drawing, (new Date()).valueOf().toString())
                            }}>上传截图</Button>
                            <Button style={{marginLeft: "auto", marginRight: 0}} type="danger" onClick={()=>{
                                deleteFunc('/api/online/' + userInfo.id).then((res) => {
                                    notification.success({
                                        message: '下线成功',
                                        description: '已断开singalR，下线成功'
                                    })
                                    func('end');
                                })
                            }}>退出教学</Button>
                        </div>
                    </div>
                )
                }
            >
                <div className="operate123">
                    <Button type="primary" onClick={()=>{
                        // TODO
                        //  1. 一个是调用SendSavedImageInGroup方法 传给老师（只有老师监听ReceiveSavedImage） 老师自己发给自己也行
                        //  （同学需要有权限之后才能调用，权限要设计另外一个api）
                        //  2. 二个是保存到redux（在ReceiveSavedImage的事件里保存）

                        sendSavedImageByStream(groupName, userInfo.name, drawing,(new Date()).valueOf().toString());
                        // connection.invoke("SendSavedImageInGroup", groupName, userInfo.name, drawing, (new Date()).valueOf().toString())
                    }}>保存绘图上传</Button>
                    <Button type="primary" onClick={()=>{
                        connection.invoke("SendStatusInGroup", groupName, 'allowEdit')
                    }}>开启分享</Button>
                </div>
                <Table columns={columns} dataSource={data} onChange={onChange}
                       pagination={{
                           pageSize: 4,
                       }}/>
                <Button type="danger" style={{position: 'relative', top: '-47.5px'}} onClick={()=>{
                    onEndFunc(true) // 打开保存历史记录
                    //如果成功调用下面改变status
                    // func('end');
                }}>结束教学</Button>
            </AccessControl>

        </div>
    )
}

export default Area4
import "./index.css"
import {Table, Space, Button} from 'antd'
import {useSelector, useDispatch} from "react-redux";
import {selectSignalRConnection, selectSignalRGroupName} from "../../store/features/signalR/signalRSlice";
import {saveImage} from "../../store/features/images/imagesSlice";
import {useEffect, useState} from "react";
import {selectUserInfo} from "../../store/features/user/userSlice";
import {selectDrawing} from "../../store/features/drawing/drawingSlice";

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
                <a>删除</a>
                <a>加载</a>
            </Space>
        ),
    },
];




const Area4 = ({func, onEndFunc}) => {
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
            connection.on("ReceiveSavedImage", (user, image, time) => {
                alertSave(user, image, time)
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

    return (
        <div style={{background: 'white', width: "100%", height: "380px", padding: '10px'}}>
            <div className="operate123">
                <Button type="primary" onClick={()=>{
                    // TODO
                    //  1. 一个是调用SendSavedImageInGroup方法 传给老师（只有老师监听ReceiveSavedImage） 老师自己发给自己也行
                    //  （同学需要有权限之后才能调用，权限要设计另外一个api）
                    //  2. 二个是保存到redux（在ReceiveSavedImage的事件里保存）
                    connection.invoke("SendSavedImageInGroup", groupName, userInfo.name, drawing, (new Date()).valueOf().toString())
                }}>保存绘图上传</Button>
                <Button type="primary">开启分享</Button>
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
        </div>
    )
}

export default Area4
import "./index.css"
import {HubConnectionBuilder} from '@microsoft/signalr'
import {useState, useEffect} from "react";
import {Input, Button, notification} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {saveSignalR} from "../../store/features/signalR/signalRSlice";
import {loginUser, selectUserInfo} from "../../store/features/user/userSlice";
import ChatComponent from "../chatComponent";
import useSound from "use-sound";
import sendSound from '../../assets/mixkit-software-interface-start-2574.wav'
import receiveSound from '../../assets/mixkit-software-interface-back-2575.wav'


const Area1 = ({setChatContentString, kind, onlineInfo}) => {
    const dispatch = useDispatch()
    const userInfo = useSelector(selectUserInfo);
    const [connection, setConnection] = useState(undefined)
    const [buttonFlag, setButtonFlag] = useState(true)
    const [inputMessage, setInputMessage] = useState("")

    const [play] = useSound(sendSound)
    const [playBack] = useSound(receiveSound)


    // const [chat, setChat] = useState([
    //     {
    //         name: '旗木卡卡西',
    //         chat: '你好',
    //         time: (new Date()).valueOf().toString(),
    //     },
    //     {
    //         name: '迈特凯',
    //         chat: '我们来比试把！我永远的对手！',
    //         time: (new Date()).valueOf().toString(),
    //     },
    //     {
    //         name: '旗木卡卡西',
    //         chat: '好吧(╯▽╰)',
    //         time: (new Date()).valueOf().toString(),
    //     },
    //     {
    //         name: '系统通知：',
    //         chat: '新同学鸣人加入了本次教学',
    //         time: (new Date()).valueOf().toString()
    //     },
    //     {
    //         name: '迈特凯',
    //         chat: '那我们比什么？',
    //         time: (new Date()).valueOf().toString(),
    //     },
    // ])
    const [chat, setChat] = useState([])


    useEffect(() => {
        if(onlineInfo) {
            let saveString = chat.map(e=>JSON.stringify(e))
            setChatContentString(saveString.toString())

            let connectionInit = new HubConnectionBuilder().withUrl("/teachHub").build();

            connectionInit.on("ReceiveChat", function (user, message, time) {
                console.log(user, 'user')
                console.log(message, 'message')
                console.log(time, 'time')
                setChat((prev) => {
                    // 不能直接修改原state 要复制再return 来触发渲染
                    let copy = prev.slice()
                    copy.push({
                        name: user,
                        chat: message,
                        time: time
                    })
                    let saveString = copy.map(e=>JSON.stringify(e))
                    setChatContentString(saveString.toString())
                    return copy
                })

            });

            connectionInit.start()
                .then(function (msg) {
                        setButtonFlag(false)
                        notification.success({
                            message: '成功连接',
                            description: '成功连接到signalR，上线成功',
                        })
                        // 组名参数
                        console.log(kind, 'userKind!!!看看能不能获取！！ 烦死了')

                    if(kind === 'teacher') {
                        connectionInit.invoke("AddTeacherToGroup", userInfo.name, onlineInfo.signalRId, (new Date()).valueOf().toString())
                    } else if(kind === 'student') {
                        connectionInit.invoke("AddStudentToGroup", userInfo.name, onlineInfo.signalRId, (new Date()).valueOf().toString())
                    }

                    }
                ).catch(function (err) {
                notification.error({
                    message: '连接失败',
                    description: '连接到signalR失败：' + err.toString()
                })
                return console.error(err.toString());
            });

            setConnection(connectionInit)

            console.log('保存connection')
                dispatch(saveSignalR({
                    connection: connectionInit,
                    groupName: onlineInfo.signalRId
                }))
            console.log('保存connection')
        }
        }, [onlineInfo]
    )


    return (
        <div style={{background: 'white', width: "100%", height: "380px"}}>
            {onlineInfo && (
                <>
                    <ChatComponent data={chat}/>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Input.TextArea
                            placeholder='输入消息'
                            style={{width: 500}}
                            onChange={(e) => {
                                setInputMessage(e.target.value)
                            }}
                        />
                        <Button
                            style={{height: 54, marginLeft: 'auto', marginRight: 0}}
                            disabled={buttonFlag}
                            onClick={() => {
                                console.log(userInfo.name)
                                console.log(inputMessage)
                                // connection.invoke("SendMessage", userInfo.name, inputMessage, (new Date()).valueOf().toString()).catch((err) => {
                                //     return console.error(err.toString())
                                // })
                                connection.invoke("SendChatInGroup", onlineInfo.signalRId, userInfo.name, inputMessage, (new Date()).valueOf().toString()).catch((err) => {
                                    return console.error(err.toString())
                                })
                                play()

                            }}>
                            发送
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Area1
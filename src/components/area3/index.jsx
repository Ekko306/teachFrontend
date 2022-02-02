import "./index.css"
import startPaint from "./19_paint";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectSignalRConnection, selectSignalRGroupName} from "../../store/features/signalR/signalRSlice";
import {selectUserInfo} from "../../store/features/user/userSlice";

const Area3 = ({disabled = true}) => {
    const dispatch = useDispatch()
    const [ready, setReady] = useState(false)
    const userInfo = useSelector(selectUserInfo)
    const connection = useSelector(selectSignalRConnection, (item, prev) => {
        if (item !== null) {
            setReady(true)
        }
    })
    const [disabledIn, setDisabledIn] = useState()
    useEffect(()=>{
        setDisabledIn(disabled)
        console.log('disabled变化了', disabled)
    },[disabled])
    const groupName = useSelector(selectSignalRGroupName)
    useEffect(() => {
        if (ready) {
            var paintDom = document.getElementById("painting")
            startPaint(paintDom, connection, groupName, userInfo.name, dispatch)
        }

    }, [ready])

    return (
        <div style={{background: 'white', width: "100%", height: "380px", position: 'relative'}} id="painting">
            {disabledIn && <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: "100%",
                height: "380px",
                opacity: '0'
            }}>测试</div>}
        </div>

    )
}

export default Area3
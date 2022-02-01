import "./index.css"
import startPaint from "./19_paint";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectSignalRConnection, selectSignalRGroupName} from "../../store/features/signalR/signalRSlice";
import {selectUserInfo} from "../../store/features/user/userSlice";

const Area3 = () => {
    const dispatch = useDispatch()
    const [ready, setReady] = useState(false)
    const userInfo = useSelector(selectUserInfo)
    const connection = useSelector(selectSignalRConnection, (item, prev)=>{
        if(item !== null) {
            setReady(true)
        }
    })
    const groupName = useSelector(selectSignalRGroupName)
    useEffect(()=>{
        if(ready) {
            var paintDom = document.getElementById("painting")
            startPaint(paintDom, connection, groupName, userInfo.name, dispatch)
        }

    }, [ready])

    return (
            <div style={{background: 'white', width: "100%", height: "380px"}} id="painting">
            </div>
    )
}

export default Area3
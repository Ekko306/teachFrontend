import "./index.css"
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {selectUserInfo} from "../../store/features/user/userSlice";
import {useState, useEffect, useRef} from "react";
import useSound from "use-sound";
import receiveSound from "../../assets/mixkit-software-interface-back-2575.wav";

const ChatComponent = ({data, height=325}) => {
    const userInfo = useSelector(selectUserInfo)

    const [playBack] = useSound(receiveSound)
    const chatRef = useRef(null)


    useEffect(() => {
        console.log(data)
        console.log(playBack)
        chatRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start'})
        if(data[data.length - 1].name !== userInfo.name && height === 325) { // 不是自己发出提示音
            playBack()
        }
    }, [data,playBack])

    function toReadTime(timestamp) {
        var date = new Date(parseInt(timestamp))
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return h + m + s;
    }

    return (
        <div className='chatComponent' id="chatComponent" style={{height: height}}>
            {data.map((ele, index) => {
                const self = userInfo.name === ele.name
                if (ele.name === "系统通知：") {
                    return <span key={index} style={{alignSelf: 'center'}}>{toReadTime(ele.time) + " " + ele.name + ele.chat}</span>
                } else {
                    return (
                        <span key={index} className={classNames('border', {'rightText': self})}>
                        <span>{toReadTime(ele.time)}</span>
                        <span>{(self ? '' : `${ele.name}: `) + ele.chat}</span>
                    </span>
                    )
                }
            })}
            <div id="endRef" ref={chatRef}></div>
        </div>
    )
}

export default ChatComponent
import "./index.css"
import {Table, Tag, Space} from 'antd'
import {useState, useEffect} from "react";
import {get} from "../../services/request";
import {useSelector} from "react-redux";
import {selectUserInfo} from "../../store/features/user/userSlice";
import {ReactPolling} from "react-polling/lib/ReactPolling";


const Area2 = ({onlineInfo, teacherSelect}) => {
    const userInfo = useSelector(selectUserInfo)
    const [allPeople, setAllPeople] = useState()
    const [onlinePeople, setOnlinePeople] = useState()

    // 学生查看
    useEffect(()=>{
        if(onlineInfo) {
            get('/api/class/student/'+ onlineInfo.class).then(res=>{
                let needData = res.map((ele)=>{
                    return {name: ele.name}
                })
                if (teacherSelect) {
                    needData.unshift({name: teacherSelect.name}) // 对于学生
                } else {
                    needData.unshift({name: userInfo.name}) // 对于老师
                }

                get('/api/online/student/' + onlineInfo.teachRecordId).then(res => {
                    let onlineName = []
                    res.forEach((ele)=> {onlineName.push(ele.name)})
                    let finalData = needData.map((ele, index) => {
                        ele.key=index+1;
                        if(onlineName.includes(ele.name) || index === 0){
                            ele.status = "on"
                        } else {
                            ele.status = "off"
                        }
                        return ele
                    })
                    setAllPeople(finalData)
                })
            })
        }
    },[onlineInfo])

    const statusMap = new Map([['on', '🟩'], ['off', '🟥']])
    const columns = [
        {
          title: "序号",
          dataIndex: "key",
          key: 'key'
        },
        {
            title: '名字',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status > b.status,
            render: text => <div>{statusMap.get(text)}</div>
        }
    ];
    return (
        <div style={{background: 'white', width: "100%", height: "380px"}}>
            {onlineInfo && <ReactPolling
                url={'/api/online/student/' + onlineInfo?.teachRecordId}
                interval= {5000}
                method={'GET'}
                onSuccess={(res)=>{
                    console.log('轮询成功')
                    setAllPeople((prev)=>{
                        let onlineName = []
                        res.forEach((ele)=> {onlineName.push(ele.name)})
                        return prev.map((ele, index) => {
                            if(onlineName.includes(ele.name) || index === 0){
                                ele.status = "on"
                            } else {
                                ele.status = "off"
                            }
                            return ele
                        })
                    })
                    return true
                }}
                render={()=>{
                    return <Table dataSource={allPeople} columns={columns} pagination={{pageSize: 5}}/>
                }}
            />}
        </div>
    )
}

export default Area2
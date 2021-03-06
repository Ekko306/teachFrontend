import './index.css'
import {Link, useParams} from 'react-router-dom'
import { Breadcrumb, Button } from 'antd';
import React, {useEffect, useState} from "react";
import {get} from "../../../../services/request";
import Lightbox from "react-image-lightbox";
import ChatComponent from '../../../../components/chatComponent'


const HistoryDetail = function() {
    const params = useParams()
    const [recordDetail, setRecordDetail] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)

    const [chatContent, setChatContent] = useState()
    useEffect(()=>{
        get('/api/record/' + params.recordId).then((res)=>{
            console.log(res, 'res')
            setRecordDetail(res)
            let chat = res.chat_content.split(/},/)
            console.log(chat, 'chat123123123123123')
            chat = chat.map((e, index) => {
                let copy = e
                if(index !== chat.length -1) {
                    copy = e + '}'
                }
                return JSON.parse(copy)
            })
            setChatContent(chat)
        })
    }, [])

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
    return (
        <>

            {isOpen && (
                <Lightbox
                    mainSrc={recordDetail?.images[photoIndex]}
                    nextSrc={recordDetail?.images[(photoIndex + 1) % recordDetail?.images.length]}
                    prevSrc={recordDetail?.images[(photoIndex + recordDetail?.images.length - 1) % recordDetail?.images.length]}
                    onCloseRequest={() => {
                        setIsOpen(false)
                        console.log(photoIndex, 'photoIndex')
                    }}
                    onMovePrevRequest={() => {
                        setPhotoIndex((photoIndex + recordDetail?.images.length - 1) % recordDetail?.images.length)
                    }
                    }
                    onMoveNextRequest={() => {
                        setPhotoIndex((photoIndex + 1) % recordDetail?.images.length)
                    }
                    }
                />
            )}
            <Breadcrumb>
                <Breadcrumb.Item key="/personal/teachHistory">
                    <Link to="/personal/teachHistory">????????????</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item key="/personal/teachHistory/1">
                    <Link to="/personal/teachHistory/1">????????????</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <div className="recordDetail">
                <div className="leftDetail">
                    <div>??????ID???{params.recordId}</div>
                    <div>?????????{recordDetail?.title}</div>
                    <div>?????????{detailTime(recordDetail?.time)}</div>
                    <div>??????ID????????????:{recordDetail?.teacherId}</div>
                    <div>???????????????ID: {recordDetail?.signalRId}</div>
                    <div>??????:{recordDetail?.introduction}</div>
                    <div>?????????????????????{recordDetail?.end.toString()}</div>
                    <div>???????????????{recordDetail?.class}</div>
                    <div>??????????????????({ Array.isArray(recordDetail?.images) ? '???'+ recordDetail?.images.length + '???' : '??????????????????'})???
                        {Array.isArray(recordDetail?.images) && <Button type="primary" onClick={()=>{setIsOpen(true)}}>????????????</Button>}
                    </div>
                </div>
                <div className="rightDetail">
                    {chatContent && <ChatComponent data={chatContent} height={380}/>}
                </div>
            </div>
        </>
    )
}

export default HistoryDetail
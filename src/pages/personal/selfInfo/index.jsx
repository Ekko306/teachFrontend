import './index.css'
// 这里有两种页面 教师和学生的个人信息设置
import React, {useEffect, useState} from 'react'
import {
    Form,
    Input,
    Cascader,
    Select,
    Button,
    Image,
    message
} from 'antd';
import daitu from '../../../assets/daitu.jpeg'
import {FileImageOutlined} from '@ant-design/icons';

import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css'
import {useDispatch, useSelector} from "react-redux";
import {selectUserInfo, selectUserKind} from "../../../store/features/user/userSlice";
import {put} from "../../../services/request";

import {loginUser} from '../../../store/features/user/userSlice'
import AccessControl from "../../../components/accessControl/AccessControl";

import sendSound from '../../../assets/mixkit-software-interface-start-2574.wav'
import receiveSound from '../../../assets/mixkit-software-interface-back-2575.wav'


const {Option} = Select;
const residences = [
    {
        value: 'yuwen',
        label: '语文系',
        children: [
            {
                value: 'jiaoshi',
                label: '教师',
            },
            {
                value: 'xizhuren',
                label: '系主任'
            },
            {
                value: 'jiaoxuezhuren',
                label: '教学主任'
            },
            {
                value: 'shixi',
                label: '实习教师'
            }
        ],
    },
    {
        value: 'shuxue',
        label: '数学系',
        children: [
            {
                value: 'jiaoshi',
                label: '教师',
            },
            {
                value: 'xizhuren',
                label: '系主任'
            },
            {
                value: 'jiaoxuezhuren',
                label: '教学主任'
            },
            {
                value: 'shixi',
                label: '实习教师'
            }
        ],
    },
    {
        value: 'meishu',
        label: '美术系',
        children: [
            {
                value: 'jiaoshi',
                label: '教师',
            },
            {
                value: 'xizhuren',
                label: '系主任'
            },
            {
                value: 'jiaoxuezhuren',
                label: '教学主任'
            },
            {
                value: 'shixi',
                label: '实习教师'
            }
        ],
    },
];
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};

const SelfInfo = function () {

    const dispatch = useDispatch()

    const userInfo = useSelector(selectUserInfo);
    const userKind = useSelector(selectUserKind)

    const [form] = Form.useForm();

    const [avatarSelect, setAvatarSelect] = useState()

    useEffect(()=>{
        setAvatarSelect(userInfo.avatar)
    }, [])

    const onFinish = (values) => {
        if(userKind === 'teacher') {
            console.log('values', values)
            let copy = values
            delete copy.prefix
            copy.department = {
                first: values.department[0],
                second: values.department[1],
            }
            copy.password = userInfo.password
            copy.avatar = avatarSelect

            put('/api/teacher/'+ userInfo.id, copy).then((res)=>{
                console.log(res)

                if(res.code != -1) {
                    dispatch(loginUser({
                        info: res,
                        kind: 'teacher',
                        permissions: ['管理个人面板','教学管理权限', '教师信息维护']
                    }))
                    message.success('修改成功！')
                } else {
                    message.error('失败' +  JSON.stringify(res.code))
                }
            }).catch((err)=>{
                message.error('失败' +  JSON.stringify(err))
            })

            console.log('Received values of form: ', copy);
        } else if(userKind === 'student') {
            let copy = values
            delete copy.prefix
            copy.password = userInfo.password
            copy.avatar = avatarSelect

            put('/api/student/'+ userInfo.id, copy).then((res)=>{
                console.log(res)

                if(res.code != -1) {
                    dispatch(loginUser({
                        info: res,
                        kind: 'student',
                        permissions: []
                    }))
                    message.success('修改成功！')
                } else {
                    message.error('失败' +  JSON.stringify(res.code))
                }
            }).catch((err)=>{
                message.error('失败' +  JSON.stringify(err))
            })

            console.log('Received values of form: ', copy);
        }

    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );

    const [isOpen, setIsOpen] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)

    const images = [
        userInfo?.avatar,
        'https://placekitten.com/4000/3000',
        'https://placekitten.com/800/1200',
        'https://placekitten.com/1500/1500',
    ]

    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="basicText">基本设置</div>

            {isOpen && (
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    onCloseRequest={() => {
                        setIsOpen(false)
                        console.log(photoIndex, 'photoIndex')
                    }}
                    onMovePrevRequest={() => {
                        setPhotoIndex((photoIndex + images.length - 1) % images.length)
                        setAvatarSelect(images[(photoIndex + images.length - 1) % images.length])
                    }
                    }
                    onMoveNextRequest={() => {
                        setPhotoIndex((photoIndex + 1) % images.length)
                        setAvatarSelect(images[(photoIndex + 1) % images.length])
                    }
                    }
                />
            )}

            <Form
                layout='vertical'
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                    email: userInfo?.email,
                    name: userInfo?.name,
                    introduction: userInfo?.introduction,
                    department: [userInfo?.department?.first, userInfo?.department?.second], //
                    class: userInfo?.class,
                    home: userInfo?.home, //
                    phone: userInfo?.phone, //
                    prefix: '86',
                }}
                scrollToFirstError
                style={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}
            >
                <div className="bingpai">
                    <div className="left">
                        <Form.Item
                            name="email"
                            label="邮箱"
                            rules={[
                                {
                                    type: 'email',
                                    message: '您输入的不是邮箱！',
                                },
                                {
                                    required: true,
                                    message: "请输入邮箱！",
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label="昵称"
                            tooltip="你想要其他老师同学如何称呼你？"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入你的昵称！',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="introduction"
                            label="个人简介"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入个人简介',
                                },
                            ]}
                        >
                            <Input.TextArea showCount maxLength={100}/>
                        </Form.Item>
                    </div>
                    <div className="right">
                        <Image src={avatarSelect} height={144} style={{borderRadius: '50%'}}/>
                        <Button
                            style={{marginTop: '24px', width: '112px'}}
                            type="default"
                            icon={<FileImageOutlined/>}
                            onClick={() => {
                                setIsOpen(true)
                            }}>更换头像</Button>
                    </div>
                </div>

                <div style={{width: '694px'}}>

                    <AccessControl
                        allowedPermissions={["教师信息维护"]}
                        renderNoAccess={() => null}
                    >
                        <Form.Item
                            name="department"
                            label="部门信息"
                            rules={[
                                {
                                    type: 'array',
                                    required: true,
                                    message: '请选择你的部门信息！',
                                },
                            ]}
                        >
                            <Cascader options={residences}/>
                        </Form.Item>
                    </AccessControl>

                    <AccessControl
                        allowedPermissions={["教师信息维护"]}
                        renderNoAccess={() => (
                            <Form.Item
                                name="class"
                                label="班级"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择班级！',
                                    },
                                ]}
                            >
                                <Select
                                    style={{width: '100%'}}
                                    onChange={(value) => {
                                        console.log('choice', value)
                                    }}
                                >
                                    <Option key='7'>七班</Option>
                                    <Option key='8'>八班</Option>
                                    <Option key='10'>十班</Option>
                                    <Option key='3'>三班</Option>
                                </Select>
                            </Form.Item>
                        )}
                    >
                        <Form.Item
                            name="class"
                            label="负责班级"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择负责班级！',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                style={{width: '100%'}}
                                onChange={(value) => {
                                    console.log('choice', value)
                                }}
                            >
                                <Option key='7'>七班</Option>
                                <Option key='8'>八班</Option>
                                <Option key='10'>十班</Option>
                                <Option key='3'>三班</Option>
                            </Select>
                        </Form.Item>
                    </AccessControl>

                    <AccessControl
                        allowedPermissions={["教师信息维护"]}
                        renderNoAccess={() => null}
                    >
                        <Form.Item
                            name="department"
                            label="部门信息"
                            rules={[
                                {
                                    type: 'array',
                                    required: true,
                                    message: '请选择你的部门信息！',
                                },
                            ]}
                        >
                            <Cascader options={residences}/>
                        </Form.Item>
                        <Form.Item
                            name="home"
                            label="住址"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入你的住址！',
                                    whitespace: true,
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="电话"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入你的电话号码!',
                                },
                            ]}
                        >
                            <Input
                                addonBefore={prefixSelector}
                                style={{
                                    width: '100%',
                                }}
                            />
                        </Form.Item>
                    </AccessControl>




                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            更新信息
                        </Button>
                    </Form.Item>
                </div>

            </Form>

        </div>
    )
}

export default SelfInfo
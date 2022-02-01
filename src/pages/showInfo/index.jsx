import './index.css'
// 这里有两种页面 教师和学生的个人信息查看
import React, {useEffect, useState} from 'react'
import {
    Form,
    Input,
    Cascader,
    Select,
    Button,
    Image,
} from 'antd';
import Lightbox from "react-image-lightbox";
import daitu from "../../assets/daitu.jpeg";
import {FileImageOutlined} from "@ant-design/icons";
import {useParams} from "react-router-dom";
import {get} from "../../services/request";

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

const ShowInfo = function() {
    const params = useParams()

    const [avatarSelect, setAvatarSelect] = useState()

    useEffect(()=>{
        get(`/api/${params.kind}`,params.id).then((res)=>{
            console.log(res, 'res123123')
            form.setFieldsValue({
                email: res?.email,
                name: res?.name,
                introduction: res?.introduction,
                department: [res?.department?.first, res?.department?.second],
                class: res?.class,
                home: res?.home,
                phone: res?.phone,
                prefix: '86',
            })
            setAvatarSelect(res.avatar)
        })
    },[])
    const [form] = Form.useForm();
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

    return (
        <>
            <fieldset disabled>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div className="basicText">信息查看</div>

                    <Form
                        layout='vertical'
                        form={form}
                        name="register"
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
                            </div>
                        </div>


                        <div style={{width: '694px'}}>
                            {params.kind === "teacher" &&
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
                            }

                            {params.kind === "teacher" ?
                                (<Form.Item
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
                                </Form.Item>) :
                                (
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
                                )
                            }

                            {params.kind === "teacher" && (
                                <>
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
                                </>
                            )
                            }

                        </div>

                    </Form>

                </div>
            </fieldset>
        </>
    )
}

export default ShowInfo
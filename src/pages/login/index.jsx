import './index.css'
import {Form, Input, Button, Checkbox, Image, message} from 'antd';
import {useNavigate} from "react-router";
import logo from '../../assets/logo.png'

// 前端写死密码校验
// import {studentAccount, teacherAccount} from "../../assets/account";
import {useState} from "react";
import {get} from "../../services/request";

import {loginUser} from '../../store/features/user/userSlice'
import {useDispatch} from "react-redux";


const Login = function () {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const checkAccount = async function () {
        const res = await get(`/api/class/login/${email}/${password}`)
        return {flag: res.kind, final: res.id}
    }


    const onFinish = async (values) => {
        const {flag, final} = await checkAccount()
        let map = new Map([['student', '学生'], ['teacher', '老师']])
        if (flag !== "error") {

            // 登录成功 在这里请求数据 然后 存储在redux里 里面界面就可以用了 里面退出登录再清空redux
            if(flag === 'teacher') {
                get('/api/teacher/' + final).then(res => {
                    if (res.code != -1) {
                        message.success(`欢迎${map.get(flag)}登录！`)
                        dispatch(loginUser(
                            {
                                info: res,
                                kind: 'teacher',
                                permissions: ['管理个人面板','在线教学权限', '教师信息维护']
                            }
                        ))
                        navigate('/personal')
                    } else {
                        message.error('后端未启动，请重试')
                    }

                })
            } else if(flag === 'student') {
                // 学生
                get('/api/student/' + final).then(res => {
                    if (res.code != -1) {
                        message.success(`欢迎${map.get(flag)}登录！`)
                        dispatch(loginUser(
                            {
                                info: res,
                                kind: 'student',
                                permissions: []
                            }
                        ))
                        navigate('/personal')
                    } else {
                        message.error('后端未启动，请重试')
                    }

                })
            }


        } else {
            message.error('账号或密码错误！')
        }
    };

    const onFinishFailed = (errorInfo) => {
        message.error('账号或密码错误！')
    };

    return (
        <div className="background">
            <div className="form">
                <Image width={136} src={logo}/>
                <div className="text">基于SignalR的智能在线教学系统</div>
                <div style={{width: '350px'}}>
                    <Form
                        name="basic"
                        labelCol={{span: 4}}
                        wrapperCol={{span: 20, offset: 1}}
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            style={{marginBottom: '12px'}}
                            label="账户"
                            name="username"
                            rules={[{required: true, message: '请输入账户名！'}]}
                        >
                            <Input onChange={(e) => {
                                setEmail(e.target.value)
                            }}/>
                        </Form.Item>

                        <Form.Item
                            style={{marginBottom: '12px'}}
                            label="密码"
                            name="password"
                            rules={[{required: true, message: '请输入密码！'}]}
                        >
                            <Input.Password onChange={(e) => {
                                setPassword(e.target.value)
                            }}/>
                        </Form.Item>

                        <Form.Item style={{marginBottom: '12px'}} name="remember" valuePropName="checked"
                                   wrapperCol={{offset: 2, span: 16}}>
                            <Checkbox>自动登录</Checkbox>
                        </Form.Item>

                        <Form.Item wrapperCol={{offset: 10, span: 16}}>
                            <Button type="primary" htmlType="submit">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
        </div>
    )
}

export default Login
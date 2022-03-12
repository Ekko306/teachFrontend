import './index.css'
import React from "react";
import {Outlet, Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {loginUser} from '../../store/features/user/userSlice'
import {useDispatch} from "react-redux";

import {useSelector} from "react-redux";
import {selectUserInfo, userSlice, selectUserKind} from '../../store/features/user/userSlice'

import {Layout, Menu, Avatar, Dropdown} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import AccessControl from "../accessControl/AccessControl";

const {useState, useEffect} = React
const {Header, Sider, Content} = Layout;

const ParentLayout = function () {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userInfo = useSelector(selectUserInfo);
    const userKind = useSelector(selectUserKind)

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }
    }, [])


    const [collapsed, setCollapsed] = useState(false)
    const toggle = () => {
        setCollapsed(!collapsed)
    }

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo"/>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>

                    <AccessControl
                        allowedPermissions={["管理个人面板"]}
                        renderNoAccess={() =>
                            // <Menu.Item key="2" icon={<UserOutlined/>} style={{paddingLeft: !collapsed? '24px' : '32px', display: !collapsed? null: 'flex'}}>
                            //     <Menu.Item key="3"><Link to="/personal/selfInfo">信息维护</Link></Menu.Item
                            // </Menu.Item>
                            <Menu.SubMenu key="sub1" icon={<UserOutlined/>} title="个人面板" >
                            <Menu.Item key="3"><Link to="/personal/selfInfo">信息维护</Link></Menu.Item>
                            <Menu.Item key="4"><Link to="/personal/teachHistory">教学历史</Link></Menu.Item>
                            </Menu.SubMenu>
                        }
                    >
                        <Menu.SubMenu key="sub1" icon={<UserOutlined/>} title="个人面板" >
                            <Menu.Item key="3"><Link to="/personal/selfInfo">信息维护</Link></Menu.Item>
                            <Menu.Item key="4"><Link to="/personal/classInfo">学生维护</Link></Menu.Item>
                            <Menu.Item key="5"><Link to="/personal/teachHistory">教学历史</Link></Menu.Item>
                        </Menu.SubMenu>
                    </AccessControl>

                    <Menu.Item key="2" icon={<VideoCameraOutlined/>}>
                        <Link to="/teach">在线教学</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background-Header" style={{padding: 0}}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: toggle,
                    })}
                    <div className='info'>
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="logout" onClick={() => {
                                    dispatch(loginUser())
                                    navigate('/login')
                                }}>
                                    退出登录
                                </Menu.Item></Menu>
                        }>
                            <div className="info2" onClick={() => {
                                navigate('/showInfo/' + userKind + '/' + userInfo.id)
                            }}>
                                <Avatar src={userInfo?.avatar}/>
                                <div style={{marginLeft: '4px'}}>{userInfo?.name}</div>
                            </div>
                        </Dropdown>

                    </div>
                </Header>
                <Content
                    className="site-layout-background-Content"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 842,
                    }}
                >
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    )
}

export default ParentLayout
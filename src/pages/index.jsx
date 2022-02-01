import {
    BrowserRouter,
    Routes,
    Route, Navigate
} from "react-router-dom";
import Login from "./login";

import ParentLayout from "../components/parentLayout";
import SelfInfo from "./personal/selfInfo";
import ClassInfo from "./personal/classInfo";
import TeachHistory from "./personal/teachHistory";
import HistoryDetail from "./personal/teachHistory/hisotryDetail";

import Teach from "./teach";

import ShowInfo from "./showInfo";

import NotFound from "./notFound";

const App = function () {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}/>} />
                {/*登录*/}
                <Route path="/login" element={<Login/>}/>
                <Route element={<ParentLayout/>}>
                    {/*个人面板*/}
                    <Route path="/personal">
                        <Route path="selfInfo" element={<SelfInfo/>}/>
                        <Route path="classInfo" element={<ClassInfo/>}/>
                        <Route path="teachHistory" >
                            <Route path=":recordId" element={<HistoryDetail/>} />
                            <Route index element={<TeachHistory/>} />
                        </Route>
                        <Route index element={<Navigate to="selfInfo" replace/>}/> {/*默认路由转为selfInfo*/}
                        <Route path="*" element={<Navigate to="selfInfo" replace/>}/> {/*其他乱写的路由转为selfInfo*/}
                    </Route>

                    {/*在线教学*/}
                    <Route path="/teach" element={<Teach/>}/>

                    {/*学生和老师信息查看 因为数据库两种 所以要传递kind两种 这样就变成通用路由了 但是底下信息还要根据前端kind更改*/}
                    <Route path="/showInfo/:kind/:id" element={<ShowInfo/>}/>
                </Route>

                {/*404*/}
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
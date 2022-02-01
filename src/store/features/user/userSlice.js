import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        loginUser: (state, action) => {
            if(action.payload === undefined) {   // 不带参数是登出logout
                return null
            }
            return action.payload
        }
    }
})

export const { loginUser } = userSlice.actions;


// user数据结构
// {
//     info: '... 数据库的内容',
//     kind: 'teacher/student',
//     permissions: [... 一些权限东西]
// }

export const selectUser = state => state.user;
export const selectUserInfo = state => state.user.info;
export const selectUserKind = state => state.user.kind;
export const selectUserPermissions = state => state.user.permissions;

export default userSlice.reducer
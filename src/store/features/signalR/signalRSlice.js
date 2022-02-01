import { createSlice } from '@reduxjs/toolkit'

export const signalRSlice = createSlice({
    name: 'signalR',
    initialState: null,
    reducers: {
        saveSignalR: (state, action) => {
            if(action.payload === undefined) {   // 不带参数是登出logout
                return null
            }
            return action.payload
        }
    }
})

// signalR数据结构
// {
//     connection: 'connection',
//     groupName: 'groupName'
// }

export const { saveSignalR } = signalRSlice.actions;

export const selectSignalR = state => state.signalR;
export const selectSignalRConnection = state => state.signalR?.connection;
export const selectSignalRGroupName = state => state.signalR?.groupName;


export default signalRSlice.reducer
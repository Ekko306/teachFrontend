import { createSlice } from '@reduxjs/toolkit'

// 当前左下角绘图的信息 images是要上传保存的信息 两个不一样！！！！！
export const drawingSlice = createSlice({
    name: 'drawing',
    initialState: null,
    reducers: {
        saveDrawing: (state, action) => {
            if(action.payload === undefined) {   // 不带参数是登出logout
                return null
            }
            return action.payload
        }
    }
})

// drawing数据结构
// 'data:12lk3nlknklsanklansd'

export const { saveDrawing } = drawingSlice.actions;

export const selectDrawing = state => state.drawing;

export default drawingSlice.reducer
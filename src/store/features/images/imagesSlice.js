import { createSlice } from '@reduxjs/toolkit'

export const imagesSlice = createSlice({
    name: 'images',
    initialState: [],
    reducers: {
        saveImage: (state, action) => {
            if(action.payload === undefined) {   // 不带参数是登出logout
                return []
            }
            let copy
            if(state.images) {
                copy = state.images.slice()
            } else {
                copy = []
            }
            copy.push(action.payload)

            console.log(copy, '11111111111111111111111')
            return {
                ...state,
                images: copy
            }
        }
    }
})

// images数据结构
// ['123123', '1231231', '123123']

export const { saveImage } = imagesSlice.actions;

export const selectImages = state => state.images;


export default imagesSlice.reducer
import { createSlice } from '@reduxjs/toolkit'



const initialState = []

export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorites: (state, {payload: user}) => {
            const isExists = state.some(u => u.id === user.id)

            if(isExists){
                const index = state.findIndex(item => item.id === user.id)
                if(index !== -1){
                    state.splice(index, 1)
                }
            } else state.push(user)
        },
        setData: (state, {payload: user}) => {
            const isExists = state.some(u => u.id === user.id)
            isExists ? null : state.push(user)
        },
    }
})


export const {actions, reducer} = favoritesSlice
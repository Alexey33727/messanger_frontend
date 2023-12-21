import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { reducer as favoritesReducer } from './favorites/favorites.slice'
// import { userSlice } from './user/user.slice'
// import { api } from './api/api'
// import { createLogger } from 'redux-logger'

// const logger = createLogger({
//     collapsed: true,
// })

const reducers = combineReducers({
    favorites: favoritesReducer,
})

export const store = configureStore({
    reducer: reducers,

})

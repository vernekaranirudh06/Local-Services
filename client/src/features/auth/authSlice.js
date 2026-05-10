    import { createSlice } from '@reduxjs/toolkit'

    // Load from localStorage so user stays logged in on refresh
    const userFromStorage  = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null

    const initialState = {
    user:  userFromStorage,
    token: localStorage.getItem('token') || null,
    }

    const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
        const { token, ...user } = action.payload
        state.user  = user
        state.token = token
        localStorage.setItem('user',  JSON.stringify(user))
        localStorage.setItem('token', token)
        },
        logout: (state) => {
        state.user  = null
        state.token = null
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        },
    },
    })

    export const { setCredentials, logout } = authSlice.actions

    // Selectors
    export const selectCurrentUser  = (state) => state.auth.user
    export const selectCurrentToken = (state) => state.auth.token
    export const selectIsLoggedIn   = (state) => !!state.auth.token

    export default authSlice.reducer
import initialState from './initialState'
import * as types from '../constants/actionTypes'


export default function authReducer(state = initialState.auth, action) {
    switch(action.type) {
        case types.SIGN_UP_SUCCESS:
            return {
                ...state,
                status: null
            };
        case types.LOG_IN_SUCCESS:
            return {
                ...state,
                loggedIn: !!sessionStorage.getItem('loginToken')
            };
        case types.LOG_IN_ERROR:
            return {
                ...state,
                loggedIn: !!sessionStorage.getItem('loginToken'),
                status: 'error',
                errorMassage: action.payload
            };
        case types.LOG_OUT:
            return {
                ...state,
                loggedIn: !!sessionStorage.getItem('loginToken'),
                status: null
            };
        default:
            return state;
    }
}
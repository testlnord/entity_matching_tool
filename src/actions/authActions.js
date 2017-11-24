import * as types from '../constants/actionTypes'
import authApi from '../api/authApi'
import { browserHistory } from 'react-router'

export function registerUser(credentials) {
    return function(dispatch) {
        return authApi.signup(credentials)
            .then(response => {
                dispatch({ type: types.SIGN_UP_SUCCESS });
                browserHistory.push('/signin');
            })
            .catch(error => {
                console.log(error);
            });
    }
}

export function logInSuccess() {
    return { type: types.LOG_IN_SUCCESS }
}

export function logInError(errorMassage) {
    return {
        type: types.LOG_IN_ERROR,
        payload: errorMassage
    }
}

export function logInUser(credentials) {
    return function(dispatch) {
        if (credentials.password === '')
            dispatch(logInError('You forgot to enter the password'));
        else return authApi.signin(credentials)
                .then(response => {
                    sessionStorage.setItem('loginToken', response.data.token);
                    dispatch(logInSuccess());
                    browserHistory.push('/');
                })
                .catch(error => {
                    dispatch(logInError('Invalid login or password'));
                });
    };
}

export function logOutUser() {
    return function(dispatch) {
        sessionStorage.clear();
        dispatch({ type: types.LOG_OUT });
        browserHistory.push('/signin');
    }
}
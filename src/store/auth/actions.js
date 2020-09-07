export const AUTH_USER = 'AUTH_USER'; 

export const setLoginState = (loginState) => ({
    type: AUTH_USER,
    payload: loginState
});
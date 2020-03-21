import { AsyncStorage } from "react-native";

import moment from "moment";

export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const IS_LOGGED_IN = "IS_LOGGED_IN";
export const AUTHENTICATE = "AUTHENTICATE";

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

const signup_url =
  "http://192.168.1.107:7010/api/register?XDEBUG_SESSION_START=10362";
const login_url =
  "http://192.168.1.107:7010/api/login?XDEBUG_SESSION_START=10362";

export const signup = (name, email, password) => {
  return async dispatch => {
    const response = await fetch(signup_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        c_password: password
      })
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message);
    }
    console.log(resData.expires_at);
    // dispatch({ type: SIGNUP, token: resData.access_token,userId:resData.user_id });
    const expirationDate = resData.expires_at;
    const expirationTime = moment(expirationDate).diff(moment());
    console.log("exp time signup", expirationTime);
    dispatch(
      authenticate(resData.user_id, resData.access_token, expirationTime)
    );

    saveDataToStorage(resData.access_token, resData.user_id, expirationDate);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(login_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        email: email,
        password: password,
        remember_me: true
      })
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message);
    }
    console.log(resData);
    const expirationDate = resData.expires_at;

    const expirationTime = moment(expirationDate).diff(moment());
    console.log("exp time login", expirationTime);
    dispatch(
      authenticate(resData.user_id, resData.access_token, expirationTime)
    );

    saveDataToStorage(resData.access_token, resData.user_id, expirationDate);
  };
};

export const isLoggedIn = props => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const user_id = getState().auth.userId;
    console.log("token: ", token);
    if (!token) {
      props.navigation.navigate("Auth");
    }
    dispatch({ type: IS_LOGGED_IN, token: token, userId: user_id });
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    if (expirationTime < 1000 * 60 * 60)
      timer = setTimeout(() => {
        dispatch(logout());
      }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  console.log(expirationDate);
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expirationDate: expirationDate
    })
  );
};

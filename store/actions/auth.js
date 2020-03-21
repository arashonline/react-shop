export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const IS_LOGGED_IN = "IS_LOGGED_IN";

const signup_url = "http://192.168.1.107:7010/api/register?XDEBUG_SESSION_START=10362";
const login_url = "http://192.168.1.107:7010/api/login?XDEBUG_SESSION_START=10362";

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
    console.log(resData.access_token);
    dispatch({ type: SIGNUP, token: resData.access_token,userId:resData.user_id });
  };
};

export const login = ( email, password) => {
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
    dispatch({ type: LOGIN , token: resData.access_token,userId:resData.user_id });
  };
};

export const isLoggedIn = (props) => {
  return async (dispatch,getState) => {
    const token = getState().auth.token;
    const user_id = getState().auth.userId;
    console.log('token: ', token);
    if(!token){
      props.navigation.navigate('Auth');
    }
    dispatch({ type: IS_LOGGED_IN , token: token,userId:user_id });
  };
};

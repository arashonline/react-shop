export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";

const signup_url = "http://192.168.1.107:7009/api/auth/signup?XDEBUG_SESSION_START=12235";
const login_url = "http://192.168.1.107:7009/api/auth/login?XDEBUG_SESSION_START=12235";

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
        password_confirmation: password
      })
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();
    console.log(resData);
    dispatch({ type: SIGNUP });
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

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();
    console.log(resData);
    dispatch({ type: LOGIN });
  };
};

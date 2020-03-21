import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

// const createOrderUrl = "http://192.168.1.107:7010/api/order/add?XDEBUG_SESSION_START=15072";
const createOrderUrl =
  "http://192.168.1.107:7010/api/order/add?XDEBUG_SESSION_START=15072";
const getOrdersUrl =
  "http://192.168.1.107:7010/api/orders?XDEBUG_SESSION_START=15072";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const user_id = getState().auth.userId;
      const response = await fetch(getOrdersUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Authorization: "Bearer" + " " + token
        },
        body: JSON.stringify({
          user_id
        })
      });

      if (!response.ok) {
        console.log(response.json());
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedOrders = [];

      console.log("resData", resData);
      for (const key in resData) {
        loadedOrders.push(
          new Order(
            resData[key].id,
            resData[key].order_items,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }

      console.log("loadedOrders", loadedOrders);

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      // send to analytic server
      throw new Error(err);
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const user_id = getState().auth.userId;

    const transformedCartItems = [];
    for (const key in cartItems) {
      transformedCartItems.push({
        product_id: cartItems[key].productId,
        product_title: cartItems[key].productTitle,
        product_price: cartItems[key].productPrice,
        quantity: cartItems[key].quantity,
        sum: cartItems[key].sum
      });
    }

    console.log("cartItems: ", cartItems);
    console.log("transformedCartItems: ", transformedCartItems);

    const date = new Date();
    const response = await fetch(createOrderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Bearer" + " " + token
      },
      body: JSON.stringify({
        cartItems:transformedCartItems,
        total_amount: totalAmount,
        date: date.toISOString()
      })
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message);
    }
    console.log('here');
    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.id,
        items: cartItems,
        amount: totalAmount,
        date: date
      }
    });
  };
};

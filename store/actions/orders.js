import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

// const createOrderUrl = "http://192.168.1.107:7009/api/order/add?XDEBUG_SESSION_START=14982";
const createOrderUrl = "http://192.168.1.107:7009/api/order/add";
const getOrdersUrl = "http://192.168.1.107:7009/api/orders?XDEBUG_SESSION_START=14982";

export const fetchOrders = () => {
  return async dispatch => {
    try {
      const response = await fetch(getOrdersUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: 1
        })
      });

      if (!response.ok) {
          console.log(response.json())
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedOrders = [];
    
      console.log('resData',resData);
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

      console.log('loadedOrders',loadedOrders);

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      // send to analytic server
      throw new Error(err);
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async dispatch => {
    const date = new Date();
    const response = await fetch(createOrderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cartItems,
        totalAmount,
        date: date.toISOString()
      })
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    const resData = await response.json();
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

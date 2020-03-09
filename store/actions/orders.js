export const ADD_ORDER = 'ADD_ORDER';

// const createOrderUrl = "http://192.168.1.107:7009/api/order/add?XDEBUG_SESSION_START=13069";
const createOrderUrl = "http://192.168.1.107:7009/api/order/add";

export const addOrder = (cartItems, totalAmount) => {
    return async  dispatch => {
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
            throw new Error('Something went wrong');
        }

        const resData = await response.json();
        dispatch(
            {
                type: ADD_ORDER,
                orderData: {
                    id: resData.id,
                    items: cartItems,
                    amount: totalAmount,
                    date: date
                }
            }
        )
    }
}
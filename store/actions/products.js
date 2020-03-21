import Product from "../../models/product";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

const createProductUrl =
  "http://192.168.1.107:7010//api/product/add?XDEBUG_SESSION_START=17021";
const editProductUrl =
  "http://192.168.1.107:7010//api/product/edit?XDEBUG_SESSION_START=17021";
const deleteProductUrl = "http://192.168.1.107:7010//api/product/delete";
const getProductsUrl = "http://192.168.1.107:7010//api/products";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const user_id = getState().auth.userId;
    try {
      const response = await fetch(getProductsUrl);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            resData[key].id,
            resData[key].user_id,
            resData[key].title,
            resData[key].image_url,
            resData[key].description,
            resData[key].price
          )
        );
      }

      // console.log(loadedProducts);

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(
          prod => prod.ownerId === user_id
        )
      });
    } catch (err) {
      // send to analytic server
      throw new Error(err);
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(deleteProductUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Bearer" + " " + token
      },
      body: JSON.stringify({
        id: productId
      })
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message);
    }
    console.log(`product with id ${productId} deleted:${resData}`);
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const user_id = getState().auth.userId;
    // any async code you want!
    const response = await fetch(createProductUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Bearer" + " " + token
      },
      body: JSON.stringify({
        title,
        description,
        image_url: imageUrl,
        price,
        user_id
      })
    });

    console.log(createProductUrl);
    const resData = await response.json();
    if (!response.ok) {
      console.log(resData);
      throw new Error(resData.message);
    }

    console.log(resData);

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.id,
        title,
        description,
        imageUrl,
        price,
        ownerId: user_id
      }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const user_id = getState().auth.userId;
    const response = await fetch(editProductUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: "Bearer" + " " + token
      },
      body: JSON.stringify({
        id,
        title,
        description,
        image_url: imageUrl,
        user_id
      })
    });
    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message);
    }
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
        ownerId: user_id
      }
    });
  };
};

import Product from '../../models/product';
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

const createProductUrl = "http://192.168.1.107:7009//api/product/add";
const getProductsUrl = "http://192.168.1.107:7009//api/products";

export const fetchProducts = () => {
  return async dispatch => {
    // any async code you want!
    const response = await fetch(getProductsUrl);

    const resData = await response.json();
    const loadedProducts = [];

    for(const key in resData){
      loadedProducts.push( new Product(
        resData[key].id,
        resData[key].user_id,
        resData[key].title,
        resData[key].imageUrl,
        resData[key].description,
        resData[key].price
      ))
    }

    console.log(loadedProducts)

    dispatch({ type: SET_PRODUCTS, products: loadedProducts });
  };
};

export const deleteProduct = productId => {
  return { type: DELETE_PRODUCT, pid: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async dispatch => {
    // any async code you want!
    const response = await fetch(createProductUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price
      })
    });

    const resData = await response.json();
    console.log(resData);

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.id,
        title,
        description,
        imageUrl,
        price
      }
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return {
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title,
      description,
      imageUrl
    }
  };
};

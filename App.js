import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// combineReducers so that we can create one root reducer
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import productReducer from './store/reducers/products';

const rootReducer = combineReducers({
  products: productReducer
});

const store = createStore(rootReducer);

export default function App() {
  return (
   <Provider store={store}>
   </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

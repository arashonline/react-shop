import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {Platform} from 'react-native'

import productOverviewScreen from '../screens/shop/ProductOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import Colors from '../constants/Colors';

const ProductsNavigator = createStackNavigator({
    ProductsOverview: productOverviewScreen,
    ProductDetail : ProductDetailScreen,
    Cart : CartScreen,
},{
    defaultNavigationOptions: {
        headerStyle:{
            backgroundColor: Platform.OS==='android'? Colors.primary:''
        },
        headerTitleStyle:{
            fontFamily:'open-sans-bold'
        },
        headerBackTitleStyle:{
            fontFamily:'open-sans'
        },
        headerTintColor:Platform.OS==='android'? 'white':Colors.primary
    }
});

export default createAppContainer(ProductsNavigator);
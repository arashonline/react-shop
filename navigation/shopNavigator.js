import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {Platform} from 'react-native'

import productOverviewScreen from '../screens/shop/ProductOverviewScreen'
import Colors from '../constants/Colors';

const ProductsNavigator = createStackNavigator({
    ProductsOverview: productOverviewScreen
},{
    defaultNavigationOptions: {
        headerStyle:{
            backgroundColor: Platform.OS==='android'? Colors.primary:''
        },
        headerTintColor:Platform.OS==='android'? 'white':Colors.primary
    }
});

export default createAppContainer(ProductsNavigator);
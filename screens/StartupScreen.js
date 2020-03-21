import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as authAction from '../store/actions/auth';

import moment from "moment";

const StartupScreen = props => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const tryLogin = async ()=>{
            const userData = await AsyncStorage.getItem('userData');
            if(!userData){
                props.navigation.navigate('Auth');
                return;
            }
            const transformedData = JSON.parse(userData);
            const {token, userId, expirationDate} = transformedData;
            const expiryDate = moment(expirationDate).format('MMMM Do YYYY, hh:mm');
            const now = moment().format('MMMM Do YYYY, hh:mm');
            console.log('expiryDate: ', expiryDate)
            console.log('now: ', moment().format('MMMM Do YYYY, hh:mm'));

            const expirationTime = moment(expirationDate).diff(moment());

            if(expirationTime <= 0 || !token || !userId){
                props.navigation.navigate('Auth');
                return;
            }
            
            // console.log('expiration date',expirationTime);
            
            props.navigation.navigate('Shop');
            dispatch(authAction.authenticate(userId,token,expirationTime))
        };

        tryLogin();
    },[dispatch])

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default StartupScreen;

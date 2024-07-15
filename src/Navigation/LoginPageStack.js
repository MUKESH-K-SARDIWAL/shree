import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from '../Authentication/WelcomePage';
import LogIn from '../Authentication/logIn';
import OtpAuth from '../Authentication/otp-auth';
import Profile from '../Authentication/profile';
import EnterpriseScreen from '../gold-page/EnterpriseScreen';

const Stack = createNativeStackNavigator();

const LoginPageStack = () => {

    return (
      <>
        
        <Stack.Screen name="LogIn" component={LogIn} />
        
      </>
    );
  
}

export default LoginPageStack
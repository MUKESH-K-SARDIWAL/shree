import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiUrl } from '../Constants/api-route';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postData } from '../Service/api-Service';
import { JAMAColors } from '../Constants/JAMAColors';
import { NavigationContext } from '@react-navigation/native';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const formData = new FormData();
  const [userToken, setUserToken] = useState(null);
  const [userLogInData, setUserLogInData] = useState(null);
  const [userLogoutData, setUserLogoutData] = useState('LogIn');
  const [ifError, setIfError] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const Login = async data => {
    formData.append('email', data?.email);
    formData.append('otp', data?.otp);
    postData(apiUrl.otpAuth, formData)
      .then(response => {
        // console.log(response?.data?.token)

        try {
          AsyncStorage.setItem('token', response?.data?.token);
          // setUserToken(response?.data?.token);
          Snackbar.show({
            text: `${response?.data?.message}`,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: JAMAColors.light_sky,
          });
          setUserLogInData(response);
        }
        catch (err) {

        }
      })
      .catch(error => {
        // console.log(error);
        setIfError(error.response)
      });
  };

  const Logout = async () => {
    postData(apiUrl.userLogout)
      .then(response => {
        try {
          AsyncStorage.clear();
          setUserToken(null);
          setUserLogoutData('Logout');
          Snackbar.show({
            text: `${response.data.message}`,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: JAMAColors.light_sky,
          });
        }
        catch (err) {

        }

      })
      .catch(error => {
        // console.log(error);
      });
  };

  const isLoggedIn = async () => {

    try {
      await AsyncStorage.getItem('token').then(Token => {
        setUserToken(Token);
        setIsLoading(false);
      })

    } catch (e) {
      // console.log(e);
    }
  };

  useEffect(() => {
    isLoggedIn();
    // console.log('userToken', userToken )
  }, []);

  return (
    <AuthContext.Provider
      value={{
        Login,
        userToken,
        Logout,
        userLogInData,
        setUserLogInData,
        userLogoutData,
        setUserLogoutData,
        ifError,
        isLoading
      }}>
      {children}
    </AuthContext.Provider>
  );
};

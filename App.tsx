/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,
{ useEffect, useState } from 'react';
import { AuthProvider } from './src/Authentication/AuthContext';
import AppNav from './src/Navigation/AppNav';
import SplashScreen from 'react-native-splash-screen';
import EditContact from './src/Parties-Pages/EditContact';


function App() {


  // useEffect(() => {
  //   _getUserToken()
  // }, []);




  // async function _getUserToken() {
  //   try {
  //     SplashScreen.hide()
  //   }
  //   catch (error) {
  //     // console.log(error)
  //   }
  // }



  return (
    <AuthProvider>
      <AppNav />
      {/* <EditContact /> */}
    </AuthProvider>
  )
}

export default App;

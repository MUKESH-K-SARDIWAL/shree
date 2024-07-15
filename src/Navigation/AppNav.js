import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../Authentication/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from '../Authentication/WelcomePage';
import OtpAuth from '../Authentication/otp-auth';
import Profile from '../Authentication/profile';
import LogIn from '../Authentication/logIn';
import CommonPages from '../CommonPages/CommonPages';
import EditProfile from '../CommonPages/EditProfile';
import AboutUs from '../CommonPages/AboutUs';
import ContactUs from '../CommonPages/ContactUs';
import PrivacyPolicy from '../CommonPages/PrivacyPolicy';
import TermsAndConditions from '../CommonPages/TermsAndConditions';
import FindContact from '../gold-page/FindContact';
import UserTransection from '../gold-page/UserTransection';
import FillTransection from '../gold-page/FillTransection';
import Transectionsaved from '../gold-page/Transectionsaved';
import UserTransectionOldUser from '../gold-page/UserTransectionOldUser';
import EntryDetails from '../gold-page/EntryDetail';
import ViewReport from '../gold-page/ViewReport';
import PartiesEnterpriseScreen from '../Parties-Pages/PartiesEnterprisesScreen';
import PartiesEntryDetails from '../Parties-Pages/PartiesEntryDetail';
import PartiesFindContact from '../Parties-Pages/PartiesFindContact';
import PartiesUserTransection from '../Parties-Pages/PartiesUserTransection';
import PartiesTransectionsaved from '../Parties-Pages/PartiesTransectionSaved';
import PartiesFillTransection from '../Parties-Pages/PartiesFillTransection';
import PartiesUserTransectionOldUser from '../Parties-Pages/PartiesUserTransectionOldUser';
import PartiesViewReport from '../Parties-Pages/PartiesViewReport';
import EnterpriseScreen from '../gold-page/EnterpriseScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { View, LogBox, StatusBar } from 'react-native';
import { JAMAColors } from '../Constants/JAMAColors';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'
import { BackHandler } from 'react-native';
import BulkReminder from '../Parties-Pages/BulkReminder';
import Notification from '../Parties-Pages/Notification';


const AppNav = () => {

  const Stack = createNativeStackNavigator();
  const { userToken, isLoading } = useContext(AuthContext);
  const [route, setRoute] = useState('');
  var tokenData;
  const [fingerprintMatch, setFingerprintMatch] = useState(false);

  useEffect(() => {
    setData();
  }, []);

  async function setData() {
    AsyncStorage.getItem('token').then((token) => {
      
      tokenData = token;
    })

    AsyncStorage.getItem('appLaunched').then(appData => {
      
      if (appData === null) {
        
        AsyncStorage.setItem('appLaunched', 'false');
        setRoute('Welcome');
      }
      else {
        if (!tokenData) {
         
          setRoute('LogIn');
        }
        else {
          
          setRoute('PartiesEnterpriseScreen');
        }
      }

    });
  }


  const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })

  useEffect(() => {
    rnBiometrics.isSensorAvailable()
      .then((resultObject) => {
        const { available, biometryType } = resultObject;
        if (available && biometryType === BiometryTypes.TouchID) {
          // console.log('TouchID is supported');
          authenticateWithBiometrics();
        } else if (available && biometryType === BiometryTypes.FaceID) {
          // console.log('FaceID is supported');
          authenticateWithBiometrics();
        } else if (available && biometryType === BiometryTypes.Biometrics) {
          // console.log('Biometrics is supported');
          authenticateWithBiometrics();
        } else {
          // console.log('Biometrics not supported');
        }
      });
  }, []);
  const authenticateWithBiometrics = () => {
    rnBiometrics.simplePrompt({ promptMessage: 'Confirm fingerprint' })
      .then((resultObject) => {
        const { success } = resultObject;

        if (success) {
          // console.log('successful biometrics provided');
          setFingerprintMatch(true);
        } else {
          // console.log('user cancelled biometric prompt');
          BackHandler.exitApp();
        }
      })
      .catch(() => {
        // console.log('biometrics failed');
      });
  };


  if (isLoading) {
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: JAMAColors.white,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}>
        <ActivityIndicator size="large" color={JAMAColors.light_sky} />
      </View>
    )
  }
  return (

    fingerprintMatch &&

    <NavigationContainer>
      < StatusBar
        animated={true}
        backgroundColor="#4ad0ed"
        barStyle="dark-content"
      />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={route}>

        <Stack.Screen name="Welcome" component={GetStarted} />
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="PartiesEnterpriseScreen" component={PartiesEnterpriseScreen} />
        <Stack.Screen name="OtpAuth" component={OtpAuth} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="CommonPages" component={CommonPages} />
        <Stack.Screen name="BulkReminder" component={BulkReminder} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="ContactUs" component={ContactUs} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
        <Stack.Screen name="FindContact" component={FindContact} />
        <Stack.Screen name="UserTransection" component={UserTransection} />
        <Stack.Screen name="FillTransection" component={FillTransection} />
        <Stack.Screen name="Transectionsaved" component={Transectionsaved} />
        <Stack.Screen name="UserTransectionOldUser" component={UserTransectionOldUser} />
        <Stack.Screen name="EntryDetails" component={EntryDetails} />
        <Stack.Screen name="ViewReport" component={ViewReport} />
        <Stack.Screen name="EnterpriseScreen" component={EnterpriseScreen} />
        <Stack.Screen name="PartiesEntryDetails" component={PartiesEntryDetails} />
        <Stack.Screen name="PartiesFindContact" component={PartiesFindContact} />
        <Stack.Screen name="PartiesUserTransection" component={PartiesUserTransection} />
        <Stack.Screen name="PartiesTransectionsaved" component={PartiesTransectionsaved} />
        <Stack.Screen name="PartiesFillTransection" component={PartiesFillTransection} />
        <Stack.Screen name="PartiesUserTransectionOldUser" component={PartiesUserTransectionOldUser} />
        <Stack.Screen name="PartiesViewReport" component={PartiesViewReport} />
      </Stack.Navigator>
    </NavigationContainer >

  )
};

export default AppNav;

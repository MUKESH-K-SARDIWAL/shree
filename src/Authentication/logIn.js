import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { useWindowDimensions } from 'react-native';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import { JAMAColors } from '../Constants/JAMAColors';
import HeaderInfo from '../SharedComponent/HeaderInfo';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Button } from 'react-native-paper';
import { postData } from '../Service/api-Service';
import { apiUrl } from '../Constants/api-route';
import Snackbar from 'react-native-snackbar';

const formSchema = yup.object({
  email: yup
    .string()
    .email('Email must be vaild')
    .required('Please enter valid email address')
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Like:-example@gmail.com',
    ),
});

const LogIn = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { height } = useWindowDimensions();

  const [stop, setStop] = useState(false);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const signInForOtp = userEmail => {

    let emailId = userEmail.email.toLowerCase();
    let emaildata = new FormData();
    emaildata.append('email', emailId)
    setStop(true);
    postData(apiUrl.userLogin, emaildata)
      .then(response => {
        console.log('res', JSON.stringify(response?.data, null, 2));
        navigation.navigate('OtpAuth', `${emailId}`);
        setStop(false);
        Snackbar.show({
          text: `${response.data.message}`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: JAMAColors.light_sky,
        });
      })
      .catch(error => {
        // console.log('error', error);
      });
  };

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to exit?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      { text: 'YES', onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      style={[{ width: width, height: height }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            JAMAStyle.OuterView,
            JAMAStyle.flexColumn,
            JAMAStyle.dFlex,
            JAMAStyle.bgWhite,
          ]}>
          <View style={{ height: 48 }}>
            <View
              style={[
                { flex: 1 },
                JAMAStyle.bgSkyBlue,
                JAMAStyle.dFlex,
                JAMAStyle.justifyContentCenter,
              ]}>
              <TouchableOpacity
                style={[
                  JAMAStyle.flexRow,
                  JAMAStyle.alignItemCenter,
                  { justifyContent: 'flex-start' },
                ]}
                onPress={() => backAction()}>
                <Icon
                  name={'angle-left'}
                  size={responsiveFontSize(2.5)}
                  marginHorizontal={13.5}
                  color={JAMAColors.white}
                />
                <Text style={JAMAStyle.headerText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[{ flex: 3 }, JAMAStyle.justifyContentCenter]}>
            <View
              style={[
                JAMAStyle.alignItemCenter,
                JAMAStyle.justifyContentCenter,
              ]}>
              <Text
                style={[
                  JAMAStyle.fontBold,
                  JAMAStyle.colorBlack,
                  { letterSpacing: 1.6, fontSize: responsiveFontSize(2.75) },
                ]}>
                Welcome!
              </Text>
            </View>
            <View
              style={[
                JAMAStyle.alignItemCenter,
                JAMAStyle.justifyContentCenter,
                JAMAStyle.mTop20,
              ]}>
              <Text
                style={[
                  {
                    fontSize: responsiveFontSize(2.1),
                    fontFamily: 'Roboto-Regular',
                    color: '#313131',
                  },
                ]}>
                Login to auto backup your data securely
              </Text>
            </View>
            <View>
              <Formik
                initialValues={{
                  email: '',
                }}
                validationSchema={formSchema}
                onSubmit={values => {
                  signInForOtp(values);
                }}>
                {({
                  handleSubmit,
                  handleBlur,
                  values,
                  touched,
                  errors,
                  setFieldValue,
                  isValid,
                }) => (
                  <>
                    <View
                      style={[
                        JAMAStyle.justifyContentCenter,
                        JAMAStyle.mTop40,
                        JAMAStyle.mLeftAuto,
                        JAMAStyle.mRightAuto,
                        { width: responsiveWidth(90) },
                      ]}>
                      <TextInput
                        style={[
                          JAMAStyle.inputField,
                          { paddingLeft: 15, fontSize: responsiveFontSize(2.1) },
                        ]}
                        placeholder="Email Address"
                        placeholderTextColor={JAMAColors.placeHolder_grey}
                        keyboardType={'email-address'}
                        onBlur={handleBlur('email')}
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={values.email}
                        onChangeText={val => setFieldValue('email', val.trim())}
                      />

                      <Text style={{ color: JAMAColors.danger, paddingTop: 5 }}>
                        {touched.email && errors.email}
                      </Text>
                    </View>
                    {/* use one useState value disable button again */}
                    <Button
                      type="submit"
                      onPress={handleSubmit}
                      disabled={!isValid || stop}
                      style={[
                        {
                          backgroundColor:
                            (values.email == '') == false &&
                              isValid == true &&
                              stop == false
                              ?
                              JAMAColors.light_sky
                              : JAMAColors.light_silver,
                        },
                        // { backgroundColor: JAMAColors.light_sky },

                        JAMAStyle.buttonAuth,
                        JAMAStyle.mTop20,
                        { width: responsiveWidth(90) },
                      ]}>
                      <Text
                        style={[
                          { color: JAMAColors.white },
                          {
                            color:
                              (values.email == '') == false && isValid == true
                                ?
                                JAMAColors.white
                                : JAMAColors.light_gry,
                          },
                          {
                            fontFamily: 'Roboto-Bold',
                            fontSize: responsiveFontSize(2.2),
                          },
                          JAMAStyle.lSpacing,
                        ]}>
                        SEND OTP
                      </Text>
                    </Button>
                    <View
                      style={[
                        { marginTop: 13, width: responsiveWidth(95) },
                        JAMAStyle.mLeftAuto,
                        JAMAStyle.mRightAuto,
                      ]}>
                      <Text
                        style={[
                          {
                            fontSize: responsiveFontSize(1.6),
                            color: JAMAColors.footer_text,
                          },
                          JAMAStyle.p10,
                          JAMAStyle.lSpacing,
                        ]}>
                        By creating an account, you agree to our Terms of
                        Service & Privacy Policy
                      </Text>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
          <View style={{ flex: 0.5 }}></View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LogIn;

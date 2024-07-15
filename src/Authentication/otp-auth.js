import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import { JAMAColors } from '../Constants/JAMAColors';
import HeaderInfo from '../SharedComponent/HeaderInfo';
import { Button } from 'react-native-paper';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { Formik } from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getData, postData } from '../Service/api-Service';
import { apiUrl } from '../Constants/api-route';
import Snackbar from 'react-native-snackbar';
import { AuthContext } from './AuthContext';

const formSchema = yup.object({
  otp: yup.string().required('OTP required'),
});

const OtpAuth = props => {
  const { Login } = useContext(AuthContext);
  const { userLogInData, setUserLogInData, ifError } = useContext(AuthContext);

  function handleBackButtonClick() {
    navigation.navigate('LogIn');
    return true;
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );
    return () => backHandler.remove();
  }, []);

  const [timer, setTimer] = useState(20);
  const { width } = useWindowDimensions();
  const { height } = useWindowDimensions();
  const [invalidOtpMsg, setInvalidOtpMsg] = useState(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false)
  const timeOutCallback = useCallback(
    () => setTimer(currTimer => currTimer - 1),
    [],
  );
  useEffect(() => {
    console.log('userLogInData', JSON.stringify(userLogInData?.data, null, 2));

    if (userLogInData?.data?.first_onboard == 1) {
      let email = props?.route?.params;
      console.log(`email==>`, email);
      navigation.navigate('Profile', { email });
      setUserLogInData(null);
      setInvalidOtpMsg(null)
    }
    if (userLogInData?.data?.first_onboard == 0) {

      navigation.navigate('PartiesEnterpriseScreen');
      setUserLogInData(null);
      setInvalidOtpMsg(null)
    }
    if (ifError?.data?.errors) {
       console.log(ifError)
      setInvalidOtpMsg(ifError?.data?.errors)
    }

  }, [userLogInData, ifError]);

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
  }, [timer]);

  const resendOTPToEmail = () => {
    let userData = new FormData();
    userData.append('email', props?.route?.params);
    // console.log(timer,!timer)
    setTimer(20);
    if (timer == 0) {
      postData(apiUrl.resendOtp, userData)
        .then(response => {
          // console.log('resentOtp', response);
          Snackbar.show({
            text: `${response.data.message}`,
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: JAMAColors.light_sky,
          });
          setTimer(20);
        })
        .catch(error => {
          // console.log('error', error);
          // const msgInvalid = JSON.stringify(error.response);
          const msgInvalid = error.response.data.errors;
          setInvalidOtpMsg(msgInvalid);
        });
    }
  };

  return (
    isLoading == true ? (
      <>
        <View
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}>
          <ActivityIndicator size="large" color={JAMAColors.light_sky} />
        </View>
      </>
    ) : (
      <KeyboardAvoidingView
        behavior={Platform.OS == 'android' ? 'padding' : 'height'}
        style={[{ width: width, height: height }]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[JAMAStyle.OuterView, JAMAStyle.flexColumn]}>
            <View style={{ height: 48 }}>
              <HeaderInfo
                Name={'OTP'}
                PreviousPage={'LogIn'}
                navigation={navigation}
                IconName={'angle-left'}
              />
            </View>
            <View style={[{ flex: 3 }, JAMAStyle.justifyContentCenter]}>
              <View
                style={[
                  JAMAStyle.alignItemCenter,
                  JAMAStyle.justifyContentCenter,
                  JAMAStyle.mTop40,
                ]}>
                <Text
                  style={[
                    JAMAStyle.fSize20,
                    JAMAStyle.fontBold,
                    JAMAStyle.colorBlack,
                    { letterSpacing: 1.6 },
                  ]}>
                  Verify OTP
                </Text>
              </View>
              <View
                style={[
                  JAMAStyle.alignItemCenter,
                  JAMAStyle.justifyContentCenter,
                  JAMAStyle.mTop20,
                  JAMAStyle.flexColumn,
                ]}>
                <Text
                  style={[
                    JAMAStyle.fSize14,
                    JAMAStyle.colorBlack,
                    { letterSpacing: 2 },
                    { fontFamily: 'Roboto-Regular' },
                  ]}>
                  We have sent OTP to your email{' '}
                </Text>
                <View style={[JAMAStyle.alignItemCenter, JAMAStyle.flexRow]}>
                  <Text
                    style={[
                      JAMAStyle.fSize14,
                      JAMAStyle.colorBlack,
                      JAMAStyle.lSpacing,
                      { fontFamily: 'Roboto-Regular' },
                    ]}>
                    {props?.route?.params} |{' '}
                  </Text>
                  <TouchableOpacity onPress={() => (navigation.navigate('LogIn'), setInvalidOtpMsg(null))}>
                    <Text
                      style={[
                        JAMAStyle.fSize14,
                        JAMAStyle.colorLightSky,
                        { fontFamily: 'Roboto-Regular' },
                      ]}>
                      {' '}
                      Change{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Formik
                initialValues={{
                  otp: '',
                }}
                validationSchema={formSchema}
                onSubmit={values => {
                  let { otp } = values;
                  Login({ email: props?.route?.params, otp: otp });
                  values.otp = '';
                  // navigation.navigate('PartiesEnterpriseScreen');
                }}>
                {({
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  values,
                  touched,
                  errors,
                  isValid,
                  setFieldValue,
                }) => (
                  <>
                    <View
                      style={[JAMAStyle.justifyContentCenter, JAMAStyle.mTop20]}>
                      <TextInput
                        style={[
                          JAMAStyle.otpField,
                          JAMAStyle.mLeftAuto,
                          JAMAStyle.mRightAuto,
                          {
                            width: width * 0.5,
                            letterSpacing: 10,
                            fontSize: responsiveFontSize(2.2),
                          },
                        ]}
                        placeholder="* * * *"
                        placeholderTextColor={JAMAColors.black}
                        keyboardType="number-pad"
                        textAlign="center"
                        maxLength={4}
                        value={values.otp}
                        onChangeText={handleChange('otp')}
                      />
                    </View>
                    {errors.otp && (
                      <Text
                        style={{
                          color: '#DC3030',
                          textAlign: 'center',
                          marginTop: 3,
                        }}>
                        {touched.otp && errors.otp}
                      </Text>
                    )}
                    {invalidOtpMsg && (
                      <View style={[JAMAStyle.alignItemCenter, JAMAStyle.mTop10]}>
                        <Text style={[{ color: JAMAColors.danger }]}>
                          {invalidOtpMsg}
                        </Text>
                      </View>
                    )}
                    <View
                      style={[
                        JAMAStyle.alignItemCenter,
                        JAMAStyle.justifyContentCenter,
                        JAMAStyle.mTop20,
                      ]}>
                      <View
                        style={[
                          JAMAStyle.fSize14,
                          JAMAStyle.flexRow,
                          { color: '#3A3A3A', fontFamily: 'Roboto-Regular' },
                        ]}>
                        <TouchableOpacity onPress={resendOTPToEmail}>
                          <Text
                            style={[
                              {
                                color:
                                  timer > 0 ? '#3A3A3A' : JAMAColors.light_sky,
                              },
                              {
                                fontFamily: 'Roboto-Regular',
                                fontSize: responsiveFontSize(2.1),
                              },
                            ]}>
                            Resend OTP
                          </Text>
                        </TouchableOpacity>
                        {timer > 0 && (
                          <View
                            style={[
                              JAMAStyle.fSize14,
                              JAMAStyle.alignItemCenter,
                              JAMAStyle.justifyContentCenter,
                              JAMAStyle.flexRow,
                            ]}>
                            <Text
                              style={[
                                { color: '#3A3A3A' },
                                {
                                  fontFamily: 'Roboto-Regular',
                                  marginHorizontal: 3,
                                  fontSize: responsiveFontSize(2.1),
                                },
                              ]}>
                              in
                            </Text>
                            <Text
                              style={[
                                JAMAStyle.colorBlack,
                                {
                                  fontFamily: 'Roboto-Regular',
                                  marginHorizontal: 1,
                                  fontSize: responsiveFontSize(2.1),
                                },
                              ]}>
                              {timer}
                            </Text>
                            <Text
                              style={[
                                { color: '#3A3A3A' },
                                {
                                  fontFamily: 'Roboto-Regular',
                                  marginHorizontal: 3,
                                  fontSize: responsiveFontSize(2.1),
                                },
                              ]}>
                              secs
                            </Text>
                            <Text
                              style={[
                                { color: '#3A3A3A' },
                                {
                                  fontFamily: 'Roboto-Regular',
                                  marginHorizontal: 1,
                                  fontSize: responsiveFontSize(2.1),
                                },
                              ]}>
                              via email
                            </Text>
                          </View>
                        )}
                        {/* */}
                      </View>
                    </View>
                    <View>
                      <Button
                        type="submit"
                        disabled={values.otp == ''}
                        onPress={handleSubmit}
                        style={[
                          JAMAStyle.buttonAuth,
                          {
                            backgroundColor:
                              (values.otp != '')
                                ?
                                JAMAColors.light_sky
                                : JAMAColors.light_silver,
                          },
                          JAMAStyle.mTop20,
                          { width: width * 0.9 },
                        ]}>
                        <Text
                          style={[
                            {
                              color:
                                (values.otp != '')
                                  ?
                                  JAMAColors.white
                                  : JAMAColors.light_gry,
                            },
                            {
                              fontSize: responsiveFontSize(2.2),
                              fontFamily: 'Roboto-Bold',
                            },
                            JAMAStyle.lSpacing,
                          ]}>
                          SUBMIT
                        </Text>
                      </Button>
                    </View>
                    <View
                      style={[
                        JAMAStyle.justifyContentCenter,
                        JAMAStyle.alignItemCenter,
                        JAMAStyle.mTop20,
                      ]}>
                      <Text
                        style={[
                          JAMAStyle.fSize14,
                          { color: '#3A3A3A', fontFamily: 'Roboto-Regular' },
                        ]}>
                        Use only the{' '}
                        <Text style={[JAMAStyle.colorBlack]}>latest OTP</Text>{' '}
                        sent on <Text style={[JAMAStyle.colorBlack]}>Email</Text>
                      </Text>
                    </View>
                  </>
                )}
              </Formik>
            </View>
            <View style={{ flex: 0.5 }}></View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  );
};

export default OtpAuth;

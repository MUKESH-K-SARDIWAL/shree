import React, {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import {JAMAStyle} from '../Constants/JAMAStyleSheet';
import {JAMAColors} from '../Constants/JAMAColors';
import HeaderInfo from '../SharedComponent/HeaderInfo';
import {Button} from 'react-native-paper';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Formik} from 'formik';

import {useNavigation} from '@react-navigation/native';
import {postData} from '../Service/api-Service';
import {apiUrl} from '../Constants/api-route';

const formSchema = yup.object({
  name: yup.string().required('Please enter your full name'),
  business_name: yup.string().required('Please enter your business name'),
});

const Profile = (props) => {
  // console.log('email=>', props);
  const navigation= useNavigation()
  function handleBackButtonClick() {
     Alert.alert(
       'SHREE',
       'Please enter your detail for login',
       [
         {
           text: 'Exit App',
           onPress: () => {
             BackHandler.exitApp();
           },
           style: 'cancel',
         },
         {
           text: 'Cancel',
           onPress: () => ('Cancel Pressed'),
           style: 'cancel',
         },
         {text: 'Goback', onPress: () => navigation.navigate('LogIn')},
       ],
       {
         cancelable: true,
       },
     );
    return true;
  }
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButtonClick,
        );
        return () => backHandler.remove();
  }, []);
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  
  const AddDetails = profileData => {
    const formData = new FormData();
    formData.append('email', props.route.params.email);
    formData.append('name', profileData.name);
    formData.append('business_name', profileData.business_name);
    // console.log('formData=>', formData);
    postData(apiUrl.editProfile, formData)
      .then(response => {
        navigation.navigate('PartiesEnterpriseScreen');
      })
      .catch(error => {
        // console.log('error', error);
      });
  };
  return (
    <View
      style={[
        JAMAStyle.dFlex,
        JAMAStyle.flexColumn,
        {backgroundColor: JAMAColors.white, height: height, width: width},
      ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        keyboardVerticalOffset={20}
        style={[
          {flex: 1},
          JAMAStyle.dFlex,
          JAMAStyle.flexColumn,
          JAMAStyle.bgWhite,
          {height: height, width: width},
        ]}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={[JAMAStyle.positionRelative]}>
          <View
            style={[
              JAMAStyle.OuterView,
              JAMAStyle.flexColumn,
              JAMAStyle.bgWhite,
            ]}>
            <View style={{height: 48}}>
              <HeaderInfo
                onPress={()=>{handleBackButtonClick()}}
                Name={'Profile'}
                PreviousPage={'Log'}
                navigation={navigation}
                IconName={'angle-left'}
              />
            </View>
            <Formik
              initialValues={{
                name: '',
                business_name: '',
              }}
              validationSchema={formSchema}
              onSubmit={values => {
                // console.log('sub',values)
                AddDetails(values);
              }}>
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                values,
                touched,
                errors,
                isValid,
              }) => (
                <>
                  <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
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
                            {letterSpacing: 1.6},
                          ]}>
                          Add Your Details
                        </Text>
                      </View>
                      <View
                        style={[
                          JAMAStyle.alignItemCenter,
                          JAMAStyle.justifyContentCenter,
                          JAMAStyle.mTop10,
                        ]}>
                        <Text
                          style={[
                            {fontSize: responsiveFontSize(1.8)},
                            JAMAStyle.colorBlack,
                            {letterSpacing: 1.1, fontFamily: 'Roboto-Regular'},
                          ]}>
                          Setting up your Profile
                        </Text>
                      </View>

                      <View
                        style={[
                          JAMAStyle.justifyContentCenter,
                          JAMAStyle.mTop20,
                          JAMAStyle.mLeftAuto,
                          JAMAStyle.mRightAuto,
                          {width: width * 0.92},
                        ]}>
                        <TextInput
                          style={[
                            JAMAStyle.inputField,
                            {borderColor: JAMAColors.placeHolder_grey},
                          ]}
                          placeholder="Your Full Name"
                          placeholderTextColor={JAMAColors.placeHolder_grey}
                          value={values.name}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                        />
                        <Text style={{color: JAMAColors.danger, paddingTop: 2}}>
                          {touched.name && errors.name}
                        </Text>
                        {/* {errors.fullName && (<Text style={{ color: JAMAColors.danger, paddingTop:2}}>{touched.fullName && errors.fullName }</Text>)} */}
                      </View>

                      <View
                        style={[
                          JAMAStyle.justifyContentCenter,
                          JAMAStyle.mTop20,
                          JAMAStyle.mLeftAuto,
                          JAMAStyle.mRightAuto,
                          {width: width * 0.92},
                        ]}>
                        <TextInput
                          style={[
                            JAMAStyle.inputField,
                            {borderColor: JAMAColors.placeHolder_grey},
                          ]}
                          placeholder=" Business Name "
                          placeholderTextColor={JAMAColors.placeHolder_grey}
                          value={values.business_name}
                          onChangeText={handleChange('business_name')}
                          onBlur={handleBlur('business_name')}
                        />
                        <Text style={{color: JAMAColors.danger, paddingTop: 2}}>
                          {touched.business_name && errors.business_name}
                        </Text>
                        {/* {errors.businessName && (<Text style={{ color: JAMAColors.danger, paddingTop:2}}>{touched.businessName && errors.businessName }</Text>)} */}
                      </View>

                      <View
                        style={[
                          {marginTop: 2},
                          {width: width * 0.92},
                          JAMAStyle.mLeftAuto,
                          JAMAStyle.mRightAuto,
                        ]}>
                        <Text
                          style={[
                            JAMAStyle.colorgrey,
                            JAMAStyle.fSize12,
                            {fontFamily: 'Roboto-Regular'},
                          ]}>
                          Business/Organisation name
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        JAMAStyle.dFlex,
                        JAMAStyle.buttonAuth,
                        // {backgroundColor:JAMAColors.light_sky,padding: 1},
                        // {padding: 1, backgroundColor:(values.fullName ==''== false) &&(values.businessName ==''== false) && (isValid == true ) ? JAMAColors.light_sky:JAMAColors.light_silver},
                        {
                          backgroundColor:
                            isValid == true
                              ? JAMAColors.light_sky
                              : JAMAColors.light_silver,
                        },
                        JAMAStyle.justifyContentCenter,
                        JAMAStyle.alignItemCenter,
                        {bottom: '3%'},
                      ]}>
                      <Button
                        type="submit"
                        onPress={handleSubmit}
                        // ()=>{navigation.navigate('PartiesEnterpriseScreen')}
                        disabled={!isValid}
                        style={[
                          {width: width * 0.92},
                          JAMAStyle.justifyContentCenter,
                        ]}>
                        <Text
                          style={[
                            {textAlign: 'center'},
                            // {color:JAMAColors.white},
                            // {color: (values.fullName ==''== false) &&(values.businessName ==''== false) && (isValid == true )  ?JAMAColors.white:JAMAColors.light_gry},
                            {
                              color:
                                isValid == true
                                  ? JAMAColors.white
                                  : JAMAColors.light_gry,
                            },
                            {fontSize: responsiveFontSize(1.83)},
                            JAMAStyle.fontBold,
                            JAMAStyle.lSpacing,
                          ]}>
                          GET STARTED
                          {/* onPress={() => navigation.navigate('EnterpriseScreen')} */}
                        </Text>
                      </Button>
                    </View>
                  </View>
                </>
              )}
            </Formik>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Profile;

import React, { useEffect } from 'react';
import { View,Text,TextInput, BackHandler} from 'react-native';
import {useWindowDimensions} from 'react-native';
import { JAMAColors } from '../Constants/JAMAColors';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import HeaderInfo from '../SharedComponent/HeaderInfo';
import { Button } from 'react-native-paper';
import { Formik } from 'formik';
import { postData } from '../Service/api-Service';
import { apiUrl } from '../Constants/api-route';
import { useNavigation } from '@react-navigation/native';

const EditProfile = (props) => {
    // console.log(props)
    async function handleBackButtonClick() {
      navigation.goBack();
      return true;
    }
    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      return () => backHandler.remove();
    }, []);
    const { params }=props?.route
    const navigation =useNavigation();
    const {width} = useWindowDimensions();
    function updateUserData(updatedData){
      const formData =new FormData()
      formData.append('name',updatedData.name)
      formData.append('business_name',updatedData.businessName)
      formData.append('email',params.email)
      // console.log(formData)
          postData(apiUrl.editProfile,formData)
          .then((resp)=>{
              // console.log('updatedDataresp',resp)
              navigation.navigate('CommonPages')
          }).catch((error)=>{
            // console.log('errorInUpdateData',error)
          })
    }
    return (
        <View style={[JAMAStyle.OuterView,JAMAStyle.flexColumn,JAMAStyle.positionRelative]}>
           <View style={{height:48}}>
            <HeaderInfo Name={'Edit Profile'} PreviousPage={'CommonPages'} navigation={navigation} IconName={'angle-left'}/>
           </View>
           <Formik
                    initialValues={{
                            name:params.name,
                            businessName:params.businessName
                        }}
                // validationSchema={formSchema}
                onSubmit={(values) => {
                    updateUserData(values);
                }}>
                {({ handleSubmit,handleBlur,handleChange, setFieldValue,values}) => (
              <>
                <View style={[{flex:12},{paddingTop:20}]}>
                    <View  style={[{width:width*0.93},JAMAStyle.mLeftAuto,JAMAStyle.mRightAuto]}>
                        <TextInput 
                            style={[JAMAStyle.inputField,JAMAColors.placeHolder_grey,{paddingVertical:5,borderColor:JAMAColors.placeHolder_grey,borderRadius:5,fontFamily:'Roboto-Regular'}]}
                            placeholder='Name'
                            // onChange={handleChange('name')}
                            onBlur={handleBlur('name')}
                            value={values.name}
                            onChangeText={val => setFieldValue('name',val.trim())}
                            placeholderTextColor={JAMAColors.placeHolder_grey}
                        />
                    </View>
                    <View  style={[{width:width*0.93},JAMAStyle.mLeftAuto,JAMAStyle.mRightAuto,{paddingTop:15}]}>
                        <TextInput 
                            style={[JAMAStyle.inputField,JAMAColors.placeHolder_grey,{paddingVertical:5,borderColor:JAMAColors.placeHolder_grey,borderRadius:5,fontFamily:'Roboto-Regular'}]}
                            placeholder='Business Name'
                            // onChange={handleChange('businessName')}
                            onBlur={handleBlur('businessName')}
                            value={values.businessName}
                            onChangeText={val => setFieldValue('businessName',val.trim())}
                            placeholderTextColor={JAMAColors.placeHolder_grey}
                        />
                    </View>
                </View>
                <View
                style={[JAMAStyle.buttonAuth,{backgroundColor:JAMAColors.light_sky},{padding:1}, {width: width * 0.93, bottom: '3%'}]}>
                <Button
                  // onPress={()=>{navigation.navigate('CommonPages')}}
                  type='submit'
                  onPress={handleSubmit}
                >
                  <Text
                    style={[
                      JAMAStyle.colorWhite,
                      JAMAStyle.fSize16,
                      JAMAStyle.fontBold,
                      JAMAStyle.lSpacing,
                    ]}>
                    Update
                  </Text>
                </Button>
                </View>
              </>
          )}
          </Formik>
        </View>
    );
};

export default EditProfile;
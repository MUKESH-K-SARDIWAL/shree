import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, BackHandler, Alert } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { JAMAColors } from '../Constants/JAMAColors';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import FooterNavBar from '../SharedComponent/FooterNavBar';
import MoreComponent from '../SharedComponent/MoreComponent';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import { getData, postData } from '../Service/api-Service';
import { apiUrl } from '../Constants/api-route';
import { useNavigation } from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogOut from './logout';

const CommonPages = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [userData, setUserData] = useState([]);
  const [componentHeading, setComponentHeading] = useState(null)



  useEffect(() => {
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

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    nameContent()
  }, [])

  async function nameContent() {
    await getData(apiUrl.common_Page)
      .then((resp) => {
        // console.log(resp['data']['data'])
        const { data } = resp['data'];
        setComponentHeading(data);
        // resp?.data?.data.forEach((value)=>{
        // })
      }).
      catch((error) => {
        // console.log(error)
      })
  }

  useEffect(
    () => navigation.addListener('focus', () => GetUserInformation()), []
  );

  async function GetUserInformation() {
    await getData(apiUrl.get_profile)
      .then((resp) => {
        // console.log(resp)
        setUserData(resp)
      }).
      catch((error) => {
        // console.log(error)
      })
  }

  const Skeleton = () => {
    return (
      <SkeletonPlaceholder  >
        <View style={{ flexDirection: 'row', width: '95%', justifyContent: 'center', marginBottom: 10, marginLeft: 9 }}>

          <View style={{ width: '20%', height: 60, borderRadius: 5, }}></View>
          <View style={{ width: '70%', height: 60, borderRadius: 5, marginHorizontal: 4 }}></View>
          <View style={{ width: '10%', height: 60, borderRadius: 5, }}></View>

        </View>
      </SkeletonPlaceholder>
    );
  };

  // async function LogoutUser(){

  //    postData(apiUrl.userLogout)
  //         .then((response)=>{
  //           console.log("response",response);
  //           AsyncStorage.clear()
  //           console.log(AsyncStorage)
  //           navigation.navigate('LogIn')
  //           Snackbar.show({
  //             text: `${response.data.message}`,
  //             duration: Snackbar.LENGTH_SHORT,
  //             backgroundColor:JAMAColors.light_sky,
  //           });
  //         }).catch((error)=>{
  //           console.log("error" , error);
  //         })
  // }
  return (
    <View
      style={[
        JAMAStyle.OuterView,
        JAMAStyle.flexColumn,
      ]}>
      <View style={[{ height: 48 }]}>
        <View
          style={[
            { flex: 1 },
            JAMAStyle.bgSkyBlue,
            JAMAStyle.dFlex,
            JAMAStyle.justifyContentCenter,
          ]}>
          <View
            style={[
              JAMAStyle.flexRow,
              JAMAStyle.alignItemCenter,
              { justifyContent: 'flex-start' },
            ]}>
            <Icon
              name={'book'}
              size={responsiveFontSize(2.8)}
              marginHorizontal={12}
              color={JAMAColors.white}
            />
            <Text style={JAMAStyle.headerText}>SHREE</Text>
          </View>
        </View>
      </View>
      {componentHeading != null ? (
        <View
          style={[
            JAMAStyle.flexRow,
            JAMAStyle.justifyContentSpaceAround,
            JAMAStyle.bgWhite,
            { width: width, paddingHorizontal: 25, paddingVertical: 20 },
          ]}>
          <View
            style={[
              JAMAStyle.flexRow,
              JAMAStyle.alignItemCenter,
              { width: '88%' },
            ]}>
            <View
              style={[
                JAMAStyle.justifyContentCenter,
                JAMAStyle.alignItemCenter,
                JAMAStyle.headerNameborderCircle,
                { backgroundColor: JAMAColors.light_sky },
              ]}>
              <Text
                style={[JAMAStyle.userHeaderFirstLatter, JAMAStyle.colorWhite]}>
                {userData?.data?.data?.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text
              style={[
                JAMAStyle.userHeaderkarigarName,
                { fontSize: responsiveFontSize(2) },
                JAMAStyle.colorBlack,
                { marginLeft: 7 },
              ]}>
              {userData?.data?.data?.name}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              JAMAStyle.editButton,
              JAMAStyle.bgWhite,
              JAMAStyle.pH30,
              JAMAStyle.justifyContentCenter,
            ]}
            onPress={() => {
              navigation.navigate('EditProfile', {
                email: userData?.data?.data?.email,
                name: userData?.data?.data?.name,
                businessName: userData?.data?.data?.business_name,
              });
            }}>
            <Text style={[JAMAStyle.colorLightSky, JAMAStyle.fontBold]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SkeletonPlaceholder>
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'center',
              marginTop: 10,
              marginLeft: 20,
            }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 60,
                marginLeft: 10,
              }}></View>
            <View
              style={{
                width: '70%',
                height: 60,
                borderRadius: 5,
                marginHorizontal: 4,
              }}></View>
            <View style={{ width: '15%', height: 60, borderRadius: 5 }}></View>
          </View>
        </SkeletonPlaceholder>
      )}

      <View style={[JAMAStyle.alignItemCenter, { paddingTop: 12 }]}>
        {componentHeading != null ? (
          <FlatList
            data={componentHeading}
            renderItem={({ item }) => <MoreComponent item={item} />}
          />
        ) : (
          <FlatList
            data={[1, 2, 3, 4]}
            renderItem={({ item }) => <Skeleton />}
            keyExtractor={item => item}
          />
        )}

        {componentHeading != null ? (
          <LogOut />
        ) : (
          //   <View style={[{width:width*0.94,margin:5,borderRadius:5},JAMAStyle.bgWhite,JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,{elevation:5,shadowColor: '#000000',shadowOffset: {width: 10, height: 10},shadowOpacity: 0.8,shadowRadius: 5,}]}>
          //   <TouchableOpacity style={[JAMAStyle.flexRow,JAMAStyle.justifyContentSpaceAround,{padding:10}]}
          //    onPress={LogoutUser}>
          //       <View style={[JAMAStyle.flexRow,{width:'96%'},JAMAStyle.alignItemCenter]}>
          //           <View style={[{width:'13%'}]}>
          //               <Icon name='arrow-left' size={17} margin={10} color={JAMAColors.light_sky} />
          //           </View>
          //           <View style={[{width:'87%'}]}>
          //               <Text style={[{fontSize:responsiveFontSize(2.2),color:JAMAColors.black,fontFamily:'Roboto-Bold',}]}>Logout</Text>
          //           </View>
          //       </View>
          //     </TouchableOpacity>
          // </View>
          <Skeleton />
        )}
      </View>
      <View
        style={[
          { height: 70 },
          { bottom: 0 },
          { position: 'absolute' }
        ]}>
        <FooterNavBar buttonType={'More'} />
      </View>
    </View>
  );
};

export default CommonPages;
import { BackHandler, Dimensions, Text, View, TouchableOpacity, Image, PermissionsAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { JAMAColors } from '../Constants/JAMAColors'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { getData } from '../Service/api-Service';
import { apiUrl } from '../Constants/api-route';
import RBSheet from 'react-native-raw-bottom-sheet';
let nextColor = null;

const PartiesUserTransection = ({ route }) => {

  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [isLoading, setIsLoading] = useState(false);
  const refRBSheet = useRef([]);

  useEffect(() => {
    Data()
    async function Data() {
      if (await AsyncStorage.getItem('userData')) {
        await AsyncStorage.removeItem('userData')
      }
    }
  }, []);



  function handleBackButtonClick() {
    navigation.navigate('PartiesEnterpriseScreen')
    return true;
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );
    return () => backHandler.remove();
  }, []);

  const checkUserHistoryType = async (item) => {
    console.log("item => ", item)
    setIsLoading(true);
    await getData(
      apiUrl.transaction_dashboard + '?' + `user_name=${item?.name}&transaction_mode=gold&transaction_type=all&filter_type=ASC_date&report_duration=all`)
      .then(resp => {
        // console.log("resp",resp)
        if (resp?.data?.data.length == 0) {
          // setIsLoading(false);
          navigation.navigate('UserTransection', {
            name: item.name,
            phone: item.phone,
          })
        }
        else {
          resp?.data?.data.find((val, ind) => {
            if (val.transaction_user_name == item.name) {
              // setIsLoading(false);
              navigation.navigate('UserTransectionOldUser', {
                name: item.name,
                phone: item.phone,
              });
            }
            else {
              // setIsLoading(false);
              navigation.navigate('UserTransection', {
                name: item.name,
                phone: item.phone,
              });
            }

          });
        }

      })
      .catch(err => {
        Snackbar.show({
          text: `Something wents wrong please try again`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: JAMAColors.light_sky,
        });
        navigation.navigate('PartiesEnterpriseScreen')
        console.log('err', err);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }




  const checkUserHistoryType2 = async (item, type) => {
    refRBSheet.current.close()
    navigation.push(type == 'gold' ? 'FillTransection' : 'PartiesFillTransection', {
      color: nextColor, name: route.params.name,
      phone: route.params.phone
    })
    // navigation.navigate(type == 'gold' ? 'UserTransection' : 'PartiesUserTransection', {
    //     name: item.value,
    //     phone: item.phone,
    // })

  }
  if (isLoading) {
    return <View
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
  }

  return (
    <View style={[{ flex: 1 }]}>
      <View style={[{ backgroundColor: JAMAColors.light_sky }]}>
        <View style={[{ height: 55 }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, { width: '90%', marginHorizontal: 15 }]}>
          <TouchableOpacity style={[JAMAStyle.dFlex, JAMAStyle.flexRow, { flex: 1, backgroundColor: JAMAColors.light_sky }, JAMAStyle.alignItemCenter, { flex: 1 }]} onPress={() => { navigation.navigate('PartiesEnterpriseScreen') }}>
            <View style={[JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'flex-end', marginRight: 10 }]}
            >
              <Icon name="angle-left" size={20} color={JAMAColors.white} />
            </View>
            <View style={[{ width: width * .11 }]}>
              <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.headerNameborderCircle, { backgroundColor: JAMAColors.white }]}>
                <Text style={[JAMAStyle.userHeaderFirstLatter, { color: JAMAColors.light_sky }]}>{route?.params?.name?.charAt(0).toUpperCase()}</Text>
              </View>
            </View>
            <View style={[{ width: width * .5 }]}>
              <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.justifyContentCenter, { marginTop: 3 }]}>
                {route?.params?.name?.length > 35 ?
                  (<Text style={[JAMAStyle.userHeaderkarigarName, JAMAStyle.colorWhite]}>{route?.params?.name.substring(0, 34) + "..."}
                  </Text>) :
                  (<Text style={[JAMAStyle.userHeaderkarigarName, JAMAStyle.colorWhite]}>{route?.params?.name}
                  </Text>)
                }
                <Text style={[JAMAStyle.userHeaderkarigarTiming, JAMAStyle.colorWhite]}>{route?.params?.phone}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={{ backgroundColor: JAMAColors.white, borderRadius: 5, width: 40, height: 32, alignItems: 'center', justifyContent: 'center' }} onPress={updateUserContact} >
            <Icon name="edit" size={20} color={JAMAColors.light_sky} />
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={[{ flex: 8 }, JAMAStyle.positionRelative]}>
        <View style={[JAMAStyle.justifyContentCenter, JAMAStyle.positionAbsolute, { bottom: 0 }, JAMAStyle.alignItemCenter, { backgroundColor: '#EEEEEE', height: 88, width: '100%' }]}>
          <Text style={[{ color: '#313131', lineHeight: 15 }]}>Start adding transactions with Karigar</Text>
          <Text style={[{
            transform: [
              { rotateY: '0deg' },
              { rotateZ: '90deg' }],
            marginTop: 6, marginRight: 3
          }]}>
            <Icon name="arrow-right" size={20} color={JAMAColors.light_sky} />
          </Text>

        </View>
      </View>
      <View style={[{ flex: .8, backgroundColor: JAMAColors.white, paddingTop: 15 }]}>
        <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceAround, JAMAStyle.flexRow]}>
          <TouchableOpacity style={[{ width: width * .432 }, { backgroundColor: JAMAColors.danger }, { borderRadius: 5 }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow]}
            onPress={() => {
              nextColor = '#DE0000';
              refRBSheet.current.open();
              // AsyncStorage.removeItem('userData')
              // navigation.navigate('PartiesFillTransection', {
              //   color: JAMAColors.danger, name: route.params.name,
              //   phone: route.params.phone, lastPage: 'PartiesUserTransection'
              // })
            }}
          >
            <Text style={[{ padding: 11, color: JAMAColors.white, fontSize: 16, fontFamily: 'Roboto-Bold' }]}>YOU GAVE</Text>
            {/* <Text
              style={{ padding: 11, color: JAMAColors.white, fontSize: 16, fontFamily: 'Roboto-Bold' }}
            >₹</Text> */}

          </TouchableOpacity>
          <TouchableOpacity style={[{ width: width * .432 }, { backgroundColor: JAMAColors.green }, { borderRadius: 5 }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow]}
            onPress={() => {
              // AsyncStorage.removeItem('userData')
              nextColor = '#047602';
              refRBSheet.current.open();
              // navigation.navigate('PartiesFillTransection', {
              //   color: JAMAColors.green, name: route.params.name,
              //   phone: route.params.phone, lastPage: 'PartiesUserTransection'
              // })
            }}
          >
            <Text style={[{ padding: 11, color: JAMAColors.white, fontSize: 16, fontFamily: 'Roboto-Bold' }]}>YOU GOT</Text>
            {/* <Text style={{ padding: 11, color: JAMAColors.white, fontSize: 16, fontFamily: 'Roboto-Bold' }}
            >₹</Text> */}
          </TouchableOpacity>
        </View>

      </View>
      <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        height={100}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000000',
            // padding: 15,
          },
          container: {
            // top: -height * .35,
            borderRadius: 10,
            alignItems: 'center',
            // overflow: 'hidden'
            justifyContent: 'center'
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}
        customModalProps={{
          animationType: 'slide',
          statusBarTranslucent: false,
        }}
        customAvoidingViewProps={{
          enabled: true,
        }}>
        <View style={{ flexDirection: 'row', paddingVertical: 20, paddingHorizontal: 15, width: width, justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={{ height: 40, backgroundColor: JAMAColors.light_sky, borderRadius: 6, paddingHorizontal: 14, marginEnd: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => { checkUserHistoryType2('', 'gold') }}>
            <Text style={{ color: JAMAColors.white, fontSize: 16, textAlign: 'center', fontFamily: 'Roboto-Medium' }}>Add Gold</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 40, backgroundColor: JAMAColors.light_sky, borderRadius: 6, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, marginLeft: 5 }} onPress={() => { checkUserHistoryType2('', 'parties') }}>
            <Text style={{ color: JAMAColors.white, fontSize: 16, textAlign: 'center', fontFamily: 'Roboto-Medium' }}>Add Rupee</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </View>
  )
}

export default PartiesUserTransection

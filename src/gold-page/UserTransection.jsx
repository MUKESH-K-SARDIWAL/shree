import { BackHandler, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { JAMAColors } from '../Constants/JAMAColors'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import Icon from 'react-native-vector-icons/FontAwesome5';
import TransectionButton from '../SharedComponent/TransectionButton';
import UserNameHeader from '../SharedComponent/UserNameHeader';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import { getData } from '../Service/api-Service';
import { apiUrl } from '../Constants/api-route';
import Snackbar from 'react-native-snackbar';
import { ActivityIndicator } from 'react-native-paper';

const UserTransection = ({ route }) => {
  // console.log('UserTransection',route)
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // console.log("UserTransection Line No.20 ==> ",navigation.getState())
    Data()
    async function Data() {
      if (await AsyncStorage.getItem('userData')) {
        await AsyncStorage.removeItem('userData')
      }
    }
  }, [])

  function handleBackButtonClick() {
    // navigation.navigate('EnterpriseScreen')
    // console.log("UserTransection Line No.31 ==> ",navigation.getState())
    navigation.navigate('PartiesEnterpriseScreen');
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
    // console.log("item => ", item)
    setIsLoading(true);
    await getData(
      apiUrl.transaction_dashboard + '?' + `user_name=${item?.name}&transaction_mode=parties&transaction_type=all&filter_type=ASC_date&report_duration=all`)
      .then(resp => {
        // console.log("resp",resp)
        if (resp?.data?.data.length == 0) {
          // setIsLoading(false);
          navigation.navigate('PartiesUserTransection', {
            name: item.name,
            phone: item.phone,
          })
        }
        else {
          resp?.data?.data.find((val, ind) => {
            if (val.transaction_user_name == item.name) {
              // setIsLoading(false);
              navigation.navigate('PartiesUserTransectionOldUser', {
                name: item.name,
                phone: item.phone,
              });
            }
            else {
              // setIsLoading(false);
              navigation.navigate('PartiesUserTransection', {
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
        // console.log('err', err);
      })
      .finally(() => {
        setIsLoading(false)
      })
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
          <TouchableOpacity onPress={() => {
            // navigation.navigate('PartiesUserTransectionOldUser', {
            //   name: route?.params?.name,
            //   phone: route?.params?.phone,
            // });
            checkUserHistoryType(route?.params)
          }} style={{ backgroundColor: JAMAColors.white, borderRadius: 5, padding: 4, width: 100, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: JAMAColors.light_sky, fontSize: 12, fontFamily: 'Roboto-Bold', textAlign: 'center' }}>
              IN RUPEE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[{ flex: 8 }, JAMAStyle.positionRelative]}>
        <View style={[{ justifyContent: 'center' }, JAMAStyle.positionAbsolute, { bottom: 0 }, { alignItems: 'center', backgroundColor: '#EEEEEE', height: 88, width: '100%' }]}>
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

              AsyncStorage.removeItem('userData'),
                navigation.navigate('FillTransection', {
                  color: JAMAColors.danger, name: route.params.name,
                  phone: route.params.phone, lastPage: route?.key
                })
            }}
          >
            <Text style={[{ padding: 11, color: JAMAColors.white, fontSize: 16, fontFamily: 'Roboto-Bold' }]}>YOU GAVE</Text>
            <Image
              style={{ justifyContent: 'center', alignSelf: 'center', tintColor: JAMAColors.white, width: 22, height: 22 }}
              source={require('../Jamaassets/goldimg.png')}
            />

          </TouchableOpacity>
          <TouchableOpacity style={[{ width: width * .432 }, { backgroundColor: JAMAColors.green }, { borderRadius: 5 }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow]}
            onPress={() => {

              AsyncStorage.removeItem('userData')
              navigation.navigate('FillTransection', {
                color: JAMAColors.green, name: route.params.name,
                phone: route.params.phone, lastPage: route?.key
              })
            }}
          >
            <Text style={[{ padding: 11, color: JAMAColors.white, fontSize: 16, fontFamily: 'Roboto-Bold' }]}>YOU GOT</Text>
            <Image
              style={{ justifyContent: 'center', alignSelf: 'center', tintColor: JAMAColors.white, width: 22, height: 22 }}
              source={require('../Jamaassets/goldimg.png')}
            />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )
}

export default UserTransection

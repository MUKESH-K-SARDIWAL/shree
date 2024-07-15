import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { JAMAColors } from '../Constants/JAMAColors'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserNameHeader = ({ userData }) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const navigation = useNavigation();

  return (
    <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, { flex: 1, backgroundColor: JAMAColors.light_sky }, JAMAStyle.alignItemCenter]}>
      <TouchableOpacity style={[{ width: width * .09, marginLeft: 5 }, JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'flex-end' }]}
        onPress={() => { navigation.navigate('PartiesEnterpriseScreen') }}>
        <Icon name="angle-left" size={20} color={JAMAColors.white} />
      </TouchableOpacity>
      <View style={[{ width: width * .11 }]}>
        <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.headerNameborderCircle, { backgroundColor: JAMAColors.white }]}>
          {/* <Text style={[JAMAStyle.userHeaderFirstLatter,{ color:JAMAColors.light_sky}]}>{name?.slice(0,1).toUpperCase()}</Text> */}
          <Text style={[JAMAStyle.userHeaderFirstLatter, { color: JAMAColors.light_sky }]}>{userData?.name?.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
      <View style={[{ width: width * .7 }]}>
        <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.justifyContentCenter, { marginTop: 3 }]}>
        {userData?.name?.length > 35 ? 
        (<Text style={[JAMAStyle.userHeaderkarigarName, JAMAStyle.colorWhite]}>{userData?.name.substring(0,34)+"..."}
          </Text>)
          :
          (
          <Text style={[JAMAStyle.userHeaderkarigarName, JAMAStyle.colorWhite]}>{userData?.name}
          </Text>
        )}
          <Text style={[JAMAStyle.userHeaderkarigarTiming, JAMAStyle.colorWhite]}>{userData?.phone}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default UserNameHeader
import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import { JAMAColors } from '../Constants/JAMAColors'
import Icon from 'react-native-vector-icons/FontAwesome5';

const GoldTransectionHeader = ({navigation,Name,IconName,TextColor}) => {
  // console.log('weiwewe',navigation,Name,IconName,TextColor)
  return (
        <View style={[{height:55}]}>
            <View
           
            style={[JAMAStyle.dFlex,JAMAStyle.flexRow,JAMAStyle.alignItemCenter,{backgroundColor:JAMAColors.white,padding:15.5,}]}
           
            >
            
            <TouchableOpacity style={[JAMAStyle.flexRow,{marginLeft:3}]} 
             onPress={()=>{navigation.goBack()}}
            >
            <Icon name={'angle-left'} size={18} color={`${route.params.color}`} />
            </TouchableOpacity>
            <Text style={[JAMAStyle.userheaderText,{color:`${route.params.color}`,paddingLeft:17}]}>{`You ${storedData == null ? (route.params.color == JAMAColors.danger ? 'gave' : 'got') : (storedData?.amount_received == 0 ? 'gave' : 'got')} ${storedData == null ? (moneyValue == '' ? '0gm' : `${moneyValue}gm`) : (storedData?.amount_received == 0 ? storedData?.amount_sent : storedData?.amount_received) + 'gm'} to ${previousUser == '' ? route.params.name : (previousUser)}`}</Text>
            </View>
        </View>
  )
}

export default GoldTransectionHeader
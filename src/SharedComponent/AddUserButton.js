import { View, Text ,TouchableOpacity,} from 'react-native'
import React from 'react'
import { JAMAColors } from '../Constants/JAMAColors';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
const AddUserButton = ({UserType,Location,navigation}) => {
  return (
        <TouchableOpacity 
                style={[JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,JAMAStyle.flexRow,JAMAStyle.positionAbsolute,JAMAStyle.addButton]}
                onPress={()=>navigation.navigate(`${Location}`)}
                >
                            <Icon name='user-plus' size={responsiveFontSize(2.2)} color={JAMAColors.white} paddingRight={7}/>
                            <Text style={[JAMAStyle.addKarigar]}>{UserType}</Text>
        </TouchableOpacity>
  )
}

export default AddUserButton
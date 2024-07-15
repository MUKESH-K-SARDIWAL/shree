import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions} from 'react-native';
import { JAMAColors } from '../Constants/JAMAColors';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";

const HeaderInfo = ({Name,PreviousPage,IconName,navigation}) => {
    
    return (
        <View style={[{flex:1},JAMAStyle.bgSkyBlue,JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,]}>
            <TouchableOpacity 
             onPress={()=>{navigation.navigate(PreviousPage)}}
            style={[JAMAStyle.flexRow,JAMAStyle.alignItemCenter,{justifyContent:'flex-start'}]} >
                {IconName !='' ? 
                (<Icon name={IconName} size={responsiveFontSize(2.5)}  marginHorizontal={13.5} color={JAMAColors.white} />)
                :(<></>)
                }
                <Text style={JAMAStyle.headerText}>{Name}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HeaderInfo;

import React, { useEffect } from 'react';
import { View, Text, Image, useWindowDimensions, BackHandler, Alert} from 'react-native';
import { Button } from 'react-native-paper' ;
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
  } from "react-native-responsive-dimensions";
import { JAMAColors } from '../Constants/JAMAColors';
const GetStarted= ({navigation}) =>{
    const {width} = useWindowDimensions();
  
        return(
            <View style={[JAMAStyle.OuterView,JAMAStyle.flexColumn,JAMAStyle.dFlex,JAMAStyle.bgWhite]}>
                <View style={[{height:48,},JAMAStyle.bgSkyBlue]}>
                <View style={[{flex:1},{width:responsiveWidth(90)},JAMAStyle.mLeftAuto,JAMAStyle.mRightAuto,JAMAStyle.dFlex,JAMAStyle.alignItemCenter,JAMAStyle.flexRow]}>
                    <View style={[JAMAStyle.flexRow,JAMAStyle.alignItemCenter,{justifyContent:'flex-start'}]} >
                        <Text style={JAMAStyle.headerText}>SHREE</Text>
                    </View>
                </View>
                </View>
                <View style={{flex:12}}>
                    <View style={[JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,]}>
                        <Image style={{resizeMode: 'contain',width:responsiveWidth(90)}}source={require('../Jamaassets/welcome.png')}/>
                    </View>
                    <View style={[JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,JAMAStyle.mTop20,]}>
                        <Text style={[{fontSize:responsiveFontSize(2.5)},JAMAStyle.fontBold,JAMAStyle.colorBlack,{letterSpacing:1}]}>Manange Your Business With Staff</Text>
                    </View>
                    <View style={[JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,JAMAStyle.mTop10]}>
                        <Text style={[JAMAStyle.fSize14,JAMAStyle.colorgrey,{fontFamily:'Roboto-Regular'}]}>Stay updated on your profits</Text>
                    </View>
                    <View style={[JAMAStyle.buttonAuth,{backgroundColor:JAMAColors.light_sky},JAMAStyle.mTop20,{width:width*0.7}]} >
                        <Button onPress={()=>navigation.navigate('LogIn')}> 
                            <Text style={[JAMAStyle.colorWhite,JAMAStyle.fSize16,JAMAStyle.fontBold,JAMAStyle.lSpacing]}> GET STARTED </Text>
                        </Button>                        
                    </View>
                </View>
            </View>
        )
    }

export default GetStarted;

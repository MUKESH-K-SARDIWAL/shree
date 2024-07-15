import {  Text, View,TouchableOpacity, Dimensions,Image } from 'react-native'
import React from 'react'
import { JAMAColors } from '../Constants/JAMAColors';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useWindowDimensions} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
const FooterNavBar = ({buttonType}) => {
    const navigation =useNavigation();
    const width = Dimensions.get('window').width;
  return (
    <View style={[{height:70},JAMAStyle.positionAbsolute,{bottom:0},JAMAStyle.flexRow,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter]}>
            <TouchableOpacity
              onPress={()=>navigation.navigate('PartiesEnterpriseScreen')}
            style={[JAMAStyle.dFlex,JAMAStyle.flexColumn,{alignSelf:'stretch'},JAMAStyle.bgWhite,JAMAStyle.justifyContentCenter,buttonType=='Parties'? {borderTopColor:JAMAColors.light_sky,borderTopWidth:2}:{borderTopWidth:0},{width:responsiveWidth(50)}]}>
                                  
                                    <Image
                                            style={{marginTop:-10,alignSelf:'center',tintColor:buttonType=='Parties'?JAMAColors.light_sky:JAMAColors.footer_text,width:22,height:22}}
                                            source={require('../Jamaassets/fi_users.png')}
                                        />


                                    <Text style={[JAMAStyle.footerText,buttonType=='Parties'?(JAMAStyle.textLightSky):(JAMAStyle.textFooterText),{alignSelf:'center'}]}>
                                    Parties
                                    </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            onPress={()=>navigation.navigate('EnterpriseScreen')}
            style={[JAMAStyle.dFlex,JAMAStyle.flexColumn,{alignSelf:'stretch'},JAMAStyle.justifyContentCenter,JAMAStyle.bgWhite,
                            buttonType=='Gold'?
                            {borderTopColor:JAMAColors.light_sky,borderTopWidth:2}:{borderTopWidth:0},{width:responsiveWidth(33)},]}>
                                  
                                    <Image
                                            style={{marginTop:-10,alignSelf:'center',tintColor:buttonType=='Gold'?JAMAColors.light_sky:JAMAColors.footer_text,width:25,height:25}}
                                            source={require('../Jamaassets/goldimg.png')}
                                        />
                                    <Text style={[JAMAStyle.footerText,buttonType=='Gold'?(JAMAStyle.textLightSky):(JAMAStyle.textFooterText),{alignSelf:'center'}]}>
                                    Gold
                                    </Text>
            </TouchableOpacity> */}
            <TouchableOpacity
            onPress={()=>navigation.navigate('CommonPages')}
            style={[JAMAStyle.dFlex,JAMAStyle.flexColumn,JAMAStyle.alignItemCenter,JAMAStyle.justifyContentCenter,JAMAStyle.bgWhite,{alignSelf:'stretch'},
                            buttonType=='More'?
                            {borderTopColor:JAMAColors.light_sky,borderTopWidth:2}:{borderTopWidth:0},{width:responsiveWidth(50)}]} >
                                  <Icon 
                                        name="bars" size={responsiveFontSize(2.2)}  style={{alignSelf:'center'}} marginTop={-10} color={buttonType=='More'?(JAMAColors.light_sky):(JAMAColors.footer_text)}
                                    />
                                    <Text style={[JAMAStyle.footerText,buttonType=='More'?(JAMAStyle.textLightSky):(JAMAStyle.textFooterText),{alignSelf:'center'}]}>
                                    More
                                    </Text>
            </TouchableOpacity>
    </View>
  )
}

export default FooterNavBar
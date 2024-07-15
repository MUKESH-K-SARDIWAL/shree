import React, {useContext, useEffect} from 'react';
import { View, Text, StyleSheet , TouchableOpacity, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import { JAMAColors } from '../Constants/JAMAColors';
import { postData } from '../Service/api-Service';
import { useNavigation } from '@react-navigation/native';
import {useWindowDimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveHeight,responsiveWidth,responsiveFontSize } from "react-native-responsive-dimensions";
import { apiUrl } from '../Constants/api-route';
import Snackbar from 'react-native-snackbar';
import { AuthContext } from '../Authentication/AuthContext'; 

const LogOut = () => {
  const navigation =useNavigation();
  const {width} = useWindowDimensions();

    const { Logout, userLogoutData, setUserLogoutData } =useContext(AuthContext)
    useEffect(()=>{
        if (userLogoutData =='Logout'){
            navigation.navigate('LogIn')
            setUserLogoutData('LogIn')
        }
    }, [userLogoutData])
    return (
            <View style={[{width:width*0.94,margin:5,borderRadius:5},JAMAStyle.bgWhite,JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,{elevation:5,shadowColor: '#000000',shadowOffset: {width: 10, height: 10},shadowOpacity: 0.8,shadowRadius: 5,}]}>
            <TouchableOpacity style={[JAMAStyle.flexRow,JAMAStyle.justifyContentSpaceAround,{padding:10}]}
             onPress={()=>Logout()}
             >             
                <View style={[JAMAStyle.flexRow,{width:'96%'},JAMAStyle.alignItemCenter]}>
                    <View style={[{width:'13%'}]}>
                        <Icon name='arrow-left' size={17} margin={10} color={JAMAColors.light_sky} />
                    </View>
                    <View style={[{width:'87%'}]}>
                        <Text style={[{fontSize:responsiveFontSize(2.2),color:JAMAColors.black,fontFamily:'Roboto-Bold',}]}>Logout</Text>
                    </View>                   
                </View>
              </TouchableOpacity>
          </View>
    );
};

export default LogOut;

import React,{useState,useEffect} from 'react';
import { View, Text, TouchableOpacity, BackHandler} from 'react-native';
import {useWindowDimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { JAMAColors } from '../Constants/JAMAColors';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import HeaderInfo from '../SharedComponent/HeaderInfo';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import {useNavigation} from '@react-navigation/native';

const ContactUs = (props) => {
    // console.log(props.route.params);
    async function handleBackButtonClick() {
      navigation.goBack();
      return true;
    }
    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
      return () => backHandler.remove();
    }, []);
    const navigation = useNavigation();
    const [contactData,setContactData]=useState([]);
    
    const {width} = useWindowDimensions();
    useEffect(()=>{
        setContactData(JSON.parse(props.route.params));
    },[])
    // console.log(contactData);
    return (
        <View style={[JAMAStyle.OuterView,JAMAStyle.flexColumn,]}>
            <View style={{height:48}}>
                <HeaderInfo Name={'Contact Us'} PreviousPage={'CommonPages'} IconName={'angle-left'} navigation={navigation}/>
            </View>
            <View style={[{width:responsiveWidth(93)},JAMAStyle.dFlex,JAMAStyle.flexColumn,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter]}>
                <View style={[JAMAStyle.flexRow,JAMAStyle.mTop20,{width:'93%'},JAMAStyle.alignItemCenter,]}>
                    <View style={[JAMAStyle.dFlex,{width:width*0.15}]}>
                        <View style={[{backgroundColor:JAMAColors.light_sky,},{width:45,height:45,borderRadius:22.5,borderColor:'#dee1e6',},JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,{ transform: [{rotateY: '180deg'},{rotateZ: '0deg'} ],}]}>
                         <Icon name="phone" size={20} color={JAMAColors.white} />
                        </View>                        
                    </View>
                    <View style={[JAMAStyle.dFlex,JAMAStyle.flexColumn,JAMAStyle.justifyContentCenter,{width:width*0.8}]}>
                        <View>
                            <Text style={[JAMAStyle.contact]}>Phone No</Text>
                        </View>
                        <View>
                            <Text style={[JAMAStyle.phoneNumber,]}>{contactData.contact_no}</Text>
                        </View>
                    </View>
                </View>
                <View  style={[JAMAStyle.flexRow,JAMAStyle.mTop20,{width:'93%'},JAMAStyle.alignItemCenter,]}>
                    <View  style={[JAMAStyle.dFlex,{width:width*0.15}]}>
                        <View style={[{backgroundColor:JAMAColors.light_sky,},{width:45,height:45,borderRadius:22.5,borderColor:'#dee1e6',},JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,]}>
                            <Icon name="envelope" size={20} color={JAMAColors.white} />
                        </View>   
                    </View>
                    <View style={[JAMAStyle.dFlex,JAMAStyle.flexColumn,JAMAStyle.justifyContentCenter,{width:width*0.8}]}>
                        <View>
                            <Text style={[JAMAStyle.contact]}>Email Address</Text>
                        </View>
                        <View>
                            <Text style={[JAMAStyle.phoneNumber]}>{contactData.email}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )

}

export default ContactUs;

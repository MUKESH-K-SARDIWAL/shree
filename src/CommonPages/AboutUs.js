import React, { useEffect,useState } from 'react';
import { View,ScrollView, Text, BackHandler} from 'react-native';
import {useWindowDimensions} from 'react-native';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import HeaderInfo from '../SharedComponent/HeaderInfo';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';


const AboutUs = (props) =>{
// console.log(props); 
    // const [information,setInformation] = useState();
    const {width} = useWindowDimensions();
    const navigation = useNavigation();
    // setInformation(props);
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
    const source = {
        html:
        `${props.route.params}`
    }
   
        // getData(apiUrl?.common_Page+''+'aboutus')
        // .then((res)=>{
        //     console.log(res)
        // })
        // .catch((error)=>{
        //     console.log(error)
        // })
    return (
        <View style={[JAMAStyle.OuterView,JAMAStyle.flexColumn,]}>
            <View style={[{height:48}]}>
                <HeaderInfo Name={'About Us'} PreviousPage={'CommonPages'} IconName={'angle-left'} navigation={navigation}/>
            </View>
            
                <ScrollView style={[{width:responsiveWidth(93)},JAMAStyle.mLeftAuto,JAMAStyle.mRightAuto,JAMAStyle.mTop20]}>
                    <RenderHTML
                        contentWidth={width}
                        source={source}
                    />
                </ScrollView>
        </View>
    )

}

export default AboutUs;

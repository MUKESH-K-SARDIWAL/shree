import React, { useEffect } from 'react';
import { View, Text, ScrollView, BackHandler,} from 'react-native';
import {useWindowDimensions} from 'react-native';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import HeaderInfo from '../SharedComponent/HeaderInfo';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import RenderHTML from 'react-native-render-html';
import {useNavigation} from '@react-navigation/native';

const TermsAndConditions = (props) => {
const navigation = useNavigation();
  const source ={
    html:`${props.route.params}`
}
  
    const {width} = useWindowDimensions()
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
    return (
        <View style={[JAMAStyle.OuterView,JAMAStyle.flexColumn,]}>
            <View style={[{height:55}]}>
                <HeaderInfo Name={'Terms & Conditions'} PreviousPage={'CommonPages'} IconName={'angle-left'} navigation={navigation}/>
            </View>
                <View style={[{width:responsiveWidth(93)},JAMAStyle.mLeftAuto,JAMAStyle.mRightAuto,JAMAStyle.mTop20]}>
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    >
                    <RenderHTML
                        contentWidth={width}
                        source={source}
                    />
                    </ScrollView>
                </View>
        </View>
    )

}

export default TermsAndConditions;

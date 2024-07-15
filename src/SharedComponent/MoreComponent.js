import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import { JAMAColors } from '../Constants/JAMAColors';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { responsiveHeight,responsiveWidth,responsiveFontSize } from "react-native-responsive-dimensions";
import {useNavigation} from '@react-navigation/native';

const MoreComponent = ({item}) => {
    const navigation = useNavigation();
    // console.log(item)
    function dataLoad(){
        navigation.navigate(item.display_name=='About Us' ? 'AboutUs':item.display_name=='Contact Us' ? 'ContactUs':item.display_name=='Privacy Policy' ? 'PrivacyPolicy' :item.display_name=='Terms & Conditions' ? 'TermsAndConditions' :'',`${item['content_selected']}`)
    }
    return (
        <View style={[{flex:1,margin:5,borderRadius:5},JAMAStyle.bgWhite,JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,{elevation:5,shadowColor: '#000000',shadowOffset: {width: 10, height: 10},shadowOpacity: 0.8,shadowRadius: 5,}]}>
            <TouchableOpacity style={[JAMAStyle.flexRow,JAMAStyle.justifyContentSpaceAround,{padding:10}]} 
                onPress={dataLoad}
            // onPress={() =>{ navigation.navigate(`${Page}`)}}
        >
                <View style={[JAMAStyle.flexRow,{width:'88%'},JAMAStyle.alignItemCenter]}>
                    <View style={[{width:'13%'}]}>
                        <Icon name={item.display_name=='About Us' ? 'info':item.display_name=='Contact Us' ? 'envelope':item.display_name=='Privacy Policy' ? 'clipboard-list' :item.display_name=='Terms & Conditions' ? 'clipboard-list' :'' } size={17} margin={10} color={JAMAColors.light_sky} />
                    </View>
                    <View style={[{width:'87%'}]}>
                        <Text style={[{fontSize:responsiveFontSize(2.2),color:JAMAColors.black,fontFamily:'Roboto-Bold',}]}>{item.display_name}</Text>
                    </View>                   
                </View>
                <View>
                    <Icon name={'angle-right'} size={20} margin={10} color={JAMAColors.black} />
                </View>                
            </TouchableOpacity>
        </View>
    );
};
export default MoreComponent;
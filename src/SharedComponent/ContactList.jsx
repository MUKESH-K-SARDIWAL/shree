  import React from 'react'
  import { View,Text,TouchableOpacity,Image,PermissionsAndroid,Dimensions} from 'react-native';
  import { JAMAStyle } from '../Constants/JAMAStyleSheet';
  import { JAMAColors } from '../Constants/JAMAColors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ContactList = ({displayName,phoneNumbers,typeOfUse}) => {
    const navigation=useNavigation();
    const width = Dimensions.get('window').width;

  return (
    
    <TouchableOpacity 

     onPress={(event)=>{
      typeOfUse=='Parties' ? (navigation.navigate('PartiesUserTransection')) : (navigation.navigate('UserTransection',))}}
      
    style={[JAMAStyle.dFlex,JAMAStyle.flexRow,{backgroundColor:JAMAColors.white,padding:15}]} key={displayName}>
                    <View style={[{width:width*.13}]}>
                        <View style={[JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,JAMAStyle.findContactborderCircle,{backgroundColor:JAMAColors.light_sky}]}>
                            <Text style={[JAMAStyle.cardFirstLatter,{ color:JAMAColors.white}]}>{displayName.slice(0,1).toUpperCase()}</Text>
                        </View>
                    </View>
                    <View style={[{width:width*.8}]}>
                        <View style={[JAMAStyle.dFlex,JAMAStyle.flexColumn,JAMAStyle.justifyContentCenter,{marginTop:3}]}>
                                <Text  style={[JAMAStyle.karigarName]}>{displayName}
                                </Text>
                                <Text  style={[JAMAStyle.karigarTiming]}>{phoneNumbers}
                                </Text>
                        </View>
                    </View>
    </TouchableOpacity>
  )
}

export default ContactList
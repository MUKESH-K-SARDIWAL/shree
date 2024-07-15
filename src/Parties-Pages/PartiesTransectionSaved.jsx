import { View, Text,TouchableOpacity } from 'react-native'
import React,{useEffect} from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import { JAMAColors } from '../Constants/JAMAColors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const PartiesTransectionsaved = ({route}) => {
  const navigation = useNavigation()
  useEffect(()=>{
    setTimeout(() => {
      console.log("PartiesTransectionSaved LineNo.12 => ", route?.params)
      navigation.navigate('PartiesUserTransectionOldUser',{name:route?.params?.name,phone:route?.params?.phone})
    }, 1000);
  },[])
  return (
    <TouchableOpacity style={[JAMAStyle.dFlex,JAMAStyle.flexColumn,JAMAStyle.alignItemCenter,JAMAStyle.justifyContentCenter,{flex:1,backgroundColor:JAMAColors.white},]}>
        <View style={[JAMAStyle.savedCircle,JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter]}>
             <Icon  name='check' size={30}  color={JAMAColors.light_silver} /> 
        </View>
        <Text style={[JAMAStyle.transectionSaved]}>Transaction saved</Text>
    </TouchableOpacity>
  )
}

export default PartiesTransectionsaved
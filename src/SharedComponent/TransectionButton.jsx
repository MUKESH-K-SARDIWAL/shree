import { View, Text,Dimensions,TouchableOpacity ,Image} from 'react-native'
import React from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { JAMAColors } from '../Constants/JAMAColors';
const TransectionButton = ({color,ButtonType,navigation,typeOfUse,user}) => {
  // console.log(`TransectionButton==>`,user,color);
  const width = Dimensions.get('window').width;
  return (
    <TouchableOpacity style={[{width:width*.432},{backgroundColor:color},{borderRadius:5},JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,JAMAStyle.flexRow]}
     onPress={()=>{typeOfUse=='Gold' ? navigation.navigate('FillTransection', {color:color,name:user.name,
      phone:user.phone}, ): navigation.navigate('PartiesFillTransection', {color:color,
      name:user.name,
      phone:user.phone
    } )}}
    >
      <Text style={[{padding:11,color:JAMAColors.white,fontSize:16,fontFamily:'Roboto-Bold'}]}>{ButtonType}</Text>
      {typeOfUse=='Gold'?(
        //  <Icon name="box" size={12} color={JAMAColors.white} />
      <Image
      style={{justifyContent:'center',alignSelf:'center',tintColor:JAMAColors.white,width:22,height:22}}
      source={require('../Jamaassets/goldimg.png')}
      />
      ):(<Text></Text>)}
     
    </TouchableOpacity>
  )
}

export default TransectionButton
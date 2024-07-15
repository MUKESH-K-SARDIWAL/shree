import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import { JAMAColors } from '../Constants/JAMAColors'
import { Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native'
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";

const EnteriesCard = ({item}) => {
  // console.log('params',item)
    const navigation =useNavigation();
    const date =new Date (item.created_at)
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
  return (
    <TouchableOpacity 
    
    onPress={()=>{item?.transaction_mode=="parties" ? (navigation.navigate(`PartiesEntryDetails` ,{name:item?.transaction_user_name})):(navigation.navigate(`EntryDetails`,{name:item?.transaction_user_name}))}}
    style={[JAMAStyle.dFlex,JAMAStyle.flexRow,JAMAStyle.justifyContentCenter,{marginTop:1,marginBottom:5}]}>
                <View style={[{width:responsiveWidth(45)},{backgroundColor:JAMAColors.white,},JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,JAMAStyle.flexColumn,{padding:9},JAMAStyle.borderLeftRadius]}>
                     <Text style={[JAMAStyle.cardDateText]}>{item.transaction_date+', '+date.toLocaleTimeString()}</Text>
                     {item?.transaction_mode=='gold'?(
                     <View style={[{backgroundColor:JAMAColors.light_silver,
                                     borderRadius:5,paddingHorizontal:15,paddingVertical:3,marginTop:6},JAMAStyle.dFlex,JAMAStyle.flexRow,JAMAStyle.alignItemCenter,JAMAStyle.justifyContentSpaceAround]}>
                               
                        <Text style={[JAMAStyle.CardgoldValueText]}>Gold
                                    </Text>
                        <Icon name='box' size={responsiveFontSize(1.4)} color={JAMAColors.light_gry} marginHorizontal={5}  /> 
                        <Text style={[JAMAStyle.CardgoldValueText]}>{item['amount_received'] != null ? item['amount_received'] :item['amount_sent'] }gm
                        </Text>
                     </View>):(
                      <View style={[{backgroundColor:JAMAColors.light_silver,
                        borderRadius:5,paddingHorizontal:15},JAMAStyle.dFlex,JAMAStyle.flexRow,JAMAStyle.alignItemCenter,JAMAStyle.justifyContentSpaceAround]}>
                  
                  <Text style={[JAMAStyle.CardgoldValueText]}>Bal.
                              </Text>
                   
                  <Text style={[JAMAStyle.CardgoldValueText]}>₹ 2500
                  </Text>
                </View>
                     )}
                                        

                </View>
                {item?.transaction_mode=='gold'?(
                  <View style={[{width:responsiveWidth(45)},{backgroundColor:JAMAColors.white,},JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,JAMAStyle.flexRow,JAMAStyle.borderRightRadius]}>
                  <View style={[{width:'50%',height:'100%'},JAMAStyle.dFlex,JAMAStyle.alignItemCenter,{justifyContent:'flex-start'},JAMAStyle.flexRow,{backgroundColor:'rgba(222, 0, 0, 0.24)'},{paddingVertical:20,paddingHorizontal:16}]}>
                    {item['amount_sent'] != null ? (
                      <>
                              <Image
                                  style={[{width:responsiveWidth(4.6),height:responsiveWidth(4.6)}]}
                                  source={require('../Jamaassets/gold-ingots.png')}
                              />
                              <Text style={[JAMAStyle.goldAmountText,{color:JAMAColors.danger},{fontSize:responsiveFontSize(1.7)},{textAlign:'center'},]}>{item['amount_sent']}gm</Text>
                      </>
                    ):(<></>)}     
                  </View>

                  <View style={[{width:'50%',height:'100%'},JAMAStyle.dFlex,JAMAStyle.alignItemCenter,{justifyContent:'flex-end'},JAMAStyle.flexRow,{backgroundColor:'rgba(4, 118, 2, 0.22)'},{paddingVertical:20,paddingHorizontal:16},JAMAStyle.borderRightRadius]}>
                    {item['amount_received'] != null ? (
                      <>
                          <Image
                          style={[{width:responsiveWidth(4.6),height:responsiveWidth(4.6)}]}
                          source={require('../Jamaassets/gold-ingots.png')}
                          />
                          <Text style={[JAMAStyle.goldAmountText,{color:JAMAColors.green},{fontSize:13},{textAlign:'center'}]}>{item['amount_received']}gm</Text>
                     </>
                    ):(<></>)}
                              
                  </View>
          
                </View>
                ):(
                  <View style={[{width:responsiveWidth(45)},{backgroundColor:JAMAColors.white,},JAMAStyle.dFlex,JAMAStyle.justifyContentCenter,JAMAStyle.alignItemCenter,JAMAStyle.flexRow,JAMAStyle.borderRightRadius]}>
                                                <View style={[JAMAStyle.dFlex,JAMAStyle.alignItemCenter,{justifyContent:'flex-end'},JAMAStyle.flexRow,{backgroundColor:'rgba(222, 0, 0, 0.24)',width:'50%'},{paddingVertical:20,paddingHorizontal:16}]}>
                                                 
                                                            <Text style={[JAMAStyle.goldAmountText,{color:JAMAColors.danger},{fontSize:responsiveFontSize(1.6)},{textAlign:'center'},]}>₹ 500</Text>
                                                            
                                                </View>
                                                <View style={[JAMAStyle.dFlex,JAMAStyle.alignItemCenter,{justifyContent:'flex-end'},JAMAStyle.flexRow,{backgroundColor:'rgba(4, 118, 2, 0.22)',width:'50%'},{paddingVertical:20,paddingHorizontal:16},JAMAStyle.borderRightRadius]}>
                                                            
                                                            <Text style={[JAMAStyle.goldAmountText,{color:JAMAColors.green},{fontSize:responsiveFontSize(1.6)},{textAlign:'center'}]}>₹ 3000</Text>
                                                </View>
                                        
                </View>
                )}               
                
        </TouchableOpacity>
  )
}

export default EnteriesCard
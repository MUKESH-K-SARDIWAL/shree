import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { JAMAColors } from '../Constants/JAMAColors';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import moment from 'moment';


const ContactCard = ({ item }) => {
  // console.log("item =>", JSON.stringify(item, null, 2));
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const changedDate = moment(new Date(item?.transaction_date)).format('DD MMM YY');

  // return (
  //   <TouchableOpacity
  //     onPress={() => {
  //       item?.transaction_mode == 'gold'
  //         ? navigation.navigate('UserTransectionOldUser', {
  //           name: item?.transaction_user_name,
  //           phone: item?.transaction_user_contact,
  //         })
  //         : navigation.navigate('PartiesUserTransectionOldUser', {
  //           name: item?.transaction_user_name,
  //           phone: item?.transaction_user_contact,
  //         });
  //     }}
  //     style={[
  //       JAMAStyle.contactCard,
  //       { width: width },
  //       JAMAStyle.dFlex,
  //       JAMAStyle.flexRow,
  //       JAMAStyle.cardPadding,
  //     ]}
  //     key={item?.transaction_user_contact}>
  //     <View style={[{ width: responsiveWidth(15) }]}>
  //       <View
  //         style={[
  //           JAMAStyle.dFlex,
  //           JAMAStyle.justifyContentCenter,
  //           JAMAStyle.alignItemCenter,
  //           JAMAStyle.borderCircle,
  //         ]}>
  //         <Text style={[JAMAStyle.cardFirstLatter]}>
  //           {item?.transaction_user_name?.charAt(0)?.toUpperCase()}
  //         </Text>
  //       </View>
  //     </View>
  //     <View style={[{ width: responsiveWidth(50) }]}>
  //       <View
  //         style={[
  //           JAMAStyle.dFlex,
  //           JAMAStyle.flexColumn,
  //           JAMAStyle.justifyContentCenter,
  //           { marginTop: 3 },
  //         ]}>
  //         {item?.transaction_user_name?.length > 35 ?
  //           (<Text style={[JAMAStyle.karigarName]}>
  //             {item?.transaction_user_name.substring(0, 34) + "...."}
  //           </Text>)
  //           : (
  //             <Text style={[JAMAStyle.karigarName]}>
  //               {item?.transaction_user_name}
  //             </Text>
  //           )
  //         }
  //         <Text style={[JAMAStyle.karigarTiming]}>{changedDate}</Text>
  //       </View>
  //     </View>
  //     <View style={[{ width: responsiveWidth(32) }]}>
  //       <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
  //         <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow]}>
  //           {item?.transaction_mode == 'gold' ? (
  //             <View
  //               style={[
  //                 JAMAStyle.dFlex,
  //                 JAMAStyle.flexRow,
  //                 JAMAStyle.alignItemCenter,
  //                 { justifyContent: 'flex-end' },
  //                 { width: '90%' },
  //               ]}>
  //               <Image
  //                 style={[JAMAStyle.goldbarCard]}
  //                 source={require('../Jamaassets/gold-ingots.png')}
  //               />
  //               <Text
  //                 style={[
  //                   item?.running_type == 'revenue'
  //                     ? JAMAStyle.requestCardText
  //                     : item?.running_type == 'expense'
  //                       ? JAMAStyle.payCardText
  //                       : JAMAStyle.settleCardText,
  //                 ]}>
  //                 {Number.isInteger(item?.running_balance)
  //                   ? Math.round(item?.running_balance) + 'gm'
  //                   : item?.running_balance?.toFixed(3) + 'gm'}
  //               </Text>
  //             </View>
  //           ) : (
  //             <Text
  //               style={[
  //                 JAMAStyle.goldBarAmountText,
  //                 { width: '90%' },

  //                 { textAlign: 'right' },
  //                 { fontSize: responsiveFontSize(2.3) },
  //                 { paddingVertical: 0 },
  //                 {
  //                   color:
  //                     item?.running_type == 'revenue'
  //                       ? JAMAColors.green
  //                       : item?.running_type == 'expense'
  //                         ? JAMAColors.danger
  //                         : JAMAColors.black,
  //                 },
  //               ]}>
  //               ₹{Number.isInteger(item?.running_balance) ? item?.running_balance : item?.running_balance?.toFixed(3)}
  //             </Text>
  //           )}
  //         </View>
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );


  // new code for Shree 

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('PartiesUserTransectionOldUser', {
          name: item?.transaction_user_name,
          phone: item?.transaction_user_contact,
        });
      }}
      style={[
        JAMAStyle.contactCard,
        { width: '100%' },
        JAMAStyle.dFlex,
        JAMAStyle.flexRow,
        JAMAStyle.cardPadding,
      ]}
      key={item?.transaction_user_contact}>
      <View style={[{ width: responsiveWidth(15) }]}>
        <View
          style={[
            JAMAStyle.dFlex,
            JAMAStyle.justifyContentCenter,
            JAMAStyle.alignItemCenter,
            JAMAStyle.borderCircle,
          ]}>
          <Text style={[JAMAStyle.cardFirstLatter]}>
            {item?.transaction_user_name?.charAt(0)?.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={[{ width: responsiveWidth(50) }]}>
        <View
          style={[
            JAMAStyle.dFlex,
            JAMAStyle.flexColumn,
            JAMAStyle.justifyContentCenter,
            { marginTop: 3 },
          ]}>
          {item?.transaction_user_name?.length > 35 ?
            (<Text style={[JAMAStyle.karigarName]}>
              {item?.transaction_user_name.substring(0, 34) + "...."}
            </Text>)
            : (
              <Text style={[JAMAStyle.karigarName]}>
                {item?.transaction_user_name}
              </Text>
            )
          }
          <Text style={[JAMAStyle.karigarTiming]}>{item?.transaction_date}</Text>
        </View>
      </View>
      <View style={[{ width: responsiveWidth(32) }]}>
        <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
          <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
            <View
              style={[
                JAMAStyle.dFlex,
                JAMAStyle.flexRow,
                JAMAStyle.alignItemCenter,
                { justifyContent: 'flex-end' },
                { width: '90%' },
              ]}>
              <Image
                style={[JAMAStyle.goldbarCard]}
                source={require('../Jamaassets/gold-ingots.png')}
              />
              <Text
                style={[
                  item?.gold?.running_type == 'revenue'
                    ? JAMAStyle.requestCardText
                    : item?.gold?.running_type == 'expense'
                      ? JAMAStyle.payCardText
                      : JAMAStyle.settleCardText,
                  , { fontSize: 14 }]}>
                {
                  item?.gold == null ? 0 + ' gm' : (Number.isInteger(item?.gold?.running_balance)
                    ? Math.round(item?.gold?.running_balance) + ' gm'
                    : item?.gold?.running_balance?.toFixed(3) + ' gm')
                }
              </Text>
            </View>
            <Text
              style={[
                JAMAStyle.goldBarAmountText,
                { width: '90%' },

                { textAlign: 'right' },
                { fontSize: responsiveFontSize(2.3) },
                { paddingVertical: 0 },
                {
                  color:
                    item?.parties?.running_type == 'revenue'
                      ? JAMAColors.green
                      : item?.parties?.running_type == 'expense'
                        ? JAMAColors.danger
                        : JAMAColors.black,
                }, { fontSize: 14 }
              ]}>
              ₹{
                item?.parties == null ? 0 : (Number.isInteger(item?.parties?.running_balance)
                  ? Math.round(item?.parties?.running_balance)
                  : item?.parties?.running_balance?.toFixed(3))
              }
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContactCard;

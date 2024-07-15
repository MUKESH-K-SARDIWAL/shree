import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  BackHandler,
  ActivityIndicator,

} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Contacts, { addContact } from 'react-native-contacts';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import { JAMAColors } from '../Constants/JAMAColors';
import { AlphabetList } from "react-native-section-alphabet-list";
import { apiUrl } from '../Constants/api-route';
import { getData } from '../Service/api-Service';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput, Button } from 'react-native-paper';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import RBSheet from 'react-native-raw-bottom-sheet';

const PartiesFindContact = ({ navigation }) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [search, setSearch] = useState('');
  const [filterContactList, setFilterContactList] = useState([]);
  const [newContect, setNewContect] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [nameField, setNameField] = useState('');
  const [numberField, setNumberField] = useState('');
  const [isField, setIsField] = useState(false);
  const refRBSheet = useRef([]);
  const [selectedUserData, setSelectedUserData] = useState(null);

  useEffect(() => {
    if (newContect.length == 0) {
      requestContactPermission();
    }
  }, []);

  function handleBackButtonClick() {
    navigation.goBack()
    return true;
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonClick,
    );
    return () => backHandler.remove();
  }, []);

  const requestContactPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'SHREE Need Access Contact Permission',
          message: 'SHREE Need Access Contact Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Contacts.getAll()
          .then(contacts => {
            // console.log(JSON.stringify(contacts, null, 2))
            contacts.map((value, index) => {
              newContect.push({
                key: value?.recordID,
                value: `${value?.displayName?.charAt(0).toUpperCase() +
                  value?.displayName?.slice(1)
                  }`,
                phone: `${value?.phoneNumbers[0]?.number}`,
              });
            });
            setFilterContactList([...newContect].sort((a, b) => (a.value > b.value ? 1 : -1))
            );
            setIsLoading(false);
          })
          .catch(e => {
            // console.log(e);
          });
      } else {
        // console.log('Contact permission denied');
      }
    } catch (err) {
      // console.warn(err);
    }
  };

  const searchFilterFunction = text => {
    if (text) {
      const newData = newContect.filter(item => {
        const itemData = item.value ? item.value.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilterContactList(newData);
      setSearch(text);
    } else {
      setFilterContactList(newContect);
      setSearch(text);
    }
  };

  const addNewContact = async () => {

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: 'SHREE Need Access Contact Permission',
          message: 'SHREE Need Access Contact Permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        var newPerson = {
          phoneNumbers: [{
            label: 'mobile',
            number: numberField,
          }],
          displayName: nameField,
          givenName: nameField,
        }
        Contacts.addContact(newPerson).then((resp) => {
          // console.log(`resp==>`, JSON.stringify(resp, null, 2));
          navigation.navigate('PartiesUserTransection',
            {
              name: nameField,
              phone: numberField,
              key: resp?.recordID
            });
          setIsField(false);
        })
      }
    }
    catch (err) {
      console.warn(err);
    }


  }

  const enterManuallyDetails = () => {
    setClicked(true);
  }

  const forceData = (data) => {
    // console.log(data.length);
    setNumberField(data);
    if (data.length == 10) {
      setIsField(true);
    }
    else {
      setIsField(false);
    }
  }

  const checkUserHistoryType = async (item, type) => {

    // navigation.navigate('PartiesUserTransection', {
    //   name: item.value,
    //   phone: item.phone,
    // })
    // console.log("item => ", item)
    setIsLoading(true);
    // console.log(apiUrl.transection_history + '?' + `user_name=${item?.value}&transaction_type=all&filter_type=DESC_date&report_duration=all`)

    await getData(apiUrl.transection_history + '?' + `user_name=${item?.value}&transaction_type=all&filter_type=DESC_date&report_duration=all`)
      .then(resp => {
        console.log("resp", JSON.stringify(resp?.data?.data.length, null, 2))
        if (resp?.data?.data.length == 0) {
          setIsLoading(false);
          navigation.navigate('PartiesUserTransection', {
            name: item.value,
            phone: item.phone,
            id: item.key
          })
        }
        else {
          resp?.data?.data.find((val, ind) => {
            if (val.transaction_user_name == item.value) {
              setIsLoading(false);
              navigation.navigate('PartiesUserTransectionOldUser', {
                name: item.value,
                phone: item.phone,
                id: item.key
              });
            }
            else {
              setIsLoading(false);
              navigation.navigate('PartiesUserTransection', {
                name: item.value,
                phone: item.phone,
                id: item.key
              });
            }

          });
        }

      })
      .catch(err => {
        Snackbar.show({
          text: `Something wents wrong please try again`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: JAMAColors.light_sky,
        });
        navigation.navigate('PartiesEnterpriseScreen')
        console.log('err', err);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }


  return isLoading == true ? (
    <>
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}>
        <ActivityIndicator size="large" color={JAMAColors.light_sky} />
      </View>
    </>
  ) : (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.bgWhite]}>
          <View
            style={[
              JAMAStyle.dFlex,
              JAMAStyle.flexRow,
              JAMAStyle.alignItemCenter,
              JAMAStyle.justifyContentCenter,
              {
                borderWidth: 1,
                borderColor: '#A9A9A9',
                borderRadius: 5,
                width: width * 0.9,
              },
              JAMAStyle.mLeftAuto,
              JAMAStyle.mRightAuto,
              { marginTop: 15, marginBottom: 5 },
            ]}>
            <View>
              <TextInput
                mode="flat"
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                style={[
                  {
                    margin: 7,
                    borderWidth: 1,
                    borderColor: 'transparent',
                    borderRadius: 5,
                  },
                  {
                    width: width * 0.8,
                    height: 20,
                    backgroundColor: JAMAColors.white,
                  },
                ]}
                placeholderTextColor={JAMAColors.placeHolder_grey}
                placeholder="Party Name"
                value={search}
                onChangeText={text => [searchFilterFunction(text), setNameField(text)]}
                selectionColor={JAMAColors.placeHolder_grey}
              />
            </View>
            <TouchableOpacity
              style={[{ borderBottomLeftRadius: 5, borderTopLeftRadius: 5 }]}
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                style={[{ width: 15, height: 15, marginRight: 10, tintColor: JAMAColors.black }]}
                source={require('../Jamaassets/Cross.png')}
              />
            </TouchableOpacity>
          </View>
          {clicked == false ?
            <TouchableOpacity
              style={[
                JAMAStyle.dFlex,
                JAMAStyle.flexRow,
                JAMAStyle.alignItemCenter,
                { width: width * 0.9, marginTop: 15, marginBottom: 5 },
                JAMAStyle.mLeftAuto,
                JAMAStyle.mRightAuto,
              ]}
              onPress={() => { enterManuallyDetails() }}
            >
              <View style={[
                JAMAStyle.dFlex,
                JAMAStyle.justifyContentCenter,
                JAMAStyle.alignItemCenter,
                {
                  borderStyle: 'dashed', width: width * 0.1,
                  height: 40,
                  borderRadius: 20,
                  borderColor: JAMAColors.light_sky, borderWidth: 1
                },
              ]}>
                <Text
                  style={[
                    JAMAStyle.cardFirstLatter,
                    { color: JAMAColors.light_sky },
                  ]}>+
                </Text>
              </View>
              <View style={[{ width: width * 0.7, padding: 10, }]}>
                <Text style={[{ fontSize: responsiveFontSize(1.8), fontFamily: 'Roboto-Regular', color: JAMAColors.light_sky }]}>Add Party</Text>
              </View>
              <View style={[{ width: width * 0.2, alignItems: 'center' }]}>
                <Icon name={'angle-right'} size={20} margin={10} color={JAMAColors.light_sky} />
              </View>
            </TouchableOpacity>
            :
            <View>
              <View style={[
                {
                  borderWidth: 1,
                  borderColor: '#A9A9A9',
                  borderRadius: 5,
                  width: width * 0.9,
                  marginVertical: 5
                },
                JAMAStyle.dFlex,
                JAMAStyle.flexRow,
                JAMAStyle.alignItemCenter,
                JAMAStyle.justifyContentCenter,
                JAMAStyle.mLeftAuto,
                JAMAStyle.mRightAuto,
              ]}>
                <TextInput
                  mode="flat"
                  placeholder='Mobile Number'
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  selectionColor={JAMAColors.placeHolder_grey}
                  placeholderTextColor={JAMAColors.placeHolder_grey}
                  editable
                  keyboardType='numeric'
                  style={[
                    {
                      marginVertical: 7,
                      borderWidth: 1,
                      borderColor: 'transparent',
                      borderRadius: 5,
                      width: width * 0.8,
                      height: 20,
                      backgroundColor: JAMAColors.white,
                      paddingHorizontal: 2,
                    },
                  ]}
                  // value={numberField == '' ? '' : numberField}
                  onChangeText={(text) => { forceData(text) }}
                />
              </View>
              <View style={[{ marginTop: 5, flexDirection: 'row', width: width * .93, marginLeft: 15 }]}>
                <Button
                  onPress={() => { addNewContact() }}
                  disabled={(nameField == '') || (numberField.length <= '9')}
                  style={[
                    {

                      backgroundColor: nameField != '' && numberField.length == '10 '
                        ? JAMAColors.light_sky
                        :
                        JAMAColors.light_silver,
                    },

                    JAMAStyle.buttonAuth,
                    JAMAStyle.mTop20,
                    { width: responsiveWidth(90) },
                  ]}>
                  <Text
                    style={[
                      {
                        color:
                          nameField != '' && numberField.length == '10'
                            ? JAMAColors.white
                            :
                            JAMAColors.light_gry,
                      },
                      {
                        fontFamily: 'Roboto-Bold',
                        fontSize: responsiveFontSize(2.2),
                      },
                      JAMAStyle.lSpacing,
                    ]}>
                    CONTINUE
                  </Text>
                </Button>
              </View>
            </View>}
          <View
            style={[
              JAMAStyle.dFlex,
              JAMAStyle.flexRow,
              JAMAStyle.justifyContentCenter,
              JAMAStyle.alignItemCenter,
              {
                backgroundColor: JAMAColors.white
              }
            ]}>
            <View
              style={[
                JAMAStyle.dFlex,
                JAMAStyle.flexColumn,
                { width: width * 0.93, flex: 1 },
              ]}>
              {
                <AlphabetList
                  data={filterContactList}
                  indexLetterStyle={{
                    color: JAMAColors.footer_text,
                    fontSize: 13,
                    paddingVertical: 1
                  }}
                  indexLetterContainerStyle={{
                    // height:height*.035,
                    height: height * 0,
                  }}

                  renderCustomItem={(item, index) => (
                    item.phone != 'undefined' && <>
                      <TouchableOpacity

                        onPress={() => {
                          setSelectedUserData(item);
                          checkUserHistoryType(item)
                          // refRBSheet.current[index].open();
                        }}
                        style={[
                          JAMAStyle.dFlex,
                          JAMAStyle.flexRow,
                          { backgroundColor: JAMAColors.white, padding: 15 },
                        ]}
                        key={item.key}>
                        <View style={[{ width: width * 0.13 }]}>
                          <View
                            style={[
                              JAMAStyle.dFlex,
                              JAMAStyle.justifyContentCenter,
                              JAMAStyle.alignItemCenter,
                              JAMAStyle.findContactborderCircle,
                              { backgroundColor: JAMAColors.light_sky },
                            ]}>
                            <Text
                              style={[
                                JAMAStyle.cardFirstLatter,
                                { color: JAMAColors.white },
                              ]}>
                              {item.value.slice(0, 1).toUpperCase()}
                            </Text>
                          </View>
                        </View>
                        <View style={[{ width: width * 0.8 }]}>
                          <View
                            style={[
                              JAMAStyle.dFlex,
                              JAMAStyle.flexColumn,
                              JAMAStyle.justifyContentCenter,
                              { marginTop: 3 },
                            ]}>
                            <Text style={[JAMAStyle.karigarName]}>
                              {item.value}
                            </Text>
                            <Text style={[JAMAStyle.karigarTiming]}>
                              {item.phone}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <RBSheet
                        ref={ref => (refRBSheet.current[index] = ref)}
                        useNativeDriver={false}
                        height={180}
                        customStyles={{
                          wrapper: {
                            backgroundColor: '#00000070',
                            padding: 15,
                          },
                          container: {
                            top: -height * .35,
                            borderRadius: 10,
                            alignItems: 'center',
                            // overflow: 'hidden'
                            justifyContent: 'center'
                          },
                          draggableIcon: {
                            backgroundColor: '#000',
                          },
                        }}
                        customModalProps={{
                          animationType: 'slide',
                          statusBarTranslucent: false,
                        }}
                        customAvoidingViewProps={{
                          enabled: true,
                        }}>
                        <View style={{ flexDirection: 'column', gap: 20, paddingVertical: 20, paddingHorizontal: 35, width: width }}>
                          <TouchableOpacity style={{ height: 40, backgroundColor: JAMAColors.light_sky, borderRadius: 6, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => { checkUserHistoryType(selectedUserData, 'gold') }}>
                            <Text style={{ color: JAMAColors.white, fontSize: 16, textAlign: 'center', fontFamily: 'Roboto-Medium' }}>Add Gold</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{ height: 40, backgroundColor: JAMAColors.light_sky, borderRadius: 6, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => { checkUserHistoryType(selectedUserData, 'parties') }}>
                            <Text style={{ color: JAMAColors.white, fontSize: 16, textAlign: 'center', fontFamily: 'Roboto-Medium' }}>Add Rupee</Text>
                          </TouchableOpacity>
                        </View>
                      </RBSheet>
                    </>

                  )}
                  renderCustomSectionHeader={(section) => (
                    <View >
                      {/* <Text>{section.title}</Text> */}
                    </View>
                  )
                  }
                />
              }
            </View>

          </View>
        </View>

      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default PartiesFindContact;
import { View, Text, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, Pressable, Image, BackHandler, ScrollView, PermissionsAndroid, Alert, TouchableWithoutFeedback, } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import { JAMAColors } from '../Constants/JAMAColors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import { postData } from '../Service/api-Service'
import { apiUrl, baseUrl, imageBase } from '../Constants/api-route'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Snackbar from 'react-native-snackbar';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Modal from "react-native-modal";
import moment from 'moment';
import ImageView from "react-native-image-viewing";
// import RNFetchBlob from 'rn-fetch-blob';

const PartiesFillTransection = ({ route, navigation }) => {
  // console.log("route",route?.params?.name)
  const changedDate = moment(new Date()).format('DD MMM YY');
  // const navigation = useNavigation()
  const [checkApiType, setCheckApiType] = useState(false)
  const width = Dimensions.get('window').width;
  const [date, setDate] = useState(new Date());
  const [displayDate, setDisplayDate] = useState(null)
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [checkImage, setCheckImage] = useState([]);
  const [moneyValue, setMoneyValue] = useState('0');
  const [moneyDescription, setMoneyDescription] = useState('');
  const [storedData, setStoredData] = useState(null)
  const [transactionType, setTransactionType] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState('')
  const [previousUser, setPreviousUser] = useState('')
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [billDetail, setBillDetail] = useState('')


  async function handleBackButtonClick() {
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true)
      Data();
    });
    return unsubscribe;
  }, [navigation]);


  const Data = async () => {
    // console.log("baseURL",baseURL);
    if (await AsyncStorage.getItem('userData')) {
      await AsyncStorage.getItem('userData').then((valueData) => {
        const sData = JSON.parse(valueData);
        // console.log('sData',sData)
        setCheckApiType(true)
        setStoredData(sData)
        let money = sData?.amount_received == 0 ? sData?.amount_sent : sData?.amount_received;
        let description = sData?.description;
        if (sData?.bill_detail != null)
          setClicked(true)
        setMoneyValue(money)
        setPreviousUser(sData?.transaction_user_name)
        setMoneyDescription(description != 'null' ? description : '')
        const changedDate = moment(new Date(sData?.transaction_date)).format('DD MMM YY');
        setDate(new Date(sData?.transaction_date));
        setDisplayDate(changedDate);
        setTransactionType(sData?.transaction_type)
        setCheckImage(sData?.attachments == null ? [] : (sData?.attachments))
        setBillDetail(sData?.bill_detail != null ? sData?.bill_detail : '')
      }).catch((err) => {
        console.log('wertytrewer', err)
      }).finally(() => {
        setIsLoading(false)
      })
    }
    else {
      setMoneyValue('0')
      setIsLoading(false)
    }
  }

  const showImagePreview = (ImageArray) => {
    let tempArray = []
    for (let i = 0; i < ImageArray.length; i++) {
      if (ImageArray[i]?.attachments == undefined) {
        tempArray.push({ uri: ImageArray[i]?.path })
      }
      else {
        tempArray.push({ uri: imageBase + ImageArray[i]?.attachments })
      }
    }
    setPreviewImageUrl(tempArray);
    setImagePreview(true)
  }

  async function uploadAttachments(data) {
    const formData = new FormData();
    // console.log(storedData)
    formData.append('attachments[]', {
      uri: data.path,
      type: data.mime,
      name: data.modificationDate + "" + '.jpg',
    })
    formData.append('transaction_id', storedData?.id)
    // console.log(formData)
    await postData(apiUrl.upload_attachments, formData)
      .then(resp => {
        const respo = resp['data']['data']
        setCheckImage(respo);
      })
      .catch(err => {
        console.log(err)
        Snackbar.show({
          text: `Something wents wrong please try again`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: JAMAColors.light_sky,
        });

      })
  }

  async function removeAttachments(value) {
    const formData = new FormData();
    formData.append('record_id', value?.id)
    formData.append('transaction_id', value?.transaction_id)
    await postData(apiUrl.delete_attachments, formData)
      .then(resp => {
        // console.log(resp['data']['data']);
        setCheckImage(resp['data']['data'])
        setIsLoading(false);
      })
      .catch(err => {
        console.log("err", err)
        Snackbar.show({
          text: `Something wents wrong please try again`,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: JAMAColors.light_sky,
        });


      })
  }

  async function saveUserTransectionData() {
    setIsLoading(true)
    if (checkApiType == false) {

      // let modifiedDate = new Date(date)

      let mobileNumber = (route.params.phone).slice(0, 1) == '+' ? (route.params.phone).slice(3) : route.params.phone;
      // let base64 = (checkImage.length == 0) ? '' : JSON.stringify(checkImage);
      const formData = new FormData()
      checkImage.forEach((image, index) => {
        formData.append('attachments[]', {
          uri: image.path,
          type: image.mime,
          name: image.modificationDate + "" + '.jpg',
        });
      });
      formData.append('description', moneyDescription);
      formData.append('transaction_metrics', 'INR');
      formData.append('transaction_mode', 'parties');
      formData.append('transaction_type', route.params.color == '#DE0000' ? 'expense' : 'revenue');
      let modifiedDate = new Date(date);
      let transactionDate = modifiedDate.getFullYear() + "-" + (modifiedDate.getMonth() + 1) + "-" + modifiedDate.getDate();
      formData.append('transaction_date', transactionDate);
      formData.append('amount_sent', route.params.color == '#DE0000' ? moneyValue : '');
      formData.append('amount_received', route.params.color == "#047602" ? moneyValue : '');
      formData.append('transaction_user_contact', mobileNumber.split(' ').join(''));
      formData.append('transaction_user_name', route.params.name);
      formData.append('bill_detail', billDetail);
      await postData(apiUrl.submit_transection, formData)
        .then(resp => {
          setIsLoading(false)
          navigation.push('PartiesTransectionsaved', { name: resp?.data?.data?.transaction_user_name, phone: resp?.data?.data?.transaction_user_contact })
        })
        .catch(error => {
          if (error.message) {
            // Alert.alert(error.message)
          
            Snackbar.show({
              text: error.message,
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: JAMAColors.light_sky,
            });
          }
          navigation.navigate('PartiesFillTransection')
          console.log(`error==>`, error);
        })
        .finally(() => {
          setCheckImage([]),
            setMoneyValue('0'),
            setMoneyDescription('')
          setDisplayDate(null)
          setDate(new Date())
          setBillDetail('');
        })
    }
    else {
      let newImage = (checkImage.length == 0) ? '' : JSON.stringify(checkImage);
      let mobileNumber = (storedData?.transaction_user_contact).slice(0, 1) == '+' ? (storedData?.transaction_user_contact).slice(3) : storedData?.transaction_user_contact;

      const formData = new FormData()
      checkImage.forEach((image, index) => {
        // console.log(image)
        image.path == undefined ? (
          ''
        ) : (
          formData.append('attachments[]', {
            uri: image.path,
            type: image.mime,
            name: image.modificationDate + "" + '.jpg',
          })
        )

      });
      formData.append('description', moneyDescription == null ? '' : moneyDescription);
      formData.append('transaction_metrics', 'INR');
      formData.append('transaction_mode', 'parties');
      formData.append('transaction_type', storedData?.transaction_type);
      let modifiedDate = new Date(date);
      let transactionDate = modifiedDate.getFullYear() + "-" + (modifiedDate.getMonth() + 1) + "-" + modifiedDate.getDate();
      formData.append('transaction_date', transactionDate);
      formData.append('amount_sent', storedData?.transaction_type == 'expense' ? moneyValue : '');
      formData.append('amount_received', storedData?.transaction_type == 'revenue' ? moneyValue : '');
      formData.append('transaction_user_contact', mobileNumber.split(' ').join(''));
      formData.append('transaction_user_name', storedData?.transaction_user_name);
      formData.append('id', storedData?.id)
      formData.append('bill_detail', billDetail == null ? '' : billDetail)

      await postData(apiUrl.update_transection, formData)
        .then(resp => {
          setIsLoading(false)
          navigation.push('PartiesTransectionsaved', { name: resp?.data?.data?.transaction_user_name, phone: resp?.data?.data?.transaction_user_contact })
        })
        .catch(error => {
          if (error.message) {
            // Alert.alert(error.message)
         
            Snackbar.show({
              text: error.message,
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: JAMAColors.light_sky,
            });
          }
          navigation.navigate('PartiesEnterpriseScreen')
          console.log(`error==>`, error);
        })
        .finally(() => {
          setCheckImage([]),
            setMoneyValue('0'),
            setMoneyDescription('')
          setDisplayDate(null)
          setDate(new Date())
          setBillDetail('');
        })
    }





  }

  const OpenGallery = async () => {
    try {
      const grantedstorage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: "SHREE Need Access Storage Permission",
          message: "SHREE Need Access Storage Permission",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      openGallery('Gallery');
    } catch (err) {
      Alert.alert(err);
    }

  }
  function openCamera(type) {

    if (type === 'Camera') {
      ImagePicker.openCamera({
        includeBase64: false,
        // compressImageMaxWidth: 500,
        // compressImageMaxHeight: 500,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 1,

        // multiple: true
      }).then(image => {
        console.log(image);
        setVisible(false);
        if (storedData?.id != null) {
          uploadAttachments(image)
        }
        else {
          setCheckImage([...checkImage, image]);
          setVisible(false);
        }

        // const base64Data = image.data;
        // const fileName = getUniqueFileName('jpg');
        // writeFileToStorage(base64Data, fileName);
      })
        .catch((err) => {
          console.log(err)
        });
    }
  }
  function openGallery(type) {

    if (checkImage.length < 4) {

      if (type === 'Gallery') {
        ImagePicker.openPicker({
          includeBase64: false,
          // compressImageMaxWidth: 500,
          // compressImageMaxHeight: 500,
          mediaType: 'photo',
          cropping: true,
          compressImageQuality: 1,
        }).then(image => {

          setVisible(false)
          if (storedData?.id != null) {
            uploadAttachments(image)
          }
          else {
            setCheckImage([...checkImage, image]);
            setVisible(false);
          }
        })
          .catch((err) => {
            console.log(err)
          });
      }
    }
    else {
      Alert.alert('You have reached your maximum limit of selected images')
    }
  }
  // 
  // const getUniqueFileName = (fileExt) => {
  //   //It is better naming file with current timestamp to achieve unique name
  //   var d = new Date();
  //   var year = d.getFullYear();
  //   var month = d.getMonth() + 1;
  //   var date = d.getDate();
  //   var hour = d.getHours();
  //   var minute = d.getMinutes();
  //   var fileName = 'IMG' + year + month + date + hour + minute + '.' + fileExt;
  //   return fileName;
  // };


  // const writeFileToStorage = async (base64Data, fileName) => {
  //   try {
  //     const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  //     if (result == PermissionsAndroid.RESULTS.GRANTED) {
  //       const dirs = RNFetchBlob.fs.dirs;
  //       console.log(dirs)
  //       var folderPath = dirs.SDCardDir + '/New/';
  //       console.log(folderPath);
  //       var fullPath = folderPath + fileName;
  //         console.log(fullPath)
  //         // if(folderPath)
  //       // RNFetchBlob.fs.mkdir(folderPath).then((res) => {
  //       //   console.log('res', res);
  //       // });

  //       RNFetchBlob.fs.writeFile(fullPath, base64Data, 'base64').then((res) => {
  //         console.log('file saved :', res);
  //       });
  //     } else {
  //       console.log('Permission Not Granted');
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    const changedDate = moment(new Date(currentDate)).format('DD MMM YY');
    setDisplayDate(changedDate)
  };

  const showMode = () => {
    setShow(true);
    setMode('date');
  };
  const showBill = () => {
    setClicked(true);
  }
  const deleteSelectedImage = (index, value) => {
    if (storedData?.id == undefined) {
      checkImage.splice(index, 1)
      setCheckApiType([...checkImage])
      setIsLoading(false)
    }
    else {
      removeAttachments(value)
    }
  }
  return (
    isLoading == true ? (
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
      imagePreview == true ? (
        <ImageView
          images={previewImageUrl}
          imageIndex={0}
          presentationStyle='pageSheet'
          keyExtractor={(item) => { item?.uri }}
          visible={imagePreview}
          onRequestClose={() => setImagePreview(false)}
        />
        // <Modal
        //   transparent={true}
        //   visible={imagePreview}
        //   style={{
        //     justifyContent: 'flex-start', alignItems: 'center', width: '90%',
        //     backgroundColor: '#282828'
        //   }}
        // >
        //   <View style={{ position: 'relative',justifyContent:'center', width: '70%', height: '70%', marginTop: 40, alignSelf: 'center' }}>
        //     <Pressable
        //       onPress={() => {
        //         setImagePreview(false)
        //       }}
        //       style={{ top: -12, right: 0, position: 'absolute', zIndex: 10, backgroundColor: JAMAColors.white, borderRadius: 10, padding: 10 }}
        //     >
        //       <Image
        //         style={{ resizeMode: 'center', width: 25, height: 25, tintColor: JAMAColors.danger, }}
        //         source={require('../Jamaassets/Cross.png')}
        //       />
        //     </Pressable>
        //     <Image
        //       style={{ width: responsiveWidth(70), height: responsiveHeight(70), alignSelf: 'center', resizeMode: 'center' }}
        //       source={{ uri: previewImageUrl }}
        //     />
        //   </View>

        // </Modal>
      ) :
        (
          <KeyboardAvoidingView style={[{ flex: 1 }, JAMAStyle.dFlex, JAMAStyle.flexColumn, { backgroundColor: JAMAColors.light_silver, width: width }]}>
            <View style={[{ flex: 1 }, JAMAStyle.dFlex, JAMAStyle.flexColumn, { backgroundColor: JAMAColors.light_silver, width: width }]}>

              <View style={[{ height: 55 }]}>
                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, { backgroundColor: JAMAColors.white, padding: 15.5, }]}>
                  <TouchableOpacity style={[JAMAStyle.flexRow, { marginLeft: 3 }]}
                    onPress={() => {
                      handleBackButtonClick()
                      // setIsSelectionModeEnabled(!isSelectionModeEnabled)
                    }}>
                    <Icon name={'angle-left'} size={18} color={route.params.color} />
                  </TouchableOpacity>
                  {(route?.params?.name?.length || previousUser.length) > 31 ?
                    (<Text style={[JAMAStyle.userheaderText, { color: `${route?.params?.color}`, paddingLeft: 17 }]}>
                      {`You ${storedData == null ? (route?.params?.color == JAMAColors.danger ? 'gave' : 'got') : (storedData?.amount_received == 0 ? 'gave' : 'got')} ₹ ${moneyValue} to  ${previousUser == '' ? (route?.params?.name.substring(0, 34) + "...") : previousUser.substring(0, 30) + "..."}`}
                    </Text>) :
                    (
                      <Text style={[JAMAStyle.userheaderText, { color: `${route?.params?.color}`, paddingLeft: 17 }]}>
                        {`You ${storedData == null ? (route?.params?.color == JAMAColors.danger ? 'gave' : 'got') : (storedData?.amount_received == 0 ? 'gave' : 'got')} ₹ ${moneyValue} to  ${previousUser == '' ? route?.params?.name : previousUser}`}
                      </Text>
                    )
                  }
                </View>
              </View>
              <ScrollView>
                <View
                  style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentCenter, { marginTop: 15, width: width * .9 }, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto]}
                >
                  <View style={[JAMAStyle.alignItemCenter, JAMAStyle.justifyContentCenter, { backgroundColor: JAMAColors.white, height: 50, width: 60, borderBottomLeftRadius: 5, borderTopLeftRadius: 5, padding: 10 }]}>
                    <Image
                      style={{ alignSelf: 'center', tintColor: JAMAColors.footer_text, width: 9, height: 15 }}
                      source={require('../Jamaassets/rupee.png')}
                    />
                  </View>
                  <View >
                    <TextInput
                      style={[JAMAStyle.enterGoldInput, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { width: width * .78, backgroundColor: JAMAColors.white, height: 50 }, JAMAStyle.positionRelative]}
                      placeholder='Enter Balance'
                      keyboardType="numeric"
                      value={`${moneyValue == '0' ? '' : moneyValue}`}
                      editable
                      cursorColor={JAMAColors.light_sky}
                      onChangeText={(text) => { setMoneyValue(text) }}
                      placeholderTextColor={JAMAColors.placeHolder_grey}
                    />
                  </View>
                </View>
                <View style={[{ marginTop: 15 }]}>
                  <TextInput
                    placeholder='Enter Details'
                    style={[JAMAStyle.enterValueInput, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { width: width * .93, backgroundColor: JAMAColors.white }]}
                    placeholderTextColor={JAMAColors.placeHolder_grey}
                    editable
                    multiline

                    value={moneyDescription == '' ? '' : moneyDescription}
                    onChangeText={(text) => { setMoneyDescription(text) }}

                    maxLength={40}
                    numberOfLines={4}
                  />
                </View>
                {clicked == false ?
                  <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceBetween, JAMAStyle.flexRow, { width: width * .90 }, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginTop: 30 }]}>
                    <TouchableOpacity style={[JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceBetween, JAMAStyle.flexRow, { width: width * .35, backgroundColor: JAMAColors.white, }, { borderRadius: 5 }, { paddingHorizontal: 10, paddingVertical: 6 }]}
                      onPress={() => { showBill() }}>
                      <Icon name='book' size={20} color={JAMAColors.light_sky} />
                      <Text style={[JAMAStyle.attachmentText, { color: JAMAColors.light_sky }]}>Add Bill No.</Text>
                    </TouchableOpacity>
                  </View>
                  :
                  <View style={[{ marginTop: 15 }]}>
                    <TextInput
                      placeholder='Enter Bill Details'
                      style={[JAMAStyle.enterValueInput, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { width: width * .93, backgroundColor: JAMAColors.white }]}
                      placeholderTextColor={JAMAColors.placeHolder_grey}
                      editable
                      value={billDetail == null ? '' : billDetail}
                      onChangeText={(text) => { setBillDetail(text) }}
                    />
                  </View>}
                <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceBetween, JAMAStyle.flexRow, { width: width * .90 }, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginTop: 30 }]}>
                  <TouchableOpacity style={[JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceBetween, JAMAStyle.flexRow, { width: width * .35, backgroundColor: JAMAColors.white, }, { borderRadius: 5 }, { paddingHorizontal: 10, paddingVertical: 6 }]}
                    onPress={() => { showMode() }}
                  >
                    <Icon name='calendar-day' size={20} color={`${route.params.color}`} />
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        display='calendar'
                        maximumDate={new Date()}
                        is24Hour={true}
                        onChange={onChange}
                      />
                    )}
                    <Text style={[JAMAStyle.attachmentText, { color: `${route.params.color}` }]}>{displayDate == null ? changedDate : displayDate}</Text>
                    <Icon name='caret-down' size={20} color={`${route.params.color}`} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceAround, JAMAStyle.flexRow, { width: width * .33, backgroundColor: JAMAColors.white }, { paddingHorizontal: 5, paddingVertical: 6 }, { borderRadius: 5 }]}
                    onPress={() => {
                      checkImage.length < 4 ? setVisible(true) : Alert.alert('You have reached your maximum limit of selected images')
                    }}
                  >
                    <Icon name='camera' size={20} color={`${route.params.color}`} />
                    <Text style={[JAMAStyle.attachmentText, { color: `${route.params.color}` }]}>Attachment</Text>
                  </TouchableOpacity>
                </View>
                <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceBetween, JAMAStyle.flexRow, { width: width * .93 }, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginTop: 10 }]}>
                  <View style={[{ width: width * .55, }, { paddingHorizontal: 10, paddingVertical: 0, flexDirection: 'row' }]}></View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={[{ width: width * .35, }, { paddingHorizontal: 5, paddingVertical: 0, flexDirection: 'row' }]}>
                    {
                      checkImage.map((value, index) => {
                        // ("**value**",value)
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setImagePreview(true)
                              // showImagePreview(value)
                              showImagePreview(checkImage)
                            }}
                            style={[{ width: 130, height: 180 }, JAMAStyle.positionRelative, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, { marginTop: 10, marginLeft: 1 }]} key={index}>
                            {
                              value?.path == undefined ?
                                (
                                  <Image
                                    style={{ resizeMode: 'center', width: 130, height: 180 }}
                                    source={{ uri: imageBase + value?.attachments }}
                                  />
                                ) :
                                (
                                  <Image
                                    style={{ resizeMode: 'center', width: 130, height: 180 }}
                                    source={{
                                      uri: value?.path
                                    }}
                                  />
                                )
                            }
                            <Pressable
                              onPress={() => {
                                setIsLoading(true);
                                deleteSelectedImage(index, value);
                              }}
                              style={[JAMAStyle.positionAbsolute, { top: -8, right: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: JAMAColors.white, alignSelf: 'center', justifyContent: 'center' }]}>
                              <Image
                                style={{ alignSelf: 'center', width: 12, height: 12, tintColor: JAMAColors.danger, }}
                                source={require('../Jamaassets/Cross.png')}
                              />
                            </Pressable>
                          </TouchableOpacity>

                        )
                      })
                    }
                    <TouchableWithoutFeedback onPress={() => { setVisible(false) }}>
                      <Modal
                        style={[{ width: '100%', marginLeft: 0, marginBottom: 0 }]}
                        isVisible={visible}
                        onBackButtonPress={() => { setVisible(false); }}
                      >
                        <View style={[{ bottom: 0, right: 0, left: 0, height: 200, backgroundColor: '#fff', width: '100%' }, JAMAStyle.positionAbsolute]}>
                          <View style={[{ borderWidth: 1, borderColor: JAMAColors.black, borderTopWidth: 0, borderBottomWidth: 0 }]}>
                            <TouchableOpacity style={{ width: '100%', height: 60, flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={() => {
                              checkImage.length < 4 ?
                                openCamera('Camera') : Alert.alert('You have reached your maximum limit of selected images')
                            }}>
                              <Icon name='camera' size={20} color={JAMAColors.card_text} />
                              <Text style={[{ color: JAMAColors.black, fontFamily: 'Roboto-Regular', textAlign: 'center', marginLeft: 15 }]}>Take Photo</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={[{ borderWidth: 1, borderColor: JAMAColors.black, borderBottomWidth: 0 }]}>
                            <TouchableOpacity style={{ width: '100%', height: 60, flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={() => {
                              openGallery('Gallery')
                            }}>
                              <Icon name='image' size={20} color={JAMAColors.card_text} />
                              <Text style={[{ color: JAMAColors.black, fontFamily: 'Roboto-Regular', textAlign: 'center', marginLeft: 15 }]}>Choose From Gallery</Text>
                            </TouchableOpacity>
                          </View>
                          <View style={[{ borderWidth: 1, borderColor: JAMAColors.black }]}>
                            <TouchableOpacity style={{ width: '100%', height: 60, flexDirection: 'row', alignItems: 'center', padding: 10 }} onPress={() => { setVisible(false) }}>
                              <Image
                                style={{ resizeMode: 'center', width: 20, height: 20, tintColor: JAMAColors.danger, }}
                                source={require('../Jamaassets/Cross.png')}
                              />
                              <Text style={[{ color: JAMAColors.black, fontFamily: 'Roboto-Regular', textAlign: 'center', marginLeft: 15 }]}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
            <View style={[{ flex: .12 }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, { width: width * .93 }, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto,]}>
              <TouchableOpacity style={[{ backgroundColor: (moneyValue != '0' && moneyValue != '') ? `${route.params.color}` : JAMAColors.footer_text, borderRadius: 5 }]}
                disabled={moneyValue == '0' && moneyValue != ''}
                onPress={() => { saveUserTransectionData() }}
              >
                <Text style={[{
                  textAlign: 'center', padding: 10, color: JAMAColors.white,
                  fontFamily: 'Roboto-Bold', fontSize: 15
                }]}>SAVE</Text>
              </TouchableOpacity>
            </View>

          </KeyboardAvoidingView>
        )
    )
  )
}

export default PartiesFillTransection;
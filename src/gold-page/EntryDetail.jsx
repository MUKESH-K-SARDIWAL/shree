import { Text, View, Image, TouchableOpacity, Dimensions, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Pressable, StyleSheet, BackHandler, Platform } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import { JAMAColors } from '../Constants/JAMAColors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import EnteriesCard from '../SharedComponent/EnteriesCard';
import { useNavigation } from '@react-navigation/native';
import { privateUserData } from '../Service/userData';
import { ActivityIndicator, Modal } from 'react-native-paper';
import { getData, postData } from '../Service/api-Service';
import { apiUrl, imageBase } from '../Constants/api-route';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageView from "react-native-image-viewing";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import moment from 'moment';

const EntryDetails = ({ route }) => {
    // console.log("route",route);
    const navigation = useNavigation();
    const width = Dimensions.get('window').width;
    const [modalVisible, setModalVisible] = useState(false);
    const [userEntryDetail, setUserEntryDetail] = useState(null)
    const [date, setDate] = useState('')
    const [selectedImage, setSelectedImage] = useState([])
    const [imagePreview, setImagePreview] = useState(false)
    const [bigSelectedImage, setBigSelectedImage] = useState([])
    const [description, setDescription] = useState(null);
    const [billdata, setBillData] = useState(null);
    const [contactNumber, setContactNumber] = useState('')
    const ref = useRef();
    const [imageUri, setImageUri] = useState('');
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        async function fetchData() {
            // console.log("EntryDetail =>LineNo.43",navigation.getState())
            setIsLoading(true)
            await AsyncStorage.getItem('userData').then((UserData) => {
                let data = JSON.parse(UserData);
                // console.log(`data==>`, data);
                let attachment = data?.attachments;
                setUserEntryDetail(data)
                setDescription(data?.description)
                setBillData(data?.bill_detail)
                setContactNumber(data?.transaction_user_contact)
                setSelectedImage(attachment == null ? [] : attachment)
                let newDate = new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
                const changedDate = moment(new Date(data?.transaction_date)).format('DD MMM YY');
                setDate(changedDate + ',' + newDate);
            }).catch((err) => {
                // console.log(err)
            })
                .finally((resp) => {
                    setIsLoading(false)
                })
        }
        fetchData();
    }, [])

    function handleBackButtonClick() {
        // console.log("Entry Detail =>LineNo.67",navigation.getState())
        navigation.goBack()
        return true;
    }

  

    const shareThroughWhatsApp = () => {
        let myPromise = new Promise(function (myResolve, myReject) {
            const myUri = ref?.current?.capture()?.then(uri => {
                // setImageUri(uri);
                return uri;
            })

            myResolve(myUri); // when successful
            myReject();  // when error
        });
        myPromise.then(
            function (value) {
                console.log('value',value)
                const shareOptions = {
                    url: value,
                    message: description,
                    social: Share.Social.WHATSAPP,
                    whatsAppNumber: "91" + (contactNumber).replaceAll(" ", ""),
                };

                Share.shareSingle(shareOptions)
                    .then((res) => {
                        // console.log(res)
                    })
                    .catch((err) => { err && console.log(err); });
            },
            function (error) { /* code if some error */ }
        );
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButtonClick,
        );
        return () => backHandler.remove();
    }, []);

    const deleteParticularEntery = async () => {
        await postData(apiUrl.delete_transection + '?record_id=' + userEntryDetail?.id)
            .then((resp) => {
                // console.log('deleteParticularEntryresp',resp)
            })
            .catch((error) => {
                console.log(`deleteParticularEntryerror==>`, error)
            })
            .finally(() => {
                if (route?.params?.lastPage) {
                    navigation.navigate(route?.params?.lastPage)
                }
                else {
                    if (route?.params?.page == 1) {
                        navigation.navigate('PartiesUserTransection', { name: userEntryDetail?.transaction_user_name, phone: userEntryDetail?.transaction_user_contact })
                    }
                    else {
                        navigation.navigate('PartiesUserTransectionOldUser', { name: userEntryDetail?.transaction_user_name, phone: userEntryDetail?.transaction_user_contact })
                    }
                }
            })

    }

    const ImagePreviewSetUp = (ImageArray) => {
        // console.log("ImageArray",ImageArray)
        let tempArray = []
        for (let i = 0; i < ImageArray.length; i++) {
            tempArray.push({ uri: imageBase + ImageArray[i]?.attachments })
        }
        setBigSelectedImage(tempArray);

        setImagePreview(true)

    }

    if (isLoading) {
        return (
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
        )
    }
    return (

        imagePreview == true ?

            (
                <ImageView
                    images={bigSelectedImage}
                    imageIndex={0}
                    presentationStyle='pageSheet'
                    keyExtractor={(item) => item.uri}
                    visible={imagePreview}
                    onRequestClose={() => setImagePreview(false)}
                />)

            :
            <>
                <View style={[{ flex: 1 }]} >
                    <View style={[JAMAStyle.OuterView, JAMAStyle.flexColumn,]}>
                        <View style={[{ backgroundColor: JAMAColors.light_sky, }, JAMAStyle.pTen, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                            <TouchableOpacity
                                onPress={() => { handleBackButtonClick() }}
                                style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, { marginLeft: 8, marginBottom: 8 }]}>
                                <Icon name="angle-left" size={24} color={JAMAColors.white} />
                                <Text style={[JAMAStyle.ViewReportHeading]}>Entry Details</Text>
                            </TouchableOpacity>
                            <View style={[{ marginTop: 'auto', marginBottom: 'auto' }, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                <ViewShot
                                    options={{ fileName: 'ScreenShot' + new Date(), format: 'jpg', quality: 0.9 }}
                                    ref={ref}
                                //  style={{width:'100%',height:'100%'}}
                                >
                                    <View>
                                        <View style={[JAMAStyle.contactCard, { width: width * .9 }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.mLeftAuto, , JAMAStyle.mRightAuto, JAMAStyle.borderTopRadius, { paddingHorizontal: 5, paddingVertical: 4 }]} >
                                            <View style={[{ width: width * .15 }]}>
                                                <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, { width: 40, height: 40, borderRadius: 20, backgroundColor: JAMAColors.light_sky, }]}>
                                                    <Text style={[JAMAStyle.cardFirstLatter, { color: JAMAColors.white }]}>{userEntryDetail?.transaction_user_name?.charAt(0).toUpperCase()}</Text>
                                                </View>
                                            </View>
                                            <View style={[{ width: width * .4 }]}>
                                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.justifyContentCenter]}>
                                                    {userEntryDetail?.transaction_user_name.length > 35 ? (<Text style={[JAMAStyle.karigarName, { marginLeft: 3 }]}>{userEntryDetail?.transaction_user_name.substring(0, 34) + "..."}</Text>) :
                                                        (
                                                            <Text style={[JAMAStyle.karigarName, { marginLeft: 3 }]}>{userEntryDetail?.transaction_user_name}</Text>
                                                        )}
                                                    <Text style={[JAMAStyle.karigarTiming]}>{date}</Text>
                                                </View>
                                            </View>
                                            <View style={[{ width: width * .30 }]}>
                                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn,]}>

                                                    <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, { justifyContent: 'flex-end' }]}>
                                                        <Image
                                                            style={[JAMAStyle.goldbarCard]}
                                                            source={require('../Jamaassets/gold-ingots.png')}
                                                        />
                                                        <Text style={[JAMAStyle.EntryCardText, { color: userEntryDetail?.amount_received > userEntryDetail?.amount_sent ? JAMAColors.green : JAMAColors.danger }]}>
                                                            {
                                                                userEntryDetail?.amount_received == 0 ?
                                                                    ((Number.isInteger(userEntryDetail?.amount_sent)) ? (Math.round(userEntryDetail?.amount_sent) + 'gm') : ((userEntryDetail?.amount_sent)?.toFixed(3)) + 'gm') : ((Number.isInteger(userEntryDetail?.amount_received)) ? (Math.round(userEntryDetail?.amount_received) + 'gm') : ((userEntryDetail?.amount_received)?.toFixed(3)) + 'gm')

                                                            }
                                                        </Text>


                                                    </View>
                                                    <View style={[{ alignSelf: 'flex-end' }]}>
                                                        <Text style={[JAMAStyle.paytext, { color: JAMAColors.light_gry, fontFamily: 'Roboto-Regular' }]}>{userEntryDetail?.amount_received == 0 ? 'You Gave' : 'You Got'} </Text>
                                                    </View>

                                                </View>
                                            </View>
                                        </View>
                                        {billdata != null ?
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, JAMAStyle.contactCard, { width: width * .9 },]}>
                                                <View style={[{ width: width * .45 }, , JAMAStyle.dFlex, { justifyContent: 'flex-start' }, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { paddingHorizontal: 5, paddingVertical: 2 }]}>
                                                    <Text style={[JAMAStyle.dateText, { color: JAMAColors.light_gry }]}>Bill No.</Text>
                                                </View>
                                                <View style={[{ width: width * .40 }, JAMAStyle.dFlex, { justifyContent: 'flex-end' }, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { paddingHorizontal: 2, paddingVertical: 4 },]}>
                                                    <Text style={[{ fontFamily: 'Roboto-Regular', fontSize: responsiveFontSize(1.7), color: JAMAColors.black }]}>
                                                        {billdata}
                                                    </Text>
                                                </View>
                                            </View>
                                            : ''}
                                        {description != null ?
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, JAMAStyle.contactCard, { width: width * .9 },]}>
                                                <View style={[{ width: width * .45 }, , JAMAStyle.dFlex, { justifyContent: 'flex-start' }, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { paddingHorizontal: 5, paddingVertical: 2 }]}>
                                                    <Text style={[JAMAStyle.dateText, { color: JAMAColors.light_gry }]}>Details</Text>
                                                </View>
                                                <View style={[{ width: width * .40 }, JAMAStyle.dFlex, { justifyContent: 'flex-end' }, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { paddingHorizontal: 2, paddingVertical: 4 },]}>
                                                    <Text style={[{ fontFamily: 'Roboto-Regular', fontSize: responsiveFontSize(1.7), color: JAMAColors.black }]}>
                                                        {description}
                                                    </Text>
                                                </View>
                                            </View>
                                            : ''}
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, JAMAStyle.contactCard, { width: width * .9 },]}>
                                            <View style={[{ width: width * .45, justifyContent: 'flex-start', paddingHorizontal: 5, paddingVertical: 2 }, , JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                                <View>
                                                    <Text style={[JAMAStyle.dateText, { color: JAMAColors.light_gry }]}>Running Gold</Text>
                                                </View>
                                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, { marginHorizontal: 5 }]}>
                                                    {selectedImage.length > 0 && (
                                                        selectedImage.map((value, index) => {
                                                            return (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        ImagePreviewSetUp(selectedImage)
                                                                    }}
                                                                    key={index} style={{ width: 25, height: 25, margin: 5 }}>
                                                                    <Image
                                                                        style={{ width: 30, height: 30, resizeMode: 'contain' }}
                                                                        source={{ uri: imageBase + value?.attachments }}
                                                                    />
                                                                </TouchableOpacity>
                                                            )

                                                        }
                                                        )

                                                    )}
                                                </View>
                                            </View>
                                            <View style={[{ width: width * .40 }, JAMAStyle.dFlex, { justifyContent: 'flex-end' }, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { paddingHorizontal: 2, paddingVertical: 4 },]}>

                                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                                    <Text style={[JAMAStyle.goldBarAmountText, { fontSize: 16 }, { color: userEntryDetail?.running_type == 'expense' ? JAMAColors.danger : JAMAColors.green }]}>
                                                        <Image
                                                            style={[JAMAStyle.goldbar]}
                                                            source={require('../Jamaassets/gold-ingots.png')}
                                                        />
                                                        {(Number.isInteger(userEntryDetail?.running_balance)) ? (Math.round(userEntryDetail?.running_balance) + 'gm') : ((userEntryDetail?.running_balance)?.toFixed(3)) + 'gm'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, JAMAStyle.contactCard, { width: width * .9 },]}>
                                            <View style={[{ width: width * .45, justifyContent: 'flex-start', paddingHorizontal: 2, paddingVertical: 2 }, , JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                                <View>
                                                    <Text style={[JAMAStyle.dateText, { color: JAMAColors.light_gry }]}>Making Charges</Text>
                                                </View>
                                            </View>
                                            <View style={[{ width: width * .40 }, JAMAStyle.dFlex, { justifyContent: 'flex-end' }, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { paddingHorizontal: 2, paddingVertical: 4 },]}>

                                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                                    <Text style={[JAMAStyle.goldBarAmountText, { fontSize: 16 }, { color: JAMAColors.light_gry }]}>
                                                        ₹
                                                        {(Number.isInteger(userEntryDetail?.making_charges)) ? (Math.round(userEntryDetail?.making_charges)) : ((userEntryDetail?.making_charges)?.toFixed(3))}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ViewShot>
                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { width: width * .9 }, { backgroundColor: JAMAColors.white, }, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.borderBottomRadius]}>
                                    <Pressable
                                        onPress={() => {

                                            // AsyncStorage.setItem('lastPage', 'EntryDetails');
                                            userEntryDetail?.amount_received == 0 ? navigation.push('FillTransection', { color: JAMAColors.danger, lastPage: route?.key }) : navigation.push('FillTransection', { color: JAMAColors.green, lastPage: route?.key })
                                        }}
                                        style={[JAMAStyle.dFlex, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { paddingHorizontal: 5, paddingVertical: 5 },]}>
                                        <View style={[{ marginRight: 10 }]}>
                                            <Icon name='pen' size={16} color={JAMAColors.light_sky} />
                                        </View>
                                        <Text style={[{ fontSize: 15, color: JAMAColors.light_sky }]}>EDIT ENTRY</Text>
                                    </Pressable>
                                </View>
                            </View>

                        </View>
                        <View style={[{ flex: 1 }, JAMAStyle.positionRelative]} >
                            <Modal
                                style={[JAMAStyle.positionAbsolute]}
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalText}>
                                            Are you sure you want to delete this entry</Text>
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceAround, { paddingTop: 20 }]}>
                                            <View style={{ alignSelf: 'flex-start' }}>
                                                <Pressable
                                                    style={[styles.button, { backgroundColor: '#E8E8E8', }, { width: 91 }]}
                                                    onPress={() => setModalVisible(!modalVisible)}>
                                                    <Text style={styles.textStyle}>No</Text>
                                                </Pressable>
                                            </View>
                                            <View style={{ alignSelf: 'flex-end' }}>
                                                <Pressable

                                                    style={[styles.button, { backgroundColor: '#00BAE2', marginLeft: 10, width: 91 }]}
                                                    onPress={() => {
                                                        setModalVisible(!modalVisible),
                                                            deleteParticularEntery()
                                                    }}>
                                                    <Text style={styles.textStyle}>Yes</Text>
                                                </Pressable>
                                            </View>


                                        </View>

                                    </View>
                                </View>
                            </Modal>
                        </View>
                        <View style={[{ height: 60 }, JAMAStyle.footerBox, JAMAStyle.dFlex, JAMAStyle.flexRow]}>
                            <View style={[{ width: width * .45 }, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto,]}>
                                <TouchableOpacity

                                    onPress={() => setModalVisible(!modalVisible)}
                                    style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { borderRadius: 5, borderColor: JAMAColors.danger, borderWidth: 1, padding: 12, marginTop: 10 },]}
                                >
                                    <View style={[{ marginRight: 10 }]}>
                                        <Icon name='trash' size={20} color={JAMAColors.danger} />
                                    </View>
                                    <Text style={[{ fontSize: 15, color: JAMAColors.danger }]}>DELETE</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[{ width: width * .45 }, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto,]}>
                                <TouchableOpacity
                                    onPress={() => shareThroughWhatsApp()}
                                    style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { borderRadius: 5, borderColor: JAMAColors.light_sky, borderWidth: 1 }, { padding: 12 }, { marginTop: 10 }]}
                                >
                                    <View style={[{ marginRight: 10 }]}>
                                        <Icon name='share' size={20} color={JAMAColors.light_sky} />
                                    </View>
                                    <Text style={[{ fontSize: 15, color: JAMAColors.light_sky }]}>Share</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

            </>
    )

}
const styles = StyleSheet.create({
    centeredView: {
        width: 300,
        height: 130,
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 21,
    },
    modalView: {
        // display:'flex',
        backgroundColor: JAMAColors.white,
        borderRadius: 10,
        paddingVertical: 25,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 5,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        paddingVertical: 7,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: JAMAColors.black,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
    },
    modalText: {
        color: JAMAColors.black,
        // marginBottom: 15,
        lineHeight: 21,
        textAlign: 'center',
        fontSize: 20
    },
});

export default EntryDetails
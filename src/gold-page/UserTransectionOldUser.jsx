import { View, Text, Dimensions, Image, Pressable, TouchableOpacity, FlatList, BackHandler, Linking, SectionList, ImageBackground, Alert, } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import TransectionButton from '../SharedComponent/TransectionButton';
import UserNameHeader from '../SharedComponent/UserNameHeader';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import { JAMAColors } from '../Constants/JAMAColors';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { useNavigation } from '@react-navigation/native';
import { getData, postData } from '../Service/api-Service';
import { apiUrl, baseUrl, imageBase } from '../Constants/api-route';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ImageView from "react-native-image-viewing";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import { Modal } from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import { ActivityIndicator } from 'react-native-paper';

const UserTransectionOldUser = ({ route }) => {
    const dateSet = moment(new Date()).format('DD MMM YY');
    const width = Dimensions.get('window').width;
    const navigation = useNavigation();
    const [singleUserTransectionHistory, setSingleUserTransectionHistory] = useState([])
    const [totalHeaderData, setTotalHeaderData] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false)
    const [imagePreview, setImagePreview] = useState(false)
    const [selectedImage, setSelectedImage] = useState([])
    const ref = useRef();
    // const [imageUri, setImageUri] = useState('');
    var imageUri = "";
    const [reminderButtonStatus, setReminderButtonStatus] = useState(false);

    const [filterModal, setFilterModal] = useState(false);
    const [dataSortByFilter, setDataSortByFilter] = useState([
        { label: "Next Week", value: 'One', type: 'next_week', },
        { label: "Next Month", value: 'Two', type: 'next_month', },
        { label: "Calender", value: 'Three', type: 'today', },
    ]);
    // const [selectedDay, setSelectedDay] = useState('next_week')
    const [collectionDate, setCollectionDate] = useState('')
    const [openCalender, setOpenCalender] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [startShow, setStartShow] = useState(false);
    const [userPersonalData, setUserPersonalData] = useState(null)
    // const [dateForApi, setDateForApi] = useState(null)
    const [page, setPage] = useState('')
    const [activity, setActivity] = useState(false)
    // const [nextPageUrl, setNextPageUrl] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [arrayOfArrays, setArrayOfArrays] = useState([]);
    const [reminderId, setReminderId] = useState('');
    var dateForApi = '';
    var selectedDay = '';
    const [checkedColor, setCheckedColor] = useState('');

    const removeReminder = () => {
        const formData = new FormData;
        formData.append('reminder_id', reminderId)
        postData(apiUrl.removeReminder, formData).then((resp) => {
            // console.log(resp)
            Snackbar.show({
                text: `${resp?.data?.message}`,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: JAMAColors.light_sky,
            });
            setCollectionDate('');
            // setSelectedDay('');
            selectedDay = '';
            setCheckedColor(selectedDay);
            setOpenCalender(new Date())
        })
            .catch((err) => {
                // console.log("error ==> ", err);
            })
    }

    const onChange = (event, selectedDate) => {
        if (event.type == 'set') {
            const currentDate = selectedDate;
            let todayDate = new Date();
            if (todayDate.getDate() == currentDate.getDate()) {
                // setDateForApi(todayDate)
                setStartShow(false);
                setCollectionDate('Today')
                selectedDay = 'today';
                setCheckedColor(selectedDate);
                // console.log('todayDate ==> ', todayDate)
                dateForApi = todayDate;
                // console.log("DateFor Api ==> ", dateForApi);
                getSingleUserTransectionHistory('0');
            }
            else {
                setStartShow(false);
                setCollectionDate(moment(currentDate).format('DD MMM'))
                setOpenCalender(new Date(currentDate));
                dateForApi = currentDate;
                selectedDay = 'today';
                setCheckedColor(selectedDate);
                getSingleUserTransectionHistory('0');
            }
            reminderDataSet()

        }
        else {
            // console.log('qwertyu')
            setStartShow(false);
        }
    };

    const userpersonalDetail = async () => {
        await getData(apiUrl.get_profile)
            .then((resp) => {
                // console.log(resp)
                let data = resp['data']['data']
                // console.log(data)
                setUserPersonalData(data)
            }).
            catch((error) => {
                console.log(error)
            })
    }
    const showMode = (props) => {
        setMode('date')
        setStartShow(true);
    };
    const ImagePreviewSetUp = (ImageArray) => {
        let tempArray = []
        for (let i = 0; i < ImageArray.length; i++) {
            tempArray.push({ uri: imageBase + ImageArray[i]?.attachments })
        }
        setSelectedImage(tempArray);
        setImagePreview(true)

    }

    function AskForDeleteUser() {
        Alert.alert(
            'SHREE',
            'Do you wants to delete this customer',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Delete', onPress: () => deleteUser() },
            ],
            {
                cancelable: true,
            },
        );
    }
    async function deleteUser() {
        setIsLoading(true)
        await postData(apiUrl.deleteCustomer + `${'?transaction_user_name=' + encodeURIComponent(route?.params?.name) + '&transaction_user_contact=' + route?.params?.phone + '&transaction_mode=gold'}`)
            .then((resp) => {
                // console.log(resp)
                Snackbar.show({
                    text: `${resp?.data?.data}`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: JAMAColors.light_sky,
                });
                navigation.navigate('PartiesEnterpriseScreen')
            }).catch((error) => {

                Snackbar.show({
                    text: `Something wents wrong please try again later`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: JAMAColors.light_sky,
                });
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    function shareThroughWhatsApp() {
        // console.log("91" + (route?.params?.phone).replaceAll(" ", ""))
        const shareOptions = {
            url: imageUri,
            message: `Dear Sir/Madam, Your Payment of ${(totalHeaderData?.expense - totalHeaderData?.revenue)?.toFixed(4) + 'gm'
                } is pending at ${userPersonalData?.name}`,
            social: Share.Social.WHATSAPP,
            whatsAppNumber: "91" + (route?.params?.phone).replaceAll(" ", ""),
        };
        Share.shareSingle(shareOptions)
            // .then((res) => { console.log(res) })
            .catch((err) => { err && console.log(err); });
    }

    function ReminderPhoto() {

        ref?.current?.capture()?.then(uri => {
            imageUri = uri;
        })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setReminderButtonStatus(false)
                shareThroughWhatsApp();
            })
    }


    const CardList = ({ item }) => {
        // console.log("&&&item&&&",item)
        let attachment = item?.attachments;
        const navigation = useNavigation();
        const date = new Date(item?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
        const width = Dimensions.get('window').width;
        const height = Dimensions.get('window').height;
        const changedDate = moment(new Date(item?.transaction_date)).format('DD MMM YY');
        return (

            <TouchableOpacity
                onPress={() => {
                    (navigation.push(`EntryDetails`, { page: page }))
                    AsyncStorage.setItem(`userData`, JSON.stringify(item))
                }}
                style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentCenter, { marginVertical: 5 }]}>
                <View style={[{ width: responsiveWidth(45) }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexColumn, { padding: 9 }, JAMAStyle.borderLeftRadius]}>
                    <Text style={[JAMAStyle.cardDateText]}>{changedDate + ', ' + date}</Text>
                    {
                        item?.transaction_mode == 'gold' ? (
                            <View>
                                <View style={[{ backgroundColor: JAMAColors.light_silver, borderRadius: 5, paddingHorizontal: 15, paddingVertical: 3, marginVertical: 3 }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround]}>
                                    <Text style={[JAMAStyle.CardgoldValueText]}>Gold
                                    </Text>
                                    <Icon name='box' size={responsiveFontSize(1.4)} color={JAMAColors.light_gry} marginHorizontal={5} />
                                    <Text style={[JAMAStyle.CardgoldValueText]}>
                                        {
                                            ((Number.isInteger(item['running_balance'])) ? (Math.round(item['running_balance']) + 'gm') : ((item['running_balance'])?.toFixed(4) + 'gm'))
                                        }
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View style={[{
                                backgroundColor: JAMAColors.light_silver,
                                borderRadius: 5, paddingHorizontal: 15
                            }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround]}>

                                <Text style={[JAMAStyle.CardgoldValueText]}>Bal.
                                </Text>

                                <Text style={[JAMAStyle.CardgoldValueText]}>₹ 2500
                                </Text>
                            </View>
                        )}
                    {item?.bill_detail != null ?
                        <View style={[{ paddingHorizontal: 15, paddingVertical: 1, marginVertical: 3 }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround]}>
                            <Text style={[{
                                fontFamily: 'Roboto-Regular',
                                fontSize: responsiveFontSize(1.4),
                                color: JAMAColors.black
                            }]}>Bill No. {item?.bill_detail}
                            </Text>
                        </View>
                        : ''
                    }
                    {item?.making_charges != null ?
                        <View style={[{ paddingHorizontal: 5, paddingVertical: 1, marginVertical: 3 }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround]}>
                            <Text style={[{
                                fontFamily: 'Roboto-Regular',
                                fontSize: responsiveFontSize(1.4),
                                color: JAMAColors.black
                            }]}>Making Charges : ₹ {item?.making_charges}
                            </Text>
                        </View> : null
                    }
                    {item?.description != null ?
                        <View style={[{ paddingHorizontal: 15, paddingVertical: 1, marginVertical: 3 }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround]}>
                            <Text style={[{
                                fontFamily: 'Roboto-Regular',
                                fontSize: responsiveFontSize(1.4),
                                color: JAMAColors.black
                            }]}>{item?.description}
                            </Text>
                        </View> : ''
                    }
                    <View

                        style={[JAMAStyle.dFlex, JAMAStyle.flexRow]}>
                        {
                            attachment != null && (
                                attachment.map((value, index) => {
                                    return (
                                        <TouchableOpacity

                                            onPress={() => {
                                                ImagePreviewSetUp(attachment)
                                            }}
                                            key={index} style={{ width: 25, height: 25, marginHorizontal: 4 }}>
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
                {item?.transaction_mode == 'gold' ? (
                    <View style={[{ width: responsiveWidth(45) }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, JAMAStyle.borderRightRadius]}>
                        <View style={[{ width: '50%', height: '100%' }, JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'flex-start' }, JAMAStyle.flexRow, { backgroundColor: 'rgba(222, 0, 0, 0.24)' }, { paddingVertical: 20, paddingHorizontal: 5 }]}>
                            {item['amount_sent'] != 0 ? (
                                <>

                                    <Text style={[JAMAStyle.goldAmountText, { color: JAMAColors.danger }, { fontSize: responsiveFontSize(1.6) }, { textAlign: 'center' },]}>{((Number.isInteger(item['amount_sent'])) ? (Math.round(item['amount_sent']) + 'gm') : ((item['amount_sent'])?.toFixed(4) + 'gm'))}</Text>
                                </>
                            ) : (<></>)}
                        </View>

                        <View style={[{ width: '50%', height: '100%' }, JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'flex-end' }, JAMAStyle.flexRow, { backgroundColor: 'rgba(4, 118, 2, 0.22)' }, { paddingVertical: 20, paddingHorizontal: 5 }, JAMAStyle.borderRightRadius]}>
                            {item['amount_received'] != 0 ? (
                                <>
                                    <Text style={[JAMAStyle.goldAmountText, { color: JAMAColors.green }, { fontSize: 13 }, { textAlign: 'center' }]}>{((Number.isInteger(item['amount_received'])) ? (Math.round(item['amount_received']) + 'gm') : ((item['amount_received'])?.toFixed(4) + 'gm'))}</Text>
                                </>
                            ) : (<></>)}

                        </View>

                    </View>
                ) : (
                    <View style={[{ width: responsiveWidth(45) }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, JAMAStyle.borderRightRadius]}>
                    </View>
                )}

            </TouchableOpacity>
        )
    }

    const DateCard = ({ item }) => {
        const changedDate = moment(new Date(item)).format('DD MMM YY');
        const width = Dimensions.get('window').width;
        const height = Dimensions.get('window').height;
        return (
            <View
                style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentCenter, { marginTop: 1, marginBottom: 5 }]}>
                <View style={[{ width: responsiveWidth(35) }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexColumn, { padding: 3 }, { borderRadius: 15 }]}>
                    <Text style={[JAMAStyle.cardDateText]}>{changedDate}
                    </Text>
                </View>

            </View>
        )
    }

    function handleBackButtonClick() {
        // navigation.navigate('EnterpriseScreen')
        // console.log('Old User Line No.330',navigation.getState())

        // new requiremetn
        navigation.navigate('PartiesEnterpriseScreen')

        return true;
    }

    function selectReminderDate(item) {
        selectedDay = item.type;
        setCheckedColor(selectedDay);


        if (item.type == 'next_week') {
            var sevenDay = new Date();
            var dayAfterSeven = sevenDay.setDate(sevenDay.getDate() + 7);
            var checkNewDate = new Date(dayAfterSeven)
            console.log('checkNewDate ==> ', checkNewDate)
            dateForApi = checkNewDate;
            setCollectionDate(moment(checkNewDate).format('DD MMM'));
            reminderDataSet();
        }
        else {
            if (item.type == "next_month") {
                var now = new Date();
                if (now.getMonth() == 11) {
                    var current = new Date(now.getFullYear() + 1, 0, now.getDate());
                    console.log('current ==> ', current)
                    dateForApi = current;
                    setCollectionDate(moment(current).format('DD MMM'));
                    reminderDataSet();
                }
                else {
                    var current = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
                    console.log('current 1 ==> ', current)
                    dateForApi = current;
                    setCollectionDate(moment(current).format('DD MMM'));
                    reminderDataSet();
                }
            }
            else {
                showMode()
                console.log('item.type ==> ', item.type)
                // setSelectedDay(item.type)
                selectedDay = item.type;
                setCheckedColor(selectedDay);
            }
        }


    }
    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButtonClick,
        );
        return () => backHandler.remove();
    }, []);

    useEffect(() => navigation.addListener('focus', () => {
        // console.log("Old user LineNo.391",navigation.getState())
        getSingleUserTransectionHistory('0'); userpersonalDetail()
    }),
        []
    );

    const Skeleton = () => {
        return (
            <SkeletonPlaceholder  >
                <View style={{ flexDirection: 'row', width: '90%', marginTop: 20, marginEnd: 'auto', marginStart: 'auto' }}>
                    <View style={{ width: '50%', height: 50, marginTop: 3, marginLeft: 2 }}></View>
                    <View style={{ width: '50%', height: 50, marginTop: 3, marginLeft: 2 }}></View>
                </View>
            </SkeletonPlaceholder>

        );
    };

    const reminderDataSet = async () => {

        // console.log(dateForApi?.toISOString().substring(0, 10))
        const formData = new FormData();
        formData.append('transaction_mode', 'gold');
        formData.append('reminder_type', selectedDay);
        formData.append('reminder_date', moment(dateForApi).format('YYYY-MM-DD'));
        formData.append('transaction_user_contact', route?.params?.phone);
        formData.append('transaction_user_name', route?.params?.name);
        formData.append('running_balance', totalHeaderData?.expense > totalHeaderData?.revenue ? totalHeaderData?.expense - totalHeaderData?.revenue : '');
        await postData(apiUrl.reminder, formData)
            .then((resp) => {
                // console.log(resp)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {

            })
    }


    async function myAxiosMethod() {

        // if (nextPageUrl != null) {
        // console.log('currentPage',currentPage)
        if (currentPage != 0) {
            var existingIds = arrayOfArrays[currentPage];

            await getData(apiUrl.transection_history + '?' + `user_name=${encodeURIComponent(route?.params?.name)}&transaction_type=all&transaction_mode=parties&filter_type=DESC_date&report_duration=all&limit=10&offset=${currentPage}&existingIds=${existingIds}`).then((resp) => {
                // console.log('resp',resp);
                // console.log('nextPageResp', resp)

                const newModifiedDataTransectionHistory = resp?.data?.data.reduce((acc, obj) => {
                    const index = acc.findIndex(item => item.title === obj.transaction_date);

                    if (index === -1) {
                        acc.push({ title: obj.transaction_date, data: [obj] });
                    } else {
                        acc[index].data.push(obj);
                    }
                    return acc;
                }, []);


                // setSingleUserTransectionHistory([...singleUserTransectionHistory, ...newModifiedDataTransectionHistory])
                setActivity(false)

                // setNextPageUrl(resp?.data?.data?.next_page_url == null ? null : '')
                setCurrentPage(currentPage + 1);
                var merged = [...singleUserTransectionHistory, ...newModifiedDataTransectionHistory];
                setSingleUserTransectionHistory(merged)
            })
                .catch((err) => {
                    console.log(err)
                })
        }
        // else {
        //     setActivity(false)

        // }


    }

    const renderLoader = () => {
        return (
            activity == true ? (
                <ActivityIndicator size='large' color='#aaa' />
            ) : (
                <>

                </>
            )

        )
    }


    async function getSingleUserTransectionHistory(offsetValue) {
        setIsLoading(true)

        await AsyncStorage.removeItem('userData');

        await getData(apiUrl.transection_history + '?' + `user_name=${encodeURIComponent(route?.params?.name)}&transaction_type=all&transaction_mode=gold&filter_type=DESC_date&report_duration=all` + `&offset=${offsetValue} + &limit=10`)
            .then(resp => {
                setReminderId(resp?.data?.reminder_details?.id);
                let data = resp?.data?.data;
                setPage(data.length)
                setTotalHeaderData({ expense: resp?.data['expense_amount'], revenue: resp?.data['revenue_amount'] })
                setCollectionDate(resp?.data?.reminder_details == null ? '' : (moment(resp?.data?.reminder_details?.reminder_date).format('DD MMM')) == moment(new Date()).format('DD MMM') ? 'Today' : moment(resp?.data?.reminder_details?.reminder_date).format('DD MMM'));
                selectedDay = ((resp?.data?.reminder_details) == null ? '' : (resp?.data?.reminder_details?.reminder_type));
                setOpenCalender(resp?.data?.reminder_details == null ? new Date() : new Date(resp?.data?.reminder_details?.reminder_date));
                setCheckedColor(selectedDay);
                const newModifiedDataTransectionHistory = data?.reduce((acc, obj) => {
                    const index = acc.findIndex(item => item.title === obj.transaction_date);
                    if (index === -1) {
                        acc.push({ title: obj.transaction_date, data: [obj] });
                    } else {
                        acc[index].data.push(obj);
                    }
                    return acc;
                }, []);
                setSingleUserTransectionHistory(newModifiedDataTransectionHistory)
                setIsLoading(false)
                let originalArray = resp?.data['overall_ids'];
                let arrayOfArraysTemp = [];
                let subArraySize = 10;

                for (let i = 0; i < originalArray.length; i += subArraySize) {
                    const subArray = originalArray.slice(i, i + subArraySize);
                    arrayOfArraysTemp.push(subArray);
                }

                setCurrentPage(1);
                setArrayOfArrays(arrayOfArraysTemp);
                // setNextPageUrl(resp?.data?.data?.next_page_url == null ? null : '')
            })
            .catch(error => {
                console.log(error);
                Snackbar.show({
                    text: `Something wents wrong please try again later`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: JAMAColors.light_sky,
                });
            })
            .finally(() => {

            })

    }

    useEffect(() => {
        Data()
        async function Data() {
            if (await AsyncStorage.getItem('userData')) {
                await AsyncStorage.removeItem('userData')
            }
        }
    }, [])


    const checkUserHistoryType = async (item) => {
        // console.log("item => ", item)
        setIsLoading2(true);
        await getData(
            apiUrl.transaction_dashboard + '?' + `user_name=${item?.name}&transaction_mode=parties&transaction_type=all&filter_type=ASC_date&report_duration=all`)
            .then(resp => {
                // console.log("resp",resp)
                if (resp?.data?.data.length == 0) {
                    // setIsLoading(false);
                    navigation.navigate('PartiesUserTransection', {
                        name: item.name,
                        phone: item.phone,
                    })
                }
                else {
                    resp?.data?.data.find((val, ind) => {
                        if (val.transaction_user_name == item.name) {
                            // setIsLoading(false);
                            navigation.navigate('PartiesUserTransectionOldUser', {
                                name: item.name,
                                phone: item.phone,
                            });
                        }
                        else {
                            // setIsLoading(false);
                            navigation.navigate('PartiesUserTransection', {
                                name: item.name,
                                phone: item.phone,
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
                setIsLoading2(false)
            })
    }

    if (isLoading2) {
        return <View
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
    }

    return (
        reminderButtonStatus == true ?
            <ViewShot
                options={{ fileName: 'ScreenShot' + new Date(), format: 'jpg', quality: 0.9 }} ref={ref}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            >
                <View>
                    <View style={[JAMAStyle.justifyContentCenter, { width: width, height: 250, backgroundColor: JAMAColors.white }]}>
                        <Text style={{ color: JAMAColors.black, textAlign: 'center', fontSize: 15, paddingBottom: 5 }}>Payment Reminder For</Text>
                        <Text style={{ color: JAMAColors.danger, textAlign: 'center', fontSize: 25, paddingBottom: 5, width: width }}>

                            {totalHeaderData?.expense > totalHeaderData?.revenue &&
                                (

                                    ((Number.isInteger(totalHeaderData?.expense - totalHeaderData?.revenue)) ? (Math.round(totalHeaderData?.expense - totalHeaderData?.revenue) + 'gm') : ((totalHeaderData?.expense - totalHeaderData?.revenue)?.toFixed(4) + 'gm'))
                                )
                            }

                        </Text>
                        <Text style={{ color: JAMAColors.placeHolder_grey, textAlign: 'center', fontSize: 10, paddingBottom: 5 }}>on {dateSet}</Text>
                        <Text style={{ color: JAMAColors.black, textAlign: 'center', fontSize: 13, paddingTop: 15, paddingBottom: 5 }}>Sent By {userPersonalData?.name}</Text>
                        {/* <Text style={{ color: JAMAColors.placeHolder_grey, textAlign: 'center', fontSize: 10 }}>{userPersonalData?.email}</Text> */}
                    </View>
                </View>
            </ViewShot>
            :
            (
                imagePreview == true ?
                    (
                        <ImageView
                            images={selectedImage}
                            imageIndex={0}
                            presentationStyle='pageSheet'
                            keyExtractor={(item) => item.uri}
                            visible={imagePreview}
                            onRequestClose={() => setImagePreview(false)}
                        />

                    )

                    :
                    (<View style={[{ flex: 1 }]}>
                        <View style={[{ backgroundColor: JAMAColors.light_sky }]}>
                            <View style={[{ height: 55 }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, { width: '90%', marginHorizontal: 15 }]}>
                                <TouchableOpacity style={[JAMAStyle.dFlex, JAMAStyle.flexRow, { flex: 1, backgroundColor: JAMAColors.light_sky }, JAMAStyle.alignItemCenter, { flex: 1 }]} onPress={() => { navigation.navigate('PartiesEnterpriseScreen') }}>
                                    <View style={[JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'flex-end', marginRight: 10 }]}
                                    >
                                        <Icon name="angle-left" size={20} color={JAMAColors.white} />
                                    </View>
                                    <View style={[{ width: width * .11 }]}>
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.headerNameborderCircle, { backgroundColor: JAMAColors.white }]}>
                                            <Text style={[JAMAStyle.userHeaderFirstLatter, { color: JAMAColors.light_sky }]}>{route?.params?.name?.charAt(0).toUpperCase()}</Text>
                                        </View>
                                    </View>
                                    <View style={[{ width: width * .5 }]}>
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.justifyContentCenter, { marginTop: 3 }]}>
                                            {route?.params?.name?.length > 35 ?
                                                (<Text style={[JAMAStyle.userHeaderkarigarName, JAMAStyle.colorWhite]}>{route?.params?.name.substring(0, 34) + "..."}
                                                </Text>) :
                                                (<Text style={[JAMAStyle.userHeaderkarigarName, JAMAStyle.colorWhite]}>{route?.params?.name}
                                                </Text>)
                                            }
                                            <Text style={[JAMAStyle.userHeaderkarigarTiming, JAMAStyle.colorWhite]}>{route?.params?.phone}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    checkUserHistoryType(route?.params);
                                }} style={{ backgroundColor: JAMAColors.white, borderRadius: 5, padding: 4, width: 100, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: JAMAColors.light_sky, fontSize: 12, fontFamily: 'Roboto-Bold', textAlign: 'center' }}>
                                        IN RUPEE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {isLoading == false ? (
                                <View>
                                    <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginTop: 25, marginBottom: 15, }]}>
                                        <View style={[{ width: width * .45 }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, { justifyContent: 'flex-start' }, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { padding: 6 }, JAMAStyle.borderLeftRadius]}>
                                            <Text style={[JAMAStyle.dateText, { color: JAMAColors.black }, { fontFamily: 'Roboto-Bold' }]}>{((totalHeaderData?.expense - totalHeaderData?.revenue)?.toFixed(4) == 0) ? "Settled Up" : (totalHeaderData?.expense > totalHeaderData?.revenue ? 'You Will Get' : 'You Will Give')}</Text>
                                        </View>
                                        <View style={[{ width: width * .45 }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, { justifyContent: 'flex-end' }, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { padding: 6 }, JAMAStyle.borderRightRadius]}>
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                                <Text style={[JAMAStyle.goldBarAmountText, { color: ((totalHeaderData?.expense - totalHeaderData?.revenue)?.toFixed(4) == 0) ? JAMAColors.black : totalHeaderData?.expense > totalHeaderData?.revenue ? JAMAColors.danger : JAMAColors.green }]}>
                                                    <Image
                                                        style={[JAMAStyle.goldbar]}
                                                        source={require('../Jamaassets/gold-ingots.png')}
                                                    />
                                                    {(totalHeaderData?.expense)?.toFixed(4) == (totalHeaderData?.revenue)?.toFixed(4)
                                                        ? 0 + 'gm' :
                                                        totalHeaderData?.expense > totalHeaderData?.revenue ?
                                                            ((Number.isInteger(totalHeaderData?.expense - totalHeaderData?.revenue)) ? (Math.round(totalHeaderData?.expense - totalHeaderData?.revenue) + 'gm') : ((totalHeaderData?.expense - totalHeaderData?.revenue)?.toFixed(4) + 'gm')) : ((Number.isInteger(totalHeaderData?.revenue - totalHeaderData?.expense)) ? (Math.round(totalHeaderData?.revenue - totalHeaderData?.expense) + 'gm') : ((totalHeaderData?.revenue - totalHeaderData?.expense)?.toFixed(4) + 'gm'))}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    {totalHeaderData?.expense > totalHeaderData?.revenue && (
                                        <TouchableOpacity style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginBottom: 5, }]}
                                            onPress={() => { setFilterModal(!filterModal) }}>
                                            <View style={[{ width: width * .50, padding: 5, backgroundColor: JAMAColors.white, justifyContent: 'flex-start' }, JAMAStyle.dFlex, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, JAMAStyle.borderLeftRadius]}>
                                                <Icon name='id-badge' size={16} color={JAMAColors.light_sky} marginHorizontal={5} />
                                                {collectionDate == 'Today' ? <Text style={[{ color: JAMAColors.light_sky, fontSize: responsiveFontSize(1.7), fontFamily: 'Roboto-Regular', }]}> Payment is Due <Text style={[{ color: JAMAColors.danger, }]}>{collectionDate}</Text>  </Text> : (collectionDate == '' ? <Text style={[{ color: JAMAColors.light_sky, fontSize: responsiveFontSize(1.7), fontFamily: 'Roboto-Regular', }]}>Set collection reminder</Text> :
                                                    <Text style={[{ color: collectionDate == 'Today' ? JAMAColors.danger : JAMAColors.light_sky, fontSize: responsiveFontSize(1.7), fontFamily: 'Roboto-Regular', }]}>Collection Date : {collectionDate}</Text>)
                                                }

                                            </View>
                                            <View style={[{ width: width * .40, padding: 6, backgroundColor: JAMAColors.white, justifyContent: 'flex-end' }, JAMAStyle.dFlex, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, JAMAStyle.borderRightRadius]}>
                                                {collectionDate == '' ?
                                                    <Text style={[{ color: JAMAColors.light_sky, fontSize: responsiveFontSize(1.7), fontFamily: 'Roboto-Regular', }]}>SET DATE</Text>
                                                    : <></>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                </View>
                            ) : (
                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginTop: 25, marginBottom: 15 }]}>
                                    <SkeletonPlaceholder flexDirection="row" alignItems="center" justifyContent='center' borderRadius={10}>
                                        <SkeletonPlaceholder.Item width={300} height={43} />
                                    </SkeletonPlaceholder>

                                </View>
                            )}

                        </View>
                        <View style={[{ flex: 6 }]}>
                            {isLoading == false ?
                                (
                                    <View
                                        style={[{ backgroundColor: JAMAColors.white }, { borderColor: '#D9D9D9', borderBottomWidth: 1, flexDirection: 'row', width: width, justifyContent: 'space-between', alignItems: 'center', }]}>

                                        <View style={[JAMAStyle.dFlex, { width: width * .85, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginRight: 'auto', marginLeft: 'auto', paddingVertical: 10 }]} >

                                            <TouchableOpacity style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.justifyContentCenter, { alignItems: 'flex-start' }, { width: width * 0.25, }]}
                                                onPress={() => { navigation.navigate('ViewReport', { name: route?.params?.name, phone: route?.params?.phone }) }}>
                                                <Icon name='file-pdf' size={responsiveFontSize(1.9)} color={JAMAColors.light_sky} marginHorizontal={15} />
                                                <Text style={[{ color: JAMAColors.black, fontFamily: 'Roboto-Regular', fontSize: responsiveFontSize(1.6), marginTop: 5, marginLeft: 5 }]}>Report</Text>
                                            </TouchableOpacity>

                                            {totalHeaderData?.expense > totalHeaderData?.revenue &&
                                                (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setReminderButtonStatus(true),
                                                                setTimeout(() => {
                                                                    ReminderPhoto()
                                                                }, 1000);
                                                        }}
                                                        style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.justifyContentCenter, { alignItems: 'flex-start' }, { width: width * 0.30, }]} >
                                                        <View style={[JAMAStyle.flexColumn,]}
                                                        >
                                                            <Icon name='whatsapp' size={responsiveFontSize(1.9)} color={JAMAColors.light_sky} marginHorizontal={15} />
                                                        </View>
                                                        <Text style={[{ color: JAMAColors.black, fontFamily: 'Roboto-Regular', fontSize: responsiveFontSize(1.6), marginTop: 5, marginLeft: 5 }]}>Reminder</Text>
                                                    </TouchableOpacity>
                                                )}

                                            <TouchableOpacity
                                                onPress={() => {
                                                    AskForDeleteUser()
                                                }}
                                                style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: width * .25 }]} >
                                                <Icon name='trash' size={responsiveFontSize(1.9)} color={JAMAColors.light_sky} marginHorizontal={9} />
                                                <Text style={[{ color: JAMAColors.black, fontFamily: 'Roboto-Regular', fontSize: responsiveFontSize(1.6), marginTop: 5 }]}>Delete</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={{ width: width * .15, flexDirection: 'row', justifyContent: 'center' }}
                                                onPress={() => {
                                                    Linking.openURL(`tel:${route?.params?.phone}`)
                                                }}
                                            >
                                                <Icon name='phone' size={responsiveFontSize(4)} color={JAMAColors.green} />
                                            </TouchableOpacity>

                                        </View>
                                    </View>) : (

                                    <View style={[{ backgroundColor: JAMAColors.white }, { borderColor: '#D9D9D9', borderBottomWidth: 1, }]}>
                                        <SkeletonPlaceholder  >
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, , { paddingHorizontal: 15, paddingVertical: 10 }]}>
                                                <View style={{ flexDirection: 'column', }}>
                                                    <View style={{ width: 55, height: 20, borderRadius: 5 }}></View>
                                                    <View style={{ width: 55, height: 20, marginTop: 5, borderRadius: 5 }}></View>
                                                </View>
                                            </View>
                                        </SkeletonPlaceholder>
                                    </View>
                                )
                            }
                            <View style={[{ marginTop: 10 }]}>
                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { paddingVertical: 6 }]}>
                                    <View style={[{ width: width * .43 }, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                        <Text style={[{
                                            fontSize: 12,
                                            fontFamily: 'Roboto-Regular',
                                            color: JAMAColors.placeHolder_grey,
                                        }]}>ENTRIES</Text>

                                    </View>
                                    <View style={[{ width: width * .215 }, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                        <Text style={[{
                                            textAlign: 'right',
                                            fontFamily: 'Roboto-Regular',
                                            fontSize: 10, color: JAMAColors.placeHolder_grey,
                                        }]}>YOU GAVE</Text>

                                    </View>
                                    <View style={[{ width: width * .215 }, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                        <Text style={[{ textAlign: 'right', fontFamily: 'Roboto-Regular', fontSize: 10, color: JAMAColors.placeHolder_grey, }]}>YOU GOT</Text>
                                    </View>
                                </View>
                            </View>
                            {isLoading == false ?
                                (
                                    <SectionList
                                        sections={[...singleUserTransectionHistory]}
                                        keyExtractor={(item, index) => index}
                                        onEndReached={() => {
                                            setActivity(true),
                                                // console.log('myAxiosMethod end reached')
                                                myAxiosMethod()

                                        }}
                                        onEndReachedThreshold={3}
                                        ListFooterComponent={renderLoader}
                                        ListFooterComponentStyle={{ justifyContent: 'center', alignItems: 'center', width: "100%", height: 100 }}
                                        renderItem={({ item }) => (
                                            <CardList item={item} />
                                        )}
                                        renderSectionHeader={({ section: { title } }) => (
                                            <DateCard item={title} />
                                        )}
                                    />
                                ) : (
                                    <FlatList
                                        data={[1, 2]}
                                        renderItem={({ item }) =>
                                            <Skeleton />
                                        }
                                        keyExtractor={item => item}
                                    />
                                )
                            }

                        </View>
                        {startShow && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={openCalender}
                                mode={mode}
                                minimumDate={new Date()}
                                display='calendar'
                                dateFormat="dayofweek day month"
                                is24Hour={true}
                                onChange={onChange}
                            />
                        )}
                        <View style={[{ flex: 1 }, JAMAStyle.bgWhite, JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceAround, JAMAStyle.flexRow, JAMAStyle.alignItemCenter]}>
                            {isLoading == false ? (
                                <>

                                    <TouchableOpacity style={[{ width: width * .432 }, { backgroundColor: JAMAColors.danger }, { borderRadius: 5 }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow]}
                                        onPress={() => {
                                            navigation.push('FillTransection', {
                                                color: JAMAColors.danger, name: route.params.name,
                                                phone: route.params.phone,

                                            }

                                            )
                                        }}
                                    >
                                        <Text style={[{ padding: 11, color: JAMAColors.white, fontSize: 16, fontFamily: 'Roboto-Bold' }]}>YOU GAVE</Text>
                                        <Image
                                            style={{ justifyContent: 'center', alignSelf: 'center', tintColor: JAMAColors.white, width: 22, height: 22 }}
                                            source={require('../Jamaassets/goldimg.png')}
                                        />

                                    </TouchableOpacity>
                                    <TouchableOpacity style={[{ width: width * .432 }, { backgroundColor: JAMAColors.green }, { borderRadius: 5 }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow]}
                                        onPress={() => {
                                            navigation.push('FillTransection', {
                                                color: JAMAColors.green, name: route.params.name,
                                                phone: route.params.phone,
                                            })

                                        }}
                                    >
                                        <Text style={[{ padding: 11, color: JAMAColors.white, fontSize: 16, fontFamily: 'Roboto-Bold' }]}>YOU GOT</Text>
                                        <Image
                                            style={{ justifyContent: 'center', alignSelf: 'center', tintColor: JAMAColors.white, width: 22, height: 22 }}
                                            source={require('../Jamaassets/goldimg.png')}
                                        />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <SkeletonPlaceholder flexDirection='row'>
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceBetween, { width: '100%' }]}>
                                            <View style={{ width: '45%', height: 40, borderRadius: 5 }}></View>
                                            <View style={{ width: '45%', height: 40, borderRadius: 5 }}></View>
                                        </View>
                                    </SkeletonPlaceholder>
                                </>

                            )}

                        </View>
                        {filterModal &&
                            (totalHeaderData?.expense > totalHeaderData?.revenue && (<View style={[JAMAStyle.positionAbsolute, { bottom: 0, }]}>
                                <View
                                    style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: width }, { height: 200 }, { backgroundColor: JAMAColors.placeHolder_grey }, { alignSelf: 'center' }]}>
                                    <View style={{ width: width * .9, marginHorizontal: 15 }}>
                                        <Text style={[{ fontSize: 14, fontWeight: 'bold', color: JAMAColors.white, marginBottom: 10, marginTop: 10 }]}>Set due date For {route?.params?.name}</Text>
                                    </View>
                                    <View
                                    >
                                        <Modal
                                            style={[{ height: 150, bottom: 0 }, { marginHorizontal: 15 }, { backgroundColor: JAMAColors.white }, { borderRadius: 10 }, { padding: 10 }]}
                                            animationType="slide"
                                            transparent={true}
                                            visible={filterModal}
                                            onDismiss={() => { setFilterModal(!filterModal) }}
                                        >
                                            {
                                                dataSortByFilter.map((item, index) =>
                                                (
                                                    <TouchableOpacity
                                                        style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceBetween, { paddingVertical: 2 }]}
                                                        onPress={() => {
                                                            if (item.type == 'today') {
                                                                selectReminderDate(item)
                                                                setFilterModal(!filterModal)
                                                            }
                                                            else {
                                                                selectReminderDate(item)
                                                                setFilterModal(!filterModal)
                                                                getSingleUserTransectionHistory('0')
                                                            }
                                                        }}
                                                        key={index}
                                                    >
                                                        <Text style={[{
                                                            fontSize: 12, fontFamily: 'Roboto-Regular', fontWeight: 'bold',
                                                            color: JAMAColors.light_gry
                                                        }]}>
                                                            {item.label}
                                                        </Text>
                                                        <View style={{
                                                            width: 20, height: 20, borderRadius: 10, borderColor: JAMAColors.light_sky,
                                                            // backgroundColor: selectedDay == item.type ? JAMAColors.light_sky : JAMAColors.light_silver
                                                            backgroundColor: checkedColor == item.type ? JAMAColors.light_sky : JAMAColors.light_silver

                                                        }}>
                                                            <Image
                                                                style={[{
                                                                    width: 13, height: 13, padding: 8, resizeMode: 'contain',
                                                                    // tintColor: selectedDay == item.type ? JAMAColors.white : JAMAColors.light_silver,
                                                                    tintColor: checkedColor == item.type ? JAMAColors.white : JAMAColors.light_silver,
                                                                    alignSelf: 'center', justifyContent: 'center'
                                                                }]}
                                                                source={require('../Jamaassets/chec.png')}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                ))
                                            }
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: width * .8 }, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginTop: 10, borderRadius: 5, backgroundColor: JAMAColors.danger }]}>
                                                <TouchableOpacity style={[{ borderRadius: 5 }]}
                                                    onPress={() => {
                                                        setFilterModal(!filterModal),
                                                            removeReminder()
                                                    }}>
                                                    <Text style={[{ textAlign: 'center', padding: 10, color: JAMAColors.white, }]}>Remove</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </Modal>

                                    </View>

                                </View>
                            </View>))

                        }
                    </View>)
            )

    )
}

export default UserTransectionOldUser

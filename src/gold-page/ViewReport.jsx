import { Text, View, SafeAreaView, Image, TouchableOpacity, TextInput, ScrollView, FlatList, Dimensions, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Linking, Alert, StyleSheet, Pressable, Button, Modal, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import { JAMAColors } from '../Constants/JAMAColors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { getData } from '../Service/api-Service';
import { apiUrl, baseUrl } from '../Constants/api-route';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { BackHandler } from 'react-native';
import { RefreshControl } from 'react-native';
import Snackbar from 'react-native-snackbar';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';
import { ActivityIndicator } from 'react-native';
import moment from 'moment';


const ViewReport = ({ navigation, route }) => {
    // console.log("route",route)
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const [filterModal, setFilterModal] = useState(false);
    const [startingDate, setStartingDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [date, setDate] = useState(new Date());
    const [date1, setDate1] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [startShow, setStartShow] = useState(false);
    const [endShow, setEndShow] = useState(false);
    const [totalHeaderData, setTotalHeaderData] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [viewReportData, setViewReportData] = useState([]);
    const [userSearchData, setUserSearchData] = useState(null);
    const [url, setUrl] = useState(null);
    const [singleDayShow, setSingleDayShow] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isPdf, setIsPdf] = useState(false);
    const [currentPage,setCurrentPage] = useState(0)
    const [isApiLoading,setIsApiLoading] =useState(false)
    const [activity,setActivity]= useState(false)
    // const [nextPageUrl, setNextPageUrl] = useState('');
    const [saveUrl,setSaveUrl]=useState('')
    const [arrayOfArrays,setArrayOfArrays] = useState([]);
    let checkModal = 1;

    function handleBackButtonClick() {

        if (checkModal == 1) {
            setFilterModal(false)
            checkModal = 2;
            return true;
        }
        if (checkModal == 2) {
            checkModal = 1;
            navigation.goBack()
            return true;
        }
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackButtonClick,
        );
        return () => backHandler.remove();
    }, []);

    async function generatePdf() {
        if( viewReportData?.length != 0) {
            await getData(apiUrl.transection_history + '?' + saveUrl+'&generate_pdf=1')
                    .then((resp) => {
                        // console.log('resp',resp);
                        const { data } = resp;
                        setUrl(data?.pdf)
                        setModalVisible(!modalVisible)
                    })
                    .catch((error) => {
                        console.log(error);
                            Snackbar.show({
                                text: `Something wents wrong please try again later`,
                                duration: Snackbar.LENGTH_LONG,
                                backgroundColor: JAMAColors.light_sky,
                            });
                    })
                }
                else
                {
                    Alert.alert('No transactions available')
                }
        }

    async function myAxiosMethod() {
        // if (nextPageUrl != null) {
           
        if(currentPage!=0){
            var  existingIds = arrayOfArrays[currentPage];
            // console.log('currentPage',currentPage)
            // console.log(apiUrl.transection_history +'?'+saveUrl+`&offset=${currentPage}&existingIds=${existingIds}`);
            await getData(apiUrl.transection_history +'?'+saveUrl+`&offset=${currentPage}&existingIds=${existingIds}`).then((resp) => {
                // console.log(resp)
                setActivity(false)
                setCurrentPage(currentPage + 1);
                var merged = [...viewReportData, ...resp?.data?.data];
                setViewReportData(merged)
            //    console.log('merged',merged)
            //    setViewReportData([...viewReportData, ...resp?.data?.data?.data]);
            })
                .catch((err) => {
                    console.log(err)
                })
        }
        else{
            setActivity(false)
        }


    }
    function renderLoader(){
        return(
            activity && <ActivityIndicator  size='large' color={JAMAColors.light_sky}/>
        )
    }

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true)
        setIsLoading(true)
        // console.log('refreshing')
        let TodayDate = new Date();
        getuserTransectionReport(`${route?.params != undefined ? encodeURIComponent(route?.params?.name) : ''}`, `${checksortByFilter}`, '', TodayDate.toISOString().substring(0, 10))
    };
    useEffect(() => {
        // console.log(route?.params)
        if (route?.params != undefined) {
            if (startingDate == '' && endDate == '' && route?.params?.name != '') {
                let TodayDate = new Date()
                setIsLoading(true)
                getuserTransectionReport(encodeURIComponent(route?.params?.name), 'all', '', TodayDate.toISOString().substring(0, 10),'0')
            }
            else {
                if (startingDate != '' && endDate != '' && route?.params?.name != '') {
                    // console.log(`startDate!=''==>`, startingDate, `endDate!=''=>`, endDate)
                    setIsLoading(true)
                    getuserTransectionReport(encodeURIComponent(route?.params?.name), 'all', startingDate.toISOString().substring(0, 10), endDate.toISOString().substring(0, 10),'0')
                }
            }

        }
        else {

            if (startingDate == '' && endDate == '') {
                // console.log(`else startDate==''==>`, startingDate, `else endDate==''=>`, endDate)
                let TodayDate = new Date()
                setIsLoading(true)
                getuserTransectionReport('', 'all', '', TodayDate.toISOString().substring(0, 10),'0')
            }
            else {
                if (startingDate != '' && endDate != '') {
                    setIsLoading(true)
                    // console.log(` else startDate !=''==>`, startingDate, `endDate!=''=>`, endDate)
                    getuserTransectionReport('', 'all', startingDate.toISOString().substring(0, 10), endDate.toISOString().substring(0, 10),'0')
                }
            }
        }
    }, [startingDate, endDate]);

    const [dataSortByFilter, setDataSortByFilter] = useState([
        { label: "All", value: 'One', type: 'allData', },
        { label: "This Month", value: 'Two', type: 'current_month', },
        { label: "Single Day", value: 'Three', type: 'today', },
        { label: "Last Week", value: 'Four', type: 'last_week', },
        { label: "Last Month", value: 'Five', type: 'last_month', }]);

    const lastWeekData = () => {
            var prevSaturday = new Date();
            prevSaturday.setDate(prevSaturday.getDate() - 7);
            prevSaturday.setDate(prevSaturday.getDate() - (prevSaturday.getDay() + 7) % 7);
            // console.log("%$$%$%",prevSaturday);
    
            var prevSunday = new Date();
            prevSunday.setDate(prevSunday.getDate() - 3);
            prevSunday.setDate(prevSunday.getDate() - (prevSunday.getDay() + 1) % 7);
            // console.log('#$#$#$$#$',prevSunday);
            setStartingDate(prevSaturday);
            setEndDate(prevSunday);
            setIsLoading(true)
            getuserTransectionReport(`${route?.params != undefined ? encodeURIComponent(route?.params?.name) : ''}`, 'all', prevSaturday.toISOString().substring(0, 10), prevSunday.toISOString().substring(0, 10),'0');
        }


      const generateSharePdf=(url)=>{
        // setIsLoading(true)
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            if (this.status == 200) {
                var blob = this.response;
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function () {
                    var base64data = reader.result.split(';')[1];
                    // console.log('data:image/jpeg;', base64data)
                    const shareOptions = {
                        url: `data:application/pdf;${base64data}`,
                        message: '',
                        social: Share.Social.WHATSAPP,
                        filename: 'TransectionData',
                        whatsAppNumber: "91" + (route?.params?.phone).replaceAll(" ", ""),
                    };
                    Share.shareSingle(shareOptions)
                        .then((res) => { setIsLoading(false) })
                        .catch((err) => { err && console.log(err); });
                }
                // do something with the blob here...
            }
            else {
                setIsLoading(false)
            }
        };
        xhr.send();
      }

    const shareWhatsApp=async()=> {
        await getData(apiUrl.transection_history + '?' + saveUrl+'&generate_pdf=1')
        .then((resp) => {
            // console.log('resp',resp);
            // const { data } = resp;
            generateSharePdf(resp?.data?.pdf)
        })
        .catch((error) => {
            console.log(error);
                Snackbar.show({
                    text: `Something wents wrong please try again later`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: JAMAColors.light_sky,
                });
        })

            // setIsLoading(true)
            // var xhr = new XMLHttpRequest();
            // xhr.open('GET', url, true);
            // xhr.responseType = 'blob';
            // xhr.onload = function (e) {
            //     if (this.status == 200) {
            //         var blob = this.response;
            //         var reader = new FileReader();
            //         reader.readAsDataURL(blob);
            //         reader.onloadend = function () {
            //             var base64data = reader.result.split(';')[1];
            //             // console.log('data:image/jpeg;', base64data)
            //             const shareOptions = {
            //                 url: `data:application/pdf;${base64data}`,
            //                 message: '',
            //                 social: Share.Social.WHATSAPP,
            //                 filename: 'TransectionData',
            //                 whatsAppNumber: "91" + (route?.params?.phone).replaceAll(" ", ""),
            //             };
            //             Share.shareSingle(shareOptions)
            //                 .then((res) => { setIsLoading(false) })
            //                 .catch((err) => { err && console.log(err); });
            //         }
            //         // do something with the blob here...
            //     }
            //     else {
            //         setIsLoading(false)
            //     }
            // };
            // xhr.send();
        }
    const lastMonthData = () => {

            var today = new Date();
    
            let startDate = new Date();
            var last_month = new Date(today.setMonth(today.getMonth() - 1));
    
            // console.log( startDate.toISOString().substring(0, 10),last_month.toISOString().substring(0, 10))
            setIsLoading(true)
            getuserTransectionReport(`${route?.params != undefined ? encodeURIComponent(route?.params?.name) : ''}`, 'all', moment(new Date(last_month)).format('YYYY-MM-DD'), moment(new Date(startDate)).format('YYYY-MM-DD'),'0');
    
            setStartingDate(last_month);
    
            setEndDate(startDate);
        }
    
    const currentMonthData = () => {

            let startDate = new Date();
    
            var firstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            var lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            setIsLoading(true)
            getuserTransectionReport(`${route?.params != undefined ? encodeURIComponent(route?.params?.name) : ''}`, 'all',  moment(new Date(firstDay)).format('YYYY-MM-DD'),  moment(new Date(lastDay)).format('YYYY-MM-DD'),'0');
            setStartingDate(firstDay);
    
            setEndDate(lastDay);
        }

    const CardList = ({ item }) => {
        // console.log("item",item?.transaction_user_name);
        const navigation = useNavigation();
        const checkDateOfTransection = (value) => {
            const mydate = new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()
            return mydate
        }
        const changedDated = (value) => {
            const dateShow = new Date(value).toUTCString().toString().slice(5, 16)
            const dateFormat = new Date(value).toUTCString().toString().slice(5, 12);
            const mydate = (dateFormat + dateShow.substring(dateShow.length - 2));
            return mydate;
        }
        return (
            <TouchableOpacity
                onPress={() => {
                    AsyncStorage.setItem(`userData`, JSON.stringify(item))
                    navigation.navigate(`EntryDetails`, { page: viewReportData?.length,lastPage:route?.name})
                }}
                style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentCenter, { marginTop: 1, marginBottom: 5 }]} key={(item?.transaction_user_contact + item?.id).toString()}>
                <View style={[{ width: responsiveWidth(45) }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexColumn, { padding: 9 }, JAMAStyle.borderLeftRadius]}>
                    <Text style={[JAMAStyle.cardDateText]}>
                        {item?.['transaction_user_name']}
                    </Text>
                    <Text style={[{ fontSize: responsiveFontSize(1.6), color: JAMAColors.placeHolder_grey }]}>
                        {changedDated(item?.['transaction_date']) + ',' + checkDateOfTransection(item?.['created_at'])}
                    </Text>
                    {item?.bill_detail != null ?
                        <Text style={[{ fontSize: responsiveFontSize(1.6), color: JAMAColors.placeHolder_grey }]}>
                            Bill No. {item?.bill_detail}
                        </Text>
                        : ''}
                    {item?.description ?
                        <Text style={[{ fontSize: responsiveFontSize(1.6), color: JAMAColors.placeHolder_grey }]}>{item?.description}</Text>
                        : ''}
                </View>

                <View style={[{ width: responsiveWidth(45) }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, JAMAStyle.borderRightRadius]}>
                    <View style={[{ width: '50%', height: '100%' }, JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'flex-start' }, JAMAStyle.flexRow, { backgroundColor: 'rgba(222, 0, 0, 0.24)' }, { paddingVertical: 20, paddingHorizontal: 5 }]}>
                        {item?.['amount_sent'] != 0 ? (
                            <>
                                {/* <Image
                                  style={[{width:responsiveWidth(4.6),height:responsiveWidth(4.6)}]}
                                  source={require('../Jamaassets/gold-ingots.png')}
                              /> */}
                                <Text style={[JAMAStyle.goldAmountText, { color: JAMAColors.danger }, { fontSize: responsiveFontSize(1.7) }, { textAlign: 'right' },]}>
                                    {((Number.isInteger(item?.['amount_sent'])) ? (Math.round(item?.['amount_sent']) + 'gm') : ((item?.['amount_sent'])?.toFixed(3) + 'gm'))}
                                </Text>
                            </>
                        ) : (<></>)}
                    </View>

                    <View style={[{ width: '50%', height: '100%' }, JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'flex-end' }, JAMAStyle.flexRow, { backgroundColor: 'rgba(4, 118, 2, 0.22)' }, { paddingVertical: 20, paddingHorizontal: 5 }, JAMAStyle.borderRightRadius]}>
                        {item?.['amount_received'] != 0 ? (
                            <>
                                {/* <Image
                          style={[{width:responsiveWidth(4.6),height:responsiveWidth(4.6)}]}
                          source={require('../Jamaassets/gold-ingots.png')}
                          /> */}
                                <Text style={[JAMAStyle.goldAmountText, { color: JAMAColors.green }, { fontSize: 13 }, { textAlign: 'center' }]}>
                                    {((Number.isInteger(item?.['amount_received'])) ? (Math.round(item?.['amount_received']) + 'gm') : ((item?.['amount_received'])?.toFixed(3) + 'gm'))}
                                </Text>
                            </>
                        ) : (<></>)}

                    </View>

                </View>


            </TouchableOpacity>
        )
    }


    

    
   

  
    

    const [checksortByFilter, setCheckSortByFilter] = useState('all')


    async function getuserTransectionReport(userName, reportDuration, startDate, lastDate,offsetValue) {
        // console.log('nowApiRunning')
        if (reportDuration == 'today') {
            showMode('SingleDay')
        }
        if (reportDuration == 'last_week') {
            lastWeekData()
        }
        if (reportDuration == 'last_month') {
            lastMonthData()
        }
        if (reportDuration == 'allData') {
            // allData()
            reportDuration = 'all'
            // console.log('reportDuration',reportDuration)
            setStartingDate('');
            setEndDate('');
        }
        if (reportDuration == 'current_month') {
            currentMonthData()
        }
        else {
            // setIsLoading(true)
            let newUrl = startDate == '' ? `user_name=${userName}&transaction_type=all&transaction_mode=gold&filter_type=DESC_date&report_duration=${reportDuration}&start_date=1200-01-01&end_date=${lastDate}&limit=10` : `user_name=${userName}&transaction_type=all&transaction_mode=gold&filter_type=DESC_date&report_duration=${reportDuration}&start_date=${startDate}&end_date=${lastDate}&limit=10`
            setIsApiLoading(true)
            await getData(apiUrl.transection_history + '?' + newUrl+`&offset=${offsetValue}`)
                .then((resp) => {
                    const { data } = resp;
                    // console.log('data',data)
                    setViewReportData(resp?.data?.data);
                    setIsApiLoading(false)
                    setIsLoading(false);
                    setRefreshing(false);
                    setTotalHeaderData({ expense: data?.expense_amount, revenue: data?.revenue_amount,total:data?.count});
                    setUserSearchData(resp?.data?.data);
                    // setUrl(data?.pdf);
                    // // setNewBaseUrl(data?.base_url);
                    setSaveUrl(newUrl);

                    let originalArray =  data['overall_ids'];
                    let arrayOfArraysTemp = [];
                    let subArraySize = 10;
    
                    for (let i = 0; i < originalArray.length; i += subArraySize) {
                        const subArray = originalArray.slice(i, i + subArraySize);
                        arrayOfArraysTemp.push(subArray);
                      }
    
                    setCurrentPage(1);
                    setArrayOfArrays(arrayOfArraysTemp);                   
                })
                .catch((error) => {
                    console.log(error);
                        Snackbar.show({
                            text: `Something wents wrong please try again later`,
                            duration: Snackbar.LENGTH_LONG,
                            backgroundColor: JAMAColors.light_sky,
                        });
                })
                .finally(() => {
                });

        }

    }

    const onChange = (event, selectedDate) => {
        if (event.type == 'set') {
            const currentDate = selectedDate;
            setStartShow(false);
            setStartingDate(currentDate);
            setDate(currentDate);
            if (endDate == '') {
                Alert.alert('Please Select End Date')
            }
        }
        else {
            setStartShow(false);
        }

    };

    const onChange1 = (event, selectedDate) => {
        if (event.type == 'set') {
            const currentDate = selectedDate;
            setEndShow(false);
            setEndDate(currentDate);
            setDate1(currentDate);
        }
        else {
            setEndShow(false);
        }
    };

    const onChange2 = (event, selectedDate) => {

        if (event.type == 'set') {
            const currentDate = selectedDate;
            setSingleDayShow(false);
            let TodayDate = new Date(currentDate)
            //   console.log(TodayDate.toISOString().substring(0,10))
            setStartingDate(TodayDate)
            setEndDate(TodayDate)
            getuserTransectionReport(`${route?.params != undefined ? encodeURIComponent(route?.params?.name) : ''}`, `all`,moment(new Date(TodayDate)).format('YYYY-MM-DD'),moment(new Date(TodayDate)).format('YYYY-MM-DD'),'0')
        }
        else {
            setSingleDayShow(false);
        }
    };

    const showMode = (props) => {
        setMode('date')
        if (props == 'StartDate') {
            setStartShow(true);
        }
        if (props == 'EndDate') {
            setEndShow(true)
        }
        if (props == 'SingleDay') {
            setSingleDayShow(true)
        }
    };



    const searchFilterFunction = (value) => {
        let TodayDate = new Date();
        // const excludeColumns = ["updated_at", "transaction_type", 'transaction_metrics', 'attachments', 'description', 'id', 'running_type', 'transaction_date', 'transaction_mode', 'transaction_user_contact', 'user_id', 'created_at'];

        const lowercasedValue = value.toLowerCase().trim();
        if (lowercasedValue === "") {
            // setViewReportData(userSearchData);
            getuserTransectionReport('','all','', TodayDate.toISOString().substring(0, 10),'0')
        }
        else {
            if(value?.length > 2){
                // console.log('value',value)
                getuserTransectionReport(value,`${checksortByFilter}`,'', TodayDate.toISOString().substring(0, 10),'0')
            }
        }
    };

    const Skeleton = () => {
        return (
            <SkeletonPlaceholder  >
                <View style={{ flexDirection: 'row', width: '90%', marginLeft: 'auto', marginRight: 'auto', marginTop: 10, borderRadius: 3 }}>
                    <View style={{ flexDirection: 'column', width: '50%', height: 50 }}>
                    </View>
                    <View style={{ flexDirection: 'column', width: '50%', height: 50 }}>
                    </View>
                </View>
            </SkeletonPlaceholder>
        );
    };


    return (
        isPdf == false ? (
            <KeyboardAvoidingView style={[{ width: width, height: height }, JAMAStyle.positionRelative]} >
                {singleDayShow && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date2}
                        mode={mode}
                        display='calendar'
                        dateFormat="dayofweek day month"
                        is24Hour={true}
                        onChange={onChange2}
                    />
                )}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={[JAMAStyle.OuterView, JAMAStyle.flexColumn]}>
                        <View style={[{ flex: 1.5, backgroundColor: JAMAColors.light_sky, }, JAMAStyle.alignItemCenter, JAMAStyle.pTen, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>

                            <TouchableOpacity style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, { width: responsiveWidth(90) }]} 
                            // onPress={() => { navigation.navigate('EnterpriseScreen') }}
                            onPress={() => { navigation.goBack()}}
                            >
                                <Icon name="angle-left" size={responsiveFontSize(2.6)} color={JAMAColors.white} />
                                <Text style={[JAMAStyle.ViewReportHeading]}>View Report</Text>
                            </TouchableOpacity>
                            {isLoading != true ?
                                (
                                    <>
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { alignItems: 'stretch' }]}>

                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentCenter, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginBottom: 15, marginTop: 10 }, { width: responsiveWidth(90) }]}>
                                                <TouchableOpacity style={[{ width: responsiveWidth(45), height: responsiveHeight(5.6) }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { padding: 0 }, JAMAStyle.borderLeftRadius]}
                                                    onPress={() => { showMode('StartDate') }}
                                                >
                                                    <Icon name='calendar-day' marginRight={10} size={responsiveFontSize(2.6)} color={JAMAColors.light_sky} />
                                                    <Text style={[JAMAStyle.dateText]}>
                                                        {startingDate == '' ? 'START DATE' : startingDate?.toLocaleString().split(',')[0]}
                                                        {/* START DATE */}
                                                    </Text>
                                                    {startShow && (
                                                        <DateTimePicker
                                                            testID="dateTimePicker"
                                                            value={date}
                                                            mode={mode}
                                                            maximumDate={endDate == '' ? new Date() : new Date(endDate)}
                                                            display='calendar'
                                                            dateFormat="dayofweek day month"
                                                            is24Hour={true}
                                                            onChange={onChange}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                                <View style={[{ borderColor: '#D9D9D9', borderLeftWidth: .5, opacity: 1 }]}></View>
                                                <TouchableOpacity style={[{ width: responsiveWidth(45), height: responsiveHeight(5.6) }, { backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { padding: 0 }, JAMAStyle.borderRightRadius]}
                                                    onPress={() => { showMode('EndDate') }}
                                                >
                                                    <Icon name='calendar-day' marginRight={10} size={responsiveFontSize(2.6)} color={JAMAColors.light_sky} />
                                                    <Text style={[JAMAStyle.dateText]}>
                                                        {endDate == '' ? 'END DATE' : endDate?.toLocaleString().split(',')[0]}

                                                    </Text>
                                                    {endShow && (
                                                        <DateTimePicker
                                                            testID="dateTimePicker"
                                                            value={date1}
                                                            mode={mode}
                                                            minimumDate={startingDate == '' ? new Date() : new Date(startingDate)}
                                                            maximumDate={new Date()}
                                                            display='calendar'
                                                            dateFormat="dayofweek day month"
                                                            is24Hour={true}
                                                            onChange={onChange1}
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentCenter, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginBottom: 15 }, { width: responsiveWidth(90) }]}>
                                                <View
                                                    style={[JAMAStyle.dFlex, JAMAStyle.flexRow, { alignContent: 'center', justifyContent: 'center' }]}
                                                >
                                                    <View style={[{ backgroundColor: JAMAColors.white, paddingHorizontal: 10, paddingVertical: 10, height: responsiveHeight(5.6), width: responsiveWidth(12) }, JAMAStyle.borderLeftRadius]}>
                                                        <Icon name='search' size={17} color={JAMAColors.light_sky} />
                                                    </View>
                                                    <View style={[{ backgroundColor: JAMAColors.white, height: responsiveHeight(5.6) }]}>
                                                        <TextInput
                                                            style={[JAMAStyle.enterEntriesInput, { width: responsiveWidth(40), backgroundColor: JAMAColors.white },]}
                                                            placeholder='Search Entries'
                                                            placeholderTextColor={JAMAColors.placeHolder_grey}
                                                            onFocus={()=>setFilterModal(false)}
                                                            onChangeText={(text) => {setFilterModal(false),searchFilterFunction(text)}}
                                                        />

                                                    </View>
                                                    <TouchableOpacity style={[{ backgroundColor: JAMAColors.white, padding: 9, width: responsiveWidth(38), opacity: .85, height: responsiveHeight(5.6) }, JAMAStyle.borderRightRadius, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround]}
                                                        onPress={() => { Keyboard.dismiss(),setFilterModal(!filterModal) }}
                                                    >

                                                        <Text style={[JAMAStyle.dateText, { width: '100%', textAlign: 'center' }]}>
                                                            {checksortByFilter == 'last_month' ? 'Last Month' : checksortByFilter == 'current_month' ? 'This Month' : checksortByFilter == 'today' ? 'Single Day' : checksortByFilter == 'last_week' ? 'Last Week' : 'All'}
                                                        </Text>
                                                        <Icon name='angle-down' size={responsiveFontSize(2.6)} color={JAMAColors.light_sky} />
                                                    </TouchableOpacity>

                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <SkeletonPlaceholder  >
                                            <View style={{ flexDirection: 'row', width: '98%', height: 40, borderRadius: 5, marginTop: 5 }}>

                                                <View style={{ width: '50%' }}>

                                                </View>
                                                <View style={{ width: '50%', }}>

                                                </View>
                                            </View>
                                            <View style={{ flexDirection: 'row', width: '98%', height: 40, borderRadius: 5, marginTop: 10 }}>

                                                <View style={{ width: '75%' }}>

                                                </View>
                                                <View style={{ width: '25%', }}>

                                                </View>
                                            </View>
                                        </SkeletonPlaceholder>
                                    </>
                                )
                            }

                        </View>
                        <View style={[{ flex: 4 }]}>
                            {isLoading != true ?
                                (
                                    <>
                                        <View style={[{ backgroundColor: JAMAColors.white }, { borderColor: '#D9D9D9', borderBottomWidth: 1, }]}>
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceBetween, , JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { paddingVertical: 10 },]}>
                                                <View style={[{ width: responsiveWidth(45) }]}>
                                                    <Text style={[{ fontSize: responsiveFontSize(2), fontWeight: 'bold', color: JAMAColors.black }]}>Net Gold</Text>
                                                </View>
                                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: responsiveWidth(45) }]}>
                                                    <View style={[JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'flex-end' }, JAMAStyle.flexRow]}>
                                                        <Image
                                                            style={[JAMAStyle.goldbarNext]}
                                                            source={require('../Jamaassets/gold-ingots.png')}
                                                        />
                                                        <Text style={[JAMAStyle.goldAmountText, { color: totalHeaderData?.expense > totalHeaderData?.revenue ? JAMAColors.danger : JAMAColors.green }]}>{totalHeaderData?.expense > totalHeaderData?.revenue ?
                                                            ((Number.isInteger(totalHeaderData?.expense - totalHeaderData?.revenue)) ? (Math.round(totalHeaderData?.expense - totalHeaderData?.revenue) + 'gm') : ((totalHeaderData?.expense - totalHeaderData?.revenue)?.toFixed(3) + 'gm')) : ((Number.isInteger(totalHeaderData?.revenue - totalHeaderData?.expense)) ? (Math.round(totalHeaderData?.revenue - totalHeaderData?.expense) + 'gm') : ((totalHeaderData?.revenue - totalHeaderData?.expense)?.toFixed(3) + 'gm'))}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) :
                                (
                                    <>
                                        <SkeletonPlaceholder>

                                            <View style={[{ backgroundColor: JAMAColors.white }]}>
                                                <View style={{ flexDirection: 'row', width: '90%', height: 40, borderRadius: 5, marginTop: 1, marginBottom: 1, marginLeft: 'auto', marginRight: 'auto' }}>

                                                    <View style={{ width: '80%' }}>

                                                    </View>
                                                    <View style={{ width: '20%', }}>

                                                    </View>
                                                </View>
                                            </View>

                                        </SkeletonPlaceholder>
                                    </>
                                )
                            }
                            {isLoading != true ?
                                (
                                    <>
                                        <View style={[{ backgroundColor: JAMAColors.white }, { borderColor: '#D9D9D9', borderBottomWidth: 1, marginBottom: 5 }]}>
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { paddingVertical: 6 }]}>
                                                <View style={[{ width: responsiveWidth(45) }, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                                    <Text style={[{ fontSize: responsiveFontSize(1.2), color: JAMAColors.placeHolder_grey, marginBottom: 4 }]}>TOTAL</Text>
                                                    <Text style={[{ fontSize: 14, color: JAMAColors.black }]}>{totalHeaderData?.total}Entries</Text>
                                                </View>
                                                <View style={[{ width: responsiveWidth(22.5) }, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                                    <Text style={[{ textAlign: 'center', fontSize: responsiveFontSize(1.2), color: JAMAColors.placeHolder_grey, marginBottom: 4 }]}>YOU GAVE</Text>
                                                    <View style={[JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'center' }, JAMAStyle.flexRow]}>
                                                        {/* <Image
                                            style={[{ width: 16, height: 16 }]}
                                            source={require('../Jamaassets/gold-ingots.png')}
                                        /> */}
                                                        <Text style={[JAMAStyle.goldAmountText, { color: JAMAColors.danger }, { fontSize: 13 }, { textAlign: 'center' }]}>
                                                            {((Number.isInteger(totalHeaderData?.expense)) ? (Math.round(totalHeaderData?.expense)) : (totalHeaderData?.expense)?.toFixed(3)) + 'gm'}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={[{ width: responsiveWidth(22.5) }, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                                    <Text style={[{ textAlign: 'center', fontSize: responsiveFontSize(1.2), color: JAMAColors.placeHolder_grey, marginBottom: 4 }]}>YOU GOT</Text>
                                                    <View style={[JAMAStyle.dFlex, JAMAStyle.alignItemCenter, { justifyContent: 'center' }, JAMAStyle.flexRow]}>
                                                        {/* <Image
                                            style={[{ width: 16, height: 16 }]}
                                            source={require('../Jamaassets/gold-ingots.png')}
                                        /> */}
                                                        <Text style={[JAMAStyle.goldAmountText, { color: JAMAColors.green }, { fontSize: 13 }, { textAlign: 'center' }]}>
                                                            {((Number.isInteger(totalHeaderData?.revenue)) ? (Math.round(totalHeaderData?.revenue)) : (totalHeaderData?.revenue)?.toFixed(3)) + 'gm'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) :
                                (
                                    <>
                                        <SkeletonPlaceholder>
                                            <View style={[{ backgroundColor: JAMAColors.white }]}>
                                                <View style={{ flexDirection: 'row', width: '90%', height: 40, borderRadius: 5, marginTop: 1, marginBottom: 1, marginLeft: 'auto', marginRight: 'auto' }}>

                                                    <View style={{ width: '60%', flexDirection: 'column', }}>
                                                        <View style={{ width: '50%', height: 20, marginBottom: 1 }}>
                                                        </View>
                                                        <View style={{ width: '50%', height: 20 }}>
                                                        </View>
                                                    </View>
                                                    <View style={{ width: '20%', flexDirection: 'column', }}>
                                                        <View style={{ width: '90%', height: 20, marginBottom: 1 }}>
                                                        </View>
                                                        <View style={{ width: '90%', height: 20 }}>
                                                        </View>
                                                    </View>
                                                    <View style={{ width: '20%', flexDirection: 'column', }}>
                                                        <View style={{ width: '100%', height: 20, marginBottom: 1 }}>
                                                        </View>
                                                        <View style={{ width: '100%', height: 20 }}>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </SkeletonPlaceholder>
                                    </>
                                )
                            }

                            {
                                isApiLoading != true ?
                                    (
                                        <>
                                            <FlatList
                                                data={viewReportData}
                                                refreshControl={
                                                    <RefreshControl

                                                        refreshing={refreshing}
                                                        onRefresh={onRefresh}
                                                    />
                                                }
                                                onEndReached={() => {
                                                    setActivity(true);
                                                    myAxiosMethod()
                                                    let TodayDate = new Date()
                                                    
                                                }}
                                                onEndReachedThreshold={0.5}
                                                ListFooterComponent={renderLoader}
                                                ListFooterComponentStyle={{justifyContent:'center',alignItems:'center',width:"100%",height:100}}
                                                
                                                renderItem={({ item }) =>
                                                    <CardList item={item} />
                                                }
                                                keyExtractor={(item) => item?.id}
                                            />
                                        </>
                                    ) :
                                    (
                                        <>
                                            <FlatList
                                                data={[1, 2, 3, 4, 5, 6, 7]}
                                                renderItem={({ item }) =>
                                                    <Skeleton />
                                                }
                                                keyExtractor={item => item}
                                            />
                                        </>
                                    )
                            }

                        </View>
                        <View style={[JAMAStyle.footerBox]}>
                            {isLoading != true ?
                                (
                                    <>
                                        {route?.params == undefined ?
                                            <View style={[{ alignItems: 'center' }]}>
                                                <TouchableOpacity

                                                    // onPress={() => viewReportData.length != 0 ? setModalVisible(!modalVisible) : Alert.alert('No transactions available')}

                                                    onPress={()=>generatePdf()}

                                                    style={[JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { borderRadius: 5, borderColor: JAMAColors.light_sky, borderWidth: 1 }, { padding: 10, paddingHorizontal: 50 }, { margin: 10 }]}
                                                >
                                                    <View style={[JAMAStyle.pdfBotton, { marginRight: 10 }]}>
                                                        <Text style={JAMAStyle.pdfBtnText}>PDF</Text>
                                                    </View>
                                                    <Text style={[{ fontSize: 15, color: JAMAColors.light_sky }]}>DOWNLOAD</Text>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <View style={[{ justifyContent: 'space-between' }, JAMAStyle.flexRow, { alignItems: 'flex-start' }]}>
                                                <View style={[{ width: width * .5, justifyContent: 'flex-start' },]}>
                                                    <TouchableOpacity
                                                        // onPress={() => setModalVisible(!modalVisible)}

                                                        onPress={()=>generatePdf()}

                                                        style={[JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { borderRadius: 5, borderColor: JAMAColors.light_sky, borderWidth: 1 }, { padding: 12 }, { margin: 10 }]}
                                                    >
                                                        <View style={[JAMAStyle.pdfBotton, { marginRight: 10 }]}>
                                                            <Text style={JAMAStyle.pdfBtnText}>PDF</Text>
                                                        </View>
                                                        <Text style={[{ fontSize: 15, color: JAMAColors.light_sky }]}>DOWNLOAD</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={[{ width: width * .5, justifyContent: 'flex-end' },]}>
                                                    <TouchableOpacity
                                                        onPress={() => shareWhatsApp()}
                                                        style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { borderRadius: 5, borderColor: JAMAColors.light_sky, borderWidth: 1 }, { padding: 12 }, { margin: 10 }]}
                                                    >
                                                        <View style={[{ marginRight: 10 }]}>
                                                            <Icon name='share' size={responsiveFontSize(1.6)} color={JAMAColors.light_sky} />
                                                        </View>
                                                        <Text style={[{ fontSize: 15, color: JAMAColors.light_sky }]}>Share</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }
                                    </>
                                ) : (
                                    <SkeletonPlaceholder  >
                                        <View style={{ flexDirection: 'row', width: '100%', marginLeft: 'auto', marginRight: 'auto', marginTop: 10, borderRadius: 3 }}>
                                            <View style={{ flexDirection: 'column', width: '98%', height: 50 }}>
                                            </View>
                                        </View>
                                    </SkeletonPlaceholder>
                                )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={[JAMAStyle.positionAbsolute, { bottom: 0, width: width }]}>
                    {filterModal &&
                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { height: 270, bottom: 0, backgroundColor: '#E8E8E8' }, { borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
                            <View
                                style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: width * .9 }, { alignSelf: 'center' }]}>
                                <View>
                                    <Text style={[{ fontSize: 12, fontWeight: 'bold', color: JAMAColors.black, marginBottom: 10, marginTop: 10 }]}>Select report duration</Text>
                                </View>
                                <View
                                    style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: width * .9 }, { alignSelf: 'center' }, { backgroundColor: JAMAColors.white }, { borderRadius: 10 }, { padding: 10 }]}>

                                    {
                                        dataSortByFilter.map((item, index) =>
                                        (
                                            <TouchableOpacity
                                                style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceBetween, { paddingVertical: 2 }]}
                                                onPress={() => {
                                                    setCheckSortByFilter(item.type)
                                                }}
                                                key={index}
                                            >
                                                <Text style={[{ fontSize: 12, fontFamily: 'Roboto-Regular', fontWeight: 'bold', color: checksortByFilter == item.type ? JAMAColors.black : JAMAColors.light_gry }]}>{item.label}</Text>
                                                <View style={{ width: 20, height: 20, borderRadius: 10, borderColor: JAMAColors.light_sky, backgroundColor: checksortByFilter == item.type ? JAMAColors.light_sky : JAMAColors.light_silver }}>
                                                    <Image
                                                        style={[{ width: 13, height: 13, padding: 8, resizeMode: 'contain', tintColor: checksortByFilter == item.type ? JAMAColors.white : JAMAColors.light_silver, alignSelf: 'center', justifyContent: 'center' }]}
                                                        source={require('../Jamaassets/chec.png')}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            </View>
                            <View
                                style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: width * .9 }, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginTop: 10 }]}
                            >
                                <TouchableOpacity style={[{ backgroundColor: JAMAColors.light_sky, borderRadius: 5 }]}
                                    onPress={() => {
                                        let TodayDate = new Date()
                                        getuserTransectionReport(`${route?.params != undefined ? encodeURIComponent(route?.params?.name) : ''}`, `${checksortByFilter}`, '', TodayDate.toISOString().substring(0, 10),'0'),
                                            setFilterModal(!filterModal)
                                    }}
                                >
                                    <Text style={[{ textAlign: 'center', padding: 10, color: JAMAColors.white, }]}>View Result</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
                <Modal
                    style={[JAMAStyle.positionRelative,]}
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => { setModalVisible(!modalVisible) }}
                >
                    <View style={[{ marginHorizontal: 25 }, { top: "40%", left: '0%', right: '0%' }]}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                Do You Want To Download PDF Directly or Preview</Text>
                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceAround, { paddingTop: 20 }]}>
                                <View style={{ alignSelf: 'flex-start' }}>
                                    <Pressable
                                        style={[styles.button, { backgroundColor: '#E8E8E8', }, { width: 91 }]}
                                        onPress={() => { setModalVisible(!modalVisible), setIsPdf(true) }}>
                                        <Text style={styles.textStyle}>Preview</Text>
                                    </Pressable>
                                </View>
                                <View style={{ alignSelf: 'flex-end' }}>
                                    <Pressable

                                        style={[styles.button, { backgroundColor: '#00BAE2', marginLeft: 10, width: 91 }]}
                                        onPress={() => {
                                            {
                                                setModalVisible(!modalVisible),
                                                viewReportData.length != null ? Linking.openURL(url) : Alert.alert('No transactions available')
                                            }
                                        }
                                        }>
                                        <Text style={styles.textStyle}>Download</Text>
                                    </Pressable>
                                </View>


                            </View>

                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        ) :
            (
                <>
                    <Pdf
                        trustAllCerts={false}
                        source={{ uri: url, cache: true }}
                        style={styles.pdf} />
                    <Button
                        title='Back'
                        onPress={() => { setIsPdf(false) }} />
                </>

            )
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
        fontSize: 15
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * 0.4,
    },
    loaderStyle:{
        marginVertical:16,
        alignItems:'center'
    }
});

export default ViewReport
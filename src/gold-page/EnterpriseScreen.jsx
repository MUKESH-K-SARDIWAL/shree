
import { Text, View, Image, TouchableOpacity, TextInput, FlatList, Dimensions, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, BackHandler, Linking, Alert, StyleSheet, Pressable, Button ,Modal} from 'react-native'
import React, { useEffect, useState } from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { JAMAColors } from '../Constants/JAMAColors';
import ContactCard from '../SharedComponent/ContactCard';
import AddUserButton from '../SharedComponent/AddUserButton';
import FooterNavBar from '../SharedComponent/FooterNavBar';
import Pdf from 'react-native-pdf';

import {
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { getData } from '../Service/api-Service';
import { apiUrl } from '../Constants/api-route';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Snackbar from 'react-native-snackbar';
import { RefreshControl } from 'react-native';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnterpriseScreen = ({ navigation }) => {
    let checkModal = 1;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            // console.log("Enterprise =>LineNo.29",navigation.getState())

            let filterType = await AsyncStorage.getItem('goldFilterType');
            let transactionType = await AsyncStorage.getItem('goldTransactionType');

            await AsyncStorage.getItem('selectedGoldFilter').then(async (selectedFilter) => {
                // console.log('filter sd ==> ', selectedFilter);
               if (selectedFilter == null )  {
                    selectedFilter = {
                        'goldTransactionType' : 'all',
                        'goldFilterType': 'DESC_date'
                    }

                    
                } else {
                    selectedFilter = JSON.parse(selectedFilter);
                }

                setCheckSelectedFilter(selectedFilter['goldTransactionType']);
                setCheckSortByFilter(selectedFilter['goldFilterType']);
               
                setIsLoading(true)
                setActivity(false)
                 getDashboardTransactionData(`${selectedFilter['goldTransactionType']}`,`${selectedFilter['goldFilterType']}`,'0');

                // console.log('filter ==> ', selectedFilter);
                selectedFilter = JSON.stringify(selectedFilter);
                // console.log('filter ==> ', selectedFilter);
                 await AsyncStorage.setItem('selectedGoldFilter', selectedFilter);
            })
        //    if (transactionType)
        //    {
        //     setCheckSelectedFilter(transactionType);
        //    } else {
        //     setCheckSelectedFilter('all')
        //    }
        //    if(filterType) 
        //    {     
        //         setCheckSortByFilter(filterType);
        //    }
        //    else {
        //         setCheckSortByFilter('DESC_date')
        //    }
        //    if(transactionType== 'all' && filterType=='DESC_date')
        //    {
        //             onRefresh(refreshing)
        //             console.log("refresh");
        //    }
        });
        // setIsLoading(true)
        // getDashboardTransactionData(`${checkSelectedFilter}`,`${checksortByFilter}`,'0');
        return unsubscribe;
    }, [navigation])


    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, []);


    const backAction = () => {

        if (checkModal == 1) {
            setFilterModal(false)
            checkModal = 2;
            return true;
        }
        if (checkModal == 2) {
            checkModal = 1;
            Alert.alert('Hold on!', 'Are you sure you want to exit?', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                },
                { text: 'YES', onPress: () => BackHandler.exitApp() },
            ]);
            return true;
        }
    }
    
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const [search, setSearch] = useState('');
    const [filterModal, setFilterModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [userTransectionHistoryData, setUserTransectionHistoryData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [userSearchData, setUserSearchData] = useState(null);

    const [totalHeaderData, setTotalHeaderData] = useState({});

    const [filterBtn, setFilterBtn] = useState([{ label: "All", value: 1, type: 'all' }, { label: "You Will Get", value: 2, type: 'expense' }, { label: "You Will Give", value: 3, type: 'revenue' }, { label: "Settled", value: 4, type: 'settlement' }]);
    const [activity,setActivity]= useState(false)
    const [nextPageUrl, setNextPageUrl] = useState('');
    const [currentPage,setCurrentPage] = useState(0);
    const [dataSortByFilter, setDataSortByFilter] = useState([
        { label: "Most Recent", value: 'One', type: 'DESC_date', },
        { label: "Highest Gold", value: 'Two', type: 'DESC_amount', },
        { label: "By Name (A-Z)", value: 'Three', type: 'ASC_name', },
        { label: "Oldest", value: 'Four', type: 'ASC_date', },
        { label: "Least Gold", value: 'Five', type: 'ASC_amount', }]);
    const [url, setUrl] = useState(null);
    const [perUserTransactions, setPerUserTransactions] = useState([]);
    const [isApiLoading, setIsApiLoading]= useState(false)
    const [checkSelectedFilter, setCheckSelectedFilter] = useState('all')
    const [checksortByFilter, setCheckSortByFilter] = useState('DESC_date')
    const [refreshing, setRefreshing] = useState(false);
    const [isPdf, setIsPdf] = useState(false);
    const [pdfPreview, setPdfPreview] = useState(false)
    const[ apiUrlForScroll, setApiUrlForScroll] =useState('')
    const [arrayOfArrays,setArrayOfArrays] = useState([]);

    const onRefresh = () => {
        setRefreshing(true)
        setIsLoading(true)
        getDashboardTransactionData(`${checkSelectedFilter}`,`${checksortByFilter}`,'0');
    };

    const searchFilterFunction = async(text) => {
        const lowercasedValue = text.toLowerCase().trim();
        if (lowercasedValue === "") {
            getDashboardTransactionData(`${checkSelectedFilter}`,`${checksortByFilter}`,'0');
        }
        else {
            if(text?.length > 0)
                getDashboardTransactionData(`${checkSelectedFilter}`, `${checksortByFilter}`,'0', text)
        }
    };

    const Skeleton = () => {
        return (
            <SkeletonPlaceholder  >
                <View style={{ flexDirection: 'row', width: '90%', marginTop: 30 }}>
                    <View style={{ width: 50, height: 50, borderRadius: 50 }}>
                    </View>
                    <View style={{ flexDirection: 'column', width: '60%' }}>
                        <View style={{ width: '70%', height: 20, marginTop: 5, marginLeft: 10 }}></View>
                        <View style={{ width: '60%', height: 20, marginTop: 5, marginLeft: 10 }}></View>
                    </View>
                    <View style={{ flexDirection: 'column', width: '30%' }}>
                        <View style={{ width: '90%', height: 20, marginTop: 5 }}></View>
                        <View style={{ width: '60%', height: 20, marginTop: 5 }}></View>
                    </View>
                </View>
            </SkeletonPlaceholder>
        );
    };

     async function myAxiosMethod() {
        // if (nextPageUrl != null) {
            // console.log('currentPage',currentPage)
           
            if(currentPage!=0){
                var  existingIds = arrayOfArrays[currentPage];
                // console.log('apiUrlForScroll',apiUrlForScroll+`&offset=${currentPage}&existingIds=${existingIds}`)
                await getData(apiUrl.transaction_dashboard + '?' + apiUrlForScroll+`&offset=${currentPage}&existingIds=${existingIds}`).then((resp) => {
                    // console.log(resp);
                    // console.log("page Number =>",currentPage + 10);
                    setUrl(resp?.data?.pdf);
                    setActivity(false)
                    setCurrentPage(currentPage + 1);
                    var merged = [...perUserTransactions, ...resp?.data?.data];
                    setPerUserTransactions(merged)
                    // console.log('merged',merged)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        // else{
        //     setActivity(false)
        // }


    }
    function renderLoader(){
        return(
            activity &&  <ActivityIndicator size='large' color={JAMAColors.light_sky} />
        )
    }

    async function generatePdf() {
        setIsApiLoading(true)
        if(perUserTransactions.length != 0){
        // console.log(apiUrl.transaction_dashboard + '?' +apiUrlForScroll+`&generate_pdf=1`);
            await getData(apiUrl.transaction_dashboard + '?' +apiUrlForScroll+`&generate_pdf=1`)
        .then(resp => {
            const { data } = resp;
            //  console.log("data",resp)
            setUrl(data?.pdf)
            setModalVisible(!modalVisible)
            setIsApiLoading(false);
        })
        .catch(err => {
            console.log("err",err);
            setRefreshing(false)
                Snackbar.show({
                    text: `Something wents wrong please try again later`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: JAMAColors.light_sky,
                });
        })

        }
        else {
            Alert.alert('No transactions available')
        }
     }


    async function getDashboardTransactionData(transactionType, filterType,offsetValue,user_name = '') {
        // console.log('ksdjjfn',transactionType, filterType,offsetValue, user_name)
        setIsApiLoading(true)
        let ApiModifiedUrl = `user_name=${user_name}&transaction_mode=gold&transaction_type=${transactionType}&filter_type=${filterType}&report_duration=all&limit=10`
        await getData(apiUrl.transaction_dashboard + '?' +ApiModifiedUrl+ `&offset=${offsetValue}`)
            .then(resp => {
                const { data } = resp;
                // console.log("1st Time Api Data => ",data);
                setTotalHeaderData({ expense: data['expense_amount'], revenue: data['revenue_amount'] })
                // setUserSearchData(data['data'])
                setUrl(data?.pdf);
                setPerUserTransactions(data?.data)
                setRefreshing(false)
                setIsLoading(false)
                setIsApiLoading(false)
                setApiUrlForScroll(ApiModifiedUrl)
                
                let originalArray =  data['overall_ids'];
                let arrayOfArraysTemp = [];
                let subArraySize = 10;

                for (let i = 0; i < originalArray.length; i += subArraySize) {
                    const subArray = originalArray.slice(i, i + subArraySize);
                    arrayOfArraysTemp.push(subArray);
                  }

                setCurrentPage(1)
                setArrayOfArrays(arrayOfArraysTemp);
                
            })
            .catch(err => {
                setRefreshing(false)
                    Snackbar.show({
                        text: `Something wents wrong please try again later`,
                        duration: Snackbar.LENGTH_LONG,
                        backgroundColor: JAMAColors.light_sky,
                    });
            })
            .finally(() => {
                // console.log(perUserTransactions);
                
            })

    }



    return (
        isPdf == false ?(
                <KeyboardAvoidingView
                    style={{width:width,height:height}}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                        <View style={[JAMAStyle.OuterView, JAMAStyle.positionRelative]}>
                            <View style={[{ flex: 2.3, backgroundColor: JAMAColors.light_sky, }, JAMAStyle.pTen, JAMAStyle.dFlex, JAMAStyle.flexColumn, { marginTop: 'auto', marginBottom: 'auto' }]}>
                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, { marginBottom: 10 },]}>
                                    <Icon name="book" size={responsiveFontSize(2.6)} color={JAMAColors.white} />
                                    <Text style={[JAMAStyle.pageHeading]}>SHREE</Text>
                                </View>
                                {isLoading == false ? (
                                    <View style={[JAMAStyle.bgWhite, JAMAStyle.headerBox, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround, { marginTop: 'auto', marginBottom: 'auto' }]}>
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                            <Text style={[JAMAStyle.goldBarAmountText, { color: JAMAColors.green }]}>
                                                <Image
                                                    style={[JAMAStyle.goldbar]}
                                                    source={require('../Jamaassets/gold-ingots.png')}
                                                />
                                                {((Number.isInteger(totalHeaderData.revenue)) ? (Math.round(totalHeaderData.revenue)):(totalHeaderData.revenue)?.toFixed(3))}gm
                                            </Text>
                                            <Text style={[JAMAStyle.goldBarText]}>You will give</Text>
                                        </View>
                                        <View style={[JAMAStyle.internalRightBorder]}></View>
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
                                            <Text style={[JAMAStyle.goldBarAmountText, { color: JAMAColors.danger }]}>
                                                <Image
                                                    style={[JAMAStyle.goldbar]}
                                                    source={require('../Jamaassets/gold-ingots.png')}
                                                />
                                                {/* {((Number.isInteger(totalHeaderData.revenue)) ? (Math.round(totalHeaderData.revenue)):(totalHeaderData.revenue)?.toFixed(3))}gm */}
                                                {((Number.isInteger(totalHeaderData.expense)) ? (Math.round(totalHeaderData.expense)):(totalHeaderData.expense)?.toFixed(3))}gm

                                            </Text>
                                            <Text style={[JAMAStyle.goldBarText]}>You will get</Text>
                                        </View>
                                        <View style={[JAMAStyle.internalRightBorder]}></View>
                                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentCenter]}>
                                            <TouchableOpacity
                                                onPress={() => { navigation.navigate('ViewReport') }}
                                                style={[JAMAStyle.dFlex, JAMAStyle.flexRow]}>
                                                <Text style={[JAMAStyle.reportButton]}>
                                                    View Report
                                                </Text>
                                                <Icon name="angle-right" size={responsiveFontSize(1.9)} color={JAMAColors.light_sky}
                                                />

                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={[JAMAStyle.bgWhite,{borderRadius:6,
                                        padding:10,
                                        }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround, { marginTop: 'auto', marginBottom: 'auto' }]}>
                                        <SkeletonPlaceholder  >
                                            <View style={{ flexDirection: 'row', width: '100%', }}>
                                                <View style={{ flexDirection: 'column', width: '31%' }}>
                                                    <View style={{ width: '90%', height: 20, marginTop: 5,  }}></View>
                                                    <View style={{ width: '90%', height: 20, marginTop: 5,  }}></View>
                                                </View>
                                                <View style={{ flexDirection: 'column', width: '31%' }}>
                                                    <View style={{ width: '90%', height: 20, marginTop: 5, marginLeft: 10 }}></View>
                                                    <View style={{ width: '90%', height: 20, marginTop: 5, marginLeft: 10 }}></View>
                                                </View>
                                                <View style={{ flexDirection: 'column',justifyContent:'center', width: '31%' }}>
                                                    <View style={{ width: '90%', height: 20, marginTop: 5,marginLeft: 10 }}></View>

                                                </View>
                                            </View>
                                        </SkeletonPlaceholder>
                                    </View>
                                )}

                            </View>
                            <View style={[{ flex: 8, }, JAMAStyle.dFlex, JAMAStyle.flexColumn,JAMAStyle.positionRelative]}>
                            {isLoading == false ? (
                                    <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.fixbottomBorder, { justifyContent: 'space-evenly' }, { backgroundColor: JAMAColors.white }, { width: responsiveWidth(99) }, { paddingVertical: 7 }]}>
                                    <View
                                        style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentCenter, { borderColor: JAMAColors.placeHolder_grey, borderRadius: 5, borderWidth: 1 }]}
                                    >
                                        <View style={[{ backgroundColor: JAMAColors.white, }]}>
                                            <Icon name='search' size={responsiveFontSize(2.3)} margin={8} color={JAMAColors.placeHolder_grey} />
                                        </View>
                                        <View style={[{ width: responsiveWidth(65), height: 40 }]}>
                                            <TextInput
                                                style={[JAMAStyle.karigarInput, { paddingVertical: 10 }, { height: 40 }]}
                                                autoCorrect={true}
                                                borderColor={'transparent'}
                                                placeholderTextColor={JAMAColors.placeHolder_grey}
                                                placeholder="Search"
                                                // value={search}
                                                onChangeText={(text) => {setFilterModal(false);
                                                    searchFilterFunction(text)}}
                                                onFocus={()=>setFilterModal(false)}
                                            />
                                        </View>

                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                                 setFilterModal(!filterModal),
                                                 checkModal = 1,
                                                 Keyboard.dismiss()
                                        }}
                                        style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentCenter]}>
                                        <Icon
                                            name="filter" size={responsiveFontSize(2.3)} color={JAMAColors.light_sky}
                                        />
                                        <Text style={JAMAStyle.filterText}>
                                            Filters
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        // onPress={() =>perUserTransactions.length != 0 ? setModalVisible(!modalVisible): Alert.alert('No transactions available')}
                                        onPress={()=>generatePdf()}
                                        style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentCenter, { marginLeft: 7 }]}>
                                        <View style={JAMAStyle.pdfBotton}>
                                            <Text style={JAMAStyle.pdfBtnText}>PDF</Text>
                                        </View>
                                        <Text style={JAMAStyle.filterText}>
                                            PDF
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                ) : (
                                    <View style={[JAMAStyle.bgWhite,{borderRadius:6,
                                        padding:5,
                                        }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround, { marginTop: 'auto', marginBottom: 'auto' }]}>
                                        <SkeletonPlaceholder  >
                                            <View style={{ flexDirection: 'row', width: '95%', }}>
                                                <View style={{ flexDirection: 'column', width: '75%' }}>
                                                    <View style={{ width: '100%', height: 40, borderRadius:5}}></View>

                                                </View>
                                                <View style={{ flexDirection: 'row', width: '25%' }}>
                                                    <View style={{ width: '48%', height: 40,marginLeft:5, marginRight:5,borderRadius:5}}></View>
                                                    <View style={{ width: '48%', height: 40,borderRadius:5}}></View>
                                                </View>

                                            </View>
                                        </SkeletonPlaceholder>
                                    </View>
                                )}
                            <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter,{paddingBottom:50}, JAMAStyle.positionRelative]}>
                                    { isApiLoading == false ?
                                        (
                                            <FlatList
                                                data={perUserTransactions}
                                                refreshControl={
                                                    <RefreshControl
                                                        refreshing={refreshing}
                                                        onRefresh={onRefresh}
                                                    />
                                                }
                                                onEndReached={() => {
                                                    setActivity(true);
                                                    myAxiosMethod()
                                                }}
                                                onEndReachedThreshold={0.5}
                                                ListFooterComponent={renderLoader}
                                                ListFooterComponentStyle={{justifyContent:'center',alignItems:'center',width:"100%",height:100}}
                                                renderItem={({ item }) =>
                                                    <ContactCard item={item} />
                                                }
                                                keyExtractor={(item) => item?.id}
                                            />) :
                                        (
                                            <FlatList
                                                data={[1, 2, 3, 4, 5]}
                                                renderItem={({ item }) =>
                                                    <Skeleton />
                                                }
                                                keyExtractor={item => item}
                                            />
                                        )
                                    }

                            </View>

                            {/* <View style={{flex:1,justifyContent:'center',alignItems:'center',position:'absolute',right:0,left:0}}> */}
                            <Modal
                                    style={[JAMAStyle.positionRelative,]}
                                    animationType="slide"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={()=>{setModalVisible(!modalVisible)}}
                                >
                                    <View style={[{marginHorizontal:25},{top:"40%",left:'0%',right:'0%'}]}>
                                        <View style={styles.modalView}>
                                            <Text style={styles.modalText}>
                                                Do You Want To Download PDF Directly or Preview</Text>
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceAround, { paddingTop: 20 }]}>
                                                <View style={{ alignSelf: 'flex-start' }}>
                                                    <Pressable
                                                        style={[styles.button, { backgroundColor: '#E8E8E8', }, { width: 91 }]}
                                                        onPress={() => {setModalVisible(!modalVisible),setIsPdf(true)}}>
                                                        <Text style={styles.textStyle}>Preview</Text>
                                                    </Pressable>
                                                </View>
                                                <View style={{ alignSelf: 'flex-end' }}>
                                                    <Pressable

                                                        style={[styles.button, { backgroundColor: '#00BAE2', marginLeft: 10, width: 91 }]}
                                                        onPress={() => {{
                                                            setModalVisible(!modalVisible),
                                                            url != null ? Linking.openURL(url) : Alert.alert('No transactions available')}}
                                                        }>
                                                        <Text style={styles.textStyle}>Download</Text>
                                                    </Pressable>
                                                </View>


                                            </View>

                                        </View>
                                    </View>
                                </Modal>
                            {/* </View> */}
                             
                        
                               

                            </View>
                            <View style={{ bottom: '10%', right: '0%', position: 'absolute', backgroundColor: JAMAColors.white }}>
                                <AddUserButton navigation={navigation} Location={'FindContact'} UserType={'ADD PARTY'} />
                            </View>
                            <View style={[{ height: 70 }, { bottom: 0 }]}>
                                <FooterNavBar buttonType={'Gold'} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={[JAMAStyle.positionAbsolute, { bottom: 0, width: width, }]}>
                        {filterModal &&
                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { height: 300, bottom: 0, backgroundColor: '#E8E8E8' }, { borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
                                <View
                                    style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: width * .9 }, { alignSelf: 'center' }]}
                                >
                                    <View>
                                        <Text style={[{ fontSize: 12, fontWeight: 'bold', color: JAMAColors.black, marginBottom: 10, marginTop: 10 }]}>Filter by</Text>
                                    </View>
                                    <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceBetween]}>
                                        {
                                            filterBtn.map((item, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={async () => { setCheckSelectedFilter(item.type) ,  await AsyncStorage.getItem('selectedGoldFilter').then(async (selectedFilter) => {
                                                        // console.log('filter sd ==> ', selectedFilter);
                                                        selectedFilter = (selectedFilter == null ) ? {} : JSON.parse(selectedFilter);
                                                        
                                                        selectedFilter['goldTransactionType'] = item.type;
                                                        // console.log('filter ==> ', selectedFilter);
                                                        selectedFilter = JSON.stringify(selectedFilter);
                                                        // console.log('filter ==> ', selectedFilter);
            
                                                         await AsyncStorage.setItem('selectedGoldFilter', selectedFilter);
                                                    })
                                            }}
                                                    style={[{ width: item.label == 'All' ? 45 : item.label == 'You Will Get' ? 95 : item.label == 'You Will Give' ? 95 : item.label == 'Settled' ? 70 : 0, height: 25, backgroundColor: checkSelectedFilter == item.type ? JAMAColors.light_sky : JAMAColors.white, borderRadius: 5, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, { marginHorizontal: 2.5 }]}>
                                                    <Text style={[{ color: checkSelectedFilter == item.type ? JAMAColors.white : JAMAColors.black }]} >{item.label}</Text>
                                                </TouchableOpacity>
                                            ))}

                                    </View>
                                </View>
                                <View
                                    style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: width * .9 }, { alignSelf: 'center' }]}
                                >
                                    <View>
                                        <Text style={[{ fontSize: 12, fontWeight: 'bold', color: JAMAColors.black, marginBottom: 10, marginTop: 10 }]}>Sort by</Text>
                                    </View>
                                    <View
                                        style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { width: width * .9 }, { alignSelf: 'center' }, { backgroundColor: JAMAColors.white }, { borderRadius: 10 }, { padding: 10 }]}>
                                        {dataSortByFilter.map((item, index) =>
                                        (
                                            <TouchableOpacity
                                                style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceBetween, { paddingVertical: 2 }]}
                                                onPress={async () => {
                                                // console.log("dataSortByFilter",dataSortByFilter)
                                                setCheckSortByFilter(item.type),
                                                await AsyncStorage.getItem('selectedGoldFilter').then(async (selectedFilter) => {
                                                    // console.log('filter sd ==> ', selectedFilter);
                                                    selectedFilter = (selectedFilter == null ) ? {} : JSON.parse(selectedFilter);
                                                    
                                                    selectedFilter['goldFilterType'] = item.type;
                                                    // console.log('filter ==> ', selectedFilter);
                                                    selectedFilter = JSON.stringify(selectedFilter);
                                                    // console.log('filter ==> ', selectedFilter);
        
                                                     await AsyncStorage.setItem('selectedGoldFilter', selectedFilter);
                                                })
        
                                                ;}}
                                                key={index}
                                            >
                                                <Text style={[{ fontSize: 12, fontFamily: 'Roboto-Regular', fontWeight: 'bold', color: checksortByFilter == item.type ? JAMAColors.black : JAMAColors.light_gry }]}>{item.label}</Text>

                                                <View style={{ width: 20, height: 20, borderRadius: 10, borderColor: JAMAColors.light_sky, backgroundColor: checksortByFilter == item.type ? JAMAColors.light_sky : JAMAColors.light_silver }}>
                                                    <Image
                                                        style={[{width:13,height:13,padding:8,resizeMode:'contain', tintColor: checksortByFilter == item.type ? JAMAColors.white : JAMAColors.light_silver ,alignSelf:'center',justifyContent:'center'}]}
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
                                            getDashboardTransactionData(`${checkSelectedFilter}`,`${checksortByFilter}`,`${0}`)
                                            setFilterModal(!filterModal)
                                        }}
                                    >
                                        <Text style={[{ textAlign: 'center', padding: 10, color: JAMAColors.white, }]}>View Result</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>

                </KeyboardAvoidingView>
        ) :
        (
            <>
            <Pdf
            trustAllCerts={false}
            source={{ uri: url, cache: true }}
        // onLoadComplete={(numberOfPages,filePath) => {
        //     console.log(`Number of pages: ${numberOfPages}`);
        // }}
        // onPageChanged={(page,numberOfPages) => {
        //     // console.log(`Current page: ${page}`);
        // }}
        // onError={(error) => {
        //     // console.log(error);
        // }}
        // onPressLink={(uri) => {
        //     // console.log(`Link pressed: ${uri}`);
        // }}
        style={styles.pdf} />
        <Button 
        title='Back'
        onPress={()=>{setIsPdf(false)}}/>
            </>
        
        )
       
    )
}

const styles = StyleSheet.create({
    centeredView: {
             backgroundColor:JAMAColors.light_silver    },
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
        height: Dimensions.get('window').height*0.4,
    },
});

export default EnterpriseScreen



import { Text, View, Image, TouchableOpacity, TextInput, FlatList, Dimensions, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, BackHandler, Alert, Linking, StyleSheet, Pressable, Button, Modal } from 'react-native'

import React, { useEffect, useRef, useState } from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { JAMAColors } from '../Constants/JAMAColors';
import ContactCard from '../SharedComponent/ContactCard';
import AddUserButton from '../SharedComponent/AddUserButton';
import FooterNavBar from '../SharedComponent/FooterNavBar';
import { ActivityIndicator } from 'react-native';
import {
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getData } from '../Service/api-Service';
import { apiUrl } from '../Constants/api-route';
import { RefreshControl } from 'react-native';
import Snackbar from 'react-native-snackbar';
import Pdf from 'react-native-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { string } from 'yup';
import RBSheet from 'react-native-raw-bottom-sheet';


const PartiesEnterpriseScreen = ({ navigation }) => {
    let checkModal = 1;

    useEffect(() => {
        // AsyncStorage.clear()
        const unsubscribe = navigation.addListener('focus', async () => {

            let filterType = await AsyncStorage.getItem('filterType');
            let transactionType = await AsyncStorage.getItem('transactionType');

            await AsyncStorage.getItem('selectedFilter').then(async (selectedFilter) => {
                if (selectedFilter == null) {
                    selectedFilter = {
                        'transactionType': 'all',
                        'filterType': 'DESC_date'
                    }

                } else {
                    selectedFilter = JSON.parse(selectedFilter);
                }

                setCheckSelectedFilter(selectedFilter['transactionType']);
                setCheckSortByFilter(selectedFilter['filterType']);

                setIsLoading(true)
                getDashboardTransactionData(`${selectedFilter['transactionType']}`, `${selectedFilter['filterType']}`, '0');
                selectedFilter = JSON.stringify(selectedFilter);
                await AsyncStorage.setItem('selectedFilter', selectedFilter);
            })
        });
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

        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;

    };

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const [search, setSearch] = useState('');
    // const [filterModal, setFilterModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userTransectionHistoryData, setUserTransectionHistoryData] = useState(null);
    const [userSearchData, setUserSearchData] = useState(null);
    const [totalHeaderData, setTotalHeaderData] = useState(null);

    const [filterBtn, setFilterBtn] = useState([{ label: "All", value: 1, type: 'all' }, { label: "You Will Get", value: 2, type: 'expense' }, { label: "You Will Give", value: 3, type: 'revenue' }, { label: "Settled", value: 4, type: 'settlement' }]);

    const [url, setUrl] = useState(null);

    const [perUserTransactions, setPerUserTransactions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [activity, setActivity] = useState(false)
    const [newCount, SetNewCount] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isApiLoading, setIsApiLoading] = useState(false)
    const [arrayOfArrays, setArrayOfArrays] = useState([]);
    const [dataSortByFilter, setDataSortByFilter] = useState(
        [
            { label: "Most Recent", value: 'One', type: 'DESC_date' },
            { label: "Highest Amount", value: 'Two', type: 'DESC_amount' },
            { label: "By Name (A-Z)", value: 'Three', type: 'ASC_name' },
            { label: "Oldest", value: 'Four', type: 'ASC_date', },
            { label: "Least Amount", value: 'Five', type: 'ASC_amount' }
        ]
    );
    const [checkSelectedFilter, setCheckSelectedFilter] = useState('all')
    const [checksortByFilter, setCheckSortByFilter] = useState('DESC_date')
    const [refreshing, setRefreshing] = useState(false);
    const [isPdf, setIsPdf] = useState(false);
    const [apiUrlForScroll, setApiUrlForScroll] = useState('');
    const refRBSheet = useRef([]);
    const onRefresh = () => {
        setRefreshing(true);
        setIsLoading(true)
        getDashboardTransactionData(`${checkSelectedFilter}`, `${checksortByFilter}`, '0');
    };

    const navigateToSelection = (props) => {
        // if (props == 'gold') {
        // navigation.navigate('FindContact');
        // }
        // else {
        navigation.navigate('PartiesFindContact');

        // }
        // SetNewTransactionModal(false)

    }

    const searchFilterFunction = async (text) => {

        const lowercasedValue = text.toLowerCase().trim();
        // console.log(lowercasedValue)
        if (lowercasedValue === "") {
            getDashboardTransactionData(`${checkSelectedFilter}`, `${checksortByFilter}`, '0');
        }
        else {
            if (text?.length > 0)
                getDashboardTransactionData(`${checkSelectedFilter}`, `${checksortByFilter}`, `${0}`, text)
            // transactionType, filterType,offsetValue, user_name
        }

    };

    const EmptyListComponent = () => {
        return (
            <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <Text style={{ color: JAMAColors.black, fontSize: 15 }}>No Data Found</Text>
                <TouchableOpacity onPress={() => { getDashboardTransactionData('all', `DESC_date`, '0'); }} style={{ backgroundColor: JAMAColors.light_sky, borderRadius: 6, height: 32, width: 100, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: JAMAColors.white, fontSize: 15 }}>Refresh</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const debouncedSearchFilterFunction = debounce(searchFilterFunction, 1500);

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

        console.log('currentPage', newCount)
        if (newCount != null && newCount > 10) {
            if (currentPage != 0) {

                var existingIds = arrayOfArrays[currentPage];

                // console.log(`existingIds==>`, existingIds);

                // console.log('apiUrlForScroll', apiUrlForScroll + `&offset=${currentPage}&existingIds=${existingIds}`)

                await getData(apiUrl.transaction_dashboard + '?' + apiUrlForScroll + `&offset=${currentPage}&existingIds=${existingIds}`).then((resp) => {
                    // console.log("resp?.data?.pdf=>", resp?.data?.pdf);
                    // console.log("page Number =>",currentPage + 10);
                    // setUrl(resp?.data?.pdf);
                    SetNewCount(resp?.data?.count)
                    setCurrentPage(currentPage + 1);
                    var merged = [...perUserTransactions, ...resp?.data?.data];
                    setPerUserTransactions(merged);
                    // console.log('merged',merged)
                    // console.log(perUserTransactions)
                })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {
                        setActivity(false);
                    })
            }

            // }
            else {
                setActivity(false)
            }
        }
        else {
            setActivity(false)
        }
    }
    function renderLoader() {
        return (
            activity && <ActivityIndicator size='large' color={JAMAColors.light_sky} />
        )
    }

    async function generatePdf() {
        setIsApiLoading(true)
        if (perUserTransactions.length != 0) {
            // console.log('genrate pdf', apiUrl.transaction_dashboard + '?' + apiUrlForScroll + `&generate_pdf=1`);
            await getData(apiUrl.transaction_dashboard + '?' + apiUrlForScroll + `&generate_pdf=1`)
                .then(resp => {

                    // console.log('resp?.data?.pdf22', JSON.stringify(resp?.data?.pdf, null, 2))
                    setUrl(resp?.data?.pdf)
                    setModalVisible(!modalVisible)
                    setIsApiLoading(false);
                })
                .catch(err => {
                    console.log("err", err);
                    setRefreshing(false)
                    setIsApiLoading(false)
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

    async function getDashboardTransactionData(transactionType, filterType, offsetValue, user_name = '') {

        setIsApiLoading(true)
        let ApiModifiedUrl = `user_name=${user_name}&transaction_type=${transactionType}&filter_type=${filterType}&report_duration=all&limit=10`

        // console.log(`ApiModifiedUrl==>`, ApiModifiedUrl);
        await getData(apiUrl.transaction_dashboard + '?' + ApiModifiedUrl + `&offset=${offsetValue}`)
            .then(resp => {
                const { data } = resp;

                setUrl(data?.pdf);

                setTotalHeaderData({
                    expenseGold: data['expense_amount_gold'],
                    revenueGold: data['revenue_amount_gold'],
                    expenseRupee: data['expense_amount_parties'],
                    revenueRupee: data['revenue_amount_parties']
                });

                setPerUserTransactions(data?.data);
                setApiUrlForScroll(ApiModifiedUrl);
                SetNewCount(data?.count)
                let originalArray = data['overall_ids'];
                let arrayOfArraysTemp = [];
                let subArraySize = 10;

                for (let i = 0; i < originalArray.length; i += subArraySize) {
                    const subArray = originalArray.slice(i, i + subArraySize);
                    arrayOfArraysTemp.push(subArray);
                };
                console.log(`arrayOfArraysTemp==>`, arrayOfArraysTemp);

                setCurrentPage(1);
                setArrayOfArrays(arrayOfArraysTemp);
            })
            .catch(err => {
                console.log("err", err);

                Snackbar.show({
                    text: err.message == 'Network Error' ? "Please check internet connection." : `Something wents wrong please try again later`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: JAMAColors.light_sky,
                });
            })
            .finally(() => {
                setRefreshing(false)
                setIsLoading(false)
                setIsApiLoading(false)
            })
    }


    return (
        isPdf == false ? (
            <KeyboardAvoidingView
                style={[{ width: width, height: height }]}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View style={[JAMAStyle.OuterView, JAMAStyle.positionRelative]}>
                        <View style={[{ flex: 2.5, backgroundColor: JAMAColors.light_sky, }, JAMAStyle.pTen, JAMAStyle.dFlex, JAMAStyle.flexColumn, { marginTop: 'auto', marginBottom: 'auto' }]}>
                            <View style={[JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceBetween, JAMAStyle.alignItemCenter, { marginBottom: 10 }]}>
                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter,]}>
                                    <Icon name="book" size={responsiveFontSize(2.6)} color={JAMAColors.white} />
                                    <Text style={[JAMAStyle.pageHeading]}>SHREE</Text>
                                </View>
                                <TouchableOpacity onPress={() => { navigation.navigate('Notification') }} style={{ width: 25, height: 25 }}>
                                    <Icon name="bell" size={24} color={JAMAColors.white} />
                                </TouchableOpacity>
                            </View>

                            {totalHeaderData != null ? (
                                <View style={[JAMAStyle.alignItemCenter]}>
                                    <View style={[JAMAStyle.bgWhite, JAMAStyle.headerBox, JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceBetween, { marginTop: 'auto', marginBottom: 'auto' }]}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { flex: 1 }]}>
                                                <Text style={[JAMAStyle.goldBarText]}>You will give</Text>
                                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceBetween,]}>
                                                    <Text style={[JAMAStyle.goldBarAmountText, { color: JAMAColors.green }]}>
                                                        <Text
                                                            style={[JAMAStyle.goldbar, { color: JAMAColors.green }]}>₹
                                                        </Text>
                                                        {(totalHeaderData.revenueRupee)?.toFixed(0)}
                                                    </Text>
                                                    <Text style={[JAMAStyle.goldBarAmountText, { color: JAMAColors.green }]}>
                                                        <Image
                                                            style={[JAMAStyle.goldbar]}
                                                            source={require('../Jamaassets/gold-ingots.png')}
                                                        />
                                                        {(totalHeaderData.revenueGold)?.toFixed(0)} gm
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={[JAMAStyle.internalRightBorder]}></View>
                                            <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { flex: 1 }]}>
                                                <Text style={[JAMAStyle.goldBarText]}>You will get</Text>
                                                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceBetween,]}>
                                                    <Text style={[JAMAStyle.goldBarAmountText, { color: JAMAColors.danger }]}>
                                                        <Text
                                                            style={[JAMAStyle.goldbar, { color: JAMAColors.danger }]}>₹
                                                        </Text>
                                                        {(totalHeaderData.expenseRupee)?.toFixed(0)}

                                                    </Text>
                                                    <Text style={[JAMAStyle.goldBarAmountText, { color: JAMAColors.danger }]}>
                                                        <Image
                                                            style={[JAMAStyle.goldbar]}
                                                            source={require('../Jamaassets/gold-ingots.png')}
                                                        />
                                                        {(totalHeaderData.expenseGold)?.toFixed(0)} gm

                                                    </Text>
                                                </View>

                                            </View>
                                        </View>

                                        {/* <View style={[JAMAStyle.internalRightBorder]}></View> */}

                                    </View>
                                    <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentCenter, { width: '100%', marginHorizontal: 'auto', marginTop: 5, gap: 10 }]}>
                                        <TouchableOpacity
                                            onPress={() => { navigation.navigate('PartiesViewReport') }}
                                            style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.bgWhite, { borderRadius: 6, padding: 4 }]}>
                                            <Text style={[JAMAStyle.reportButton]}>
                                                View Report
                                            </Text>
                                            <Icon name="angle-right" size={responsiveFontSize(2.2)} color={JAMAColors.light_sky}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => { navigation.navigate('BulkReminder') }}
                                            style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.bgWhite, { borderRadius: 6, padding: 4 }]}>
                                            <Text style={[JAMAStyle.reportButton,]}>
                                                Bulk Reminder
                                            </Text>
                                            <Icon name="angle-right" size={responsiveFontSize(2.2)} color={JAMAColors.light_sky}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View style={[JAMAStyle.bgWhite, {
                                    borderRadius: 6,
                                    padding: 10,
                                }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround, { marginTop: 'auto', marginBottom: 'auto' }]}>
                                    <SkeletonPlaceholder>
                                        <View style={{ flexDirection: 'row', width: '100%', }}>
                                            <View style={{ flexDirection: 'column', width: '31%' }}>
                                                <View style={{ width: '90%', height: 20, marginTop: 5, }}></View>
                                                <View style={{ width: '90%', height: 20, marginTop: 5, }}></View>
                                            </View>
                                            <View style={{ flexDirection: 'column', width: '31%' }}>
                                                <View style={{ width: '90%', height: 20, marginTop: 5, marginLeft: 10 }}></View>
                                                <View style={{ width: '90%', height: 20, marginTop: 5, marginLeft: 10 }}></View>
                                            </View>
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', width: '31%' }}>
                                                <View style={{ width: '90%', height: 20, marginTop: 5, marginLeft: 10 }}></View>
                                            </View>
                                        </View>
                                    </SkeletonPlaceholder>
                                </View>
                            )}
                        </View>
                        <View style={[{ flex: 8 }, JAMAStyle.dFlex, JAMAStyle.flexColumn]}>
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
                                                // onFocus={() => setFilterModal(false)}
                                                // value={search}
                                                onChangeText={(text) => {
                                                    // setFilterModal(false);
                                                    debouncedSearchFilterFunction(text)
                                                }
                                                }
                                            />
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            // setFilterModal(!filterModal);
                                            // checkModal = 1;
                                            // Keyboard.dismiss()
                                            refRBSheet.current.open()
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
                                        // onPress={() =>  perUserTransactions.length != 0 ? setModalVisible(!modalVisible) : Alert.alert('No transactions available')}
                                        onPress={() => generatePdf()}
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
                                <View style={[JAMAStyle.bgWhite, {
                                    borderRadius: 6,
                                    padding: 5,
                                }, JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceAround, { marginTop: 'auto', marginBottom: 'auto' }]}>
                                    <SkeletonPlaceholder  >
                                        <View style={{ flexDirection: 'row', width: '95%', }}>
                                            <View style={{ flexDirection: 'column', width: '75%' }}>
                                                <View style={{ width: '100%', height: 40, borderRadius: 5 }}></View>

                                            </View>
                                            <View style={{ flexDirection: 'row', width: '25%' }}>
                                                <View style={{ width: '48%', height: 40, marginLeft: 5, marginRight: 5, borderRadius: 5 }}></View>
                                                <View style={{ width: '48%', height: 40, borderRadius: 5 }}></View>
                                            </View>
                                        </View>
                                    </SkeletonPlaceholder>
                                </View>
                            )}
                            <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, { paddingBottom: 50 }]}>
                                {isApiLoading == false ?
                                    (<FlatList
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
                                        ListFooterComponentStyle={{ justifyContent: 'center', alignItems: 'center', width: "100%", height: 100 }}
                                        renderItem={({ item }) =>
                                            <ContactCard item={item} />
                                        }
                                        ListEmptyComponent={EmptyListComponent}

                                        keyExtractor={(item, index) => index}
                                    />
                                    ) :
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
                                                                url != null ? Linking.openURL(url) : Alert.alert('No transactions available')
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
                        </View>
                        <View style={{ bottom: '10%', right: '0%', position: 'absolute' }}>
                            {/* <AddUserButton navigation={navigation} Location={'SelectionPage'} UserType={'ADD NEW'} /> */}
                            <TouchableOpacity
                                style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, JAMAStyle.positionAbsolute, JAMAStyle.addButton]}
                                onPress={() => { navigateToSelection('party') }}
                            >
                                <Icon name='user-plus' size={responsiveFontSize(2.2)} color={JAMAColors.white} paddingRight={7} />
                                <Text style={[JAMAStyle.addKarigar]}>ADD NEW</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[{ height: 70 }, { bottom: 0 },]}>
                            <FooterNavBar buttonType={'Parties'} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View >
                    {/* {filterModal &&
                        
                    } */}
                    <RBSheet
                        ref={refRBSheet}
                        useNativeDriver={false}
                        height={310}
                        customStyles={{
                            wrapper: {
                                backgroundColor: '#00000070',
                                // padding: 15,
                            },
                            container: {
                                // top: '-60%' ,
                                borderRadius: 10,
                                alignItems: 'center',
                                // overflow: 'hidden',
                                backgroundColor: '#E8E8E8',
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
                        closeOnPressBack
                        customAvoidingViewProps={{
                            enabled: true,
                        }}>
                        <View style={[JAMAStyle.dFlex, JAMAStyle.flexColumn, { height: 310, },]}>
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
                                                onPress={async () => {
                                                    setCheckSelectedFilter(item.type)
                                                    await AsyncStorage.getItem('selectedFilter').then(async (selectedFilter) => {
                                                        // console.log('filter sd ==> ', selectedFilter);
                                                        selectedFilter = (selectedFilter == null) ? {} : JSON.parse(selectedFilter);

                                                        selectedFilter['transactionType'] = item.type;
                                                        // console.log('filter ==> ', selectedFilter);
                                                        selectedFilter = JSON.stringify(selectedFilter);
                                                        // console.log('filter ==> ', selectedFilter);

                                                        await AsyncStorage.setItem('selectedFilter', selectedFilter);
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
                                    (<TouchableOpacity
                                        style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentSpaceBetween, { paddingVertical: 2 }]}
                                        onPress={async () => {

                                            setCheckSortByFilter(item.type)
                                            //  await AsyncStorage.setItem('filterType',item.type);
                                            await AsyncStorage.getItem('selectedFilter').then(async (selectedFilter) => {
                                                // console.log('filter sd ==> ', selectedFilter);
                                                selectedFilter = (selectedFilter == null) ? {} : JSON.parse(selectedFilter);

                                                selectedFilter['filterType'] = item.type;
                                                // console.log('filter ==> ', selectedFilter);
                                                selectedFilter = JSON.stringify(selectedFilter);
                                                // console.log('filter ==> ', selectedFilter);

                                                await AsyncStorage.setItem('selectedFilter', selectedFilter);
                                            })

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
                                        getDashboardTransactionData(`${checkSelectedFilter}`, `${checksortByFilter}`, `${0}`)
                                        refRBSheet.current.close();
                                        // setFilterModal(!filterModal)
                                    }}
                                >
                                    <Text style={[{ textAlign: 'center', padding: 10, color: JAMAColors.white, }]}>View Result</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </RBSheet>
                </View>
                {/* <Modal
                    style={[JAMAStyle.positionRelative,]}
                    animationType="slide"
                    transparent={false}
                    visible={newTransactionModal}
                    onRequestClose={() => { SetNewTransactionModal(!newTransactionModal) }}
                >
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ flexDirection: 'column', gap: 10 }}>
                            <TouchableOpacity style={{ height: 42, backgroundColor: JAMAColors.light_sky, borderRadius: 6, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigateToSelection('gold')}>
                                <Text style={{ color: JAMAColors.white, fontSize: 16, textAlign: 'center', fontFamily: 'Roboto-Regular' }}>Add Transaction in Gold</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ height: 42, backgroundColor: JAMAColors.light_sky, borderRadius: 6, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => { navigateToSelection('party') }}>
                                <Text style={{ color: JAMAColors.white, fontSize: 16, textAlign: 'center', fontFamily: 'Roboto-Regular' }}>Add Transaction in Rupee</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </Modal> */}
            </KeyboardAvoidingView>
        ) :
            (
                <>
                    <Pdf
                        trustAllCerts={false}
                        source={{ uri: url, cache: true }}
                        onLoadComplete={(numberOfPages, filePath) => {
                            // console.log(`Number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            // console.log(`Current page: ${page}`);
                        }}
                        onError={(error) => {
                            // console.log(error);
                        }}
                        onPressLink={(uri) => {
                            // console.log(`Link pressed: ${uri}`);
                        }}
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
        height: Dimensions.get('window').height,
    },
    loaderStyle: {
        alignItems: 'center'
    }
});

export default PartiesEnterpriseScreen
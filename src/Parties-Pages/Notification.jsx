import { View, Text, TouchableOpacity, Image, TextInput, FlatList, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { JAMAColors } from '../Constants/JAMAColors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { JAMAStyle } from '../Constants/JAMAStyleSheet';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import ContactCard from '../SharedComponent/ContactCard';
import { useNavigation } from '@react-navigation/native';
import { getData } from '../Service/api-Service';
import { apiUrl } from '../Constants/api-route';
import { ActivityIndicator } from 'react-native-paper';


const Notification = () => {

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    // const [data, setLoad] = useState(null);
    const [searchText, setSearchText] = useState('')

    const [perUserTransactions, setPerUserTransactions] = useState([]);
    const [totalHeaderData, setTotalHeaderData] = useState(null);

    useEffect(() => {
        getNotificationData();
    }, []);

    const searchFilterFunction = async (text) => {
        getNotificationData(text)
    };

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


    const getNotificationData = async (username = '') => {
        await getData(apiUrl?.notifications + `?user_name=${username}`)
            .then((resp) => {
                console.log(JSON.stringify(resp?.data, null, 2));
                // setData(resp?.data);
                setPerUserTransactions(resp?.data?.data);
                setTotalHeaderData({
                    expenseGold: resp?.data['expense_amount_gold'],
                    revenueGold: resp?.data['revenue_amount_gold'],
                    expenseRupee: resp?.data['expense_amount_parties'],
                    revenueRupee: resp?.data['revenue_amount_parties']
                })
            })
            .catch((err) => { console.warn(err) })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const backBtnPress = () => {
        navigation.goBack()
    }


    const EmptyListComponent = () => {
        return (
            <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <Text style={{ color: JAMAColors.black, fontSize: 15 }}>No Notification Found</Text>
                <TouchableOpacity onPress={() => { getNotificationData(); }} style={{ backgroundColor: JAMAColors.light_sky, borderRadius: 6, height: 32, width: 100, marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: JAMAColors.white, fontSize: 15 }}>Refresh</Text>
                </TouchableOpacity>
            </View>
        )
    }
    if (isLoading) {
        return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: JAMAColors.main_white }}>
            <ActivityIndicator size={'large'} color={JAMAColors.light_sky} />
        </View>)
    }

    return (
        <View style={{ flex: 1, backgroundColor: JAMAColors.white }}>
            <View style={{ height: 48, width: '100%', backgroundColor: JAMAColors.light_sky, justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                    <Icon name="arrow-left" size={17} color={JAMAColors.white} />
                    <Text style={{ color: JAMAColors.white, fontSize: 14, marginLeft: 12, fontFamily: 'Roboto-Bold', }}>Notification</Text>
                </TouchableOpacity>
            </View>
            <View style={[JAMAStyle.alignItemCenter, { marginHorizontal: 15, elevation: 3, backgroundColor: JAMAColors.white, borderRadius: 8, marginTop: 10 }]}>
                <View style={[JAMAStyle.bgWhite, JAMAStyle.headerBox, JAMAStyle.dFlex, JAMAStyle.flexColumn, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentSpaceBetween, { marginTop: 'auto', marginBottom: 'auto' }]}>
                    {totalHeaderData && <View style={{ flexDirection: 'row' }}>
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
                    </View>}

                    {/* <View style={[JAMAStyle.internalRightBorder]}></View> */}

                </View>

            </View>
            <View style={{ elevation: 2, backgroundColor: JAMAColors.white, marginHorizontal: 15, marginTop: 10, borderRadius: 8 }}>
                <View style={{ padding: 4, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                    <View style={[{ flex: 1 }]}>
                        <TextInput
                            style={[JAMAStyle.karigarInput, { paddingVertical: 10 }, { height: 40, flex: 1 }]}
                            autoCorrect={true}
                            placeholderTextColor={JAMAColors.placeHolder_grey}
                            placeholder="Search"
                            onChangeText={(text) => {
                                debouncedSearchFilterFunction(text);
                                setSearchText(text);
                            }
                            }
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => { debouncedSearchFilterFunction(searchText) }}
                        style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.alignItemCenter, JAMAStyle.justifyContentCenter, { width: 100, backgroundColor: JAMAColors.light_sky, height: 40, marginLeft: 10, borderRadius: 6 }]}>
                        <Text style={{ fontSize: 14, fontFamily: "Roboto-Medium", color: JAMAColors.white }}>
                            Search
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={[JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter, { marginTop: 20, }]}>
                <View style={{}}>
                    <FlatList
                        data={perUserTransactions}
                        ListFooterComponentStyle={{ justifyContent: 'center', alignItems: 'center', width: "100%" }}
                        renderItem={({ item }) =>
                            <ContactCard item={item} />
                        }
                        ListEmptyComponent={EmptyListComponent}
                        keyExtractor={(item) => item?.id}
                    />
                </View>


            </View>
        </View >
    )
}

export default Notification
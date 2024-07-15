import { View, Text, TouchableOpacity, FlatList, RefreshControl, BackHandler, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { JAMAStyle } from '../Constants/JAMAStyleSheet'
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions'
import { JAMAColors } from '../Constants/JAMAColors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native'
import { apiUrl } from '../Constants/api-route'
import { getData, postData } from '../Service/api-Service'
import moment from 'moment';
import Snackbar from 'react-native-snackbar'

const BulkReminder = () => {

    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [searchText, setSearchText] = useState('')

    useEffect(() => {
        getBulkReminderData();
    }, []);

    const searchFilterFunction = async (text) => {
        getBulkReminderData(text)
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


    const getBulkReminderData = async (username = '') => {
        await getData(apiUrl?.bulkList + `?user_name=${username}`)
            .then((resp) => {
                console.log(JSON.stringify(resp?.data, null, 2));
                setData(resp?.data?.data)
            })
            .catch((err) => { console.warn(err) })
            .finally(() => {
                setIsLoading(!isLoading)
            })
    }

    const backBtnPress = () => {
        navigation.goBack()
    }

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [time, setTime] = useState(new Date());

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        console.log(`currentDate==>`, currentDate);
        setShow(false);
        if (mode == 'date') {
            setDate(currentDate);
        }
        else {
            setTime(currentDate)
        }

    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const RemindBulkUserList = () => {
        let formData = new FormData();
        let logId = selectedItems.join(',');
        console.log(`logId==>`, logId);
        console.log(`transactionDate==>`, moment(new Date(date)).format('YYYY-MM-DD'));
        formData.append('log_ids', logId);
        formData.append('reminder_date', moment(new Date(date)).format('YYYY-MM-DD'));
        formData.append('reminder_type', 'next_week')
        postData(apiUrl?.bulkStore, formData)
            .then((resp) => {

                console.log('resp', JSON.stringify(resp, null, 2));

                setTime(new Date());
                setDate(new Date());
                setSelectedItems([]);

                Snackbar.show({
                    text: resp?.data?.message,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: JAMAColors.light_sky,
                });

            })
            .catch((err) => {
                console.log(err)
            })
    }



    const toggleItemSelection = (item) => {
        const selectedIndex = selectedItems.indexOf(item?.id);
        if (selectedIndex === -1) {
            // Item not selected, add it to the selection
            setSelectedItems([...selectedItems, item?.id]);
        } else {
            // Item already selected, remove it from the selection
            const updatedSelection = [...selectedItems];
            updatedSelection.splice(selectedIndex, 1);
            setSelectedItems(updatedSelection);
        }
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedItems.includes(item.id);
        return (
            <TouchableOpacity
                style={[
                    JAMAStyle.dFlex,
                    JAMAStyle.flexRow,
                    JAMAStyle.alignItemCenter,

                    { paddingVertical: 12, paddingHorizontal: 10, marginVertical: 2.5, borderRadius: 6, gap: 1, backgroundColor: isSelected ? 'white' : 'white', borderColor: isSelected ? JAMAColors.light_sky : JAMAColors.light_silver, borderWidth: 1 }
                ]}
                onPress={() => toggleItemSelection(item)}
            >
                <View style={[{ width: responsiveWidth(15) }]}>
                    <View
                        style={[
                            JAMAStyle.dFlex,
                            JAMAStyle.justifyContentCenter,
                            JAMAStyle.alignItemCenter,
                            {
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                borderColor: isSelected ? '#dee1e6' : 'white',
                                backgroundColor: isSelected ? JAMAColors.light_sky : '#E9E9E9',
                            }
                        ]}>
                        {isSelected ? <Icon name="check" size={responsiveFontSize(2.3)} color={JAMAColors.white} /> : <Text style={[JAMAStyle.cardFirstLatter, { fontSize: responsiveFontSize(2.3) }]}>
                            {item?.transaction_user_name.slice(0, 1).toUpperCase()}
                        </Text>}
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

                        <Text style={{
                            fontSize: responsiveFontSize(2.1),
                            fontFamily: 'Roboto-Black',
                            color: isSelected ? JAMAColors.light_sky : 'black',
                            fontWeight: 'bold'
                        }}>
                            {item?.transaction_user_name}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={[JAMAStyle.bgSkyBlue]}>
                <View style={{ height: 48, width: '100%', backgroundColor: JAMAColors.light_sky, justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                        <Icon name="arrow-left" size={17} color={JAMAColors.white} />
                        <Text style={{ color: JAMAColors.white, fontSize: 14, marginLeft: 12, fontFamily: 'Roboto-Bold', }}>Bulk Reminder</Text>
                    </TouchableOpacity>
                </View>
                <View style={[JAMAStyle.dFlex, JAMAStyle.flexRow, JAMAStyle.justifyContentCenter, JAMAStyle.mLeftAuto, JAMAStyle.mRightAuto, { marginBottom: 10, marginTop: 10, paddingHorizontal: 15, borderRadius: 5 }, { width: '100%' }]}>
                    <View style={[{ flex: 1, height: 42 }, { backgroundColor: JAMAColors.white, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }, JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceBetween, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { paddingVertical: 0, paddingHorizontal: 10, }]} >
                        <Text style={[JAMAStyle.dateText]}>
                            {moment(new Date(date)).format('DD-MM-YYYY')}
                        </Text>
                        <TouchableOpacity onPress={showDatepicker} style={{ flexDirection: 'row', }}>
                            <Icon name='calendar-day' size={responsiveFontSize(2.4)} color={JAMAColors.light_sky} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: JAMAColors.light_silver, width: 2, height: 42 }}></View>
                    <View style={[{ flex: 1, height: 42 }, { borderTopRightRadius: 5, borderBottomRightRadius: 5, backgroundColor: JAMAColors.white, }, JAMAStyle.dFlex, JAMAStyle.justifyContentSpaceBetween, JAMAStyle.alignItemCenter, JAMAStyle.flexRow, { paddingVertical: 0, paddingHorizontal: 10, }]}
                    >
                        <Text style={[JAMAStyle.dateText]}>
                            {moment(time).format('LT')}
                        </Text>
                        <TouchableOpacity onPress={showTimepicker} style={{ flexDirection: 'row', }}>
                            <Icon name='clock' size={responsiveFontSize(2.4)} color={JAMAColors.light_sky} />
                        </TouchableOpacity>


                    </View>


                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                        />
                    )}
                </View>
                {/* <View style={[{ height: 32, width: '100%' }, { backgroundColor: JAMAColors.light_sky, justifyContent: 'flex-end', alignContent: 'flex-end', alignItems: 'flex-end', paddingHorizontal: 15, paddingBottom: 5 }]}>
                    <TouchableOpacity style={[{ height: 32, width: 120 }, { borderRadius: 5, backgroundColor: JAMAColors.white, }, { paddingVertical: 0, paddingHorizontal: 20, }, JAMAStyle.dFlex, JAMAStyle.justifyContentCenter, JAMAStyle.alignItemCenter]}>
                        <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Roboto-Regular', color: JAMAColors.light_sky, textAlign: 'right' }}>
                            Select All
                        </Text>
                    </TouchableOpacity>

                </View> */}
                <View style={{ elevation: 2, backgroundColor: JAMAColors.white, marginHorizontal: 15, marginTop: 2, marginBottom: 10, borderRadius: 8 }}>
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
                                Select All
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {data && <View style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    contentContainerStyle={{ paddingBottom: 60, marginHorizontal: '2.5%', width: '95%', justifyContent: 'center' }}
                    renderItem={renderItem}
                    // onEndReached={() => { }}
                    // onEndReachedThreshold={0.5}
                    keyExtractor={(item) => item.id.toString()}
                />

            </View>}
            <TouchableOpacity onPress={RemindBulkUserList} style={{ position: 'absolute', bottom: 10, width: '90%', backgroundColor: JAMAColors.light_sky, left: '5%', padding: 10, borderRadius: 10 }}>
                <Text style={{ color: JAMAColors.white, fontSize: 16, textAlign: 'center' }}>Set Bulk Reminder</Text>
            </TouchableOpacity>
        </View>
    )
}

export default BulkReminder
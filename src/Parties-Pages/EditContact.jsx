import { View, Text, TouchableOpacity, Image, TextInput, FlatList, BackHandler } from 'react-native'
import React, { useEffect, useState } from 'react'
import { JAMAColors } from '../Constants/JAMAColors'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { PermissionsAndroid } from 'react-native';
import Contacts from 'react-native-contacts';


const EditContact = () => {

    useEffect(() => {
        // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        //     title: 'Contacts',
        //     message: 'This app would like to view your contacts.',
        //     buttonPositive: 'Please accept bare mortal',
        // })
        //     .then((res) => {
        //         console.log('Permission: ', res);
        //         Contacts.getAll()
        //             .then((contacts) => {
        //                 console.log(contacts);
        //             })
        //             .catch((e) => {
        //                 console.log(e);
        //             });
        //     })
        //     .catch((error) => {
        //         console.error('Permission error: ', error);
        //     });
        updateContact()
    }, [])


   
    return (
        <View style={{ flex: 1, backgroundColor: JAMAColors.white }} >
            <View style={{ height: 48, width: '100%', backgroundColor: JAMAColors.light_sky, justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'start' }}>
                    <Icon name="arrow-left" size={17} color={JAMAColors.white} />
                    <Text style={{ color: JAMAColors.white, fontSize: 14, marginLeft: 12, fontFamily: 'Roboto-Bold', }}>Edit Contact</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: 15, marginTop: 15 }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: JAMAColors.black, fontSize: 14, fontWeight: 500, fontFamily: 'Roboto-Medium' }}>Name</Text>
                    <TextInput style={{ borderColor: JAMAColors.black, borderWidth: 1, borderRadius: 8, padding: 8, height: 40, marginTop: 10 }} placeholder='Enter Your Name' placeholderTextColor={JAMAColors.footer_text} />
                </View>
                <View style={{ flexDirection: 'column', marginTop: 10 }}>
                    <Text style={{ color: JAMAColors.black, fontSize: 14, fontWeight: 500, fontFamily: 'Roboto-Medium' }}>Phone Number</Text>
                    <TextInput style={{ borderColor: JAMAColors.black, borderWidth: 1, borderRadius: 8, padding: 8, height: 40, marginTop: 10 }} placeholder='Enter Your Name' placeholderTextColor={JAMAColors.footer_text} />
                </View>
                <TouchableOpacity style={{ backgroundColor: JAMAColors.light_sky, height: 40, marginTop: 20, width: '100%', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, color: JAMAColors.white }}>Update</Text>
                </TouchableOpacity>
            </View>
            <Text>EditContact</Text>
        </View>
    )
}

export default EditContact
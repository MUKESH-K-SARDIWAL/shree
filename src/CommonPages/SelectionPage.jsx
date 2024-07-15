import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { JAMAColors } from '../Constants/JAMAColors'
import { useNavigation } from '@react-navigation/native'

const SelectionPage = () => {
    const navigation = useNavigation();

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>

        <View style={{flexDirection:'column',gap:10}}>
              <TouchableOpacity style={{ height: 42, backgroundColor: JAMAColors.light_sky, borderRadius: 6, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => { navigation.navigate('FindContact')}}>
                  <Text style={{ color: JAMAColors.white, fontSize: 16, textAlign: 'center', fontFamily: 'Roboto-Regular' }}>Add Transaction in Gold</Text>
            </TouchableOpacity>
              <TouchableOpacity style={{ height: 42, backgroundColor: JAMAColors.light_sky, borderRadius: 6, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => { navigation.navigate('PartiesFindContact')}}>
                  <Text style={{ color: JAMAColors.white, fontSize: 16, textAlign: 'center', fontFamily: 'Roboto-Regular' }}>Add Transaction in Rupee</Text>
              </TouchableOpacity>
        </View>
      
    </View>
  )
}

export default SelectionPage

const styles = StyleSheet.create({})
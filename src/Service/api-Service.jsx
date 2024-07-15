import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseUrl } from '../Constants/api-route';


export async function getData(url) {

    let apiUrl = baseUrl + url;
    let headers = 'Bearer'.concat(await AsyncStorage.getItem('token'));
    return axios.get(apiUrl, { headers: { "Accept": "*/*", "Content-Type": "multipart/form-data", 'Authorization': headers } })





}

export async function postData(url, data) {

    let apiUrl = baseUrl + url;
    let headers = 'Bearer'.concat(await AsyncStorage.getItem('token'));
    return axios.post(apiUrl, data, { headers: { "Accept": "application/json, text/plain, /", "Content-Type": "multipart/form-data", 'Authorization': headers } })
}
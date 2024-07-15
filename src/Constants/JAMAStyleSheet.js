import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { JAMAColors } from './JAMAColors';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const width = Dimensions.get('window').width;
export const JAMAStyle = StyleSheet.create({
    OuterView: {
        flex: 1,
        width: width
    },
    pTen: {
        padding: 10
    },
    p10: {
        padding: 10
    },
    pH15: {
        paddingHorizontal: 15
    },
    pH30: {
        paddingHorizontal: 30
    },
    mTop10: {
        marginTop: 10
    },
    mTop20: {
        marginTop: 20
    },
    mTop40: {
        marginTop: 40
    },
    fSize20: {
        fontSize: responsiveFontSize(2.75)
    },
    fSize12: {
        fontSize: responsiveFontSize(1.4)
    },
    fSize14: {
        fontSize: responsiveFontSize(2.1)
    },
    fSize16: {
        fontSize: responsiveFontSize(1.92)
    },
    flex12: {
        flex: 12
    },
    lSpacing: {
        letterSpacing: 1
    },
    dFlex: {
        display: 'flex'
    },
    flexRow: {
        flexDirection: 'row'
    },
    flexRowReverse: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start'
    },
    flexColumn: {
        flexDirection: 'column'
    },
    positionRelative: {
        position: 'relative'
    },
    positionAbsolute: {
        position: 'absolute'
    },
    alignItemCenter: {
        alignItems: 'center'
    },
    justifyContentCenter: {
        justifyContent: 'center'
    },
    justifyContentSpaceAround: {
        justifyContent: 'space-around'
    },
    pageHeading: {
        color: JAMAColors.white,
        fontFamily: 'Roboto-Bold',
        fontSize: responsiveFontSize(2.6),
        marginLeft: 10,

    },
    ViewReportHeading: {
        color: JAMAColors.white,
        fontFamily: 'Roboto-Bold',
        fontWeight: 'bold',
        letterSpacing: .7,
        fontSize: responsiveFontSize(2.6),
        marginLeft: 15,

    },
    fontBold: {
        fontFamily: 'Roboto-Bold'
    },
    bgSkyBlue: {
        backgroundColor: JAMAColors.light_sky,
    },
    bgWhite: {
        backgroundColor: JAMAColors.white,
    },
    bgSilver: {
        backgroundColor: JAMAColors.light_silver,
    },
    headerBox: {
        borderRadius: 6,
        padding: 10,
        marginVertical: 20
    },
    transectionSaved: {
        color: '#4F4F4F', fontSize: 16, fontFamily: 'Roboto-Regular'
    },
    otpDoneButton: {
        backgroundColor: JAMAColors.light_sky,
        padding: 0,
        borderRadius: 4,
        // justifyContent:'center',
        // alignItems:'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    otpSuccessfulText: {
        color: '#4F4F4F', fontSize: responsiveFontSize(2.1), fontFamily: 'Roboto-Regular', textAlign: 'center'
    },
    otpSavedCircle: {
        width: 56, height: 56, borderRadius: 28, backgroundColor: JAMAColors.green, marginBottom: 25
    },
    headerText: {
        fontSize: responsiveFontSize(2.5),
        color: JAMAColors.white,
        fontFamily: 'Roboto-Bold',

    },
    savedCircle: {
        width: 50, height: 50, borderRadius: 25, backgroundColor: JAMAColors.green, marginBottom: 25
    },
    justifyContentSpaceBetween: {
        justifyContent: 'space-between'
    },
    attachmentText: {
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Roboto-Light',
    },
    userheaderText: {
        fontSize: 16,
        color: JAMAColors.white,
        fontFamily: 'Roboto-Bold',
    },
    moreComponentText: {
        fontSize: 20,
        color: JAMAColors.black,
        fontFamily: 'Roboto-Light',
    },
    inputField: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: JAMAColors.light_gry,
        borderRadius: 4,
        color: JAMAColors.black,
        backgroundColor: JAMAColors.white
    },
    otpField: {
        borderBottomWidth: 1,
        borderColor: JAMAColors.light_gry,
        borderRadius: 2,
        color: JAMAColors.black
    },
    editButton: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: JAMAColors.light_sky,
    },
    internalRightBorder: {
        opacity: .2,
        width: 2,
        height: 50,
        marginLeft: 20,
        marginRight: 14,
        borderRightWidth: 1,
        borderRightColor: JAMAColors.light_Black
    },
    goldbar: {
        width: 22,
        height: 22,
        marginEnd: 4

    },
    goldbarNext: {
        width: 22,
        height: 22,


    },
    goldBarAmountText: {

        fontFamily: 'Roboto-Black',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        marginLeft: 3,
        paddingVertical: 3
    },
    cardDateText: {
        fontSize: responsiveFontSize(1.6),
        color: JAMAColors.card_text
    },
    CardgoldValueText: {
        fontFamily: 'Roboto-Regular',
        fontSize: responsiveFontSize(1.4),
        color: JAMAColors.light_gry
    },
    goldAmountText: {
        fontFamily: 'Roboto-Black',
        fontSize: responsiveFontSize(2.3),
        fontWeight: 'bold',
        // marginLeft:0,
        // paddingVertical:3
    },
    ViewgoldAmountText: {
        fontFamily: 'Roboto-Black',
        fontSize: responsiveFontSize(1.8),
        fontWeight: 'bold',
        // marginLeft:0,
        // paddingVertical:3
    },
    goldBarText: {
        color: JAMAColors.placeHolder_grey,
        fontFamily: 'Roboto-Regular',
        fontSize: responsiveFontSize(2),

        paddingVertical: 3
    },
    reportButton: {
        color: JAMAColors.light_sky,
        fontSize: responsiveFontSize(1.8),
        marginRight: 12,
        fontFamily: 'Roboto-Regular',
    },
    karigarInput: {
        color: JAMAColors.black,
        //  marginVertical:5,
        borderWidth: 1,
        // borderColor:'#A9A9A9',
        borderRadius: 5,
        // padding: 10
    },
    findContactInput: {

        margin: 12,
        borderWidth: 1,
        borderColor: '#A9A9A9',
        borderRadius: 5,
        paddingVertical: 10
    },

    enterGoldInput: {
        color: JAMAColors.black,
        margin: 12,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        paddingVertical: 10
    },
    enterEntriesInput: {
        color: JAMAColors.black,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    },
    enterValueInput: {
        color: JAMAColors.black,
        borderRadius: 5,
        paddingLeft: 10
    },
    filterText: {
        fontSize: responsiveFontSize(1.3),
        fontFamily: 'Roboto-Regular',
        color: JAMAColors.light_sky,
    },
    pdfBotton: {
        borderWidth: 1,
        borderColor: JAMAColors.light_sky,
        padding: 1,
        borderRadius: 4
    },
    pdfBtnText: {
        color: JAMAColors.light_sky,
        fontSize: responsiveFontSize(1.4),

    },
    fixbottomBorder: {
        borderBottomColor: '#A9A9A9',
        borderBottomWidth: 1,


    },
    contactCard: {
        borderBottomColor: '#A9A9A9',
        borderBottomWidth: 1,

        backgroundColor: JAMAColors.white
    },
    borderCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: '#dee1e6',
        backgroundColor: '#E9E9E9'
    },
    findContactborderCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: '#dee1e6',

    },
    headerNameborderCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderColor: '#dee1e6',

    },
    cardFirstLatter: {
        fontSize: responsiveFontSize(3.1),
        color: JAMAColors.medium_blue,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Bold'
    },
    userHeaderFirstLatter: {
        fontSize: 16,
        color: JAMAColors.medium_blue,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Bold'
    },
    flex9: {
        flex: 9
    },
    flex5: {
        flex: 5
    },
    karigarName: {
        fontSize: responsiveFontSize(2.2),
        fontFamily: 'Roboto-Black',
        color: JAMAColors.black,
        fontWeight: 'bold'
    },
    buttonAuth: {

        padding: 5,
        borderRadius: 4,
        // justifyContent:'center',
        // alignItems:'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    ButtonTypeText: {
        padding: 10,
        color: JAMAColors.white,
        fontFamily: 'Roboto-Black'
    },
    userHeaderkarigarName: {
        fontSize: 17,
        fontFamily: 'Roboto-Bold',

        fontWeight: 'bold'
    },
    colorWhite: {
        color: JAMAColors.white
    },
    colorLightSky: {
        color: JAMAColors.light_sky
    },
    colorBlack: {
        color: JAMAColors.black
    },
    colorgrey: {
        color: JAMAColors.light_gry
    },
    mLeftAuto: {
        marginLeft: 'auto'
    },
    mRightAuto: {
        marginRight: 'auto'
    },
    karigarTiming: {
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Roboto-Regular',
        color: JAMAColors.light_gry
    },
    userHeaderkarigarTiming: {
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
    },
    contact: {
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Roboto-Regular',
        color: JAMAColors.black,
    },
    phoneNumber: {
        fontSize: responsiveFontSize(1.5),
        fontFamily: 'Roboto-Regular',
        color: JAMAColors.footer_text,
    },
    cardPadding: {
        paddingVertical: 20, paddingHorizontal: 10
    },
    requesttext: {
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        color: JAMAColors.light_sky,

    },
    paytext: {
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        color: JAMAColors.light_sky,

    },
    marginIcon: {
        // marginLeft:-1
    },
    IconDownward: {
        transform: [{ rotateY: '180deg' }, { rotateZ: '45deg' }],
        marginTop: 3, marginRight: 3
    },
    IconUpward: {
        transform: [{ rotateY: '0deg' }, { rotateZ: '-45deg' }],
        marginTop: 3, marginRight: 3
    },
    settleCardText: {
        fontFamily: 'Roboto-Black',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        marginLeft: 1,
        marginTop: 0,
        paddingVertical: 1,
        color: 'black'
    },
    requestCardText: {
        fontFamily: 'Roboto-Black',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        marginLeft: 1,
        marginTop: 0,
        paddingVertical: 1,
        color: JAMAColors.green
    },
    payCardText: {
        fontFamily: 'Roboto-Black',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        marginLeft: 1,
        marginTop: 0,
        paddingVertical: 1,
        color: JAMAColors.danger
    },
    EntryCardText: {
        fontFamily: 'Roboto-Black',
        fontSize: 17,
        fontWeight: 'bold',

    },
    goldbarCard: {
        width: 20,
        height: 20,
        marginEnd: 5,
        marginTop: 3
    },
    addButton: {
        backgroundColor: JAMAColors.purple,
        bottom: 10, right: 10,
        paddingHorizontal: 22,
        paddingVertical: 10,
        borderRadius: 20
    },
    addKarigar: {
        color: JAMAColors.white,
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Roboto-Regular',

    },
    footerText: {
        fontSize: responsiveFontSize(1.9),
        fontFamily: 'Roboto-Regular',
    },
    textFooterText: {
        color: JAMAColors.footer_text
    },
    textLightSky: {
        color: JAMAColors.light_sky
    },
    footerBox: {
        backgroundColor: JAMAColors.white
    },
    W33: {
        width: '33%'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    borderLeftRadius: {
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5
    },
    borderRightRadius: {
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
    },
    borderTopRadius: {
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    borderBottomRadius: {
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    dateText: {
        fontSize: responsiveFontSize(2), fontFamily: 'Roboto-Regular', color: JAMAColors.light_sky
    },
    borderShadow: {
        shadowColor: '#000',

        shadowOpacity: 0.8,
        elevation: 5,
    },
    getText: {
        fontFamily: 'Roboto-Regular', color: JAMAColors.light_sky
    },

})
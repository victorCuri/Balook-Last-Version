import React, { Component } from 'react'
import { View, StyleSheet, ImageBackground, TouchableOpacity, Text, Image} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

import looksBackground from '../assets/images/bg-looks.jpg'
import calendarioBackground from '../assets/images/bg-calendario.jpg' 
import comporlookBackground from '../assets/images/bg-comporlook.jpg'
import espacotrocaBackground from '../assets/images/bg-espacotroca.jpg'
import looksIcon from '../assets/icons/looks.png'
import calendarioIcon from '../assets/icons/calendario.png'
import comporLookIcon from '../assets/icons/comporlook.png'
import espacoTrocaIcon from '../assets/icons/espaco_troca.png'

import api from '../services/api'
import LinearGradient from 'react-native-linear-gradient';

export default class MainMenu extends Component {

    async UNSAFE_componentWillMount(){
        
        const token = await AsyncStorage.getItem('@Baloo:token');
        console.log("TOKEN MAIN MENU: " + token)
   
        if (token === null) 
            this.props.navigation.navigate('Login');
        else
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;


    }

    render() {
        return(
            <LinearGradient style={styles.container} colors={['#CEBBBA', '#CFDBDB']} locations={[0,.7]}>
                <ImageBackground source={looksBackground} style={styles.button1} imageStyle={{ borderRadius: 20, width: '100%' }}>
                    <View style={styles.buttonOverlay}>
                        <TouchableOpacity style={styles.textContainer} onPress={() => this.props.navigation.navigate('Looks')}>
                            <Image source={looksIcon} />
                            <Text style={styles.text}>looks</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <ImageBackground source={calendarioBackground} style={styles.button1} imageStyle={{ borderRadius: 20, width: '100%' }}>
                    <View style={styles.buttonOverlay}>
                        <TouchableOpacity style={styles.textContainer} onPress={() => this.props.navigation.navigate('Calendar')}>
                            <Image source={calendarioIcon} />
                            <Text style={styles.text}>calendario</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <ImageBackground source={comporlookBackground} style={styles.button1} imageStyle={{ borderRadius: 20, width: '100%' }}>
                    <View style={styles.buttonOverlay}>
                        <TouchableOpacity style={styles.textContainer} onPress={() => this.props.navigation.navigate('ComporLook')}>
                            <Image source={comporLookIcon} />
                            <Text style={styles.text}>compor look</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <ImageBackground source={espacotrocaBackground} style={styles.button1} imageStyle={{ borderRadius: 20, width: '100%' }}>
                    <View style={styles.buttonOverlay}>
                        <TouchableOpacity style={styles.textContainer} onPress={() => this.props.navigation.navigate('Explorar')}>
                            <Image source={espacoTrocaIcon} />
                            <Text style={styles.text}>explorar</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </LinearGradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center", 
        backgroundColor: "#C4D0D0",
    },
    button1: {
        borderRadius: 20, 
        flex: 1,
        width: '97%',
        justifyContent: "center",
        alignSelf: "center",
        margin: 5,
    },
    buttonOverlay:{
        backgroundColor: "#FFFFFF55",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        borderRadius: 20
    },
    textContainer: {
        borderRadius: 16,
        backgroundColor: "#FFF",
        borderWidth: 3,
        borderColor: "#4E3D42",
        width: "70%",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    text: {
        fontSize: 20,
        color: "#4E3D42",
        alignSelf: "center",
        fontFamily: "Rubik",
    }, 

})
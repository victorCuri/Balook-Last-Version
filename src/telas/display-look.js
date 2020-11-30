import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'

import api from '../services/api'

import noimage from '../assets/images/noimage.png'
import CloseButton from '../assets/icons/botao_fechar.svg'
import { ScrollView } from 'react-native-gesture-handler'

export default class DisplayLook extends Component {
    constructor(props){
        super(props);

        this.state = {
            title: '',
            torso: '',
            legs: '',
            feet: '',
            loading: false
        }
    }

    async componentDidMount(){

        const { navigation } = this.props;
        this.focusListener = navigation.addListener("willFocus", () => {
            this.setState({ loading: true, title: '' });
            this.getLook();
        });

    }

    async getLook() {

        const id = await AsyncStorage.getItem('@Baloo: lookID');
        await AsyncStorage.removeItem('@Baloo: lookID');

        try {
            
            if(id){
                const response = await api.get(`/api/v1/look/${id}`);

                this.setState({ 
                    title: response.data.name,
                    torso: response.data.torso_image,
                    legs: response.data.leg_image,
                    feet: response.data.feet_image,
                    loading: false
                 });

                console.log(this.state.loading);
            }
            
        } catch (error) {
            
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <LinearGradient style={styles.look} colors={['#CEBBBA', '#CFDBDB']} locations={[0,.7]}>
                    <View style={{ width: '100%', margin: 5 }}>
                        <Text style={styles.title}>{this.state.title}</Text>
                    </View> 
                    <TouchableOpacity style={styles.parts}>
                        {this.state.loading
                        ? <ActivityIndicator ActivityIndicator size={"large"} color={"#999"} style={styles.loading}  />
                        : <Image style={styles.imagelook} source={this.state.torso ? { uri: this.state.torso } : noimage}/>
                        }                   
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.parts}>
                        {this.state.loading
                        ? <ActivityIndicator ActivityIndicator size={"large"} color={"#999"} style={styles.loading}  />
                        : <Image style={styles.imagelook} source={this.state.legs ? { uri: this.state.legs } : noimage}/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.parts}>
                        {this.state.loading
                        ? <ActivityIndicator ActivityIndicator size={"large"} color={"#999"} style={styles.loading}  />
                        : <Image style={styles.imagelook} source={this.state.feet ? { uri: this.state.feet } : noimage}/>
                        }
                    </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity style={styles.closebuttoncontainer} onPress={() => this.props.navigation.navigate('Looks')}>
                    <CloseButton style={styles.closebutton} height={27} width={27}/>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    look: {
        flex: 0.9,
        alignItems: "center",
    },

    parts: {
        flexDirection: "row",
        minWidth: '85%',
        maxWidth: '85%',
        minHeight: '27%',
        maxHeight: '27%',
        borderRadius: 20,
        backgroundColor: '#FFF',
        marginTop: 12,
        justifyContent: "center",
        alignItems: "center"
    },

    closebutton: {
        width: 60,
        height: 60,
    },

    closebuttoncontainer: {
        flex: 0.1,
        alignItems: "center",
        backgroundColor: "#CFDBDB"
    },

    imagelook: {
        width: "40%",
        height: "95%",
        resizeMode: "contain"
    },

    title: {
        borderWidth: 3,
        width: "60%",
        alignSelf: "center",
        borderColor: "#CEBBBA",
        borderBottomColor: "white",
        textAlign: "center",
        fontSize: 23,
        color: "white",
    },

    loading: { 
        alignSelf: "center",
    },

});


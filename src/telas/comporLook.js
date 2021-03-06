import React, { Component, useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Modal } from 'react-native'
import { Header } from 'react-native/Libraries/NewAppScreen'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'

import api from '../services/api'

import OkButton from '../assets/buttons/okbutton.png'
import Icon from '../assets/icons/botaosubir.svg'
import { ScrollView } from 'react-native-gesture-handler'
import CloseButton from '../assets/icons/botao_fechar.svg'

export default class ComporLook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            torso: [],
            legs: [],
            feet: [],
            torsoIndex: 0,
            legsIndex: 0,
            feetIndex: 0,
            redirectItem: [],
            title: '',
            saving: false,
            error: '',
            sucess: '',
            alert: false
        };
    }

    handleTitleChange = (title) => {
        this.setState({ title });
      };

    handleNext = (valueView) => {

        if (valueView === "torso")
            this.setState({ torsoIndex: (this.state.torsoIndex + 1) % this.state.torso.length });
        else if (valueView === "legs")
            this.setState({ legsIndex: (this.state.legsIndex + 1) % this.state.legs.length });
        else if (valueView === "feet")
            this.setState({ feetIndex: (this.state.feetIndex + 1) % this.state.feet.length });

    }

    handlePrev = (valueView) => {

        if (valueView === "torso") {
            if (this.state.torsoIndex == 0)
                this.setState({ torsoIndex: this.state.torso.length - 1 });
            else
                this.setState({ torsoIndex: this.state.torsoIndex - 1 });
        } else if (valueView === "legs") {
            if (this.state.legsIndex == 0)
                this.setState({ legsIndex: this.state.legs.length - 1 });
            else
                this.setState({ legsIndex: this.state.legsIndex - 1 });
        } else if (valueView === "feet") {
            if (this.state.feetIndex == 0)
                this.setState({ feetIndex: this.state.feet.length - 1 });
            else
                this.setState({ feetIndex: this.state.feetIndex - 1 });
        }
    }

    async saveLook(){

          try {
            
            this.setState({ loading: true });
            await api.post('/api/v1/look/create', {
                
                name: this.state.title,
                description: 'Descreva seu look...',
                clothe_torso: this.state.torso[this.state.torsoIndex]._id,
                clothe_leg: this.state.legs[this.state.legsIndex]._id,
                clothe_feet: this.state.feet[this.state.feetIndex]._id,
                torso_image: this.state.torso[this.state.torsoIndex].default_image,
                leg_image: this.state.legs[this.state.legsIndex].default_image,
                feet_image: this.state.feet[this.state.feetIndex].default_image
             
            }).then((response) => {

                if (response.status == 201){
                    this.setState({ sucess: 'Seu look foi cadastrado com sucesso!' });
                    setTimeout(this.sucessRequest(), 1500);
                }

            });
              
          } catch (_err) {
            if(_err.message === 'Request failed with status code 500'){
                this.setState({ error: 'Parece que voc?? j?? cadastrou esse look...' });
            } else {
                this.setState({ error: _err.message });
            }    
            
            this.showModal();
            console.log(_err.message);
          }

    }

    sucessRequest() {
        this.setState({ loading: false });
        this.props.navigation.navigate('Looks');
    }

    showModal(visible) {
        this.setState({ alert: visible });
    }

    async redirectedGarment() {

        this.setState({ error: '', sucess: '' });
        const gamentID = await AsyncStorage.getItem('@Baloo:garmentID');
        AsyncStorage.removeItem('@Baloo:garmentID');

            if(gamentID){
                api.get(`/api/v1/garment/${gamentID}`).then((response) => {
                    this.setState({ redirectItem: response.data })
                });
                const garmentData = this.state.redirectItem;
                console.log("Redirected 1: " + this.state.isRedirected);
                this.getUrlImage(garmentData.body_part);
            } else {
                this.setState({ redirectItem: [] });
            }

    }

    async componentDidMount() {

        const { navigation } = this.props;
        this.focusListener = navigation.addListener("willFocus", () => {
            // The screen is focused
            // Call any action

            this.redirectedGarment();
            
        });

        const asyncToken = await AsyncStorage.getItem('@Baloo:token');
        const response = await api.get('api/v1/garment', {
            headers: {
                Authorization: 'Bearer '.concat(asyncToken)
            }
        });

        var responseData = response.data.data;

        this.setState({torso: responseData.reduce((acc, cur) => {
            if (cur.body_part === "torso"){
                acc = acc.concat(cur);
            }
            return acc;
        }, [])});

        this.setState({legs: responseData.reduce((acc, cur) => {
            if (cur.body_part === "legs"){
                acc = acc.concat(cur);
            }
            return acc;
        }, [])});

        this.setState({feet: responseData.reduce((acc, cur) => {
            if (cur.body_part === "feet"){
                acc = acc.concat(cur);
            }
            return acc;
        }, [])});

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.textheader}>Componha looks e otimize seu tempo!</Text>
                </View>
                <LinearGradient style={styles.look} colors={['#CEBBBA', '#CFDBDB']} locations={[0,.7]}>
                    <View style={{ width: '100%', margin: 5 }}>
                        <TextInput style={styles.textInput} 
                        value={this.state.title}
                        onChangeText={this.handleTitleChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="E o Nome do Look?"
                        placeholderTextColor="white"
                        numberOfLines={1}
                        clearTextOnFocus
                        />
                    </View>
                   
                    <View style={styles.parts}>
                        <TouchableOpacity onPress={() => (this.handlePrev("torso"))}>
                            <Icon style={styles.buttonleft} />
                        </TouchableOpacity>
                        {this.getUrlImage("torso")}
                        <TouchableOpacity onPress={() => (this.handleNext("torso"))}>
                            <Icon style={styles.buttonrigth} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.parts}>
                        <TouchableOpacity onPress={() => (this.handlePrev("legs"))}>
                            <Icon style={styles.buttonleft} />
                        </TouchableOpacity>
                        {this.getUrlImage("legs")}
                        <TouchableOpacity onPress={() => (this.handleNext("legs"))}>
                            <Icon style={styles.buttonrigth} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.parts}>
                        <TouchableOpacity onPress={() => (this.handlePrev("feet"))}>
                            <Icon style={styles.buttonleft} />
                        </TouchableOpacity>
                        {this.getUrlImage("feet")}
                        <TouchableOpacity onPress={() => (this.handleNext("feet"))}>
                            <Icon style={styles.buttonrigth} />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                <View style={styles.lookbuttoncontainer}>
                    {this.state.saving
                    
                    ? <ActivityIndicator ActivityIndicator size={"large"} color={"#999"} style={styles.picture}  />
                    
                    : <TouchableOpacity onPress={() => (this.saveLook()) }>
                        <Image
                            style={styles.lookbutton}
                            source={OkButton}
                        />
                    </TouchableOpacity>
                    }
                    
                </View>

                <Modal
                visible={this.state.alert}
                transparent={true}
                animationType={"fade"}
                onRequestClose={ () => console.log('Closed')} >
                    
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF99' }}>    
                        <View style={styles.alertContainer}>
                            <Text style={styles.errorMessage}>{this.state.error}</Text>
                        </View>
                        <TouchableOpacity onPress={() => (this.showModal(false))}>
                            <CloseButton style={styles.closeButton}/>
                        </TouchableOpacity>
                    </View>

                </Modal>
 

            </View>
        )
    }

     getUrlImage(valueView) {
        if (valueView === "torso") {
            let torsoToShow = this.state.redirectItem;  
           // const isRedir =  this.state.isRedirected;
            if(torsoToShow && valueView === torsoToShow.body_part){

            } else {
                torsoToShow = this.state.torso[this.state.torsoIndex];  
            }
            if (torsoToShow){
                return <Image style={styles.imagelook} source={{ uri: torsoToShow.default_image }} />
            }
        } else if (valueView === "legs") {
            let legsToShow = this.state.redirectItem;  
            if(legsToShow && valueView === legsToShow.body_part){

            } else {
                legsToShow = this.state.legs[this.state.legsIndex];  
            }
            if (legsToShow){
                return <Image style={styles.imagelook} source={{ uri: legsToShow.default_image }} />
            }
        } else if (valueView === "feet") {
            let feetToShow = this.state.redirectItem;  
            if(feetToShow && valueView === feetToShow.body_part){

            } else {
                feetToShow = this.state.feet[this.state.feetIndex];  
            }            
            if (feetToShow){
                return <Image style={styles.imagelook} source={{ uri: feetToShow.default_image }} />
            }
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CFDBDB',
    },

    look: {
        flex: 0.880,
        alignItems: "center",
    },

    parts: {
        flexDirection: "row",
        minWidth: '85%',
        maxWidth: '85%',
        minHeight: '29%',
        maxHeight: '29%',
        borderRadius: 20,
        backgroundColor: '#FFF',
        marginTop: 12,
        justifyContent: "space-between",
        alignItems: "center"
    },

    header: {
        flex: 0.05,
        justifyContent: "center",
        backgroundColor: "#FFF",
        alignItems: "center"
    },

    textheader: {
        fontSize: 20,
        color: "#445555"
    },

    lookbutton: {
        width: 60,
        height: 60,
    },

    lookbuttoncontainer: {
        flex: 0.15,
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 7
    },

    buttonleft: {
        transform: [{ rotate: '-90deg' }],
        left: -20
    },

    buttonrigth: {
        transform: [{ rotate: '90deg' }],
        right: -20
    },

    imagelook: {
        width: "40%",
        height: "95%",
        resizeMode: "contain"
    },

    textInput: {
        borderWidth: 3,
        width: "60%",
        alignSelf: "center",
        borderColor: "#CEBBBA",
        borderBottomColor: "white",
        textAlign: "center",
        fontSize: 23,
        color: "white",
    },

    errorMessage: {
        textAlign: "center",
        color: "#4E3D42",
        fontSize: 18,
        fontFamily: 'Rubik',
        margin: 7,
        fontWeight: 'bold'
    },

    alertContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : "white", 
        height: 144,
        width: '75%',
        borderWidth: 3,
        borderColor: '#4E3D42',
        borderRadius: 15,
    },

    closeButton: {
        alignContent: 'flex-end',
        justifyContent: 'flex-end'
    }
})
import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, Image, TouchableHighlight, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'

import api from '../../services/api'
import Add from '../../assets/icons/botaoadd.svg' 

export default class Camisas extends Component {
    constructor(props) {
        super(props) 
        this.onEndReachedCalledDuringMomentum = true;  
        this.state = {
            garment: [],
            page: 0,
            token: '', 
            loading: false,
            refresh: true, 
            total: 0,
        }
    }

    async componentDidMount() {

        this.loadPage() 
        
    }

    async loadPage (pageNumber = this.state.page, shouldRefresh = false)  {  
       
        if(pageNumber > this.state.total){
            console.log("FIM" + this.state.total)
            return
        }

        try{   
            console.log("LOADPAGE")

            this.setState({ loading: true });

            const response = await api.get(`/api/v1/garment?skip=${pageNumber*20}&limit=20`);
                                            // /api/v1/wardrobe/:wardrobeId
            console.log("RESPONDE.DATA: " + response)
            const data = await response.data.data;

            console.log("DATA: " + data)
            console.log("PAGE NUMBER: " + pageNumber)

            const totalAmount = await response.data.totalAmount;

            console.log("TOTAL: " + totalAmount)
                

            this.setState({
                garment: shouldRefresh ? data : [...this.state.garment, ...data],
                page: pageNumber + 1,
                loading: false,
                refresh: false,
                total: Math.ceil(totalAmount / 20),
            })

            console.log("PAGE NUMBER(2): " + this.state.page)

        }catch(err){
            console.log(err)
    
        }  
    }

    refreshList = async () => {
        this.setState({ refresh: true })

        console.log("REFRESH LIST");
        await this.loadPage(0, true);

        this.setState({ refresh: false })
    }

    //Criar uma fun????o 'pe??a', chamada ao selecionar uma pe??a especifica, que redicionar?? o us??ario para a tela publicar e direcionar os dados da pe??a em quest??o para essa tela
    pe??a(item) {

        console.log("_id "+ item._id);
        console.log("TAMANHO: ", item.model);
        AsyncStorage.setItem("@Baloo:garmentID", item._id);
        this.props.navigation.navigate('Publicar');
    }

    render() {
        console.log("GARMENT: " + this.state.garment)
        console.log(this.state.garment.length)
        console.log("TOTAL" + this.state.total)
        const win = Dimensions.get('window');
        console.log("WIN: ", win);
        return ( 
            <View style={styles.container}>
                <LinearGradient style={{flex: 9, justifyContent: "center", alignContent: "center"}} colors={['#CEBBBA', '#CFDBDB']} locations={[0,.7]}>
                <FlatList
                contentContainerStyle={{paddingTop: 5, alignSelf: "center", alignContent: "center", justifyContent: "center"}}
                numColumns={2} 
                data={this.state.garment}
                onEndReached={() => {if(!this.onEndReachedCalledDuringMomentum && this.state.total !== 0){
                    this.loadPage();                    
                    this.onEndReachedCalledDuringMomentum = true;
                    console.log("ONENDREACHED: " + this.state.page);
                }}}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false;}}
                ListFooterComponent={this.state.loading && <ActivityIndicator size={"small"} color={"#999"} style={{margin: 30}} />}
                onRefresh={this.refreshList}
                refreshing={this.state.refresh}
                keyExtractor={post => String(post.id)}
                renderItem={({ item }) => (
                     <View style={{marginBottom: 5}}>  
                         <TouchableOpacity style={styles.garmentBox} onPress={() => this.pe??a(item)}> 
                            <Image style={{borderRadius: 20, aspectRatio: win.scale/4, height: win.height/4.15, alignSelf: "center", margin: 9}} source={{uri: item.default_image}} />
                        </TouchableOpacity>  
                        <View style={styles.size}>
                            <Text style={{alignSelf: "center"}}>{`${item.model}`}</Text>
                        </View>        
                    </View>
                
                 )}
                />
                <View style={styles.text}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Camera')} style={{alignSelf: "center"}}>
                        <Add width={60} height={60} />
                    </TouchableOpacity>
                </View>
                </LinearGradient>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: "center",
        alignContent: "center"
    },
    text: {
        flex: 0,
        flexDirection: 'row',
        justifyContent: "center"
    },
    garmentBox: {
        backgroundColor: "white",
        borderRadius: 20,
        flexGrow: 1,
        margin: 5,
        alignSelf: "center",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    size: {
        borderRadius: 100, backgroundColor: 'white', borderColor: 'black', borderWidth: 1, marginTop: -30, marginStart: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    }
})

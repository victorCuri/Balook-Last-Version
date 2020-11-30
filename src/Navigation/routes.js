import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { createStackNavigator, createAppContainer, createDrawerNavigator, DrawerActions } from 'react-navigation'
import Icon from 'react-native-vector-icons/Feather'

import ComporLook from '../telas/comporLook'
import Looks from '../telas/looks'
import MainMenu from '../telas/menuPrincipal'  
import Calendar from '../telas/calendario'

import Login from '../telas/auth'
import SignIn from '../telas/auth/signin'
import SignUp from '../telas/auth/signup'

import Perfil from '../telas/perfil'
import Sobre from '../telas/sobre'
import Ajuda from '../telas/ajuda'

import GuardaRoupa from '../telas/guarda-roupas'
import Camera from '../telas/guarda-roupas/adicionarPeça/camera'
import Acrescentar from '../telas/guarda-roupas/adicionarPeça/acrescentar'
import Publicar from '../telas/guarda-roupas/adicionarPeça/publicar'
import Display from '../telas/guarda-roupas/display-peça'
import DisplayLook from '../telas/display-look'
import Explorar from '../telas/explorar'

import DrawerScreen from './drawerRoutes'
import User from 'react-native-vector-icons/FontAwesome'
import Home from 'react-native-vector-icons/AntDesign'
import Mensage from '../assets/icons/Mensagem.svg'
import CameraIcon from '../assets/icons/Camera.svg'
import Logo from '../assets/images/logo-branca-recortada.png'


const DrawerRoutes = createDrawerNavigator({
 
    MenuPrincipal: MainMenu,
    GuardaRoupa: GuardaRoupa, 
    Perfil: Perfil,
    Sobre: Sobre,
    Ajuda: Ajuda, 

    MainMenu: MainMenu,
    Looks: Looks,
    ComporLook: ComporLook,
    Calendar: Calendar,

    Camera: Camera,
    Acrescentar: Acrescentar,
    Publicar: Publicar,
    Display: Display,
    DisplayLook: DisplayLook,
    Explorar: Explorar,


}, {
    contentComponent: DrawerScreen,
    },  
 
);

const StackRoutes = createStackNavigator({

    DrawerRoutes: { screen: DrawerRoutes },
    Login: { screen: Login },
    SignIn: { screen: SignIn },
    SignUp: { screen: SignUp },
    MainMenu: { screen: MainMenu },
    Looks: { screen: Looks },
    ComporLook: { screen: ComporLook },
    Calendar: { screen: Calendar },
    GuardaRoupa: { screen: GuardaRoupa },
    Camera: { screen: Camera },
    Acrescentar: { screen: Acrescentar },
    Publicar: { screen: Publicar },
    Display: { screen: Display },
    DisplayLook: { screen: DisplayLook },
    Explorar: { screen: Explorar },
    
    
 
},  
    {
        headerLayoutPreset: 'center',
        defaultNavigationOptions: ({ navigation }) => ({
            headerStyle: { 
                backgroundColor: "#C58882"
            },
            headerLeft: <Icon.Button  name="menu" size={30} color="white" backgroundColor="#C58882" onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer())} }/>,
            headerTitle: (
                <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => navigation.navigate('MenuPrincipal')}>
                    <Image source={Logo} style={{ flex: 1, resizeMode: 'contain', aspectRatio: 1  }}/>
                </TouchableOpacity>
            ),
            headerTitleStyle: {
                flex: 1,
                alignSelf: "center",
                justifyContent: "center",
            },
            headerRight: (
                <View style={{flexDirection: "row", justifyContent: "center", alignContent: "center"}}>
                    <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
                        <CameraIcon alignSelf={"center"} margin={10} height={27} width={27} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
                        <User name="user-circle-o" color={"white"} size={26} style={{margin: 10, alignSelf: "center"}}/>
                    </TouchableOpacity>
                </View>
            )
            
        })
    }
);
  
const App = createAppContainer(StackRoutes);

export default App;
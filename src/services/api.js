import axios from 'axios';

/* Endereços para cada emulador/simulador:
** Genymotion:              http://10.0.3.2:3333/
** Emulador Android Studio: http://10.0.2.2:3333/
** Simulador IOS:           http://localhost:3333/
*/

const api = axios.create({
  baseURL: 'http://ec2-54-172-125-206.compute-1.amazonaws.com:8080/',
});

export default api;
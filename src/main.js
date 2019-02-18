import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import axiosConfig from './common/axiosConfig.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import VueQriously from 'vue-qriously';//二维码

import './assets/style/style.css';

Vue.use(ElementUI);
Vue.use(VueQriously);
Vue.prototype.$axios = axios;
Vue.prototype.$axiosConfig = axiosConfig;
var vm = new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

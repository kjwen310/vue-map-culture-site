import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import VueSweetalert2 from 'vue-sweetalert2';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.component('Loading', Loading);
Vue.use(VueAxios, axios);
Vue.use(VueSweetalert2);
window.L = L;

new Vue({
  render: (h) => h(App),
}).$mount('#app');

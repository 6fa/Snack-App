import "@babel/polyfill";
import Es6Promise from "es6-promise";
Es6Promise.polyfill();
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "assets/scss/index.scss";

import "swiper/dist/css/swiper.css";

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

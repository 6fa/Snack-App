import axios from "axios";
import store from "@/store";

let instance = axios.create();

// 请求拦截器
instance.interceptors.request.use(function(config) {
  //判断是否存在token，存在则添加到header
  if (store.state.token) {
    // headers.common['X-Token']
    config.headers.Authorization = `token ${store.state.token}`;
  }
  return config;
});

export default instance;

import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import axiosInstance from "@/api/axios";
import { url, TIMEOUT } from "@/api/config";
Vue.use(VueRouter);

const routes = [
  {
    name: "home",
    path: "/home",
    component: () => import("pages/home"),
    meta: {
      keepAlive: true
    }
  },
  {
    name: "login",
    path: "/login",
    component: () => import("pages/login"),
    meta: {
      keepAlive: false //不需要被缓存
    }
  },
  {
    name: "publish",
    path: "/publish",
    component: () => import("pages/publish"),
    meta: {
      keepAlive: false,
      requiresAuth: true //需要被缓存
    }
  },
  {
    name: "personal",
    path: "/personal",
    component: () => import("pages/personal"),
    meta: {
      keepAlive: false,
      requiresAuth: true
    }
  },
  {
    name: "personalEdit",
    path: "/personal/edit",
    component: () => import("pages/personal/edit"),
    meta: {
      keepAlive: false
    }
  },
  {
    name: "search",
    path: "/search",
    component: () => import("pages/search"),
    meta: {
      keepAlive: false
    }
  },
  {
    name: "product",
    path: "/product",
    component: () => import("pages/product"),
    meta: {
      keepAlive: false
    },
    children: [
      {
        path: "submsg",
        name: "submsg",
        component: () => import("pages/product/subMsg")
      }
    ]
  },
  {
    path: "*",
    redirect: "/home"
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  let token = store.state.token;
  if (to.meta.requiresAuth) {
    if (token) {
      //检查token是否过期
      axiosInstance({
        url: url.checkTokenUrl,
        method: "post",
        timeout: TIMEOUT
      }).then(res => {
        if (res.data.code == "401") {
          //无效token
          store.dispatch("TOLOGOUT");
          next({
            path: "/login",
            query: { redirect: to.fullPath }
          });
        } else if (res.data.code == "200") {
          next();
        }
      });
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }

  if (to.path == "/home") {
    if (token) {
      axiosInstance({
        url: url.checkTokenUrl,
        method: "post",
        timeout: TIMEOUT
      }).then(res => {
        if (res.data.code == "401") {
          //无效token
          store.dispatch("TOLOGOUT");
        } else if (res.data.code == "200") {
          next();
        }
      });
    } else {
      if (window.localStorage.getItem("isloaded")) {
        store.dispatch("TOLOGOUT");
      }
      next();
    }
  }
});

export default router;

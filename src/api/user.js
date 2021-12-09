import axiosInstance from "./axios";
import { url, TIMEOUT } from "./config";

//注册
export const userRegister = data => {
  return axiosInstance({
    url: url.signUpUrl,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

//登录
export const userSignIn = data => {
  return axiosInstance({
    url: url.signInUrl,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

//注册时检查用户名是否已存在
export const isNameExisted = name => {
  return axiosInstance({
    url: url.checkNameUrl,
    method: "post",
    data: name,
    timeout: TIMEOUT
  })
};

//修改密码
export const modifyPassword = data => {
  return axiosInstance({
    url: url.modifyPwd,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

//检查密码是否一致
export const checkPassword = data => {
  return axiosInstance({
    url: url.checkPwdUrl,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

//获取某位用户信息
export const getUserInfo = data => {
  return axiosInstance({
    url: url.userinfo,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

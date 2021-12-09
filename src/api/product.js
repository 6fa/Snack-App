import axiosInstance from "./axios";
import { url, TIMEOUT } from "./config";

export const publishPd = data => {
  return axiosInstance({
    url: url.publishPd,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

export const getHotProducts = data => {
  return axiosInstance({
    url: url.getHotPd,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

export const getProducts = data => {
  return axiosInstance({
    url: url.getProducts,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

export const getUserPublish = data => {
  return axiosInstance({
    url: url.userPublish,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};
//用户删除发布商品
export const delUserPublish = data => {
  return axiosInstance({
    url: url.deleteUserPublish,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

//搜索商品
export const searchPd = data => {
  return axiosInstance({
    url: url.searchProduct,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

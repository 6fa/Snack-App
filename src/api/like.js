import axiosInstance from "./axios";
import { url, TIMEOUT } from "./config";

export const likeCtrl = data => {
  let trueUrl;
  if (data.type == 1) {
    trueUrl = url.addLike;
  } else if (data.type == 2) {
    trueUrl = url.cancelLike;
  }
  return axiosInstance({
    url: trueUrl,
    method: "post",
    data: data.data,
    timeout: TIMEOUT
  })
};

export const checkExisted = data => {
  let trueUrl;
  if (data.type == 1) {
    trueUrl = url.checkLike;
  } else if (data.type == 2) {
    trueUrl = url.checkCollect;
  }
  return axiosInstance({
    url: trueUrl,
    method: "post",
    data: data.data,
    timeout: TIMEOUT
  })
};

export const collectCtrl = data => {
  let trueUrl;
  if (data.type == 1) {
    trueUrl = url.addCollect;
  } else if (data.type == 2) {
    trueUrl = url.cancelCollect;
  }
  return axiosInstance({
    url: trueUrl,
    method: "post",
    data: data.data,
    timeout: TIMEOUT
  })
};

export const getUserCollect = data => {
  //得到用户收藏商品
  return axiosInstance({
    url: url.userCollect,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

export const delUserCollect = data => {
  //删除用户收藏商品
  return axiosInstance({
    url: url.deleteUserCollect,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

import axiosInstance from "./axios";
import { url, TIMEOUT } from "./config";

export const deleteMsg = data => {
  return axiosInstance({
    url: url.deleteMsg,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

export const submitMsg = data => {
  return axiosInstance({
    url: url.submitMsg,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

export const getMsgNum = data => {
  return axiosInstance({
    url: url.msgNum,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

export const getMsgContent = data => {
  return axiosInstance({
    url: url.msgContent,
    method: "post",
    data: data,
    timeout: TIMEOUT
  })
};

const BASEURL = "http://192.168.3.5:3000";
export const TIMEOUT = 10000;
export const url = {
  signUpUrl: BASEURL + "/register",
  signInUrl: BASEURL + "/login",
  userinfo: BASEURL + "/userinfo",
  checkNameUrl: BASEURL + "/checkname",
  checkPwdUrl: BASEURL + "/checkpwd",
  checkTokenUrl: BASEURL + "/checktoken",
  modifyPwd: BASEURL + "/modifypwd",

  publishPd: BASEURL + "/publishpd",
  getHotPd: BASEURL + "/gethotpd",
  getProducts: BASEURL + "/getpd",
  userPublish: BASEURL + "/userpublish",
  deleteUserPublish: BASEURL + "/deluserpublish",
  searchProduct: BASEURL + "/searchpd",

  submitMsg: BASEURL + "/submitmsg",
  msgNum: BASEURL + "/getmsgnum",
  msgContent: BASEURL + "/getmsg",
  deleteMsg: BASEURL + "/deletemsg",

  addLike: BASEURL + "/addlike",
  cancelLike: BASEURL + "/cancellike",
  checkLike: BASEURL + "/checklike",

  addCollect: BASEURL + "/addcollect",
  cancelCollect: BASEURL + "/cancelcollect",
  checkCollect: BASEURL + "/checkcollect",
  userCollect: BASEURL + "/usercollect",
  deleteUserCollect: BASEURL + "/delusercollect"
};
export const jsonpOptions = {
  param: "callback",
  timeout: TIMEOUT
};

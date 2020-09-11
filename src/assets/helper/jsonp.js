import jsonp from "jsonp";

const parserParam = param => {
  let params = [];
  for (let key in param) {
    params.push([key, params[key]]);
  }
  return params
    .map(val => {
      val.join("=");
    })
    .join("&");
};
export default (url, data, options) => {
  if (data) {
    url += (url.indexOf("?") < 0 ? "?" : "&") + parserParam(data);
  } else {
    console.log(data);
  }
  return new Promise((resolve, reject) => {
    jsonp(url, options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

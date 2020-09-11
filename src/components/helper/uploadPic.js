import axiosInstance from "@/api/axios.js";
function uploadPic(file, id, imgType) {
  let param = new FormData();
  param.append("file", file);
  param.append("id", id); // id为用户名/商品id
  param.append("imgType", imgType); // 1为头像/2为商品图

  // console.log('param.get("file")',param.get("file"));
  //FormData私有类对象，访问不到，可以通过get判断值是否传进去

  return axiosInstance({
    url: "http://192.168.3.5:3000/upload",
    method: "post",
    data: param,
    timeout: 10000,
    headers: { "Content-Type": "multipart/form-data" } //注意添加请求头
  })
    .then(res => {
      return new Promise(resolve => {
        resolve(res);
      });
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });
}
export default uploadPic;

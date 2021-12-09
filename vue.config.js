const path = require('path');//引入path模块
function resolve(dir){
    return path.join(__dirname,dir)//path.join(__dirname)设置绝对路径
}

module.exports = {
  transpileDependencies: ["webpack-dev-server/client"],
  chainWebpack: config => {
    config.entry.app = ["babel-polyfill", "./src/main.js"];
    config.resolve.alias
      .set("assets", resolve("src/assets"))
      .set("base", resolve("src/base"))
      .set("pages", resolve("src/pages"))
      .set("components", resolve("src/components"));
  },
  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:3001",      
  //       secure: false, // 如果是https接口，需要配置这个参数     
  //       changeOrigin: true, //是否跨域
       
  //       //如果本身的接口地址就有 '/api' 这种前缀，则替换为空字符
  //       pathRewrite: { 
  //         "^/api": ""
  //       }
  //     }
  //   }
  // }
};

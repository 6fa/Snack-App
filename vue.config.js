const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
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
  devServer: {
    proxy: {
      "/api": {
        target: "http://192.168.3.5:3000", //后台接口
        changeOrigin: true,
        // ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};

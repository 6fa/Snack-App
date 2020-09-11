// module.exports = {
//    presets: ["@vue/cli-plugin-babel/preset"],
// };

//z这四行是打包时删除 console 的配置，如不需要可以删除。
// const plugins = [];
// if (["production", "prod"].includes(process.env.NODE_ENV)) {
//   plugins.push("transform-remove-console");
// }

// module.exports = {
//   presets: [
//     ["@vue/cli-plugin-babel/preset"],
//     [
//       "@vue/app",
//       {
//         useBuiltIns: "entry",
//         polyfills: ["es6.promise", "es6.symbol"]
//       }
//     ]
//   ],
//   plugins: plugins
// };

module.exports = {
  presets: [
    ['@vue/app', {
        useBuiltIns: 'entry'
    }]
  ]
}

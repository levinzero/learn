const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "10",
        chrome: "64",
        firefox: "60",
        safari: "11.1",
      },
      useBuiltIns: "usage",  //@babel/polyfill 按需加载功能启用
      corejs: 3, // Babel7以上使用core-js@3进行@babel/polyfill的作用
    }
  ]
]

module.exports = { presets };
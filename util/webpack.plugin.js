const config = {data: {}}

//在构建html时的自写的一个插件
class InjectConfig {
  // 定义 `apply` 方法
  apply(compiler) {
    // webpack3
    compiler.plugin('compilation', function(compilation) {
      compilation.plugin('html-webpack-plugin-before-html-processing', function(data, callback) {
        console.log('InjectConfigPlugin is working')
        var insertScript = `<script>window.__page_config__=${JSON.stringify(config.data)}</script><script src="${config.data}"></script>`
        var insertReg = '</head>';
        data.html = data.html.replace(insertReg, insertScript + insertReg)
        callback(null, data);
      });
    });
  }
}

module.exports = InjectConfig
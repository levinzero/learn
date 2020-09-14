import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import Router from './router';

renderWithHotReload(Router);


/*热更新*/
if (module.hot) { // 3、热更新操作
  module.hot.accept("./router/index.js", () => {
    const Router = require("./router/index.js").default;
    renderWithHotReload(Router);
  });
}

function renderWithHotReload(Router) {   //定义渲染函数
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AppContainer>,
    document.getElementById("root")
  );
}
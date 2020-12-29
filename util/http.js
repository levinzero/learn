import axios, {} from 'axios';
import { config } from 'src/utils/config';
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status < 599; // default
},
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export class HttpMiddleware {
  fnCompleteß;
  source;
  fnCatch;
  mockData;
  constructor(fn, customResolve) {
    const self = this;
    function resolve(url, res) {
      // 实例化时可自定义默认处理方式
      if (customResolve) {
        return customResolve.call(self, url, res)
      }
      // then接受所有情况
      !!self.fnComplete && self.fnComplete(self.mockData || res);
      self.mockData = void 0;
      if (res.status >= 400) {
        if (!!self.fnCatch) {
          // 调用catch即可覆盖默认错误处理并自定义
          self.fnCatch(res);
        } else {
          // 默认错误处理
          if (res.config.method == 'get') {
            const path = url.replace(config.api.host, '');
            if (/\/users\/identity/.test(path)) {
              return false;
            }
          }
          // 未登录自动跳转
          if (res.status === 401 && /(User-Not-Sign@Platform-User)|(User-Not-Authentication@User-Authorization)/.test(res.data.error_code)) {
            // do login
            return false;
          }
          // 默认错误提示
          PubSub.publish('show_tips', res.data.error_message);
        }
      }
    }
    function reject(url, error) {
      console.error('request error: \n' + 'url: ' + url + '\n', error);
    }
    function abort(source) {
      self.source = source;
    }
    return fn(resolve, reject, abort);
  }
  then (done) {
    this.fnComplete = done;
    return this;
  }
  mock (mockResponse) {
    this.mockData = mockResponse;
    return this;
  }
  catch (done) {
    this.fnCatch = done;
    return this;
  }
  abort () {
    const source  = this.source;
    source.cancel('API is aborted.');
    return this;
  }
}

class Http {
  request;
  constructor({customResolve, apiHost}) {
    this.request = function(opt) {
      return new HttpMiddleware((resolve, reject, abort) => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        if (opt.url.match(/^~/)) {
          opt.url = opt.url.replace(/^~/, '');
        } else if (!opt.url.match('http')) {
          opt.url = (apiHost ? apiHost : config.api.origin) + opt.url;
        } 
        opt.headers = {...opt.headers};
          if (!!localStorage.token) {
            localStorage.removeItem('token');
            opt.headers.Authorization = 'Bearer ' + '';
          }
        axios.request({cancelToken: source.token, ...opt}).then((res) => {
              resolve(opt.url, res);
            }).catch((error) => {
              reject(opt.url, error);
            });
        abort(source);
      }, customResolve);
    };
  }
  get(url, configs) {
    return this.request({
      method: 'get',
      url: url,
      ...configs,
    });
  }
  post(url, data, configs) {
    return this.request({
      method: 'post',
      url: url,
      data: data,
      ...configs,
    });
  }
  put(url, data, configs) {
    return this.request({
      method: 'put',
      url: url,
      data: data,
      ...configs,
    });
  }
  patch(url, data, configs) {
    return this.request({
      method: 'patch',
      url: url,
      data: data,
      ...configs,
    });
  }
  delete(url, configs) {
    return this.request({
      method: 'delete',
      url: url,
      ...configs,
    });
  }
}

export const API = new Http();
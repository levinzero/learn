var GWC = {
  version: '1.1.1',
  urlParams: {},
  appendParams: function (url, params) {
    if (params) {
      var baseWithSearch = url.split('#')[0];
      var hash = url.split('#')[1];
      for (var key in params) {
        var attrValue = params[key];
        if (attrValue !== undefined) {
          var newParam = key + "=" + attrValue;
          if (baseWithSearch.indexOf('?') > 0) {
            var oldParamReg = new RegExp('^' + key + '=[-%.!~*\'\(\)\\w]*', 'g');
            if (oldParamReg.test(baseWithSearch)) {
              baseWithSearch = baseWithSearch.replace(oldParamReg, newParam);
            } else {
              baseWithSearch += "&" + newParam;
            }
          } else {
            baseWithSearch += "?" + newParam;
          }
        }
      }
      if (hash) {
        url = baseWithSearch + '#' + hash;
      } else {
        url = baseWithSearch;
      }
    }
    return url;
  },
  getUrlParams: function () {
    var pairs = location.search.substring(1).split('&');
    for (var i = 0; i < pairs.length; i++) {
      var pos = pairs[i].indexOf('=');
      if (pos === -1) {
        continue;
      }
      GWC.urlParams[pairs[i].substring(0, pos)] = decodeURIComponent(pairs[i].substring(pos + 1));
    }
  },
  doRedirect: function () {
    var code = GWC.urlParams['code'];
    var appId = GWC.urlParams['appid'];
    var scope = GWC.urlParams['scope'] || 'snsapi_base';
    var state = GWC.urlParams['state'];
    var isMp = GWC.urlParams['isMp'];
    var baseUrl;
    var redirectUri;
    if (!code) {
      baseUrl = "https://open.weixin.qq.com/connect/oauth2/authorize#wechat_redirect";
      if (scope == 'snsapi_login' && !isMp) {
        baseUrl = "https://open.weixin.qq.com/connect/qrconnect";
      }
      redirectUri = GWC.appendParams(baseUrl, {
        'appid': appId,
        'redirect_uri': encodeURIComponent(location.href),
        'response_type': 'code',
        'scope': scope,
        'state': state,
      });
    } else {
      redirectUri = GWC.appendParams(GWC.urlParams['redirect_uri'], {
        'code': code,
        'state': state
      });
    }
    location.href = redirectUri;
  }
};
GWC.getUrlParams();
GWC.doRedirect();
"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/web.timers");

var fn = function fn() {
  return 1;
}; // ES6箭头函数, 返回值为1


var num = Math.pow(3, 2); // ES7求幂运算符

var foo = function foo(a, b, c) {
  // ES7参数支持尾部逗号
  console.log('a:', a);
  console.log('b:', b);
  console.log('c:', c);
};

foo(1, 3, 4);
console.log(fn());
console.log(num);
var promise = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(10);
  }, 1000);
});
promise.then(function (res) {
  return console.log(res);
});
//回调函数的方式，其实利用了发布-订阅模式，模拟实现node的Event模块来写实现回调函数机制
function EventEmitter() {
  this.events = new Map();
}

const wrapCallback = (fn, once = false) => ({callback: fn, once: once});

EventEmitter.prototype.addListener = function(type, fn, once = false) {
  const handler = this.events.get(type);
  if(!handler) {
    this.events.set(type, wrapCallback(fn, once));
  }else if(handler && typeof handler.callback === 'function') {
    this.events.set(type, [handler, wrapCallback(fn, once)]);
  }else {
    handler.push(wrapCallback(fn, once));
  }
};

EventEmitter.prototype.once = function(type, fn) {
  this.addListener(type, fn, true);
}

EventEmitter.prototype.removeListener = function(type, fn) {
  const handler = this.events.get(type);
  if(!handler) {return};
  if(!Array.isArray(handler)) {
    if(handler.callback === fn.callback) {
      this.events.delete(type);
      return;
    }else {
      return;
    }
  }
}
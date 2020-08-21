let Promise = function (excutor) {
  const _this = this;
  _this.status = 'pending';
  _this.value = undefined;
  _this.reason = undefined;
  _this.onFulfilledCallback = [];
  _this.onRejectedCallback = [];

  function resolve(value) {
    console.log('resolve called ' + value);
    if(_this.status === 'pending') {
      _this.status = 'resolved';
      _this.value = value;
      _this.onFulfilledCallback.forEach(fn => {
        fn();
      });
    }
  }

  function reject(reason) {
    if(_this.status === 'pending') {
      _this.status = 'rejected';
      _this.reason = reason;
      _this.onRejectedCallback.forEach(fn => {
        fn();
      })
    }
  }

  excutor(resolve, reject);
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  let _this = this;
  console.log('then prototype')
  if (_this.status === 'pending') {   //处理异步动作的关键点
    _this.onFulfilledCallback.push(function() {
      onFulfilled(_this.value);
    });
    _this.onRejectedCallback.push(function() {
      onRejected(_this.reason);
    })
  }
  if(_this.status === 'resolved') {
    onFulfilled(_this.value);
  }

  if(_this.status === 'rejected') {
    onRejected(_this.reason);
  }
}

const promi = new Promise(function(resolve, reject){
  setTimeout(() => {
    resolve('test');
  }, 1000);
});

promi.then((value) => {
  console.log('数据为: ' + value);
}, (err) => {
  console.log('失败：' + err);
});
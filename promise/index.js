function myPromise(excutor) {
  this.status = 'PENDING';
  this.value = null;
  this.error = null;
  this.onResolveCallback = [];
  this.onRejectCallback = [];
  var _this = this;

  function resolve(value) {
    if (_this.status === 'PENDING') {
      setTimeout(function(){
        _this.status = 'FULLFILLED';
        _this.value = value;
        _this.onResolveCallback.forEach((fn) => {
          fn(_this.value)
        })
      })
    }
  }

  function reject(error) {
    if (_this.status === 'PENDING') {
      setTimeout(function () {
        _this.status = 'REJECTED';
        _this.error = error;
        _this.onRejectCallback.forEach((fn) => fn(_this.error));ß
      })
    }
  }

  excutor(resolve, reject);
}

function resolvePromise(x, resolve, reject) {
  if (x instanceof myPromise) {
    if (x.status === 'PENDING') {
      x.then(y => {
        resolvePromise(y, resolve, reject);
      }, error => reject(error));
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}

myPromise.prototype.then = function (onFulfilled, onRejected) {
    if (this.status === 'PENDING') {
      return bridgePromise = new myPromise((resolve, reject) => {
        this.onResolveCallback.push(
          (value) => {
            try {
              var x = onFulfilled(value);
              resolvePromise(bridgePromise, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          })
        this.onRejectCallback.push(
          (error) => {
            try {
              var x = onRejected(error);
              resolvePromise(bridgePromise, x, resolve, reject);
            } catch (error) {
              onRejected(error);
            }
          }
        )
        });
      }
      if (this.status === 'FULLFILLED') {
        return bridgePromise = new myPromise((resolve, reject) => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      }

      if (this.status === 'REJECTED') {
        var bridgePromise = new myPromise((resolve, reject) => {
          try {
            const x = onRejected(this.error);
            resolvePromise(bridgePromise, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      }

    }

myPromise.prototype.all = function(promises) {
  return new myPromise((resolve, reject) => {
    let result = [];
    let len = promises.length;
    if(len === 0) {
      resolve(result);
      return;
    }

    function handleData(data, index) {
      result[index] = data;
      if(index === len - 1) resolve(result);
    }

    for(let i = 0; i < len; i++) {
      myPromise.resolve(promises[i]).then((data) => {
        handleData(data, i);
      }).catch(error => {
        reject(error);
      })
    }
  })
}

myPromise.prototype.resolve = function(param) {
  if(param instanceof Promise) return param;
  return new myPromise((resolve, reject) => {
    if(param && param.then && typeof param.then === 'function') {
      param.then(resolve, reject);
    } else {
      resolve(param);
    }
  })
}

myPromise.prototype.reject = function(reson) {
  return new myPromise((resolve, reject) => {
    reject(reson);
  })
}

myPromise.prototype.race = function(promises) {
  return new myPromise((resolve, reject) =>{
    var len = promises.length;
    if(len === 0) return;

    for(var i = 0; i <len; i++) {
      myPromise.resolve(promises[i]).then(data => {
        resolve(data);
        return;
      }).catch (error => {
        reject(error);
        return;
      })
    }
  })
}
var promise = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('123');
  }, 3000)
});

promise.then((value) =>{
  console.log(value);
});

setTimeout(() => {
  promise.then((value) =>{
    console.log(value + 2);
  })
}, 4000);
promise.then((value) => {
  console.log(value + 1);
})

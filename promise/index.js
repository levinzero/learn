function myPromise(excutor) {
  this.status = 'PENDING';
  this.value = null;
  this.error = null;
  this.onResolveCallback = [];
  this.onRejectCallback = [];
  var _this = this;

  function resolve(value) {
    if (_this.status === 'PENDING') {
      _this.status = 'FULLFILLED';
      _this.value = value;
      _this.onResolveCallback.forEach((fn) => {
        fn(_this.value)
      })
    }
  }

  function reject(error) {
    if (_this.status === 'PENDING') {
      _this.status = 'REJECTED';
      _this.error = error;
      _this.onRejectCallback.forEach((fn) => fn(_this.error));
    }
  }

  excutor(resolve, reject);
}

function resolvePromise(bridgePromise, x, resolve, reject) {
  if (x instanceof myPromise) {
    x.then(y => {
      return resolvePromise(bridgePromise, y, resolve, reject);
    })
  }
}

myPromise.prototype.then = function (onFulfilled, onRejected) {
  if(this.status === 'PENDING') {
    this.onResolveCallback.push(
      () => {
        return new myPromise((resolve, reject) => {
          try {
            var x = onFulfilled(this.value);
            resolve(x);
          } catch (error) {
            reject(error);
          }
        })
      }
    );
    this.onRejectCallback.push(onRejected);
  }

  if(this.status === 'FULLFILLED') {
    onFulfilled(this.value);
  }

  if(this.status === 'REJECTED') {
    onRejected(this.value);
  }

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

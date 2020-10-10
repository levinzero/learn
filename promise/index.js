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
  if(this.status === 'PENDING') {
    this.onResolveCallback.push(
      () => {
        new myPromise((resolve, reject) => {
          try {
            var x = onFulfilled(this.value);
            resolvePromise(x,  resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      }
    );
    this.onRejectCallback.push((error) => onRejected(error));
  }

  if(this.status === 'FULLFILLED') {
    new Promise((resolve, reject) => {
      try {
        const x = onFulfilled(this.value);
        resolvePromise(x, resolve, reject);
      } catch (error) {
        reject(error);
      }
    })
  }

  if(this.status === 'REJECTED') {
    new myPromise((resolve, reject) => {
      try {
        const x = onRejected(this.value);
        resolvePromise(x, resolve, reject);
      } catch (error) {
        reject(error);
      }
    })
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

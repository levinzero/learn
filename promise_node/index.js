function MyPromise(excutor) {
  const self = this;
  this.value = null;
  this.error = null;
  this.status = 'PENDING';
  this.onFulfilled = null;
  this.onRejected = null;

  function resolve(value) {
    if(self.status === 'PENDING') {
      self.value = value;
      self.status = 'FULLFILLED';
      self.onFulfilled(value);
    }
  }

  function reject(reason) {
    if(self.status === 'PENDING') {
      self.error = reason;
      self.status = 'REJECTED';
      self.onRejected(reason);
    }
  }

  excutor(resolve, reject);
}
  
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if(this.status === 'PENDING') {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  } else if(this.status === 'REJECTED') {
    onRejected(this.reason);
  } else {
    onFulfilled(this.value);
  }

  return this;
}

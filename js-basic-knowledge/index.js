Array.prototype.map = function (callBackFn, thisArg) {
  if (this === null || this === undefined) {
    throw "this cant be null or undefined";
  }
  if (Object.prototype.toString.call(callBackFn) != "[object Function]") {
    throw "this cant";
  }

  var O = Object(this);
  var T = thisArg;
  var len = O.length >>> 0;
  var A = new Array(len);
  
  

  var k = 0;
  for (; k < len; k++) {
    if(k in O) {
      let Kvalue = O[k];
      let mappedValue = callBackFn.call(T, Kvalue, k, O);
      A[k] = mappedValue;
    }
  }
  return A;
}

Array.prototype.reduce = function(callbackFn, initialValue) {
  if (this === null || this === undefined) {
    throw "this cant be null or undefined";
  }

  if (Object.prototype.toString.call(callbackFn) !== "[object Function]") {
    throw "callbackFn isnt a function";
  }

  var O = Object(this);
  var l = O.length >>> 0;
  var k = 0;
  var accumulator = initialValue;

  if(accumulator === undefined) {
    for(; k < l; k++) {
      if(k in O) {
        accumulator = O[k];
        k++;
        break;
      }
    }
  }
  
  for (; k < l; k++) {
    if (k in O) {
      let kValue = O[k];
      accumulator = callbackFn.call(undefined, accumulator, O[k], O);
    }
  }
  return accumulator;
}

Array.prototype.splice = function(position, deleteCount, ...addElements) {
  var O = Object(this);
  var len = O.length >>> 0;
  var  deleteArr = new Array(deleteCount);
  function sliceDeleteElements(array, startIndex, deleteCount, deleteArr) {
    for (var i = 0; i < deleteCount; i++) {
      var index = startIndex + i;
      var currentValue = array[index];
      deleteArr[i] = currentValue;
    }
  }

  function movePostElements(array, startIndex, len, deleteCount, addElements) {
    if (deleteCount == addElements.length) return;
    if (deleteCount < addElements.length) {
      for (let index = len  + addElements.length - deleteCount; index > startIndex; index--) {
        array[index] = array[index - (addElements.length - deleteCount)];
      }
    } else {
      for (let index = startIndex + deleteCount - addElements.length; index < len - deleteCount + addElements.length; index++) {
        array[index] = array[index + (deleteCount - addElements.length)];
      }
      for(let j = len - 1; j >= len  - deleteCount + addElements.length; j--) {
        delete array[j];
      }
    }
  }
  sliceDeleteElements(O, position, deleteCount, deleteArr);
  
  movePostElements(O, position, len, deleteCount, addElements);

  for(let k = 0; k < addElements.length; k++) {
    let index = position + k;
    O[index] = addElements[k];
  }
  O.length = len - deleteCount + addElements.length;

  return deleteArr;
}

Array.prototype.filter = function(callbackFn, thisArg) {
  if(this === null || this === undefined) {
    throw 'this isnt a array';
  }

  if(Object.prototype.toString.call(callbackFn) !== '[object Function]') {
    throw 'callback isnt a function';
  }

  let O = Object(this);
  let len = O.length;
  let returnArr = [];
  let returnArrLen = 0;
  for(let i = 0; i < len; i++) {
    if(callbackFn.call(thisArg, O[i], i, O)) {
      returnArr[returnArrLen++] = O[i];
    }
  }
  return returnArr;
}

var b = [1,2,3].map((item, index, array) => item + 1);
var result = [1, 2, 3].reduce((preAccumulator, currentValue, array) => {
  return preAccumulator + currentValue;
})

var t = [1,2,3,4,5,6,7,8,9];
var newResult = t.splice(1, 1);


var p = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(1);
  }, 3000);
})

p.then(function (value) {
  console.log('1:' + value);
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(2);
      
    }, 1500);
  })
}).then(function (value) {
  console.log('2:' + value);
})


Function.prototype.myBind = function(context, ...args) {
  if (typeof this !== 'function') {
    return new Error('myBind is only use with a function');
  }
  const _this = this;
  const fn = function() {};

  var fbind = function() {
    _this.apply(this instanceof _this ? this: context, args.concat(Array.prototype.slice.call(arguments)));
  }
  fn.prototype = this.prototype;
  fbind.prototype = new fn();
  return fbind;
}

function C() {
  return this.name;
}

C.prototype.saySex = function() {
  console.log(this.sex);
}

const obj = {name: 'foo', age: '16', sex: 'male', saySex: function() {
  console.log(this.sex);
}}; 

const newObj = {name: 'foo1', age: '16', sex: 'female'}; 

const tb = C.myBind(obj);
const v = tb();

const fun = obj.saySex;
const newsaysex = fun.myBind(newObj);
newsaysex();
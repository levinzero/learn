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
      for (let index = startIndex + deleteCount - addElements.length; index < len + deleteCount - addElements.length; index++) {
        array[index] = array[index + (deleteCount - addElements.length)];
      }
      for(let j = len - 1; j >= len  - deleteCount - addElements.length; j--) {
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

var b = [1,2,3].map((item, index, array) => item + 1);
var result = [1, 2, 3].reduce((preAccumulator, currentValue, array) => {
  return preAccumulator + currentValue;
})

var t = [1,2,3,4,5,6,7,8,9];
var newResult = t.splice(1, 1);


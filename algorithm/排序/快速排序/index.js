
//解法1
function quickSort(arr) {
  if(arr.length <= 1) {
    return arr;
  }
  var left = [];
  var right = [];
  var target = 0;
  for (var i = 1; i < arr.length; i++) {
    if(arr[i] < arr[target]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat(arr[target], quickSort(right));
}
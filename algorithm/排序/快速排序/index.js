
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

//解法2
function quickSort2(arr, start = 0, end) {
  //recurse teminator
  if(end - start < 1) {
    return;
  }
  //each step same resolve the array
  let end = r;
  let start = l;
  let target = arr[start];
  while(l < r) {
    while(l < r && arr[r] > target) {
      r--;
    }
    arr[l] = arr[r];
    while(l < r && arr[l] < target) {
      l++;
    }
    arr[r] = arr[l];
  }
  arr[l] = target;
  //dive into the recurse
  quickSort2(arr, 0, l - 1);
  quickSort2(arr, l + 1, end);
  return arr;
}
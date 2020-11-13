function insertSort(arr) {
  for (var i = 1; i < arr.length; i++) {
    var target = i;
    for (var j = i - 1; j >= 0; j--) {
      if(arr[target] < arr[j]) {
        var temp = arr[j];
        arr[j] = arr[target];
        arr[target] = temp;
        target = j;
      } else {
        break;
      }
    }
  }
  return arr;
}
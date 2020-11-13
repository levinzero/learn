function binarySearch(arr, start, end, data) {
  if(start > end) {
    return -1;
  }
  var mid = Math.floor((start + end) / 2);
  if (data < arr[mid]) {
    return binarySearch(arr, start, mid - 1, data);
  } else if(data > arr[mid]) {
    return binarySearch(arr, mid + 1, end, data);
  } else {
    return mid;
  }
}

var arr = [0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
binarySearch(arr, 0, arr.length - 1, 6);
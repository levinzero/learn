//N皇后问题

/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function (n) {
  const result = [];
  const path = [];
  for (var i = 0; i < n; i++) {
    path[i] = '';
    for (var j = 0; j < n; j++) {
      path[i] += '.';
    }
  }

  function backTrack(row, path) {
    if (row == path.length) {
      result.push(path.slice(0));
      return;
    }

    for (var i = 0; i < path.length; i++) {
      if (!isValid(row, i, path)) {
        continue;
      }
      path[row] = changeStr(path[row], i, 'Q');
      backTrack(row + 1, path);
      path[row] = changeStr(path[row], i, '.');
    }
  }
  backTrack(0, path);
  return result;
};

function isValid(row, col, path) {
  var n = path.length;
  for (var i = 0; i < n; i++) {
    if (path[i][col] == 'Q') {
      return false;
    }
  }
  for (var i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
    if (path[i][j] == 'Q') {
      return false;
    }
  }
  for (var i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (path[i][j] == 'Q') {
      return false;
    }
  }
  return true;
}
function changeStr(str, index, changeStrElement) {
  return str.substr(0, index) + changeStrElement + str.substr(index + 1);
}
solveNQueens(4);
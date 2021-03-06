const fn = () => 1; // ES6箭头函数, 返回值为1
let num = 3 ** 2; // ES7求幂运算符
let foo = function (a, b, c, ) { // ES7参数支持尾部逗号
  console.log('a:', a)
  console.log('b:', b)
  console.log('c:', c)
}
foo(1, 3, 4)
console.log(fn());
console.log(num);

const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(10);
  }, 1000);
})

promise.then((res) => console.log(res));

class Test {
  constructor(value) {
    this.num = value;
  }

  add(y) {
    return this.num + y;
  }
}

const test = new Test(1);
test.add(2);
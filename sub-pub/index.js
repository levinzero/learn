//1、使用数组方式
// let crop = {};
// crop.list = [];

// crop.on = function(fn) {
//     this.list.push(fn);
// }

// crop.emit = function() {
//     this.list.forEach((cb) => {
//         cb.apply(this, arguments);
//     })
// }


// crop.on((position, salary) => {
//     console.log('position: ' + position);
//     console.log('salary: ' + salary);
// })

// crop.on((skill, hobby) => {
//     console.log('skill: ' + skill);
//     console.log('hobby: ' + hobby);
// })

// crop.emit('前端', 20000);
// crop.emit('公务员', 30000);
//以上模式会导致所有on的订约事件全部调用，所以不适合

// 2、使用对象模式
// let crop = {};
// crop.list = {};

// crop.on = function(key, fn) {
//     if(this.list[key])
// }




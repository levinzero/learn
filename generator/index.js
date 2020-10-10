const fs = require('fs');

const readFileThunk = (filename) => {
    return (callback) => {
        fs.readFile(filename, callback);
    }
}

const gen = function* () {
    console.log('gen start');
    const data1 = yield readFileThunk('001.txt');
    console.log(data1.toString());
    const data2 = yield readFileThunk('002.txt');
    console.log(data2.toString());
}

let g = gen();
g.next().value((error, data) => {
    // console.log(data);
    g.next(data).value((error, data1) => {
        // g.next(data1);
    })
})
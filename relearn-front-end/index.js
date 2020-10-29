var red = document.querySelector('.red');
var yellow = document.querySelector('.yellow');
var green = document.querySelector('.green');

var sleep = function (delay) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  })
}

async function trafficLight() {
  await sleep(3000);
  green.classList.remove('green-active');
  yellow.classList.add('yellow-active');
  await sleep(1000);
  yellow.classList.remove('yellow-active');
  red.classList.add('red-active');
  await sleep(3000);
  red.classList.remove('red-active');
  green.classList.add('green-active');
  trafficLight();
}

trafficLight();
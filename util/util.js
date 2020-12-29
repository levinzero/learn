//常用的query查询方法
export function queryObj(url) {
  const queryMatch = url.match(/([^?=&]+)(=([^&]*))/g);
  return !!queryMatch && queryMatch.reduce((a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {});
}

//简易版moment
// 简易版moment代替moment.js
class Moment {
  date;
  constructor(arg = new Date().getTime()) {
    this.date = new Date(arg);
  }
  padStart(num) {
    num = String(num);
    if (num.length < 2) {
      return '0' + num;
    } else {
      return num;
    }
  }
  unix() {
    return Math.round(this.date.getTime() / 1000);
  }
  static unix(timestamp) {
    return new Moment(timestamp * 1000);
  }
  format(formatStr) {
      const date = this.date;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const week = date.getDay();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const weeks = ['一', '二', '三', '四', '五', '六', '日'];

      return formatStr.replace(/Y{2,4}|M{1,2}|D{1,2}|d{1,4}|h{1,2}|m{1,2}|s{1,2}/g, (match) => {
          switch (match) {
          case 'YY':
              return String(year).slice(-2);
          case 'YYY':
          case 'YYYY':
              return String(year);
          case 'M':
              return String(month);
          case 'MM':
              return this.padStart(month);
          case 'D':
              return String(day);
          case 'DD':
              return this.padStart(day);
          case 'd':
              return String(week);
          case 'dd':
              return weeks[week];
          case 'ddd':
              return '周' + weeks[week];
          case 'dddd':
              return '星期' + weeks[week];
          case 'h':
              return String(hour);
          case 'hh':
              return this.padStart(hour);
          case 'm':
              return String(minute);
          case 'mm':
              return this.padStart(minute);
          case 's':
              return String(second);
          case 'ss':
              return this.padStart(second);
          default:
              return match;
          }
      });
  }
}

export const moment = (arg) => {
  return new Moment(arg);
};

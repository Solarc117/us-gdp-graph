'use strict';
console.clear();
function log() {
  console.log('📄', ...arguments);
}
function warn() {
  console.warn('⚠', ...arguments);
}
function error() {
  console.error('❌', ...arguments);
}

function timeToDecimal(yearMonthDay) {
  const [year, month] = yearMonthDay.split('-').map(item => +item);
  const decimal = (month - 1) / 12;

  return year + decimal;
}

timeToDecimal('2002-01-01');
timeToDecimal('2002-04-01');
timeToDecimal('2007-07-21');
timeToDecimal('2015-10-07');
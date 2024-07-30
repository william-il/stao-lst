import 'decimal.js';
import Decimal from 'decimal.js';

function main() {
  let dec = new Decimal(0.5);
  console.log('dec: ', dec, ' -> ', dec.round());
  dec = new Decimal(0.5);
  let dec2 = new Decimal(-233.5);
  console.log('dec: ', dec, ' -> ', dec.floor());
  console.log('-dec: ', dec2, ' -> ', dec2.round());
  console.log('-dec: ', dec2, ' -> ', dec2.floor());
  console.log('dec: ', dec, ' -> ', dec.toFixed(0));
  console.log('-dec: ', dec2, ' -> ', dec2.toFixed(0));
  Decimal.set({ rounding: Decimal.ROUND_DOWN });
  console.log('dec: ', dec, ' -> ', dec.toFixed(0));
  console.log('-dec: ', dec2, ' -> ', dec2.round().toFixed(0));
}

main();

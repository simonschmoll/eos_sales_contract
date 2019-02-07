const data = [
  'salescon',
  'salescon2',
  'salescon3',
  'salescon4',
  'salescon5',
  'salescona',
  'salesconb',
  'salesconc',
  'salescond',
  'salescone',
  'salesconf',
  'salescong',
  'salesconh',
  'salesconh',
  'salesconj',
  'salesconj',
  'salesconk',
  'salesconl',
  'salesconm',
  'salesconn',
  'salescono',
];

let counter = 0;

exports.getAccountName = () =>  data[counter];

exports.increment= function () {
  counter++;
} 
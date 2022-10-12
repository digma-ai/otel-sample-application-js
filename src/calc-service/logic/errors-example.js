function doAthing() {
  byDoingSomethingElse();
}

function byDoingSomethingElse() {
  throw new Error('oops!');
  // throw 'abc';
  // undefined.substring(1); // throws a TypeError
  // throw {
  //   prop: 'random property'
  // }
}

// add the code below
module.exports = { doAthing };

const globalTracer = require('../tracer');

async function add(...nums) {
  return await globalTracer.startActiveSpan('calc add', async span => {
    const sum = nums.reduce((total, num) => total + num);
    span.end();
    return sum;
  });
}

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
module.exports = {
  add,
};

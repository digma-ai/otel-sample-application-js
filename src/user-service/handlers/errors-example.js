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

class BadError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadError';
  }
}

class TerribleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TerribleError';
  }
}

function throwRandomError() {
  if(Math.random() < 0.5) {
    throw new BadError();
  }
  else {
    throw new TerribleError();
  }
}

// add the code below
module.exports = {
  doAthing,
  throwRandomError,
};

function doAthing() {
  byDoingSomethingElse();
}

function byDoingSomethingElse() {
  throw new Error('oops!');
}

// add the code below
module.exports = { doAthing };

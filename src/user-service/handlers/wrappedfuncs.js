async function doSomethingElse(c,d) {
  return c + d;
}

async function doSomething(a,b) {
  return a + b;
}

module.exports = {
  doSomething,
  doSomethingElse
}
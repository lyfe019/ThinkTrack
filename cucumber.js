module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['tests/e2e/features/**/*.ts'],
    paths: ['tests/e2e/features/**/*.feature'],
    format: ['progress', 'summary'],
    publishQuiet: true
  }
};

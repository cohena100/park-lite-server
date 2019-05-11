const enumValue = (name) => Object.freeze({
  toString: () => name
});

module.exports = {
  enumValue
};
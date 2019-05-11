const enumValue = (name) => Object.freeze({
  toString: () => name
});

const Colors = Object.freeze({
  RED: enumValue("Colors.RED"),
  BLUE: enumValue("Colors.BLUE"),
  GREEN: enumValue("Colors.GREEN")
});

console.log(Colors.RED.toString());
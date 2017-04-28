
///////////////
// Arguments //
///////////////

exports.arguments = [];
// General //
exports.arguments.Program = ["number"];
exports.arguments.Strict = ["number"];
// Creation //
exports.arguments.primitive = ["primitive", "number"];
exports.arguments.closure = ["reference", "number"];
exports.arguments.object = ["reference", "number"];
exports.arguments.array = ["reference", "number"];
exports.arguments.regexp = ["reference", "number"];
// Environment //
exports.arguments.Declare = ["string", ["string"], "number"];
exports.arguments.read = ["string", "reference", "number"];
exports.arguments.write = ["string", "any", "reference", "number"];
exports.arguments.Enter = ["number"];
exports.arguments.Leave = ["number"];
exports.arguments.with = ["any", "number"];
// Apply //
exports.arguments.apply = ["any", "any", ["any"], "number"]
exports.arguments.construct = ["any", ["any"], "number"];
exports.arguments.Arguments = ["reference", "number"];
exports.arguments.return = ["any", "number"];
exports.arguments.eval = [["any"], "number"];
exports.arguments.unary = ["string", "any", "number"];
exports.arguments.binary = ["string", "any", "any", "number"];
// Object //
exports.arguments.get = ["any", "any", "number"];
exports.arguments.set = ["any", "any", "any", "number"];
exports.arguments.delete = ["any", "any", "number"];
exports.arguments.enumerate = ["any", "number"];
// Control //
exports.arguments.test = ["any", "number"];
exports.arguments.Label = ["string", "number"];
exports.arguments.Break = ["string", "number"];
exports.arguments.throw = ["any", "number"];
exports.arguments.Try = ["number"];
exports.arguments.catch = ["any", "number"];
exports.arguments.Finally = ["number"];
exports.arguments.sequence = [["any"], "number"];
exports.arguments.expression = ["any", "number"];

////////////
// Result //
////////////

exports.result = {};
exports.result.with = "reference";
exports.result.eval = "string";
exports.result.enumerate = ["any"];
exports.result.test = "boolean";
[ "primitive",
  "closure",
  "object",
  "array",
  "regexp",
  "read",
  "write",
  "apply",
  "construct",
  "return",
  "unary",
  "binary",
  "get",
  "set",
  "delete",
  "throw",
  "catch",
  "sequence",
  "expression"
].forEach(function (k) { exports.result[k] = "any" });


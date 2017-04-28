
var Kalah = require("kalah");
var TrapTypes = require("./trap-types.js");

module.exports = function (melf, aran, traps) {
  var kalah = Kalah(melf);
  melf.sync.register("aran", function (origin, data, callback) {
    callback(null, kalah.export(aran));
  });
  Object.keys(TrapTypes.arguments).forEach(function (k) {
    var t1 = TrapTypes.arguments[k];
    var t2 = TrapTypes.result[k];
    melf.sync.register("aran-"+k, function (origin, data, callback) {
      var x = traps[k].apply(null, kalah.import(data, t1));
      callback(null, t2 ? kalah.export(x, t2) : null);
    });
  });
};

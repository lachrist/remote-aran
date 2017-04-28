var Kalah = require("kalah");
var TrapTypes = require("./trap-types.js");

module.exports = function (melf, master) {
  var kalah = Kalah(melf);
  var aran = kalah.import(melf.sync.emit(master, "aran", null));
  var namespace = aran.namespace;
  global[namespace] = {};
  Object.keys(TrapTypes.arguments).forEach(function (k) {
    var t1 = TrapTypes.arguments[k];
    var t2 = TrapTypes.result[k];
    global[namespace][k] = function () {
      var x = melf.sync.emit(master, "aran-"+k, kalah.export(arguments, t1));
      if (t2) {
        return kalah.import(x, t2);
      }
    };
  });
  return aran;
};

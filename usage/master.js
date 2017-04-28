var Aran = require("aran");
var Melf = require("melf/node");
var Master = require("remote-aran/master");
var Minimist = require("minimist");

var options = Minimist(process.argv.slice(2));

var traps = {};
traps.array = function (arr) {
  var a = [];
  for (var i=0; i<arr.length; i++)
    a[i] = arr[i];
  return a;
};
traps.apply = function (fct, ths, args, idx) {
  var line = aran.node(idx).loc.start.line
  console.log(fct.name+"@"+line);
  return fct.apply(ths, args);
};

var aran = Aran({
  namespace: "_aran_",
  traps: Object.keys(traps),
  loc: true
});

var melf = Melf({
  debug: true,
  format: JSON,
  url: options.url,
  alias: options["master-alias"],
  splitter: options.splitter
});

Master(melf, aran, traps);

process.send("ready");

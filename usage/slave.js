// node monolothic.js --script path/to/script.js --splitter splitter --url /path/to/socket --master-alias master --slave-alias slave

var Slave = require("remote-aran/slave");
var Melf = require("melf/node");
var Minimist = require("minimist");
var Fs = require("fs");

var options = Minimist(process.argv.slice(2));

var melf = Melf({
  debug: true,
  format: JSON,
  splitter: options.splitter,
  url: options.url,
  alias: options["slave-alias"]
});

var slave = Slave(melf, options["master-alias"]);

global.eval(slave.instrument(Fs.readFileSync(options.script, "utf8"), "spirouu"));

process.send("done");

setInterval(function () { console.log("wesh") }, 1000);

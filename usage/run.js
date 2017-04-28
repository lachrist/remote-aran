
var Fs = require("fs");
var Http = require("http");
var Ws = require("ws");
var MelfHijack = require("melf/hijack");
var Slave = require("remote-aran/slave");
var ChildProcess = require("child_process");

var options = {
  "script": __dirname+"/spirou.js",
  "splitter": "aran",
  "url": __dirname+"/socket",
  "master-alias": "master", 
  "slave-alias": "slave"
};

var stdio = ["ignore", process.stdout, process.stderr, "ipc"];

var mhijack = MelfServer(options.splitter);
mhijack.on("authentify", function (alias) { console.log(alias+" authentified") });
mhijack.on("connect", function (alias) { console.log(alias+" connected") });
mhijack.on("disconnect", function (alias) { console.log(alias+ " disconnected") });
var server = Http.createServer(mhijack.request);
(new Ws.Server({server:server})).on("connection", mhijack.socket);
server.listen(options.url, function () {
  var master = ChildProcess.fork(__dirname+"/master.js", [
    "--splitter", options.splitter,
    "--url", options.url,
    "--master-alias", options["master-alias"]
  ], {stdio:stdio});
  master.on("message", function () {
    var slave = ChildProcess.fork(__dirname+"/slave.js", [
      "--splitter", options.splitter,
      "--url", options.url,
      "--master-alias", options["master-alias"],
      "--slave-alias", options["slave-alias"],
      "--script", options.script
    ], {stdio:stdio});
    slave.on("message", function () {
      master.kill("SIGINT");
      slave.kill("SIGINT");
      server.close();
    });
  });
});

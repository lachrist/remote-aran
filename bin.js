
var Chalk = require("chalk");
var Stream = require("stream");
var Fs = require("fs");
var Path = require("path");
var ChildProcess = require("child_process");

var Browserify = require("browserify");

function transform (f, ws) {
  return new Stream.Writable({
    write: function (chunk, encoding, callback) {
      return encoding === "buffer"
        ? ws.write(f(chunk.toString()), "utf8", callback)
        : ws.write(f(chunk, encoding), callback);
    }
  });
}

// remote-aran --master [--alias master] --boxdir /path/to/boxdir [--wait 10] --traps /path/to/traps

// remote-aran --node 

// remote-aran --mitm

// remote-aran --slave  [--alias slave]  [--master-alias master] [--namespace] --boxdir /path/to/boxdir [--wait 10]


module.exports = function () {




};




// killall -9 node ; node bin.js --tierless playground/tierless/dsquare.js --boxdir ../../boxes/ --analysis ./playground/analysis.js --wait 10
// killall -9 node ; node bin.js --tierless playground/tierless/binary.js --port 9000 --boxdir ../../boxes/ --wait 10

var Fs = require("fs");
var Path = require("path");
var ChildProcess = require("child_process");
var Minimist = require("minimist");
var Stream = require("stream");
var Chalk = require("chalk");

var Split = require("./split.js");
var BoxFile = require("./box/box-file.js");
var Protocol = require("./protocol.js");
var Reference = require("./reference.js");

function spawn (name, color, args) {
  console.log("Spawing "+name+"@"+color+" as: node "+args.join(" "));
  var child = ChildProcess.spawn("node", args);
  child.stdout.pipe(transform(Chalk[color], process.stdout));
  child.stderr.pipe(transform(Chalk[color], process.stderr));
  child.on("exit", function () { console.log("exit@"+name) });
  child.on("error", function () { console.log("error@"+name) });
  process.on("SIGINT", function () { child.kill("SIGINT") });
  return child;
}

var options = Minimist(process.argv.slice(2));
if (!("tierless" in options && "boxdir" in options)) {
  process.stderr.write([
    "Wrong usage, understood arguments are:",
    "   --tierless path/to/tierless.js   |",
    "   --boxdir /base/dir              |",
    "  [--analysis /path/to/analysis.js] | if omitted, debugger mode",
    "  [--debugger-port 8080]            |",
    "  [--namespace _aran_]              |",
    "  [--master-alias master]           |",
    "  [--wait 100]                      | delay between pulls [ms]"
  ].join("\n")+"\n");
  process.exit(1);
}
options.namespace = options.namespace || "_aran_";
options.boxdir = Path.resolve(options.boxdir);
options.wait = String(options.wait || 100);
if ("analysis" in options)
  options.analysis = Path.resolve(options.analysis);
options["master-alias"] = options["master-alias"] || "master";
options["debugger-port"] = options["debugger-port"] || 0;

console.log("Options: "+JSON.stringify(options, null, 2));

Fs.readdirSync(options.boxdir).forEach(function (name) {
  Fs.unlinkSync(options.boxdir+"/"+name);
});

// We MUST spawn the master tier in a separate v8
// so that if it synchronously wait for reppply,
// it does not prevent other tiers to communicate
// error reports and logs.
(function () {
  var args = [
    "--boxdir", options.boxdir,
    "--alias", options["master-alias"],
    "--wait", options.wait
  ];
  if ("analysis" in options) {
    options["trap-names"] = Object.keys(require(options.analysis));
    args.unshift(__dirname+"/master/master-analysis.js");
    args.push("--analysis", options.analysis);
  } else {
    options["trap-names"] = ["apply", "construct", "binary", "unary"];
    args.unshift(__dirname+"/master/master-debugger.js");
    if ("port" in options)
      args.push("--port", options.port);
  }
  spawn(options["master-alias"], "red", args);
} ());

// Wait for the master to listen to pings...
setTimeout(function () {
  var tiers = Split(Fs.readFileSync(options.tierless, "utf8"));
  Object.keys(tiers).forEach(function (name) {
    if (tiers[name].platform === "node") {
      var args = [__dirname+"/deploy/deploy-node.js"];
    } else {
      var parts = /^browser:([0-9]+)$/.exec(tiers[name].platform);
      if (!parts)
        throw new Error("Cannot deploy on platform "+tiers[name].platform);
      var args = [__dirname+"/deploy/deploy-browser.js", "--port", parts[1]]
    }
    var child = spawn(name, tiers[name].color, args.concat([
      "--boxdir", options.boxdir,
      "--alias", name,
      "--master-alias", options["master-alias"],
      "--wait", options.wait,
      "--namespace", options.namespace
    ].concat(options["trap-names"])));
    child.stdin.write(JSON.stringify(tiers[name].program));
    child.stdin.end();
  });
}, 500);

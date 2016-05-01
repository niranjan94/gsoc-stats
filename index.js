var Parser = require("./src/parser");
var fs = require('fs');
var analyzer = require("./src/analyzer");

var parser = new Parser();
var currentPath = "./data/2016";
var files = fs.readdirSync(currentPath);
for (var i in files) {
    var currentFile = currentPath + '/' + files[i];
    var stats = fs.statSync(currentFile);
    if (stats.isFile()) {
        parser.parseAndAppend(fs.readFileSync(currentFile));
    }
}

console.log("Basic Statistics:");
console.log("=================");
console.log("Organizations : " + parser.getOrganizations().length);
console.log("Projects      : " + parser.getProjects().length);
console.log("\nStarting analysis");
analyzer.analyse(parser);
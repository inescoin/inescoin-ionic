const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/webpack/configs/browser.js';
// const fserver = 'node_modules/@angular-devkit/build-angular/src/webpack/configs/server.js';


fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  // var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');

  var result = data.replace(/node: false/g, "node: {fs: 'empty', global: true, crypto: true, tls: 'empty', net: 'empty', process: true, module: false, clearImmediate: false, setImmediate: false}");
  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});


// fs.readFile(fserver, 'utf8', function (err,data) {
//   if (err) {
//     return console.log(err);
//   }
//   // var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true}');

//   var result = data.replace(/node: false/g, "node: {fs: 'empty', global: true, crypto: true, tls: 'empty', net: 'empty', process: true, module: false, clearImmediate: false, setImmediate: false}");
//   fs.writeFile(fserver, result, 'utf8', function (err) {
//     if (err) return console.log(err);
//   });
// });

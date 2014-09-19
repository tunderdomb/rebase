var gutil = require("gulp-util")
var File = gutil.File;
var through = require("through2")
var PluginError = gutil.PluginError

var rebase = require("../rebase")

module.exports = function ( options ){
  return through.obj(function( file, enc, done ){
    if ( file.isNull() ) return // ignore
    if ( file.isStream() ) return this.emit("error", new PluginError("gulp-concat", "Streaming not supported"))

    var rebased = rebase(file.contents.toString(), options)
    this.push(new File({
      cwd: file.cwd,
      base: file.base,
      path: file.path,
      contents: new Buffer(rebased)
    }))
    done()
  })
}
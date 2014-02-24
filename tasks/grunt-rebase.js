/*
 * grunt-rebase
 *
 * Copyright (c) 2014 tunderdomb
 * Licensed under the MIT license.
 */

'use strict';

var rebase = require("../rebase")
var path = require("path")

module.exports = function ( grunt ){

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('rebase', 'No description', function (){

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      references: "",
      filter: false
    })
    var references = [] // referenced sources
      , files = {}      // file content cache
      , dests = {}      // src-dest maps
      , count = 0
      , skipped = 0

    // Iterate over all specified file groups.
    this.files.forEach(function ( filePair ){
      var base = filePair.base || options.base
        , reference = filePair.reference || options.reference
      // iterate sources and process them
      filePair.src.forEach(function ( src ){
        if( !grunt.file.exists(src) || !grunt.file.isFile(src) ) return
        var locals = []
          , dest = filePair.dest || src
        // skip files that doesn't need rebasing (like images)
        if ( !filePair.scopes ) grunt.file.copy(src, dest)
        // or cache the rebased contents
        else {
          files[src] = rebase(grunt.file.read(src), filePair.scopes, locals)
          dests[src] = dest
          ++count
          // remap references
          if ( base ) {
            locals = locals.map(function( src ){
              return path.join(base, src).replace(/[\/\\]+/g, "/")
            })
          }
          if( typeof reference == "string" ) {
            locals = locals.concat(grunt.file.expand(reference))
          }
          else if( reference === true ) {
            locals.push(src)
          }
          // add them to the global list
          references = references.concat(locals)
        }
      })
    })

    // filter dupes
    references = references.filter(function( item, pos ){
      return references.indexOf(item) == pos
    })

    var src
    // filter cached contents and only write referenced ones
    if ( options.filter ) for( src in files ){
      if( !!~references.indexOf(src) )
        grunt.file.write(dests[src], files[src])
      else {
        --count
        // free memory immediately
        files[src] = null
      }
    }
    // or write every file
    else for( src in files ){
      grunt.file.write(src, files[src])
    }
    console.log("Rebased "+count+" files.", skipped ? "Skipped "+skipped+"." : "")
  })
}
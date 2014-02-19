/*
 * grunt-rebase
 *
 * Copyright (c) 2014 tunderdomb
 * Licensed under the MIT license.
 */

'use strict';

var rebase = require("rebase")

module.exports = function ( grunt ){

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('rebase', 'No description', function (){

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      script: null,
      link: null,
      a: null,
      img: null,
      url: null,
      imports: null
    })

    // Iterate over all specified file groups.
    this.files.forEach(function ( filePair ){
      var dest = filePair.dest

      filePair.src.forEach(function ( src ){
        if( !grunt.file.exists(src) ) return
        if ( dest ) {
          if ( grunt.util._.endsWith(dest, "/") ) {

          }
          else {

          }
        }
        else dest = src
        grunt.file.write(dest, rebase(grunt.file.read(src), options))
      })
    })
  })
}
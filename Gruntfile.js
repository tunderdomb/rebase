module.exports = function ( grunt ){

  grunt.initConfig({
    copy: {
      test: {
        files: [{
          expand: true,
          cwd: "test/src/css/",
          src: "*.*",
          dest: "test/dest/static/style/"
        }, {
          expand: true,
          cwd: "test/src/js/",
          src: "*.*",
          dest: "test/dest/static/script/"
        }, {
          expand: true,
          cwd: "test/src/img/",
          src: "*.*",
          dest: "test/dest/static/images/"
        }, {
          expand: true,
          cwd: "test/src/",
          src: "*.html",
          dest: "test/dest/"
        }]
      }
    },
    rebase: {
      noscope: {
        expand: true,
        cwd: "test/src/css/",
        src: "*.css",
        dest: "test/dest/static/style/"
      },
      scoped: {
        options: {
          // filter unreferenced files
          filter: true,
          // prepend this base to every reference
          base: "test/src/"
        },
        files: [{
          expand: true,
          cwd: "test/src/css/",
          src: "*.css",
          dest: "test/dest/static/style/",
          // match glob pattern and add them to references
          reference: "test/src/css/*.css",
          scopes: {
            url: {
              "/?img": "/static/images",
              "/?font": "/static/fonts"
            }
          }
        }, {
          expand: true,
          cwd: "test/src/",
          src: "*.html",
          dest: "test/dest/",
          // add processed files to references
          reference: true,
          scopes: {
            url: {
              "/?img": "/static/images",
              "/?font": "/static/fonts"
            },
            a: {
              "/?img": "/static/images"
            },
            img: {
              "/?img": "/static/images"
            },
            link: {
              "/?css": "/static/style"
            },
            script: {
              "/?js": "/static/script"
            }
          }
        }, {
          expand: true,
          cwd: "test/src/img/",
          src: "*.*",
          dest: "test/dest/static/images/"
        }, {
          expand: true,
          cwd: "test/src/js/",
          src: "*.*",
          dest: "test/dest/static/script/"
        }]
      }
    }
  })

  grunt.loadTasks('tasks')
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask("default", ["rebase"])
//  grunt.registerTask("default", ["copy", "rebase"])
}
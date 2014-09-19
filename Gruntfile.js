module.exports = function ( grunt ){

  grunt.initConfig({
    rebase: {
      noscope: {
        expand: true,
        cwd: "test/src/css/",
        src: "*.css",
        dest: "test/dest/static/style/"
      },
      scoped: {
        // global options
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

  grunt.registerTask("default", ["rebase"])
}
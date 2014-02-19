module.exports = function ( grunt ){

  grunt.initConfig({
    rebase: {
      nodest: {
        options: {
          script: [],
          link: [],
          a: [],
          img: [],
          url: [],
          imports: []
        },
        src: ["test/test.html"]
      }
    }
  })

  grunt.registerTask("default", [])
}
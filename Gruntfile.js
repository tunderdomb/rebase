module.exports = function ( grunt ){

  grunt.initConfig({
    rebase: {
      nodest: {
        options: {
          script: {
            "base": "rebase"
          },
          link: [{
            base: "",
            rebase: ""
          }],
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
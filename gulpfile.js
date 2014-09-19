var gulp = require("gulp")
var rebase = require("./tasks/gulp-rebase")

gulp.task("rebase-html", function(  ){
  gulp.src("test/src/*.html")
    .pipe(rebase({
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
    }))
    .pipe(gulp.dest("test/dest/"))
})

gulp.task("default", ["rebase-html"])
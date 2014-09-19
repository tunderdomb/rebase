Rebase
=======

## What is this?

Rebase helps you refactor urls in files.
Let it be a script src attribute or a url() in a css rule.
Tell it what scope you want the replace to happen.
It is essentially `String.replace()` smarty-pants.

## Scopes

### script

  Matches script tags, and their sources.

```html
  <script type="text/javascript" src="/static/script/test.js"></script>
```

### link

  Matches stylesheet links and their href attribute's value.

```html
  <link rel="stylesheet" href="/static/style/css.css"/>
```

### a

  Matches html link tags and their href attribute's value.

```html
  <a href="..."></a>
```

### img

  Matches image elements and their source value.

```html
  <img src="..." alt="test"/>
```

### url

  Matches `url()` resource links in css.

```css
#test-1{
  background: url("...");
}
```

## Install

    npm install rebase --save-dev

## Usage

```js
var rebase = require("../rebase")
var contents = ""
var scopes = {}
var rebasedContents = rebase(contents, scopes)
```

## Gulp task

```js
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
```

## Grunt task

    grunt.loadNpmTasks('grunt-rebase');

## Usage

In the grunt task, define a `scope` object on the file object.
The keys will be converted to a RegExp pattern, and matched against the source files
the task runs on. The values of the `scope`'s properties will be replace value of `"".replace(pattern, replacement)`.


```js

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

```

## LICENCE

Copyright (c) 2014 Nagy Zoltan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
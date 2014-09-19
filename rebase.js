/**
 *  Rebase.js
 * */

/**
 * rebase
 * @param content{String}
 * @param options{Object}
 * @param references{String} [optional]
 * */
var rebase = module.exports = function( content, options ){
  if( !options ) return content
  for( var scope in options ){
    var rewriter = rebase[scope]
    scope = options[scope]
    if( rewriter && scope ) {
      if ( scope.forEach ) {
        scope.forEach(function( rule ){
          if ( rule.tag ) {
            content = rebase.tag(content, rule.tag, rule.attr, rule.base, rule.rebase)
          }
          else {
            content = rewriter(content, rule.base, rule.rebase)
          }
        })
      }
      else {
        for( var base in scope ){
          content = rewriter(content, base, scope[base])
        }
      }
    }
  }
  return content
}

/**
 * "any string"
 * */
rebase.string = function( content, search, replace ){
  search = new RegExp("^"+search)
  return content.replace(/('|")((?:\\\1|.)*?)\1/g, function( match, str, inside ){
    if ( search.test(inside) ) {
      inside = inside.replace(search, replace)
    }
    return str + inside + str
  })
}

/**
 * <tag attr="">
 * */
var tag = rebase.tag = function( content, tag, attr, search, replace ){
  tag = new RegExp("<"+tag+"([^>]+)>", 'g') // capture attribute space
  attr = new RegExp("("+attr+')\\s*=\\s*"\\s*([^"]+)\\s*"') // capture attribute name and value
  search = new RegExp("^"+search)
  return content.replace(tag, function( match ){
    return match.replace(attr, function( match, attr, value ){
      if ( search.test(value) ) {
        return attr+'="'+value.replace(search, replace)+'"'
      }
      else return match
    })
  })
}

/**
 * <script type="text/javascript" src=""></script>
 * */
rebase.script = function( content, search, replace ){
  return tag(content, "script", "src", search, replace)
}

/**
 * <link rel="stylesheet" href=""/>
 * */
rebase.link = function( content, search, replace ){
  return tag(content, "link", "href", search, replace)
}

/**
 * <a href=""></a>
 * */
rebase.a = function( content, search, replace ){
  return tag(content, "a", "href", search, replace)
}

/**
 * <img src="" alt=""/>
 * */
rebase.img = function( content, search, replace ){
  return tag(content, "img", "src", search, replace)
}

/**
 * background-image: url("");
 * */
rebase.url = function( content, search, replace ){
  search = new RegExp("^"+search)
  return content.replace(/url\(\s*['"]?([^\)]+?)['"]?\s*\)/g, function( match, url ){
    if ( search.test(url) ) {
      return "url(\""+url.replace(search, replace)+"\")"
    }
    else return match
  })
}

/**
 * @import "";
 * */
rebase.imports = function( content, search, replace ){
  search = new RegExp("^"+search)
  return content.replace(/@import\s+"([^")]+)"/g, function( match, url ){
    if ( search.test(url) ) {
      return "@import \""+url.replace(search, replace)+"\""
    }
    else return match
  })
}
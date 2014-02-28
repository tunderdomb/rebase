/**
 *  Rebase.js
 * */

/**
 *
 * */
function reference( src, refs ){
  src = src.replace(/[\/\\]+/g, "/")
//  src = src.replace(new RegExp("^/".replace(/(\/+|\\+)$/, "")), "/").replace(/[\/\\]+/g, "/")
  if( !~refs.indexOf(src) ) refs.push(src)
}

/**
 * rebase
 * @param content{String}
 * @param options{Object}
 * @param references{String} [optional]
 * */
var rebase = module.exports = function( content, options, references ){
  if( !options ) return content
  for( var scope in options ){
    if( rebase[scope] && options[scope] ) {
      if ( options[scope].forEach ) {
        options[scope].forEach(function( rule ){
          content = rebase[scope](content, rule.base, rule.rebase, references)
        })
      }
      else {
        for( var base in options[scope] ){
          content = rebase[scope](content, base, options[scope][base], references)
        }
      }
    }
  }
  return content
}

/**
 * String
 * */
rebase.string = function( content, search, replace, references ){
  search = new RegExp("^"+search)
  return content.replace(/('|")([^\1]+?)\1/g, function( match, str, inside ){
    if ( search.test(inside) ) {
      references && reference(inside, references)
      inside = inside.replace(search, replace)
    }
    return str + inside + str
  })
}

/**
 *
 * */
var tag = rebase.tag = function( content, tag, attr, search, replace, references ){
  tag = new RegExp("<"+tag+"([^>]+)>", 'g') // capture attribute space
  attr = new RegExp("("+attr+')\\s*=\\s*"\\s*([^"]+)\\s*"') // capture attribute name and value
  search = new RegExp("^"+search)
  return content.replace(tag, function( match ){
    return match.replace(attr, function( match, attr, value ){
      if ( search.test(value) ) {
        references && reference(value, references)
        return attr+'="'+value.replace(search, replace)+'"'
      }
      else return match
    })
  })
}

/**
 *
 * */
rebase.script = function( content, search, replace, references ){
  return tag(content, "script", "src", search, replace, references)
}

/**
 *
 * */
rebase.link = function( content, search, replace, references ){
  return tag(content, "link", "href", search, replace, references)
}

/**
 *
 * */
rebase.a = function( content, search, replace, references ){
  return tag(content, "a", "href", search, replace, references)
}

/**
 *
 * */
rebase.img = function( content, search, replace, references ){
  return tag(content, "img", "src", search, replace, references)
}

/**
 *
 * */
rebase.url = function( content, search, replace, references ){
  search = new RegExp("^"+search)
  return content.replace(/url\(\s*['"]?([^\)]+?)['"]?\s*\)/g, function( match, url ){
    if ( search.test(url) ) {
      references && reference(url, references)
      return "url(\""+url.replace(search, replace)+"\")"
    }
    else return match
  })
}

/**
 *
 * */
rebase.imports = function( content, search, replace, references ){
  search = new RegExp("^"+search)
  return content.replace(/@import\s+"([^")]+)"/g, function( match, url ){
    if ( search.test(url) ) {
      references && reference(url, references)
      return "@import \""+url.replace(search, replace)+"\""
    }
    else return match
  })
}
/**
 *  Rebase.js
 * */

/**
 *
 * */
function reference( src, refs ){
  src = src.replace(new RegExp("^/".replace(/(\/+|\\+)$/, "")), "/").replace(/[\/\\]+/g, "/")
  refs[src] = true
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
    if( rebase[scope] ) {
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
 *
 * */
rebase.isReferenced = function( src, references ){
  src = src.replace(new RegExp("^/".replace(/(\/+|\\+)$/, "")), "/").replace(/[\/\\]+/g, "/")
  return references[src] !== undefined
}

/**
 *
 * */
rebase.tag = function( content, tag, attr, search, replace, references ){
  tag = new RegExp("<"+tag+"([^>]+)>", 'g') // capture attribute space
  attr = new RegExp("("+attr+')\\s*=\\s*"\\s*([^"]+)\\s*"') // capture attribute name and value
  return content.replace(tag, function( match ){
    return match.replace(attr, function( match, attr, value ){
      references && reference(value, references)
      return attr+'="'+value.replace(search, replace)+'"'
    })
  })
}

/**
 *
 * */
rebase.script = function( content, base, rebase, references ){
  return rebase.tag(content, "script", "src", base, rebase, references)
}

/**
 *
 * */
rebase.link = function( content, base, rebase, references ){
  return rebase.tag(content, "link", "href", base, rebase, references)
}

/**
 *
 * */
rebase.a = function( content, base, rebase, references ){
  return rebase.tag(content, "a", "href", base, rebase, references)
}

/**
 *
 * */
rebase.img = function( content, base, rebase, references ){
  return rebase.tag(content, "img", "src", base, rebase, references)
}

/**
 *
 * */
rebase.url = function( content, base, rebase, references ){
  return content.replace(/url\(\s*['"]?\s*([^\)]+)\s*['"]?\s*\)/, function( match, url ){
    references && reference(url, references)
    return "url(\""+url.replace(base, rebase)+"\")"
  })
}

/**
 *
 * */
rebase.imports = function( content, base, rebase, references ){
  base = new RegExp("^"+base)
  return content.replace(/@import\s+"([^")]+)"/, function( match, url ){
    references && reference(url, references)
    return "@import \""+url.replace(base, rebase)+"\""
  })
}
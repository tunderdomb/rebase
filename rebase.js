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
  if( options.script ) options.script.forEach(function( rule ){
    content = rebase.script(content, rule.base, rule.rebase, references)
  })
  if( options.link ) options.link.forEach(function( rule ){
    content = rebase.link(content, rule.base, rule.rebase, references)
  })
  if( options.a ) options.a.forEach(function( rule ){
    content = rebase.a(content, rule.base, rule.rebase, references)
  })
  if( options.img ) options.img.forEach(function( rule ){
    content = rebase.img(content, rule.base, rule.rebase, references)
  })
  if( options.url ) options.url.forEach(function( rule ){
    content = rebase.url(content, rule.base, rule.rebase, references)
  })
  if( options.imports ) options.imports.forEach(function( rule ){
    content = rebase.imports(content, rule.base, rule.rebase, references)
  })
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
  attr = new RegExp("("+attr+')="([^"]+)"') // capture attribute name and value
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
  base = new RegExp("^"+base)
  return content.replace(/url\(([^\)]+)\)/, function( match, url ){
    references && reference(url, references)
    return "url("+url.replace(base, rebase)+")"
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
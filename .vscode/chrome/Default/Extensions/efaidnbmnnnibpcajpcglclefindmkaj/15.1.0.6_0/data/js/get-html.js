function receiveIframe(a){"use strict";dc.wrap(dc.receiveIframe)(a)}function serialize(a){"use strict";var b=a.frameID;b===window.WINDOW_ID&&window.setTimeout(dc.wrap(dc._serialize),0,a)}var dc={Deferred:function(a,b){"use strict";var c=this,d=a||new Promise(function(a,d){c.resolve=function(){c.timer&&clearTimeout(c.timer),a()},c.reject=function(){c.timer&&clearTimeout(c.timer),d&&d()},b&&(c.timer=setTimeout(dc.wrap(function(){c.time_out=!0,delete c.timer,c.resolve()}),6e4))});return this.promise=function(){return d},this.clearTimer=function(){this.timer&&clearTimeout(c.timer)},this.then=function(a){return d.then(a)},this.done=function(a){return d.then(a,a)},this},cloneTime:{},promises:[],URIs:{},uriCounter:0,doc_prefix:"",analytics:[],iframesToProcess:[],postData:null,topWindow:window.self===window.top,output:{refs:[],origin:location.origin,currentSize:0,hasError:!1},wrap:function(a,b){"use strict";var c=function(){var a;try{return this.func.apply(this.context,this.args.concat(Array.prototype.slice.call(arguments,0)))}catch(b){throw b.handled||(b.handled=!0,a="DCBrowser:Error:JS:"+b.stack.match(/get-html\.js:(\d*):(\d*)/)[0]+":"+b.message.replace(/\s/g,"_").replace(/"\S*?"/g,""),console.log(a),chrome.runtime.sendMessage({progress_op:"html-blob",main_op:OP,error_analytics:a,error:"web2pdfHTMLJSError"})),b}};return c.bind({func:a,context:b||{},args:Array.prototype.slice.call(arguments,1)})},random:function(){"use strict";return"W"+Math.ceil(1e5*Math.random()).toString()},log:function(a){"use strict";DEBUG&&console.log(a)},getDomain:function(a){"use strict";var b=document.createElement("a");return b.href=a,b.origin},utf8ByteLength:function(a){"use strict";if(!a)return 0;var b=encodeURI(a),c=b.match(/%/g);return c?b.length-2*c.length:b.length},resolveURL:function(a,b){"use strict";return a?(b=b.trim(),0===b.search(/https?:\/\//)?b:0===b.indexOf("//")?b:0===b.indexOf("/")?dc.getDomain(a)+b:a+"/"+b):b},registerURI:function(a,b,c){"use strict";var d=0===c?"refs/"+dc.doc_prefix:dc.doc_prefix,e="."+b.replace(/[\?#]\S*/,"").split(".").pop();return(e.length>5||1===e.length)&&(e=""),b=dc.resolveURL(a,b),dc.URIs[b]?dc.URIs[b]:(dc.URIs[b]={placeholder:d+dc.uriCounter.toString()+e},dc.uriCounter+=1,dc.URIs[b])},getType:function(a,b){"use strict";var c="image";return b.endsWith(".ttf")?(dc.analytics.push("FONT_TTF"),c="font"):b.endsWith(".otf")?(dc.analytics.push("FONT_OTF"),c="font"):b.endsWith(".woff")?(dc.analytics.push("FONT_WOFF"),c="font"):b.endsWith(".eot")&&(dc.analytics.push("FONT_EOT"),c="font"),"text/xml"===a||"application/vnd.ms-fontobject"===a?(dc.analytics.push("FONT_EOT"),c="font"):"font/woff2"===a&&(dc.analytics.push("FONT_WOFF2"),c="font"),a.startsWith("image/svg")&&(c="svg_image",dc.analytics.push("SVG_IMAGE")),c},readImage:function(a,b){"use strict";var c;a.status<400?(b.type=dc.getType(a.response.type,b.placeholder),EXCLUDE.indexOf(b.type)!==-1?(b.data=null,b.promise.resolve()):(c=new FileReader,c.onloadend=dc.wrap(function(a){b.promise.time_out||(b.data=a.target.result,b.promise.resolve())}),c.readAsDataURL(a.response))):(dc.log("FAILED to load: "+a.responseURL),dc.log("Placeholder: "+b.placeholder),b.promise.resolve())},getDataURI:function(a,b,c){"use strict";if(0===b.indexOf("data:"))return b;if(!b)return b;var d,f,e=dc.registerURI(a,b,c);return e.promise?e.placeholder:(d=new XMLHttpRequest,e.promise=new dc.Deferred(null,!0),dc.promises.push(e.promise),f=dc.resolveURL(a,b).replace(/^https?:/,""),d.open("GET",f,!0),d.responseType="blob",d.onload=dc.wrap(function(a){e.promise.time_out||dc.readImage(this,e)},d),d.send(),e.placeholder)},replaceURL:function(a,b,c){"use strict";var d=new RegExp(a.replace(/([\.\^\$\*\+\?\(\)\[\{\\\|])/g,"\\$1"),"g");return c.replace(d,b)},replaceCssRefs:function(a,b,c){"use strict";function d(a){var b=a.split("/");return b.length<4?a:b.slice(0,-1).join("/")}var f,g,i,e=d(a),h=[],j=/([\s\S]{0,10})url\s*\(([\s\S]*?)\)/gm;for(b=b.replace(/\/\*[\s\S]*?\*\//gm,""),f=j.exec(b);f;)i=f[2],g=i.replace(/('|")/g,""),i&&0!==g.indexOf("data:")&&h.push({url:g,imprt:f[1].indexOf("@import")!==-1,originalURL:i}),f=j.exec(b);return h.forEach(dc.wrap(function(a){b=a.imprt?"acro-html"===OP?dc.replaceURL(a.originalURL,dc.resolveURL(e,a.url),b):dc.replaceURL(a.originalURL,dc.getCSSDataURI(e,a.url,c+1),b):"acro-html"===OP?dc.replaceURL(a.originalURL,dc.resolveURL(e,a.url),b):dc.replaceURL(a.originalURL,dc.getDataURI(e,a.url,c+1),b)})),b},getCSSDataURI:function(a,b,c){"use strict";if(0===b.indexOf("data:"))return b;var d,f,e=dc.registerURI(a,b,c);return e.promise?e.placeholder:(e.promise=new dc.Deferred(null,!0),dc.promises.push(e.promise),d=new XMLHttpRequest,f=dc.resolveURL(a,b).replace(/^https?:/,""),d.open("GET",f,!0),d.responseType="blob",d.onload=dc.wrap(function(a){var b;if(this.status<400){if("text/css"!==this.response.type)return void dc.readImage(this,e);b=new FileReader,b.onloadend=function(a){e.type="css",e.promise.clearTimer(),e.promise.time_out||(e.data=dc.replaceCssRefs(f,a.target.result,c),e.promise.resolve())},b.readAsText(this.response)}else dc.log("CSS FAILED to load: "+d.responseURL+"   Placeholder: "+e.placeholder),e.promise.resolve()},d),d.send(),e.placeholder)},processStyleAttr:function(a){"use strict";var b=a.getAttribute?a.getAttribute("style"):"";b&&a.setAttribute("style",dc.replaceCssRefs(document.location.origin,b,-1))},resolveRefs:function(a,b){"use strict";var c,d,e,f,g;if("LINK"===a.tagName&&a.href&&(g=(a.type||"")+(a.rel||""),g.includes("icon")||g.includes("image")?dc.log("skipped icon image"):a.href=dc.getCSSDataURI(null,a.href,0)),e=b.attributes)for(c=0;c<e.length;c+=1)0===e[c].name.toLowerCase().indexOf("on")&&a.removeAttribute(e[c].name);if(["IMG","INPUT"].indexOf(a.tagName)!==-1&&(a.dataset._html_to_pdf_src_=dc.getDataURI(null,a.src,0),a.removeAttribute("src")),"INPUT"===a.tagName&&"file"!==a.type&&a.setAttribute("value",b.value),"INPUT"!==a.tagName||"radio"!==a.type&&"checkbox"!==a.type||(a.removeAttribute("checked"),b.checked&&a.setAttribute("checked","checked")),"OPTION"===a.tagName&&(a.removeAttribute("selected"),b.selected&&a.setAttribute("selected","selected")),"svg"===a.tagName&&dc.analytics.push("SVG"),"EMBED"===a.tagName&&("application/x-shockwave-flash"===a.type&&(dc.topWindow?dc.analytics.push("FLASH"):dc.analytics.push("FLASH_IN_IFRAME")),"html-blob"===OP?a.src="":"acro-html"===OP&&a.setAttribute("src",a.src)),"OBJECT"===a.tagName&&("application/x-shockwave-flash"===a.type&&(dc.topWindow?dc.analytics.push("FLASH"):dc.analytics.push("FLASH_IN_IFRAME")),"html-blob"===OP&&(a.data="",a.type="")),"IFRAME"===a.tagName||"FRAME"===a.tagName)if("acro-html"===OP)a.setAttribute("src",a.src);else{for(c=0;c<window.frames.length;c+=1)window.frames[c]===b.contentWindow&&(b.contentWindow.WINDOW_ID?(dc.iframesToProcess[c]={index:c},a.src=b.contentWindow.WINDOW_ID+".html"):a.src="about:blank");a.name&&a.name.length>256&&(a.name="")}if("A"===a.tagName&&(f=a.getAttribute("href"),f&&0===f.indexOf("/")&&a.setAttribute("href",a.href)),3===a.nodeType&&b.parentNode&&"style"===b.parentNode.tagName.toLowerCase()&&(a.textContent=dc.replaceCssRefs(document.location.origin,a.textContent,-1)),"CANVAS"===a.tagName){d=document.createElement("IMG");try{d.src=b.toDataURL("image/png")}catch(b){dc.analytics.push("TAINTED_CANVAS"),d=document.createElement("DIV"),d.className=a.className}a=d,dc.analytics.push("CANVAS")}return"image"===a.tagName&&!function(a){var d,e,b=a.attributes,c=b.length;for(d=0;d<c;d+=1)e=b[d],"href"!==e.localName&&"src"!==e.localName||a.setAttribute(e.name,dc.getDataURI(null,e.value,-1))}(a),dc.processStyleAttr(a),a},getDocType:function(a){"use strict";function d(a){return a.replace(/[&<>]/g,function(a){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[a]})}var c,b=a.doctype;return null===b?"":(c="<!DOCTYPE "+b.name,b.publicId?c+=' PUBLIC "'+d(b.publicId)+'"':b.systemId&&(c+=" SYSTEM"),d(b.systemId)&&(c+=' "'+b.systemId+'"'),c+">")},htmlTree:function(a){"use strict";function b(a){var b=a.style?a.style.display:"";return"none"!==b.toLowerCase()&&(8!==a.nodeType&&(["BASE","SCRIPT","NOSCRIPT"].indexOf(a.tagName)===-1&&(("LINK"!==a.tagName||!a.rel||a.rel.indexOf("stylesheet")!==-1||a.rel.indexOf("icon")!==-1)&&(("IMG"!==a.tagName||1!==a.width||1!==a.height)&&(("PARAM"!==a.tagName||"application/x-shockwave-flash"!==a.parentElement.type||(dc.topWindow?dc.analytics.push("FLASH"):dc.analytics.push("FLASH_IN_IFRAME"),"html-blob"!==OP))&&("IFRAME"!==a.tagName||!a.src||0!==a.src.indexOf("chrome-extension://")))))))}var c,d,e;if(c=a.cloneNode(!1),c=dc.resolveRefs(c,a),a.hasChildNodes())for(d=a.firstChild;d;)b(d)&&(e=dc.htmlTree(d),c.appendChild(e)),d=d.nextSibling;return c},processIframes:function(){"use strict";var a,b,c;for(a=0;a<dc.iframesToProcess.length;a+=1)b=dc.iframesToProcess[a],b&&!b.promise&&(b.promise=new dc.Deferred,dc.promises.push(b.promise),c={index:a},chrome.runtime.sendMessage({main_op:"relay-msg",index:a,frameID:window.frames[a].WINDOW_ID,parentID:window.WINDOW_ID,tabId:TABID}))},receiveIframe:function(a){"use strict";if("serialize_iframe"===a.html_op&&a.tabId===TABID&&a.parentID===window.WINDOW_ID){dc.analytics=dc.analytics.concat(a.content_analytics),dc.output.refs=dc.output.refs.concat(a.refs);var b=0;a.refs.forEach(dc.wrap(function(a){b+=a.data?a.data.length:0})),dc.output.currentSize+=b,dc.iframesToProcess[a.index].promise.resolve()}},_serialize:function(a){"use strict";function e(){return dc.Deferred.all(dc.promises).done(dc.wrap(function(){dc.processIframes(),dc.promises.length===c?d.resolve():(c=dc.promises.length,e())})),d.promise()}var b,c,d=new dc.Deferred;dc.doc_prefix=a.frameID,b=dc.htmlTree(document.documentElement),c=dc.promises.length,e().then(dc.wrap(function(){var c,d,e,f,g;dc.output.html=dc.getDocType(document)+b.outerHTML.replace(/data\-_html_to_pdf_src_=/gm,"src="),dc.output.html=dc.output.html.replace(/[\u00A0-\uFFFF]/g,function(a){return"&#"+a.charCodeAt(0)+";"}),dc.output.currentSize+=dc.output.html.length;for(c in dc.URIs)if(dc.URIs.hasOwnProperty(c)){if(dc.output.currentSize>1048576*maxSize){d="web2pdfHTMLTooLarge",dc.output.hasError=!0;break}dc.output.refs.push({placeholder:dc.URIs[c].placeholder,type:dc.URIs[c].type,data:dc.URIs[c].data}),dc.URIs[c].data&&(dc.output.currentSize+=dc.URIs[c].data.length)}e=dc.analytics.filter(function(a,b,c){return b===dc.analytics.indexOf(a)}),dc.topWindow?(g=new Date,f=(g.getTime()-dc.cloneTime.start)/100,chrome.extension.sendMessage({progress_op:"html-blob",main_op:OP,blob:dc.output,content_analytics:e,cloneTiming:f,error:d,error_analytics:d}),dc=null):(dc.output.refs.push({placeholder:window.WINDOW_ID+".html",type:"html",data:dc.output.html}),dc.output.currentSize+=dc.output.html.length,dc.output.currentSize>1048576*maxSize&&(d="web2pdfHTMLTooLarge"),g=new Date,f=(g.getTime()-dc.cloneTime.start)/100,chrome.runtime.sendMessage({tabid:TABID,main_op:"relay-msg",complete:!0,index:a.index,refs:dc.output.refs,frameID:window.WINDOW_ID,parentID:a.parentID,content_analytics:e,cloneTiming:f,error:d,error_analytics:d}),dc=null)}))}};dc.Deferred.all=function(a){"use strict";return new dc.Deferred(Promise.all(a))},window.WINDOW_ID=dc.random(),dc.topWindow&&(dc.cloneTime.start=new Date,serialize({frameID:window.WINDOW_ID}));
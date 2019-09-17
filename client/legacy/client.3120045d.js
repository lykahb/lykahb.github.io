import{s as e,n as t,_ as n,a as r,b as s,c as a,i as o,d as c,S as i,e as u,t as l,f,g as p,h,j as v,k as m,l as g,m as d,o as $,p as b,q as y,r as w,u as x,v as E,w as S,x as _,y as k,z as j,A as R,B as P,C as A,D as L,E as C,F as U}from"./chunk.6ef65422.js";import{_ as q,a as N}from"./chunk.60339e6e.js";function O(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,s=!1,a=void 0;try{for(var o,c=e[Symbol.iterator]();!(r=(o=c.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(e){s=!0,a=e}finally{try{r||null==c.return||c.return()}finally{if(s)throw a}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function I(n){var r,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t,a=[];function o(t){if(e(n,t)){if(n=t,!r)return;a.forEach(function(e){return e[1]()}),a.forEach(function(e){return e[0](n)})}}return{set:o,update:function(e){o(e(n))},subscribe:function(e){var c=[e,arguments.length>1&&void 0!==arguments[1]?arguments[1]:t];return a.push(c),1===a.length&&(r=s(o)||t),e(n),function(){var e=a.indexOf(c);-1!==e&&a.splice(e,1),0===a.length&&(r(),r=null)}}}}var D={},H=function(){return{}};function B(e){var n,r,s,a,o,c,i,b,y,w,x,E,S,_,k,j;return{c:function(){n=u("nav"),r=u("ul"),s=u("li"),a=u("a"),o=l("about"),i=f(),b=u("li"),y=u("a"),w=l("blog"),E=f(),S=u("li"),_=u("a"),k=l("projects"),this.h()},l:function(e){n=p(e,"NAV",{class:!0},!1);var t=h(n);r=p(t,"UL",{class:!0},!1);var c=h(r);s=p(c,"LI",{class:!0},!1);var u=h(s);a=p(u,"A",{href:!0,class:!0},!1);var l=h(a);o=v(l,"about"),l.forEach(m),u.forEach(m),i=v(c,"\n\n\t\t\n\t\t"),b=p(c,"LI",{class:!0},!1);var f=h(b);y=p(f,"A",{rel:!0,href:!0,class:!0},!1);var g=h(y);w=v(g,"blog"),g.forEach(m),f.forEach(m),E=v(c,"\n\t\t"),S=p(c,"LI",{class:!0},!1);var d=h(S);_=p(d,"A",{rel:!0,href:!0,class:!0},!1);var $=h(_);k=v($,"projects"),$.forEach(m),d.forEach(m),c.forEach(m),t.forEach(m),this.h()},h:function(){g(a,"href","."),g(a,"class","svelte-10o24wc"),g(s,"class",c=(void 0===e.segment?"selected":"")+" svelte-10o24wc"),g(y,"rel","prefetch"),g(y,"href","blog"),g(y,"class","svelte-10o24wc"),g(b,"class",x=("blog"===e.segment?"selected":"")+" svelte-10o24wc"),g(_,"rel","prefetch"),g(_,"href","projects"),g(_,"class","svelte-10o24wc"),g(S,"class",j=("projects"===e.segment?"selected":"")+" svelte-10o24wc"),g(r,"class","svelte-10o24wc"),g(n,"class","svelte-10o24wc")},m:function(e,t){d(e,n,t),$(n,r),$(r,s),$(s,a),$(a,o),$(r,i),$(r,b),$(b,y),$(y,w),$(r,E),$(r,S),$(S,_),$(_,k)},p:function(e,t){e.segment&&c!==(c=(void 0===t.segment?"selected":"")+" svelte-10o24wc")&&g(s,"class",c),e.segment&&x!==(x=("blog"===t.segment?"selected":"")+" svelte-10o24wc")&&g(b,"class",x),e.segment&&j!==(j=("projects"===t.segment?"selected":"")+" svelte-10o24wc")&&g(S,"class",j)},i:t,o:t,d:function(e){e&&m(n)}}}function J(e,t,n){var r=t.segment;return e.$set=function(e){"segment"in e&&n("segment",r=e.segment)},{segment:r}}var T=function(t){function u(t){var n;return r(this,u),n=s(this,a(u).call(this)),o(c(n),t,J,B,e,["segment"]),n}return n(u,i),u}();function V(e){var t,n,r,s=new T({props:{segment:e.segment}}),a=e.$$slots.default,o=b(a,e,null);return{c:function(){s.$$.fragment.c(),t=f(),n=u("main"),o&&o.c(),this.h()},l:function(e){s.$$.fragment.l(e),t=v(e,"\n\n"),n=p(e,"MAIN",{class:!0},!1);var r=h(n);o&&o.l(r),r.forEach(m),this.h()},h:function(){g(n,"class","svelte-1uhnsl8")},m:function(e,a){y(s,e,a),d(e,t,a),d(e,n,a),o&&o.m(n,null),r=!0},p:function(e,t){var n={};e.segment&&(n.segment=t.segment),s.$set(n),o&&o.p&&e.$$scope&&o.p(w(a,t,e,null),x(a,t,null))},i:function(e){r||(E(s.$$.fragment,e),E(o,e),r=!0)},o:function(e){S(s.$$.fragment,e),S(o,e),r=!1},d:function(e){_(s,e),e&&(m(t),m(n)),o&&o.d(e)}}}function K(e,t,n){var r=t.segment,s=t.$$slots,a=void 0===s?{}:s,o=t.$$scope;return e.$set=function(e){"segment"in e&&n("segment",r=e.segment),"$$scope"in e&&n("$$scope",o=e.$$scope)},{segment:r,$$slots:a,$$scope:o}}var z=function(t){function u(t){var n;return r(this,u),n=s(this,a(u).call(this)),o(c(n),t,K,V,e,["segment"]),n}return n(u,i),u}();function F(e){var t,n,r=e.error.stack;return{c:function(){t=u("pre"),n=l(r)},l:function(e){t=p(e,"PRE",{},!1);var s=h(t);n=v(s,r),s.forEach(m)},m:function(e,r){d(e,t,r),$(t,n)},p:function(e,t){e.error&&r!==(r=t.error.stack)&&k(n,r)},d:function(e){e&&m(t)}}}function G(e){var n,r,s,a,o,c,i,b,y,w=e.error.message;document.title=n=e.status;var x=e.dev&&e.error.stack&&F(e);return{c:function(){r=f(),s=u("h1"),a=l(e.status),o=f(),c=u("p"),i=l(w),b=f(),x&&x.c(),y=j(),this.h()},l:function(t){r=v(t,"\n\n"),s=p(t,"H1",{class:!0},!1);var n=h(s);a=v(n,e.status),n.forEach(m),o=v(t,"\n\n"),c=p(t,"P",{class:!0},!1);var u=h(c);i=v(u,w),u.forEach(m),b=v(t,"\n\n"),x&&x.l(t),y=j(),this.h()},h:function(){g(s,"class","svelte-8od9u6"),g(c,"class","svelte-8od9u6")},m:function(e,t){d(e,r,t),d(e,s,t),$(s,a),d(e,o,t),d(e,c,t),$(c,i),d(e,b,t),x&&x.m(e,t),d(e,y,t)},p:function(e,t){e.status&&n!==(n=t.status)&&(document.title=n),e.status&&k(a,t.status),e.error&&w!==(w=t.error.message)&&k(i,w),t.dev&&t.error.stack?x?x.p(e,t):((x=F(t)).c(),x.m(y.parentNode,y)):x&&(x.d(1),x=null)},i:t,o:t,d:function(e){e&&(m(r),m(s),m(o),m(c),m(b)),x&&x.d(e),e&&m(y)}}}function M(e,t,n){var r=t.status,s=t.error;return e.$set=function(e){"status"in e&&n("status",r=e.status),"error"in e&&n("error",s=e.error)},{status:r,error:s,dev:!1}}var W=function(t){function u(t){var n;return r(this,u),n=s(this,a(u).call(this)),o(c(n),t,M,G,e,["status","error"]),n}return n(u,i),u}();function X(e){var t,n,r=[e.level1.props],s=e.level1.component;function a(e){for(var t={},n=0;n<r.length;n+=1)t=R(t,r[n]);return{props:t}}if(s)var o=new s(a());return{c:function(){o&&o.$$.fragment.c(),t=j()},l:function(e){o&&o.$$.fragment.l(e),t=j()},m:function(e,r){o&&y(o,e,r),d(e,t,r),n=!0},p:function(e,n){var c=e.level1?P(r,[n.level1.props]):{};if(s!==(s=n.level1.component)){if(o){L();var i=o;S(i.$$.fragment,1,function(){_(i)}),C()}s?((o=new s(a())).$$.fragment.c(),E(o.$$.fragment,1),y(o,t.parentNode,t)):o=null}else s&&o.$set(c)},i:function(e){n||(o&&E(o.$$.fragment,e),n=!0)},o:function(e){o&&S(o.$$.fragment,e),n=!1},d:function(e){e&&m(t),o&&_(o,e)}}}function Y(e){var t,n=new W({props:{error:e.error,status:e.status}});return{c:function(){n.$$.fragment.c()},l:function(e){n.$$.fragment.l(e)},m:function(e,r){y(n,e,r),t=!0},p:function(e,t){var r={};e.error&&(r.error=t.error),e.status&&(r.status=t.status),n.$set(r)},i:function(e){t||(E(n.$$.fragment,e),t=!0)},o:function(e){S(n.$$.fragment,e),t=!1},d:function(e){_(n,e)}}}function Q(e){var t,n,r,s,a=[Y,X],o=[];function c(e){return e.error?0:1}return t=c(e),n=o[t]=a[t](e),{c:function(){n.c(),r=j()},l:function(e){n.l(e),r=j()},m:function(e,n){o[t].m(e,n),d(e,r,n),s=!0},p:function(e,s){var i=t;(t=c(s))===i?o[t].p(e,s):(L(),S(o[i],1,function(){o[i]=null}),C(),(n=o[t])||(n=o[t]=a[t](s)).c(),E(n,1),n.m(r.parentNode,r))},i:function(e){s||(E(n),s=!0)},o:function(e){S(n),s=!1},d:function(e){o[t].d(e),e&&m(r)}}}function Z(e){for(var t,n=[{segment:e.segments[0]},e.level0.props],r={$$slots:{default:[Q]},$$scope:{ctx:e}},s=0;s<n.length;s+=1)r=R(r,n[s]);var a=new z({props:r});return{c:function(){a.$$.fragment.c()},l:function(e){a.$$.fragment.l(e)},m:function(e,n){y(a,e,n),t=!0},p:function(e,t){var r=e.segments||e.level0?P(n,[e.segments&&{segment:t.segments[0]},e.level0&&t.level0.props]):{};(e.$$scope||e.error||e.status||e.level1)&&(r.$$scope={changed:e,ctx:t}),a.$set(r)},i:function(e){t||(E(a.$$.fragment,e),t=!0)},o:function(e){S(a.$$.fragment,e),t=!1},d:function(e){_(a,e)}}}function ee(e,t,n){var r=t.stores,s=t.error,a=t.status,o=t.segments,c=t.level0,i=t.level1,u=void 0===i?null:i;return A(D,r),e.$set=function(e){"stores"in e&&n("stores",r=e.stores),"error"in e&&n("error",s=e.error),"status"in e&&n("status",a=e.status),"segments"in e&&n("segments",o=e.segments),"level0"in e&&n("level0",c=e.level0),"level1"in e&&n("level1",u=e.level1)},{stores:r,error:s,status:a,segments:o,level0:c,level1:u}}var te,ne=function(t){function u(t){var n;return r(this,u),n=s(this,a(u).call(this)),o(c(n),t,ee,Z,e,["stores","error","status","segments","level0","level1"]),n}return n(u,i),u}(),re=[/^\/blog.json$/,/^\/blog\/([^\/]+?).json$/],se=[{js:function(){return import("./index.af6fb737.js")},css:["index.af6fb737.css"]},{js:function(){return import("./projects.9b13bcc5.js")},css:[]},{js:function(){return import("./index.d77633d9.js")},css:["index.d77633d9.css"]},{js:function(){return import("./[slug].3d81af84.js")},css:["[slug].3d81af84.css"]}],ae=(te=decodeURIComponent,[{pattern:/^\/$/,parts:[{i:0}]},{pattern:/^\/projects\/?$/,parts:[{i:1}]},{pattern:/^\/blog\/?$/,parts:[{i:2}]},{pattern:/^\/blog\/([^\/]+?)\/?$/,parts:[null,{i:3,params:function(e){return{slug:te(e[1])}}}]}]);function oe(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{replaceState:!1},n=_e(new URL(e,document.baseURI));return n?(xe[t.replaceState?"replaceState":"pushState"]({id:be},"",e),je(n,null).then(function(){})):(location.href=e,new Promise(function(e){}))}var ce,ie,ue,le,fe,pe="undefined"!=typeof __SAPPER__&&__SAPPER__,he=!1,ve=[],me="{}",ge={page:I({}),preloading:I(null),session:I(pe&&pe.session)};ge.session.subscribe(function(){var e=q(N.mark(function e(t){var n,r,s,a,o,c;return N.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(le=t,he){e.next=3;break}return e.abrupt("return");case 3:return fe=!0,n=_e(new URL(location.href)),r=ie={},e.next=8,Ce(n);case 8:if(s=e.sent,a=s.redirect,o=s.props,c=s.branch,r===ie){e.next=14;break}return e.abrupt("return");case 14:return e.next=16,Pe(a,c,o,n.page);case 16:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}());var de,$e=null;var be,ye=1;var we,xe="undefined"!=typeof history?history:{pushState:function(e,t,n){},replaceState:function(e,t,n){},scrollRestoration:""},Ee={};function Se(e){var t=Object.create(null);return e.length>0&&e.slice(1).split("&").forEach(function(e){var n=O(/([^=]*)(?:=(.*))?/.exec(decodeURIComponent(e.replace(/\+/g," "))),3),r=n[1],s=n[2],a=void 0===s?"":s;"string"==typeof t[r]&&(t[r]=[t[r]]),"object"===U(t[r])?t[r].push(a):t[r]=a}),t}function _e(e){if(e.origin!==location.origin)return null;if(!e.pathname.startsWith(pe.baseUrl))return null;var t=e.pathname.slice(pe.baseUrl.length);if(""===t&&(t="/"),!re.some(function(e){return e.test(t)}))for(var n=0;n<ae.length;n+=1){var r=ae[n],s=r.pattern.exec(t);if(s){var a=Se(e.search),o=r.parts[r.parts.length-1],c=o.params?o.params(s):{},i={path:t,query:a,params:c};return{href:e.href,route:r,match:s,page:i}}}}function ke(){return{x:pageXOffset,y:pageYOffset}}function je(e,t,n,r){return Re.apply(this,arguments)}function Re(){return(Re=q(N.mark(function e(t,n,r,s){var a,o,c,i,u,l,f,p,h;return N.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n?be=n:(a=ke(),Ee[be]=a,n=be=++ye,Ee[be]=r?a:{x:0,y:0}),be=n,ce&&ge.preloading.set(!0),o=$e&&$e.href===t.href?$e.promise:Ce(t),$e=null,c=ie={},e.next=8,o;case 8:if(i=e.sent,u=i.redirect,l=i.props,f=i.branch,c===ie){e.next=14;break}return e.abrupt("return");case 14:return e.next=16,Pe(u,f,l,t.page);case 16:document.activeElement&&document.activeElement.blur(),r||(p=Ee[n],s&&(h=document.getElementById(s.slice(1)))&&(p={x:0,y:h.getBoundingClientRect().top}),Ee[be]=p,p&&scrollTo(p.x,p.y));case 18:case"end":return e.stop()}},e)}))).apply(this,arguments)}function Pe(e,t,n,r){return Ae.apply(this,arguments)}function Ae(){return(Ae=q(N.mark(function e(t,n,r,s){var a,o;return N.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!t){e.next=2;break}return e.abrupt("return",oe(t.location,{replaceState:!0}));case 2:if(ge.page.set(s),ge.preloading.set(!1),!ce){e.next=8;break}ce.$set(r),e.next=17;break;case 8:return r.stores={page:{subscribe:ge.page.subscribe},preloading:{subscribe:ge.preloading.subscribe},session:ge.session},e.next=11,ue;case 11:if(e.t0=e.sent,r.level0={props:e.t0},a=document.querySelector("#sapper-head-start"),o=document.querySelector("#sapper-head-end"),a&&o){for(;a.nextSibling!==o;)Oe(a.nextSibling);Oe(a),Oe(o)}ce=new ne({target:de,props:r,hydrate:!0});case 17:ve=n,me=JSON.stringify(s.query),he=!0,fe=!1;case 21:case"end":return e.stop()}},e)}))).apply(this,arguments)}function Le(e,t,n,r){if(r!==me)return!0;var s=ve[e];return!!s&&(t!==s.segment||(!(!s.match||JSON.stringify(s.match.slice(1,e+2))===JSON.stringify(n.slice(1,e+2)))||void 0))}function Ce(e){return Ue.apply(this,arguments)}function Ue(){return(Ue=q(N.mark(function e(t){var n,r,s,a,o,c,i,u,l,f,p;return N.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.route,r=t.page,s=r.path.split("/").filter(Boolean),a=null,o={error:null,status:200,segments:[s[0]]},c={fetch:function(e){function t(t,n){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e,t){return fetch(e,t)}),redirect:function(e,t){if(a&&(a.statusCode!==e||a.location!==t))throw new Error("Conflicting redirects");a={statusCode:e,location:t}},error:function(e,t){o.error="string"==typeof t?new Error(t):t,o.status=e}},ue||(ue=pe.preloaded[0]||H.call(c,{path:r.path,query:r.query,params:{}},le)),u=1,e.prev=7,l=JSON.stringify(r.query),f=n.pattern.exec(r.path),p=!1,e.next=13,Promise.all(n.parts.map(function(){var e=q(N.mark(function e(n,a){var i,h,v,m,g,d;return N.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(i=s[a],Le(a,i,f,l)&&(p=!0),o.segments[u]=s[a+1],n){e.next=5;break}return e.abrupt("return",{segment:i});case 5:if(h=u++,fe||p||!ve[a]||ve[a].part!==n.i){e.next=8;break}return e.abrupt("return",ve[a]);case 8:return p=!1,e.next=11,Ne(se[n.i]);case 11:if(v=e.sent,m=v.default,g=v.preload,!he&&pe.preloaded[a+1]){e.next=25;break}if(!g){e.next=21;break}return e.next=18,g.call(c,{path:r.path,query:r.query,params:n.params?n.params(t.match):{}},le);case 18:e.t0=e.sent,e.next=22;break;case 21:e.t0={};case 22:d=e.t0,e.next=26;break;case 25:d=pe.preloaded[a+1];case 26:return e.abrupt("return",o["level".concat(h)]={component:m,props:d,segment:i,match:f,part:n.i});case 27:case"end":return e.stop()}},e)}));return function(t,n){return e.apply(this,arguments)}}()));case 13:i=e.sent,e.next=21;break;case 16:e.prev=16,e.t0=e.catch(7),o.error=e.t0,o.status=500,i=[];case 21:return e.abrupt("return",{redirect:a,props:o,branch:i});case 22:case"end":return e.stop()}},e,null,[[7,16]])}))).apply(this,arguments)}function qe(e){var t="client/".concat(e);if(!document.querySelector('link[href="'.concat(t,'"]')))return new Promise(function(e,n){var r=document.createElement("link");r.rel="stylesheet",r.href=t,r.onload=function(){return e()},r.onerror=n,document.head.appendChild(r)})}function Ne(e){var t="string"==typeof e.css?[]:e.css.map(qe);return t.unshift(e.js()),Promise.all(t).then(function(e){return e[0]})}function Oe(e){e.parentNode.removeChild(e)}function Ie(e){var t=_e(new URL(e,document.baseURI));if(t)return $e&&e===$e.href||function(e,t){$e={href:e,promise:t}}(e,Ce(t)),$e.promise}function De(e){clearTimeout(we),we=setTimeout(function(){He(e)},20)}function He(e){var t=Je(e.target);t&&"prefetch"===t.rel&&Ie(t.href)}function Be(e){if(1===function(e){return null===e.which?e.button:e.which}(e)&&!(e.metaKey||e.ctrlKey||e.shiftKey||e.defaultPrevented)){var t=Je(e.target);if(t&&t.href){var n="object"===U(t.href)&&"SVGAnimatedString"===t.href.constructor.name,r=String(n?t.href.baseVal:t.href);if(r!==location.href){if(!t.hasAttribute("download")&&"external"!==t.getAttribute("rel")&&(n?!t.target.baseVal:!t.target)){var s=new URL(r);if(s.pathname!==location.pathname||s.search!==location.search){var a=_e(s);if(a)je(a,null,t.hasAttribute("sapper-noscroll"),s.hash),e.preventDefault(),xe.pushState({id:be},"",s.href)}}}else location.hash||e.preventDefault()}}}function Je(e){for(;e&&"A"!==e.nodeName.toUpperCase();)e=e.parentNode;return e}function Te(e){if(Ee[be]=ke(),e.state){var t=_e(new URL(location.href));t?je(t,e.state.id):location.href=location.href}else(function(e){be=e})(ye=ye+1),xe.replaceState({id:be},"",location.href)}!function(e){var t;"scrollRestoration"in xe&&(xe.scrollRestoration="manual"),t=e.target,de=t,addEventListener("click",Be),addEventListener("popstate",Te),addEventListener("touchstart",He),addEventListener("mousemove",De),Promise.resolve().then(function(){var e=location,t=e.hash,n=e.href;xe.replaceState({id:ye},"",n);var r,s,a,o,c,i,u,l=new URL(location.href);if(pe.error)return r=location,s=r.pathname,a=r.search,o=pe.session,c=pe.preloaded,i=pe.status,u=pe.error,ue||(ue=c&&c[0]),void Pe(null,[],{error:u,status:i,session:o,level0:{props:ue},level1:{props:{status:i,error:u},component:W},segments:c},{path:s,query:Se(a),params:{}});var f=_e(l);return f?je(f,ye,!0,t):void 0})}({target:document.querySelector("#sapper")});
//# sourceMappingURL=client.3120045d.js.map

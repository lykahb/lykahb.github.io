import{s as e,n as t,S as s,i as r,e as n,t as o,a,c as l,b as c,d as i,f as u,g as p,h as f,j as m,k as h,m as g,l as d,o as v,p as $,q as b,r as y,u as w,v as E,w as S,x as _,y as R,z as j,A as P}from"./chunk.bfc73b9a.js";function x(s,r=t){let n;const o=[];function a(t){if(e(s,t)){if(s=t,!n)return;o.forEach(e=>e[1]()),o.forEach(e=>e[0](s))}}return{set:a,update:function(e){a(e(s))},subscribe:function(e,l=t){const c=[e,l];return o.push(c),1===o.length&&(n=r(a)||t),e(s),()=>{const e=o.indexOf(c);-1!==e&&o.splice(e,1),0===o.length&&(n(),n=null)}}}}const L={},A=()=>({});function C(e){var s,r,h,g,d,v,$,b,y,w,E,S,_,R,j,P;return{c(){s=n("nav"),r=n("ul"),h=n("li"),g=n("a"),d=o("about"),$=a(),b=n("li"),y=n("a"),w=o("blog"),S=a(),_=n("li"),R=n("a"),j=o("projects"),this.h()},l(e){s=l(e,"NAV",{class:!0},!1);var t=c(s);r=l(t,"UL",{class:!0},!1);var n=c(r);h=l(n,"LI",{class:!0},!1);var o=c(h);g=l(o,"A",{href:!0,class:!0},!1);var a=c(g);d=i(a,"about"),a.forEach(u),o.forEach(u),$=i(n,"\n\n\t\t\n\t\t"),b=l(n,"LI",{class:!0},!1);var p=c(b);y=l(p,"A",{rel:!0,href:!0,class:!0},!1);var f=c(y);w=i(f,"blog"),f.forEach(u),p.forEach(u),S=i(n,"\n\t\t"),_=l(n,"LI",{class:!0},!1);var m=c(_);R=l(m,"A",{rel:!0,href:!0,class:!0},!1);var v=c(R);j=i(v,"projects"),v.forEach(u),m.forEach(u),n.forEach(u),t.forEach(u),this.h()},h(){p(g,"href","."),p(g,"class","svelte-10o24wc"),p(h,"class",v=(void 0===e.segment?"selected":"")+" svelte-10o24wc"),p(y,"rel","prefetch"),p(y,"href","blog"),p(y,"class","svelte-10o24wc"),p(b,"class",E=("blog"===e.segment?"selected":"")+" svelte-10o24wc"),p(R,"rel","prefetch"),p(R,"href","projects"),p(R,"class","svelte-10o24wc"),p(_,"class",P=("projects"===e.segment?"selected":"")+" svelte-10o24wc"),p(r,"class","svelte-10o24wc"),p(s,"class","svelte-10o24wc")},m(e,t){f(e,s,t),m(s,r),m(r,h),m(h,g),m(g,d),m(r,$),m(r,b),m(b,y),m(y,w),m(r,S),m(r,_),m(_,R),m(R,j)},p(e,t){e.segment&&v!==(v=(void 0===t.segment?"selected":"")+" svelte-10o24wc")&&p(h,"class",v),e.segment&&E!==(E=("blog"===t.segment?"selected":"")+" svelte-10o24wc")&&p(b,"class",E),e.segment&&P!==(P=("projects"===t.segment?"selected":"")+" svelte-10o24wc")&&p(_,"class",P)},i:t,o:t,d(e){e&&u(s)}}}function U(e,t,s){let{segment:r}=t;return e.$set=(e=>{"segment"in e&&s("segment",r=e.segment)}),{segment:r}}class q extends s{constructor(t){super(),r(this,t,U,C,e,["segment"])}}function N(e){var t,s,r,o=new q({props:{segment:e.segment}});const m=e.$$slots.default,w=h(m,e,null);return{c(){o.$$.fragment.c(),t=a(),s=n("main"),w&&w.c(),this.h()},l(e){o.$$.fragment.l(e),t=i(e,"\n\n"),s=l(e,"MAIN",{class:!0},!1);var r=c(s);w&&w.l(r),r.forEach(u),this.h()},h(){p(s,"class","svelte-1uhnsl8")},m(e,n){g(o,e,n),f(e,t,n),f(e,s,n),w&&w.m(s,null),r=!0},p(e,t){var s={};e.segment&&(s.segment=t.segment),o.$set(s),w&&w.p&&e.$$scope&&w.p(d(m,t,e,null),v(m,t,null))},i(e){r||($(o.$$.fragment,e),$(w,e),r=!0)},o(e){b(o.$$.fragment,e),b(w,e),r=!1},d(e){y(o,e),e&&(u(t),u(s)),w&&w.d(e)}}}function O(e,t,s){let{segment:r}=t,{$$slots:n={},$$scope:o}=t;return e.$set=(e=>{"segment"in e&&s("segment",r=e.segment),"$$scope"in e&&s("$$scope",o=e.$$scope)}),{segment:r,$$slots:n,$$scope:o}}class k extends s{constructor(t){super(),r(this,t,O,N,e,["segment"])}}function I(e){var t,s,r=e.error.stack;return{c(){t=n("pre"),s=o(r)},l(e){t=l(e,"PRE",{},!1);var n=c(t);s=i(n,r),n.forEach(u)},m(e,r){f(e,t,r),m(t,s)},p(e,t){e.error&&r!==(r=t.error.stack)&&w(s,r)},d(e){e&&u(t)}}}function D(e){var s,r,h,g,d,v,$,b,y,S=e.error.message;document.title=s=e.status;var _=e.dev&&e.error.stack&&I(e);return{c(){r=a(),h=n("h1"),g=o(e.status),d=a(),v=n("p"),$=o(S),b=a(),_&&_.c(),y=E(),this.h()},l(t){r=i(t,"\n\n"),h=l(t,"H1",{class:!0},!1);var s=c(h);g=i(s,e.status),s.forEach(u),d=i(t,"\n\n"),v=l(t,"P",{class:!0},!1);var n=c(v);$=i(n,S),n.forEach(u),b=i(t,"\n\n"),_&&_.l(t),y=E(),this.h()},h(){p(h,"class","svelte-8od9u6"),p(v,"class","svelte-8od9u6")},m(e,t){f(e,r,t),f(e,h,t),m(h,g),f(e,d,t),f(e,v,t),m(v,$),f(e,b,t),_&&_.m(e,t),f(e,y,t)},p(e,t){e.status&&s!==(s=t.status)&&(document.title=s),e.status&&w(g,t.status),e.error&&S!==(S=t.error.message)&&w($,S),t.dev&&t.error.stack?_?_.p(e,t):((_=I(t)).c(),_.m(y.parentNode,y)):_&&(_.d(1),_=null)},i:t,o:t,d(e){e&&(u(r),u(h),u(d),u(v),u(b)),_&&_.d(e),e&&u(y)}}}function H(e,t,s){let{status:r,error:n}=t;return e.$set=(e=>{"status"in e&&s("status",r=e.status),"error"in e&&s("error",n=e.error)}),{status:r,error:n,dev:!1}}class J extends s{constructor(t){super(),r(this,t,H,D,e,["status","error"])}}function V(e){var t,s,r=[e.level1.props],n=e.level1.component;function o(e){let t={};for(var s=0;s<r.length;s+=1)t=S(t,r[s]);return{props:t}}if(n)var a=new n(o());return{c(){a&&a.$$.fragment.c(),t=E()},l(e){a&&a.$$.fragment.l(e),t=E()},m(e,r){a&&g(a,e,r),f(e,t,r),s=!0},p(e,s){var l=e.level1?_(r,[s.level1.props]):{};if(n!==(n=s.level1.component)){if(a){j();const e=a;b(e.$$.fragment,1,()=>{y(e)}),P()}n?((a=new n(o())).$$.fragment.c(),$(a.$$.fragment,1),g(a,t.parentNode,t)):a=null}else n&&a.$set(l)},i(e){s||(a&&$(a.$$.fragment,e),s=!0)},o(e){a&&b(a.$$.fragment,e),s=!1},d(e){e&&u(t),a&&y(a,e)}}}function B(e){var t,s=new J({props:{error:e.error,status:e.status}});return{c(){s.$$.fragment.c()},l(e){s.$$.fragment.l(e)},m(e,r){g(s,e,r),t=!0},p(e,t){var r={};e.error&&(r.error=t.error),e.status&&(r.status=t.status),s.$set(r)},i(e){t||($(s.$$.fragment,e),t=!0)},o(e){b(s.$$.fragment,e),t=!1},d(e){y(s,e)}}}function K(e){var t,s,r,n,o=[B,V],a=[];function l(e){return e.error?0:1}return t=l(e),s=a[t]=o[t](e),{c(){s.c(),r=E()},l(e){s.l(e),r=E()},m(e,s){a[t].m(e,s),f(e,r,s),n=!0},p(e,n){var c=t;(t=l(n))===c?a[t].p(e,n):(j(),b(a[c],1,()=>{a[c]=null}),P(),(s=a[t])||(s=a[t]=o[t](n)).c(),$(s,1),s.m(r.parentNode,r))},i(e){n||($(s),n=!0)},o(e){b(s),n=!1},d(e){a[t].d(e),e&&u(r)}}}function T(e){var t,s=[{segment:e.segments[0]},e.level0.props];let r={$$slots:{default:[K]},$$scope:{ctx:e}};for(var n=0;n<s.length;n+=1)r=S(r,s[n]);var o=new k({props:r});return{c(){o.$$.fragment.c()},l(e){o.$$.fragment.l(e)},m(e,s){g(o,e,s),t=!0},p(e,t){var r=e.segments||e.level0?_(s,[e.segments&&{segment:t.segments[0]},e.level0&&t.level0.props]):{};(e.$$scope||e.error||e.status||e.level1)&&(r.$$scope={changed:e,ctx:t}),o.$set(r)},i(e){t||($(o.$$.fragment,e),t=!0)},o(e){b(o.$$.fragment,e),t=!1},d(e){y(o,e)}}}function z(e,t,s){let{stores:r,error:n,status:o,segments:a,level0:l,level1:c=null}=t;return R(L,r),e.$set=(e=>{"stores"in e&&s("stores",r=e.stores),"error"in e&&s("error",n=e.error),"status"in e&&s("status",o=e.status),"segments"in e&&s("segments",a=e.segments),"level0"in e&&s("level0",l=e.level0),"level1"in e&&s("level1",c=e.level1)}),{stores:r,error:n,status:o,segments:a,level0:l,level1:c}}class G extends s{constructor(t){super(),r(this,t,z,T,e,["stores","error","status","segments","level0","level1"])}}const M=[/^\/blog.json$/,/^\/blog\/([^\/]+?).json$/],W=[{js:()=>import("./index.4374d7ec.js"),css:["index.4374d7ec.css"]},{js:()=>import("./projects.72e466e2.js"),css:[]},{js:()=>import("./index.e8e9b8bd.js"),css:["index.e8e9b8bd.css"]},{js:()=>import("./[slug].97bf9666.js"),css:["[slug].97bf9666.css"]}],X=(e=>[{pattern:/^\/$/,parts:[{i:0}]},{pattern:/^\/projects\/?$/,parts:[{i:1}]},{pattern:/^\/blog\/?$/,parts:[{i:2}]},{pattern:/^\/blog\/([^\/]+?)\/?$/,parts:[null,{i:3,params:t=>({slug:e(t[1])})}]}])(decodeURIComponent);const Y="undefined"!=typeof __SAPPER__&&__SAPPER__;let F,Q,Z,ee=!1,te=[],se="{}";const re={page:x({}),preloading:x(null),session:x(Y&&Y.session)};let ne,oe;re.session.subscribe(async e=>{if(ne=e,!ee)return;oe=!0;const t=me(new URL(location.href)),s=Q={},{redirect:r,props:n,branch:o}=await ve(t);s===Q&&await de(r,o,n,t.page)});let ae,le=null;let ce,ie=1;const ue="undefined"!=typeof history?history:{pushState:(e,t,s)=>{},replaceState:(e,t,s)=>{},scrollRestoration:""},pe={};function fe(e){const t=Object.create(null);return e.length>0&&e.slice(1).split("&").forEach(e=>{let[,s,r=""]=/([^=]*)(?:=(.*))?/.exec(decodeURIComponent(e.replace(/\+/g," ")));"string"==typeof t[s]&&(t[s]=[t[s]]),"object"==typeof t[s]?t[s].push(r):t[s]=r}),t}function me(e){if(e.origin!==location.origin)return null;if(!e.pathname.startsWith(Y.baseUrl))return null;let t=e.pathname.slice(Y.baseUrl.length);if(""===t&&(t="/"),!M.some(e=>e.test(t)))for(let s=0;s<X.length;s+=1){const r=X[s],n=r.pattern.exec(t);if(n){const s=fe(e.search),o=r.parts[r.parts.length-1],a=o.params?o.params(n):{},l={path:t,query:s,params:a};return{href:e.href,route:r,match:n,page:l}}}}function he(){return{x:pageXOffset,y:pageYOffset}}async function ge(e,t,s,r){if(t)ce=t;else{const e=he();pe[ce]=e,t=ce=++ie,pe[ce]=s?e:{x:0,y:0}}ce=t,F&&re.preloading.set(!0);const n=le&&le.href===e.href?le.promise:ve(e);le=null;const o=Q={},{redirect:a,props:l,branch:c}=await n;if(o===Q&&(await de(a,c,l,e.page),document.activeElement&&document.activeElement.blur(),!s)){let e=pe[t];if(r){const t=document.getElementById(r.slice(1));t&&(e={x:0,y:t.getBoundingClientRect().top})}pe[ce]=e,e&&scrollTo(e.x,e.y)}}async function de(e,t,s,r){if(e)return function(e,t={replaceState:!1}){const s=me(new URL(e,document.baseURI));return s?(ue[t.replaceState?"replaceState":"pushState"]({id:ce},"",e),ge(s,null).then(()=>{})):(location.href=e,new Promise(e=>{}))}(e.location,{replaceState:!0});if(re.page.set(r),re.preloading.set(!1),F)F.$set(s);else{s.stores={page:{subscribe:re.page.subscribe},preloading:{subscribe:re.preloading.subscribe},session:re.session},s.level0={props:await Z};const e=document.querySelector("#sapper-head-start"),t=document.querySelector("#sapper-head-end");if(e&&t){for(;e.nextSibling!==t;)be(e.nextSibling);be(e),be(t)}F=new G({target:ae,props:s,hydrate:!0})}te=t,se=JSON.stringify(r.query),ee=!0,oe=!1}async function ve(e){const{route:t,page:s}=e,r=s.path.split("/").filter(Boolean);let n=null;const o={error:null,status:200,segments:[r[0]]},a={fetch:(e,t)=>fetch(e,t),redirect:(e,t)=>{if(n&&(n.statusCode!==e||n.location!==t))throw new Error("Conflicting redirects");n={statusCode:e,location:t}},error:(e,t)=>{o.error="string"==typeof t?new Error(t):t,o.status=e}};let l;Z||(Z=Y.preloaded[0]||A.call(a,{path:s.path,query:s.query,params:{}},ne));let c=1;try{const n=JSON.stringify(s.query),i=t.pattern.exec(s.path);let u=!1;l=await Promise.all(t.parts.map(async(t,l)=>{const p=r[l];if(function(e,t,s,r){if(r!==se)return!0;const n=te[e];return!!n&&(t!==n.segment||!(!n.match||JSON.stringify(n.match.slice(1,e+2))===JSON.stringify(s.slice(1,e+2)))||void 0)}(l,p,i,n)&&(u=!0),o.segments[c]=r[l+1],!t)return{segment:p};const f=c++;if(!oe&&!u&&te[l]&&te[l].part===t.i)return te[l];u=!1;const{default:m,preload:h}=await function(e){const t="string"==typeof e.css?[]:e.css.map($e);return t.unshift(e.js()),Promise.all(t).then(e=>e[0])}(W[t.i]);let g;return g=ee||!Y.preloaded[l+1]?h?await h.call(a,{path:s.path,query:s.query,params:t.params?t.params(e.match):{}},ne):{}:Y.preloaded[l+1],o[`level${f}`]={component:m,props:g,segment:p,match:i,part:t.i}}))}catch(e){o.error=e,o.status=500,l=[]}return{redirect:n,props:o,branch:l}}function $e(e){const t=`client/${e}`;if(!document.querySelector(`link[href="${t}"]`))return new Promise((e,s)=>{const r=document.createElement("link");r.rel="stylesheet",r.href=t,r.onload=(()=>e()),r.onerror=s,document.head.appendChild(r)})}function be(e){e.parentNode.removeChild(e)}function ye(e){const t=me(new URL(e,document.baseURI));if(t)return le&&e===le.href||function(e,t){le={href:e,promise:t}}(e,ve(t)),le.promise}let we;function Ee(e){clearTimeout(we),we=setTimeout(()=>{Se(e)},20)}function Se(e){const t=Re(e.target);t&&"prefetch"===t.rel&&ye(t.href)}function _e(e){if(1!==function(e){return null===e.which?e.button:e.which}(e))return;if(e.metaKey||e.ctrlKey||e.shiftKey)return;if(e.defaultPrevented)return;const t=Re(e.target);if(!t)return;if(!t.href)return;const s="object"==typeof t.href&&"SVGAnimatedString"===t.href.constructor.name,r=String(s?t.href.baseVal:t.href);if(r===location.href)return void(location.hash||e.preventDefault());if(t.hasAttribute("download")||"external"===t.getAttribute("rel"))return;if(s?t.target.baseVal:t.target)return;const n=new URL(r);if(n.pathname===location.pathname&&n.search===location.search)return;const o=me(n);if(o){ge(o,null,t.hasAttribute("sapper-noscroll"),n.hash),e.preventDefault(),ue.pushState({id:ce},"",n.href)}}function Re(e){for(;e&&"A"!==e.nodeName.toUpperCase();)e=e.parentNode;return e}function je(e){if(pe[ce]=he(),e.state){const t=me(new URL(location.href));t?ge(t,e.state.id):location.href=location.href}else(function(e){ce=e})(ie=ie+1),ue.replaceState({id:ce},"",location.href)}!function(e){var t;"scrollRestoration"in ue&&(ue.scrollRestoration="manual"),t=e.target,ae=t,addEventListener("click",_e),addEventListener("popstate",je),addEventListener("touchstart",Se),addEventListener("mousemove",Ee),Promise.resolve().then(()=>{const{hash:e,href:t}=location;ue.replaceState({id:ie},"",t);const s=new URL(location.href);if(Y.error)return function(e){const{pathname:t,search:s}=location,{session:r,preloaded:n,status:o,error:a}=Y;Z||(Z=n&&n[0]),de(null,[],{error:a,status:o,session:r,level0:{props:Z},level1:{props:{status:o,error:a},component:J},segments:n},{path:t,query:fe(s),params:{}})}();const r=me(s);return r?ge(r,ie,!0,e):void 0})}({target:document.querySelector("#sapper")});
//# sourceMappingURL=client.b06100f5.js.map

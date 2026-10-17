/**
 * 부흥프로젝트 · 전체 HTML 페이지 공통 맨 위로 가기 버튼
 * Cloudflare Pages Functions middleware; original HTML and existing routes are retained.
 * https://developers.cloudflare.com/pages/functions/middleware/
 */
const BACK_TO_TOP_STYLE = `<style id="revival-back-to-top-style">
#revival-back-to-top{position:fixed;right:22px;bottom:24px;z-index:9997;width:43px;height:43px;display:flex;align-items:center;justify-content:center;border:1px solid #c9dad2;border-radius:50%;background:#fff;color:#216f69;box-shadow:0 5px 18px rgba(24,59,70,.18);cursor:pointer;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(6px);transition:opacity .2s,transform .2s,visibility .2s;line-height:1;-webkit-tap-highlight-color:transparent}
#revival-back-to-top.is-visible{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}
#revival-back-to-top:hover{background:#216f69;color:#fff;border-color:#216f69}
#revival-back-to-top:focus-visible{outline:3px solid #b69661;outline-offset:3px}
#revival-back-to-top svg{display:block;width:19px;height:19px}
@media(max-width:600px){#revival-back-to-top{right:14px;bottom:17px;width:40px;height:40px}}
@media(prefers-reduced-motion:reduce){#revival-back-to-top{transition:none}}
</style>`;

const BACK_TO_TOP_SCRIPT = `<script id="revival-back-to-top-script">
(function(){'use strict';
  if(document.getElementById('revival-back-to-top'))return;
  var btn=document.createElement('button');
  btn.type='button';
  btn.id='revival-back-to-top';
  btn.setAttribute('aria-label','화면 맨 위로 이동');
  btn.title='맨 위로';
  btn.tabIndex=-1;
  btn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 14 6-6 6 6"/><path d="M12 9v11"/></svg>';
  document.body.appendChild(btn);
  function update(){
    var show=(window.scrollY||document.documentElement.scrollTop||0)>260;
    btn.classList.toggle('is-visible',show);
    btn.tabIndex=show?0:-1;
  }
  btn.addEventListener('click',function(){
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  });
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('pageshow',update);
  update();
})();
</script>`;

export async function onRequest(context) {
  // Existing Pages Functions (e.g. prayer-share) and all static assets retain their usual behavior.
  const response=await context.next();
  const type=response.headers.get('content-type') || '';
  if(context.request.method !== 'GET' || response.status !== 200 || !/text\/html/i.test(type)) {
    return response;
  }
  return new HTMLRewriter()
    .on('head',{element(element){element.append(BACK_TO_TOP_STYLE,{html:true});}})
    .on('body',{element(element){element.append(BACK_TO_TOP_SCRIPT,{html:true});}})
    .transform(response);
}

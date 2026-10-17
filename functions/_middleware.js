/**
 * 부흥프로젝트 — 모든 HTML 페이지 공통 '맨 위로' 버튼
 * 기존의 페이지별 버튼은 유지하고, 그 페이지에는 공통 버튼을 추가하지 않습니다.
 * 업로드 위치: GitHub 저장소 functions/_middleware.js (기존 파일 교체)
 */

// 기존 HTML에 자체 '맨 위로' 버튼/링크가 있는 페이지.
// 일부는 DOMContentLoaded 후에 버튼을 만들므로 서버 단계에서 반드시 제외합니다.
const PAGES_WITH_NATIVE_TOP_BUTTON = new Set([
  'buchanan-holy-spirit-summary.html',
  'edwards-balanced-revival.html',
  'edwards-creation-end.html',
  'haykin-revival-reading.html',
  'lloyd-jones-revival.html',
  'lovelace-renewal-summary.html',
  'revival-prayers.html',
  'spurgeon-prayer-for-revival-reading.html',
]);

const BACK_TO_TOP_STYLE = `<style id="revival-back-to-top-style">
#revival-back-to-top{position:fixed;right:22px;bottom:24px;z-index:9997;width:43px;height:43px;display:flex;align-items:center;justify-content:center;border:1px solid #c9dad2;border-radius:50%;background:#fff;color:#216f69;box-shadow:0 5px 18px rgba(24,59,70,.18);cursor:pointer;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(6px);transition:opacity .2s,transform .2s,visibility .2s;line-height:1;-webkit-tap-highlight-color:transparent}
#revival-back-to-top.is-visible{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}
#revival-back-to-top:hover{background:#216f69;color:#fff;border-color:#216f69}
#revival-back-to-top:focus-visible{outline:3px solid #b69661;outline-offset:3px}
#revival-back-to-top svg{display:block;width:19px;height:19px}
@media(max-width:600px){#revival-back-to-top{right:14px;bottom:17px;width:40px;height:40px}}
@media(prefers-reduced-motion:reduce){#revival-back-to-top{transition:none}}
@media print{#revival-back-to-top{display:none!important}}
</style>`;

const BACK_TO_TOP_SCRIPT = `<script id="revival-back-to-top-script">
(function(){'use strict';
  if(document.getElementById('revival-back-to-top'))return;

  // 향후 다른 페이지에 고유 버튼이 추가되어도 중복 생성하지 않습니다.
  var nativeSelectors=[
    '#backToTop','#backTop','#back-top','#go-top','#to-top','#scroll-top-button',
    '.scroll-top-button','button.to-top','button.go-top','button.backtop',
    'a.top-link','a.top[href="#"]','[data-back-to-top]',
    'button[aria-label*="맨 위"]','a[aria-label*="맨 위"]',
    'button[aria-label*="위로 이동"]','a[aria-label*="위로 이동"]',
    'button[title*="맨 위"]','a[title*="맨 위"]'
  ].join(',');
  function hasNativeButton(){return !!document.querySelector(nativeSelectors);}
  if(hasNativeButton())return;

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
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  });
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('pageshow',update);
  update();

  // 이미 등록된 스크립트가 지연 실행되어 자체 버튼을 생성할 때에도 중복을 제거합니다.
  if(typeof MutationObserver==='function'){
    var watch=new MutationObserver(function(){
      if(hasNativeButton()){btn.remove();watch.disconnect();}
    });
    watch.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('load',function(){
      if(hasNativeButton()){btn.remove();watch.disconnect();}
      else window.setTimeout(function(){watch.disconnect();},5000);
    },{once:true});
  }
})();
</script>`;

export async function onRequest(context) {
  const response=await context.next();
  const type=response.headers.get('content-type') || '';
  if(context.request.method !== 'GET' || response.status !== 200 || !/text\/html/i.test(type)){
    return response;
  }

  const url=new URL(context.request.url);
  const page=url.pathname.replace(/\/+$/,'').split('/').pop().toLowerCase();
  if(PAGES_WITH_NATIVE_TOP_BUTTON.has(page))return response;

  // 메인 화면에 iframe으로 포함된 연대표에는 별도 버튼을 만들지 않습니다.
  if(page==='revival-sermon-timeline.html' && url.searchParams.get('embed')==='1')return response;

  return new HTMLRewriter()
    .on('head',{element(element){element.append(BACK_TO_TOP_STYLE,{html:true});}})
    .on('body',{element(element){element.append(BACK_TO_TOP_SCRIPT,{html:true});}})
    .transform(response);
}

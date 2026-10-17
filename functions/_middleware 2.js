/**
 * 부흥프로젝트 · 전체 페이지 화면 맨 위로 이동 링크 (2026-10-17)
 * 위치: /functions/_middleware.js
 * 목적: 버튼 누락 방지, 자체 버튼과 공통 버튼 중복 제거.
 * 원본 HTML 파일/서브페이지의 기존 기능은 수정하지 않습니다.
 */

// 기존 버튼이 실제 존재하는 페이지의 고유 선택자를 숨깁니다.
// 기존 요소를 삭제하지 않고 CSS로만 숨겨 페이지 안의 이벤트 코드가 정상 동작하게 합니다.
const OLD_TOP_BUTTONS = Object.freeze({
  'buchanan-holy-spirit-summary.html': '#to-top',
  'edwards-balanced-revival.html': '#backTop',
  'edwards-creation-end.html': '#back-top',
  'haykin-revival-reading.html': 'a.top-link',
  'lloyd-jones-revival.html': '#backToTop',
  'revival-prayers.html': '#go-top',
  'spurgeon-prayer-for-revival-reading.html': 'a.top[href="#"]',
  // 매우 큰 도서 요약 페이지: 이름이 다른 옛 위로가기 요소도 숨김.
  'lovelace-renewal-summary.html': '#backToTop,#backTop,#back-top,#go-top,#to-top,.backtop,.to-top,.go-top,a.top-link,a.top[href="#"],button[aria-label*="맨 위"],a[aria-label*="맨 위"],button[title*="맨 위"],a[title*="맨 위"]'
});

const GLOBAL_TOP_CSS = `
<style id="revival-top-link-css">
html{scroll-behavior:smooth}
#revival-back-to-top{position:fixed!important;right:20px;bottom:22px;z-index:2147483640;display:flex!important;align-items:center;justify-content:center;width:44px;height:44px;box-sizing:border-box;border:1px solid #c1d7cc;border-radius:50%;background:#fff;color:#216f69!important;text-decoration:none!important;font:800 25px/1 Arial,sans-serif;box-shadow:0 4px 18px rgba(24,59,70,.18);opacity:1!important;visibility:visible!important;pointer-events:auto!important;cursor:pointer;transition:background-color .15s,color .15s;-webkit-tap-highlight-color:transparent}
#revival-back-to-top:hover{background:#216f69;color:#fff!important}
#revival-back-to-top:focus-visible{outline:3px solid #b69661;outline-offset:3px}
@media(max-width:600px){#revival-back-to-top{right:12px;bottom:14px;width:40px;height:40px;font-size:24px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}#revival-back-to-top{transition:none}}
@media print{#revival-back-to-top{display:none!important}}
</style>`;

// <a href="#">는 JavaScript가 꺼지거나 인라인 스크립트가 차단되어도 작동합니다.
const GLOBAL_TOP_LINK = `<a href="#" id="revival-back-to-top" aria-label="화면 맨 위로 이동" title="맨 위로" data-revival-common-top="1">↑</a>`;

// JavaScript가 허용되면 URL의 현재 #책목차 위치를 유지하면서 부드럽게 맨 위로 이동합니다.
// JS가 작동하지 않는 경우 위의 기본 href="#"가 대신 작동합니다.
const OPTIONAL_SCRIPT = `<script id="revival-top-link-enhance">(function(){
  var link=document.getElementById('revival-back-to-top');
  if(!link)return;
  link.addEventListener('click',function(event){
    event.preventDefault();
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    window.scrollTo({top:0,behavior:reduced?'auto':'smooth'});
  });
})();</script>`;

export async function onRequest(context) {
  const response=await context.next();
  const contentType=response.headers.get('content-type')||'';
  if(context.request.method!=='GET'||response.status!==200||!/text\/html/i.test(contentType))return response;

  const url=new URL(context.request.url);
  const page=url.pathname.replace(/\/+$/,'').split('/').pop().toLowerCase()||'index.html';

  // 메인 홈페이지의 연대표를 iframe으로 표시할 때는 iframe 내부에 버튼을 붙이지 않습니다.
  // 단독으로 방문한 연대표 페이지에는 정상적으로 추가됩니다.
  if(page==='revival-sermon-timeline.html'&&url.searchParams.get('embed')==='1')return response;

  const oldSelector=OLD_TOP_BUTTONS[page];
  const hideOld=oldSelector?`<style id="revival-hide-old-top">${oldSelector}{display:none!important;visibility:hidden!important}</style>`:'';

  return new HTMLRewriter()
    .on('head',{element(element){element.append(GLOBAL_TOP_CSS+hideOld,{html:true});}})
    .on('body',{element(element){element.append(GLOBAL_TOP_LINK+OPTIONAL_SCRIPT,{html:true});}})
    .transform(response);
}
